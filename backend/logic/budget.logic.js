
/**
 * Budget Optimization Logic
 * Adjusts trip plan to fit within user budget.
 */

const getStayCost = (type) => {
    switch (type) {
        case 'Luxury': return 8000;
        case 'Comfort': return 3500;
        case 'Budget': return 1500;
        default: return 3500;
    }
};

const isPaidActivity = (activity) => {
    const type = activity.type ? activity.type.toLowerCase() : '';
    // Heuristic: Museums, Theme Parks, Zoos -> Paid
    // Parks, Streets, Nature -> Free
    if (type.includes('museum') || type.includes('zoo') || type.includes('theme') || type.includes('tour') || type.includes('history') || type.includes('building')) {
        return true;
    }
    return false;
};

exports.optimizeTrip = (plan, userBudget) => {
    // Clone plan to avoid side effects
    const optimizedPlan = JSON.parse(JSON.stringify(plan));
    const budget = Number(userBudget);

    if (!budget || budget <= 0) return optimizedPlan; // No budget constraint

    // Current Total (using max of range if it's a range, or just total)
    // Assuming costService returns { total: number, ... } based on inspection/logic
    let currentCost = optimizedPlan.estimatedCost.total || 0;

    if (currentCost <= budget) return optimizedPlan; // Within budget

    optimizedPlan.budgetAdjusted = true;
    optimizedPlan.adjustmentsMade = [];

    // --- Strategy 1: Downgrade Stay ---
    if (optimizedPlan.stay && optimizedPlan.stay.type !== 'Budget') {
        const originalType = optimizedPlan.stay.type;
        let newType = originalType;
        let costsSaved = 0;

        if (originalType === 'Luxury') {
            newType = 'Comfort';
        } else if (originalType === 'Comfort') {
            newType = 'Budget';
        }

        // Apply Change
        const originalRate = getStayCost(originalType);
        const newRate = getStayCost(newType);
        const nights = optimizedPlan.stay.nights || 1;
        const diff = (originalRate - newRate) * nights;

        if (currentCost - diff <= budget || diff > 0) {
            optimizedPlan.stay.type = newType;
            optimizedPlan.stay.estimatedCostPerNight = newRate;

            // Update Total Stay Cost
            // Assuming estimatedCost structure has 'accommodation' field
            if (optimizedPlan.estimatedCost.accommodation) {
                optimizedPlan.estimatedCost.accommodation -= diff;
            }
            optimizedPlan.estimatedCost.total -= diff;
            currentCost -= diff;

            optimizedPlan.adjustmentsMade.push(`Downgraded accommodation from ${originalType} to ${newType} to save ${diff}.`);
        }

        // If still over budget, try one more step down?
        if (currentCost > budget && newType === 'Comfort') {
            // Downgrade Comfort -> Budget
            const budgetRate = getStayCost('Budget');
            const diff2 = (newRate - budgetRate) * nights;

            optimizedPlan.stay.type = 'Budget';
            optimizedPlan.stay.estimatedCostPerNight = budgetRate;
            if (optimizedPlan.estimatedCost.accommodation) {
                optimizedPlan.estimatedCost.accommodation -= diff2;
            }
            optimizedPlan.estimatedCost.total -= diff2;
            currentCost -= diff2;
            optimizedPlan.adjustmentsMade.push(`Downgraded accommodation from Comfort to Budget to save ${diff2}.`);
        }
    }

    if (currentCost <= budget) return optimizedPlan;

    // --- Strategy 2: Swap Paid Activities ---
    // Look for Paid activities and try to find Free Optionals
    optimizedPlan.dayPlans.forEach(day => {
        if (currentCost <= budget) return;

        const paidActivities = day.activities.map((a, i) => ({ ...a, idx: i })).filter(a => isPaidActivity(a));

        if (paidActivities.length > 0) {
            // Find Free Optionals
            const freeOptionals = (day.optionalActivities || []).filter(a => !isPaidActivity(a));

            if (freeOptionals.length > 0 && paidActivities.length > 0) {
                const toSwap = paidActivities[0]; // Take first paid one
                const replacement = freeOptionals[0];

                // perform swap
                day.activities[toSwap.idx] = {
                    ...replacement,
                    time: toSwap.time // Keep slot
                };
                // Remove from optional
                day.optionalActivities = day.optionalActivities.filter(opt => opt.title !== replacement.title);
                // Add old to optional
                day.optionalActivities.push(toSwap);

                // Assume saving of ~500 per person per activity
                // Need travelers count, let's assume 1 or infer from context if passed, 
                // but 'plan' doesn't explicitly store 'travelers' count in root usually, 
                // we might need to rely on the passed plan structure or just use a flat estimate.
                const saving = 500;
                optimizedPlan.estimatedCost.total -= saving;
                currentCost -= saving;
                optimizedPlan.adjustmentsMade.push(`Replaced paid activity '${toSwap.title}' with '${replacement.title}'.`);
            }
        }
    });

    if (currentCost <= budget) return optimizedPlan;

    // --- Strategy 3: Transport Suggestion ---
    // If we can't cut enough, suggest changing mode
    if (currentCost > budget) {
        optimizedPlan.adjustmentsMade.push("Budget still exceeded. Consider using Train or Bus instead of Flight/Car to save significantly on travel costs.");
        // We don't change the calculated cost here blindly as we don't have the train cost handy easily without solving routing again.
        // But we flag it.
    }

    return optimizedPlan;
};
