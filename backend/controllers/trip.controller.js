const weatherService = require('../services/weather.service');
const placesService = require('../services/places.service');
const routingService = require('../services/routing.service');
const costService = require('../services/cost.service');
const aiService = require('../services/ai.service');
const moodLogic = require('../logic/mood.logic');
const paceLogic = require('../logic/pace.logic');
const weatherLogic = require('../logic/weather.logic');

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

        // 2. Places Service
        let places = [];
        try {
            // Fetch places from OTM / Geoapify
            places = await placesService.getPlaces(destination, weatherRules, moodRules);
            console.log(`Found ${places.length} places for ${destination}`);
        } catch (err) {
            console.error("Places Service Failed:", err.message);
            // Fallback to empty list
        }

        // 3. Routing & Cost
        // Default to 'New Delhi' if no start location provided
        const routeStart = startLocation || 'New Delhi';
        let route = { distanceKm: 0, duration: 'N/A' };

        try {
            route = await routingService.getRoute(routeStart, destination);
        } catch (err) {
            console.error("Routing failed, defaulting to empty route:", err.message);
            // Fallback object to prevent crash
            route = {
                start: routeStart,
                end: destination,
                distanceKm: 0,
                duration: "Unknown",
                apiDurationMin: 0
            };
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

        const plan = {
            planSummary,
            whyThisDestination,
            budgetReasoning,
            stayReasoning,
            weather,
            route,
            estimatedCost,
            stay,
            rules: { weatherRules, moodRules, paceRules },
            places // Ensure this is sent!
        };

        // 7. AI Enhancement (Optional)
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
            plan: finalPlan // Use the potentially enhanced plan
        };

        console.log("Sending Trip Response. Places count:", plan.places.length);
        res.status(200).json(tripResponse);
    } catch (err) {
        console.error("Create Trip Critical Error:", err);
        // Even in critical error, return a fallback JSON to prevent blank screen
        console.log("ALL PLACES COUNT:", allPlaces.length);
        console.log("ALL PLACES SAMPLE:", allPlaces.slice(0, 3));
        console.log("DAY PLANS FINAL:", JSON.stringify(dayPlans, null, 2));

        res.status(200).json({
            error: "Critical Failure",
            details: err.message,
            // Minimal valid structure
            plan: { places: [], weather: {}, route: {} }
        });
    }
};

exports.getMyTrips = async (req, res) => {
    // Return empty array as per requirements to bypass DB
    res.json([]);
};
