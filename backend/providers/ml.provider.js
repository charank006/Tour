const RecommenderProvider = require('./recommender.interface');

/**
 * Machine Learning Recommender Provider Stub
 * Plug in vector search (e.g. Pinecone/Qdrant) or collaborative filtering models here.
 */
class MlRecommenderProvider extends RecommenderProvider {
  constructor() {
    super();
    this.name = 'ml';
  }

  async rankDestinations(destinations, prefs) {
    throw new Error('ML Recommender is not configured. Model serving endpoint not specified.');
  }

  async scorePlaces(places, prefs, ctx) {
    throw new Error('ML Recommender is not configured. Model serving endpoint not specified.');
  }

  async explain(item) {
    throw new Error('ML Recommender is not configured. Model serving endpoint not specified.');
  }
}

module.exports = MlRecommenderProvider;
