<?php

namespace App\Http\Controllers;

use App\Models\TimeCapsule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TimeCapsuleController extends Controller
{
    /**
     * Store a new time capsule (ALLOW GUESTS) - Optimized for performance
     */
    public function store(Request $request)
    {
        // Set longer timeout for file processing
        set_time_limit(300); // 5 minutes timeout

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'reveal_date' => 'required|date|after:now',
            'is_public' => 'sometimes|boolean',
            'message' => 'nullable|string',
            'email_recipients' => 'nullable|json',
            'artifacts' => 'nullable|array|max:50', // Limit artifacts to prevent abuse
            'artifacts.*.title' => 'nullable|string|max:255',
            'artifacts.*.description' => 'nullable|string',
            'artifacts.*.year' => 'nullable|integer',
            'artifacts.*.type' => 'nullable|string',
            'artifacts.*.file' => 'nullable|file|max:10240', // 10MB max per file
        ]);

        try {
            // Create capsule (with or without user_id)
            $capsule = TimeCapsule::create([
                'user_id' => Auth::id(), // NULL for guests
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'reveal_date' => $validated['reveal_date'],
                'is_public' => $validated['is_public'] ?? false,
                'email_recipients' => $validated['email_recipients']
                    ? json_decode($validated['email_recipients'], true)
                    : null,
            ]);

            // Process artifacts in batches to prevent memory issues
            if (isset($validated['artifacts']) && is_array($validated['artifacts'])) {
                $artifactsData = [];

                foreach ($validated['artifacts'] as $index => $artifactData) {
                    $mediaPath = null;

                    // Handle file upload with error handling
                    if (isset($artifactData['file']) && $artifactData['file'] instanceof \Illuminate\Http\UploadedFile) {
                        try {
                            $mediaPath = $artifactData['file']->store('capsule_artifacts', 'public');
                        } catch (\Exception $e) {
                            // Log error but continue with other artifacts
                            \Log::error('File upload failed for artifact ' . $index, [
                                'error' => $e->getMessage(),
                                'file_name' => $artifactData['file']->getClientOriginalName()
                            ]);
                            continue; // Skip this artifact
                        }
                    }

                    $artifactType = $artifactData['type'] ?? 'Personal Memory';

                    $content = [
                        'title' => $artifactData['title'] ?? 'Untitled',
                        'description' => $artifactData['description'] ?? '',
                        'year' => $artifactData['year'] ?? date('Y'),
                        'type' => $artifactType,
                    ];

                    $artifactsData[] = [
                        'capsule_id' => $capsule->id,
                        'title' => $artifactData['title'] ?? 'Untitled',
                        'content' => $content,
                        'artifact_type' => $artifactType,
                        'year' => $artifactData['year'] ?? date('Y'),
                        'media_path' => $mediaPath,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                // Bulk insert artifacts for better performance
                if (!empty($artifactsData)) {
                    $capsule->artifacts()->insert($artifactsData);
                }
            }

            // Load the capsule with artifacts for response
            $capsule->load('artifacts');

            return response()->json([
                'success' => true,
                'message' => 'Time capsule created successfully.',
                'capsule' => $capsule,
            ], 201);

        } catch (\Exception $e) {
            // Log the error
            \Log::error('Capsule creation failed', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
                'title' => $validated['title'] ?? 'Unknown'
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create time capsule. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get a specific capsule for the authenticated user.
     */
    public function show($id)
    {
        $capsule = TimeCapsule::with('artifacts')
            ->where('user_id', Auth::id())
            ->findOrFail($id);

        return Inertia::render('Capsules/Show', [
            'capsule' => $capsule,
            'is_locked' => now()->isBefore($capsule->reveal_date),
        ]);
    }

    /**
     * Show the form for editing a capsule.
     */
    public function edit($id)
    {
        $capsule = TimeCapsule::where('user_id', Auth::id())
            ->with('artifacts')
            ->findOrFail($id);

        if (now()->isAfter($capsule->reveal_date)) {
            return redirect()->route('capsules.show', $id)
                ->with('error', 'Cannot edit a revealed capsule.');
        }

        return Inertia::render('Capsules/Edit', [
            'capsule' => $capsule,
        ]);
    }

    /**
     * Update a capsule.
     */
    public function update(Request $request, $id)
    {
        $capsule = TimeCapsule::where('user_id', Auth::id())->findOrFail($id);

        if (now()->isAfter($capsule->reveal_date)) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot update a revealed capsule.',
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'reveal_date' => 'sometimes|date|after:now',
            'is_public' => 'sometimes|boolean',
        ]);

        $capsule->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Capsule updated successfully.',
            'capsule' => $capsule,
        ]);
    }

    /**
     * Delete a capsule and its artifacts.
     */
    public function destroy($id)
    {
        $capsule = TimeCapsule::where('user_id', Auth::id())->findOrFail($id);

        foreach ($capsule->artifacts as $artifact) {
            if ($artifact->media_path) {
                Storage::disk('public')->delete($artifact->media_path);
            }
        }

        $capsule->artifacts()->delete();
        $capsule->delete();

        return response()->json([
            'success' => true,
            'message' => 'Capsule deleted successfully.',
        ]);
    }
}