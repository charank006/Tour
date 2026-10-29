const mongoose = require('mongoose');
const crypto = require('crypto');
const weatherService = require('../services/weather.service');
const placesService = require('../services/places.service');
const routingService = require('../services/routing.service');
const costService = require('../services/cost.service');
const travelService = require('../services/travel.service');
const recommenderService = require('../providers/recommender.service');
const moodLogic = require('../logic/mood.logic');
const paceLogic = require('../logic/pace.logic');
const weatherLogic = require('../logic/weather.logic');
const schedulerLogic = require('../logic/scheduler.logic');
const clusteringLogic = require('../logic/clustering.logic');
const budgetLogic = require('../logic/budget.logic');
const fatigueLogic = require('../logic/fatigue.logic');
const Trip = require('../models/Trip');
const fileStore = require('../utils/store');
const seedPlacesData = require('../data/places.seed.json');

const isMongoConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

/**
 * Calculate duration in days between two date strings safely
 */
function calculateDurationDays(startDate, endDate) {
  if (!startDate || !endDate) return 3;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 3;
  const diffTime = end.getTime() - start.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, Math.min(30, days));
}

/**
 * Generate a complete trip plan
 */
exports.createTrip = async (req, res) => {
  try {
    const {
      destination = 'Jaipur',
      startLocation = 'New Delhi',
      startDate = new Date().toISOString().split('T')[0],
      endDate = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      travelers = 2,
      mood = 'Curious',
      pace = 'Medium',
      budget = 30000
    } = req.body;

    const durationDays = calculateDurationDays(startDate, endDate);
    const numTravelers = Math.max(1, Number(travelers) || 2);
    const totalBudget = Math.max(5000, Number(budget) || 30000);

    // 1. Weather Service (live or climatology)
    let weather = { temp: 22, rain: false, description: 'Pleasant (estimated)', meta: { source: 'estimated', degraded: true } };
    let weatherRules = { indoorPreference: false, packRainGear: false };
    try {
      weather = await weatherService.getWeather(destination, startDate);
      weatherRules = weatherLogic.apply(weather);
    } catch (err) {
      console.warn('[TripController] Weather fetch issue, using fallback:', err.message);
      weatherRules = weatherLogic.apply(weather);
    }

    // 2. Mood and Pace rules
    const moodRules = moodLogic.apply(mood);
    const paceRules = paceLogic.apply(pace, numTravelers);

    // 3. Parallel fetch: Places, Travel Options, Routing
    const [placesResult, transportResult, routeResult] = await Promise.allSettled([
      placesService.getPlaces(destination, weatherRules, moodRules),
      travelService.getTravelOptions(startLocation, destination, startDate),
      routingService.getRoute(startLocation, destination)
    ]);

    // Places processing
    let places = [];
    if (placesResult.status === 'fulfilled' && Array.isArray(placesResult.value) && placesResult.value.length > 0) {
      places = placesResult.value;
    } else {
      console.warn('[TripController] Places fetch produced no places. Consulting seed fallback.');
      const seedKey = destination.toLowerCase().trim();
      const raw = seedPlacesData[seedKey] || seedPlacesData.jaipur || seedPlacesData.default;
      places = raw.map((p, i) => ({
        ...p,
        location: `${destination}, India`,
        meta: { source: 'seed', degraded: true }
      }));
    }

    // Score places with Recommender Service (rule engine or active provider)
    const scoredPlacesResult = await recommenderService.scorePlaces(places, {
      mood,
      travelers: numTravelers,
      budget: totalBudget,
      dailyBudget: totalBudget / durationDays
    }, {
      weather,
      timeOfDay: '11:00'
    });
    const rankedPlaces = scoredPlacesResult.results || places;

    // Transport options
    let transportOptions = [
      { type: 'flight', operator: 'IndiGo', duration: '2h 15m', departure: '06:00 AM', cost: 4500, meta: { source: 'estimated' } },
      { type: 'train', operator: 'Shatabdi Exp', duration: '4h 45m', departure: '06:10 AM', cost: 1200, meta: { source: 'estimated' } },
      { type: 'bus', operator: 'Volvo Multi-Axle', duration: '6h 00m', departure: '09:00 PM', cost: 850, meta: { source: 'estimated' } }
    ];
    if (transportResult.status === 'fulfilled' && Array.isArray(transportResult.value) && transportResult.value.length > 0) {
      transportOptions = transportResult.value.map(opt => ({
        type: (opt.category || opt.type || 'flight').toLowerCase(),
        operator: opt.airline || opt.operator || 'Carrier',
        duration: opt.durationEstimate || opt.duration || 'N/A',
        departure: opt.departureTime || opt.departure || 'TBD',
        cost: Number(opt.priceEstimate || opt.price || 0)
      }));
    }

    // Routing
    let route = {
      start: startLocation,
      end: destination,
      distanceKm: 280,
      duration: '4h 30m',
      meta: { source: 'estimated', degraded: true }
    };
    if (routeResult.status === 'fulfilled' && routeResult.value && !routeResult.value.error) {
      route = routeResult.value;
    }

    // 4. Cost Estimation (Properly awaited, NaN-proof)
    let budgetTier = 'medium';
    if (totalBudget < 20000) budgetTier = 'low';
    if (totalBudget > 70000) budgetTier = 'high';

    const estimatedCost = await costService.estimateTripCost(
      startLocation,
      destination,
      startDate,
      durationDays,
      numTravelers,
      budgetTier
    );

    // 5. Stay options
    let stayType = 'Comfort';
    let costPerNight = 3500;
    if (totalBudget > 80000) {
      stayType = 'Luxury';
      costPerNight = 8000;
    } else if (totalBudget < 20000) {
      stayType = 'Budget';
      costPerNight = 1500;
    }

    const nights = Math.max(1, durationDays - 1);
    const stay = {
      type: stayType,
      area: `${destination} Heritage Quarter`,
      estimatedCostPerNight: costPerNight,
      nights
    };

    // 6. Explanations
    const whyThisDestination = `Perfect for your ${mood} mood with ${weather.description}.`;
    const budgetReasoning = `Optimized for ${numTravelers} traveler(s) within a ₹${totalBudget.toLocaleString('en-IN')} budget.`;
    const stayReasoning = `Selected ${stayType} accommodation for optimal comfort and accessibility.`;

    // 7. Scheduler Logic
    const dayPlansRaw = schedulerLogic.generateItinerary(rankedPlaces, durationDays, pace, weather);

    // 8. Clustering & Fatigue Balancing
    let dayPlans = dayPlansRaw;
    try {
      const dayPlansClustered = clusteringLogic.clusterItinerary(dayPlansRaw);
      dayPlans = fatigueLogic.balanceFatigue(dayPlansClustered, pace);
    } catch (clusterErr) {
      console.warn('[TripController] Clustering failed, using raw itinerary:', clusterErr.message);
      dayPlans = dayPlansRaw;
    }

    // Ensure all days have safe format
    dayPlans = dayPlans.map((day, idx) => ({
      day: day.day || idx + 1,
      theme: day.theme || 'Discovery & Exploration',
      date: new Date(new Date(startDate).getTime() + 86400000 * idx).toISOString().split('T')[0],
      activities: (day.activities || []).map(a => ({
        time: a.time || 'Morning',
        title: a.title || a.name || 'Local Landmark',
        description: a.description || `Explore ${a.title || a.name}.`,
        duration: a.duration || '2 hours',
        cost: Number(a.cost) || 0,
        type: a.type || a.category || 'Sightseeing'
      })),
      optionalActivities: day.optionalActivities || []
    }));

    let plan = {
      planSummary: `A curated ${durationDays}-day ${stayType} itinerary to ${destination}`,
      whyThisDestination,
      budgetReasoning,
      stayReasoning,
      weather,
      route,
      estimatedCost,
      stay,
      transportOptions,
      rules: { weatherRules, moodRules, paceRules },
      places: rankedPlaces,
      dayPlans,
      meta: {
        recommenderProvider: scoredPlacesResult.meta?.provider || 'rule',
        fallbackApplied: scoredPlacesResult.meta?.fallbackApplied || false,
        degraded: weather.meta?.degraded || route.meta?.degraded || places[0]?.meta?.degraded || false
      }
    };

    // 9. Budget Optimization
    plan = budgetLogic.optimizeTrip(plan, totalBudget);

    // 10. Generate Share ID and construct response
    const shareId = `share_${crypto.randomBytes(6).toString('hex')}`;
    const tripId = `trip_${Date.now()}`;

    const tripResponse = {
      _id: tripId,
      id: tripId,
      shareId,
      userId: req.user?.id || null,
      destination,
      startLocation,
      startDate,
      endDate,
      durationDays,
      travelers: numTravelers,
      mood,
      pace,
      budget: totalBudget,
      plan,
      createdAt: new Date().toISOString()
    };

    // Save to persistence store (MongoDB or JSON fileStore)
    if (isMongoConnected()) {
      try {
        const mongoTrip = new Trip(tripResponse);
        await mongoTrip.save();
        tripResponse._id = mongoTrip._id.toString();
        tripResponse.id = mongoTrip._id.toString();
      } catch (dbErr) {
        console.warn('[TripController] Mongo save failed, using fileStore fallback:', dbErr.message);
        fileStore.saveTrip(tripResponse);
      }
    } else {
      fileStore.saveTrip(tripResponse);
    }

    return res.status(200).json(tripResponse);

  } catch (err) {
    console.error('[TripController] Global Error:', err);
    // Bulletproof: Never throw or return empty plan to client!
    const fallbackDestination = req.body?.destination || 'Jaipur';
    const fallbackDays = 3;
    const fallbackSeeds = seedPlacesData.jaipur || seedPlacesData.default;

    const safeFallbackPlan = {
      _id: `fallback-${Date.now()}`,
      id: `fallback-${Date.now()}`,
      shareId: `share_${Date.now().toString(36)}`,
      destination: fallbackDestination,
      startLocation: req.body?.startLocation || 'New Delhi',
      startDate: req.body?.startDate || new Date().toISOString().split('T')[0],
      endDate: req.body?.endDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      travelers: Number(req.body?.travelers) || 2,
      mood: req.body?.mood || 'Curious',
      pace: req.body?.pace || 'Medium',
      budget: Number(req.body?.budget) || 30000,
      plan: {
        planSummary: `A 3-day cultural journey to ${fallbackDestination}`,
        whyThisDestination: `Curated highlights for ${fallbackDestination}.`,
        weather: { temp: 22, rain: false, description: 'Mild (estimated)', meta: { source: 'estimated', degraded: true } },
        route: { start: req.body?.startLocation || 'New Delhi', end: fallbackDestination, distanceKm: 280, duration: '4h 30m', meta: { source: 'estimated', degraded: true } },
        estimatedCost: { total: 18000, transport: 5000, stay: 6000, food: 4000, activities: 2000, misc: 1000, perPerson: 9000 },
        stay: { type: 'Comfort', area: 'City Center', estimatedCostPerNight: 3000, nights: 2 },
        transportOptions: [
          { type: 'flight', operator: 'Carrier', duration: '2h 15m', departure: '07:00 AM', cost: 4500 },
          { type: 'train', operator: 'Express', duration: '5h', departure: '08:00 AM', cost: 1200 },
          { type: 'bus', operator: 'Coach', duration: '6h', departure: '09:00 PM', cost: 800 }
        ],
        places: fallbackSeeds,
        dayPlans: [1, 2, 3].map(d => ({
          day: d,
          theme: `Day ${d} Highlights`,
          activities: fallbackSeeds.slice((d - 1) * 2, d * 2).map(p => ({
            time: 'Morning',
            title: p.name,
            description: `Visit ${p.name}.`,
            duration: '2 hours',
            cost: p.cost || 0
          }))
        })),
        meta: { source: 'fallback', degraded: true }
      }
    };

    return res.status(200).json(safeFallbackPlan);
  }
};

/**
 * Save custom or updated trip
 */
exports.saveTrip = async (req, res) => {
  try {
    const tripData = req.body;
    if (!tripData) return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Trip payload required' } });

    let savedTrip = null;
    if (isMongoConnected()) {
      try {
        if (tripData._id && mongoose.Types.ObjectId.isValid(tripData._id)) {
          savedTrip = await Trip.findByIdAndUpdate(tripData._id, tripData, { new: true, upsert: true });
        } else {
          const doc = new Trip(tripData);
          savedTrip = await doc.save();
        }
      } catch (err) {
        console.warn('[TripController] Mongo save error, falling back to fileStore:', err.message);
      }
    }

    if (!savedTrip) {
      savedTrip = fileStore.saveTrip(tripData);
    }

    return res.json({ success: true, trip: savedTrip });
  } catch (error) {
    console.error('[TripController] saveTrip error:', error);
    const saved = fileStore.saveTrip(req.body);
    return res.json({ success: true, trip: saved });
  }
};

/**
 * Get all trips for current user or guest
 */
exports.getMyTrips = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (isMongoConnected()) {
      try {
        const query = userId && userId !== 'guest' ? { userId } : {};
        const trips = await Trip.find(query).sort({ createdAt: -1 }).limit(50);
        if (trips && trips.length > 0) {
          return res.json(trips);
        }
      } catch (dbErr) {
        console.warn('[TripController] Mongo find failed, falling back to fileStore:', dbErr.message);
      }
    }

    const storedTrips = fileStore.getAllTrips(userId);
    return res.json(storedTrips);
  } catch (err) {
    console.error('[TripController] getMyTrips error:', err);
    return res.json(fileStore.getAllTrips());
  }
};

/**
 * Get single trip by ID or shareId
 */
exports.getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: { code: 'INVALID_ID', message: 'ID required' } });

    if (isMongoConnected() && mongoose.Types.ObjectId.isValid(id)) {
      try {
        const trip = await Trip.findById(id);
        if (trip) return res.json(trip);
      } catch (err) {
        console.warn('[TripController] Mongo lookup error:', err.message);
      }
    }

    // Try finding by shareId or raw ID in mongo
    if (isMongoConnected()) {
      try {
        const trip = await Trip.findOne({ $or: [{ shareId: id }, { _id: id }] });
        if (trip) return res.json(trip);
      } catch {}
    }

    // Fallback to fileStore
    const fileTrip = fileStore.getTripById(id);
    if (fileTrip) return res.json(fileTrip);

    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Trip not found' } });
  } catch (err) {
    console.error('[TripController] getTripById error:', err);
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Trip not found' } });
  }
};

/**
 * Delete a trip by ID
 */
exports.deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: { code: 'INVALID_ID', message: 'ID required' } });

    let deleted = false;
    if (isMongoConnected() && mongoose.Types.ObjectId.isValid(id)) {
      try {
        const resMongo = await Trip.findByIdAndDelete(id);
        if (resMongo) deleted = true;
      } catch (err) {
        console.warn('[TripController] Mongo delete failed:', err.message);
      }
    }

    const fileDeleted = fileStore.deleteTrip(id);
    if (deleted || fileDeleted) {
      return res.json({ success: true, message: 'Trip deleted successfully' });
    }

    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Trip not found to delete' } });
  } catch (err) {
    console.error('[TripController] deleteTrip error:', err);
    return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};
