<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TimeCapsuleController;
use App\Http\Controllers\CapsuleArtifactController;
use App\Http\Controllers\WeatherHistoryController;
use App\Http\Controllers\NewspaperController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;

// Main landing page
Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('capsules.index');
    }
    return view('welcome');
})->name('home');

// Guest routes (only accessible when NOT logged in)
Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
    
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);
});

// Authenticated routes (only accessible when logged in)
Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    
    // Main app route
    Route::get('capsules', function () {
        return view('app');
    })->name('capsules.index');
    
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Time capsules
    Route::get('/time-capsules', [TimeCapsuleController::class, 'index'])->name('time-capsules.index');
    Route::post('/time-capsules', [TimeCapsuleController::class, 'store'])->name('time-capsules.store');
    Route::get('/time-capsules/{timeCapsule}/edit', [TimeCapsuleController::class, 'edit'])->name('time-capsules.edit');
    Route::put('/time-capsules/{timeCapsule}', [TimeCapsuleController::class, 'update'])->name('time-capsules.update');
    Route::delete('/time-capsules/{timeCapsule}', [TimeCapsuleController::class, 'destroy'])->name('time-capsules.destroy');
    
    // Capsule artifacts
    Route::get('/time-capsules/{timeCapsule}', [CapsuleArtifactController::class, 'show'])
        ->name('capsules.show');
    Route::post('/time-capsules/{timeCapsule}/artifacts', [CapsuleArtifactController::class, 'store'])
        ->name('capsules.artifacts.store');
    Route::put('/time-capsules/{timeCapsule}/artifacts/{artifact}', [CapsuleArtifactController::class, 'update'])
        ->name('capsules.artifacts.update');
    Route::delete('/time-capsules/{timeCapsule}/artifacts/{artifact}', [CapsuleArtifactController::class, 'destroy'])
        ->name('capsules.artifacts.destroy');
    
    // Historical events API
    Route::get('/api/history', function (\Illuminate\Http\Request $request) {
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
    })->name('api.history');
    
    // Historical weather API
    Route::get('/weather/history', [WeatherHistoryController::class, 'show'])
        ->name('weather.history');
        
    Route::get('/api/newspapers', [NewspaperController::class, 'index'])
        ->name('api.newspapers');
});

// Debug route - remove after testing
Route::get('/debug-auth', function () {
    return [
        'authenticated' => Auth::check(),
        'user' => Auth::user() ? Auth::user()->email : null,
        'session_driver' => config('session.driver'),
        'users_count' => \App\Models\User::count(),
    ];
});