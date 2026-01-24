// Logic: Decision Engine
// Determines Go/No-Go based on conditions

exports.evaluate = (context) => {
    const { cost, rating, weather } = context;

    if (rating < 3.5) return { decision: "SKIP", reason: "Low rating" };
    if (weather === "Rain" && context.type === "Outdoor") return { decision: "SKIP", reason: "Raining" };
    if (cost > context.budgetAllocated) return { decision: "WARNING", reason: "Over budget" };

    return { decision: "YES", reason: "Good to go" };
};
