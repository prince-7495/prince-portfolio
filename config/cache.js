const NodeCache = require('node-cache');

// Initialize cache with 60-second TTL
const cache = new NodeCache({ stdTTL: 60 });

// Statistics object to track cache performance
const stats = {
  hits: 0,
  misses: 0,
};

/**
 * Get a value from the cache
 * @param {string} key - Cache key
 * @returns {any} - Cached value or undefined
 */
function get(key) {
  const value = cache.get(key);
  if (value !== undefined) {
    stats.hits++;
  } else {
    stats.misses++;
  }
  return value;
}

/**
 * Set a value in the cache
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} ttl - Optional custom TTL in seconds (defaults to 60)
 */
function set(key, value, ttl = 60) {
  cache.set(key, value, ttl);
}

/**
 * Delete a specific key from the cache
 * @param {string} key - Cache key to delete
 */
function del(key) {
  cache.del(key);
}

/**
 * Flush all cache
 */
function flush() {
  cache.flushAll();
  // Don't reset stats to preserve historical data
}

/**
 * Get current cache statistics
 * @returns {object} - Object containing hits, misses, total lookups, hit ratio, and cache keys
 */
function getStats() {
  const totalLookups = stats.hits + stats.misses;
  const hitRatio = totalLookups > 0 ? ((stats.hits / totalLookups) * 100).toFixed(2) : 0;
  const keys = cache.keys();
  
  return {
    hits: stats.hits,
    misses: stats.misses,
    totalLookups: totalLookups,
    hitRatio: parseFloat(hitRatio),
    cachedKeys: keys,
    cachedKeysCount: keys.length,
  };
}

/**
 * Reset statistics counters (useful for testing)
 */
function resetStats() {
  stats.hits = 0;
  stats.misses = 0;
}

module.exports = {
  cache,
  get,
  set,
  del,
  flush,
  getStats,
  resetStats,
};
