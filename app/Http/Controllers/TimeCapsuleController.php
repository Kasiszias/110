<?php

namespace App\Http\Controllers;

use App\Models\TimeCapsule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TimeCapsuleController extends Controller
{
    // List current user's capsules
    public function index()
    {
    $capsules = TimeCapsule::where('user_id', Auth::id())
        ->orderBy('reveal_date', 'asc')
        ->get();

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

        $capsule = TimeCapsule::create([
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

        return response()->json($capsule, 201);
    }

    // Delete a capsule (only owner)
    public function destroy(TimeCapsule $timeCapsule)
    {
        abort_unless($timeCapsule->user_id === Auth::id(), 403);

        $timeCapsule->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
