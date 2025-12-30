/**
 * News Service
 * Fetch news articles from NewsAPI with caching and rate limiting
 * Note: NewsAPI free tier doesn't allow browser requests (HTTP 426)
 * Falls back to sample data for development/demo purposes
 */

import { fetchWithRateLimit, buildQueryParams, rateLimiters } from './api';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

/**
 * Sample news data for fallback when API is unavailable
 */
const SAMPLE_NEWS = [
  {
    id: '1',
    title: 'Sensex, Nifty Hit All-Time Highs Amid Strong FII Inflows',
    description: 'Indian stock markets reached new record levels as foreign institutional investors continued their buying spree, driven by positive global cues and robust domestic economic indicators.',
    content: 'The benchmark indices Sensex and Nifty touched fresh all-time highs...',
    url: 'https://economictimes.com/markets',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    source: 'Economic Times',
    author: 'Market Desk',
    publishedAt: new Date().toISOString(),
    publishedDate: new Date(),
  },
  {
    id: '2',
    title: 'RBI Keeps Repo Rate Unchanged at 6.5% for Fifth Consecutive Time',
    description: 'The Reserve Bank of India maintained its benchmark lending rate, citing persistent inflation concerns while acknowledging improving growth prospects.',
    content: 'The RBI monetary policy committee voted to keep the repo rate steady...',
    url: 'https://livemint.com/economy',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800',
    source: 'Mint',
    author: 'Banking Bureau',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    publishedDate: new Date(Date.now() - 3600000),
  },
  {
    id: '3',
    title: 'IT Stocks Rally as US Fed Signals Rate Cut Path',
    description: 'Information technology shares surged after the US Federal Reserve indicated potential interest rate cuts in the coming months, boosting export-oriented sectors.',
    content: 'IT bellwethers TCS, Infosys, and Wipro led the rally...',
    url: 'https://business-standard.com/technology',
    imageUrl: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800',
    source: 'Business Standard',
    author: 'Tech Correspondent',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    publishedDate: new Date(Date.now() - 7200000),
  },
  {
    id: '4',
    title: 'Gold Prices Touch Rs 75,000 per 10g as Global Uncertainty Rises',
    description: 'Gold prices in India hit a new high amid geopolitical tensions and a weakening dollar, making it an attractive safe-haven investment.',
    content: 'Gold prices continued their upward trajectory...',
    url: 'https://financialexpress.com/commodities',
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800',
    source: 'Financial Express',
    author: 'Commodities Desk',
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    publishedDate: new Date(Date.now() - 10800000),
  },
  {
    id: '5',
    title: 'Mutual Fund SIP Inflows Cross Rs 20,000 Crore Monthly Record',
    description: 'Systematic Investment Plan contributions reached an all-time high as retail investors continue to embrace disciplined investing.',
    content: 'The mutual fund industry witnessed unprecedented SIP inflows...',
    url: 'https://moneycontrol.com/mutual-funds',
    imageUrl: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800',
    source: 'Moneycontrol',
    author: 'MF Desk',
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    publishedDate: new Date(Date.now() - 14400000),
  },
  {
    id: '6',
    title: 'Rupee Strengthens Against Dollar on Strong FPI Inflows',
    description: 'The Indian rupee appreciated against the US dollar as foreign portfolio investors poured money into domestic equities and debt markets.',
    content: 'The rupee gained strength against the greenback...',
    url: 'https://reuters.com/markets/currencies',
    imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800',
    source: 'Reuters',
    author: 'Forex Desk',
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
    publishedDate: new Date(Date.now() - 18000000),
  },
  {
    id: '7',
    title: 'Electric Vehicle Sales Surge 40% in India During Festive Season',
    description: 'The EV market witnessed strong growth with major automakers reporting record deliveries during the festive quarter.',
    content: 'Electric vehicle adoption in India continues to accelerate...',
    url: 'https://economictimes.com/auto',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
    source: 'Economic Times',
    author: 'Auto Desk',
    publishedAt: new Date(Date.now() - 21600000).toISOString(),
    publishedDate: new Date(Date.now() - 21600000),
  },
  {
    id: '8',
    title: 'SEBI Introduces New Rules for Algorithmic Trading',
    description: 'The Securities and Exchange Board of India announced new regulations for algo trading to enhance market transparency and protect retail investors.',
    content: 'SEBI has implemented stricter norms for algorithmic trading...',
    url: 'https://livemint.com/market',
    imageUrl: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800',
    source: 'Mint',
    author: 'Regulatory Desk',
    publishedAt: new Date(Date.now() - 25200000).toISOString(),
    publishedDate: new Date(Date.now() - 25200000),
  },
  {
    id: '9',
    title: 'India GDP Growth Expected to Hit 7% This Fiscal Year',
    description: 'Leading economists project robust economic growth driven by strong domestic consumption and government infrastructure spending.',
    content: 'India is on track to become the fastest-growing major economy...',
    url: 'https://business-standard.com/economy',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    source: 'Business Standard',
    author: 'Economy Bureau',
    publishedAt: new Date(Date.now() - 28800000).toISOString(),
    publishedDate: new Date(Date.now() - 28800000),
  },
];

/**
 * Format article for consistent structure
 */
const formatArticle = (article) => ({
  id: article.url || article.id,
  title: article.title,
  description: article.description,
  content: article.content,
  url: article.url,
  imageUrl: article.urlToImage || article.imageUrl,
  source: article.source?.name || article.source || 'Unknown',
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
  // If no API key, return sample data
  if (!NEWS_API_KEY || NEWS_API_KEY === 'demo') {
    console.log('[News] Using sample data (no API key configured)');
    return {
      articles: SAMPLE_NEWS.slice(0, pageSize),
      totalResults: SAMPLE_NEWS.length,
      fromCache: false,
      isSampleData: true,
    };
  }

  const params = {
    category,
    country: 'in',
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
      30 * 60 * 1000
    );

    return {
      articles: (data.articles || []).map(formatArticle),
      totalResults: data.totalResults || 0,
      fromCache,
    };
  } catch (error) {
    console.error('Error fetching headlines:', error);
    // Return sample data on error (e.g., HTTP 426 from NewsAPI)
    console.log('[News] Falling back to sample data due to API error');
    return {
      articles: SAMPLE_NEWS.slice(0, pageSize),
      totalResults: SAMPLE_NEWS.length,
      fromCache: false,
      isSampleData: true,
    };
  }
};

/**
 * Search news articles
 * @param {string} query - Search query (stocks, crypto, economy, etc.)
 * @param {object} options - { from, to, sortBy, pageSize }
 * @returns {Promise<Object>} { articles, totalResults, fromCache }
 */
export const searchNews = async (query, options = {}) => {
  // If no API key, return sample data
  if (!NEWS_API_KEY || NEWS_API_KEY === 'demo') {
    console.log('[News] Using sample data (no API key configured)');
    return {
      articles: SAMPLE_NEWS.slice(0, options.pageSize || 20),
      totalResults: SAMPLE_NEWS.length,
      fromCache: false,
      isSampleData: true,
    };
  }

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
      30 * 60 * 1000
    );

    return {
      articles: (data.articles || []).map(formatArticle),
      totalResults: data.totalResults || 0,
      fromCache,
    };
  } catch (error) {
    console.error('Error searching news:', error);
    // Return sample data on error
    console.log('[News] Falling back to sample data due to API error');
    return {
      articles: SAMPLE_NEWS.slice(0, options.pageSize || 20),
      totalResults: SAMPLE_NEWS.length,
      fromCache: false,
      isSampleData: true,
    };
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
