<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TimeCapsuleController;
use App\Http\Controllers\CapsuleArtifactController;
use App\Http\Controllers\WeatherHistoryController;
use App\Http\Controllers\NewspaperController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('capsules.index');
    }
    return view('welcome');
})->name('home')->middleware('web'); // Only web middleware

// Guest routes (redirect to capsules if already logged in)
Route::middleware(['web', 'guest'])->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
    
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);
});

// Authenticated routes
Route::middleware(['web', 'auth'])->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
    
    Route::get('capsules', function () {
        return view('app');
    })->name('capsules.index');
});

Route::get('/debug-home', function () {
    return [
        'authenticated' => Auth::check(),
        'user' => Auth::user(),
        'welcome_exists' => view()->exists('welcome'),
        'app_exists' => view()->exists('app'),
    ];
});

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});

Route::middleware('guest')->group(function () {
    // Login routes
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
    
    // Register routes
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);
});

// Authenticated routes (only accessible when logged in)
Route::middleware('auth')->group(function () {
    // Logout
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Home/Landing page - Show welcome page to guests, redirect logged-in users
Route::get('/', function () {
    if (Auth::check()) {
        // If logged in, go to capsules
        return redirect()->route('capsules.index');
    }
    // If not logged in, show welcome page (NOT redirect to login)
    return view('welcome');
})->name('home');

// Guest routes (only when NOT logged in)
Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
    
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);
});

// Authenticated routes (only when logged in)
Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
    
    Route::get('capsules', function () {
        return view('app');
    })->name('capsules.index');
});

Route::middleware('auth')->group(function () {
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

    // Historical weather API (city + date, Open-Meteo)
    Route::get('/weather/history', [WeatherHistoryController::class, 'show'])
        ->name('weather.history');

    Route::get('/api/newspapers', [NewspaperController::class, 'index'])
    ->name('api.newspapers');

    // Main route - show the frontend
Route::get('/', function () {
    return view('capsules.index');
})->name('home');

// Alternative route
Route::get('/capsules', function () {
        return view('app'); // ← Changed from 'index' to 'app'
    })->name('capsules.index');
});

Route::get('/', function () {
    // Use Auth::check() instead of auth()->check()
    if (Auth::check()) {
        return redirect()->route('capsules.index');
    }
    return view('welcome');
})->name('home');

Route::get('/', function () {
    if (Auth::check()) {
        return redirect('/capsules');
    }
    return view('welcome');
})->name('home');

// Guest routes (login/register)
Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
    
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);
});

// Protected routes (require authentication)
Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    Route::get('capsules', fn() => view('app'))->name('capsules.index');
});

require __DIR__.'/auth.php';
