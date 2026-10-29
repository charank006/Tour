import { destinationsData, DestinationItem } from '@/data/staticDiscoveryData';
import { CreateTripPayload, ServerTripResponse, DayPlan, TransportOption, StayOption } from '@/api/api';
import { calculateDays } from './formatters';

/**
 * Client-Side Weighted Scoring Engine (Mirror of backend logic)
 * interest*3 + budgetFit*2 + seasonFit*2 + weatherFit*2 + crowd*1.5 + popularity*0.5
 */
function scoreClientPlace(place: {
  name: string;
  type?: string;
  popularityScore?: number;
  cost?: number;
  weatherSensitivity?: string;
  locationType?: string;
}, prefs: CreateTripPayload) {
  const category = (place.type || '').toLowerCase();
  const mood = (prefs.mood || '').toLowerCase();
  let interestScore = 7.0;

  if (mood === 'mountains' && (category.includes('nature') || category.includes('adventure'))) interestScore = 9.5;
  if (mood === 'heritage' && category.includes('heritage')) interestScore = 9.8;
  if (mood === 'coastal' && (category.includes('nature') || category.includes('relaxation'))) interestScore = 9.5;
  if (mood === 'adventure' && category.includes('adventure')) interestScore = 10.0;

  const cost = Number(place.cost) || 0;
  const budgetFit = cost === 0 ? 10.0 : cost < 500 ? 8.5 : 6.0;
  const weatherFit = place.locationType === 'Indoor' ? 9.5 : 8.0;
  const crowdScore = 8.0;
  const popularity = place.popularityScore || 8.5;

  const rawScore = interestScore * 3 + budgetFit * 2 + 8.5 * 2 + weatherFit * 2 + crowdScore * 1.5 + popularity * 0.5;
  const matchPercent = Math.min(98, Math.max(75, Math.round((rawScore / 110) * 100)));

  return {
    score: Math.round(rawScore * 10) / 10,
    matchPercent,
    reasons: [`Curated highlight matching your ${prefs.mood || 'travel'} preferences`, 'Optimized for gentle daily pacing']
  };
}

export function generateOfflineTripPlan(payload: CreateTripPayload): ServerTripResponse {
  const destName = payload.destination || 'Jaipur';
  const startCity = payload.startLocation || 'Mumbai';
  const startDate = payload.startDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0];
  const endDate = payload.endDate || new Date(Date.now() + 86400000 * 11).toISOString().split('T')[0];
  const totalDays = calculateDays(startDate, endDate);
  const travelers = Math.max(1, Number(payload.travelers) || 2);
  const totalBudget = Math.max(10000, Number(payload.budget) || 30000);

  // Match destination from static discovery data or fallback
  const matchedDest: DestinationItem | undefined = destinationsData.find(
    (d) => d.name.toLowerCase() === destName.toLowerCase() || destName.toLowerCase().includes(d.name.toLowerCase())
  ) || destinationsData[0];

  const rawPlaces = matchedDest?.places || [];
  const scoredPlaces = rawPlaces.map((p) => {
    const sc = scoreClientPlace(p, payload);
    return {
      name: p.name,
      category: p.type || 'Attraction',
      rating: p.popularityScore || 8.8,
      cost: p.cost || 0,
      score: sc.score,
      matchPercent: sc.matchPercent,
      reasons: sc.reasons
    };
  });

  // Calculate realistic transport based on distance
  const isFar = startCity.toLowerCase() !== destName.toLowerCase();
  const baseFlightCost = 4200;
  const baseTrainCost = 1200;
  const baseBusCost = 850;

  const transportOptions: TransportOption[] = [
    {
      type: 'flight',
      operator: 'IndiGo Air Express',
      duration: '2h 15m',
      departure: '06:30 AM',
      cost: baseFlightCost,
      badge: 'fastest'
    },
    {
      type: 'train',
      operator: 'Shatabdi Express',
      duration: '5h 30m',
      departure: '06:00 AM',
      cost: baseTrainCost,
      badge: 'recommended'
    },
    {
      type: 'bus',
      operator: 'Volvo Multi-Axle Sleeper',
      duration: '8h 00m',
      departure: '09:30 PM',
      cost: baseBusCost,
      badge: 'cheapest'
    }
  ];

  // Budget Tier & Stay computation
  let stayType = 'Comfort';
  let costPerNight = 3200;
  if (totalBudget < 20000) {
    stayType = 'Budget';
    costPerNight = 1200;
  } else if (totalBudget > 65000) {
    stayType = 'Luxury';
    costPerNight = 8500;
  }

  const nights = Math.max(1, totalDays - 1);
  const rooms = Math.ceil(travelers / 2);
  const totalStayCost = costPerNight * nights * rooms;
  const totalTransportCost = baseTrainCost * travelers;
  const dailyFoodPax = stayType === 'Luxury' ? 2200 : stayType === 'Budget' ? 600 : 1200;
  const totalFoodCost = dailyFoodPax * totalDays * travelers;
  const totalActivityCost = 600 * totalDays * travelers;
  const subtotal = totalStayCost + totalTransportCost + totalFoodCost + totalActivityCost;
  const misc = Math.round(subtotal * 0.1);
  const totalEstimated = subtotal + misc;

  // Distribute places across all requested days
  const dayPlans: DayPlan[] = [];
  const placesPool = [...scoredPlaces];

  for (let d = 1; d <= totalDays; d++) {
    const dayDate = new Date(new Date(startDate).getTime() + 86400000 * (d - 1)).toISOString().split('T')[0];
    const morningPlace = placesPool[(d * 2 - 2) % (placesPool.length || 1)] || { name: `${destName} Heritage Trail`, category: 'Walking Trail', cost: 0 };
    const afternoonPlace = placesPool[(d * 2 - 1) % (placesPool.length || 1)] || { name: `${destName} Cultural Bazaar`, category: 'Bazaar & Tea', cost: 0 };
    const eveningPlace = placesPool[(d * 2) % (placesPool.length || 1)] || { name: `${destName} Sunset Point`, category: 'Scenic Overlook', cost: 0 };

    dayPlans.push({
      day: d,
      theme: d === 1 ? 'Arrival & Orientation' : d === totalDays ? 'Memories & Departure' : 'Heart of Exploration',
      date: dayDate,
      activities: [
        {
          time: 'Morning (09:00 AM)',
          title: morningPlace.name,
          description: `Guided morning discovery of ${morningPlace.name}. Ideal for early photos and avoiding noon crowds.`,
          duration: '2.5 hours',
          cost: morningPlace.cost || 0,
          type: morningPlace.category
        },
        {
          time: 'Afternoon (02:00 PM)',
          title: afternoonPlace.name,
          description: `Visit ${afternoonPlace.name} with local artisan lunch nearby.`,
          duration: '2 hours',
          cost: afternoonPlace.cost || 0,
          type: afternoonPlace.category
        },
        {
          time: 'Evening (05:30 PM)',
          title: eveningPlace.name,
          description: `Golden hour sunset experience at ${eveningPlace.name}.`,
          duration: '1.5 hours',
          cost: eveningPlace.cost || 0,
          type: eveningPlace.category
        }
      ],
      optionalActivities: [
        {
          time: 'Night',
          title: 'Starlight Local Dining',
          description: 'Authentic regional dinner and rooftop courtyard acoustic music.',
          duration: '1.5 hours',
          cost: 450
        }
      ]
    });
  }

  const tripId = `offline_trip_${Date.now()}`;

  return {
    _id: tripId,
    id: tripId,
    shareId: `share_offline_${Date.now().toString(36)}`,
    destination: destName,
    startLocation: startCity,
    startDate,
    endDate,
    durationDays: totalDays,
    travelers,
    mood: payload.mood || 'Curious',
    pace: payload.pace || 'Balanced',
    budget: totalBudget,
    createdAt: new Date().toISOString(),
    plan: {
      planSummary: `A thoughtful ${totalDays}-day ${stayType.toLowerCase()} journey through ${destName}`,
      whyThisDestination: `Hand-crafted for your ${payload.mood || 'curious'} pace with balanced rest windows.`,
      budgetReasoning: `Budget distributed for ${travelers} traveler(s) over ${totalDays} days with a 10% safety cushion.`,
      stayReasoning: `Selected ${stayType} accommodation for walkability and charm.`,
      weather: {
        temp: 23,
        feelsLike: 23,
        description: 'Pleasant & clear (offline estimate)',
        rain: false,
        meta: { source: 'offline-climatology', degraded: true }
      },
      route: {
        start: startCity,
        end: destName,
        distanceKm: isFar ? 320 : 50,
        duration: isFar ? '5h 30m' : '1h 15m',
        meta: { source: 'offline-estimate', degraded: true }
      },
      estimatedCost: {
        total: totalEstimated,
        travel: totalTransportCost,
        transport: totalTransportCost,
        stay: totalStayCost,
        food: totalFoodCost,
        activities: totalActivityCost,
        misc,
        buffer: misc,
        perPerson: Math.round(totalEstimated / travelers)
      },
      stay: {
        type: stayType,
        area: `${destName} Old Town`,
        estimatedCostPerNight: costPerNight,
        nights
      },
      transportOptions,
      places: scoredPlaces,
      dayPlans,
      meta: {
        source: 'offline',
        degraded: true,
        recommenderProvider: 'rule-client'
      }
    }
  };
}
