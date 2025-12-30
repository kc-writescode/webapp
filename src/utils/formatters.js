/**
 * Formatting Utilities
 * Currency, date, number, and percentage formatters
 */

import { format, formatDistance, formatRelative, isValid, parseISO } from 'date-fns';

/**
 * Format currency value (Defaults to INR for Indian market)
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (INR, USD, EUR, etc.)
 * @param {boolean} showDecimals - Whether to show decimal places
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'INR', showDecimals = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '-';
  }

  const options = {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  };

  try {
    // Use Indian number system for INR (lakhs, crores)
    const locale = currency === 'INR' ? 'en-IN' : 'en-US';
    return new Intl.NumberFormat(locale, options).format(amount);
  } catch (error) {
    console.error('Currency formatting error:', error);
    return `${currency} ${amount.toFixed(showDecimals ? 2 : 0)}`;
  }
};

/**
 * Format large numbers with abbreviations (L = Lakh, Cr = Crore for Indian market)
 * @param {number} num - Number to format
 * @param {boolean} useIndianSystem - Use Indian number system (Lakhs, Crores)
 * @returns {string} Formatted number string
 */
export const formatCompactNumber = (num, useIndianSystem = true) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '-';
  }

  const absNum = Math.abs(num);

  if (useIndianSystem) {
    // Indian numbering system (Lakhs, Crores)
    if (absNum >= 1e7) {
      return (num / 1e7).toFixed(2) + ' Cr'; // Crore (10 million)
    } else if (absNum >= 1e5) {
      return (num / 1e5).toFixed(2) + ' L'; // Lakh (100 thousand)
    } else if (absNum >= 1e3) {
      return (num / 1e3).toFixed(2) + 'K'; // Thousand
    }
  } else {
    // International system (K, M, B)
    if (absNum >= 1e9) {
      return (num / 1e9).toFixed(2) + 'B';
    } else if (absNum >= 1e6) {
      return (num / 1e6).toFixed(2) + 'M';
    } else if (absNum >= 1e3) {
      return (num / 1e3).toFixed(2) + 'K';
    }
  }

  return num.toFixed(2);
};

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
export const formatNumber = (num, decimals = 2) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '-';
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Format percentage
 * @param {number} value - Value to format (0-100 or 0-1)
 * @param {boolean} isDecimal - Whether value is decimal (0-1) or percentage (0-100)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, isDecimal = false, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '-';
  }

  const percentage = isDecimal ? value * 100 : value;
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Format percentage change with color indicator
 * @param {number} value - Percentage change value
 * @returns {Object} { text, color, isPositive }
 */
export const formatPercentageChange = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return { text: '-', color: 'text-slate-400', isPositive: false };
  }

  const isPositive = value >= 0;
  const text = `${isPositive ? '+' : ''}${value.toFixed(2)}%`;
  const color = isPositive ? 'text-green-500' : 'text-red-500';

  return { text, color, isPositive };
};

/**
 * Format date to readable string
 * @param {Date|string|number} date - Date to format
 * @param {string} formatString - Format pattern (default: 'MMM dd, yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '-';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);

    if (!isValid(dateObj)) {
      return '-';
    }

    return format(dateObj, formatString);
  } catch (error) {
    console.error('Date formatting error:', error);
    return '-';
  }
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param {Date|string|number} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '-';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);

    if (!isValid(dateObj)) {
      return '-';
    }

    return formatDistance(dateObj, new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return '-';
  }
};

/**
 * Format date to relative calendar date (e.g., "yesterday at 5:30 PM")
 * @param {Date|string|number} date - Date to format
 * @returns {string} Relative calendar string
 */
export const formatRelativeDate = (date) => {
  if (!date) return '-';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);

    if (!isValid(dateObj)) {
      return '-';
    }

    return formatRelative(dateObj, new Date());
  } catch (error) {
    console.error('Relative date formatting error:', error);
    return '-';
  }
};

/**
 * Format time duration in milliseconds to readable string
 * @param {number} ms - Duration in milliseconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (ms) => {
  if (ms === null || ms === undefined || isNaN(ms)) {
    return '-';
  }

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

/**
 * Format file size in bytes to readable string
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  if (bytes === null || bytes === undefined || isNaN(bytes)) {
    return '-';
  }

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format phone number
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '-';

  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  return phone;
};

/**
 * Format month and year for budget display
 * @param {string} monthStr - Month string in YYYY-MM format
 * @returns {string} Formatted month (e.g., "January 2024")
 */
export const formatBudgetMonth = (monthStr) => {
  if (!monthStr) return '-';

  try {
    const [year, month] = monthStr.split('-');
    const date = new Date(year, month - 1);
    return format(date, 'MMMM yyyy');
  } catch (error) {
    return monthStr;
  }
};

/**
 * Get current month in YYYY-MM format
 * @returns {string} Current month string
 */
export const getCurrentMonth = () => {
  return format(new Date(), 'yyyy-MM');
};

/**
 * Format card number (mask middle digits)
 * @param {string} cardNumber - Card number
 * @returns {string} Masked card number
 */
export const formatCardNumber = (cardNumber) => {
  if (!cardNumber) return '-';

  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.length < 4) return cardNumber;

  const lastFour = cleaned.slice(-4);
  return `**** **** **** ${lastFour}`;
};

// Alias for formatRelativeTime (used by community components)
export const formatDistanceToNow = formatRelativeTime;

export default {
  formatCurrency,
  formatCompactNumber,
  formatNumber,
  formatPercentage,
  formatPercentageChange,
  formatDate,
  formatRelativeTime,
  formatDistanceToNow,
  formatRelativeDate,
  formatDuration,
  formatFileSize,
  truncateText,
  formatPhoneNumber,
  formatBudgetMonth,
  getCurrentMonth,
  formatCardNumber,
};
