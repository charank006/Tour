const API_KEYS = {
    weather: process.env.OPENWEATHER_KEY,
    routes: process.env.OPENROUTE_KEY,
    attractions: process.env.OPENTRIPMAP_KEY,
    geo: process.env.GEOAPIFY_KEY,

    flights: process.env.TRAVELPAYOUTS_API_TOKEN,
    aviationStack: process.env.AVIATIONSTACK_KEY,
    transport: process.env.TRANSPORT_API_KEY,

    rapidApiKey: process.env.RAPIDAPI_KEY,
    trainsHost: process.env.RAPIDAPI_HOST_TRAINS,
    busesHost: process.env.RAPIDAPI_HOST_BUSES,

    hotelsKey: process.env.BOOKING_API_KEY,
    hotelsHost: process.env.BOOKING_API_HOST,

    foursquare: process.env.FOURSQUARE_API_KEY
};

module.exports = { API_KEYS };
