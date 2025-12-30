/**
 * GoalCard Component
 * Individual savings goal display with progress and actions
 */

import { useState } from 'react';
import { Calendar, Target, Edit, Trash2, Plus, TrendingUp } from 'lucide-react';
import { formatCurrency, formatDate } from '@utils/formatters';
import { GOAL_CATEGORIES } from '@utils/constants';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Modal from '@components/common/Modal';
import GoalProgress from './GoalProgress';
import GoalForm from './GoalForm';
import ContributionModal from './ContributionModal';

const GoalCard = ({ goal, onEdit, onDelete, onAddContribution }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showContributionModal, setShowContributionModal] = useState(false);

  const category = GOAL_CATEGORIES.find((c) => c.id === goal.category) || GOAL_CATEGORIES[GOAL_CATEGORIES.length - 1];

  // Computed values
  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
  const isCompleted = goal.currentAmount >= goal.targetAmount;

  // Calculate days left and overdue status
  const now = Date.now();
  const daysLeft = goal.deadline ? Math.ceil((goal.deadline - now) / (1000 * 60 * 60 * 24)) : null;
  const isOverdue = daysLeft !== null && daysLeft < 0 && !isCompleted;
  const monthsLeft = daysLeft ? Math.max(Math.ceil(daysLeft / 30), 1) : null;
  const monthlyTarget = monthsLeft && remaining > 0 ? remaining / monthsLeft : 0;

  // Border color based on status
  const getBorderColor = () => {
    if (isCompleted) return 'border-green-500';
    if (isOverdue) return 'border-red-500';
    if (progress >= 75) return 'border-blue-500';
    if (progress >= 50) return 'border-yellow-500';
    return 'border-slate-700';
  };

  const handleEdit = (updatedData) => {
    onEdit(goal.id, updatedData);
    setShowEditModal(false);
  };

  const handleDelete = () => {
    onDelete(goal.id);
    setShowDeleteConfirm(false);
  };

  const handleContribution = (amount) => {
    onAddContribution(goal.id, amount);
    setShowContributionModal(false);
  };

  return (
    <>
      <div
        className={`bg-slate-800/50 backdrop-blur-sm rounded-xl border-2 ${getBorderColor()} hover:border-blue-500/70 transition-all duration-300 p-5`}
      >
        {/* Header with category icon and name */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 ${category.color} bg-opacity-20 rounded-lg`}>
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{goal.name}</h3>
              <span className="text-sm text-slate-400">{category.name}</span>
            </div>
          </div>

          {/* Status badges */}
          <div className="flex flex-col items-end gap-1">
            {isCompleted && (
              <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full font-semibold">
                ✓ Achieved
              </span>
            )}
            {isOverdue && (
              <span className="text-xs text-red-400 bg-red-500/20 px-2 py-1 rounded-full font-semibold">
                Overdue
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <GoalProgress
            currentAmount={goal.currentAmount}
            targetAmount={goal.targetAmount}
            size="lg"
            showLabels={false}
            animated={true}
          />
        </div>

        {/* Amounts */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-slate-400 mb-1">Current</p>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(goal.currentAmount)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 mb-1">Target</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(goal.targetAmount)}
            </p>
          </div>
        </div>

        {/* Remaining amount */}
        {!isCompleted && (
          <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Remaining</span>
              <span className="text-lg font-bold text-orange-400">
                {formatCurrency(remaining)}
              </span>
            </div>
            {monthlyTarget > 0 && (
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-slate-500">Monthly target</span>
                <span className="text-sm text-slate-300 flex items-center gap-1">
                  <TrendingUp size={12} />
                  {formatCurrency(monthlyTarget)}/month
                </span>
              </div>
            )}
          </div>
        )}

        {/* Deadline */}
        {goal.deadline && (
          <div className="flex items-center gap-2 text-sm mb-4">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400">
              {daysLeft !== null && daysLeft >= 0
                ? `${daysLeft} days left`
                : daysLeft !== null && daysLeft < 0
                ? `${Math.abs(daysLeft)} days overdue`
                : 'No deadline'}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{formatDate(goal.deadline)}</span>
          </div>
        )}

        {/* Description */}
        {goal.description && (
          <p className="text-sm text-slate-400 mb-4 line-clamp-2">{goal.description}</p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-700">
          {!isCompleted && (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setShowContributionModal(true)}
              className="flex-1"
            >
              Add Money
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            icon={Edit}
            onClick={() => setShowEditModal(true)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Goal"
        size="lg"
      >
        <GoalForm
          onSubmit={handleEdit}
          onCancel={() => setShowEditModal(false)}
          initialData={goal}
        />
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Goal"
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            Are you sure you want to delete this savings goal?
          </p>
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="font-bold text-white text-lg mb-1">{goal.name}</p>
            <p className="text-slate-400">
              Current: {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
            </p>
            {goal.contributions && goal.contributions.length > 0 && (
              <p className="text-sm text-yellow-400 mt-2">
                ⚠ This will delete {goal.contributions.length} contribution
                {goal.contributions.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="danger" onClick={handleDelete} fullWidth>
              Delete Goal
            </Button>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} fullWidth>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Contribution Modal */}
      <Modal
        isOpen={showContributionModal}
        onClose={() => setShowContributionModal(false)}
        title="Add Money to Goal"
      >
        <ContributionModal
          goal={goal}
          onSubmit={handleContribution}
          onClose={() => setShowContributionModal(false)}
        />
      </Modal>
    </>
  );
};

export default GoalCard;
