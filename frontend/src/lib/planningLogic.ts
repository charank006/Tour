import { DestinationItem, PlaceItem, ActivityItem, destinationsData, activitiesData } from '@/data/staticDiscoveryData';

interface DailyPlan {
    day: number;
    title: string;
    description: string;
    activities: {
        time: string;
        title: string;
        description: string;
        duration: string;
        cost: number;
        crowdLevel: string;
        placeId: string;
        tags: string[];
        image?: string;
        reason?: string;
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

export type WeatherCondition = 'Sunny' | 'Rainy' | 'Cloudy' | 'Hot' | 'Pleasant';

export const planningLogic = {

    /**
     * Generates a smart itinerary based on destination and constraints.
     */

    /**
     * Generates a smart, time-aware itinerary based on destination and constraints.
     */
    generateSmartItinerary: (
        destinationId: string,
        days: number,
        travelers: number,
        selectedPlaceIds: string[] = [],
        weather: WeatherCondition = 'Pleasant' // Default to ideal
    ): DailyPlan[] => {
        const destination = destinationsData.find(d => d.id === destinationId);
        if (!destination) throw new Error('Destination not found');

        let placesToVisit: PlaceItem[] = [];

        // 1. Prioritize user selections
        if (selectedPlaceIds.length > 0) {
            placesToVisit = destination.places.filter(p => selectedPlaceIds.includes(p.id));
        }

        // 2. Fill with smart recommendations if needed
        const getSmartScore = (place: PlaceItem) => (place.popularityScore * 0.6) + ((place.crowdLevel === 'Low' ? 3 : 1) * 1.5);

        const remainingPlaces = destination.places
            .filter(p => !placesToVisit.includes(p))
            .sort((a, b) => getSmartScore(b) - getSmartScore(a));

        // We target ~4 activities per day for a full experience
        const targetCount = days * 4;
        if (placesToVisit.length < targetCount) {
            placesToVisit = [...placesToVisit, ...remainingPlaces.slice(0, targetCount - placesToVisit.length)];
        }

        const itinerary: DailyPlan[] = [];
        let availablePlaces = [...placesToVisit];

        // Helper: Check weather suitability
        const getWeatherSuitability = (place: PlaceItem, timeSlot: string): { suitable: boolean; status?: string } => {
            // Hot Weather Logic
            if (weather === 'Hot') {
                if (['Midday', 'Afternoon'].includes(timeSlot) && place.locationType === 'Outdoor') {
                    return { suitable: false, status: 'Too Hot 🔥' };
                }
                if (place.locationType === 'Indoor') return { suitable: true, status: 'Cool Indoor ❄️' };
            }

            // Rainy Weather Logic
            if (weather === 'Rainy') {
                if (place.locationType === 'Outdoor' && place.weatherSensitivity === 'High') {
                    return { suitable: false, status: 'Rain Risk 🌧️' };
                }
                if (place.locationType === 'Indoor') return { suitable: true, status: 'Dry Options ☂️' };
            }

            // Ideal Logic
            if (weather === 'Pleasant' || weather === 'Sunny') {
                if (place.locationType === 'Outdoor') return { suitable: true, status: 'Perfect Weather ☀️' };
            }

            return { suitable: true };
        };

        // Specific Time Slot Logic
        const findForSlot = (time: string, excludeIds: string[]) => {
            // Precise Match
            let match = availablePlaces.find(p => p.bestTime === time && !excludeIds.includes(p.id));

            // Filter by weather if match found
            if (match) {
                const suit = getWeatherSuitability(match, time);
                if (!suit.suitable) match = undefined; // Skip if bad weather fit
            }

            if (match) return match;

            // Loose Match Mapping
            const looseMap: any = {
                'Sunrise': ['Morning'],
                'Morning': ['Sunrise', 'Any'],
                'Midday': ['Afternoon', 'Any'],
                'Sunset': ['Evening'],
                'Evening': ['Sunset', 'Any']
            };

            const fallbacks = looseMap[time] || [];

            // Search with loose match AND weather check
            match = availablePlaces.find(p => {
                if (!fallbacks.includes(p.bestTime) || excludeIds.includes(p.id)) return false;
                const suit = getWeatherSuitability(p, time);
                return suit.suitable;
            });

            // Last Resort: Fill holes if we have extra places, but still respect strict weather constraints (like Rain + High Sensitivity)
            if (!match && availablePlaces.length > 0) {
                match = availablePlaces.find(p => {
                    if (['Sunrise', 'Sunset'].includes(p.bestTime) || excludeIds.includes(p.id)) return false;
                    // Only strict filter for rain/high sensitivity here, otherwise be lenient
                    if (weather === 'Rainy' && p.locationType === 'Outdoor' && p.weatherSensitivity === 'High') return false;
                    return true;
                });
            }
            return match;
        };

        // Day 0: Travel TO
        itinerary.push({
            day: 0,
            title: `Unbound Travel: Journey to ${destination.name}`,
            description: "Your adventure begins with a seamless journey.",
            dailySpend: 15000 * travelers, // Mock flight cost
            activities: [{
                time: 'All Day',
                title: `Flight to ${destination.name}`,
                description: "Relax as you travel to your destination.",
                duration: "2h 45m",
                cost: 15000 * travelers,
                isTravel: true,
                travelType: 'Flight',
                image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&auto=format&fit=crop&q=60'
            }]
        });

        for (let i = 1; i <= days; i++) {
            const dayActs: any[] = [];
            let dailyCost = 0;
            const usedIdsInDay: string[] = [];

            const addToDay = (slotName: string, timeId: string) => {
                const place = findForSlot(timeId, usedIdsInDay);
                if (place) {
                    // Remove from global available pool so we don't repeat across days
                    availablePlaces = availablePlaces.filter(p => p.id !== place.id);
                    usedIdsInDay.push(place.id);

                    const weatherInfo = getWeatherSuitability(place, slotName);

                    // Smart Alternative Logic
                    let alternative = undefined;
                    const isCrowded = place.crowdLevel === 'High';
                    const isBadWeather = weatherInfo.status?.includes('Too Hot') || weatherInfo.status?.includes('Rain');

                    if (isCrowded || isBadWeather) {
                        const potentialAlt = destination.places.find(p =>
                            p.id !== place.id &&
                            !usedIdsInDay.includes(p.id) &&
                            // !placesToVisit.some(v => v.id === p.id) && // Allow swapping with other planned spots if needed, but safer to look outside
                            p.type === place.type && // Same vibe
                            (
                                // If crowd is the issue, find less crowded
                                (isCrowded && p.crowdLevel !== 'High') ||
                                // If weather is the issue, find better location type
                                (isBadWeather && getWeatherSuitability(p, slotName).suitable)
                            )
                        );

                        if (potentialAlt) {
                            alternative = {
                                name: potentialAlt.name,
                                reason: isBadWeather ? 'Better weather fit' : 'Less crowded'
                            };
                        }
                    }

                    dayActs.push({
                        time: slotName, // 'Sunrise', 'Morning', etc.
                        title: place.name,
                        description: place.type + ' Experience',
                        duration: place.duration,
                        cost: place.cost * travelers,
                        crowdLevel: place.crowdLevel,
                        placeId: place.id,
                        image: place.image,
                        tags: [place.bestSeason],
                        reason: place.bestTime === timeId ? `Perfect for ${timeId}` : 'Recommended Visit',
                        crowdTimeline: place.crowdTimeline, // Pass through
                        bestWindow: place.bestWindow, // Pass through
                        weatherStatus: weatherInfo.status, // NEW FIELD
                        alternative: alternative, // NEW FIELD
                        locationType: place.locationType // NEW FIELD
                    });
                    dailyCost += place.cost * travelers;
                }
            };

            // 5 Slots per Day
            addToDay('Sunrise', 'Sunrise');
            addToDay('Morning', 'Morning');
            addToDay('Midday', 'Afternoon'); // Midday usually matches 'Afternoon' or indoor
            addToDay('Sunset', 'Sunset');
            addToDay('Evening', 'Evening');

            if (dayActs.length > 0) {
                itinerary.push({
                    day: i,
                    title: `Day ${i}: ${dayActs[0].title} & Exploration`,
                    description: 'A curated journey through the best local experiences.',
                    activities: dayActs, // Note: This ignores the interface type mismatch for now, we will update interface in next step
                    dailySpend: dailyCost
                });
            }
        }

        // Final Day: Travel BACK
        itinerary.push({
            day: days + 1,
            title: `Return: Journey Home`,
            description: "Wrap up your memories and head back.",
            dailySpend: 0,
            activities: [{
                time: 'Morning',
                title: `Return Journey`,
                description: "Travel back home safe and sound.",
                duration: "3h 00m",
                cost: 0,
                isTravel: true,
                travelType: 'Flight', // Could be dynamic
                image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&auto=format&fit=crop&q=60'
            }]
        });

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

            categories.forEach(cat => {
                if (dest.category === cat) score += 5;
            });
            // Boost matches with explicit Place types
            dest.places.forEach(p => {
                // Simple keyword matching for now
                if (categories.some(c => c === p.type)) score += 1;
            });

            return { dest, score };
        });

        return scoredDestinations
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(item => item.dest);
    },

    /**
     * Gets places specific to an activity, with sorting.
     */
    getPlacesForActivity: (
        activityId: string,
        destinationId: string,
        ranking: 'famous' | 'balanced' | 'quiet' = 'famous'
    ): PlaceItem[] => {
        const destination = destinationsData.find(d => d.id === destinationId);
        if (!destination) return [];

        const matchingPlaces = destination.places.filter(p =>
            p.activityIds?.includes(activityId) ||
            // Fallback: match by generic type if no specific activity map
            p.type === activitiesData.find(a => a.id === activityId)?.category
        );

        return planningLogic.sortPlaces(matchingPlaces, ranking);
    },

    /**
     * Sorts places based on criteria.
     */
    sortPlaces: (places: PlaceItem[], criterion: 'famous' | 'balanced' | 'quiet'): PlaceItem[] => {
        const getScore = (p: PlaceItem) => {
            const crowdScore = p.crowdLevel === 'Low' ? 3 : p.crowdLevel === 'Medium' ? 2 : 1;

            if (criterion === 'famous') return p.popularityScore;
            if (criterion === 'quiet') return crowdScore * 10 - p.popularityScore; // Prioritize mostly crowd, tie-break low popularity
            // Balanced
            return (p.popularityScore * 0.5) + (crowdScore * 1.5);
        };

        return [...places].sort((a, b) => getScore(b) - getScore(a));
    }
};
