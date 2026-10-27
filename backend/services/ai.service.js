const OpenAI = require('openai');
const { API_KEYS } = require('../config/apiKeys');

let openai = null;

if (API_KEYS.openai) {
    openai = new OpenAI({
        apiKey: API_KEYS.openai,
    });
} else {
    console.warn("AI Service: OpenAI API Key missing. AI features disabled.");
}

exports.enhanceTripText = async (plan) => {
    // 1. Fail-safe: Check if OpenAI is initialized
    if (!openai) {
        console.warn("AI Service: OpenAI disabled, returning original plan.");
        return plan;
    }

    try {
        console.log("AI Service: Enhancing trip text...");

        // Prepare context for AI
        const context = {
            destination: plan.destination,
            mood: plan.mood,
            summary: plan.planSummary,
            itinerary: plan.dayPlans.map(day => ({
                day: day.day,
                activities: day.activities.map(a => ({ title: a.title, description: a.description }))
            }))
        };

        const prompt = `
        You are a travel editor. Enhance the text of this trip plan to be engaging, personalized, and exciting.
        
        INPUT DATA:
        ${JSON.stringify(context, null, 2)}
        
        INSTRUCTIONS:
        1. "planSummary": Rewrite to be captivating (max 2 sentences).
        2. "dailyThemes": Create a short theme title for each day (e.g., "Cultural Immersion").
        3. "tips": Provide 3 distinct, practical travel tips for this specific destination.
        4. "alternatives": Suggest 2 alternative activities or hidden gems.
        5. "dayPlans": For each day, enhance the "description" of each activity. Keep "title" same or slightly refined. Do NOT change count or order.
        
        CONSTRAINTS:
        - Output strict JSON.
        - Do NOT modify costs, times, or durations.
        - Do NOT add new days.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful travel assistant. Output valid JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const aiResponse = JSON.parse(completion.choices[0].message.content);

        // Safe Merge Logic (Mutation of a copy would be better, but modifying 'plan' clone logic here)
        // We will modify a deep clone to be safe, or just carefully assign to input if allowed. 
        // Let's modify the input plan object directly as it's a pass-by-reference in JS, 
        // but since we want "original on failure", we should be careful. 
        // Actually, let's just update fields on the 'plan' object since we are in the success block.

        if (aiResponse.planSummary) plan.planSummary = aiResponse.planSummary;
        if (aiResponse.dailyThemes) plan.dailyThemes = aiResponse.dailyThemes;
        if (aiResponse.tips) plan.tips = aiResponse.tips;
        if (aiResponse.alternatives) plan.alternatives = aiResponse.alternatives;

        // Merge Activity Descriptions
        if (aiResponse.dayPlans && Array.isArray(aiResponse.dayPlans)) {
            aiResponse.dayPlans.forEach((aiDay, index) => {
                if (plan.dayPlans[index]) {
                    // Update theme if possibly returned here (though we asked for dailyThemes array, prompt might vary)
                    // We asked for dailyThemes separate array.

                    if (aiDay.activities && Array.isArray(aiDay.activities)) {
                        aiDay.activities.forEach((aiActivity, actIndex) => {
                            if (plan.dayPlans[index].activities[actIndex]) {
                                // Enhance description
                                plan.dayPlans[index].activities[actIndex].description = aiActivity.description || plan.dayPlans[index].activities[actIndex].description;
                            }
                        });
                    }
                }
            });
        }

        return plan;

    } catch (error) {
        console.error("AI Service Error:", error.message);
        return plan; // Fallback to original
    }
};
