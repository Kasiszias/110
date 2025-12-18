<?php

namespace App\Services;

use App\Models\TimeCapsule;
use App\Models\CapsuleArtifact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TimeCapsuleService
{
    /**
     * Process and create a new time capsule with artifacts.
     */
    public function createTimeCapsule(array $validatedData): array
    {
        $requestId = Str::uuid()->toString();
        
        Log::info("Time capsule creation started", [
            'request_id' => $requestId,
            'artifacts_count' => count($validatedData['artifacts'] ?? [])
        ]);

        try {
            // Start database transaction
            DB::beginTransaction();
            
            // Create the capsule
            $capsule = $this->createCapsule($validatedData);
            
            // Process artifacts
            $artifactsResult = $this->processArtifacts($capsule, $validatedData['artifacts'] ?? [], $requestId);
            
            // Commit transaction
            DB::commit();
            
            // Load relationships for response
            $capsule->load('artifacts');
            
            Log::info("Time capsule creation completed successfully", [
                'request_id' => $requestId,
                'capsule_id' => $capsule->id,
                'artifacts_processed' => $artifactsResult['processed_count'],
                'total_artifacts' => $artifactsResult['total_count']
            ]);

            return [
                'success' => true,
                'message' => "Time capsule '{$capsule->title}' sealed successfully with {$artifactsResult['processed_count']} artifacts!",
                'capsule' => [
                    'id' => $capsule->id,
                    'title' => $capsule->title,
                    'description' => $capsule->description,
                    'reveal_date' => $capsule->reveal_date->format('Y-m-d'),
                    'message' => $capsule->message,
                    'artifacts_count' => $capsule->artifacts->count(),
                    'is_public' => $capsule->is_public,
                    'created_at' => $capsule->created_at->format('Y-m-d H:i:s'),
                ],
                'stats' => [
                    'total_artifacts_requested' => $artifactsResult['total_count'],
                    'artifacts_processed' => $artifactsResult['processed_count'],
                    'artifacts_with_files' => $capsule->artifacts->whereNotNull('media_path')->count(),
                    'request_id' => $requestId,
                ]
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Time capsule creation failed', [
                'request_id' => $requestId,
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
                'title' => $validatedData['title'] ?? 'Unknown',
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to create time capsule. Please check your input and try again.',
                'error' => config('app.debug') ? $e->getMessage() : null,
                'request_id' => $requestId,
                'troubleshooting' => $this->getTroubleshootingTips()
            ];
        }
    }

    /**
     * Create the time capsule model.
     */
    protected function createCapsule(array $validatedData): TimeCapsule
    {
        return TimeCapsule::create([
            'user_id' => Auth::id(), // NULL for guests
            'title' => trim($validatedData['title']),
            'description' => trim($validatedData['description'] ?? ''),
            'reveal_date' => $validatedData['reveal_date'],
            'is_public' => $validatedData['is_public'] ?? false,
            'email_recipients' => $validatedData['email_recipients']
                ? json_decode($validatedData['email_recipients'], true)
                : null,
            'message' => trim($validatedData['message'] ?? ''),
        ]);
    }

    /**
     * Process and create artifacts for a capsule.
     */
    protected function processArtifacts(TimeCapsule $capsule, array $artifactsData, string $requestId): array
    {
        $artifactsResult = [
            'total_count' => count($artifactsData),
            'processed_count' => 0,
            'artifacts_data' => []
        ];

        if (empty($artifactsData)) {
            return $artifactsResult;
        }

        foreach ($artifactsData as $index => $artifactData) {
            try {
                $mediaPath = $this->processArtifactFile($artifactData['file'] ?? null, $requestId, $index);
                
                $artifact = $this->createArtifactRecord($capsule, $artifactData, $mediaPath, $index);
                
                $artifactsResult['artifacts_data'][] = $artifact;
                $artifactsResult['processed_count']++;
                
                // Log progress every 5 artifacts
                if ($artifactsResult['processed_count'] % 5 === 0) {
                    Log::info("Artifacts processing progress", [
                        'request_id' => $requestId,
                        'processed' => $artifactsResult['processed_count'],
                        'total' => $artifactsResult['total_count']
                    ]);
                }

            } catch (\Exception $e) {
                Log::warning('Error processing artifact', [
                    'request_id' => $requestId,
                    'artifact_index' => $index,
                    'error' => $e->getMessage(),
                    'file_name' => $artifactData['file']->getClientOriginalName() ?? 'unknown'
                ]);
                // Continue with next artifact
            }
        }

        // Bulk insert artifacts
        if (!empty($artifactsResult['artifacts_data'])) {
            try {
                CapsuleArtifact::insert($artifactsResult['artifacts_data']);
                Log::info("Artifacts bulk inserted", [
                    'request_id' => $requestId,
                    'count' => count($artifactsResult['artifacts_data'])
                ]);
            } catch (\Exception $e) {
                Log::error('Bulk insert failed', [
                    'request_id' => $requestId,
                    'error' => $e->getMessage()
                ]);
                throw $e;
            }
        }

        return $artifactsResult;
    }

    /**
     * Process artifact file upload.
     */
    protected function processArtifactFile($file, string $requestId, int $index): ?string
    {
        if (!$file || !$file instanceof \Illuminate\Http\UploadedFile) {
            return null;
        }

        try {
            // Validate file
            if (!$file->isValid()) {
                throw new \Exception('Invalid file upload');
            }
            
            // Check file size
            $maxSize = config('capsule.max_file_size_mb', 20) * 1024 * 1024;
            if ($file->getSize() > $maxSize) {
                throw new \Exception('File size exceeds ' . config('capsule.max_file_size_mb', 20) . 'MB limit');
            }

            $mediaPath = $file->store(config('capsule.storage_path', 'capsule_artifacts'), 'public');
            
            Log::info("File uploaded successfully", [
                'request_id' => $requestId, 
                'artifact_index' => $index,
                'file_name' => $file->getClientOriginalName(),
                'media_path' => $mediaPath
            ]);
            
            return $mediaPath;

        } catch (\Exception $e) {
            Log::warning('File upload failed for artifact', [
                'request_id' => $requestId,
                'artifact_index' => $index,
                'error' => $e->getMessage(),
                'file_name' => $file->getClientOriginalName() ?? 'unknown'
            ]);
            
            // Continue without the file but keep the artifact
            return null;
        }
    }

    /**
     * Create individual artifact record data.
     */
    protected function createArtifactRecord(TimeCapsule $capsule, array $artifactData, ?string $mediaPath, int $index): array
    {
        $artifactType = trim($artifactData['type'] ?? 'Personal Memory');
        $title = trim($artifactData['title'] ?? 'Untitled Artifact');
        $description = trim($artifactData['description'] ?? '');
        $year = $artifactData['year'] ?? date('Y');

        $content = [
            'title' => $title,
            'description' => $description,
            'year' => $year,
            'type' => $artifactType,
            'original_index' => $index,
        ];

        return [
            'capsule_id' => $capsule->id,
            'title' => $title,
            'content' => $content,
            'artifact_type' => $artifactType,
            'year' => $year,
            'media_path' => $mediaPath,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    /**
     * Get troubleshooting tips for error responses.
     */
    protected function getTroubleshootingTips(): array
    {
        return [
            'check_file_sizes' => 'Ensure all files are under ' . config('capsule.max_file_size_mb', 20) . 'MB',
            'check_artifacts_count' => 'Limit to ' . config('capsule.max_artifacts', 50) . ' artifacts maximum',
            'check_connection' => 'Ensure stable internet connection',
            'try_again' => 'If issue persists, try with fewer artifacts'
        ];
    }
}