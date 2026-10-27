const axios = require('axios');
const { API_KEYS } = require('../config/apiKeys');

/**
 * Helper to make authenticated calls to RapidAPI services.
 * Automatically injects the required X-RapidAPI-Key header.
 * 
 * @param {string} url - Full URL or endpoint path
 * @param {string} host - The value for X-RapidAPI-Host header
 * @param {object} options - Axios options (method, params, data, etc.)
 * @returns {Promise<any>} - The response data
 */
exports.callRapidApi = async (url, host, options = {}) => {
    if (!API_KEYS.rapidApiKey) {
        console.warn('RapidAPI Key is missing in configuration!');
    }

    const defaultHeaders = {
        'X-RapidAPI-Key': API_KEYS.rapidApiKey,
        'X-RapidAPI-Host': host
    };

    const config = {
        url,
        method: options.method || 'GET',
        headers: { ...defaultHeaders, ...options.headers },
        params: options.params,
        data: options.data,
        ...options
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        // Enhance error logging for debugging API issues
        const safeError = {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            url: url,
            host: host
        };
        console.error(`RapidAPI call failed [${host}]:`, JSON.stringify(safeError));
        throw error;
    }
};
