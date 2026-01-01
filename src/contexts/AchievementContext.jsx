/**
 * Achievement Context
 * Tracks user achievements and unlocks badges based on activity
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { getItem, setItem, STORAGE_KEYS } from '@utils/localStorage';
import { BADGES, getAllBadges } from '@data/achievements';

const AchievementContext = createContext(null);

export const AchievementProvider = ({ children }) => {
  const { user } = useAuth();
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [stats, setStats] = useState({
    transactionCount: 0,
    budgetCount: 0,
    goalCount: 0,
    goalsCompleted: 0,
    contributionCount: 0,
    postCount: 0,
    commentCount: 0,
    upvotesReceived: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null,
    calculatorsUsed: [],
    underBudgetMonths: 0,
  });
  const [newBadge, setNewBadge] = useState(null); // For showing unlock animation

  // Load achievements from localStorage
  useEffect(() => {
    if (user) {
      loadAchievements();
    } else {
      setUnlockedBadges([]);
      setStats({
        transactionCount: 0,
        budgetCount: 0,
        goalCount: 0,
        goalsCompleted: 0,
        contributionCount: 0,
        postCount: 0,
        commentCount: 0,
        upvotesReceived: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null,
        calculatorsUsed: [],
        underBudgetMonths: 0,
      });
    }
  }, [user]);

  const loadAchievements = () => {
    try {
      const savedBadges = getItem(STORAGE_KEYS.ACHIEVEMENTS, []);
      const savedStats = getItem(STORAGE_KEYS.ACHIEVEMENT_STATS, {});

      setUnlockedBadges(savedBadges);
      setStats((prev) => ({ ...prev, ...savedStats }));
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const saveAchievements = useCallback((badges, newStats) => {
    try {
      setItem(STORAGE_KEYS.ACHIEVEMENTS, badges);
      setItem(STORAGE_KEYS.ACHIEVEMENT_STATS, newStats);
    } catch (error) {
      console.error('Error saving achievements:', error);
    }
  }, []);

  // Check if a badge should be unlocked
  const checkBadgeUnlock = useCallback((badge, currentStats) => {
    const { criteria } = badge;

    switch (criteria.type) {
      case 'transaction_count':
        return currentStats.transactionCount >= criteria.value;
      case 'budget_count':
        return currentStats.budgetCount >= criteria.value;
      case 'goal_count':
        return currentStats.goalCount >= criteria.value;
      case 'goals_completed':
        return currentStats.goalsCompleted >= criteria.value;
      case 'contribution_count':
        return currentStats.contributionCount >= criteria.value;
      case 'post_count':
        return currentStats.postCount >= criteria.value;
      case 'upvotes_received':
        return currentStats.upvotesReceived >= criteria.value;
      case 'karma':
        return (user?.karma || 0) >= criteria.value;
      case 'streak_days':
        return currentStats.currentStreak >= criteria.value || currentStats.longestStreak >= criteria.value;
      case 'calculators_used':
        return currentStats.calculatorsUsed?.length >= criteria.value;
      case 'under_budget_months':
        return currentStats.underBudgetMonths >= criteria.value;
      case 'profile_complete':
        return user?.email && user?.username;
      default:
        return false;
    }
  }, [user]);

  // Check all badges and unlock any that qualify
  const checkAndUnlockBadges = useCallback((newStats) => {
    const allBadges = getAllBadges();
    const newlyUnlocked = [];

    allBadges.forEach((badge) => {
      const isAlreadyUnlocked = unlockedBadges.includes(badge.id);
      const shouldUnlock = checkBadgeUnlock(badge, newStats);

      if (!isAlreadyUnlocked && shouldUnlock) {
        newlyUnlocked.push(badge.id);
      }
    });

    if (newlyUnlocked.length > 0) {
      const updatedBadges = [...unlockedBadges, ...newlyUnlocked];
      setUnlockedBadges(updatedBadges);
      saveAchievements(updatedBadges, newStats);

      // Show the first new badge (for animation)
      const firstNewBadge = getAllBadges().find((b) => b.id === newlyUnlocked[0]);
      setNewBadge(firstNewBadge);

      // Clear badge notification after delay
      setTimeout(() => setNewBadge(null), 5000);
    }

    return newlyUnlocked;
  }, [unlockedBadges, checkBadgeUnlock, saveAchievements]);

  // Update streak tracking
  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    const lastActivity = stats.lastActivityDate;

    if (lastActivity === today) {
      // Already logged activity today
      return stats;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    let newStreak = stats.currentStreak;
    let newLongest = stats.longestStreak;

    if (lastActivity === yesterdayStr) {
      // Consecutive day - increment streak
      newStreak += 1;
      if (newStreak > newLongest) {
        newLongest = newStreak;
      }
    } else if (lastActivity !== today) {
      // Streak broken - reset to 1
      newStreak = 1;
    }

    return {
      ...stats,
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastActivityDate: today,
    };
  }, [stats]);

  // Track transaction added
  const trackTransaction = useCallback(() => {
    if (!user) return;

    const streakUpdated = updateStreak();
    const newStats = {
      ...streakUpdated,
      transactionCount: streakUpdated.transactionCount + 1,
    };

    setStats(newStats);
    checkAndUnlockBadges(newStats);
    saveAchievements(unlockedBadges, newStats);
  }, [user, updateStreak, checkAndUnlockBadges, saveAchievements, unlockedBadges]);

  // Track budget created
  const trackBudget = useCallback(() => {
    if (!user) return;

    const newStats = {
      ...stats,
      budgetCount: stats.budgetCount + 1,
    };

    setStats(newStats);
    checkAndUnlockBadges(newStats);
    saveAchievements(unlockedBadges, newStats);
  }, [user, stats, checkAndUnlockBadges, saveAchievements, unlockedBadges]);

  // Track goal created
  const trackGoal = useCallback(() => {
    if (!user) return;

    const newStats = {
      ...stats,
      goalCount: stats.goalCount + 1,
    };

    setStats(newStats);
    checkAndUnlockBadges(newStats);
    saveAchievements(unlockedBadges, newStats);
  }, [user, stats, checkAndUnlockBadges, saveAchievements, unlockedBadges]);

  // Track goal completed
  const trackGoalCompleted = useCallback(() => {
    if (!user) return;

    const newStats = {
      ...stats,
      goalsCompleted: stats.goalsCompleted + 1,
    };

    setStats(newStats);
    checkAndUnlockBadges(newStats);
    saveAchievements(unlockedBadges, newStats);
  }, [user, stats, checkAndUnlockBadges, saveAchievements, unlockedBadges]);

  // Track contribution added
  const trackContribution = useCallback(() => {
    if (!user) return;

    const streakUpdated = updateStreak();
    const newStats = {
      ...streakUpdated,
      contributionCount: streakUpdated.contributionCount + 1,
    };

    setStats(newStats);
    checkAndUnlockBadges(newStats);
    saveAchievements(unlockedBadges, newStats);
  }, [user, updateStreak, checkAndUnlockBadges, saveAchievements, unlockedBadges]);

  // Track post created
  const trackPost = useCallback(() => {
    if (!user) return;

    const streakUpdated = updateStreak();
    const newStats = {
      ...streakUpdated,
      postCount: streakUpdated.postCount + 1,
    };

    setStats(newStats);
    checkAndUnlockBadges(newStats);
    saveAchievements(unlockedBadges, newStats);
  }, [user, updateStreak, checkAndUnlockBadges, saveAchievements, unlockedBadges]);

  // Track upvote received
  const trackUpvoteReceived = useCallback(() => {
    if (!user) return;

    const newStats = {
      ...stats,
      upvotesReceived: stats.upvotesReceived + 1,
    };

    setStats(newStats);
    checkAndUnlockBadges(newStats);
    saveAchievements(unlockedBadges, newStats);
  }, [user, stats, checkAndUnlockBadges, saveAchievements, unlockedBadges]);

  // Track calculator used
  const trackCalculatorUsed = useCallback((calculatorId) => {
    if (!user) return;

    const calculatorsUsed = stats.calculatorsUsed || [];
    if (calculatorsUsed.includes(calculatorId)) return;

    const newStats = {
      ...stats,
      calculatorsUsed: [...calculatorsUsed, calculatorId],
    };

    setStats(newStats);
    checkAndUnlockBadges(newStats);
    saveAchievements(unlockedBadges, newStats);
  }, [user, stats, checkAndUnlockBadges, saveAchievements, unlockedBadges]);

  // Track under budget month
  const trackUnderBudgetMonth = useCallback(() => {
    if (!user) return;

    const newStats = {
      ...stats,
      underBudgetMonths: stats.underBudgetMonths + 1,
    };

    setStats(newStats);
    checkAndUnlockBadges(newStats);
    saveAchievements(unlockedBadges, newStats);
  }, [user, stats, checkAndUnlockBadges, saveAchievements, unlockedBadges]);

  // Get all unlocked badge objects
  const getUnlockedBadges = useMemo(() => {
    return getAllBadges().filter((badge) => unlockedBadges.includes(badge.id));
  }, [unlockedBadges]);

  // Get all locked badge objects
  const getLockedBadges = useMemo(() => {
    return getAllBadges().filter((badge) => !unlockedBadges.includes(badge.id));
  }, [unlockedBadges]);

  // Get progress towards a badge
  const getBadgeProgress = useCallback((badgeId) => {
    const badge = getAllBadges().find((b) => b.id === badgeId);
    if (!badge) return { current: 0, target: 0, percentage: 0 };

    const { criteria } = badge;
    let current = 0;
    const target = criteria.value;

    switch (criteria.type) {
      case 'transaction_count':
        current = stats.transactionCount;
        break;
      case 'budget_count':
        current = stats.budgetCount;
        break;
      case 'goal_count':
        current = stats.goalCount;
        break;
      case 'goals_completed':
        current = stats.goalsCompleted;
        break;
      case 'contribution_count':
        current = stats.contributionCount;
        break;
      case 'post_count':
        current = stats.postCount;
        break;
      case 'upvotes_received':
        current = stats.upvotesReceived;
        break;
      case 'karma':
        current = user?.karma || 0;
        break;
      case 'streak_days':
        current = Math.max(stats.currentStreak, stats.longestStreak);
        break;
      case 'calculators_used':
        current = stats.calculatorsUsed?.length || 0;
        break;
      case 'under_budget_months':
        current = stats.underBudgetMonths;
        break;
      default:
        current = 0;
    }

    const percentage = Math.min((current / target) * 100, 100);
    return { current, target, percentage };
  }, [stats, user]);

  // Dismiss new badge notification
  const dismissNewBadge = useCallback(() => {
    setNewBadge(null);
  }, []);

  const value = {
    // State
    unlockedBadges,
    stats,
    newBadge,

    // Computed
    getUnlockedBadges,
    getLockedBadges,

    // Methods
    trackTransaction,
    trackBudget,
    trackGoal,
    trackGoalCompleted,
    trackContribution,
    trackPost,
    trackUpvoteReceived,
    trackCalculatorUsed,
    trackUnderBudgetMonth,
    getBadgeProgress,
    dismissNewBadge,
    checkAndUnlockBadges,
  };

  return (
    <AchievementContext.Provider value={value}>
      {children}
    </AchievementContext.Provider>
  );
};

// Custom hook
export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
};

export default AchievementContext;
