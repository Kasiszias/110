<?php

namespace App\Http\Controllers;

use App\Models\CapsuleArtifact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CapsuleArtifactController extends Controller
{
    /**
     * Store artifact
     */
    public function store(Request $request, $capsuleId)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|string',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'year' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {

            $artifact = CapsuleArtifact::create([
                'capsule_id' => $capsuleId,
                'title' => $request->title,
                'content' => $request->content,
                'artifact_type' => $request->type,
                'year' => $request->year ?? date('Y'),
                'media_path' => $request->file ?? null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Artifact added successfully',
                'artifact' => $artifact
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add artifact',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete artifact
     */
    public function destroy($id)
    {
        $artifact = CapsuleArtifact::with('capsule')->findOrFail($id);


        // Check if user owns the capsule
        if ($artifact->capsule->user_id !== \Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $artifact->delete();

        return response()->json([
            'success' => true,
            'message' => 'Artifact deleted successfully'
        ]);
    }
}