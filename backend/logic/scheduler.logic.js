
/**
 * Smart Scheduling Logic
 * Assigns places to specific time slots based on category and popularity.
 * NOW INCLUDES: Weather Post-Processing Optimization
 */

// --- Helpers ---

const categorizePlace = (place) => {
    const name = place.name.toLowerCase();
    const cat = place.category.toLowerCase();

    // 1. Nature -> Morning
    if (cat.includes('park') || cat.includes('garden') || cat.includes('nature') || cat.includes('hike') || name.includes('park')) {
        return 'morning';
    }

    // 2. Sunset/Viewpoints -> Evening
    if (name.includes('sunset') || name.includes('viewpoint') || name.includes('bridge') || name.includes('tower') || cat.includes('view')) {
        return 'evening';
    }

    // 3. Indoor/Museums/Temples -> Afternoon
    if (cat.includes('museum') || cat.includes('temple') || cat.includes('art') || cat.includes('history') || cat.includes('building') || cat.includes('mall') || cat.includes('shop')) {
        return 'afternoon';
    }

    // Default based on popularity if available
    if (place.rating && place.rating > 8.5) {
        return 'morning';
    }

    return 'any';
};

const enrichPlace = (place) => {
    const cat = place.category.toLowerCase();
    const name = place.name.toLowerCase();

    let isIndoor = false;
    let weatherSensitivity = 'low';

    // Heuristic for Indoor
    if (cat.includes('museum') || cat.includes('temple') || cat.includes('art') || cat.includes('gallery') || cat.includes('building') || cat.includes('mall') || cat.includes('cafe') || cat.includes('restaurant')) {
        isIndoor = true;
    }

    // Heuristic for Sensitivity
    // Outdoor places are High sensitivity to Rain/Heat
    if (!isIndoor || cat.includes('park') || cat.includes('garden') || cat.includes('nature') || cat.includes('hike') || cat.includes('street')) {
        weatherSensitivity = 'high';
    } else {
        weatherSensitivity = 'low'; // Indoor usually low
    }

    return { ...place, isIndoor, weatherSensitivity };
};


// --- Post-Processing Logic ---

const optimizeForWeather = (itinerary, weather) => {
    // triggers
    const isRainy = weather && weather.rain === true;
    const isVeryHot = weather && weather.temp > 34;

    if (!isRainy && !isVeryHot) return itinerary; // No changes needed

    console.log(`Running Weather Optimization: Rain=${isRainy}, Hot=${isVeryHot}`);

    return itinerary.map(dayPlan => {
        const activities = [...dayPlan.activities];

        // Find problematic Afternoon activities (Outdoor)
        const afternoonIndices = activities
            .map((a, i) => (a.time.includes('Afternoon') && !a.isIndoor && a.weatherSensitivity === 'high') ? i : -1)
            .filter(i => i !== -1);

        if (afternoonIndices.length === 0) return dayPlan; // No issues

        // Try to fix each problem
        afternoonIndices.forEach(idx => {
            const problemAct = activities[idx];

            // Strategy 1: Swap with a Morning/Evening Indoor activity in same day?
            const swapCandidateIdx = activities.findIndex(a =>
                !a.time.includes('Afternoon') && a.isIndoor
            );

            if (swapCandidateIdx !== -1) {
                // Swap times and descriptions (conceptually)
                const candidate = activities[swapCandidateIdx];

                // Perform Swap
                const tempTime = problemAct.time;
                problemAct.time = candidate.time; // Outdoor goes to Morning/Evening
                candidate.time = tempTime; // Indoor goes to Afternoon
                candidate.description += " (Moved to afternoon due to weather)";

                // Re-sort array by time not strictly needed but good for display? 
                // We keep array order for now, just changed 'time' label.
                console.log(`Swapped ${problemAct.title} with ${candidate.title}`);
            } else {
                // Strategy 2: If we have Optional Activities that are Indoor, swap?
                if (dayPlan.optionalActivities && dayPlan.optionalActivities.length > 0) {
                    const indoorOptionalIdx = dayPlan.optionalActivities.findIndex(op => op.isIndoor);

                    if (indoorOptionalIdx !== -1) {
                        const backup = dayPlan.optionalActivities[indoorOptionalIdx];

                        // Remove backup from optional
                        dayPlan.optionalActivities.splice(indoorOptionalIdx, 1);

                        // Move problem activity to optional
                        dayPlan.optionalActivities.push({
                            title: problemAct.title,
                            description: problemAct.description,
                            type: problemAct.type,
                            isIndoor: problemAct.isIndoor,
                            weatherSensitivity: problemAct.weatherSensitivity
                        });

                        // Replace problem activity in main list
                        activities[idx] = {
                            time: problemAct.time, // Keep the afternoon slot
                            title: backup.title,
                            description: backup.description + " (Good indoor alternative)",
                            duration: '1-2 hours',
                            type: backup.type,
                            isIndoor: backup.isIndoor,
                            weatherSensitivity: backup.weatherSensitivity
                        };
                        console.log(`Replaced ${problemAct.title} with optional ${backup.title}`);
                    }
                }
            }
        });

        return {
            ...dayPlan,
            activities
        };
    });
};


exports.generateItinerary = (placesRaw, days, pace, weather) => {
    // 0. Enrich Places
    const places = placesRaw.map(enrichPlace);

    const dayPlans = [];
    const unassigned = [...places];

    // Determine slots per day based on pace
    // Relaxed: 2, Medium: 3, Fast: 4
    let slotsPerDay = 3;
    if (pace === 'Relaxed') slotsPerDay = 2;
    if (pace === 'Fast') slotsPerDay = 4;

    for (let i = 1; i <= days; i++) {
        const dailyActivities = [];
        let slotsFilled = 0;

        // --- 1. Base Generation (Standard Rules) ---

        // Morning
        const morningIdx = unassigned.findIndex(p => categorizePlace(p) === 'morning');
        if (morningIdx !== -1 && slotsFilled < slotsPerDay) {
            const p = unassigned.splice(morningIdx, 1)[0];
            dailyActivities.push({
                time: 'Morning',
                title: p.name,
                description: `Explore ${p.name}.`,
                duration: '2-3 hours',
                type: p.category,
                isIndoor: p.isIndoor,
                weatherSensitivity: p.weatherSensitivity
            });
            slotsFilled++;
        }

        // Afternoon
        let afternoonCount = 0;
        const maxAfternoon = slotsPerDay > 2 ? 2 : 1;
        while (afternoonCount < maxAfternoon && slotsFilled < slotsPerDay && unassigned.length > 0) {
            let idx = unassigned.findIndex(p => categorizePlace(p) === 'afternoon');
            if (idx === -1) idx = unassigned.findIndex(p => categorizePlace(p) === 'any');
            if (idx === -1) idx = unassigned.findIndex(p => categorizePlace(p) !== 'evening');

            if (idx !== -1) {
                const p = unassigned.splice(idx, 1)[0];
                dailyActivities.push({
                    time: afternoonCount === 0 ? 'Afternoon' : 'Late Afternoon',
                    title: p.name,
                    description: `Visit ${p.name}.`,
                    duration: '1-2 hours',
                    type: p.category,
                    isIndoor: p.isIndoor,
                    weatherSensitivity: p.weatherSensitivity
                });
                slotsFilled++;
                afternoonCount++;
            } else break;
        }

        // Evening
        if (slotsFilled < slotsPerDay && unassigned.length > 0) {
            let idx = unassigned.findIndex(p => categorizePlace(p) === 'evening');
            if (idx === -1) idx = 0;
            if (idx !== -1) {
                const p = unassigned.splice(idx, 1)[0];
                dailyActivities.push({
                    time: 'Evening',
                    title: p.name,
                    description: `Experience ${p.name}.`,
                    duration: '1-2 hours',
                    type: p.category,
                    isIndoor: p.isIndoor,
                    weatherSensitivity: p.weatherSensitivity
                });
                slotsFilled++;
            }
        }

        // --- Optional Activities ---
        const optionalActivities = [];
        let optionalCount = 0;
        while (optionalCount < 2 && unassigned.length > 0) {
            const p = unassigned.splice(0, 1)[0];
            optionalActivities.push({
                title: p.name,
                description: `Optional: ${p.name}`,
                type: p.category,
                isIndoor: p.isIndoor,
                weatherSensitivity: p.weatherSensitivity
            });
            optionalCount++;
        }

        dayPlans.push({
            day: i,
            theme: "Exploration",
            activities: dailyActivities,
            optionalActivities
        });

        if (unassigned.length === 0) break;
    }

    // --- 2. Post-Processing Optimization ---
    return optimizeForWeather(dayPlans, weather);
};

exports.categorizePlace = categorizePlace;
exports.enrichPlace = enrichPlace;
exports.optimizeForWeather = optimizeForWeather;

