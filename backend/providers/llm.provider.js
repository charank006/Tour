const RecommenderProvider = require('./recommender.interface');
const axios = require('axios');
const recommendLogic = require('../logic/recommend.logic');

const GEMINI_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-flash-latest',
  'gemini-3.5-flash'
];

/**
 * Live Google Gemini LLM Recommender Provider
 * Generates personalized, weather-aware, and companion-paced recommendations
 * with guaranteed fallback to the deterministic rule engine.
 */
class LlmRecommenderProvider extends RecommenderProvider {
  constructor() {
    super();
    this.name = 'llm';
  }

  getApiKey() {
    return (process.env.GEMINI_API_KEY || '').trim();
  }

  async callGemini(prompt, systemInstruction = null) {
    const key = this.getApiKey();
    if (!key) {
      throw new Error('GEMINI_API_KEY is not configured in backend/.env');
    }

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.3
      }
    };

    if (systemInstruction) {
      body.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    let lastError = null;
    for (const model of GEMINI_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
        const res = await axios.post(url, body, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 22000
        });

        const candidate = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!candidate) throw new Error('Empty response from Gemini API');

        // Parse JSON
        return JSON.parse(candidate);
      } catch (err) {
        lastError = err;
        const msg = err.response?.data?.error?.message || err.message;
        // If high demand (503) or 404, try next model in fallback list
        if (err.response?.status === 503 || err.response?.status === 404) {
          continue;
        }
        console.warn(`[LlmProvider] Model ${model} failed: ${msg}`);
        break;
      }
    }

    throw lastError || new Error('All Gemini models failed');
  }

  /**
   * Rank destinations using Gemini with reasoning
   */
  async rankDestinations(destinations, prefs = {}) {
    if (!Array.isArray(destinations) || destinations.length === 0) return [];
    if (!this.getApiKey()) {
      return recommendLogic.rankDestinations(destinations, prefs);
    }

    try {
      const candidates = destinations.slice(0, 15).map(d => ({
        id: d.id,
        name: d.name,
        state: d.state,
        category: d.category || d.mood,
        famousFor: d.famousFor || d.description
      }));

      const prompt = `You are PlanYours Artisanal Travel Concierge.
Evaluate these candidate destinations for a traveler with the following preferences:
- Budget Tier: ${prefs.budget || 'moderate'}
- Travel Companions: ${prefs.travelers || 2} travelers (${prefs.mood || 'couple/balanced'})
- Desired Pace: ${prefs.pace || 'balanced'}
- Season/Month: ${new Date().toLocaleString('default', { month: 'long' })}

Candidates:
${JSON.stringify(candidates)}

Return a JSON array of objects with keys:
- "id": string (must match candidate id)
- "matchPercent": number (between 70 and 99)
- "curatorReason": string (warm editorial 1-sentence explanation of why this destination fits)`
      ;

      const results = await this.callGemini(prompt);
      if (Array.isArray(results)) {
        const scoreMap = new Map(results.map(r => [r.id, r]));
        return destinations
          .map(dest => {
            const match = scoreMap.get(dest.id);
            return {
              ...dest,
              matchPercent: match?.matchPercent || 88,
              curatorReason: match?.curatorReason || dest.famousFor || 'Curated seasonal recommendation'
            };
          })
          .sort((a, b) => (b.matchPercent || 0) - (a.matchPercent || 0));
      }
    } catch (err) {
      console.warn(`[LlmProvider] rankDestinations failed: ${err.message}. Falling back to Rule Engine.`);
    }

    return recommendLogic.rankDestinations(destinations, prefs);
  }

  /**
   * Score and sequence places with Gemini
   */
  async scorePlaces(places, prefs = {}, ctx = {}) {
    if (!Array.isArray(places) || places.length === 0) return [];
    if (!this.getApiKey()) {
      return this.fallbackScore(places, prefs, ctx);
    }

    try {
      const simplifiedPlaces = places.slice(0, 20).map((p, idx) => ({
        index: idx,
        name: p.name,
        category: p.category,
        locationType: p.locationType || (p.indoor ? 'Indoor' : 'Outdoor'),
        cost: p.cost || 0
      }));

      const weatherDesc = ctx.weather?.description || (ctx.weather?.rain ? 'Rainy' : 'Clear');
      const tempC = ctx.weather?.temp || 24;

      const prompt = `You are PlanYours AI Travel Concierge.
Score and sequence these attraction candidates in ${ctx.destination || 'the city'}.
Traveler Context:
- Current Weather: ${weatherDesc}, ${tempC}°C
- Travel Style: ${prefs.mood || 'Cultural'}
- Group: ${prefs.travelers || 2} travelers
- Daily Pace: ${prefs.pace || 'Balanced'}

Candidates:
${JSON.stringify(simplifiedPlaces)}

Rules:
1. If rain or extreme heat (>34°C), favor Indoor venues and penalize exposed open treks.
2. If traveling with elders, penalize strenuous physical climbs.
3. Prioritize venues with authentic local character over generic tourist traps.

Return a JSON array of objects with keys:
- "index": number (original index)
- "score": number (0 to 100)
- "timeSlot": "morning" | "afternoon" | "sunset" | "evening"
- "reason": string (brief explanation)`
      ;

      const response = await this.callGemini(prompt);
      if (Array.isArray(response)) {
        const resultMap = new Map(response.map(r => [r.index, r]));
        return places
          .map((p, idx) => {
            const aiScore = resultMap.get(idx);
            return {
              ...p,
              score: aiScore?.score ?? 75,
              time: aiScore?.timeSlot || p.time || (idx % 3 === 0 ? 'morning' : idx % 3 === 1 ? 'afternoon' : 'sunset'),
              reasons: aiScore?.reason ? [aiScore.reason] : (p.reasons || ['Curated for optimal pacing'])
            };
          })
          .sort((a, b) => b.score - a.score);
      }
    } catch (err) {
      console.warn(`[LlmProvider] scorePlaces failed: ${err.message}. Using Rule Provider.`);
    }

    return this.fallbackScore(places, prefs, ctx);
  }

  fallbackScore(places, prefs, ctx) {
    const scored = places.map(place => {
      const scoring = recommendLogic.scorePlace(place, prefs, ctx);
      return {
        ...place,
        score: scoring.score,
        matchPercent: scoring.matchPercent,
        reasons: scoring.reasons
      };
    });
    return scored.sort((a, b) => b.score - a.score);
  }

  async explain(item) {
    if (!item) return 'A balanced journey tailored to your rhythm.';
    if (item.reasons && item.reasons.length > 0) return item.reasons.join('. ');

    if (!this.getApiKey()) {
      return `Selected for high cultural relevance and comfortable pacing.`;
    }

    try {
      const prompt = `Write a 1-sentence warm editorial magazine caption explaining why "${item.name}" in ${item.category} is an essential stop. Output JSON: {"caption": "string"}`;
      const res = await this.callGemini(prompt);
      if (res?.caption) return res.caption;
    } catch (err) {
      // Ignore
    }
    return `Selected for authentic local character and smooth itinerary pacing.`;
  }
}

module.exports = LlmRecommenderProvider;
