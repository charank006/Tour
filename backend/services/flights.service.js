const axios = require('axios');
const { API_KEYS } = require('../config/apiKeys');

/**
 * Service to fetch flight schedules/routes using AviationStack
 * 
 * Note: AviationStack Free Tier does not always support real-time pricing or specific route searches perfectly.
 * We primarily use it for schedule information.
 */

exports.getFlights = async (fromCity, toCity, date) => {
    // Basic mapping or use IATA codes directly if frontend sends them.
    // Assuming backend receives IATA codes (e.g., DEL, BOM).

    // Fallback Data (Static) - returned if API fails or key is missing
    const fallbackFlights = [
        {
            type: "flight",
            airline: "IndiGo",
            departureTime: "06:00 AM",
            arrivalTime: "08:15 AM",
            durationEstimate: "2h 15m",
            priceEstimate: 4500 // Static estimate since AS doesn't give prices easily in free tier
        },
        {
            type: "flight",
            airline: "Air India",
            departureTime: "10:30 AM",
            arrivalTime: "01:00 PM",
            durationEstimate: "2h 30m",
            priceEstimate: 5200
        },
        {
            type: "flight",
            airline: "Vistara",
            departureTime: "05:00 PM",
            arrivalTime: "07:15 PM",
            durationEstimate: "2h 15m",
            priceEstimate: 6000
        }
    ];

    if (!API_KEYS.aviationStack) {
        console.warn('AviationStack API Key is missing. Using fallback data.');
        return fallbackFlights;
    }

    try {
        const url = 'http://api.aviationstack.com/v1/flights';

        // AviationStack params
        // note: free tier doesn't support all filters, checking routes might be better
        const params = {
            access_key: API_KEYS.aviationStack,
            dep_iata: fromCity,
            arr_iata: toCity,
            limit: 5
        };

        const response = await axios.get(url, { params });
        const data = response.data;

        if (!data || !data.data || data.data.length === 0) {
            console.warn('AviationStack found no flights via API. Using fallback.');
            return fallbackFlights;
        }

        // Map response
        return data.data.map(flight => {
            // Calculate simplistic duration if not provided
            // AS returns complex objects, simplifying for frontend
            const airlineName = flight.airline ? flight.airline.name : 'Unknown Airline';
            const depTime = flight.departure ? flight.departure.scheduled : null;
            const arrTime = flight.arrival ? flight.arrival.scheduled : null;

            let durationStr = "2h 00m"; // default
            if (depTime && arrTime) {
                const dep = new Date(depTime);
                const arr = new Date(arrTime);
                const diffMs = arr - dep;
                const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
                const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
                durationStr = `${diffHrs}h ${diffMins}m`;
            }

            return {
                type: "flight",
                airline: airlineName,
                departureTime: depTime ? new Date(depTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "TBD",
                arrivalTime: arrTime ? new Date(arrTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "TBD",
                durationEstimate: durationStr,
                priceEstimate: 5000 // Placeholder as AS doesn't provide price
            };
        });

    } catch (error) {
        console.error('AviationStack Service Error:', error.message);
        return fallbackFlights;
    }
};
