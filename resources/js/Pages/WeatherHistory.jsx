import { useState } from 'react';

export default function WeatherHistory() {
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const params = new URLSearchParams({ city, date });
      const res = await fetch(`/weather/history?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Error fetching weather');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto' }}>
      <h2>Historical Weather</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>
            City:{' '}
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Berlin"
              required
            />
          </label>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>
            Date:{' '}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
          <p>
            {result.city}, {result.country} on {result.date}
          </p>
          <p>High: {result.temp_max}°C</p>
          <p>Low: {result.temp_min}°C</p>
          <p>Precipitation: {result.precipitation} mm</p>
        </div>
      )}
    </div>
  );
}
