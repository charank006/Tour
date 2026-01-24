exports.apply = (weather) => {
    if (!weather) return { type: 'unknown' };

    const rules = {
        indoorPreference: false,
        packRainGear: false
    };

    if (weather.rain) {
        rules.indoorPreference = true;
        rules.packRainGear = true;
    }

    if (weather.temp > 30) {
        rules.avoidMidDay = true;
    } else if (weather.temp < 10) {
        rules.warmClothing = true;
    }

    return rules;
};
