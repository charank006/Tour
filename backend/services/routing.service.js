const http = require('../utils/http');
const cache = require('../utils/cache');
const { OPENROUTE_KEY } = require('../config/keys');
const distanceUtils = require('../utils/distance.utils');
const placesService = require('./places.service');

/**
 * Great-circle distance between two points in km (Haversine formula)
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Format minutes into "Xh Ym"
 */
function formatMinutes(minutes) {
  const mins = Math.max(0, Math.round(minutes || 0));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/**
 * Service: Resilient Routing Engine
 * Fallback chain: Cache (24h) -> OpenRouteService -> Haversine distance x 1.3 road factor
 */
exports.getRoute = async (startCity, endCity) => {
  const start = (startCity || 'New Delhi').trim();
  const end = (endCity || 'Jaipur').trim();
  const cacheKey = `${start.toLowerCase()}:${end.toLowerCase()}`;

  const cached = cache.get('routes', cacheKey);
  if (cached) return cached;

  // 1. Geocode both locations using resilient geocoder
  const [startGeo, endGeo] = await Promise.all([
    placesService.geocodeCity(start),
    placesService.geocodeCity(end)
  ]);

  const startCoords = [startGeo.lon, startGeo.lat];
  const endCoords = [endGeo.lon, endGeo.lat];

  // 2. Try OpenRouteService if API key configured
  if (OPENROUTE_KEY) {
    try {
      const orsUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${OPENROUTE_KEY}&start=${startCoords.join(',')}&end=${endCoords.join(',')}`;
      const routeRes = await http.get(orsUrl, { timeout: 6000 }, 'openroute');

      const segment = routeRes.data?.features?.[0]?.properties?.segments?.[0];
      if (segment && segment.distance > 0) {
        const distanceKm = Math.round(segment.distance / 1000);
        const durationMin = Math.round(segment.duration / 60);

        const result = {
          start,
          end,
          distanceKm,
          duration: formatMinutes(durationMin),
          apiDurationMin: durationMin,
          meta: { source: 'OpenRouteService', degraded: false }
        };

        cache.set('routes', cacheKey, result, 24 * 60 * 60);
        return result;
      }
    } catch (err) {
      console.warn(`[RoutingService] OpenRouteService failed for ${start} -> ${end}: ${err.message}. Using Haversine estimation.`);
    }
  }

  // 3. Fallback: Haversine distance with road tortuosity factor 1.3
  const directKm = haversineDistance(startGeo.lat, startGeo.lon, endGeo.lat, endGeo.lon);
  const roadFactor = 1.3;
  const distanceKm = Math.max(15, Math.round(directKm * roadFactor));

  // Average intercity car speed: 65 km/h
  const drivingMinutes = Math.round((distanceKm / 65) * 60);

  const estimatedRoute = {
    start,
    end,
    distanceKm,
    duration: formatMinutes(drivingMinutes),
    apiDurationMin: drivingMinutes,
    modalEstimates: {
      flight: {
        distanceKm,
        duration: formatMinutes(Math.round((distanceKm / 600) * 60) + 60), // + 60 min terminal
        speedKmh: 600
      },
      train: {
        distanceKm,
        duration: formatMinutes(Math.round((distanceKm / 75) * 60)),
        speedKmh: 75
      },
      car: {
        distanceKm,
        duration: formatMinutes(drivingMinutes),
        speedKmh: 65
      },
      bus: {
        distanceKm,
        duration: formatMinutes(Math.round((distanceKm / 45) * 60)),
        speedKmh: 45
      }
    },
    meta: { source: 'estimated', degraded: true }
  };

  cache.set('routes', cacheKey, estimatedRoute, 24 * 60 * 60);
  return estimatedRoute;
};

exports.haversineDistance = haversineDistance;
exports.formatMinutes = formatMinutes;
