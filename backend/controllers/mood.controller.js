const moodLogic = require('../logic/mood.logic');

// Controller: Mood
// Analzyes user input mood and returns suggestions

exports.analyzeMood = (req, res) => {
    const { mood } = req.body;

    if (!mood) return res.status(400).json({ msg: 'Mood is required' });

    const suggestions = moodLogic.apply(mood);

    res.json({
        mood,
        suggestions
    });
};
