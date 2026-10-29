const http = require('../utils/http');
const cache = require('../utils/cache');
const { OPENWEATHER_KEY } = require('../config/keys');
const climateData = require('../data/climate.json');

/**
 * Fetches live weather for a given city from OpenWeatherMap.
 * Fallback chain: Cache (30m) -> OpenWeatherMap API -> Climatology table (climate.json)
 * Never throws an error; returns estimated data flagged with meta.
 */
exports.getWeather = async (city, travelDate = null) => {
  const normalizedCity = (city || '').trim().toLowerCase();
  const cached = cache.get('weather', normalizedCity);
  if (cached) return cached;

  // Determine target month (1 - 12)
  let month = new Date().getMonth() + 1;
  if (travelDate) {
    const parsed = new Date(travelDate);
    if (!isNaN(parsed.getTime())) {
      month = parsed.getMonth() + 1;
    }
  }

  // 1. Try Live OpenWeatherMap if key is provided
  if (OPENWEATHER_KEY) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_KEY}&units=metric`;
      const res = await http.get(url, { timeout: 6000 }, 'openweather');
      const data = res.data;

      const main = data.weather?.[0]?.main || '';
      const desc = data.weather?.[0]?.description || 'clear sky';

      const result = {
        temp: Math.round(data.main?.temp ?? 22),
        feelsLike: Math.round(data.main?.feels_like ?? 22),
        humidity: data.main?.humidity ?? 60,
        windKph: Math.round(((data.wind?.speed ?? 0) * 3.6)),
        rain: main.toLowerCase().includes('rain') || main.toLowerCase().includes('drizzle'),
        snow: main.toLowerCase().includes('snow'),
        description: desc.charAt(0).toUpperCase() + desc.slice(1),
        icon: data.weather?.[0]?.icon || null,
        city: data.name || city,
        country: data.sys?.country || 'IN',
        meta: { source: 'OpenWeather', degraded: false }
      };

      cache.set('weather', normalizedCity, result, 30 * 60);
      return result;
    } catch (err) {
      console.warn(`[WeatherService] Live OpenWeather failed for "${city}": ${err.message}. Falling back to climatology table.`);
    }
  }

  // 2. Climatology Table Fallback
  const cityClimate = climateData[normalizedCity] ||
    Object.keys(climateData).find(k => normalizedCity.includes(k)) ?
    climateData[Object.keys(climateData).find(k => normalizedCity.includes(k))] :
    climateData.default;

  const monthData = cityClimate[String(month)] || cityClimate["1"] || climateData.default["1"];

  const fallbackWeather = {
    temp: monthData.temp ?? 22,
    feelsLike: monthData.temp ?? 22,
    humidity: monthData.humidity ?? 55,
    windKph: 12,
    rain: Boolean(monthData.rain),
    snow: Boolean(monthData.snow),
    description: `${monthData.description} (seasonal estimate)`,
    icon: null,
    city: city || 'Destination',
    country: 'IN',
    meta: { source: 'estimated', degraded: true }
  };

  cache.set('weather', normalizedCity, fallbackWeather, 30 * 60);
  return fallbackWeather;
};
