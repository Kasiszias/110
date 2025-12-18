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

        try {

            // Geocode city -> lat/lon using Open-Meteo Geocoding API
            $geoResponse = Http::timeout(10)
                ->withOptions(['verify' => false]) // Skip SSL verification for development
                ->get('https://geocoding-api.open-meteo.com/v1/search', [
                    'name'  => $city,
                    'count' => 1,
                    'language' => 'en',
                    'format' => 'json',
                ]);

            if (!$geoResponse->successful() || empty($geoResponse['results'])) {
                return response()->json([
                    'success' => false,
                    'message' => "City '{$city}' not found"
                ], 404);
            }

            $location = $geoResponse['results'][0];
            $lat = $location['latitude'];
            $lon = $location['longitude'];


            // Historical weather for that date using Open-Meteo Archive API
            $weatherResponse = Http::timeout(15)
                ->withOptions(['verify' => false]) // Skip SSL verification for development
                ->get('https://archive-api.open-meteo.com/v1/archive', [
                    'latitude'  => $lat,
                    'longitude' => $lon,
                    'start_date'=> $date,
                    'end_date'  => $date,
                    'daily'     => 'temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,wind_speed_10m_max',
                    'timezone'  => 'auto',
                    'temperature_unit' => 'fahrenheit',
                    'wind_speed_unit' => 'mph',
                    'precipitation_unit' => 'inch',
                ]);

            if (!$weatherResponse->successful() || empty($weatherResponse['daily']['time'])) {
                return response()->json([
                    'success' => false,
                    'message' => "No weather data available for {$date} in {$city}"
                ], 404);
            }

            $daily = $weatherResponse['daily'];

            return response()->json([
                'success' => true,
                'city'          => $location['name'],
                'country'       => $location['country'] ?? null,
                'latitude'      => $lat,
                'longitude'     => $lon,
                'date'          => $daily['time'][0],
                'temp_max'      => $daily['temperature_2m_max'][0] ?? null,
                'temp_min'      => $daily['temperature_2m_min'][0] ?? null,
                'temp_mean'     => $daily['temperature_2m_mean'][0] ?? null,
                'precipitation' => $daily['precipitation_sum'][0] ?? 0,
                'wind_speed'    => $daily['wind_speed_10m_max'][0] ?? null,
                'units'         => [
                    'temperature' => '°F',
                    'precipitation' => 'inches',
                    'wind_speed' => 'mph'
                ],
                'source'        => 'Open-Meteo Archive API'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Weather API error: ' . $e->getMessage(),
                'error' => 'Failed to fetch historical weather data'
            ], 500);
        }
    }

    public function monthly(Request $request)
    {
        $data = $request->validate([
            'city' => 'required|string|max:100',
            'year' => 'required|integer|min:1940|max:2100',
            'month' => 'required|integer|min:1|max:12',
        ]);

        $city = $data['city'];
        $year = $data['year'];
        $month = str_pad($data['month'], 2, '0', STR_PAD_LEFT);
        
        $startDate = "{$year}-{$month}-01";
        $endDate = date('Y-m-t', strtotime($startDate));

        try {

            // Geocode city -> lat/lon
            $geoResponse = Http::timeout(10)
                ->withOptions(['verify' => false]) // Skip SSL verification for development
                ->get('https://geocoding-api.open-meteo.com/v1/search', [
                    'name'  => $city,
                    'count' => 1,
                    'language' => 'en',
                    'format' => 'json',
                ]);

            if (!$geoResponse->successful() || empty($geoResponse['results'])) {
                return response()->json([
                    'success' => false,
                    'message' => "City '{$city}' not found"
                ], 404);
            }

            $location = $geoResponse['results'][0];
            $lat = $location['latitude'];
            $lon = $location['longitude'];


            // Monthly historical weather data
            $weatherResponse = Http::timeout(15)
                ->withOptions(['verify' => false]) // Skip SSL verification for development
                ->get('https://archive-api.open-meteo.com/v1/archive', [
                    'latitude'  => $lat,
                    'longitude' => $lon,
                    'start_date'=> $startDate,
                    'end_date'  => $endDate,
                    'daily'     => 'temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum',
                    'timezone'  => 'auto',
                    'temperature_unit' => 'fahrenheit',
                    'precipitation_unit' => 'inch',
                ]);

            if (!$weatherResponse->successful() || empty($weatherResponse['daily']['time'])) {
                return response()->json([
                    'success' => false,
                    'message' => "No weather data available for {$month}/{$year} in {$city}"
                ], 404);
            }

            $daily = $weatherResponse['daily'];
            
            // Calculate monthly averages
            $tempMax = array_filter($daily['temperature_2m_max'] ?? []);
            $tempMin = array_filter($daily['temperature_2m_min'] ?? []);
            $tempMean = array_filter($daily['temperature_2m_mean'] ?? []);
            $precipitation = array_sum($daily['precipitation_sum'] ?? []);

            return response()->json([
                'success' => true,
                'city' => $location['name'],
                'country' => $location['country'] ?? null,
                'month' => $month,
                'year' => $year,
                'period' => "{$month}/{$year}",
                'summary' => [
                    'avg_temp_max' => !empty($tempMax) ? array_sum($tempMax) / count($tempMax) : null,
                    'avg_temp_min' => !empty($tempMin) ? array_sum($tempMin) / count($tempMin) : null,
                    'avg_temp_mean' => !empty($tempMean) ? array_sum($tempMean) / count($tempMean) : null,
                    'total_precipitation' => $precipitation,
                    'days_with_data' => count($daily['time'] ?? [])
                ],
                'source' => 'Open-Meteo Archive API'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Weather API error: ' . $e->getMessage(),
                'error' => 'Failed to fetch monthly weather data'
            ], 500);
        }
    }
}