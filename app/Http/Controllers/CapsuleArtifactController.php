<?php

namespace App\Http\Controllers;

use App\Models\CapsuleArtifact;
use App\Models\TimeCapsule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CapsuleArtifactController extends Controller
{
    // Show one capsule + its artifacts
    public function show(TimeCapsule $timeCapsule)
    {
        abort_unless($timeCapsule->user_id === Auth::id(), 403);

        $timeCapsule->load(['artifacts' => function ($q) {
            $q->orderBy('year', 'asc')->orderBy('layer_z_index', 'asc');
        }]);

        return Inertia::render('Capsules/Show', [
            'capsule'   => $timeCapsule,
            'artifacts' => $timeCapsule->artifacts,
        ]);
    }

    // Store new artifact
    public function store(Request $request, TimeCapsule $timeCapsule)
    {
        abort_unless($timeCapsule->user_id === Auth::id(), 403);

        $data = $request->validate([
            'type'          => 'required|in:personal,historical,future',
            'title'         => 'required|string|max:255',
            'content'       => 'required|string',
            'year'          => 'nullable|integer',
            'layer_z_index' => 'nullable|integer',
        ]);

        CapsuleArtifact::create([
            'capsule_id'    => $timeCapsule->id,
            'type'          => $data['type'],
            'title'         => $data['title'],
            'content'       => $data['content'],
            'year'          => $data['year'] ?? 0,
            'metadata'      => [],
            'layer_z_index' => $data['layer_z_index'] ?? 0,
        ]);

        return redirect()->route('capsules.show', $timeCapsule->id);
    }

    // Update artifact (NEW)
    public function update(Request $request, TimeCapsule $timeCapsule, CapsuleArtifact $artifact)
    {
        abort_unless($timeCapsule->user_id === Auth::id(), 403);
        abort_unless($artifact->capsule_id === $timeCapsule->id, 403);

        $data = $request->validate([
            'type'          => 'required|in:personal,historical,future',
            'title'         => 'required|string|max:255',
            'content'       => 'required|string',
            'year'          => 'nullable|integer',
            'layer_z_index' => 'nullable|integer',
        ]);

        $artifact->update([
            'type'          => $data['type'],
            'title'         => $data['title'],
            'content'       => $data['content'],
            'year'          => $data['year'] ?? 0,
            'layer_z_index' => $data['layer_z_index'] ?? 0,
        ]);

        return redirect()->route('capsules.show', $timeCapsule->id);
    }

    // Delete artifact
    public function destroy(TimeCapsule $timeCapsule, CapsuleArtifact $artifact)
    {
        abort_unless($timeCapsule->user_id === Auth::id(), 403);
        abort_unless($artifact->capsule_id === $timeCapsule->id, 403);

        $artifact->delete();

        return redirect()->route('capsules.show', $timeCapsule->id);
    }
}
