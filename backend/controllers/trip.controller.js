const weatherService = require('../services/weather.service');
const placesService = require('../services/places.service');
const routingService = require('../services/routing.service');
const costService = require('../services/cost.service');
const aiService = require('../services/ai.service');
const travelService = require('../services/travel.service');
const moodLogic = require('../logic/mood.logic');
const paceLogic = require('../logic/pace.logic');
const weatherLogic = require('../logic/weather.logic');
const schedulerLogic = require('../logic/scheduler.logic'); // Import Scheduler
const clusteringLogic = require('../logic/clustering.logic'); // Import Clustering
const budgetLogic = require('../logic/budget.logic');
const fatigueLogic = require('../logic/fatigue.logic');

exports.createTrip = async (req, res) => {
    try {
        const { destination, startLocation, startDate, endDate, travelers, mood, pace, budget } = req.body;

        console.log("Creating trip for:", destination);

        // 1. Weather Service
        let weather = { temp: 20, rain: false, description: "Sunny (Default)" }; // Fallback
        let weatherRules = {};
        try {
            weather = await weatherService.getWeather(destination);
            weatherRules = weatherLogic.apply(weather);
        } catch (err) {
            console.error("Weather Service Failed:", err.message);
            // Non-critical, continue with default
            weatherRules = weatherLogic.apply(weather);
        }

        // Logic
        const moodRules = moodLogic.apply(mood);
        const paceRules = paceLogic.apply(pace, travelers);

        // 2. Places + Transport (parallel for speed)
        const routeStart = startLocation || 'New Delhi';

        const [placesResult, transportResult, routeResult] = await Promise.allSettled([
            placesService.getPlaces(destination, weatherRules, moodRules),
            travelService.getTravelOptions(routeStart, destination, startDate),
            routingService.getRoute(routeStart, destination)
        ]);

        let places = [];
        if (placesResult.status === 'fulfilled') {
            places = placesResult.value || [];
            console.log(`Found ${places.length} places for ${destination}`);
        } else {
            console.error("Places Service Failed:", placesResult.reason?.message);
        }

        // Normalize transport options for frontend
        let transportOptions = [
            { type: 'flight', operator: 'IndiGo', duration: '2h 15m', departure: '06:00 AM', cost: 4500 },
            { type: 'train', operator: 'Shatabdi Exp', duration: '6h 00m', departure: '07:00 AM', cost: 1200 },
            { type: 'bus', operator: 'Volvo AC', duration: '10h 00m', departure: '09:00 PM', cost: 800 }
        ];
        if (transportResult.status === 'fulfilled' && Array.isArray(transportResult.value) && transportResult.value.length > 0) {
            transportOptions = transportResult.value.map(opt => ({
                type: opt.category?.toLowerCase() || opt.type || 'flight',
                operator: opt.airline || opt.operator || 'Carrier',
                duration: opt.durationEstimate || opt.duration || 'N/A',
                departure: opt.departureTime || opt.departure || 'TBD',
                cost: opt.priceEstimate || opt.price || 0
            }));
        } else {
            console.warn("Transport Service Failed — using fallback data.");
        }

        // 3. Routing
        let route = { distanceKm: 0, duration: 'N/A' };
        if (routeResult.status === 'fulfilled') {
            route = routeResult.value;
        } else {
            console.error("Routing failed, defaulting to empty route:", routeResult.reason?.message);
            route = { start: routeStart, end: destination, distanceKm: 0, duration: "Unknown", apiDurationMin: 0 };
        }

        // 4. Cost Estimation
        let durationDays = 1;
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            const diffTime = Math.abs(end - start);
            durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }

        if (durationDays < 1) durationDays = 1;
        const estimatedCost = costService.estimateTripCost(route.distanceKm || 0, durationDays, travelers || 1);

        // 5. Stay Suggestions (Deterministic)
        const totalBudget = Number(budget) || 50000;
        let stayType = "Comfort";
        let costPerNight = 3500;

        if (totalBudget > 80000) {
            stayType = "Luxury";
            costPerNight = 8000;
        } else if (totalBudget < 20000) {
            stayType = "Budget";
            costPerNight = 1500;
        }

        const nights = durationDays > 1 ? durationDays - 1 : 1;
        const stay = {
            type: stayType,
            area: "City Center", // Generic for now
            estimatedCostPerNight: costPerNight,
            nights
        };

        const planSummary = `A ${durationDays}-day ${stayType} trip to ${destination}`;

        // 6. Explanations (Deterministic)
        const whyThisDestination = `Perfect for your ${mood} mood with currently ${weather.description} weather.`;
        const budgetReasoning = `Optimized for ${travelers} traveler(s) within a ${budget} budget.`;
        const stayReasoning = `Selected ${stayType} accommodation to maximize comfort within budget.`;

        // 7. Scheduler Logic (NEW)
        const dayPlansRaw = schedulerLogic.generateItinerary(places, durationDays, pace, weather);

        // 7b. Clustering Logic (NEW)
        // Optimize days by geography
        const dayPlansClustered = clusteringLogic.clusterItinerary(dayPlansRaw);

        // 7c. Fatigue Balancing (NEW)
        const dayPlans = fatigueLogic.balanceFatigue(dayPlansClustered, pace);

        let plan = {
            planSummary,
            whyThisDestination,
            budgetReasoning,
            stayReasoning,
            weather,
            route,
            estimatedCost,
            stay,
            transportOptions,  // Real transport data
            rules: { weatherRules, moodRules, paceRules },
            places, // Ensure this is sent!
            dayPlans // Added structured itinerary
        };



        // 8. Budget Optimization (NEW)
        // Run budget logic to adjust plan if needed
        plan = budgetLogic.optimizeTrip(plan, budget);

        // 9. AI Enhancement (Optional)
        // Enhances text fields (summary, themes, tips) using OpenAI if Key is present.
        // Returns original plan on failure.
        const finalPlan = await aiService.enhanceTripText(plan);

        // Construct response
        const tripResponse = {
            _id: 'temp-' + Date.now(),
            userId: null,
            destination,
            startLocation,
            startDate,
            endDate,
            travelers,
            mood,
            pace,
            budget,
            plan: finalPlan // Use the potentially enhanced AND optimized plan
        };

        console.log("Sending Trip Response. Places count:", plan.places.length);
        res.status(200).json(tripResponse);

    } catch (err) {
        console.error("Create Trip Critical Error:", err);
        res.status(200).json({
            error: "Critical Failure",
            details: err.message,
            plan: { places: [], weather: {}, route: {}, dayPlans: [] }
        });
    }
};

exports.getMyTrips = async (req, res) => {
    // Return empty array as per requirements to bypass DB
    res.json([]);
};
