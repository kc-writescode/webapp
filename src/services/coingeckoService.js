/**
 * CoinGecko API Service
 * Cryptocurrency market data integration
 */

import { fetchWithRateLimit, buildQueryParams, rateLimiters, API_CONFIG } from './api';

const { baseUrl } = API_CONFIG.coinGecko;

/**
 * Get cryptocurrency price data
 * @param {string} coinId - Coin ID (e.g., 'bitcoin', 'ethereum')
 * @returns {Promise<Object>} Price data
 */
export const getCryptoPrice = async (coinId) => {
  const params = {
    ids: coinId.toLowerCase(),
    vs_currencies: 'usd',
    include_24hr_change: true,
    include_24hr_vol: true,
    include_market_cap: true,
  };

  const url = `${baseUrl}/simple/price${buildQueryParams(params)}`;
  const cacheKey = `crypto_price_${coinId.toLowerCase()}`;

  try {
    const { data, fromCache } = await fetchWithRateLimit(
      url,
      rateLimiters.coinGecko,
      cacheKey,
      2 * 60 * 1000 // Cache for 2 minutes
    );

    const coinData = data[coinId.toLowerCase()];
    if (!coinData) {
      throw new Error('Invalid coin ID or no data available');
    }

    return {
      coinId,
      price: coinData.usd,
      change24h: coinData.usd_24h_change,
      volume24h: coinData.usd_24h_vol,
      marketCap: coinData.usd_market_cap,
      fromCache,
    };
  } catch (error) {
    console.error(`Error fetching crypto price for ${coinId}:`, error);
    throw error;
  }
};

/**
 * Get detailed cryptocurrency data
 * @param {string} coinId - Coin ID
 * @returns {Promise<Object>} Detailed coin data
 */
export const getCryptoDetails = async (coinId) => {
  const url = `${baseUrl}/coins/${coinId.toLowerCase()}`;
  const cacheKey = `crypto_details_${coinId.toLowerCase()}`;

  try {
    const { data, fromCache } = await fetchWithRateLimit(
      url,
      rateLimiters.coinGecko,
      cacheKey,
      5 * 60 * 1000 // Cache for 5 minutes
    );

    return {
      id: data.id,
      symbol: data.symbol.toUpperCase(),
      name: data.name,
      image: data.image?.large,
      currentPrice: data.market_data?.current_price?.usd,
      marketCap: data.market_data?.market_cap?.usd,
      marketCapRank: data.market_cap_rank,
      volume24h: data.market_data?.total_volume?.usd,
      priceChange24h: data.market_data?.price_change_24h,
      priceChangePercentage24h: data.market_data?.price_change_percentage_24h,
      priceChangePercentage7d: data.market_data?.price_change_percentage_7d,
      priceChangePercentage30d: data.market_data?.price_change_percentage_30d,
      high24h: data.market_data?.high_24h?.usd,
      low24h: data.market_data?.low_24h?.usd,
      ath: data.market_data?.ath?.usd,
      athDate: data.market_data?.ath_date?.usd,
      atl: data.market_data?.atl?.usd,
      atlDate: data.market_data?.atl_date?.usd,
      circulatingSupply: data.market_data?.circulating_supply,
      totalSupply: data.market_data?.total_supply,
      maxSupply: data.market_data?.max_supply,
      description: data.description?.en,
      fromCache,
    };
  } catch (error) {
    console.error(`Error fetching crypto details for ${coinId}:`, error);
    throw error;
  }
};

/**
 * Get cryptocurrency market chart data
 * @param {string} coinId - Coin ID
 * @param {string} days - Number of days (1, 7, 14, 30, 90, 180, 365, max)
 * @returns {Promise<Array>} Chart data points
 */
export const getCryptoChart = async (coinId, days = '7') => {
  const params = {
    vs_currency: 'usd',
    days,
  };

  const url = `${baseUrl}/coins/${coinId.toLowerCase()}/market_chart${buildQueryParams(params)}`;
  const cacheKey = `crypto_chart_${coinId.toLowerCase()}_${days}d`;

  try {
    const { data, fromCache } = await fetchWithRateLimit(
      url,
      rateLimiters.coinGecko,
      cacheKey,
      5 * 60 * 1000 // Cache for 5 minutes
    );

    // CoinGecko returns prices as [timestamp, price] arrays
    const chartData = data.prices.map(([timestamp, price]) => ({
      timestamp,
      date: new Date(timestamp),
      price,
    }));

    return { data: chartData, fromCache };
  } catch (error) {
    console.error(`Error fetching crypto chart for ${coinId}:`, error);
    throw error;
  }
};

/**
 * Search for cryptocurrencies
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching coins
 */
export const searchCryptos = async (query) => {
  const url = `${baseUrl}/search?query=${encodeURIComponent(query)}`;
  const cacheKey = `crypto_search_${query.toLowerCase().replace(/\s+/g, '_')}`;

  try {
    const { data, fromCache } = await fetchWithRateLimit(
      url,
      rateLimiters.coinGecko,
      cacheKey,
      60 * 60 * 1000 // Cache for 1 hour
    );

    return {
      results: data.coins.map((coin) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        thumb: coin.thumb,
        large: coin.large,
        marketCapRank: coin.market_cap_rank,
      })),
      fromCache,
    };
  } catch (error) {
    console.error(`Error searching for cryptos with "${query}":`, error);
    throw error;
  }
};

/**
 * Get trending cryptocurrencies
 * @returns {Promise<Array>} Array of trending coins
 */
export const getTrendingCryptos = async () => {
  const url = `${baseUrl}/search/trending`;
  const cacheKey = 'crypto_trending';

  try {
    const { data, fromCache } = await fetchWithRateLimit(
      url,
      rateLimiters.coinGecko,
      cacheKey,
      15 * 60 * 1000 // Cache for 15 minutes
    );

    return {
      coins: data.coins.map((item) => ({
        id: item.item.id,
        name: item.item.name,
        symbol: item.item.symbol.toUpperCase(),
        thumb: item.item.thumb,
        marketCapRank: item.item.market_cap_rank,
        priceChangePercentage24h: item.item.price_change_percentage_24h?.usd,
      })),
      fromCache,
    };
  } catch (error) {
    console.error('Error fetching trending cryptos:', error);
    throw error;
  }
};

/**
 * Get top cryptocurrencies by market cap
 * @param {number} perPage - Number of results per page
 * @param {number} page - Page number
 * @returns {Promise<Array>} Array of top coins
 */
export const getTopCryptos = async (perPage = 10, page = 1) => {
  const params = {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: perPage,
    page,
    sparkline: false,
    price_change_percentage: '24h,7d',
  };

  const url = `${baseUrl}/coins/markets${buildQueryParams(params)}`;
  const cacheKey = `crypto_top_${perPage}_${page}`;

  try {
    const { data, fromCache } = await fetchWithRateLimit(
      url,
      rateLimiters.coinGecko,
      cacheKey,
      5 * 60 * 1000 // Cache for 5 minutes
    );

    return {
      coins: data.map((coin) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        image: coin.image,
        currentPrice: coin.current_price,
        marketCap: coin.market_cap,
        marketCapRank: coin.market_cap_rank,
        volume24h: coin.total_volume,
        priceChange24h: coin.price_change_24h,
        priceChangePercentage24h: coin.price_change_percentage_24h,
        priceChangePercentage7d: coin.price_change_percentage_7d_in_currency,
        high24h: coin.high_24h,
        low24h: coin.low_24h,
      })),
      fromCache,
    };
  } catch (error) {
    console.error('Error fetching top cryptos:', error);
    throw error;
  }
};

/**
 * Get multiple crypto prices (batch)
 * @param {Array<string>} coinIds - Array of coin IDs
 * @returns {Promise<Array>} Array of crypto prices
 */
export const getBatchCryptoPrices = async (coinIds) => {
  const params = {
    ids: coinIds.map((id) => id.toLowerCase()).join(','),
    vs_currencies: 'usd',
    include_24hr_change: true,
    include_24hr_vol: true,
    include_market_cap: true,
  };

  const url = `${baseUrl}/simple/price${buildQueryParams(params)}`;
  const cacheKey = `crypto_batch_${coinIds.sort().join('_')}`;

  try {
    const { data, fromCache } = await fetchWithRateLimit(
      url,
      rateLimiters.coinGecko,
      cacheKey,
      2 * 60 * 1000 // Cache for 2 minutes
    );

    return {
      prices: Object.entries(data).map(([coinId, priceData]) => ({
        coinId,
        price: priceData.usd,
        change24h: priceData.usd_24h_change,
        volume24h: priceData.usd_24h_vol,
        marketCap: priceData.usd_market_cap,
      })),
      fromCache,
    };
  } catch (error) {
    console.error('Error fetching batch crypto prices:', error);
    throw error;
  }
};

export default {
  getCryptoPrice,
  getCryptoDetails,
  getCryptoChart,
  searchCryptos,
  getTrendingCryptos,
  getTopCryptos,
  getBatchCryptoPrices,
};
