const axios = require('axios');
const { OPENWEATHER_KEY } = require('../config/keys');

exports.getWeather = async (city) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_KEY}&units=metric`;
  const res = await axios.get(url);

  return {
    temp: res.data.main.temp,
    rain: res.data.weather[0].main.includes('Rain'),
    description: res.data.weather[0].description
  };
};
