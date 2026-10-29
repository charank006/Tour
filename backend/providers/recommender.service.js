const RuleRecommenderProvider = require('./rule.provider');
const LlmRecommenderProvider = require('./llm.provider');
const MlRecommenderProvider = require('./ml.provider');

const ruleProvider = new RuleRecommenderProvider();
const llmProvider = new LlmRecommenderProvider();
const mlProvider = new MlRecommenderProvider();

const PROVIDERS = {
  rule: ruleProvider,
  llm: llmProvider,
  ml: mlProvider
};

const TIMEOUT_MS = 25000;

function withTimeout(promise, ms = TIMEOUT_MS) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`Provider call timed out after ${ms}ms`));
    }, ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

class RecommenderService {
  constructor() {
    this.ruleProvider = ruleProvider;
  }

  getActiveProviderName() {
    const envChoice = (process.env.RECOMMENDER || '').trim().toLowerCase();
    if (envChoice && PROVIDERS[envChoice]) return envChoice;
    // Auto-activate LLM provider if GEMINI_API_KEY or OPENAI_API_KEY is present
    if (process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY) return 'llm';
    return 'rule';
  }

  getActiveProvider() {
    const name = this.getActiveProviderName();
    return PROVIDERS[name] || this.ruleProvider;
  }

  async rankDestinations(destinations, prefs) {
    const chosenName = this.getActiveProviderName();
    const provider = this.getActiveProvider();

    if (chosenName === 'rule') {
      const results = await this.ruleProvider.rankDestinations(destinations, prefs);
      return { results, meta: { provider: 'rule', fallbackApplied: false } };
    }

    try {
      const results = await withTimeout(provider.rankDestinations(destinations, prefs));
      return { results, meta: { provider: chosenName, fallbackApplied: false } };
    } catch (err) {
      console.warn(`[RecommenderService] Provider '${chosenName}' failed: ${err.message}. Falling back to Rule provider.`);
      const results = await this.ruleProvider.rankDestinations(destinations, prefs);
      return { results, meta: { provider: 'rule', fallbackApplied: true, originalProvider: chosenName } };
    }
  }

  async scorePlaces(places, prefs, ctx) {
    const chosenName = this.getActiveProviderName();
    const provider = this.getActiveProvider();

    if (chosenName === 'rule') {
      const results = await this.ruleProvider.scorePlaces(places, prefs, ctx);
      return { results, meta: { provider: 'rule', fallbackApplied: false } };
    }

    try {
      const results = await withTimeout(provider.scorePlaces(places, prefs, ctx));
      return { results, meta: { provider: chosenName, fallbackApplied: false } };
    } catch (err) {
      console.warn(`[RecommenderService] Provider '${chosenName}' failed: ${err.message}. Falling back to Rule provider.`);
      const results = await this.ruleProvider.scorePlaces(places, prefs, ctx);
      return { results, meta: { provider: 'rule', fallbackApplied: true, originalProvider: chosenName } };
    }
  }

  async explain(item) {
    const chosenName = this.getActiveProviderName();
    const provider = this.getActiveProvider();

    if (chosenName === 'rule') {
      return this.ruleProvider.explain(item);
    }

    try {
      return await withTimeout(provider.explain(item));
    } catch (err) {
      console.warn(`[RecommenderService] Explanation from '${chosenName}' failed: ${err.message}. Using rule fallback.`);
      return this.ruleProvider.explain(item);
    }
  }

  getStatus() {
    return {
      activeProvider: this.getActiveProviderName(),
      availableProviders: Object.keys(PROVIDERS),
      ruleHealthy: true
    };
  }
}

const recommenderService = new RecommenderService();

module.exports = recommenderService;
