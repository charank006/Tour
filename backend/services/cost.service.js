const priceUtils = require('../utils/price.utils');

// Service: Cost Engine
// Estimates costs based on market rates (as of 2024/2025 constants for India context if implied, or global)

exports.estimateTripCost = (distanceKm, durationDays, travelers) => {
    // Rates
    const fuelRatePerKm = 10;
    const avgHotelCost = 3000; // per night per room
    const avgFoodCost = 1500; // per day per person
    const avgActivityCost = 1000; // per day per person

    // 1. Base Costs
    const transport = Math.round(distanceKm * fuelRatePerKm);
    const stay = Math.round(avgHotelCost * durationDays * Math.ceil(travelers / 2));
    const food = Math.round(avgFoodCost * durationDays * travelers);
    const activities = Math.round(avgActivityCost * durationDays * travelers);

    // 2. Buffer (15% for miscellaneous/safety)
    const subtotal = transport + stay + food + activities;
    const buffer = Math.round(subtotal * 0.15);

    // 3. Totals
    const total = subtotal + buffer;
    const perDay = Math.round(total / (durationDays || 1));

    // Return detailed numeric breakdown
    return {
        total,
        transport,
        stay,
        food,
        activities,
        buffer,
        perDay
    };
};
