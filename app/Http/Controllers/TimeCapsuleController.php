<?php

namespace App\Http\Controllers;

use App\Models\TimeCapsule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TimeCapsuleController extends Controller
{
    // Show list page via Inertia
    public function index()
    {
        $capsules = TimeCapsule::where('user_id', Auth::id())
            ->orderBy('reveal_date', 'asc')
            ->get()
            ->map(function ($capsule) {
                return [
                    'id'                => $capsule->id,
                    'title'             => $capsule->title,
                    'description'       => $capsule->description,
                    'public'            => $capsule->public,
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
        $data = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'reveal_date'  => 'required|date',
            'bury_date'    => 'nullable|date',
            'recipients'   => 'nullable|array',
            'recipients.*' => 'email',
            'public'       => 'boolean',
        ]);

        TimeCapsule::create([
            'user_id'     => Auth::id(),
            'title'       => $data['title'],
            'description' => $data['description'] ?? null,
            'reveal_date' => $data['reveal_date'],
            'bury_date'   => $data['bury_date'] ?? now(),
            'recipients'  => $data['recipients'] ?? [],
            'public'      => $data['public'] ?? false,
            'contents'    => [],
            'revealed'    => false,
            'visible'     => false,
        ]);

        return redirect()->route('time-capsules.index');
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
