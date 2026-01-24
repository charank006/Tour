import { DestinationItem, PlaceItem, ActivityItem, destinationsData, activitiesData } from '@/data/staticDiscoveryData';

interface DailyPlan {
    day: number;
    title: string;
    description: string;
    activities: {
        time: 'morning' | 'afternoon' | 'evening';
        title: string;
        description: string;
        duration: string;
        cost: number;
        crowdLevel: string;
        placeId: string;
    }[];
    dailySpend: number;
}

interface BudgetBreakdown {
    total: number;
    travel: number;
    stay: number;
    food: number;
    activities: number;
    misc: number;
}

interface TripPlanResult {
    destination: DestinationItem;
    totalDays: number;
    travelers: number;
    itinerary: DailyPlan[];
    budget: BudgetBreakdown;
    generatedAt: string;
}

export const planningLogic = {

    /**
     * Generates a smart itinerary based on destination and constraints.
     */
    generateItinerary: (
        destinationId: string,
        days: number,
        travelers: number,
        selectedPlaceIds: string[] = [] // Optional: if user hand-picked places
    ): DailyPlan[] => {
        const destination = destinationsData.find(d => d.id === destinationId);
        if (!destination) throw new Error('Destination not found');

        let placesToVisit: PlaceItem[] = [];

        // 1. If user selected specific places, prioritize them
        if (selectedPlaceIds.length > 0) {
            placesToVisit = destination.places.filter(p => selectedPlaceIds.includes(p.id));
        }

        // 2. If not enough places selected (or none), fill with top-rated places
        // Sort remaining places by popularity
        const remainingPlaces = destination.places
            .filter(p => !placesToVisit.includes(p))
            .sort((a, b) => b.popularityScore - a.popularityScore);

        // We ideally want 2 major activities per day
        const targetPlaceCount = days * 2;

        if (placesToVisit.length < targetPlaceCount) {
            const needed = targetPlaceCount - placesToVisit.length;
            placesToVisit = [...placesToVisit, ...remainingPlaces.slice(0, needed)];
        }

        // 3. Distribute into days
        const itinerary: DailyPlan[] = [];
        const placesCopy = [...placesToVisit];

        for (let i = 1; i <= days; i++) {
            const dayActivities = [];
            let dailyCost = 0;

            // Morning Activity
            if (placesCopy.length > 0) {
                const morningPlace = placesCopy.shift()!;
                dayActivities.push({
                    time: 'morning' as const,
                    title: morningPlace.name,
                    description: `Explore ${morningPlace.type} • ${morningPlace.duration}`,
                    duration: morningPlace.duration,
                    cost: morningPlace.cost * travelers,
                    crowdLevel: morningPlace.crowdLevel,
                    placeId: morningPlace.id
                });
                dailyCost += morningPlace.cost * travelers;
            }

            // Afternoon/Evening Activity
            if (placesCopy.length > 0) {
                const afternoonPlace = placesCopy.shift()!;
                dayActivities.push({
                    time: 'afternoon' as const,
                    title: afternoonPlace.name,
                    description: `Experience ${afternoonPlace.bestSeason} vibes`,
                    duration: afternoonPlace.duration,
                    cost: afternoonPlace.cost * travelers,
                    crowdLevel: afternoonPlace.crowdLevel,
                    placeId: afternoonPlace.id
                });
                dailyCost += afternoonPlace.cost * travelers;
            }

            itinerary.push({
                day: i,
                title: `Day ${i}: ${dayActivities.length > 0 ? dayActivities[0].title : 'Leisure'}`,
                description: 'Enjoy the local sights and sounds.',
                activities: dayActivities,
                dailySpend: dailyCost
            });
        }

        return itinerary;
    },

    /**
     * Estimates the total budget for the trip.
     */
    estimateBudget: (
        destinationId: string,
        days: number,
        travelers: number,
        comfortLevel: 'budget' | 'moderate' | 'comfort' | 'luxury'
    ): BudgetBreakdown => {
        const destination = destinationsData.find(d => d.id === destinationId);
        const baseCost = destination?.averageDailyCost || 3000;

        // Multipliers based on comfort
        const comfortMultipliers = {
            budget: 0.7,
            moderate: 1.0,
            comfort: 1.5,
            luxury: 2.5
        };

        const multiplier = comfortMultipliers[comfortLevel];

        // Estimated breakdowns per person per day
        const dailyStay = baseCost * 0.4 * multiplier;
        const dailyFood = baseCost * 0.3 * multiplier;
        const dailyTransport = baseCost * 0.2 * multiplier; // Local transport
        const dailyActivities = baseCost * 0.1 * multiplier;

        // Total calculation
        const totalStay = dailyStay * days * travelers;
        const totalFood = dailyFood * days * travelers;
        const totalLocalTransport = dailyTransport * days * travelers;
        const totalActivities = dailyActivities * days * travelers;

        // Inter-city travel (flight/train) - flat estimate for now per person
        const interCityTravel = (comfortLevel === 'budget' ? 2000 : 5000) * travelers;

        const subTotal = totalStay + totalFood + totalLocalTransport + totalActivities + interCityTravel;
        const misc = subTotal * 0.1; // 10% buffer

        return {
            total: Math.round(subTotal + misc),
            travel: Math.round(interCityTravel + totalLocalTransport),
            stay: Math.round(totalStay),
            food: Math.round(totalFood),
            activities: Math.round(totalActivities),
            misc: Math.round(misc)
        };
    },

    /**
     * Suggests best destinations based on selected activity categories.
     */
    getBestDestinationsForActivities: (activityIds: string[]): DestinationItem[] => {
        const selectedActivities = activitiesData.filter(a => activityIds.includes(a.id));
        const categories = Array.from(new Set(selectedActivities.map(a => a.category)));

        // Score destinations based on category match
        const scoredDestinations = destinationsData.map(dest => {
            let score = 0;
            // Direct match of famous places
            // Simplified matching: check if destination category matches any activity category
            // or if tags overlap

            categories.forEach(cat => {
                if (dest.category === cat) score += 5;
            });

            // Check specific activity matches if possible (requires more complex data mapping), 
            // for now we use category and tags.

            return { dest, score };
        });

        return scoredDestinations
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(item => item.dest);
    }
};
