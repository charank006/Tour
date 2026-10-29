function cleanKey(val) {
    if (!val || typeof val !== 'string') return null;
    const trimmed = val.trim();
    if (trimmed.startsWith('your_') || trimmed === 'anyrandomstring123') return null;
    return trimmed;
}

const API_KEYS = {
    weather: cleanKey(process.env.OPENWEATHER_KEY),
    routes: cleanKey(process.env.OPENROUTE_KEY),
    attractions: cleanKey(process.env.OPENTRIPMAP_KEY),
    geo: cleanKey(process.env.GEOAPIFY_KEY),

    flights: cleanKey(process.env.TRAVELPAYOUTS_API_TOKEN),
    aviationStack: cleanKey(process.env.AVIATIONSTACK_KEY),
    transport: cleanKey(process.env.TRANSPORT_API_KEY),

    rapidApiKey: cleanKey(process.env.RAPIDAPI_KEY),
    trainsHost: cleanKey(process.env.RAPIDAPI_HOST_TRAINS),
    busesHost: cleanKey(process.env.RAPIDAPI_HOST_BUSES),

    hotelsKey: cleanKey(process.env.BOOKING_API_KEY),
    hotelsHost: cleanKey(process.env.BOOKING_API_HOST),

    foursquare: cleanKey(process.env.FOURSQUARE_API_KEY)
};

module.exports = { API_KEYS, cleanKey };
