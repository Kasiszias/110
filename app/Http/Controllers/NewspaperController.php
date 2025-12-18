<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class NewspaperController extends Controller
{
    public function index(Request $request)
    {
        $data = $request->validate([
            'year'  => 'required|integer|min:1850|max:2100',
            'month' => 'required|integer|min:1|max:12',
        ]);

        $year = $data['year'];
        $month = str_pad($data['month'], 2, '0', STR_PAD_LEFT);

        try {

            // Use NYTimes Archive API
            $response = Http::timeout(10)
                ->withOptions(['verify' => false]) // Skip SSL verification for development
                ->get("https://api.nytimes.com/svc/archive/v1/{$year}/{$month}.json");

            if ($response->successful()) {
                $json = $response->json();
                $articles = $json['response']['docs'] ?? [];
                
                // Transform articles to match expected format
                $items = collect($articles)
                    ->take(10)
                    ->map(function ($article) {
                        return [
                            'title'      => $article['headline']['main'] ?? 'No Title',
                            'description'=> $article['abstract'] ?? 'No description available',
                            'date'       => $article['pub_date'] ?? null,
                            'creator'    => implode(', ', $article['byline']['person'] ?? []),
                            'url'        => $article['web_url'] ?? null,
                            'type'       => 'news_article',
                            'source'     => 'New York Times',
                            'section'    => $article['section_name'] ?? null,
                            'word_count' => $article['word_count'] ?? null,
                        ];
                    })
                    ->values();

                return response()->json([
                    'year'  => $year,
                    'month' => $month,
                    'total' => count($articles),
                    'newspapers' => $items,
                    'source' => 'NYTimes Archive API',
                    'success' => true,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Unable to fetch data from NYTimes API',
                'status' => $response->status(),
            ], 502);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Newspaper API error: ' . $e->getMessage(),
                'error' => 'Failed to fetch historical news data from NYTimes Archive API'
            ], 500);
        }
    }

    public function show(Request $request, $year, $month)
    {
        $data = $request->validate([
            'year'  => 'required|integer|min:1850|max:2100',
            'month' => 'required|integer|min:1|max:12',
        ]);

        return $this->index($request);
    }
}