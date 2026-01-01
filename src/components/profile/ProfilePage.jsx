/**
 * ProfilePage Component
 * User profile management and account settings
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit2,
  Save,
  X,
  LogOut,
  Target,
  Receipt,
  TrendingUp,
  MessageSquare,
  Bookmark,
  Clock,
  ChevronRight,
  ChevronDown,
  PiggyBank,
  Wallet,
} from 'lucide-react';
import { useAuth } from '@contexts/AuthContext';
import { useBudget } from '@contexts/BudgetContext';
import { useCommunity } from '@contexts/CommunityContext';
import { useToast } from '@contexts/ToastContext';
import PageLayout from '@components/layout/PageLayout';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import Modal from '@components/common/Modal';
import AchievementBadges from './AchievementBadges';
import { formatCurrency, formatDate, formatDistanceToNow } from '@utils/formatters';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const { savingsGoals, expenses, income, currentMonthTransactions } = useBudget();
  const { posts } = useCommunity();
  const toast = useToast();

  // Get bookmarked posts
  const bookmarkedPosts = user?.bookmarkedPosts || [];
  const savedPostsData = useMemo(() => {
    return posts.filter((p) => bookmarkedPosts.includes(p.id)).slice(0, 3);
  }, [posts, bookmarkedPosts]);

  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);
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

  // Build activity timeline
  const activityTimeline = useMemo(() => {
    const activities = [];

    // Add recent expenses
    expenses.slice(-10).forEach((expense) => {
      activities.push({
        id: `expense-${expense.id}`,
        type: 'expense',
        icon: Wallet,
        iconColor: 'text-red-400',
        iconBg: 'bg-red-500/20',
        title: `Spent ${formatCurrency(expense.amount)}`,
        subtitle: expense.category,
        timestamp: expense.createdAt || expense.date,
      });
    });

    // Add recent income
    income.slice(-10).forEach((inc) => {
      activities.push({
        id: `income-${inc.id}`,
        type: 'income',
        icon: TrendingUp,
        iconColor: 'text-green-400',
        iconBg: 'bg-green-500/20',
        title: `Earned ${formatCurrency(inc.amount)}`,
        subtitle: inc.category,
        timestamp: inc.createdAt || inc.date,
      });
    });

    // Add savings goals
    savingsGoals.forEach((goal) => {
      activities.push({
        id: `goal-${goal.id}`,
        type: 'goal',
        icon: Target,
        iconColor: 'text-blue-400',
        iconBg: 'bg-blue-500/20',
        title: `Created goal: ${goal.name}`,
        subtitle: `Target: ${formatCurrency(goal.targetAmount)}`,
        timestamp: goal.createdAt,
      });

      // Add contributions
      (goal.contributions || []).forEach((contrib, idx) => {
        activities.push({
          id: `contrib-${goal.id}-${idx}`,
          type: 'contribution',
          icon: PiggyBank,
          iconColor: 'text-emerald-400',
          iconBg: 'bg-emerald-500/20',
          title: `Saved ${formatCurrency(contrib.amount)}`,
          subtitle: `to ${goal.name}`,
          timestamp: contrib.date,
        });
      });
    });

    // Add user posts
    posts.filter((p) => p.userId === user?.id).forEach((post) => {
      activities.push({
        id: `post-${post.id}`,
        type: 'post',
        icon: MessageSquare,
        iconColor: 'text-purple-400',
        iconBg: 'bg-purple-500/20',
        title: post.title,
        subtitle: `${post.upvotes} likes • ${post.comments.length} comments`,
        timestamp: post.createdAt,
      });
    });

    // Sort by timestamp (newest first) and take top 8
    return activities
      .filter((a) => a.timestamp)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 8);
  }, [expenses, income, savingsGoals, posts, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    if (updateProfile) {
      updateProfile(formData);
      toast.success('Profile updated successfully!');
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

          {/* Saved Posts Quick Access */}
          <Card className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Bookmark className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Saved Posts</h3>
                  <p className="text-sm text-slate-400">{bookmarkedPosts.length} posts saved</p>
                </div>
              </div>
              {bookmarkedPosts.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/community')}
                  className="text-blue-400 hover:text-blue-300"
                >
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>

            {savedPostsData.length === 0 ? (
              <div className="text-center py-8 bg-slate-800/30 rounded-lg">
                <Bookmark className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <p className="text-slate-400 text-sm">No saved posts yet</p>
                <p className="text-slate-500 text-xs mt-1">
                  Save posts from the community to access them quickly here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedPostsData.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    onClick={() => navigate('/community')}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={post.avatar}
                        alt={post.username}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {post.title}
                        </p>
                        <p className="text-xs text-slate-400">
                          by {post.username} • {formatDistanceToNow(post.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{post.upvotes} likes</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Activity Timeline */}
          <Card className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                  <p className="text-sm text-slate-400">Your latest actions</p>
                </div>
              </div>
            </div>

            {activityTimeline.length === 0 ? (
              <div className="text-center py-8 bg-slate-800/30 rounded-lg">
                <Clock className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <p className="text-slate-400 text-sm">No activity yet</p>
                <p className="text-slate-500 text-xs mt-1">
                  Start tracking expenses, creating goals, or posting to see your activity here
                </p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-700" />

                <div className="space-y-4">
                  {(showAllActivity ? activityTimeline : activityTimeline.slice(0, 3)).map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={activity.id} className="relative flex items-start gap-4 pl-2">
                        {/* Icon */}
                        <div className={`relative z-10 p-2 rounded-lg ${activity.iconBg}`}>
                          <IconComponent className={`w-4 h-4 ${activity.iconColor}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pb-4">
                          <p className="text-sm font-medium text-white truncate">
                            {activity.title}
                          </p>
                          <p className="text-xs text-slate-400 capitalize">
                            {activity.subtitle}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {formatDistanceToNow(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* See more / See less button */}
                {activityTimeline.length > 3 && (
                  <button
                    onClick={() => setShowAllActivity(!showAllActivity)}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {showAllActivity ? (
                      <>
                        Show Less
                        <ChevronDown className="w-4 h-4 rotate-180" />
                      </>
                    ) : (
                      <>
                        See More ({activityTimeline.length - 3} more)
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
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

        {/* Achievement Badges Section */}
        <div className="mt-8">
          <AchievementBadges />
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
