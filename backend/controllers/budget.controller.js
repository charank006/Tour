const budgetLogic = require('../logic/budget.logic');

// Controller: Budget
// Analytics for trip costs

exports.splitBudget = (req, res) => {
    const { total, days } = req.body;

    if (!total || !days) {
        return res.status(400).json({ msg: "Please provide total budget and duration" });
    }

    const split = budgetLogic.split(Number(total), Number(days));

    res.json(split);
};
