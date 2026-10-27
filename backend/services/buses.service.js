const axios = require('axios');
const { API_KEYS } = require('../config/apiKeys');

/**
 * Service to fetch bus schedules using a generic Transport API
 * 
 * Note: This implementation assumes a hypothetical "Transport API" structure.
 * Replace the endpoint and parameters with the actual provider's details.
 */

exports.getBuses = async (fromCity, toCity, date) => {
    // Fallback Data (Static)
    const fallbackBuses = [
        {
            type: "bus",
            operator: "Volvo AC Multi-Axle",
            departureTime: "09:00 PM",
            arrivalTime: "06:00 AM",
            duration: "9h 00m",
            price: 1200
        },
        {
            type: "bus",
            operator: "State Transport Express",
            departureTime: "10:30 PM",
            arrivalTime: "08:00 AM",
            duration: "9h 30m",
            price: 800
        },
        {
            type: "bus",
            operator: "Sleeper Coach",
            departureTime: "11:00 PM",
            arrivalTime: "08:30 AM",
            duration: "9h 30m",
            price: 1500
        }
    ];

    if (!API_KEYS.transport) {
        console.warn('Transport API Key is missing. Using fallback bus data.');
        return fallbackBuses;
    }

    try {
        // Hypothetical Endpoint
        const url = 'https://api.transport-provider.com/v1/buses/search';

        const params = {
            api_key: API_KEYS.transport,
            from: fromCity,
            to: toCity,
            date: date
        };

        const response = await axios.get(url, { params });
        const data = response.data;

        if (!data || !data.routes || data.routes.length === 0) {
            console.warn('Transport API found no buses. Using fallback.');
            return fallbackBuses;
        }

        // Map response to simplified format
        return data.routes.map(route => ({
            type: "bus",
            operator: route.operatorName || "Bus Operator",
            departureTime: route.departureTime, // Assumed format or need parsing
            arrivalTime: route.arrivalTime,
            duration: route.duration,
            price: route.fare || 1000
        }));

    } catch (error) {
        console.error('Bus Service Error:', error.message);
        return fallbackBuses;
    }
};
