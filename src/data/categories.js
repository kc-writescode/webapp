/**
 * Expense and Income Categories Data
 * Centralized category definitions with icons and colors
 */

import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS, GOAL_CATEGORIES } from '@utils/constants';

// Export categories for use throughout the app
export { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS, GOAL_CATEGORIES };

/**
 * Get category by ID
 * @param {string} categoryId - Category ID
 * @param {string} type - Category type ('expense', 'income', 'payment', 'goal')
 * @returns {Object} Category object or null
 */
export const getCategoryById = (categoryId, type = 'expense') => {
  let categories;

  switch (type) {
    case 'expense':
      categories = EXPENSE_CATEGORIES;
      break;
    case 'income':
      categories = INCOME_CATEGORIES;
      break;
    case 'payment':
      categories = PAYMENT_METHODS;
      break;
    case 'goal':
      categories = GOAL_CATEGORIES;
      break;
    default:
      return null;
  }

  return categories.find((cat) => cat.id === categoryId) || null;
};

/**
 * Get category name by ID
 * @param {string} categoryId - Category ID
 * @param {string} type - Category type
 * @returns {string} Category name
 */
export const getCategoryName = (categoryId, type = 'expense') => {
  const category = getCategoryById(categoryId, type);
  return category ? category.name : categoryId;
};

/**
 * Get category color by ID
 * @param {string} categoryId - Category ID
 * @param {string} type - Category type
 * @returns {string} Color class
 */
export const getCategoryColor = (categoryId, type = 'expense') => {
  const category = getCategoryById(categoryId, type);
  return category && category.color ? category.color : 'bg-slate-500';
};

/**
 * Get category icon by ID
 * @param {string} categoryId - Category ID
 * @param {string} type - Category type
 * @returns {string} Icon name
 */
export const getCategoryIcon = (categoryId, type = 'expense') => {
  const category = getCategoryById(categoryId, type);
  return category && category.icon ? category.icon : 'Circle';
};

export default {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  PAYMENT_METHODS,
  GOAL_CATEGORIES,
  getCategoryById,
  getCategoryName,
  getCategoryColor,
  getCategoryIcon,
};
