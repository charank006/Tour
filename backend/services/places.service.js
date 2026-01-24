const axios = require('axios');
const { OPENTRIPMAP_KEY, GEOAPIFY_KEY } = require('../config/keys');

exports.getPlaces = async (city, weatherRules, moodRules) => {
  try {
    console.log(`Fetching places for: ${city}`);

    // 1. Nominatim (OpenStreetMap) - Get Coordinates
    const geoRes = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`, {
      headers: { 'User-Agent': 'PlanYoursApp/1.0' }
    });

    if (!geoRes.data || geoRes.data.length === 0) {
      console.warn("Nominatim found no coordinates for:", city);
      return [];
    }

    const { lat, lon } = geoRes.data[0];

    // 2. OpenTripMap - Tourist Places
    // First get list of places in radius
    const radiusMeters = 5000; // 5km radius
    let otmPlaces = [];
    if (OPENTRIPMAP_KEY) {
      try {
        // kinds='interesting_places' covers museums, temples, architecture, etc.
        const otmRes = await axios.get(`https://api.opentripmap.com/0.1/en/places/radius?radius=${radiusMeters}&lon=${lon}&lat=${lat}&kinds=interesting_places&rate=2&format=json&limit=20&apikey=${OPENTRIPMAP_KEY}`);

        if (Array.isArray(otmRes.data)) {
          otmPlaces = otmRes.data
            .filter(p => p.name && p.name.length > 2) // Filter empty or too short names
            .map(p => ({
              name: p.name,
              category: p.kinds ? p.kinds.split(',')[0].replace(/_/g, ' ') : 'Tourist Attraction',
              location: `Lat: ${p.point.lat.toFixed(4)}, Lon: ${p.point.lon.toFixed(4)}`, // OTM doesn't give address in list
              source: 'OpenTripMap'
            }));
        } else {
          console.warn("OpenTripMap returned non-array data:", otmRes.data);
        }
      } catch (err) {
        console.error("OpenTripMap Error:", err.message);
      }
    }

    // 3. Geoapify - Places API
    let geoapifyPlaces = [];
    if (GEOAPIFY_KEY) {
      try {
        // Expanded categories for more variety
        // entertainment.culture, entertainment.museum, building.historic, natural, tourism
        const categories = 'tourism.sights,entertainment.culture,building.historic,natural,leisure.park';
        const limit = 20;
        const geoUrl = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},${radiusMeters}&limit=${limit}&apiKey=${GEOAPIFY_KEY}`;

        const geoRes = await axios.get(geoUrl);

        geoapifyPlaces = geoRes.data.features.map(f => {
          const props = f.properties;
          return {
            name: props.name || props.name_international || (props.street ? `Street near ${props.street}` : null),
            category: props.categories && props.categories.length > 0
              ? props.categories[0].split('.')[1] || props.categories[0].split('.')[0]
              : 'Attraction',
            location: props.formatted,
            source: 'Geoapify'
          };
        }).filter(p => p.name && p.name !== 'Unknown Place' && !p.name.includes("Street near"));
      } catch (err) {
        console.error("Geoapify Error:", err.message);
      }
    }

    // 4. Merge
    const allPlaces = [...otmPlaces, ...geoapifyPlaces];

    // Deduplicate by name (fuzzy check)
    const uniquePlaces = [];
    const seenNames = new Set();

    for (const p of allPlaces) {
      // Clean name for comparison
      const cleanName = p.name.toLowerCase().trim();
      if (!seenNames.has(cleanName)) {
        uniquePlaces.push(p);
        seenNames.add(cleanName);
      }
    }

    // Return a good number of places to populate 3 days (3 per day = 9 min)
    return uniquePlaces.slice(0, 20);

  } catch (err) {
    console.error("Places Service Global Error:", err.message);
    return []; // Fail gracefully
  }
};
