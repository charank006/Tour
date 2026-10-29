const travelService = require('./travel.service');
const hotelsService = require('./hotels.service');

/**
 * Calculates a guaranteed, NaN-proof budget breakdown for a trip.
 */
exports.estimateTripCost = async (fromCity, toCity, date, durationDays = 3, travelers = 2, budgetLevel = 'medium') => {
  // Support flexible arguments if called with numbers directly
  let from = fromCity;
  let to = toCity;
  let dDays = Number(durationDays) || 3;
  let pax = Number(travelers) || 2;
  let level = budgetLevel;

  // If first param was a distance number (e.g. legacy signature `estimateTripCost(distanceKm, durationDays, travelers)`)
  if (typeof fromCity === 'number' || (!isNaN(Number(fromCity)) && typeof toCity === 'number')) {
    dDays = Math.max(1, Number(toCity) || 3);
    pax = Math.max(1, Number(date) || 2);
    from = 'Origin';
    to = 'Destination';
    level = 'medium';
  }

  dDays = Math.max(1, Math.round(dDays));
  pax = Math.max(1, Math.round(pax));

  // 1. Travel Cost
  let travelCostPerPerson = 2000;
  if (level === 'high' || level === 'luxury') travelCostPerPerson = 6000;
  if (level === 'low' || level === 'budget') travelCostPerPerson = 1200;

  try {
    if (from && to && typeof from === 'string' && typeof to === 'string') {
      const travelOptions = await travelService.getTravelOptions(from, to, date || new Date().toISOString());
      if (travelOptions && Array.isArray(travelOptions) && travelOptions.length > 0) {
        const validOptions = travelOptions.filter(o => Number(o.priceEstimate || o.price) > 0);
        if (validOptions.length > 0) {
          const cheapest = validOptions.reduce((min, o) =>
            (Number(o.priceEstimate || o.price) < Number(min.priceEstimate || min.price)) ? o : min
          );
          travelCostPerPerson = Number(cheapest.priceEstimate || cheapest.price) || travelCostPerPerson;
        }
      }
    }
  } catch (err) {
    console.warn('[CostService] Dynamic travel cost fallback used:', err.message);
  }

  const totalTravel = Math.round(travelCostPerPerson * pax);

  // 2. Stay Cost
  let hotelCostPerNight = 3200; // Medium / Comfort
  if (level === 'low' || level === 'budget') hotelCostPerNight = 1400;
  if (level === 'high' || level === 'luxury') hotelCostPerNight = 8500;

  try {
    if (to && typeof to === 'string') {
      const hotels = await hotelsService.getHotels(to, level);
      if (hotels && Array.isArray(hotels) && hotels.length > 0) {
        hotelCostPerNight = Number(hotels[0].priceEstimate) || hotelCostPerNight;
      }
    }
  } catch (err) {
    console.warn('[CostService] Dynamic hotel cost fallback used:', err.message);
  }

  const rooms = Math.max(1, Math.ceil(pax / 2));
  const nights = Math.max(1, dDays - 1);
  const totalStay = Math.round(hotelCostPerNight * nights * rooms);

  // 3. Food & Activities
  const dailyFoodPerPax = level === 'high' || level === 'luxury' ? 2500 : (level === 'low' || level === 'budget' ? 700 : 1400);
  const dailyActivityPerPax = level === 'high' || level === 'luxury' ? 2000 : (level === 'low' || level === 'budget' ? 400 : 900);

  const totalFood = Math.round(dailyFoodPerPax * dDays * pax);
  const totalActivities = Math.round(dailyActivityPerPax * dDays * pax);

  // 4. Buffer
  const subtotal = totalTravel + totalStay + totalFood + totalActivities;
  const misc = Math.round(subtotal * 0.10);
  const total = subtotal + misc;
  const perPerson = Math.max(1, Math.round(total / pax));

  return {
    total,
    transport: totalTravel,
    stay: totalStay,
    accommodation: totalStay, // For backward compatibility with budgetLogic
    food: totalFood,
    activities: totalActivities,
    buffer: misc,
    misc,
    perPerson,
    breakdown: {
      travel: totalTravel,
      stay: totalStay,
      food: totalFood,
      activities: totalActivities,
      misc
    },
    meta: { source: 'estimated', degraded: false }
  };
};
