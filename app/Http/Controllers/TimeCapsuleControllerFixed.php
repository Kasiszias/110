<?php

namespace App\Http\Controllers;

use App\Models\TimeCapsule;
use App\Http\Requests\StoreTimeCapsuleRequest;
use App\Services\TimeCapsuleService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TimeCapsuleControllerFixed extends Controller
{
    protected TimeCapsuleService $capsuleService;

    public function __construct(TimeCapsuleService $capsuleService)
    {
        $this->capsuleService = $capsuleService;
    }

    /**
     * Store a new time capsule (ALLOW GUESTS)
     * 
     * Uses the TimeCapsuleService for clean, maintainable code
     */
    public function store(StoreTimeCapsuleRequest $request)
    {
        $validated = $request->validated();
        
        $result = $this->capsuleService->createTimeCapsule($validated);

        $statusCode = $result['success'] ? 201 : 500;
        return response()->json($result, $statusCode);
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