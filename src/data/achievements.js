/**
 * Achievement Badge Definitions
 * Defines all available badges and their unlock criteria
 */

export const BADGE_CATEGORIES = {
  GETTING_STARTED: 'getting_started',
  BUDGETING: 'budgeting',
  SAVINGS: 'savings',
  COMMUNITY: 'community',
  CONSISTENCY: 'consistency',
};

export const BADGES = {
  // Getting Started
  FIRST_STEPS: {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Add your first transaction',
    icon: '🎯',
    category: BADGE_CATEGORIES.GETTING_STARTED,
    criteria: { type: 'transaction_count', value: 1 },
  },
  PROFILE_COMPLETE: {
    id: 'profile_complete',
    name: 'Identity Verified',
    description: 'Complete your profile information',
    icon: '👤',
    category: BADGE_CATEGORIES.GETTING_STARTED,
    criteria: { type: 'profile_complete', value: true },
  },

  // Budgeting
  BUDGET_CREATOR: {
    id: 'budget_creator',
    name: 'Budget Creator',
    description: 'Create your first monthly budget',
    icon: '📊',
    category: BADGE_CATEGORIES.BUDGETING,
    criteria: { type: 'budget_count', value: 1 },
  },
  BUDGET_MASTER: {
    id: 'budget_master',
    name: 'Budget Master',
    description: 'Stay under budget for a full month',
    icon: '🏆',
    category: BADGE_CATEGORIES.BUDGETING,
    criteria: { type: 'under_budget_months', value: 1 },
  },
  EXPENSE_TRACKER: {
    id: 'expense_tracker',
    name: 'Expense Tracker',
    description: 'Log 10 transactions',
    icon: '📝',
    category: BADGE_CATEGORIES.BUDGETING,
    criteria: { type: 'transaction_count', value: 10 },
  },
  MONEY_MANAGER: {
    id: 'money_manager',
    name: 'Money Manager',
    description: 'Log 50 transactions',
    icon: '💼',
    category: BADGE_CATEGORIES.BUDGETING,
    criteria: { type: 'transaction_count', value: 50 },
  },

  // Savings
  SAVER: {
    id: 'saver',
    name: 'Saver',
    description: 'Create your first savings goal',
    icon: '💰',
    category: BADGE_CATEGORIES.SAVINGS,
    criteria: { type: 'goal_count', value: 1 },
  },
  GOAL_CRUSHER: {
    id: 'goal_crusher',
    name: 'Goal Crusher',
    description: 'Complete a savings goal',
    icon: '🎉',
    category: BADGE_CATEGORIES.SAVINGS,
    criteria: { type: 'goals_completed', value: 1 },
  },
  SUPER_SAVER: {
    id: 'super_saver',
    name: 'Super Saver',
    description: 'Complete 3 savings goals',
    icon: '🌟',
    category: BADGE_CATEGORIES.SAVINGS,
    criteria: { type: 'goals_completed', value: 3 },
  },
  CONTRIBUTOR: {
    id: 'contributor',
    name: 'Contributor',
    description: 'Make 10 contributions to your goals',
    icon: '💎',
    category: BADGE_CATEGORIES.SAVINGS,
    criteria: { type: 'contribution_count', value: 10 },
  },

  // Community
  COMMUNITY_VOICE: {
    id: 'community_voice',
    name: 'Community Voice',
    description: 'Create your first community post',
    icon: '💬',
    category: BADGE_CATEGORIES.COMMUNITY,
    criteria: { type: 'post_count', value: 1 },
  },
  DISCUSSION_STARTER: {
    id: 'discussion_starter',
    name: 'Discussion Starter',
    description: 'Create 5 community posts',
    icon: '🗣️',
    category: BADGE_CATEGORIES.COMMUNITY,
    criteria: { type: 'post_count', value: 5 },
  },
  HELPFUL: {
    id: 'helpful',
    name: 'Helpful',
    description: 'Receive 10 upvotes on your posts or comments',
    icon: '⭐',
    category: BADGE_CATEGORIES.COMMUNITY,
    criteria: { type: 'upvotes_received', value: 10 },
  },
  INFLUENCER: {
    id: 'influencer',
    name: 'Influencer',
    description: 'Receive 50 upvotes on your posts or comments',
    icon: '👑',
    category: BADGE_CATEGORIES.COMMUNITY,
    criteria: { type: 'upvotes_received', value: 50 },
  },

  // Consistency
  CONSISTENT: {
    id: 'consistent',
    name: 'Consistent',
    description: 'Log transactions for 7 days in a row',
    icon: '🔥',
    category: BADGE_CATEGORIES.CONSISTENCY,
    criteria: { type: 'streak_days', value: 7 },
  },
  DEDICATED: {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Maintain a 30-day streak',
    icon: '💪',
    category: BADGE_CATEGORIES.CONSISTENCY,
    criteria: { type: 'streak_days', value: 30 },
  },
  CALCULATOR_PRO: {
    id: 'calculator_pro',
    name: 'Calculator Pro',
    description: 'Use all 6 financial calculators',
    icon: '🧮',
    category: BADGE_CATEGORIES.CONSISTENCY,
    criteria: { type: 'calculators_used', value: 6 },
  },
};

// Get all badges as an array
export const getAllBadges = () => Object.values(BADGES);

// Get badges by category
export const getBadgesByCategory = (category) =>
  Object.values(BADGES).filter((badge) => badge.category === category);

// Get a specific badge by ID
export const getBadgeById = (id) =>
  Object.values(BADGES).find((badge) => badge.id === id);

export default BADGES;
