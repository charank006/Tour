const axios = require('axios');
const { OPENWEATHER_KEY } = require('../config/keys');

/**
 * Fetches live weather for a given city from OpenWeatherMap.
 * Falls back to sensible defaults on any error (missing key, network, invalid city).
 */
exports.getWeather = async (city) => {
  // If no API key is configured, return a default immediately
  if (!OPENWEATHER_KEY) {
    console.warn('[WeatherService] OPENWEATHER_KEY not set — using default weather.');
    return defaultWeather(city);
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_KEY}&units=metric`;
    const res = await axios.get(url, { timeout: 5000 });

    const data = res.data;
    const main = data.weather[0]?.main || '';
    const desc = data.weather[0]?.description || 'clear sky';

    return {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      windKph: Math.round((data.wind?.speed || 0) * 3.6),     // m/s → kph
      rain: main.toLowerCase().includes('rain') || main.toLowerCase().includes('drizzle'),
      snow: main.toLowerCase().includes('snow'),
      description: desc.charAt(0).toUpperCase() + desc.slice(1),
      icon: data.weather[0]?.icon || null,
      city: data.name,
      country: data.sys?.country || ''
    };
  } catch (err) {
    const status = err.response?.status;
    if (status === 404) {
      console.warn(`[WeatherService] City not found: "${city}" — using defaults.`);
    } else if (status === 401) {
      console.error('[WeatherService] Invalid API key — using defaults.');
    } else {
      console.error('[WeatherService] API error:', err.message);
    }
    return defaultWeather(city);
  }
};

function defaultWeather(city) {
  return {
    temp: 22,
    feelsLike: 22,
    humidity: 60,
    windKph: 10,
    rain: false,
    snow: false,
    description: 'Partly cloudy (estimated)',
    icon: null,
    city: city,
    country: ''
  };
}
