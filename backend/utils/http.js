const axios = require('axios');

/**
 * In-memory Circuit Breaker & Resilient HTTP Client
 * - 6s default timeout
 * - 2 retries with exponential backoff on 429 / 5xx / network errors
 * - Circuit breaker per provider:
 *     - Opens after 5 consecutive failures
 *     - Transitions to half-open after 60 seconds
 *     - Resets to closed on success
 */

const CIRCUIT_CONFIG = {
  FAILURE_THRESHOLD: 5,
  RESET_TIMEOUT_MS: 60 * 1000, // 60 seconds
  REQUEST_TIMEOUT_MS: 6000,     // 6 seconds
  MAX_RETRIES: 2,
  BACKOFF_BASE_MS: 500
};

// Store per-provider breaker states:
// { state: 'CLOSED' | 'OPEN' | 'HALF_OPEN', failures: number, lastFailureTime: number | null, successesInHalfOpen: number }
const breakers = new Map();

function getBreaker(provider = 'default') {
  if (!breakers.has(provider)) {
    breakers.set(provider, {
      state: 'CLOSED',
      failures: 0,
      lastFailureTime: null,
      lastSuccessTime: null,
      totalRequests: 0,
      totalFailures: 0
    });
  }
  const b = breakers.get(provider);

  // Check if OPEN state should transition to HALF_OPEN
  if (b.state === 'OPEN' && Date.now() - (b.lastFailureTime || 0) >= CIRCUIT_CONFIG.RESET_TIMEOUT_MS) {
    b.state = 'HALF_OPEN';
  }

  return b;
}

function recordSuccess(provider = 'default') {
  const b = getBreaker(provider);
  b.state = 'CLOSED';
  b.failures = 0;
  b.lastSuccessTime = Date.now();
}

function recordFailure(provider = 'default') {
  const b = getBreaker(provider);
  b.failures += 1;
  b.totalFailures += 1;
  b.lastFailureTime = Date.now();
  if (b.failures >= CIRCUIT_CONFIG.FAILURE_THRESHOLD) {
    b.state = 'OPEN';
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryable(error) {
  if (!error) return false;
  // Network errors, ECONNABORTED (timeout), ENOTFOUND
  if (!error.response) return true;
  const status = error.response.status;
  // 429 (Too Many Requests), 5xx server errors
  return status === 429 || (status >= 500 && status <= 599);
}

/**
 * Execute an HTTP request with retry logic and circuit breaker protection
 */
async function request(config, provider = 'default') {
  const breaker = getBreaker(provider);
  breaker.totalRequests += 1;

  if (breaker.state === 'OPEN') {
    const error = new Error(`Circuit breaker is OPEN for provider '${provider}'. Request blocked.`);
    error.circuitBreakerOpen = true;
    error.provider = provider;
    throw error;
  }

  const client = axios.create({
    timeout: config.timeout || CIRCUIT_CONFIG.REQUEST_TIMEOUT_MS,
    headers: {
      'User-Agent': 'PlanYours/1.0 (+https://planyours.travel)'
    }
  });

  let attempt = 0;
  let lastError = null;

  while (attempt <= CIRCUIT_CONFIG.MAX_RETRIES) {
    try {
      const response = await client.request(config);
      recordSuccess(provider);
      return response;
    } catch (err) {
      lastError = err;
      attempt++;

      if (attempt <= CIRCUIT_CONFIG.MAX_RETRIES && isRetryable(err)) {
        const backoffMs = CIRCUIT_CONFIG.BACKOFF_BASE_MS * Math.pow(2, attempt - 1);
        await sleep(backoffMs);
      } else {
        break;
      }
    }
  }

  recordFailure(provider);
  throw lastError;
}

const http = {
  get: (url, options = {}, provider = 'default') => request({ ...options, url, method: 'GET' }, provider),
  post: (url, data, options = {}, provider = 'default') => request({ ...options, url, data, method: 'POST' }, provider),
  request,
  getCircuitStatus: (provider) => {
    if (provider) return getBreaker(provider);
    const summary = {};
    for (const [key, val] of breakers.entries()) {
      summary[key] = {
        state: val.state,
        failures: val.failures,
        lastFailureAgoSec: val.lastFailureTime ? Math.round((Date.now() - val.lastFailureTime) / 1000) : null
      };
    }
    return summary;
  },
  resetBreaker: (provider) => {
    if (breakers.has(provider)) {
      breakers.set(provider, {
        state: 'CLOSED',
        failures: 0,
        lastFailureTime: null,
        lastSuccessTime: Date.now(),
        totalRequests: 0,
        totalFailures: 0
      });
    }
  }
};

module.exports = http;
