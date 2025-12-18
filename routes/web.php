<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TimeCapsuleController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'auth' => ['user' => auth()->user()],
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard', [
            'auth' => ['user' => auth()->user()],
        ]);
    })->name('dashboard');

    Route::get('/test-csrf', function () {
    return response()->json([
        'csrf_token' => csrf_token(),
        'session_id' => session()->getId(),
    ]);
});


    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Time Capsule Routes
    Route::get('/capsules', [TimeCapsuleController::class, 'index'])->name('capsules.index');
    Route::get('/capsules/{id}', [TimeCapsuleController::class, 'show'])->name('capsules.show');
    Route::get('/capsules/{id}/edit', [TimeCapsuleController::class, 'edit'])->name('capsules.edit');
});

require __DIR__.'/auth.php';