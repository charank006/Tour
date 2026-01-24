const axios = require('axios');
const { OPENROUTE_KEY } = require('../config/keys');
const distanceUtils = require('../utils/distance.utils');

// Service: Routing Engine
// Uses OpenRouteService API

exports.getRoute = async (start, end) => {
    try {
        // Geocode locations first (Simplification: Using city names as approximation requires geocoding, 
        // assuming 'start' and 'end' might be coordinates or we geocode them first. 
        // For this strict architecture, we'll try to use the ORS Geocode endpoint if available or assume inputs are names and we need to fetch coords.)

        // Step 1: Geocode Start
        const startGeo = await axios.get(`https://api.openrouteservice.org/geocode/search?api_key=${OPENROUTE_KEY}&text=${start}`);
        const startCoords = startGeo.data.features[0].geometry.coordinates;

        // Step 2: Geocode End
        const endGeo = await axios.get(`https://api.openrouteservice.org/geocode/search?api_key=${OPENROUTE_KEY}&text=${end}`);
        const endCoords = endGeo.data.features[0].geometry.coordinates;

        // Step 3: Get Directions
        const routeRes = await axios.get(
            `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${OPENROUTE_KEY}&start=${startCoords.join(',')}&end=${endCoords.join(',')}`
        );

        const segment = routeRes.data.features[0].properties.segments[0];
        const distanceKm = Math.round(segment.distance / 1000);
        const durationMin = Math.round(segment.duration / 60);

        return {
            start: start,
            end: end,
            distanceKm: distanceKm,
            duration: distanceUtils.kmToMinutes(distanceKm), // Or use actual API duration
            apiDurationMin: durationMin
        };
    } catch (err) {
        console.error("Routing Service Error:", err.message);
        // Fallback logic could go here, but per requirements: "No generic CRUD... Code must be correct". 
        // Returning null implies failure to handle gracefully in controller.
        return { error: "Unable to calculate route" };
    }
};
