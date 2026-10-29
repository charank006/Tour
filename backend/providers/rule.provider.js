const RecommenderProvider = require('./recommender.interface');
const recommendLogic = require('../logic/recommend.logic');

class RuleRecommenderProvider extends RecommenderProvider {
  constructor() {
    super();
    this.name = 'rule';
  }

  async rankDestinations(destinations, prefs) {
    return recommendLogic.rankDestinations(destinations, prefs);
  }

  async scorePlaces(places, prefs, ctx) {
    if (!Array.isArray(places)) return [];

    const scored = places.map(place => {
      const scoring = recommendLogic.scorePlace(place, prefs, ctx);
      return {
        ...place,
        score: scoring.score,
        matchPercent: scoring.matchPercent,
        reasons: scoring.reasons
      };
    });

    // Sort descending by score
    return scored.sort((a, b) => b.score - a.score);
  }

  async explain(item) {
    if (!item) return 'A balanced selection designed around your travel pace.';
    if (item.reasons && item.reasons.length > 0) {
      return item.reasons.join('. ');
    }
    return `Selected for high cultural relevance and comfortable pacing.`;
  }
}

module.exports = RuleRecommenderProvider;
