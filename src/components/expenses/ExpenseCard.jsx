/**
 * ExpenseCard Component
 * Individual expense item display with edit/delete actions
 */

import { useState } from 'react';
import { Trash2, Edit, Calendar, CreditCard } from 'lucide-react';
import { formatCurrency, formatDate } from '@utils/formatters';
import { getCategoryById } from '@data/categories';
import Button from '@components/common/Button';
import Modal from '@components/common/Modal';
import ExpenseForm from './ExpenseForm';

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isIncome = expense.type === 'income';
  const category = getCategoryById(expense.category, 'expense');
  const paymentMethod = getCategoryById(expense.paymentMethod, 'payment');

  const handleEdit = (updatedData) => {
    onEdit(expense.id, updatedData);
    setShowEditModal(false);
  };

  const handleDelete = () => {
    onDelete(expense.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all duration-300 p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left Section - Category Icon & Details */}
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 ${category?.color || 'bg-slate-500'} bg-opacity-20 rounded-lg`}>
              <div className="w-6 h-6 flex items-center justify-center text-lg">
                {category?.name?.charAt(0) || '💰'}
              </div>
            </div>

            <div className="flex-1">
              <h4 className="font-semibold text-white text-lg mb-1">
                {expense.description}
              </h4>

              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(expense.date)}
                </span>
                <span>•</span>
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                  {category?.name || expense.category}
                </span>
                {paymentMethod && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <CreditCard size={14} />
                      {paymentMethod.name}
                    </span>
                  </>
                )}
              </div>

              {expense.tags && expense.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {expense.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Amount & Actions */}
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <p className={`text-xl font-bold ${isIncome ? 'text-green-400' : 'text-red-400'}`}>
                {isIncome ? '+' : '-'}{formatCurrency(expense.amount)}
              </p>
              {isIncome && (
                <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                  Income
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowEditModal(true)}
                className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                title={`Edit ${isIncome ? 'income' : 'expense'}`}
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title={`Delete ${isIncome ? 'income' : 'expense'}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit ${isIncome ? 'Income' : 'Expense'}`}
        size="lg"
      >
        <ExpenseForm
          initialData={expense}
          onSubmit={handleEdit}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title={`Delete ${isIncome ? 'Income' : 'Expense'}`}
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            Are you sure you want to delete this {isIncome ? 'income' : 'expense'}?
          </p>
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <p className="text-white font-semibold mb-1">{expense.description}</p>
            <p className={`font-bold ${isIncome ? 'text-green-400' : 'text-red-400'}`}>
              {isIncome ? '+' : '-'}{formatCurrency(expense.amount)}
            </p>
          </div>
          <p className="text-sm text-slate-400">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="danger" onClick={handleDelete} icon={Trash2}>
            Delete
          </Button>
          <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ExpenseCard;
