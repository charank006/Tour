/**
 * In-memory TTL Cache with normalized keys and per-domain TTL defaults
 * Geocoding: 24h
 * Places: 6h
 * Weather: 30min
 * Routes: 24h
 */

const DEFAULT_TTLS = {
  geocode: 24 * 60 * 60,  // 24 hours
  places: 6 * 60 * 60,    // 6 hours
  weather: 30 * 60,       // 30 minutes
  routes: 24 * 60 * 60,   // 24 hours
  default: 60 * 60        // 1 hour
};

class MemoryCache {
  constructor() {
    this.store = new Map();
    this.hits = 0;
    this.misses = 0;

    // Background cleanup every 5 minutes to prevent memory leak
    this.cleanupTimer = setInterval(() => this.cleanup(), 5 * 60 * 1000);
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  normalizeKey(key) {
    if (typeof key === 'string') {
      return key.trim().toLowerCase().replace(/\s+/g, ' ');
    }
    if (key && typeof key === 'object') {
      return JSON.stringify(key);
    }
    return String(key);
  }

  getCompoundKey(namespace, key) {
    return `${namespace}:${this.normalizeKey(key)}`;
  }

  get(namespace, key) {
    const compoundKey = this.getCompoundKey(namespace, key);
    const entry = this.store.get(compoundKey);

    if (!entry) {
      this.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(compoundKey);
      this.misses++;
      return null;
    }

    this.hits++;
    return entry.value;
  }

  set(namespace, key, value, ttlSeconds) {
    const compoundKey = this.getCompoundKey(namespace, key);
    const ttl = ttlSeconds || DEFAULT_TTLS[namespace] || DEFAULT_TTLS.default;
    const expiresAt = Date.now() + ttl * 1000;

    this.store.set(compoundKey, {
      value,
      expiresAt,
      createdAt: Date.now()
    });

    return value;
  }

  has(namespace, key) {
    return this.get(namespace, key) !== null;
  }

  del(namespace, key) {
    const compoundKey = this.getCompoundKey(namespace, key);
    return this.store.delete(compoundKey);
  }

  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }

  stats() {
    return {
      entriesCount: this.store.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: this.hits + this.misses > 0 ? (this.hits / (this.hits + this.misses)).toFixed(2) : '0.00'
    };
  }

  clear() {
    this.store.clear();
    this.hits = 0;
    this.misses = 0;
  }
}

const cache = new MemoryCache();

module.exports = cache;
