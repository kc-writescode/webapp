/**
 * SavingsGoals Component
 * Main savings goals tracking page
 */

import { useState, useMemo } from 'react';
import { Plus, Target, TrendingUp, Award, Search } from 'lucide-react';
import { useBudget } from '@contexts/BudgetContext';
import { useToast } from '@contexts/ToastContext';
import { useAchievements } from '@contexts/AchievementContext';
import { formatCurrency } from '@utils/formatters';
import PageLayout from '@components/layout/PageLayout';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Modal from '@components/common/Modal';
import Input from '@components/common/Input';
import GoalCard from './GoalCard';
import GoalForm from './GoalForm';

const SavingsGoals = () => {
  const {
    savingsGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    addContribution,
    loading,
  } = useBudget();
  const toast = useToast();
  const { trackGoal, trackContribution, trackGoalCompleted } = useAchievements();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('progress'); // progress, deadline, amount

  // Computed values
  const { totalSaved, totalTarget, activeGoals, completedGoals, overallProgress } = useMemo(() => {
    const saved = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const target = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const active = savingsGoals.filter((g) => g.currentAmount < g.targetAmount);
    const completed = savingsGoals.filter((g) => g.currentAmount >= g.targetAmount);
    const progress = target > 0 ? (saved / target) * 100 : 0;

    return {
      totalSaved: saved,
      totalTarget: target,
      activeGoals: active,
      completedGoals: completed,
      overallProgress: progress,
    };
  }, [savingsGoals]);

  // Filter and sort goals
  const filteredGoals = useMemo(() => {
    let filtered = [...savingsGoals];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((goal) =>
        goal.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'progress':
          const progressA = (a.currentAmount / a.targetAmount) * 100;
          const progressB = (b.currentAmount / b.targetAmount) * 100;
          return progressB - progressA;
        case 'deadline':
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return a.deadline - b.deadline;
        case 'amount':
          return b.targetAmount - a.targetAmount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [savingsGoals, searchTerm, sortBy]);

  const handleCreateGoal = (goalData) => {
    const result = createGoal(goalData);
    if (result.success) {
      setShowCreateModal(false);
      toast.success('Savings goal created successfully!');
      trackGoal(); // Track for achievements
    } else {
      toast.error(result.error || 'Failed to create goal');
    }
  };

  const handleUpdateGoal = (id, updates) => {
    const result = updateGoal(id, updates);
    if (result.success) {
      toast.success('Goal updated successfully!');
    } else {
      toast.error(result.error || 'Failed to update goal');
    }
  };

  const handleDeleteGoal = (id) => {
    const result = deleteGoal(id);
    if (result.success) {
      toast.success('Goal deleted successfully!');
    } else {
      toast.error(result.error || 'Failed to delete goal');
    }
  };

  const handleAddContribution = (goalId, amount) => {
    // Check if goal will be completed after this contribution
    const goal = savingsGoals.find((g) => g.id === goalId);
    const wasIncomplete = goal && goal.currentAmount < goal.targetAmount;
    const willBeComplete = goal && (goal.currentAmount + amount) >= goal.targetAmount;

    const result = addContribution(goalId, amount);
    if (result.success) {
      toast.success(`Added ${formatCurrency(amount)} to your goal!`);
      trackContribution(); // Track for achievements

      // Check if goal was just completed
      if (wasIncomplete && willBeComplete) {
        trackGoalCompleted();
        toast.success('Congratulations! You completed a savings goal! 🎉');
      }
    } else {
      toast.error(result.error || 'Failed to add contribution');
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-slate-800/50 rounded-xl border border-slate-700 animate-pulse"
              />
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Savings Goals
          </h1>
          <p className="text-slate-400 text-lg">
            Track your progress and achieve your financial dreams
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card variant="gradient" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Saved</p>
                <h3 className="text-3xl font-bold text-green-400">
                  {formatCurrency(totalSaved)}
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
                <p className="text-slate-400 text-sm mb-1">Total Target</p>
                <h3 className="text-3xl font-bold text-blue-400">
                  {formatCurrency(totalTarget)}
                </h3>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Target className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card variant="gradient" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Active Goals</p>
                <h3 className="text-3xl font-bold text-white">
                  {activeGoals.length}
                </h3>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Target className="w-8 h-8 text-orange-400" />
              </div>
            </div>
          </Card>

          <Card variant="gradient" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Completed</p>
                <h3 className="text-3xl font-bold text-yellow-400">
                  {completedGoals.length}
                </h3>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Award className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Overall Progress */}
        {totalTarget > 0 && (
          <Card className="mb-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Overall Progress</h3>
                <span className="text-2xl font-bold text-blue-400">
                  {overallProgress.toFixed(1)}%
                </span>
              </div>
              <div className="relative w-full h-4 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(overallProgress, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>{formatCurrency(totalSaved)} saved</span>
                <span>{formatCurrency(totalTarget - totalSaved)} remaining</span>
              </div>
            </div>
          </Card>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <Button
            variant="primary"
            size="lg"
            icon={Plus}
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto"
          >
            Create New Goal
          </Button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="w-full sm:w-48 md:w-64">
              <Input
                type="text"
                placeholder="Search goals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50"
            >
              <option value="progress">Sort by Progress</option>
              <option value="deadline">Sort by Deadline</option>
              <option value="amount">Sort by Amount</option>
            </select>
          </div>
        </div>

        {/* Goals Grid */}
        {filteredGoals.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-slate-400 text-lg mb-2">
              {searchTerm
                ? 'No goals match your search'
                : 'No savings goals yet'}
            </p>
            <p className="text-slate-500 text-sm mb-6">
              {searchTerm
                ? 'Try a different search term'
                : 'Create your first savings goal to start tracking your financial dreams!'}
            </p>
            {!searchTerm && (
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => setShowCreateModal(true)}
              >
                Create Your First Goal
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleUpdateGoal}
                onDelete={handleDeleteGoal}
                onAddContribution={handleAddContribution}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Goal Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Savings Goal"
        size="lg"
      >
        <GoalForm
          onSubmit={handleCreateGoal}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </PageLayout>
  );
};

export default SavingsGoals;
