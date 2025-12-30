/**
 * Test Dashboard
 * Demo page to test authentication, routing, and BudgetContext
 */

import { useState } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { useBudget } from '@contexts/BudgetContext';
import PageLayout from '@components/layout/PageLayout';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import AuthModal from '@components/auth/AuthModal';
import { Plus, TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { formatCurrency, formatDate } from '@utils/formatters';
import { EXPENSE_CATEGORIES } from '@data/categories';

const TestDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const {
    expenses,
    addExpense,
    totalExpenses,
    totalIncome,
    netWorth,
    loading,
  } = useBudget();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  // Form state
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    category: 'food',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'card',
  });

  const handleAddExpense = () => {
    if (!expenseForm.amount || !expenseForm.description) {
      alert('Please fill in all fields');
      return;
    }

    const result = addExpense({
      amount: parseFloat(expenseForm.amount),
      category: expenseForm.category,
      description: expenseForm.description,
      date: new Date(expenseForm.date).getTime(),
      paymentMethod: expenseForm.paymentMethod,
      type: 'expense',
      tags: [],
    });

    if (result.success) {
      alert('Expense added successfully!');
      setExpenseForm({
        amount: '',
        category: 'food',
        description: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'card',
      });
      setShowExpenseForm(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="mb-6 text-6xl">🔐</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Authentication Test
            </h2>
            <p className="text-slate-400 mb-8">
              Please login to test the dashboard features.
            </p>
            <Button
              onClick={() => setShowAuthModal(true)}
              icon={DollarSign}
              size="lg"
            >
              Login / Sign Up
            </Button>
          </div>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </PageLayout>
    );
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-slate-400">Loading your data...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-slate-400 text-lg">
            Testing Dashboard - Phase 1 Complete
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card variant="gradient" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Expenses</p>
                <h3 className="text-3xl font-bold text-white">
                  {formatCurrency(totalExpenses)}
                </h3>
              </div>
              <div className="p-3 bg-red-500/20 rounded-lg">
                <TrendingDown className="w-8 h-8 text-red-400" />
              </div>
            </div>
          </Card>

          <Card variant="gradient" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Income</p>
                <h3 className="text-3xl font-bold text-white">
                  {formatCurrency(totalIncome)}
                </h3>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </Card>

          <Card variant="gradient" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Net Worth</p>
                <h3 className="text-3xl font-bold text-white">
                  {formatCurrency(netWorth)}
                </h3>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Target className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card title="Quick Actions" icon={Plus} className="mb-8">
          <div className="flex flex-wrap gap-3">
            <Button
              variant={showExpenseForm ? 'secondary' : 'primary'}
              icon={Plus}
              onClick={() => setShowExpenseForm(!showExpenseForm)}
            >
              {showExpenseForm ? 'Cancel' : 'Add Expense'}
            </Button>
            <Button variant="outline" icon={TrendingUp}>
              Add Income
            </Button>
            <Button variant="outline" icon={Target}>
              Create Goal
            </Button>
          </div>

          {/* Expense Form */}
          {showExpenseForm && (
            <div className="mt-6 p-6 bg-slate-900/50 rounded-lg border border-slate-700">
              <h4 className="text-lg font-bold text-white mb-4">Add New Expense</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Amount"
                  type="number"
                  name="amount"
                  value={expenseForm.amount}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, amount: e.target.value })
                  }
                  placeholder="Enter amount"
                  icon={DollarSign}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) =>
                      setExpenseForm({ ...expenseForm, category: e.target.value })
                    }
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50"
                  >
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Description"
                  type="text"
                  name="description"
                  value={expenseForm.description}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, description: e.target.value })
                  }
                  placeholder="What did you buy?"
                  required
                />

                <Input
                  label="Date"
                  type="date"
                  name="date"
                  value={expenseForm.date}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mt-4 flex gap-3">
                <Button onClick={handleAddExpense} icon={Plus}>
                  Add Expense
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowExpenseForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Recent Expenses */}
        <Card
          title="Recent Expenses"
          subtitle={`${expenses.length} transactions`}
          icon={TrendingDown}
        >
          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-slate-400 text-lg">No expenses yet</p>
              <p className="text-slate-500 text-sm mt-2">
                Add your first expense to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.slice(0, 10).map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <TrendingDown className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        {expense.description}
                      </h4>
                      <p className="text-sm text-slate-400">
                        {expense.category} • {formatDate(expense.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-400">
                      -{formatCurrency(expense.amount)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {expense.paymentMethod}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Test Info */}
        <Card variant="glass" className="mt-8">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              🎉 Phase 1 Testing Complete!
            </h3>
            <p className="text-slate-400 mb-4">
              Your authentication, routing, and BudgetContext are working perfectly!
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                <p className="text-green-400 font-bold">✓ Auth</p>
                <p className="text-slate-400">Working</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                <p className="text-green-400 font-bold">✓ Routing</p>
                <p className="text-slate-400">Working</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                <p className="text-green-400 font-bold">✓ Context</p>
                <p className="text-slate-400">Working</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                <p className="text-green-400 font-bold">✓ Storage</p>
                <p className="text-slate-400">Working</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default TestDashboard;
