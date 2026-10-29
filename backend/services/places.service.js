const http = require('../utils/http');
const cache = require('../utils/cache');
const { OPENTRIPMAP_KEY, GEOAPIFY_KEY } = require('../config/keys');
const { API_KEYS } = require('../config/apiKeys');
const citiesData = require('../data/cities.json');
const seedPlacesData = require('../data/places.seed.json');

/**
 * Geocode a city name
 * Fallback chain: Cache -> Nominatim -> cities.json gazetteer -> center of India default
 */
async function geocodeCity(cityName) {
  const normalized = (cityName || '').trim().toLowerCase();
  const cached = cache.get('geocode', normalized);
  if (cached) return cached;

  let coords = null;
  let source = 'nominatim';
  let degraded = false;

  // 1. Nominatim (OpenStreetMap)
  try {
    const encoded = encodeURIComponent(cityName);
    const res = await http.get(
      `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`,
      { headers: { 'User-Agent': 'PlanYours/1.0 (+https://planyours.travel)' } },
      'nominatim'
    );

    if (Array.isArray(res.data) && res.data.length > 0) {
      coords = {
        lat: parseFloat(res.data[0].lat),
        lon: parseFloat(res.data[0].lon),
        displayName: res.data[0].display_name
      };
    }
  } catch (err) {
    console.warn(`[PlacesService] Nominatim lookup failed for "${cityName}": ${err.message}. Trying local gazetteer.`);
  }

  // 2. Local gazetteer fallback (cities.json)
  if (!coords) {
    const match = citiesData[normalized] || Object.values(citiesData).find(
      c => c.name.toLowerCase() === normalized || normalized.includes(c.name.toLowerCase())
    );

    if (match) {
      coords = { lat: match.lat, lon: match.lon, displayName: `${match.name}, ${match.state}, India` };
      source = 'gazetteer';
      degraded = true;
    }
  }

  // 3. Ultimate safe fallback
  if (!coords) {
    coords = { lat: 26.9124, lon: 75.7873, displayName: `${cityName}, India (approximate)` };
    source = 'fallback';
    degraded = true;
  }

  const result = { ...coords, meta: { source, degraded } };
  cache.set('geocode', normalized, result, 24 * 60 * 60);
  return result;
}

exports.geocodeCity = geocodeCity;

/**
 * Fetch tourist places for a city
 * Fallback chain: Cache -> OpenTripMap -> Geoapify -> places.seed.json -> Minimal curated list
 */
exports.getPlaces = async (city, weatherRules = {}, moodRules = {}) => {
  const normalizedCity = (city || '').trim().toLowerCase();
  const cacheKey = `${normalizedCity}`;
  const cached = cache.get('places', cacheKey);
  if (cached && cached.length > 0) {
    return cached;
  }

  const geo = await geocodeCity(city);
  const { lat, lon } = geo;
  const radiusMeters = 8000;

  let otmPlaces = [];
  const otmKey = OPENTRIPMAP_KEY || API_KEYS?.attractions;

  // 1. OpenTripMap
  if (otmKey) {
    try {
      const otmUrl = `https://api.opentripmap.com/0.1/en/places/radius?radius=${radiusMeters}&lon=${lon}&lat=${lat}&kinds=interesting_places&rate=2&format=json&limit=20&apikey=${otmKey}`;
      const res = await http.get(otmUrl, {}, 'opentripmap');

      if (Array.isArray(res.data)) {
        otmPlaces = res.data
          .filter(p => p.name && p.name.trim().length > 2)
          .map(p => ({
            name: p.name.trim(),
            category: p.kinds ? p.kinds.split(',')[0].replace(/_/g, ' ') : 'Attraction',
            location: `Lat: ${Number(p.point.lat).toFixed(4)}, Lon: ${Number(p.point.lon).toFixed(4)}`,
            coordinates: { lat: p.point.lat, lon: p.point.lon },
            rating: p.rate ? Number(p.rate) * 2 : 8.5,
            source: 'OpenTripMap',
            meta: { source: 'OpenTripMap', degraded: false }
          }));
      }
    } catch (err) {
      console.warn(`[PlacesService] OpenTripMap failed: ${err.message}`);
    }
  }

  // 2. Geoapify
  let geoapifyPlaces = [];
  const geoKey = GEOAPIFY_KEY || API_KEYS?.geo;
  if (geoKey) {
    try {
      const categories = 'tourism.sights,entertainment.culture,building.historic,natural,leisure.park';
      const geoUrl = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},${radiusMeters}&limit=20&apiKey=${geoKey}`;
      const res = await http.get(geoUrl, {}, 'geoapify');

      if (res.data?.features && Array.isArray(res.data.features)) {
        geoapifyPlaces = res.data.features
          .map(f => {
            const props = f.properties || {};
            const name = props.name || props.name_international;
            if (!name || name === 'Unknown Place' || name.startsWith('Street near')) return null;

            return {
              name: name.trim(),
              category: props.categories?.[0] ? props.categories[0].split('.')[1] || props.categories[0].split('.')[0] : 'Attraction',
              location: props.formatted || `${city}, India`,
              coordinates: {
                lat: f.geometry.coordinates[1],
                lon: f.geometry.coordinates[0]
              },
              rating: props.rank?.confidence ? Number((props.rank.confidence * 10).toFixed(1)) : 8.7,
              source: 'Geoapify',
              meta: { source: 'Geoapify', degraded: false }
            };
          })
          .filter(Boolean);
      }
    } catch (err) {
      console.warn(`[PlacesService] Geoapify failed: ${err.message}`);
    }
  }

  // Merge live API places
  let combined = [...otmPlaces, ...geoapifyPlaces];

  // 3. Fallback to Local Seed Dataset (data/places.seed.json)
  if (combined.length === 0) {
    console.info(`[PlacesService] Using local curated seed dataset for "${city}".`);
    const seedCity = seedPlacesData[normalizedCity] || Object.keys(seedPlacesData).find(k => normalizedCity.includes(k));
    const rawSeeds = seedCity ? seedPlacesData[seedCity] : seedPlacesData.default;

    combined = rawSeeds.map((p, idx) => ({
      name: p.name,
      category: p.category,
      location: `${city}, India`,
      coordinates: (p.coordinates && p.coordinates.lat !== 0)
        ? p.coordinates
        : { lat: lat + (idx * 0.005), lon: lon + (idx * 0.005) },
      rating: p.rating || 8.8,
      cost: p.cost || 0,
      openHours: p.openHours || '09:00 - 18:00',
      isIndoor: p.isIndoor || false,
      weatherSensitivity: p.weatherSensitivity || 'medium',
      source: 'Local Seed Dataset',
      meta: { source: 'seed', degraded: true }
    }));
  }

  // Deduplicate by name
  const uniquePlaces = [];
  const seenNames = new Set();
  for (const p of combined) {
    const clean = p.name.toLowerCase().trim();
    if (!seenNames.has(clean)) {
      uniquePlaces.push(p);
      seenNames.add(clean);
    }
  }

  const finalPlaces = uniquePlaces.slice(0, 24);
  cache.set('places', cacheKey, finalPlaces, 6 * 60 * 60);
  return finalPlaces;
};

/**
 * Fetch experiences (dining, culture, cafes)
 */
exports.getExperiences = async (city, category = 'food') => {
  const normalized = (city || '').trim().toLowerCase();
  const cacheKey = `${normalized}:${category}`;
  const cached = cache.get('places', cacheKey);
  if (cached) return cached;

  const fallbackExperiences = [
    { name: 'Heritage Courtyard Dining', category: 'Fine Dining', popularityScore: 9.2, coordinates: { lat: 0, lon: 0 }, meta: { source: 'estimated', degraded: true } },
    { name: 'Artisanal Roastery & Tea Salon', category: 'Cafe', popularityScore: 8.8, coordinates: { lat: 0, lon: 0 }, meta: { source: 'estimated', degraded: true } },
    { name: 'Local Mastercraft Bazaar Tour', category: 'Culture', popularityScore: 9.0, coordinates: { lat: 0, lon: 0 }, meta: { source: 'estimated', degraded: true } }
  ];

  if (!API_KEYS.foursquare) {
    cache.set('places', cacheKey, fallbackExperiences, 6 * 60 * 60);
    return fallbackExperiences;
  }

  try {
    const categoriesMap = { food: '13000', cafe: '13032', cultural: '10000', nightlife: '13003,13026' };
    const url = 'https://api.foursquare.com/v3/places/search';
    const res = await http.get(url, {
      headers: {
        Authorization: API_KEYS.foursquare,
        Accept: 'application/json'
      },
      params: {
        near: city,
        categories: categoriesMap[category] || '13000',
        sort: 'POPULARITY',
        limit: 10
      }
    }, 'foursquare');

    if (res.data?.results && Array.isArray(res.data.results) && res.data.results.length > 0) {
      const mapped = res.data.results.map(p => ({
        name: p.name,
        category: p.categories?.[0]?.name || category,
        popularityScore: p.rating ? Number(p.rating) : 8.5,
        coordinates: {
          lat: p.geocodes?.main?.latitude || 0,
          lon: p.geocodes?.main?.longitude || 0
        },
        meta: { source: 'Foursquare', degraded: false }
      }));
      cache.set('places', cacheKey, mapped, 6 * 60 * 60);
      return mapped;
    }
  } catch (err) {
    console.warn(`[PlacesService] Foursquare failed: ${err.message}`);
  }

  cache.set('places', cacheKey, fallbackExperiences, 6 * 60 * 60);
  return fallbackExperiences;
};
