import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function WeatherHistory({ auth }) {
    const [year, setYear] = useState(new Date().getFullYear());
    const [latitude, setLatitude] = useState('40.7128');
    const [longitude, setLongitude] = useState('-74.0060');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWeatherData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.get('/api/weather', {
                params: {
                    year: year,
                    lat: parseFloat(latitude),
                    lon: parseFloat(longitude)
                }
            });

            if (response.data.success) {
                setWeatherData(response.data.data);
            } else {
                setError(response.data.message || 'Failed to fetch weather data');
            }
        } catch (err) {
            console.error('Weather fetch error:', err);
            setError('Unable to load weather history. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Weather History" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                🌤️ Historical Weather Data
                            </h2>

                            {/* Search Form */}
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Year
                                        </label>
                                        <input
                                            type="number"
                                            value={year}
                                            onChange={(e) => setYear(parseInt(e.target.value))}
                                            min="1940"
                                            max={new Date().getFullYear()}
                                            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Latitude
                                        </label>
                                        <input
                                            type="text"
                                            value={latitude}
                                            onChange={(e) => setLatitude(e.target.value)}
                                            placeholder="40.7128"
                                            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Longitude
                                        </label>
                                        <input
                                            type="text"
                                            value={longitude}
                                            onChange={(e) => setLongitude(e.target.value)}
                                            placeholder="-74.0060"
                                            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            onClick={fetchWeatherData}
                                            disabled={loading}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? 'Loading...' : 'Search'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                    <p className="text-red-800 font-medium">⚠️ {error}</p>
                                </div>
                            )}

                            {/* Weather Data Display */}
                            {weatherData && weatherData.daily && (
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-6 text-white">
                                        <h3 className="text-xl font-bold mb-2">Weather Summary for {year}</h3>
                                        <p className="text-blue-100">
                                            Location: {latitude}, {longitude}
                                        </p>
                                        <p className="text-blue-100">
                                            Total Days: {weatherData.daily.time?.length || 0}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                                📊 Temperature Statistics
                                            </h4>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 dark:text-gray-400">Max Temperature:</span>
                                                    <span className="font-bold text-red-600">
                                                        {Math.max(...(weatherData.daily.temperature_2m_max || [0]))}°C
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 dark:text-gray-400">Min Temperature:</span>
                                                    <span className="font-bold text-blue-600">
                                                        {Math.min(...(weatherData.daily.temperature_2m_min || [0]))}°C
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 dark:text-gray-400">Average Max:</span>
                                                    <span className="font-bold text-orange-600">
                                                        {(weatherData.daily.temperature_2m_max?.reduce((a, b) => a + b, 0) / 
                                                          weatherData.daily.temperature_2m_max?.length || 0).toFixed(1)}°C
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                                📅 Data Range
                                            </h4>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 dark:text-gray-400">Start Date:</span>
                                                    <span className="font-bold text-gray-900 dark:text-white">
                                                        {weatherData.daily.time?.[0] || 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 dark:text-gray-400">End Date:</span>
                                                    <span className="font-bold text-gray-900 dark:text-white">
                                                        {weatherData.daily.time?.[weatherData.daily.time.length - 1] || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Initial State */}
                            {!weatherData && !loading && !error && (
                                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                    </svg>
                                    <p className="text-lg font-medium">Enter location and year to view historical weather data</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
