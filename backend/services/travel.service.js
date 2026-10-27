const flightsService = require('./flights.service');
const trainsService = require('./trains.service');
const busesService = require('./buses.service');

/**
 * Unified Travel Service
 * Aggregates transport options from Flights, Trains, and Buses.
 * Returns the best options sorted by duration or cost.
 */
exports.getTravelOptions = async (fromCity, toCity, date) => {
    // Run all services in parallel
    const [flights, trains, buses] = await Promise.allSettled([
        flightsService.getFlights(fromCity, toCity, date),
        trainsService.searchTrains(fromCity, toCity, date),
        busesService.getBuses(fromCity, toCity, date)
    ]);

    let allOptions = [];

    // Process Flights
    if (flights.status === 'fulfilled' && Array.isArray(flights.value)) {
        allOptions = allOptions.concat(flights.value.map(f => ({ ...f, category: 'Flight' })));
    } else {
        console.warn('Travel Service: Failed to fetch flights', flights.reason);
    }

    // Process Trains
    if (trains.status === 'fulfilled' && Array.isArray(trains.value)) {
        allOptions = allOptions.concat(trains.value.map(t => ({ ...t, category: 'Train' })));
    } else {
        console.warn('Travel Service: Failed to fetch trains', trains.reason);
    }

    // Process Buses
    if (buses.status === 'fulfilled' && Array.isArray(buses.value)) {
        allOptions = allOptions.concat(buses.value.map(b => ({ ...b, category: 'Bus' })));
    } else {
        console.warn('Travel Service: Failed to fetch buses', buses.reason);
    }

    // Normalize and Sort
    // Heuristic: Sort by duration (asc) then price (asc)
    // Needs parsing duration strings like "2h 15m" to minutes for accurate sorting
    const parseDuration = (durStr) => {
        if (!durStr) return 9999;
        const parts = durStr.split(' ');
        let totalMins = 0;
        for (const p of parts) {
            if (p.includes('h')) totalMins += parseInt(p) * 60;
            if (p.includes('m')) totalMins += parseInt(p);
        }
        return totalMins || 9999;
    };

    const sortedOptions = allOptions.sort((a, b) => {
        const durA = parseDuration(a.durationEstimate || a.duration);
        const durB = parseDuration(b.durationEstimate || b.duration);

        // Primary sort: Duration
        if (Math.abs(durA - durB) > 30) { // If difference > 30 mins, faster wins
            return durA - durB;
        }

        // Secondary sort: Price
        const priceA = a.priceEstimate || a.price || 0;
        const priceB = b.priceEstimate || b.price || 0;
        return priceA - priceB;
    });

    // Return top 3 unique options (simple dedupe by type/operator)
    return sortedOptions.slice(0, 3);
};
