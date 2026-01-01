/**
 * Export Data Utilities
 * Functions for exporting transaction data to CSV format
 */

import { getCategoryById } from '@data/categories';

/**
 * Format a timestamp to a readable date string
 */
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * Format amount to Indian currency format (without symbol for CSV)
 */
const formatAmount = (amount) => {
  return amount.toFixed(2);
};

/**
 * Escape CSV field values (handle commas, quotes, newlines)
 */
const escapeCSVField = (field) => {
  if (field === null || field === undefined) return '';
  const stringField = String(field);
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  return stringField;
};

/**
 * Convert transactions array to CSV string
 */
export const transactionsToCSV = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return null;
  }

  // CSV Headers
  const headers = ['Date', 'Type', 'Category', 'Description', 'Amount (₹)'];

  // CSV Rows
  const rows = transactions.map((t) => {
    const categoryInfo = getCategoryById(t.category, t.type);
    return [
      formatDate(t.date),
      t.type === 'income' ? 'Income' : 'Expense',
      categoryInfo?.name || t.category,
      t.description || '-',
      t.type === 'income' ? formatAmount(t.amount) : `-${formatAmount(t.amount)}`,
    ].map(escapeCSVField).join(',');
  });

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  // Add summary rows
  rows.push(''); // Empty row
  rows.push(['Summary', '', '', '', ''].join(','));
  rows.push(['Total Income', '', '', '', formatAmount(totalIncome)].join(','));
  rows.push(['Total Expenses', '', '', '', `-${formatAmount(totalExpenses)}`].join(','));
  rows.push(['Net Balance', '', '', '', formatAmount(netBalance)].join(','));

  return [headers.join(','), ...rows].join('\n');
};

/**
 * Download CSV file
 */
export const downloadCSV = (csvContent, filename) => {
  if (!csvContent) return false;

  const BOM = '\uFEFF'; // Add BOM for Excel compatibility with special characters
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
  return true;
};

/**
 * Export transactions to CSV and trigger download
 */
export const exportTransactionsToCSV = (transactions, monthLabel = 'transactions') => {
  const csvContent = transactionsToCSV(transactions);
  if (!csvContent) {
    return { success: false, error: 'No transactions to export' };
  }

  const filename = `finlit_${monthLabel.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`;
  const downloaded = downloadCSV(csvContent, filename);

  return downloaded
    ? { success: true, filename }
    : { success: false, error: 'Failed to download file' };
};

export default {
  transactionsToCSV,
  downloadCSV,
  exportTransactionsToCSV,
};
