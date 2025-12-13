<?php

use App\Http\Controllers\TimeCapsuleController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;

// Time Capsule API
Route::get('/capsules', [TimeCapsuleController::class, 'index']);
Route::post('/capsules', [TimeCapsuleController::class, 'store']);
Route::get('/capsules/{timeCapsule}', [TimeCapsuleController::class, 'show']);
Route::put('/capsules/{timeCapsule}', [TimeCapsuleController::class, 'update']);
Route::delete('/capsules/{timeCapsule}', [TimeCapsuleController::class, 'destroy']);

// Historical events
Route::get('/history', function (\Illuminate\Http\Request $request) {
    $month = $request->query('month');
    $day   = $request->query('day');

    if (! $month || ! $day) {
        return response()->json(['error' => 'month and day are required'], 422);
    }

    $response = Http::get("https://byabbe.se/on-this-day/{$month}/{$day}/events.json");

    if ($response->failed()) {
        return response()->json(['error' => 'History API unavailable'], 502);
    }

    $data = $response->json();

    $events = collect($data['events'] ?? [])
        ->take(10)
        ->map(function ($event) {
            return [
                'year'        => $event['year'] ?? null,
                'description' => $event['description'] ?? null,
                'wikipedia'   => isset($event['wikipedia'][0]['wikipedia'])
                    ? $event['wikipedia'][0]['wikipedia']
                    : null,
            ];
        })
        ->values();

    return response()->json([
        'requested_month' => $month,
        'requested_day'   => $day,
        'date'            => $data['date'] ?? null,
        'events'          => $events,
    ]);
});