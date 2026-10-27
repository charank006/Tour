const axios = require('axios');
const { API_KEYS } = require('../config/apiKeys');

/**
 * Service to fetch hotels using Foursquare Places API v3
 * Uses 'near' parameter to search by city name.
 * Filters by price tier based on budget level.
 */

exports.getHotels = async (city, budgetLevel = 'medium') => {
    // Fallback Data (Static)
    const fallbackHotels = [
        {
            name: "City Comfort Inn",
            rating: 4.2,
            priceEstimate: 2500, // INR
            location: `${city} Center`,
            description: "A comfortable stay with essential amenities."
        },
        {
            name: "Grand Plaza Hotel",
            rating: 4.5,
            priceEstimate: 5000,
            location: `${city} Downtown`,
            description: "Luxury service at an affordable price."
        },
        {
            name: "Backpacker's Haven",
            rating: 4.0,
            priceEstimate: 1200,
            location: `${city} Old Town`,
            description: "Perfect for budget travelers and youth."
        }
    ];

    if (!API_KEYS.foursquare) {
        console.warn('Foursquare API Key is missing. Using fallback data.');
        return fallbackHotels;
    }

    try {
        const url = 'https://api.foursquare.com/v3/places/search';

        // Map budget to Foursquare price tiers (1=Cheap, 2=Moderate, 3=Expensive, 4=Very Expensive)
        let minPrice = 1;
        let maxPrice = 4;

        if (budgetLevel === 'low') {
            maxPrice = 1;
        } else if (budgetLevel === 'medium') {
            minPrice = 2;
            maxPrice = 3;
        } else if (budgetLevel === 'high') {
            minPrice = 4;
            maxPrice = 4;
        }

        const params = {
            near: city,
            categories: '19014', // Hotel category ID
            min_price: minPrice,
            max_price: maxPrice,
            sort: 'RATING', // Sort by best rated
            limit: 10
        };

        const response = await axios.get(url, {
            headers: {
                'Authorization': API_KEYS.foursquare,
                'Accept': 'application/json'
            },
            params: params
        });

        const places = response.data.results;

        if (!places || places.length === 0) {
            console.warn(`Foursquare found no hotels in ${city} for budget ${budgetLevel}.`);
            return fallbackHotels;
        }

        return places.map(place => {
            // Foursquare v3 doesn't typically return explicit price numbers, just tiers.
            // We'll estimate price based on tier for the specific purpose of the app UI
            // 1: 1000-3000, 2: 3000-6000, 3: 6000-12000, 4: 12000+
            const tier = place.price || (budgetLevel === 'low' ? 1 : budgetLevel === 'high' ? 4 : 2);
            let estimatedPrice = 3500;
            if (tier === 1) estimatedPrice = 1500;
            if (tier === 3) estimatedPrice = 8000;
            if (tier === 4) estimatedPrice = 15000;

            return {
                name: place.name,
                rating: 0.0, // Foursquare v3 sometimes requires premium fields for rating or separate call. Defaulting.
                priceEstimate: estimatedPrice,
                location: place.location.formatted_address || place.location.address || city,
                description: place.categories?.map(c => c.name).join(', ') || 'Hotel'
            };
        });

    } catch (error) {
        console.error('Foursquare Service Error:', error.message);
        return fallbackHotels;
    }
};
