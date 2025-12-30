/**
 * Alpha Vantage API Service
 * Stock market data integration
 */

import { fetchWithRateLimit, buildQueryParams, rateLimiters, API_CONFIG } from './api';

const { baseUrl, apiKey } = API_CONFIG.alphaVantage;

/**
 * Get real-time stock quote
 * @param {string} symbol - Stock symbol (e.g., 'AAPL', 'MSFT')
 * @returns {Promise<Object>} Stock quote data
 */
export const getStockQuote = async (symbol) => {
  const params = {
    function: 'GLOBAL_QUOTE',
    symbol: symbol.toUpperCase(),
    apikey: apiKey,
  };

  const url = `${baseUrl}${buildQueryParams(params)}`;
  const cacheKey = `stock_quote_${symbol.toLowerCase()}`;

  try {
    const { data, fromCache } = await fetchWithRateLimit(
      url,
      rateLimiters.alphaVantage,
      cacheKey,
      5 * 60 * 1000 // Cache for 5 minutes
    );

    // Parse Alpha Vantage response
    const quote = data['Global Quote'];
    if (!quote || Object.keys(quote).length === 0) {
      throw new Error('Invalid symbol or no data available');
    }

    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent']?.replace('%', '')),
      volume: parseInt(quote['06. volume']),
      previousClose: parseFloat(quote['08. previous close']),
      open: parseFloat(quote['02. open']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      lastUpdated: quote['07. latest trading day'],
      fromCache,
    };
  } catch (error) {
    console.error(`Error fetching stock quote for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Get intraday stock data (1min, 5min, 15min, 30min, 60min intervals)
 * @param {string} symbol - Stock symbol
 * @param {string} interval - Time interval (1min, 5min, 15min, 30min, 60min)
 * @returns {Promise<Array>} Array of price data points
 */
export const getIntradayData = async (symbol, interval = '5min') => {
  const params = {
    function: 'TIME_SERIES_INTRADAY',
    symbol: symbol.toUpperCase(),
    interval,
    apikey: apiKey,
    outputsize: 'compact', // Last 100 data points
  };

  const url = `${baseUrl}${buildQueryParams(params)}`;
  const cacheKey = `stock_intraday_${symbol.toLowerCase()}_${interval}`;

  try {
    const { data, fromCache } = await fetchWithRateLimit(
      url,
      rateLimiters.alphaVantage,
      cacheKey,
      5 * 60 * 1000 // Cache for 5 minutes
    );

    const timeSeriesKey = `Time Series (${interval})`;
    const timeSeries = data[timeSeriesKey];

    if (!timeSeries) {
      throw new Error('No intraday data available');
    }

    // Convert to array format suitable for charting
    const chartData = Object.entries(timeSeries).map(([timestamp, values]) => ({
      timestamp,
      date: new Date(timestamp),
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume']),
    }));

    // Sort by timestamp ascending (oldest first)
    chartData.sort((a, b) => a.date - b.date);

    return { data: chartData, fromCache };
  } catch (error) {
    console.error(`Error fetching intraday data for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Get daily historical stock data
 * @param {string} symbol - Stock symbol
 * @param {boolean} compact - If true, returns last 100 data points, else full data
 * @returns {Promise<Array>} Array of daily price data
 */
export const getDailyData = async (symbol, compact = true) => {
  const params = {
    function: 'TIME_SERIES_DAILY',
    symbol: symbol.toUpperCase(),
    apikey: apiKey,
    outputsize: compact ? 'compact' : 'full',
  };

  const url = `${baseUrl}${buildQueryParams(params)}`;
  const cacheKey = `stock_daily_${symbol.toLowerCase()}_${compact ? 'compact' : 'full'}`;

  try {
    const { data, fromCache } = await fetchWithRateLimit(
      url,
      rateLimiters.alphaVantage,
      cacheKey,
      24 * 60 * 60 * 1000 // Cache for 24 hours
    );

    const timeSeries = data['Time Series (Daily)'];

    if (!timeSeries) {
      throw new Error('No daily data available');
    }

    const chartData = Object.entries(timeSeries).map(([date, values]) => ({
      date,
      timestamp: new Date(date),
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume']),
    }));

    // Sort by date ascending
    chartData.sort((a, b) => a.timestamp - b.timestamp);

    return { data: chartData, fromCache };
  } catch (error) {
    console.error(`Error fetching daily data for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Search for stock symbols
 * @param {string} keywords - Search query
 * @returns {Promise<Array>} Array of matching stocks
 */
export const searchSymbols = async (keywords) => {
  const params = {
    function: 'SYMBOL_SEARCH',
    keywords,
    apikey: apiKey,
  };

  const url = `${baseUrl}${buildQueryParams(params)}`;
  const cacheKey = `stock_search_${keywords.toLowerCase().replace(/\s+/g, '_')}`;

  try {
    const { data, fromCache } = await fetchWithRateLimit(
      url,
      rateLimiters.alphaVantage,
      cacheKey,
      60 * 60 * 1000 // Cache for 1 hour
    );

    const matches = data.bestMatches || [];

    return {
      results: matches.map((match) => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'],
        region: match['4. region'],
        marketOpen: match['5. marketOpen'],
        marketClose: match['6. marketClose'],
        timezone: match['7. timezone'],
        currency: match['8. currency'],
        matchScore: parseFloat(match['9. matchScore']),
      })),
      fromCache,
    };
  } catch (error) {
    console.error(`Error searching for symbols with "${keywords}":`, error);
    throw error;
  }
};

/**
 * Get multiple stock quotes (batch)
 * @param {Array<string>} symbols - Array of stock symbols
 * @returns {Promise<Array>} Array of stock quotes
 */
export const getBatchQuotes = async (symbols) => {
  try {
    // Fetch quotes sequentially to respect rate limits
    const quotes = [];
    for (const symbol of symbols) {
      try {
        const quote = await getStockQuote(symbol);
        quotes.push(quote);
      } catch (error) {
        console.error(`Error fetching quote for ${symbol}:`, error);
        // Continue with next symbol on error
        quotes.push({
          symbol,
          error: error.message,
          price: null,
        });
      }
    }
    return quotes;
  } catch (error) {
    console.error('Error fetching batch quotes:', error);
    throw error;
  }
};

export default {
  getStockQuote,
  getIntradayData,
  getDailyData,
  searchSymbols,
  getBatchQuotes,
};
