<?php

namespace App\Http\Controllers;

use App\Models\TimeCapsule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class TimeCapsuleController extends Controller
{
    // Show list page via Inertia
    public function index()
    {
        $capsules = TimeCapsule::all();
            return response()->json($capsules);

        $capsules = TimeCapsule::where('user_id', Auth::id())
            ->orderBy('reveal_date', 'asc')
            ->get()
            ->map(function ($capsule) {
                return [
                    'id'                => $capsule->id,
                    'title'             => $capsule->title,
                    'description'       => $capsule->description,
                    'public'            => $capsule->public,
                    'revealed'          => $capsule->revealed,
                    'reveal_date'       => $capsule->reveal_date,
                    'reveal_date_human' => $capsule->reveal_date
                        ? $capsule->reveal_date->format('Y-m-d H:i')
                        : null,
                ];
            });

        return Inertia::render('Capsules/Index', [
            'capsules' => $capsules,
        ]);
    }

    // Create a new capsule
   public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'contents' => 'required|array',
                'reveal_date' => 'required|date',
                'recipients' => 'nullable|array',
                'public' => 'nullable|boolean',
            ]);

            $capsule = TimeCapsule::create([
                'user_id' => 1,
                'title' => $validated['title'],
                'description' => $validated['description'],
                'contents' => json_encode($validated['contents']),
                'bury_date' => now(),
                'reveal_date' => $validated['reveal_date'],
                'recipients' => isset($validated['recipients']) ? json_encode($validated['recipients']) : null,
                'public' => $validated['public'] ?? false,
                'revealed' => false,
                'visible' => false,
            ]);

            return response()->json($capsule, 201);
            
        } catch (\Exception $e) {
            Log::error('Capsule creation error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to create capsule',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show(TimeCapsule $timeCapsule)
    {
        return response()->json($timeCapsule);
    }

    // Show edit form
    public function edit(TimeCapsule $timeCapsule)
    {
        abort_unless($timeCapsule->user_id === Auth::id(), 403);

        return Inertia::render('Capsules/Edit', [
            'capsule' => $timeCapsule,
        ]);
    }

    // Update capsule
    public function update(Request $request, TimeCapsule $timeCapsule)
    {
        abort_unless($timeCapsule->user_id === Auth::id(), 403);

        $data = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'reveal_date'  => 'required|date',
            'public'       => 'boolean',
        ]);

        $timeCapsule->update([
            'title'       => $data['title'],
            'description' => $data['description'] ?? null,
            'reveal_date' => $data['reveal_date'],
            'public'      => $data['public'] ?? false,
        ]);

        return redirect()->route('time-capsules.index');
    }

    // Delete a capsule (only owner)
    public function destroy(TimeCapsule $timeCapsule)
    {
        abort_unless($timeCapsule->user_id === Auth::id(), 403);

        $timeCapsule->delete();

        return redirect()->route('time-capsules.index');
    }

    
}
