<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WeatherHistoryController extends Controller
{
    public function show(Request $request)
    {
        $data = $request->validate([
            'city' => 'required|string|max:100',
            'date' => 'required|date',
        ]);

        $city = $data['city'];
        $date = $data['date'];

        // Geocode city -> lat/lon
        $geoResponse = Http::get('https://geocoding-api.open-meteo.com/v1/search', [
            'name'  => $city,
            'count' => 1,
        ]);

        if (! $geoResponse->ok() || empty($geoResponse['results'])) {
            return response()->json(['message' => 'City not found'], 404);
        }

        $location = $geoResponse['results'][0];
        $lat = $location['latitude'];
        $lon = $location['longitude'];

        // Historical weather for that date
        $weatherResponse = Http::get('https://archive-api.open-meteo.com/v1/archive', [
            'latitude'  => $lat,
            'longitude' => $lon,
            'start_date'=> $date,
            'end_date'  => $date,
            'daily'     => 'temperature_2m_max,temperature_2m_min,precipitation_sum',
            'timezone'  => 'auto',
        ]);

        if (! $weatherResponse->ok() || empty($weatherResponse['daily']['time'])) {
            return response()->json(['message' => 'No weather data for that date'], 404);
        }

        $daily = $weatherResponse['daily'];

        return response()->json([
            'city'          => $location['name'],
            'country'       => $location['country'] ?? null,
            'latitude'      => $lat,
            'longitude'     => $lon,
            'date'          => $daily['time'][0],
            'temp_max'      => $daily['temperature_2m_max'][0],
            'temp_min'      => $daily['temperature_2m_min'][0],
            'precipitation' => $daily['precipitation_sum'][0],
        ]);
    }
}
