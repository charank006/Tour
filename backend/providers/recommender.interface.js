/**
 * Base Recommender Provider Interface
 * All recommender implementations (rule, llm, ml) must adhere to this contract.
 */
class RecommenderProvider {
  /**
   * Rank a collection of destinations based on user preferences
   * @param {Array<Object>} destinations
   * @param {Object} prefs - User preferences (mood, budget, travelers, etc.)
   * @returns {Promise<Array<Object>>}
   */
  async rankDestinations(destinations, prefs) {
    throw new Error('rankDestinations() must be implemented by provider');
  }

  /**
   * Score and rank candidate places for a destination
   * @param {Array<Object>} places
   * @param {Object} prefs
   * @param {Object} ctx - Context (weather, time of day, location, etc.)
   * @returns {Promise<Array<Object>>}
   */
  async scorePlaces(places, prefs, ctx) {
    throw new Error('scorePlaces() must be implemented by provider');
  }

  /**
   * Generate human-readable explanation for an itinerary or place
   * @param {Object} item
   * @returns {Promise<string>}
   */
  async explain(item) {
    throw new Error('explain() must be implemented by provider');
  }
}

module.exports = RecommenderProvider;
