import { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets, Thermometer } from 'lucide-react';

// Key West coordinates
const LAT = 24.5551;
const LNG = -81.7800;

// Weather code to icon mapping
const weatherIcons = {
  0: Sun, // Clear sky
  1: Sun, // Mainly clear
  2: Cloud, // Partly cloudy
  3: Cloud, // Overcast
  45: Cloud, // Foggy
  48: Cloud, // Depositing rime fog
  51: CloudRain, // Light drizzle
  53: CloudRain, // Moderate drizzle
  55: CloudRain, // Dense drizzle
  61: CloudRain, // Slight rain
  63: CloudRain, // Moderate rain
  65: CloudRain, // Heavy rain
  71: CloudSnow, // Slight snow
  73: CloudSnow, // Moderate snow
  75: CloudSnow, // Heavy snow
  80: CloudRain, // Slight rain showers
  81: CloudRain, // Moderate rain showers
  82: CloudRain, // Violent rain showers
  95: CloudRain, // Thunderstorm
};

const weatherDescriptions = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Foggy',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Dense drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  80: 'Light showers',
  81: 'Showers',
  82: 'Heavy showers',
  95: 'Thunderstorm',
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LNG}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FNew_York&forecast_days=5`
        );

        if (!response.ok) throw new Error('Weather fetch failed');

        const data = await response.json();
        setWeather(data);
        setLoading(false);
      } catch (err) {
        console.error('Weather error:', err);
        setError(err);
        setLoading(false);
      }
    }

    fetchWeather();
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-16 bg-gray-200 rounded mb-4" />
        <div className="h-20 bg-gray-200 rounded" />
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Key West Weather</h3>
        <p className="text-gray-500 text-sm">Unable to load weather data</p>
      </div>
    );
  }

  const current = weather.current;
  const daily = weather.daily;
  const CurrentIcon = weatherIcons[current.weather_code] || Sun;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Sun className="text-sunset-500" size={20} />
        Key West Weather
      </h3>

      {/* Current Weather */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-ocean-400 to-ocean-500 rounded-xl flex items-center justify-center">
          <CurrentIcon className="text-white" size={32} />
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-800">
            {Math.round(current.temperature_2m)}°F
          </div>
          <div className="text-gray-600 text-sm">
            {weatherDescriptions[current.weather_code] || 'Clear'}
          </div>
        </div>
      </div>

      {/* Current Details */}
      <div className="flex gap-4 mb-6 text-sm">
        <div className="flex items-center gap-1 text-gray-600">
          <Droplets size={14} className="text-ocean-500" />
          <span>{current.relative_humidity_2m}%</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <Wind size={14} className="text-gray-400" />
          <span>{Math.round(current.wind_speed_10m)} mph</span>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-500 mb-3">5-Day Forecast</h4>
        <div className="grid grid-cols-5 gap-2">
          {daily.time.slice(0, 5).map((date, index) => {
            const DayIcon = weatherIcons[daily.weather_code[index]] || Sun;
            const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });

            return (
              <div key={date} className="text-center">
                <div className="text-xs text-gray-500 mb-1">{dayName}</div>
                <DayIcon size={20} className="mx-auto text-ocean-500 mb-1" />
                <div className="text-xs">
                  <span className="font-medium">{Math.round(daily.temperature_2m_max[index])}°</span>
                  <span className="text-gray-400 ml-1">{Math.round(daily.temperature_2m_min[index])}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
