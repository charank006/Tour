const placesService = require('../services/places.service');
const moodLogic = require('../logic/mood.logic');
const weatherLogic = require('../logic/weather.logic');
const weatherService = require('../services/weather.service');

// Controller: Places
// Context-Aware: Uses weather and mood to filter places.

exports.searchPlaces = async (req, res) => {
    try {
        const { city, mood } = req.query;

        // 1. Get Real Weather
        const weather = await weatherService.getWeather(city);

        // 2. Apply Logic
        const weatherRules = weatherLogic.apply(weather);
        const moodRules = moodLogic.apply(mood);

        // 3. Get Places from Foursquare
        const places = await placesService.getPlaces(city, weatherRules, moodRules);

        // 4. Filter/Enhance (Logic in service or here? Prompt says "Logic = decision rules")
        // The service actually takes the rules and queries Foursquare with 'priority' from mood.
        // We can further filter here if needed.

        res.json({
            city,
            context: {
                weather: weather.description,
                mood: mood,
                rules: { weatherRules, moodRules }
            },
            places
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
};
