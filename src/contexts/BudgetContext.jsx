/**
 * Budget Context
 * Manages all financial data: expenses, budgets, income, savings goals
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { getItem, setItem, STORAGE_KEYS } from '@utils/localStorage';
import { getCurrentMonth } from '@utils/formatters';
import { v4 as uuidv4 } from 'uuid';

const BudgetContext = createContext(null);

export const BudgetProvider = ({ children }) => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [income, setIncome] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage when user changes
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      // Clear data when user logs out
      setExpenses([]);
      setBudgets([]);
      setIncome([]);
      setSavingsGoals([]);
      setLoading(false);
    }
  }, [user]);

  const loadUserData = () => {
    try {
      const userExpenses = getItem(STORAGE_KEYS.EXPENSES, []);
      const userBudgets = getItem(STORAGE_KEYS.BUDGETS, []);
      const userIncome = getItem(STORAGE_KEYS.INCOME, []);
      const userGoals = getItem(STORAGE_KEYS.GOALS, []);

      setExpenses(userExpenses);
      setBudgets(userBudgets);
      setIncome(userIncome);
      setSavingsGoals(userGoals);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // EXPENSE METHODS
  const addExpense = useCallback((expenseData) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const newExpense = {
        id: uuidv4(),
        userId: user.id,
        ...expenseData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const updatedExpenses = [...expenses, newExpense];
      setExpenses(updatedExpenses);
      setItem(STORAGE_KEYS.EXPENSES, updatedExpenses);

      return { success: true, expense: newExpense };
    } catch (error) {
      console.error('Error adding expense:', error);
      return { success: false, error: 'Failed to add expense' };
    }
  }, [user, expenses]);

  const updateExpense = useCallback((id, updates) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const updatedExpenses = expenses.map((expense) =>
        expense.id === id
          ? { ...expense, ...updates, updatedAt: Date.now() }
          : expense
      );

      setExpenses(updatedExpenses);
      setItem(STORAGE_KEYS.EXPENSES, updatedExpenses);

      return { success: true };
    } catch (error) {
      console.error('Error updating expense:', error);
      return { success: false, error: 'Failed to update expense' };
    }
  }, [user, expenses]);

  const deleteExpense = useCallback((id) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const updatedExpenses = expenses.filter((expense) => expense.id !== id);
      setExpenses(updatedExpenses);
      setItem(STORAGE_KEYS.EXPENSES, updatedExpenses);

      return { success: true };
    } catch (error) {
      console.error('Error deleting expense:', error);
      return { success: false, error: 'Failed to delete expense' };
    }
  }, [user, expenses]);

  // BUDGET METHODS
  const createBudget = useCallback((budgetData) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const newBudget = {
        id: uuidv4(),
        userId: user.id,
        ...budgetData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const updatedBudgets = [...budgets, newBudget];
      setBudgets(updatedBudgets);
      setItem(STORAGE_KEYS.BUDGETS, updatedBudgets);

      return { success: true, budget: newBudget };
    } catch (error) {
      console.error('Error creating budget:', error);
      return { success: false, error: 'Failed to create budget' };
    }
  }, [user, budgets]);

  const updateBudget = useCallback((id, updates) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const updatedBudgets = budgets.map((budget) =>
        budget.id === id
          ? { ...budget, ...updates, updatedAt: Date.now() }
          : budget
      );

      setBudgets(updatedBudgets);
      setItem(STORAGE_KEYS.BUDGETS, updatedBudgets);

      return { success: true };
    } catch (error) {
      console.error('Error updating budget:', error);
      return { success: false, error: 'Failed to update budget' };
    }
  }, [user, budgets]);

  const deleteBudget = useCallback((id) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const updatedBudgets = budgets.filter((budget) => budget.id !== id);
      setBudgets(updatedBudgets);
      setItem(STORAGE_KEYS.BUDGETS, updatedBudgets);

      return { success: true };
    } catch (error) {
      console.error('Error deleting budget:', error);
      return { success: false, error: 'Failed to delete budget' };
    }
  }, [user, budgets]);

  // INCOME METHODS
  const addIncome = useCallback((incomeData) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const newIncome = {
        id: uuidv4(),
        userId: user.id,
        ...incomeData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const updatedIncome = [...income, newIncome];
      setIncome(updatedIncome);
      setItem(STORAGE_KEYS.INCOME, updatedIncome);

      return { success: true, income: newIncome };
    } catch (error) {
      console.error('Error adding income:', error);
      return { success: false, error: 'Failed to add income' };
    }
  }, [user, income]);

  const updateIncome = useCallback((id, updates) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const updatedIncome = income.map((item) =>
        item.id === id
          ? { ...item, ...updates, updatedAt: Date.now() }
          : item
      );

      setIncome(updatedIncome);
      setItem(STORAGE_KEYS.INCOME, updatedIncome);

      return { success: true };
    } catch (error) {
      console.error('Error updating income:', error);
      return { success: false, error: 'Failed to update income' };
    }
  }, [user, income]);

  const deleteIncome = useCallback((id) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const updatedIncome = income.filter((item) => item.id !== id);
      setIncome(updatedIncome);
      setItem(STORAGE_KEYS.INCOME, updatedIncome);

      return { success: true };
    } catch (error) {
      console.error('Error deleting income:', error);
      return { success: false, error: 'Failed to delete income' };
    }
  }, [user, income]);

  // SAVINGS GOAL METHODS
  const createGoal = useCallback((goalData) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const newGoal = {
        id: uuidv4(),
        userId: user.id,
        ...goalData,
        currentAmount: goalData.currentAmount || 0,
        contributions: goalData.contributions || [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const updatedGoals = [...savingsGoals, newGoal];
      setSavingsGoals(updatedGoals);
      setItem(STORAGE_KEYS.GOALS, updatedGoals);

      return { success: true, goal: newGoal };
    } catch (error) {
      console.error('Error creating goal:', error);
      return { success: false, error: 'Failed to create goal' };
    }
  }, [user, savingsGoals]);

  const updateGoal = useCallback((id, updates) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const updatedGoals = savingsGoals.map((goal) =>
        goal.id === id
          ? { ...goal, ...updates, updatedAt: Date.now() }
          : goal
      );

      setSavingsGoals(updatedGoals);
      setItem(STORAGE_KEYS.GOALS, updatedGoals);

      return { success: true };
    } catch (error) {
      console.error('Error updating goal:', error);
      return { success: false, error: 'Failed to update goal' };
    }
  }, [user, savingsGoals]);

  const deleteGoal = useCallback((id) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const updatedGoals = savingsGoals.filter((goal) => goal.id !== id);
      setSavingsGoals(updatedGoals);
      setItem(STORAGE_KEYS.GOALS, updatedGoals);

      return { success: true };
    } catch (error) {
      console.error('Error deleting goal:', error);
      return { success: false, error: 'Failed to delete goal' };
    }
  }, [user, savingsGoals]);

  const addContribution = useCallback((goalId, amount) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const updatedGoals = savingsGoals.map((goal) => {
        if (goal.id === goalId) {
          const contribution = {
            amount,
            date: Date.now(),
          };
          return {
            ...goal,
            currentAmount: (goal.currentAmount || 0) + amount,
            contributions: [...(goal.contributions || []), contribution],
            updatedAt: Date.now(),
          };
        }
        return goal;
      });

      setSavingsGoals(updatedGoals);
      setItem(STORAGE_KEYS.GOALS, updatedGoals);

      return { success: true };
    } catch (error) {
      console.error('Error adding contribution:', error);
      return { success: false, error: 'Failed to add contribution' };
    }
  }, [user, savingsGoals]);

  // COMPUTED VALUES
  const currentMonthBudget = useMemo(() => {
    const currentMonth = getCurrentMonth();
    return budgets.find((b) => b.month === currentMonth);
  }, [budgets]);

  const currentMonthExpenses = useMemo(() => {
    const currentMonth = getCurrentMonth();
    return expenses.filter((e) => {
      const expenseMonth = new Date(e.date).toISOString().slice(0, 7);
      return expenseMonth === currentMonth;
    });
  }, [expenses]);

  const currentMonthIncome = useMemo(() => {
    const currentMonth = getCurrentMonth();
    return income.filter((i) => {
      const incomeMonth = new Date(i.date).toISOString().slice(0, 7);
      return incomeMonth === currentMonth;
    });
  }, [income]);

  // Combined transactions (both income and expenses) for current month
  const currentMonthTransactions = useMemo(() => {
    return [...currentMonthExpenses, ...currentMonthIncome].sort((a, b) => b.date - a.date);
  }, [currentMonthExpenses, currentMonthIncome]);

  const totalExpenses = useMemo(() => {
    return currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [currentMonthExpenses]);

  const totalIncome = useMemo(() => {
    return currentMonthIncome.reduce((sum, item) => sum + item.amount, 0);
  }, [currentMonthIncome]);

  const netWorth = useMemo(() => {
    const totalSavings = savingsGoals.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0);
    return totalIncome - totalExpenses + totalSavings;
  }, [totalIncome, totalExpenses, savingsGoals]);

  const budgetProgress = useMemo(() => {
    if (!currentMonthBudget || currentMonthBudget.totalBudget === 0) {
      return 0;
    }
    return (totalExpenses / currentMonthBudget.totalBudget) * 100;
  }, [currentMonthBudget, totalExpenses]);

  const value = {
    // State
    expenses,
    budgets,
    income,
    savingsGoals,
    loading,

    // Expense methods
    addExpense,
    updateExpense,
    deleteExpense,

    // Budget methods
    createBudget,
    updateBudget,
    deleteBudget,

    // Income methods
    addIncome,
    updateIncome,
    deleteIncome,

    // Savings goal methods
    createGoal,
    updateGoal,
    deleteGoal,
    addContribution,

    // Computed values
    currentMonthBudget,
    currentMonthExpenses,
    currentMonthIncome,
    currentMonthTransactions,
    totalExpenses,
    totalIncome,
    netWorth,
    budgetProgress,
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
};

// Custom hook to use budget context
export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};

export default BudgetContext;
