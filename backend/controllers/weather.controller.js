const weatherService = require('../services/weather.service');
const weatherLogic = require('../logic/weather.logic');

exports.getCurrentWeather = async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) return res.status(400).json({ msg: 'City is required' });

        const weather = await weatherService.getWeather(city);
        const recommendations = weatherLogic.apply(weather);

        res.json({
            weather,
            recommendations
        });
    } catch (error) {
        res.status(500).json({ msg: 'Weather Service Error' });
    }
};
