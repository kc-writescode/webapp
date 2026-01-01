/**
 * ProfilePage Component
 * User profile management and account settings
 */

import { useState, useMemo } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit2,
  Save,
  X,
  LogOut,
  Trash2,
  Download,
  Upload,
  Target,
  Receipt,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '@contexts/AuthContext';
import { useBudget } from '@contexts/BudgetContext';
import { useCommunity } from '@contexts/CommunityContext';
import PageLayout from '@components/layout/PageLayout';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import Modal from '@components/common/Modal';
import { formatCurrency, formatDate } from '@utils/formatters';
import { exportData, importData } from '@utils/localStorage';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const { savingsGoals, expenses, income, currentMonthTransactions } = useBudget();
  const { posts } = useCommunity();

  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  });

  // Calculate user stats
  const stats = useMemo(() => {
    const totalTransactions = expenses.length + income.length;
    const totalGoals = savingsGoals.length;
    const completedGoals = savingsGoals.filter(
      (g) => g.currentAmount >= g.targetAmount
    ).length;
    const totalSavings = savingsGoals.reduce(
      (sum, g) => sum + (g.currentAmount || 0),
      0
    );
    const userPosts = posts.filter((p) => p.userId === user?.id).length;

    return {
      totalTransactions,
      totalGoals,
      completedGoals,
      totalSavings,
      userPosts,
    };
  }, [expenses, income, savingsGoals, posts, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    if (updateProfile) {
      updateProfile(formData);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    });
    setIsEditing(false);
  };

  const handleExportData = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finlit_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (importData(data)) {
          alert('Data imported successfully! Please refresh the page.');
          window.location.reload();
        } else {
          alert('Failed to import data');
        }
      } catch {
        alert('Invalid backup file');
      }
    };
    reader.readAsText(file);
  };

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  if (!user) {
    return null;
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-slate-400 text-lg">
            Manage your account and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-2">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-20 h-20 rounded-full border-4 border-blue-500/50"
                />
                <div>
                  <h2 className="text-2xl font-bold text-white">{user.username}</h2>
                  <p className="text-slate-400 text-sm">
                    Member since {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  icon={Edit2}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <Input
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  icon={User}
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  icon={Mail}
                />
                <Input
                  label="Phone Number"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  icon={Phone}
                  placeholder="+91 XXXXX XXXXX"
                />
                <div className="flex items-center gap-3 pt-4">
                  <Button variant="primary" icon={Save} onClick={handleSaveProfile}>
                    Save Changes
                  </Button>
                  <Button variant="ghost" icon={X} onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-slate-200">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="text-slate-200">
                      {user.phoneNumber || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Account Created</p>
                    <p className="text-slate-200">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Stats Card */}
          <Card title="Activity Stats" icon={TrendingUp}>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-slate-300">Transactions</span>
                </div>
                <span className="text-lg font-bold text-white">
                  {stats.totalTransactions}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-slate-300">Goals</span>
                </div>
                <span className="text-lg font-bold text-white">
                  {stats.completedGoals}/{stats.totalGoals}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-slate-300">Total Savings</span>
                </div>
                <span className="text-lg font-bold text-emerald-400">
                  {formatCurrency(stats.totalSavings)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-slate-300">Posts</span>
                </div>
                <span className="text-lg font-bold text-white">
                  {stats.userPosts}
                </span>
              </div>
            </div>
          </Card>

          {/* Data Management */}
          <Card title="Data Management" icon={Shield} className="lg:col-span-2">
            <div className="space-y-4">
              <p className="text-sm text-slate-400">
                Export your data for backup or import from a previous backup file.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button variant="outline" icon={Download} onClick={handleExportData}>
                  Export Backup
                </Button>
                <label>
                  <Button variant="outline" icon={Upload} as="span">
                    Import Backup
                  </Button>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportData}
                  />
                </label>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <p className="text-sm text-slate-500 mb-3">
                  Your data is stored locally on this device. Exporting a backup
                  ensures you don't lose your financial history.
                </p>
              </div>
            </div>
          </Card>

          {/* Account Actions */}
          <Card title="Account" icon={User}>
            <div className="space-y-3">
              <Button
                variant="outline"
                icon={LogOut}
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full justify-start"
              >
                Log Out
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Logout Confirmation */}
      <Modal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title="Log Out"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            Are you sure you want to log out? Your data will remain saved locally.
          </p>
          <div className="flex items-center gap-3">
            <Button variant="primary" icon={LogOut} onClick={handleLogout}>
              Log Out
            </Button>
            <Button variant="outline" onClick={() => setShowLogoutConfirm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
};

export default ProfilePage;
