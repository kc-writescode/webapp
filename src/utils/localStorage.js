/**
 * localStorage Utility Functions
 * Provides type-safe storage operations with data migration support
 */

const STORAGE_KEYS = {
  USER: 'finance_user',
  EXPENSES: 'finance_expenses',
  BUDGETS: 'finance_budgets',
  INCOME: 'finance_income',
  GOALS: 'finance_savings_goals',
  WATCHLIST: 'finance_watchlist',
  PREFERENCES: 'finance_preferences',
  COMMUNITY_POSTS: 'finance_community_posts',
  CACHE: 'finance_cache',
};

/**
 * Get item from localStorage with JSON parsing
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Parsed value or default
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Set item in localStorage with JSON serialization
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
    if (error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded. Consider cleaning old data.');
    }
    return false;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
  }
};

/**
 * Clear all app data from localStorage
 */
export const clearAll = () => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Get cached data with expiry check
 * @param {string} key - Cache key
 * @param {number} maxAge - Maximum age in milliseconds
 * @returns {*} Cached data or null if expired
 */
export const getCachedData = (key, maxAge = 300000) => {
  const cached = getItem(key);
  if (!cached) return null;

  const { data, timestamp } = cached;
  const age = Date.now() - timestamp;

  if (age > maxAge) {
    removeItem(key);
    return null;
  }

  return data;
};

/**
 * Set cached data with timestamp
 * @param {string} key - Cache key
 * @param {*} data - Data to cache
 */
export const setCachedData = (key, data) => {
  setItem(key, {
    data,
    timestamp: Date.now(),
  });
};

/**
 * Migrate old localStorage data to new schema
 * Should be called on app initialization
 */
export const migrateData = () => {
  try {
    // Migrate user data from old 'user' key to new 'finance_user' key
    const oldUser = getItem('user');
    const newUser = getItem(STORAGE_KEYS.USER);

    if (oldUser && !newUser) {
      const migratedUser = {
        ...oldUser,
        id: oldUser.id || generateId(),
        createdAt: oldUser.createdAt || Date.now(),
        preferences: oldUser.preferences || {
          currency: 'USD',
          theme: 'dark',
          notifications: true,
        },
      };
      setItem(STORAGE_KEYS.USER, migratedUser);
      console.log('User data migrated successfully');
    }

    // Migrate community posts if they exist
    const oldPosts = getItem('posts');
    const newPosts = getItem(STORAGE_KEYS.COMMUNITY_POSTS);

    if (oldPosts && !newPosts) {
      setItem(STORAGE_KEYS.COMMUNITY_POSTS, oldPosts);
      console.log('Community posts migrated successfully');
    }
  } catch (error) {
    console.error('Error during data migration:', error);
  }
};

/**
 * Get storage quota information
 * @returns {Object} Storage usage info
 */
export const getStorageInfo = () => {
  try {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    // Approximate total in KB
    const usedKB = (total / 1024).toFixed(2);
    const estimatedQuotaKB = 5120; // 5MB typical limit

    return {
      used: usedKB,
      total: estimatedQuotaKB,
      percentage: ((usedKB / estimatedQuotaKB) * 100).toFixed(2),
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return { used: 0, total: 0, percentage: 0 };
  }
};

/**
 * Generate a unique ID
 * @returns {string} Unique identifier
 */
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Export data as JSON for backup
 * @returns {Object} All app data
 */
export const exportData = () => {
  const data = {};
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    data[name] = getItem(key);
  });
  return {
    ...data,
    exportDate: new Date().toISOString(),
    version: '2.0.0',
  };
};

/**
 * Import data from backup
 * @param {Object} data - Backup data object
 * @returns {boolean} Success status
 */
export const importData = (data) => {
  try {
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      if (data[name]) {
        setItem(key, data[name]);
      }
    });
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

export { STORAGE_KEYS };
