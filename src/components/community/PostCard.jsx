/**
 * PostCard Component
 * Individual post card with voting and comments
 */

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Trash2, Clock, Pencil, X, Save, Bookmark } from 'lucide-react';
import { useCommunity } from '@contexts/CommunityContext';
import { useAuth } from '@contexts/AuthContext';
import { useAchievements } from '@contexts/AchievementContext';
import { useToast } from '@contexts/ToastContext';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Modal from '@components/common/Modal';
import AuthModal from '@components/auth/AuthModal';
import CommentSection from './CommentSection';
import { formatDistanceToNow } from '@utils/formatters';

const PostCard = ({ post }) => {
  const { voteOnPost, deletePost, updatePost, getUserVote } = useCommunity();
  const { user, toggleBookmark, isPostBookmarked } = useAuth();
  const { trackUpvoteReceived } = useAchievements();
  const toast = useToast();
  const isBookmarked = isPostBookmarked(post.id);
  const [showComments, setShowComments] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);

  // Capture mount time for edit check - use lazy state init to avoid calling Date.now on every render
  const [mountTime] = useState(() => Date.now());

  const userVote = getUserVote(post.id);
  const score = post.upvotes - post.downvotes;
  const isAuthor = user && user.id === post.userId;

  // Check if post is editable (within 24 hours)
  const hoursSinceCreation = (mountTime - post.createdAt) / (1000 * 60 * 60);
  const canEdit = isAuthor && hoursSinceCreation <= 24;

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error('Title and content are required');
      return;
    }

    const result = await updatePost(post.id, {
      title: editTitle.trim(),
      content: editContent.trim(),
    });

    if (result.success) {
      toast.success('Post updated successfully!');
      setIsEditing(false);
    } else {
      toast.error(result.error || 'Failed to update post');
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setIsEditing(false);
  };

  const handleVote = async (voteType) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    const result = await voteOnPost(post.id, voteType);
    // Track upvote received for post author (if upvoting someone else's post)
    if (result?.success && voteType === 'upvote' && !isAuthor) {
      trackUpvoteReceived();
    }
  };

  const handleShowComments = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowComments(!showComments);
  };

  const handleBookmark = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    const result = toggleBookmark(post.id);
    if (result.success) {
      toast.success(result.isBookmarked ? 'Post saved!' : 'Post unsaved');
    }
  };

  const handleDelete = async () => {
    const result = await deletePost(post.id);
    if (result.success) {
      setShowDeleteConfirm(false);
    }
  };

  // Count total comments including replies
  const countComments = (comments) => {
    return comments.reduce((count, comment) => {
      return count + 1 + (comment.replies ? countComments(comment.replies) : 0);
    }, 0);
  };

  const totalComments = countComments(post.comments);

  return (
    <>
      <Card hover className="transition-all duration-200">
        <div className="flex gap-4">
          {/* Vote Section */}
          <div className="flex flex-col items-center gap-1 pt-1">
            <button
              onClick={() => handleVote('upvote')}
              className={`p-1.5 rounded-lg transition-all ${
                userVote === 'upvote'
                  ? 'bg-green-500/20 text-green-400'
                  : 'text-slate-400 hover:bg-slate-700 hover:text-green-400'
              }`}
              title={!user ? 'Login to like' : 'Like'}
            >
              <ThumbsUp className="w-5 h-5" />
            </button>

            <span
              className={`text-sm font-bold ${
                score > 0
                  ? 'text-green-400'
                  : score < 0
                  ? 'text-red-400'
                  : 'text-slate-400'
              }`}
            >
              {score > 0 ? '+' : ''}{score}
            </span>

            <button
              onClick={() => handleVote('downvote')}
              className={`p-1.5 rounded-lg transition-all ${
                userVote === 'downvote'
                  ? 'bg-red-500/20 text-red-400'
                  : 'text-slate-400 hover:bg-slate-700 hover:text-red-400'
              }`}
              title={!user ? 'Login to dislike' : 'Dislike'}
            >
              <ThumbsDown className="w-5 h-5" />
            </button>
          </div>

          {/* Post Content */}
          <div className="flex-1 min-w-0">
            {/* Post Header */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={post.avatar}
                  alt={post.username}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white">
                      {post.username}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(post.createdAt)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 capitalize">
                    {post.category}
                  </span>
                </div>
              </div>

              {isAuthor && (
                <div className="flex items-center gap-2">
                  {canEdit && !isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Pencil}
                      onClick={() => setIsEditing(true)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>

            {/* Post Title */}
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-xl font-bold text-white mb-2 bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Post title"
              />
            ) : (
              <h3 className="text-xl font-bold text-white mb-2 break-words">
                {post.title}
                {post.isEdited && (
                  <span className="text-xs font-normal text-slate-500 ml-2">(edited)</span>
                )}
              </h3>
            )}

            {/* Post Content */}
            {isEditing ? (
              <div className="mb-4">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={4}
                  className="w-full text-slate-300 bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Post content"
                />
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Save}
                    onClick={handleSaveEdit}
                  >
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={X}
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-slate-300 mb-4 whitespace-pre-wrap break-words">
                {post.content}
              </p>
            )}

            {/* Post Footer */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleShowComments}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{totalComments} {totalComments === 1 ? 'comment' : 'comments'}</span>
              </button>

              <button
                onClick={handleBookmark}
                className={`flex items-center gap-1.5 text-sm transition-colors ${
                  isBookmarked
                    ? 'text-yellow-400'
                    : 'text-slate-400 hover:text-yellow-400'
                }`}
                title={isBookmarked ? 'Remove from saved' : 'Save post'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                <span>{isBookmarked ? 'Saved' : 'Save'}</span>
              </button>

              <span className="text-xs text-slate-500">
                {post.upvotes} like{post.upvotes !== 1 && 's'}
              </span>
              <span className="text-xs text-slate-500">
                {post.downvotes} dislike{post.downvotes !== 1 && 's'}
              </span>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="mt-6 pt-6 border-t border-slate-700">
                <CommentSection postId={post.id} comments={post.comments} />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Post"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="danger"
              icon={Trash2}
              onClick={handleDelete}
            >
              Delete Post
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default PostCard;
