const { callRapidApi } = require('../utils/rapidApi');
const { API_KEYS } = require('../config/apiKeys');

/**
 * Service to search for trains using RapidAPI
 * 
 * Note: The specific endpoint logic depends on the actual API provider chosen 
 * (e.g., IXIGO, IRCTC scraper, or general Train API).
 * This implementation assumes a standard search endpoint structure.
 */

exports.searchTrains = async (fromStationCode, toStationCode, date) => {
    // Example Endpoint: https://trains.p.rapidapi.com/search (Hypothetical)
    // You must replace '/search' with the actual endpoint path of the subscribed Service.
    const endpoint = 'https://' + API_KEYS.trainsHost + '/searchTrains';

    try {
        const params = {
            from: fromStationCode,
            to: toStationCode,
            date: date // Format usually YYYY-MM-DD
        };

        const data = await callRapidApi(endpoint, API_KEYS.trainsHost, {
            params
        });

        return data;
    } catch (error) {
        console.error('Train Service Error:', error.message);
        return [];
    }
};
