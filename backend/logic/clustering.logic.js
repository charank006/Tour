
/**
 * Clustering Logic
 * Groups activities by geographic proximity to minimize travel time.
 */

const scheduler = require('./scheduler.logic'); // To re-use categorization

// Calculate distance between two points
const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

exports.clusterItinerary = (dayPlans) => {
    if (!dayPlans || dayPlans.length <= 1) return dayPlans;

    // 1. Flatten Activities
    let allActivities = [];
    dayPlans.forEach(day => {
        if (day.activities) {
            allActivities = allActivities.concat(day.activities);
        }
        // Should we include optionalActivities in clustering? 
        // Logic says yes if we want to move them, but optional are separate.
        // Let's stick to Main Activities for Clustering core days.
    });

    if (allActivities.length === 0) return dayPlans;

    // Filter valid coords
    const validPoints = allActivities.filter(a => a.coordinates && a.coordinates.lat && a.coordinates.lon);
    if (validPoints.length < dayPlans.length) return dayPlans; // Not enough data

    const k = dayPlans.length;
    let centroids = [];

    // Init centroids with random points or just the first k points
    for (let i = 0; i < k; i++) {
        centroids.push({ ...validPoints[i * Math.floor(validPoints.length / k)].coordinates });
    }

    // K-Means Steps
    let clusters = Array(k).fill().map(() => []);
    let iterations = 0;
    const maxIter = 10;

    while (iterations < maxIter) {
        // Reset clusters
        clusters = Array(k).fill().map(() => []);

        // Assign points
        validPoints.forEach(p => {
            let closestIdx = 0;
            let minDst = Infinity;
            centroids.forEach((c, idx) => {
                const d = haversine(p.coordinates.lat, p.coordinates.lon, c.lat, c.lon);
                if (d < minDst) {
                    minDst = d;
                    closestIdx = idx;
                }
            });
            clusters[closestIdx].push(p);
        });

        // Recalculate centroids
        let changed = false;
        centroids = centroids.map((c, idx) => {
            const cluster = clusters[idx];
            if (cluster.length === 0) return c; // Keep old if empty

            const newLat = cluster.reduce((sum, p) => sum + p.coordinates.lat, 0) / cluster.length;
            const newLon = cluster.reduce((sum, p) => sum + p.coordinates.lon, 0) / cluster.length;

            if (Math.abs(newLat - c.lat) > 0.001 || Math.abs(newLon - c.lon) > 0.001) changed = true;
            return { lat: newLat, lon: newLon };
        });

        if (!changed) break;
        iterations++;
    }

    // Assign Clusters Back to Days
    // We map clusters[0] -> Day 1, clusters[1] -> Day 2... 
    // Ideally we sort clusters to match day order (e.g. nearest to previous day's end) but random is fine for now.

    const newDayPlans = dayPlans.map((originalDay, idx) => {
        let assignedCluster = clusters[idx] || [];

        // If cluster is empty (rare), maybe steal from others? Ignored for simplicity.

        // Re-Slotting: Sort by Morning/Afternoon
        // Use scheduler helper
        const morning = [];
        const afternoon = [];
        const evening = [];

        assignedCluster.forEach(place => {
            // Re-categorize because we lost the structure, but we have the place object
            // Wait, 'place' here is the activity object from dayPlans. 
            // It has 'type' (category) and 'title'.
            // We need 'category' for categorizePlace.
            // Ensure object structure matches what categorizePlace expects ({name, category})
            const proxyPlace = { name: place.title, category: place.type, rating: 9 }; // rating unknown

            const slot = scheduler.categorizePlace(proxyPlace);

            if (slot === 'morning') morning.push(place);
            else if (slot === 'evening') evening.push(place);
            else afternoon.push(place); // includes 'any', 'afternoon'
        });

        // Reconstruct Activities Array
        // Update Time Labels
        const sortedActivities = [
            ...morning.map(a => ({ ...a, time: 'Morning' })),
            ...afternoon.map(a => ({ ...a, time: 'Afternoon' })),
            ...evening.map(a => ({ ...a, time: 'Evening' }))
        ];

        // Generate Label (Simple: "Zone X")
        // If we had address, we could pick most common city/district.

        return {
            ...originalDay,
            activities: sortedActivities,
            areaLabel: `Area ${idx + 1}` // Placeholder
        };
    });

    return newDayPlans;
};
