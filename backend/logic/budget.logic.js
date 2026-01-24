// Logic: Budget Engine
// Splits the total budget into categories based on best practices

exports.split = (total, days) => {
    // Standard Traveler Rule: 40% Stay, 25% Food, 20% Travel, 15% Activities
    const split = {
        stay: Math.round(total * 0.40),
        food: Math.round(total * 0.25),
        transport: Math.round(total * 0.20),
        activities: Math.round(total * 0.15),
        total: total,
        perDay: Math.round(total / days)
    };

    return split;
};
