/**
 * Base API Service
 * Rate limiting and caching for external API calls
 */

import { getCachedData, setCachedData } from '@utils/localStorage';

/**
 * Rate Limiter Class
 * Implements token bucket algorithm for API rate limiting
 */
class RateLimiter {
  constructor(maxRequests, timeWindow) {
    this.maxRequests = maxRequests; // Maximum requests allowed
    this.timeWindow = timeWindow; // Time window in milliseconds
    this.requests = []; // Timestamps of recent requests
  }

  canMakeRequest() {
    const now = Date.now();
    // Remove timestamps outside the time window
    this.requests = this.requests.filter(
      (timestamp) => now - timestamp < this.timeWindow
    );
    return this.requests.length < this.maxRequests;
  }

  recordRequest() {
    this.requests.push(Date.now());
  }

  getWaitTime() {
    if (this.requests.length === 0) return 0;
    const oldestRequest = this.requests[0];
    const waitTime = this.timeWindow - (Date.now() - oldestRequest);
    return Math.max(0, waitTime);
  }

  getRemainingRequests() {
    const now = Date.now();
    this.requests = this.requests.filter(
      (timestamp) => now - timestamp < this.timeWindow
    );
    return this.maxRequests - this.requests.length;
  }
}

// Rate limiters for different APIs
export const rateLimiters = {
  alphaVantage: new RateLimiter(5, 60 * 1000), // 5 requests per minute
  coinGecko: new RateLimiter(50, 60 * 1000), // 50 requests per minute
  news: new RateLimiter(10, 60 * 1000), // 10 requests per minute
};

/**
 * Generic API fetch with rate limiting and caching
 */
export const fetchWithRateLimit = async (
  url,
  rateLimiter,
  cacheKey,
  cacheMaxAge = 5 * 60 * 1000 // Default 5 minutes
) => {
  // Check cache first
  const cachedData = getCachedData(cacheKey, cacheMaxAge);
  if (cachedData) {
    console.log(`[API Cache] Using cached data for ${cacheKey}`);
    return { data: cachedData, fromCache: true };
  }

  // Check rate limit
  if (!rateLimiter.canMakeRequest()) {
    const waitTime = rateLimiter.getWaitTime();
    console.warn(
      `[API Rate Limit] Rate limit exceeded. Wait ${Math.ceil(
        waitTime / 1000
      )}s`
    );

    // Try to return stale cache if available
    const staleCache = getCachedData(cacheKey, Infinity);
    if (staleCache) {
      console.log(`[API Cache] Using stale cache for ${cacheKey}`);
      return { data: staleCache, fromCache: true, stale: true };
    }

    throw new Error(
      `Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`
    );
  }

  try {
    // Make the API request
    rateLimiter.recordRequest();
    console.log(
      `[API Request] Fetching ${url} (${rateLimiter.getRemainingRequests()} requests remaining)`
    );

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Cache the response
    setCachedData(cacheKey, data);

    return { data, fromCache: false };
  } catch (error) {
    console.error('[API Error]', error);

    // Try to return stale cache on error
    const staleCache = getCachedData(cacheKey, Infinity);
    if (staleCache) {
      console.log(`[API Cache] Using stale cache after error for ${cacheKey}`);
      return { data: staleCache, fromCache: true, stale: true, error };
    }

    throw error;
  }
};

/**
 * Build query parameters for URLs
 */
export const buildQueryParams = (params) => {
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&');
  return queryString ? `?${queryString}` : '';
};

/**
 * API Configuration
 */
export const API_CONFIG = {
  alphaVantage: {
    baseUrl: 'https://www.alphavantage.co/query',
    apiKey: import.meta.env.VITE_ALPHA_VANTAGE_KEY || 'demo',
  },
  coinGecko: {
    baseUrl: 'https://api.coingecko.com/api/v3',
    // CoinGecko doesn't require API key for free tier
  },
  news: {
    baseUrl: 'https://newsapi.org/v2',
    apiKey: import.meta.env.VITE_NEWS_API_KEY || 'demo',
  },
};

export default {
  fetchWithRateLimit,
  buildQueryParams,
  rateLimiters,
  API_CONFIG,
};
