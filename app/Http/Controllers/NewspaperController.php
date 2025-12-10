<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class NewspaperController extends Controller
{
    public function index(Request $request)
    {
        $data = $request->validate([
            'state'      => 'required|string|size:2', // e.g. ny, ca
            'year_from'  => 'required|integer|min:1700|max:2100',
            'year_to'    => 'required|integer|min:1700|max:2100',
        ]);

        $state = strtolower($data['state']);
        $yearFrom = $data['year_from'];
        $yearTo   = $data['year_to'];

        $response = Http::get('https://chroniclingamerica.loc.gov/search/titles/results/', [
            'state'  => $state,
            'year1'  => $yearFrom,
            'year2'  => $yearTo,
            'format' => 'json',
        ]);

        if ($response->failed()) {
            return response()->json([
                'message' => 'Newspaper API unavailable',
            ], 502);
        }

        $json = $response->json();

        $items = collect($json['items'] ?? [])
            ->take(10)
            ->map(function ($item) {
                return [
                    'title'      => $item['title'] ?? null,
                    'place'      => $item['place_of_publication'] ?? null,
                    'start_year' => $item['start_year'] ?? null,
                    'end_year'   => $item['end_year'] ?? null,
                    'lccn'       => $item['lccn'] ?? null,
                    'url'        => $item['url'] ?? null,
                ];
            })
            ->values();

        return response()->json([
            'state'      => $state,
            'year_from'  => $yearFrom,
            'year_to'    => $yearTo,
            'total'      => $json['totalItems'] ?? null,
            'newspapers' => $items,
        ]);
    }
}
