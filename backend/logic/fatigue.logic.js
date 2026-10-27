
/**
 * Fatigue Balancing Logic
 * Ensures daily activities do not exceed physical exertion thresholds.
 */

const getFatigueScore = (activity) => {
    const type = activity.type ? activity.type.toLowerCase() : '';
    const title = activity.title ? activity.title.toLowerCase() : '';

    // 1. High Fatigue (3)
    if (type.includes('hike') || type.includes('trek') || type.includes('mountain') || type.includes('climb') || type.includes('adventure') || title.includes('trek')) {
        return 3;
    }

    // 2. Medium Fatigue (2)
    // City walks, large museums, zoos, theme parks
    if (type.includes('walk') || type.includes('zoo') || type.includes('theme') || type.includes('park') || type.includes('garden') || type.includes('historic')) {
        return 2;
    }

    // 3. Low Fatigue (1)
    // Indoor museums (small), temples, leisure, food
    return 1;
};

exports.balanceFatigue = (dayPlans, pace) => {
    if (!dayPlans || dayPlans.length === 0) return dayPlans;

    // Thresholds
    let maxFatigue = 6; // Balanced
    if (pace === 'Relaxed') maxFatigue = 4;
    if (pace === 'Fast') maxFatigue = 8;

    // We may need to move items. We iterate forward.
    // If Day i is over limit, move to Day i+1.
    // If Day i+1 becomes over limit, it propagates. 
    // Boundary: Last day checks Day - 1? Or just accepts overload if no choice.

    // 1. Calculate Scores & Identify Overload
    for (let i = 0; i < dayPlans.length; i++) {
        const day = dayPlans[i];
        let dailyFatigue = day.activities.reduce((sum, a) => sum + getFatigueScore(a), 0);

        while (dailyFatigue > maxFatigue && day.activities.length > 1) {
            // Need to move something.
            // Correct strategy: Move the item that reduces fatigue most effectively OR just the last one/afternoon one to save the morning.
            // Let's move the last activity to keep the morning plan intact.

            const activityToMove = day.activities.pop();
            const score = getFatigueScore(activityToMove);
            dailyFatigue -= score;

            // Where to put it?
            // Preference: Next Day (i+1)
            if (i + 1 < dayPlans.length) {
                dayPlans[i + 1].activities.unshift(activityToMove); // Add to start of next day (Morning)
                // Note: Logic allows next day to overload temporarily; loop will catch it when i increments.
                console.log(`Fatigue Balancing: Moved '${activityToMove.title}' from Day ${day.day} to Day ${dayPlans[i + 1].day}`);
            } else if (i - 1 >= 0) {
                // If last day, try prev day
                // Only if prev day has space? simplified: just push
                dayPlans[i - 1].activities.push(activityToMove);
                console.log(`Fatigue Balancing: Moved '${activityToMove.title}' from Day ${day.day} to Day ${dayPlans[i - 1].day}`);
            } else {
                // Start of list and End of list blocked?
                // Just put it back if single day trip, or overload accepted.
                day.activities.push(activityToMove);
                break;
            }
        }
    }

    return dayPlans;
};
