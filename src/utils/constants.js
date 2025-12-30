/**
 * Application Constants
 * App-wide configuration, currencies, expense categories, and default values
 */

// App Information
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'FinLit Hub';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '2.0.0';

// Feature Flags
export const FEATURES = {
  CRYPTO: import.meta.env.VITE_ENABLE_CRYPTO === 'true',
  COMMUNITY: import.meta.env.VITE_ENABLE_COMMUNITY === 'true',
};

// API Configuration
export const API_CONFIG = {
  ALPHA_VANTAGE_KEY: import.meta.env.VITE_ALPHA_VANTAGE_KEY,
  NEWS_API_KEY: import.meta.env.VITE_NEWS_API_KEY,
  CACHE_DURATION: parseInt(import.meta.env.VITE_API_CACHE_DURATION) || 300000, // 5 minutes
};

// Cache Durations (milliseconds)
export const CACHE_DURATIONS = {
  STOCK_PRICE: 5 * 60 * 1000,        // 5 minutes
  CRYPTO_PRICE: 2 * 60 * 1000,       // 2 minutes
  HISTORICAL_DATA: 24 * 60 * 60 * 1000, // 24 hours
  NEWS: 30 * 60 * 1000,              // 30 minutes
  MARKET_INDICATORS: 10 * 60 * 1000, // 10 minutes
};

// Rate Limits
export const RATE_LIMITS = {
  ALPHA_VANTAGE: {
    REQUESTS_PER_DAY: 25,
    REQUESTS_PER_MINUTE: 5,
  },
  COINGECKO: {
    REQUESTS_PER_MINUTE: 50,
  },
  NEWS_API: {
    REQUESTS_PER_DAY: 100,
  },
};

// Currencies (Indian market focus)
export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
];

export const DEFAULT_CURRENCY = 'INR';

// Expense Categories with Icons and Colors (Indian context)
export const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: 'UtensilsCrossed', color: 'bg-orange-500' },
  { id: 'groceries', name: 'Groceries', icon: 'ShoppingCart', color: 'bg-green-500' },
  { id: 'transport', name: 'Transportation', icon: 'Car', color: 'bg-blue-500' },
  { id: 'fuel', name: 'Petrol/Diesel', icon: 'Fuel', color: 'bg-red-500' },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', color: 'bg-pink-500' },
  { id: 'entertainment', name: 'Entertainment', icon: 'Tv', color: 'bg-purple-500' },
  { id: 'bills', name: 'Bills & Utilities', icon: 'Receipt', color: 'bg-yellow-500' },
  { id: 'mobile', name: 'Mobile Recharge', icon: 'Smartphone', color: 'bg-cyan-500' },
  { id: 'health', name: 'Healthcare', icon: 'Heart', color: 'bg-red-600' },
  { id: 'education', name: 'Education', icon: 'GraduationCap', color: 'bg-indigo-500' },
  { id: 'travel', name: 'Travel', icon: 'Plane', color: 'bg-teal-500' },
  { id: 'housing', name: 'Rent', icon: 'Home', color: 'bg-green-600' },
  { id: 'emi', name: 'EMI/Loans', icon: 'CreditCard', color: 'bg-orange-600' },
  { id: 'insurance', name: 'Insurance', icon: 'Shield', color: 'bg-blue-600' },
  { id: 'gifts', name: 'Gifts & Donations', icon: 'Gift', color: 'bg-rose-500' },
  { id: 'personal', name: 'Personal Care', icon: 'User', color: 'bg-violet-500' },
  { id: 'investment', name: 'Investments (SIP/MF)', icon: 'TrendingUp', color: 'bg-emerald-500' },
  { id: 'other', name: 'Other', icon: 'MoreHorizontal', color: 'bg-slate-500' },
];

// Income Categories
export const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary', icon: 'Briefcase', color: 'bg-blue-500' },
  { id: 'freelance', name: 'Freelance', icon: 'Code', color: 'bg-purple-500' },
  { id: 'business', name: 'Business', icon: 'Store', color: 'bg-green-500' },
  { id: 'investment', name: 'Investment Returns', icon: 'TrendingUp', color: 'bg-emerald-500' },
  { id: 'rental', name: 'Rental Income', icon: 'Home', color: 'bg-teal-500' },
  { id: 'bonus', name: 'Bonus', icon: 'Gift', color: 'bg-yellow-500' },
  { id: 'other', name: 'Other', icon: 'DollarSign', color: 'bg-slate-500' },
];

// Payment Methods (Indian market)
export const PAYMENT_METHODS = [
  { id: 'upi', name: 'UPI (GPay/PhonePe/Paytm)', icon: 'Smartphone' },
  { id: 'card', name: 'Credit/Debit Card', icon: 'CreditCard' },
  { id: 'netbanking', name: 'Net Banking', icon: 'Building' },
  { id: 'cash', name: 'Cash', icon: 'Banknote' },
  { id: 'wallet', name: 'Digital Wallet', icon: 'Wallet' },
  { id: 'emi', name: 'EMI', icon: 'Receipt' },
  { id: 'other', name: 'Other', icon: 'MoreHorizontal' },
];

// Savings Goal Categories
export const GOAL_CATEGORIES = [
  { id: 'emergency', name: 'Emergency Fund', icon: 'Shield', color: 'bg-red-500' },
  { id: 'vacation', name: 'Vacation', icon: 'Plane', color: 'bg-blue-500' },
  { id: 'house', name: 'House/Property', icon: 'Home', color: 'bg-green-500' },
  { id: 'car', name: 'Vehicle', icon: 'Car', color: 'bg-yellow-500' },
  { id: 'education', name: 'Education', icon: 'GraduationCap', color: 'bg-indigo-500' },
  { id: 'wedding', name: 'Wedding', icon: 'Heart', color: 'bg-pink-500' },
  { id: 'retirement', name: 'Retirement', icon: 'Landmark', color: 'bg-purple-500' },
  { id: 'other', name: 'Other', icon: 'Target', color: 'bg-slate-500' },
];

// Chart Time Ranges
export const TIME_RANGES = [
  { id: '1D', name: '1 Day', days: 1 },
  { id: '1W', name: '1 Week', days: 7 },
  { id: '1M', name: '1 Month', days: 30 },
  { id: '3M', name: '3 Months', days: 90 },
  { id: '6M', name: '6 Months', days: 180 },
  { id: '1Y', name: '1 Year', days: 365 },
  { id: 'ALL', name: 'All Time', days: null },
];

// Navigation Items
export const NAV_ITEMS = [
  { id: 'dashboard', name: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard' },
  { id: 'expenses', name: 'Expenses', icon: 'Receipt', path: '/expenses' },
  { id: 'budget', name: 'Budget', icon: 'PiggyBank', path: '/budget' },
  { id: 'markets', name: 'Markets', icon: 'TrendingUp', path: '/markets' },
  { id: 'calculators', name: 'Calculators', icon: 'Calculator', path: '/calculators' },
  { id: 'news', name: 'News', icon: 'Newspaper', path: '/news' },
  { id: 'goals', name: 'Goals', icon: 'Target', path: '/goals' },
  { id: 'community', name: 'Community', icon: 'Users', path: '/community' },
];

// Calculator Types
export const CALCULATOR_TYPES = [
  {
    id: 'sip',
    name: 'SIP Calculator',
    description: 'Calculate Systematic Investment Plan returns',
    icon: 'TrendingUp',
    color: 'bg-blue-500',
  },
  {
    id: 'lumpsum',
    name: 'Lumpsum Calculator',
    description: 'Calculate one-time investment returns',
    icon: 'DollarSign',
    color: 'bg-green-500',
  },
  {
    id: 'emi',
    name: 'EMI Calculator',
    description: 'Calculate loan EMI and total interest',
    icon: 'Home',
    color: 'bg-orange-500',
  },
  {
    id: 'retirement',
    name: 'Retirement Calculator',
    description: 'Plan your retirement corpus',
    icon: 'Landmark',
    color: 'bg-purple-500',
  },
  {
    id: 'tax',
    name: 'Tax Calculator',
    description: 'Calculate income tax liability',
    icon: 'Receipt',
    color: 'bg-red-500',
  },
  {
    id: 'compound',
    name: 'Compound Interest',
    description: 'Calculate compound interest returns',
    icon: 'TrendingUp',
    color: 'bg-teal-500',
  },
];

// News Categories
export const NEWS_CATEGORIES = [
  { id: 'all', name: 'All News' },
  { id: 'markets', name: 'Markets' },
  { id: 'stocks', name: 'Stocks' },
  { id: 'crypto', name: 'Cryptocurrency' },
  { id: 'economy', name: 'Economy' },
  { id: 'policy', name: 'Policy' },
  { id: 'technology', name: 'Technology' },
];

// Market Indicators (Indian market focus)
export const MARKET_INDICATORS = [
  { id: 'nifty50', name: 'NIFTY 50', symbol: '^NSEI' },
  { id: 'sensex', name: 'SENSEX', symbol: '^BSESN' },
  { id: 'banknifty', name: 'Bank NIFTY', symbol: '^NSEBANK' },
  { id: 'niftynext50', name: 'NIFTY Next 50', symbol: 'NIFTYJR.NS' },
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC-INR' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH-INR' },
];

// Default Watchlist Symbols (Indian stocks)
export const DEFAULT_WATCHLIST = [
  { symbol: 'RELIANCE.NS', type: 'stock', name: 'Reliance Industries' },
  { symbol: 'TCS.NS', type: 'stock', name: 'Tata Consultancy Services' },
  { symbol: 'INFY.NS', type: 'stock', name: 'Infosys' },
  { symbol: 'HDFCBANK.NS', type: 'stock', name: 'HDFC Bank' },
  { symbol: 'ICICIBANK.NS', type: 'stock', name: 'ICICI Bank' },
  { symbol: 'BTC', type: 'crypto', name: 'Bitcoin', coinId: 'bitcoin' },
  { symbol: 'ETH', type: 'crypto', name: 'Ethereum', coinId: 'ethereum' },
];

// Pagination
export const ITEMS_PER_PAGE = 50;
export const MAX_WATCHLIST_ITEMS = 10;

// Storage Limits
export const STORAGE_LIMITS = {
  MAX_EXPENSES: 1000,
  MAX_BUDGETS: 24, // 2 years of monthly budgets
  MAX_GOALS: 10,
  MAX_TRANSACTIONS: 500,
  WARNING_THRESHOLD: 0.8, // 80% of quota
};

// Toast Duration
export const TOAST_DURATION = 3000; // 3 seconds

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  API_RATE_LIMIT: 'API rate limit exceeded. Please try again later.',
  STORAGE_FULL: 'Storage limit reached. Please delete old data.',
  INVALID_INPUT: 'Invalid input. Please check your data.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  EXPENSE_ADDED: 'Expense added successfully!',
  EXPENSE_UPDATED: 'Expense updated successfully!',
  EXPENSE_DELETED: 'Expense deleted successfully!',
  BUDGET_CREATED: 'Budget created successfully!',
  BUDGET_UPDATED: 'Budget updated successfully!',
  GOAL_CREATED: 'Savings goal created successfully!',
  GOAL_UPDATED: 'Goal updated successfully!',
  DATA_EXPORTED: 'Data exported successfully!',
  DATA_IMPORTED: 'Data imported successfully!',
};

// Default User Preferences (Indian market)
export const DEFAULT_PREFERENCES = {
  currency: 'INR',
  theme: 'dark',
  notifications: true,
  defaultView: 'dashboard',
  language: 'en', // Can be extended to support Hindi, Tamil, etc.
};

// Theme Colors (for charts and UI)
export const THEME_COLORS = {
  primary: '#3b82f6',    // blue-500
  secondary: '#8b5cf6',  // purple-500
  success: '#10b981',    // green-500
  danger: '#ef4444',     // red-500
  warning: '#f59e0b',    // yellow-500
  info: '#06b6d4',       // cyan-500
};

export default {
  APP_NAME,
  APP_VERSION,
  FEATURES,
  API_CONFIG,
  CACHE_DURATIONS,
  RATE_LIMITS,
  CURRENCIES,
  DEFAULT_CURRENCY,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  PAYMENT_METHODS,
  GOAL_CATEGORIES,
  TIME_RANGES,
  NAV_ITEMS,
  CALCULATOR_TYPES,
  NEWS_CATEGORIES,
  MARKET_INDICATORS,
  DEFAULT_WATCHLIST,
  ITEMS_PER_PAGE,
  MAX_WATCHLIST_ITEMS,
  STORAGE_LIMITS,
  TOAST_DURATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DEFAULT_PREFERENCES,
  THEME_COLORS,
};
