const travelService = require('./travel.service');
const hotelsService = require('./hotels.service');

// Service: Cost Engine
// Estimates costs based on real-time data from other services where possible

/**
 * Calculates a detailed budget breakdown for a trip.
 * 
 * @param {string} fromCity - Origin city
 * @param {string} toCity - Destination city
 * @param {string} date - Travel start date (YYYY-MM-DD)
 * @param {number} durationDays - Number of days
 * @param {number} travelers - Number of travelers
 * @param {string} budgetLevel - 'low', 'medium', 'high'
 */
exports.estimateTripCost = async (fromCity, toCity, date, durationDays, travelers, budgetLevel = 'medium') => {
    // 1. Travel Cost (Get Cheapest Valid Option)
    // We fetch top options and pick the cheapest one for the budget estimate
    let travelCostPerPerson = 2000; // Default fallback if API fails

    try {
        const travelOptions = await travelService.getTravelOptions(fromCity, toCity, date);
        if (travelOptions && travelOptions.length > 0) {
            // Find option with lowest price
            // Ensure price is a number
            const validOptions = travelOptions.filter(o => (o.priceEstimate || o.price) > 0);
            if (validOptions.length > 0) {
                const cheapest = validOptions.reduce((min, o) => (o.priceEstimate || o.price) < (min.priceEstimate || min.price) ? o : min);
                travelCostPerPerson = cheapest.priceEstimate || cheapest.price;
            }
        }
    } catch (err) {
        console.warn("Cost Service: Failed to fetch dynamic travel cost, using default.", err.message);
    }

    const totalTravel = travelCostPerPerson * travelers;

    // 2. Stay Cost (Fetch Hotel for Budget Level)
    let hotelCostPerNight = 3000; // Default Medium
    if (budgetLevel === 'low') hotelCostPerNight = 1200;
    if (budgetLevel === 'high') hotelCostPerNight = 8000;

    try {
        const hotels = await hotelsService.getHotels(toCity, budgetLevel);
        if (hotels && hotels.length > 0) {
            // Take average of top 3 findings to be safe? Or just the cheapest/best fit?
            // Let's take the first one (top rated in price tier)
            hotelCostPerNight = hotels[0].priceEstimate || hotelCostPerNight;
        }
    } catch (err) {
        console.warn("Cost Service: Failed to fetch dynamic hotel cost, using default.", err.message);
    }

    // Cost is per room per night. Assume 2 people share a room.
    const rooms = Math.ceil(travelers / 2);
    const totalStay = hotelCostPerNight * durationDays * rooms;

    // 3. Food & Activities (Static Heuristics based on Budget Level)
    const dailyFood = budgetLevel === 'high' ? 3000 : (budgetLevel === 'low' ? 800 : 1500);
    const dailyActivity = budgetLevel === 'high' ? 2000 : (budgetLevel === 'low' ? 500 : 1000);

    const totalFood = dailyFood * durationDays * travelers;
    const totalActivities = dailyActivity * durationDays * travelers;

    // 4. Misc Buffer (10%)
    const subtotal = totalTravel + totalStay + totalFood + totalActivities;
    const misc = Math.round(subtotal * 0.10);

    const total = subtotal + misc;

    return {
        total,
        breakdown: {
            travel: totalTravel,
            stay: totalStay,
            food: totalFood,
            activities: totalActivities,
            misc: misc
        },
        perPerson: Math.round(total / travelers)
    };
};
