/**
 * Budget Context
 * Manages all financial data: expenses, budgets, income, savings goals
 * Uses Supabase for data persistence
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@services/supabaseClient';
import { getCurrentMonth } from '@utils/formatters';

const BudgetContext = createContext(null);

export const BudgetProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [income, setIncome] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    } else {
      // Clear data when user logs out
      setExpenses([]);
      setBudgets([]);
      setIncome([]);
      setSavingsGoals([]);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadUserData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch all data in parallel
      const [expensesRes, budgetsRes, incomeRes, goalsRes] = await Promise.all([
        supabase.from('expenses').select('*').eq('user_id', user.id).order('date', { ascending: false }),
        supabase.from('budgets').select('*').eq('user_id', user.id),
        supabase.from('income').select('*').eq('user_id', user.id).order('date', { ascending: false }),
        supabase.from('savings_goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);

      // Transform data to match frontend format
      if (expensesRes.data) {
        setExpenses(expensesRes.data.map(transformExpenseFromDb));
      }
      if (budgetsRes.data) {
        setBudgets(budgetsRes.data.map(transformBudgetFromDb));
      }
      if (incomeRes.data) {
        setIncome(incomeRes.data.map(transformIncomeFromDb));
      }
      if (goalsRes.data) {
        setSavingsGoals(goalsRes.data.map(transformGoalFromDb));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Transform functions for database <-> frontend format
  const transformExpenseFromDb = (expense) => ({
    id: expense.id,
    userId: expense.user_id,
    category: expense.category,
    amount: parseFloat(expense.amount),
    description: expense.description,
    date: new Date(expense.date).getTime(),
    paymentMethod: expense.payment_method,
    recurrence: expense.recurrence,
    createdAt: new Date(expense.created_at).getTime(),
    updatedAt: new Date(expense.updated_at).getTime(),
  });

  const transformIncomeFromDb = (income) => ({
    id: income.id,
    userId: income.user_id,
    category: income.category,
    amount: parseFloat(income.amount),
    description: income.description,
    date: new Date(income.date).getTime(),
    recurrence: income.recurrence,
    createdAt: new Date(income.created_at).getTime(),
    updatedAt: new Date(income.updated_at).getTime(),
  });

  const transformBudgetFromDb = (budget) => ({
    id: budget.id,
    userId: budget.user_id,
    month: budget.month,
    totalBudget: parseFloat(budget.total_budget),
    categories: budget.categories || [],
    createdAt: new Date(budget.created_at).getTime(),
    updatedAt: new Date(budget.updated_at).getTime(),
  });

  const transformGoalFromDb = (goal) => ({
    id: goal.id,
    userId: goal.user_id,
    name: goal.name,
    targetAmount: parseFloat(goal.target_amount),
    currentAmount: parseFloat(goal.current_amount || 0),
    description: goal.description,
    deadline: goal.deadline ? new Date(goal.deadline).getTime() : null,
    category: goal.category,
    contributions: goal.contributions || [],
    createdAt: new Date(goal.created_at).getTime(),
    updatedAt: new Date(goal.updated_at).getTime(),
  });

  // EXPENSE METHODS
  const addExpense = useCallback(async (expenseData) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          user_id: user.id,
          category: expenseData.category,
          amount: expenseData.amount,
          description: expenseData.description,
          date: new Date(expenseData.date).toISOString(),
          payment_method: expenseData.paymentMethod,
          recurrence: expenseData.recurrence || 'none',
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding expense:', error);
        return { success: false, error: error.message };
      }

      const newExpense = transformExpenseFromDb(data);
      setExpenses((prev) => [newExpense, ...prev]);

      return { success: true, expense: newExpense };
    } catch (error) {
      console.error('Error adding expense:', error);
      return { success: false, error: 'Failed to add expense' };
    }
  }, [user]);

  const updateExpense = useCallback(async (id, updates) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const updateData = {};
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.amount !== undefined) updateData.amount = updates.amount;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.date !== undefined) updateData.date = new Date(updates.date).toISOString();
      if (updates.paymentMethod !== undefined) updateData.payment_method = updates.paymentMethod;
      if (updates.recurrence !== undefined) updateData.recurrence = updates.recurrence;

      const { data, error } = await supabase
        .from('expenses')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating expense:', error);
        return { success: false, error: error.message };
      }

      const updatedExpense = transformExpenseFromDb(data);
      setExpenses((prev) => prev.map((e) => (e.id === id ? updatedExpense : e)));

      return { success: true };
    } catch (error) {
      console.error('Error updating expense:', error);
      return { success: false, error: 'Failed to update expense' };
    }
  }, [user]);

  const deleteExpense = useCallback(async (id) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting expense:', error);
        return { success: false, error: error.message };
      }

      setExpenses((prev) => prev.filter((e) => e.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting expense:', error);
      return { success: false, error: 'Failed to delete expense' };
    }
  }, [user]);

  // BUDGET METHODS
  const createBudget = useCallback(async (budgetData) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert({
          user_id: user.id,
          month: budgetData.month,
          total_budget: budgetData.totalBudget,
          categories: budgetData.categories || [],
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating budget:', error);
        return { success: false, error: error.message };
      }

      const newBudget = transformBudgetFromDb(data);
      setBudgets((prev) => [...prev, newBudget]);

      return { success: true, budget: newBudget };
    } catch (error) {
      console.error('Error creating budget:', error);
      return { success: false, error: 'Failed to create budget' };
    }
  }, [user]);

  const updateBudget = useCallback(async (id, updates) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const updateData = {};
      if (updates.month !== undefined) updateData.month = updates.month;
      if (updates.totalBudget !== undefined) updateData.total_budget = updates.totalBudget;
      if (updates.categories !== undefined) updateData.categories = updates.categories;

      const { data, error } = await supabase
        .from('budgets')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating budget:', error);
        return { success: false, error: error.message };
      }

      const updatedBudget = transformBudgetFromDb(data);
      setBudgets((prev) => prev.map((b) => (b.id === id ? updatedBudget : b)));

      return { success: true };
    } catch (error) {
      console.error('Error updating budget:', error);
      return { success: false, error: 'Failed to update budget' };
    }
  }, [user]);

  const deleteBudget = useCallback(async (id) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting budget:', error);
        return { success: false, error: error.message };
      }

      setBudgets((prev) => prev.filter((b) => b.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting budget:', error);
      return { success: false, error: 'Failed to delete budget' };
    }
  }, [user]);

  // INCOME METHODS
  const addIncome = useCallback(async (incomeData) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('income')
        .insert({
          user_id: user.id,
          category: incomeData.category,
          amount: incomeData.amount,
          description: incomeData.description,
          date: new Date(incomeData.date).toISOString(),
          recurrence: incomeData.recurrence || 'none',
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding income:', error);
        return { success: false, error: error.message };
      }

      const newIncome = transformIncomeFromDb(data);
      setIncome((prev) => [newIncome, ...prev]);

      return { success: true, income: newIncome };
    } catch (error) {
      console.error('Error adding income:', error);
      return { success: false, error: 'Failed to add income' };
    }
  }, [user]);

  const updateIncome = useCallback(async (id, updates) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const updateData = {};
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.amount !== undefined) updateData.amount = updates.amount;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.date !== undefined) updateData.date = new Date(updates.date).toISOString();
      if (updates.recurrence !== undefined) updateData.recurrence = updates.recurrence;

      const { data, error } = await supabase
        .from('income')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating income:', error);
        return { success: false, error: error.message };
      }

      const updatedIncome = transformIncomeFromDb(data);
      setIncome((prev) => prev.map((i) => (i.id === id ? updatedIncome : i)));

      return { success: true };
    } catch (error) {
      console.error('Error updating income:', error);
      return { success: false, error: 'Failed to update income' };
    }
  }, [user]);

  const deleteIncome = useCallback(async (id) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('income')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting income:', error);
        return { success: false, error: error.message };
      }

      setIncome((prev) => prev.filter((i) => i.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting income:', error);
      return { success: false, error: 'Failed to delete income' };
    }
  }, [user]);

  // SAVINGS GOAL METHODS
  const createGoal = useCallback(async (goalData) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .insert({
          user_id: user.id,
          name: goalData.name,
          target_amount: goalData.targetAmount,
          current_amount: goalData.currentAmount || 0,
          description: goalData.description,
          deadline: goalData.deadline ? new Date(goalData.deadline).toISOString() : null,
          category: goalData.category,
          contributions: goalData.contributions || [],
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating goal:', error);
        return { success: false, error: error.message };
      }

      const newGoal = transformGoalFromDb(data);
      setSavingsGoals((prev) => [newGoal, ...prev]);

      return { success: true, goal: newGoal };
    } catch (error) {
      console.error('Error creating goal:', error);
      return { success: false, error: 'Failed to create goal' };
    }
  }, [user]);

  const updateGoal = useCallback(async (id, updates) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const updateData = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.targetAmount !== undefined) updateData.target_amount = updates.targetAmount;
      if (updates.currentAmount !== undefined) updateData.current_amount = updates.currentAmount;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.deadline !== undefined) updateData.deadline = updates.deadline ? new Date(updates.deadline).toISOString() : null;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.contributions !== undefined) updateData.contributions = updates.contributions;

      const { data, error } = await supabase
        .from('savings_goals')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating goal:', error);
        return { success: false, error: error.message };
      }

      const updatedGoal = transformGoalFromDb(data);
      setSavingsGoals((prev) => prev.map((g) => (g.id === id ? updatedGoal : g)));

      return { success: true };
    } catch (error) {
      console.error('Error updating goal:', error);
      return { success: false, error: 'Failed to update goal' };
    }
  }, [user]);

  const deleteGoal = useCallback(async (id) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('savings_goals')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting goal:', error);
        return { success: false, error: error.message };
      }

      setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting goal:', error);
      return { success: false, error: 'Failed to delete goal' };
    }
  }, [user]);

  const addContribution = useCallback(async (goalId, amount) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      // Find the current goal
      const currentGoal = savingsGoals.find((g) => g.id === goalId);
      if (!currentGoal) {
        return { success: false, error: 'Goal not found' };
      }

      const contribution = {
        amount,
        date: Date.now(),
      };

      const newCurrentAmount = (currentGoal.currentAmount || 0) + amount;
      const newContributions = [...(currentGoal.contributions || []), contribution];

      const { data, error } = await supabase
        .from('savings_goals')
        .update({
          current_amount: newCurrentAmount,
          contributions: newContributions,
        })
        .eq('id', goalId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error adding contribution:', error);
        return { success: false, error: error.message };
      }

      const updatedGoal = transformGoalFromDb(data);
      setSavingsGoals((prev) => prev.map((g) => (g.id === goalId ? updatedGoal : g)));

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

    // Refresh data
    refreshData: loadUserData,
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
