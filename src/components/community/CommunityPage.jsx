/**
 * CommunityPage Component
 * Reddit-like community forum for discussions
 */

import { useState } from 'react';
import { MessageSquare, Plus, TrendingUp, Clock, Award, Bookmark } from 'lucide-react';
import { useCommunity } from '@contexts/CommunityContext';
import { useAuth } from '@contexts/AuthContext';
import PageLayout from '@components/layout/PageLayout';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Modal from '@components/common/Modal';
import AuthModal from '@components/auth/AuthModal';
import PostCard from './PostCard';
import CreatePostForm from './CreatePostForm';
import Leaderboard from './Leaderboard';

const CommunityPage = () => {
  const { posts, loading } = useCommunity();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sortBy, setSortBy] = useState('new'); // 'new', 'hot', 'top'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Capture current time for sorting calculations - use lazy state init
  const [currentTime] = useState(() => Date.now());

  // Get user's bookmarked posts
  const bookmarkedPosts = user?.bookmarkedPosts || [];

  const categories = [
    { id: 'all', name: 'All Topics', icon: MessageSquare },
    { id: 'general', name: 'General Discussion', icon: MessageSquare },
    { id: 'investing', name: 'Investing', icon: TrendingUp },
    { id: 'budgeting', name: 'Budgeting Tips', icon: Award },
    { id: 'questions', name: 'Questions', icon: MessageSquare },
  ];

  // Filter posts by category and saved status
  let filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter((post) => post.category === selectedCategory);

  // Apply saved filter if active
  if (showSavedOnly && user) {
    filteredPosts = filteredPosts.filter((post) => bookmarkedPosts.includes(post.id));
  }

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'new') {
      return b.createdAt - a.createdAt;
    } else if (sortBy === 'hot') {
      // Hot = recent posts with high engagement
      const aScore = (a.upvotes - a.downvotes) + a.comments.length * 2;
      const bScore = (b.upvotes - b.downvotes) + b.comments.length * 2;
      const aAge = currentTime - a.createdAt;
      const bAge = currentTime - b.createdAt;
      const aHotScore = aScore / (aAge / 3600000 + 2); // Age in hours
      const bHotScore = bScore / (bAge / 3600000 + 2);
      return bHotScore - aHotScore;
    } else if (sortBy === 'top') {
      const aScore = a.upvotes - a.downvotes;
      const bScore = b.upvotes - b.downvotes;
      return bScore - aScore;
    }
    return 0;
  });

  const handleCreatePost = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowCreateModal(true);
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Community Forum
          </h1>
          <p className="text-slate-400 text-lg">
            Share insights, ask questions, and connect with fellow finance enthusiasts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Controls */}
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={sortBy === 'hot' && !showSavedOnly ? 'primary' : 'outline'}
                    size="sm"
                    icon={TrendingUp}
                    onClick={() => { setSortBy('hot'); setShowSavedOnly(false); }}
                  >
                    Hot
                  </Button>
                  <Button
                    variant={sortBy === 'new' && !showSavedOnly ? 'primary' : 'outline'}
                    size="sm"
                    icon={Clock}
                    onClick={() => { setSortBy('new'); setShowSavedOnly(false); }}
                  >
                    New
                  </Button>
                  <Button
                    variant={sortBy === 'top' && !showSavedOnly ? 'primary' : 'outline'}
                    size="sm"
                    icon={Award}
                    onClick={() => { setSortBy('top'); setShowSavedOnly(false); }}
                  >
                    Top
                  </Button>
                  {user && (
                    <Button
                      variant={showSavedOnly ? 'primary' : 'outline'}
                      size="sm"
                      icon={Bookmark}
                      onClick={() => setShowSavedOnly(!showSavedOnly)}
                      className={showSavedOnly ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30' : ''}
                    >
                      Saved ({bookmarkedPosts.length})
                    </Button>
                  )}
                </div>

                <Button
                  variant="primary"
                  icon={Plus}
                  onClick={handleCreatePost}
                  disabled={!user}
                >
                  Create Post
                </Button>
              </div>
            </Card>

            {/* Posts List */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-48 bg-slate-800/50 rounded-xl border border-slate-700 animate-pulse"
                  />
                ))}
              </div>
            ) : sortedPosts.length === 0 ? (
              <Card>
                <div className="text-center py-16">
                  {showSavedOnly ? (
                    <>
                      <Bookmark className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                      <h3 className="text-xl font-semibold text-slate-300 mb-2">
                        No saved posts
                      </h3>
                      <p className="text-slate-400 mb-4">
                        Posts you save will appear here for easy access
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setShowSavedOnly(false)}
                      >
                        Browse All Posts
                      </Button>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                      <h3 className="text-xl font-semibold text-slate-300 mb-2">
                        No posts yet
                      </h3>
                      <p className="text-slate-400 mb-4">
                        Be the first to start a discussion!
                      </p>
                      <Button
                        variant="primary"
                        icon={Plus}
                        onClick={handleCreatePost}
                        disabled={!user}
                      >
                        Create First Post
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {sortedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <Card title="Categories" icon={MessageSquare}>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const count = category.id === 'all'
                    ? posts.length
                    : posts.filter((p) => p.category === category.id).length;

                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        selectedCategory === category.id
                          ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400'
                          : 'bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <span className="text-xs bg-slate-700 px-2 py-1 rounded-full">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Leaderboard */}
            <Leaderboard />

            {/* Community Stats */}
            <Card title="Community Stats">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Total Posts</span>
                  <span className="text-lg font-bold text-white">{posts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Total Comments</span>
                  <span className="text-lg font-bold text-white">
                    {posts.reduce((sum, post) => sum + post.comments.length, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Active Today</span>
                  <span className="text-lg font-bold text-green-400">
                    {posts.filter((p) => currentTime - p.createdAt < 86400000).length}
                  </span>
                </div>
              </div>
            </Card>

            {/* Community Rules */}
            <Card title="Community Rules">
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex gap-2">
                  <span className="text-blue-400 font-bold">1.</span>
                  <p>Be respectful and civil</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue-400 font-bold">2.</span>
                  <p>No spam or self-promotion</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue-400 font-bold">3.</span>
                  <p>Stay on topic</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue-400 font-bold">4.</span>
                  <p>No financial advice</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Post"
        size="lg"
      >
        <CreatePostForm onClose={() => setShowCreateModal(false)} />
      </Modal>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </PageLayout>
  );
};

export default CommunityPage;
