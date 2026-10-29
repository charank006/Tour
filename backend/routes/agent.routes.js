const express = require('express');
const router = express.Router();
const LlmRecommenderProvider = require('../providers/llm.provider');
const recommenderService = require('../providers/recommender.service');

const llm = new LlmRecommenderProvider();

/**
 * GET /api/agent/status
 * Returns current AI Agent model status
 */
router.get('/status', (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  res.json({
    active: hasKey,
    provider: 'gemini',
    model: 'gemini-3.5-flash-lite / gemini-3.8-flash',
    features: ['conversational_concierge', 'weather_aware_scoring', 'editorial_dispatches']
  });
});

/**
 * POST /api/agent/chat
 * Traveler chats with the PlanYours AI Concierge
 * Body: { message: string, destination?: string, tripContext?: object }
 */
router.post('/chat', async (req, res) => {
  const { message, destination, tripContext } = req.body || {};

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const destText = destination ? `in and around ${destination}` : 'in India';
  const prompt = `You are PlanYours Artisanal Travel Concierge, a thoughtful, culturally savvy travel curator for journeys ${destText}.
Traveler Context:
${tripContext ? JSON.stringify(tripContext) : 'Solo / couple explorer interested in authentic food, heritage, and scenic walks.'}

Traveler Question:
"${message}"

Respond with warmth, insider expertise, and specific recommendations (real tea shops, viewpoints, timing tips to avoid crowds).
Keep response under 150 words in clear, evocative language. Return valid JSON with keys:
- "reply": string
- "suggestedSpots": array of strings (up to 3 specific place names)
- "insiderTip": string`;

  try {
    const aiResponse = await llm.callGemini(prompt);
    res.json({
      success: true,
      data: aiResponse,
      meta: { source: 'gemini', agent: 'PlanYours Concierge' }
    });
  } catch (err) {
    console.warn(`[AgentRouter] Chat failed: ${err.message}. Using graceful fallback.`);
    res.json({
      success: true,
      data: {
        reply: `For ${destination || 'your destination'}, we recommend starting early around 7:30 AM before tourist coaches arrive. Pair morning outdoor sights with a sheltered heritage cafe in the afternoon, and catch the golden hour from a high ridge or waterside promenade.`,
        suggestedSpots: ['Old Heritage Quarter', 'Sunrise Viewpoint', 'Local Tea Stall'],
        insiderTip: 'Carry cash for small street vendors and ask locals where they take their afternoon chai.'
      },
      meta: { source: 'fallback', agent: 'PlanYours Offline Guide' }
    });
  }
});

module.exports = router;
