<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TimeCapsuleController;
use App\Http\Controllers\EconomicDataController;
use App\Http\Controllers\NewspaperController;
use App\Http\Controllers\WeatherHistoryController;

/**
 * AUTHENTICATION MIDDLEWARE
 */
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

/**
 * HISTORICAL EVENTS API - Using NYTimes Archive API
 */
Route::get('/history', function (Request $request) {
    $year = (int) $request->query('year', date('Y'));
    $month = (int) $request->query('month', date('n'));
    
    try {
        // Use NYTimes Archive API for historical news
        $response = Http::timeout(10)
            ->get("https://api.nytimes.com/svc/archive/v1/{$year}/{$month}.json");

        if ($response->successful()) {
            $json = $response->json();
            $articles = $json['response']['docs'] ?? [];
            
            // Transform articles to historical events format
            $events = collect($articles)
                ->take(10)
                ->map(function ($article) use ($year) {
                    return [
                        'year' => $year,
                        'text' => $article['headline']['main'] ?? 'No title available',
                        'description' => $article['abstract'] ?? 'No description available',
                        'wikipedia' => 'NYTimes Archive',
                        'link' => $article['web_url'] ?? null,
                        'date_context' => $article['pub_date'] ?? (string)$year,
                        'creator' => implode(', ', $article['byline']['person'] ?? []),
                        'type' => 'news_event',
                    ];
                })
                ->values();

            return response()->json([
                'success' => true,
                'events' => $events,
                'source' => 'NYTimes Archive API',
                'year' => $year,
                'month' => $month,
                'total_articles' => count($articles)
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Unable to fetch historical events from NYTimes API'
        ], 502);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Historical events API error: ' . $e->getMessage()
        ], 500);
    }
});

/**
 * ECONOMIC DATA APIs - Using Alpha Vantage API
 */

// GDP Data - using IBM stock as economic proxy
Route::get('/economic/gdp', [EconomicDataController::class, 'gdp']);

// Inflation Data - using Alpha Vantage
Route::get('/economic/inflation', [EconomicDataController::class, 'inflation']);

// Stock Market Data - using Alpha Vantage
Route::get('/economic/stocks', [EconomicDataController::class, 'stocks']);

/**
 * WEATHER ARCHIVE API - Using Open-Meteo Archive API
 */
Route::get('/weather', function (Request $request) {
    $city = $request->query('city', 'New York');
    $date = $request->query('date', date('Y-m-d'));
    
    // Use WeatherHistoryController
    $controller = new WeatherHistoryController();
    $request = Request::create("/api/weather", 'GET', [
        'city' => $city,
        'date' => $date
    ]);
    
    return $controller->show($request);
});

/**
 * Monthly Weather Data
 */
Route::get('/weather/monthly', function (Request $request) {
    $city = $request->query('city', 'New York');
    $year = (int) $request->query('year', date('Y'));
    $month = (int) $request->query('month', date('n'));
    
    // Use WeatherHistoryController
    $controller = new WeatherHistoryController();
    $request = Request::create("/api/weather/monthly", 'GET', [
        'city' => $city,
        'year' => $year,
        'month' => $month
    ]);
    
    return $controller->monthly($request);
});

/**
 * HISTORICAL NEWS API - Using NYTimes Archive API
 */
Route::get('/newspapers', function (Request $request) {
    $year = (int) $request->query('year', date('Y'));
    $month = (int) $request->query('month', date('n'));
    
    // Use NewspaperController
    $controller = new NewspaperController();
    $request = Request::create("/api/newspapers", 'GET', [
        'year' => $year,
        'month' => $month
    ]);
    
    return $controller->index($request);
});

/**
 * CAPSULES API ROUTES
 */

// Public capsules list
Route::get('/capsules', function (Request $request) {
    try {
        $publicCapsules = \App\Models\TimeCapsule::where('is_public', true)
            ->with('artifacts')
            ->where('reveal_date', '<=', now())
            ->orderBy('reveal_date', 'desc')
            ->take(20)
            ->get()
            ->map(function ($capsule) {
                return [
                    'id' => $capsule->id,
                    'title' => $capsule->title,
                    'description' => $capsule->description,
                    'reveal_date' => $capsule->reveal_date,
                    'created_at' => $capsule->created_at,
                    'is_public' => $capsule->is_public,
                    'is_locked' => false,
                    'artifacts_count' => $capsule->artifacts->count(),
                    'artifacts' => $capsule->artifacts->map(function ($artifact) {
                        return [
                            'id' => $artifact->id,
                            'title' => $artifact->title,
                            'type' => $artifact->type,
                            'contents' => $artifact->contents,
                        ];
                    }),
                ];
            });

        return response()->json([
            'success' => true,
            'capsules' => $publicCapsules,
            'total' => $publicCapsules->count(),
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error fetching capsules',
            'error' => $e->getMessage(),
        ], 500);
    }
});

// User's personal capsules
Route::get('/my-capsules', function (Request $request) {
    if (!Auth::check()) {
        return response()->json([
            'success' => false,
            'message' => 'Authentication required',
        ], 401);
    }

    try {
        $capsules = \App\Models\TimeCapsule::where('user_id', Auth::id())
            ->with('artifacts')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($capsule) {
                return [
                    'id' => $capsule->id,
                    'title' => $capsule->title,
                    'description' => $capsule->description,
                    'reveal_date' => $capsule->reveal_date,
                    'created_at' => $capsule->created_at,
                    'is_public' => $capsule->is_public,
                    'is_locked' => now()->isBefore($capsule->reveal_date),
                    'artifacts_count' => $capsule->artifacts->count(),
                    'artifacts' => $capsule->artifacts,
                ];
            });

        return response()->json([
            'success' => true,
            'capsules' => $capsules,
            'total' => $capsules->count(),
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error fetching user capsules',
            'error' => $e->getMessage(),
        ], 500);
    }
});


// Authenticated Capsule CRUD Operations
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/capsules', [TimeCapsuleController::class, 'store']);
    Route::get('/capsules/{id}', [TimeCapsuleController::class, 'show']);
    Route::put('/capsules/{id}', [TimeCapsuleController::class, 'update']);
    Route::delete('/capsules/{id}', [TimeCapsuleController::class, 'destroy']);
});

/**
 * UTILITY ENDPOINTS
 */

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'apis' => [
            'history' => 'Historical events from NYTimes Archive API',
            'economic/gdp' => 'Economic data from Alpha Vantage API',
            'economic/inflation' => 'Inflation data from Alpha Vantage API',
            'economic/stocks' => 'Stock market data from Alpha Vantage API',
            'weather' => 'Historical weather from Open-Meteo Archive API',
            'newspapers' => 'Historical news from NYTimes Archive API',
        ],
        'sources' => [
            'nytimes' => 'https://api.nytimes.com/svc/archive/v1/',
            'alphavantage' => 'https://www.alphavantage.co/query',
            'openmeteo' => 'https://archive-api.open-meteo.com/v1/archive'
        ]
    ]);
});

// Available years for data
Route::get('/available-years', function () {
    $currentYear = (int) date('Y');
    $years = range($currentYear - 100, $currentYear);
    
    return response()->json([
        'success' => true,
        'years' => $years,
        'current_year' => $currentYear,
        'oldest_year' => $currentYear - 100,
        'note' => 'Available years for historical data retrieval',
        'data_sources' => [
            'nytimes_archive' => '1851-present',
            'alphavantage' => 'Real-time data',
            'openmeteo_archive' => '1940-present'
        ]
    ]);
});