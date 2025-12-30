/**
 * Form Validation Utilities
 * Input validation functions for forms
 */

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {Object} { isValid, error }
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {Object} { isValid, error }
 */
export const validateUsername = (username) => {
  if (!username || username.trim() === '') {
    return { isValid: false, error: 'Username is required' };
  }

  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters' };
  }

  if (username.length > 20) {
    return { isValid: false, error: 'Username must be less than 20 characters' };
  }

  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {Object} { isValid, error }
 */
export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate amount (for expenses, budgets, etc.)
 * @param {number|string} amount - Amount to validate
 * @returns {Object} { isValid, error }
 */
export const validateAmount = (amount) => {
  if (amount === '' || amount === null || amount === undefined) {
    return { isValid: false, error: 'Amount is required' };
  }

  const numAmount = parseFloat(amount);

  if (isNaN(numAmount)) {
    return { isValid: false, error: 'Please enter a valid number' };
  }

  if (numAmount <= 0) {
    return { isValid: false, error: 'Amount must be greater than zero' };
  }

  if (numAmount > 1000000000) { // 1 billion limit
    return { isValid: false, error: 'Amount is too large' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate positive number
 * @param {number|string} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {Object} { isValid, error }
 */
export const validatePositiveNumber = (value, fieldName = 'Value') => {
  if (value === '' || value === null || value === undefined) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  const numValue = parseFloat(value);

  if (isNaN(numValue)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }

  if (numValue < 0) {
    return { isValid: false, error: `${fieldName} cannot be negative` };
  }

  return { isValid: true, error: null };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {Object} { isValid, error }
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (value === '' || value === null || value === undefined) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true, error: null };
};

/**
 * Validate date
 * @param {Date|string} date - Date to validate
 * @returns {Object} { isValid, error }
 */
export const validateDate = (date) => {
  if (!date) {
    return { isValid: false, error: 'Date is required' };
  }

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: 'Please enter a valid date' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate future date
 * @param {Date|string} date - Date to validate
 * @returns {Object} { isValid, error }
 */
export const validateFutureDate = (date) => {
  const dateValidation = validateDate(date);
  if (!dateValidation.isValid) {
    return dateValidation;
  }

  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dateObj < today) {
    return { isValid: false, error: 'Date must be in the future' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate percentage
 * @param {number|string} value - Percentage value
 * @returns {Object} { isValid, error }
 */
export const validatePercentage = (value) => {
  if (value === '' || value === null || value === undefined) {
    return { isValid: false, error: 'Percentage is required' };
  }

  const numValue = parseFloat(value);

  if (isNaN(numValue)) {
    return { isValid: false, error: 'Please enter a valid percentage' };
  }

  if (numValue < 0 || numValue > 100) {
    return { isValid: false, error: 'Percentage must be between 0 and 100' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number
 * @returns {Object} { isValid, error }
 */
export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'Phone number is required' };
  }

  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length < 10) {
    return { isValid: false, error: 'Phone number must be at least 10 digits' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate description/text field
 * @param {string} text - Text to validate
 * @param {number} maxLength - Maximum length
 * @returns {Object} { isValid, error }
 */
export const validateDescription = (text, maxLength = 500) => {
  if (!text || text.trim() === '') {
    return { isValid: false, error: 'Description is required' };
  }

  if (text.length > maxLength) {
    return { isValid: false, error: `Description must be less than ${maxLength} characters` };
  }

  return { isValid: true, error: null };
};

/**
 * Validate category selection
 * @param {string} category - Category value
 * @param {Array} validCategories - Array of valid category IDs
 * @returns {Object} { isValid, error }
 */
export const validateCategory = (category, validCategories = []) => {
  if (!category || category.trim() === '') {
    return { isValid: false, error: 'Please select a category' };
  }

  if (validCategories.length > 0 && !validCategories.includes(category)) {
    return { isValid: false, error: 'Invalid category selected' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate goal target amount (must be greater than current amount)
 * @param {number} targetAmount - Target amount
 * @param {number} currentAmount - Current amount
 * @returns {Object} { isValid, error }
 */
export const validateGoalTarget = (targetAmount, currentAmount = 0) => {
  const amountValidation = validateAmount(targetAmount);
  if (!amountValidation.isValid) {
    return amountValidation;
  }

  if (parseFloat(targetAmount) <= parseFloat(currentAmount)) {
    return { isValid: false, error: 'Target amount must be greater than current amount' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate interest rate
 * @param {number|string} rate - Interest rate
 * @returns {Object} { isValid, error }
 */
export const validateInterestRate = (rate) => {
  if (rate === '' || rate === null || rate === undefined) {
    return { isValid: false, error: 'Interest rate is required' };
  }

  const numRate = parseFloat(rate);

  if (isNaN(numRate)) {
    return { isValid: false, error: 'Please enter a valid interest rate' };
  }

  if (numRate < 0 || numRate > 100) {
    return { isValid: false, error: 'Interest rate must be between 0 and 100' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate time period (in years)
 * @param {number|string} years - Number of years
 * @returns {Object} { isValid, error }
 */
export const validateTimePeriod = (years) => {
  if (years === '' || years === null || years === undefined) {
    return { isValid: false, error: 'Time period is required' };
  }

  const numYears = parseFloat(years);

  if (isNaN(numYears)) {
    return { isValid: false, error: 'Please enter a valid number of years' };
  }

  if (numYears <= 0) {
    return { isValid: false, error: 'Time period must be greater than zero' };
  }

  if (numYears > 100) {
    return { isValid: false, error: 'Time period cannot exceed 100 years' };
  }

  return { isValid: true, error: null };
};

/**
 * Validate budget month format (YYYY-MM)
 * @param {string} monthStr - Month string
 * @returns {Object} { isValid, error }
 */
export const validateBudgetMonth = (monthStr) => {
  if (!monthStr || monthStr.trim() === '') {
    return { isValid: false, error: 'Month is required' };
  }

  const monthRegex = /^\d{4}-\d{2}$/;
  if (!monthRegex.test(monthStr)) {
    return { isValid: false, error: 'Invalid month format. Use YYYY-MM' };
  }

  const [year, month] = monthStr.split('-').map(Number);

  if (month < 1 || month > 12) {
    return { isValid: false, error: 'Month must be between 01 and 12' };
  }

  if (year < 2000 || year > 2100) {
    return { isValid: false, error: 'Year must be between 2000 and 2100' };
  }

  return { isValid: true, error: null };
};

/**
 * Sanitize input to prevent XSS
 * @param {string} input - Input string
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate form with multiple fields
 * @param {Object} values - Form values
 * @param {Object} rules - Validation rules
 * @returns {Object} { isValid, errors }
 */
export const validateForm = (values, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = values[field];

    if (rule.required) {
      const result = validateRequired(value, rule.label || field);
      if (!result.isValid) {
        errors[field] = result.error;
        isValid = false;
        return;
      }
    }

    if (rule.type === 'email') {
      const result = validateEmail(value);
      if (!result.isValid) {
        errors[field] = result.error;
        isValid = false;
      }
    }

    if (rule.type === 'amount') {
      const result = validateAmount(value);
      if (!result.isValid) {
        errors[field] = result.error;
        isValid = false;
      }
    }

    if (rule.type === 'percentage') {
      const result = validatePercentage(value);
      if (!result.isValid) {
        errors[field] = result.error;
        isValid = false;
      }
    }

    if (rule.custom && typeof rule.custom === 'function') {
      const result = rule.custom(value, values);
      if (!result.isValid) {
        errors[field] = result.error;
        isValid = false;
      }
    }
  });

  return { isValid, errors };
};

export default {
  validateEmail,
  validateUsername,
  validatePassword,
  validateAmount,
  validatePositiveNumber,
  validateRequired,
  validateDate,
  validateFutureDate,
  validatePercentage,
  validatePhone,
  validateDescription,
  validateCategory,
  validateGoalTarget,
  validateInterestRate,
  validateTimePeriod,
  validateBudgetMonth,
  sanitizeInput,
  validateForm,
};
