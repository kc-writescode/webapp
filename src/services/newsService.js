/**
 * News Service
 * Fetch news articles from NewsAPI with caching and rate limiting
 */

import { fetchWithRateLimit, buildQueryParams, rateLimiters } from './api';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

/**
 * Format article for consistent structure
 */
const formatArticle = (article) => ({
  id: article.url, // Use URL as unique ID
  title: article.title,
  description: article.description,
  content: article.content,
  url: article.url,
  imageUrl: article.urlToImage,
  source: article.source?.name || 'Unknown',
  author: article.author,
  publishedAt: article.publishedAt,
  publishedDate: new Date(article.publishedAt),
});

/**
 * Get top financial news headlines
 * @param {string} category - 'business', 'technology', etc.
 * @param {number} pageSize - Number of articles (default 20, max 100)
 * @returns {Promise<Object>} { articles, totalResults, fromCache }
 */
export const getTopHeadlines = async (category = 'business', pageSize = 20) => {
  const params = {
    category,
    country: 'in', // India-focused
    pageSize,
    apiKey: NEWS_API_KEY,
  };

  const url = `${BASE_URL}/top-headlines${buildQueryParams(params)}`;
  const cacheKey = `news_headlines_${category}_${pageSize}`;

  try {
    const { data, fromCache } = await fetchWithRateLimit(
      url,
      rateLimiters.news,
      cacheKey,
      30 * 60 * 1000 // 30 minutes cache - CRITICAL for 100/day limit
    );

    return {
      articles: (data.articles || []).map(formatArticle),
      totalResults: data.totalResults || 0,
      fromCache,
    };
  } catch (error) {
    console.error('Error fetching headlines:', error);
    throw error;
  }
};

/**
 * Search news articles
 * @param {string} query - Search query (stocks, crypto, economy, etc.)
 * @param {object} options - { from, to, sortBy, pageSize }
 * @returns {Promise<Object>} { articles, totalResults, fromCache }
 */
export const searchNews = async (query, options = {}) => {
  const params = {
    q: query,
    language: 'en',
    sortBy: options.sortBy || 'publishedAt',
    pageSize: options.pageSize || 20,
    apiKey: NEWS_API_KEY,
  };

  if (options.from) params.from = options.from;
  if (options.to) params.to = options.to;

  const url = `${BASE_URL}/everything${buildQueryParams(params)}`;
  const cacheKey = `news_search_${query}_${options.sortBy || 'recent'}`;

  try {
    const { data, fromCache } = await fetchWithRateLimit(
      url,
      rateLimiters.news,
      cacheKey,
      30 * 60 * 1000 // 30 minutes
    );

    return {
      articles: (data.articles || []).map(formatArticle),
      totalResults: data.totalResults || 0,
      fromCache,
    };
  } catch (error) {
    console.error('Error searching news:', error);
    throw error;
  }
};

/**
 * Get financial news (stocks, markets, economy)
 */
export const getFinancialNews = async () => {
  return searchNews('stocks OR markets OR economy OR finance OR India', {
    sortBy: 'publishedAt',
    pageSize: 30,
  });
};

/**
 * Get crypto news
 */
export const getCryptoNews = async () => {
  return searchNews('cryptocurrency OR bitcoin OR ethereum OR crypto', {
    sortBy: 'publishedAt',
    pageSize: 20,
  });
};

export default {
  getTopHeadlines,
  searchNews,
  getFinancialNews,
  getCryptoNews,
};
