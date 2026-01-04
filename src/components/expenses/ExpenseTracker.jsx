/**
 * ExpenseTracker Component
 * Main page for tracking and managing expenses
 */

import { useState } from 'react';
import { Plus, TrendingDown, TrendingUp, PieChart } from 'lucide-react';
import { useBudget } from '@contexts/BudgetContext';
import PageLayout from '@components/layout/PageLayout';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Modal from '@components/common/Modal';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import CategoryPieChart from './CategoryPieChart';
import { formatCurrency, formatBudgetMonth, getCurrentMonth } from '@utils/formatters';
import { SUCCESS_MESSAGES } from '@utils/constants';

const ExpenseTracker = () => {
  const {
    currentMonthTransactions,
    totalExpenses,
    totalIncome,
    addExpense,
    addIncome,
    updateExpense,
    updateIncome,
    deleteExpense,
    deleteIncome,
    loading,
  } = useBudget();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showChartView, setShowChartView] = useState(false);

  const handleAddTransaction = async (transactionData) => {
    let result;
    if (transactionData.type === 'income') {
      result = await addIncome(transactionData);
    } else {
      result = await addExpense(transactionData);
    }

    if (result.success) {
      setShowAddModal(false);
      console.log(transactionData.type === 'income' ? 'Income added successfully' : SUCCESS_MESSAGES.EXPENSE_ADDED);
    } else {
      console.error('Failed to add transaction:', result.error);
    }
  };

  const handleEditTransaction = async (id, updates) => {
    // Determine if it's income or expense based on the type
    let result;
    if (updates.type === 'income') {
      result = await updateIncome(id, updates);
    } else {
      result = await updateExpense(id, updates);
    }

    if (result.success) {
      console.log(updates.type === 'income' ? 'Income updated successfully' : SUCCESS_MESSAGES.EXPENSE_UPDATED);
    } else {
      console.error('Failed to update transaction:', result.error);
    }
  };

  const handleDeleteTransaction = async (id, type) => {
    let result;
    if (type === 'income') {
      result = await deleteIncome(id);
    } else {
      result = await deleteExpense(id);
    }

    if (result.success) {
      console.log(type === 'income' ? 'Income deleted successfully' : SUCCESS_MESSAGES.EXPENSE_DELETED);
    } else {
      console.error('Failed to delete transaction:', result.error);
    }
  };

  const currentMonth = getCurrentMonth();

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Expense Tracker
          </h1>
          <p className="text-slate-400 text-lg">
            Track and manage your expenses for {formatBudgetMonth(currentMonth)}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card variant="gradient" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Income</p>
                <h3 className="text-3xl font-bold text-green-400">
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
                <p className="text-slate-400 text-sm mb-1">Total Expenses</p>
                <h3 className="text-3xl font-bold text-red-400">
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
                <p className="text-slate-400 text-sm mb-1">Net Balance</p>
                <h3 className={`text-3xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(totalIncome - totalExpenses)}
                </h3>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <PieChart className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card variant="gradient" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Transactions</p>
                <h3 className="text-3xl font-bold text-white">
                  {currentMonthTransactions.length}
                </h3>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <PieChart className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowAddModal(true)}
            size="lg"
          >
            Add Transaction
          </Button>

          <div className="flex gap-2">
            <Button
              variant={!showChartView ? 'primary' : 'outline'}
              onClick={() => setShowChartView(false)}
            >
              List View
            </Button>
            <Button
              variant={showChartView ? 'primary' : 'outline'}
              onClick={() => setShowChartView(true)}
              icon={PieChart}
            >
              Chart View
            </Button>
          </div>
        </div>

        {/* Main Content */}
        {showChartView ? (
          <Card title="Expense Breakdown" icon={PieChart}>
            <CategoryPieChart expenses={currentMonthTransactions.filter(t => t.type === 'expense')} />
          </Card>
        ) : (
          <Card
            title="All Transactions"
            subtitle={`${currentMonthTransactions.length} transactions this month`}
            icon={TrendingDown}
          >
            <ExpenseList
              expenses={currentMonthTransactions}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
              loading={loading}
            />
          </Card>
        )}
      </div>

      {/* Add Transaction Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Transaction"
        size="lg"
      >
        <ExpenseForm
          onSubmit={handleAddTransaction}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
    </PageLayout>
  );
};

export default ExpenseTracker;
