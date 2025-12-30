/**
 * PostCard Component
 * Individual post card with voting and comments
 */

import { useState } from 'react';
import { ArrowUp, ArrowDown, MessageSquare, Trash2, Clock } from 'lucide-react';
import { useCommunity } from '@contexts/CommunityContext';
import { useAuth } from '@contexts/AuthContext';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Modal from '@components/common/Modal';
import CommentSection from './CommentSection';
import { formatDistanceToNow } from '@utils/formatters';

const PostCard = ({ post }) => {
  const { voteOnPost, deletePost, getUserVote } = useCommunity();
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const userVote = getUserVote(post.id);
  const score = post.upvotes - post.downvotes;
  const isAuthor = user && user.id === post.userId;

  const handleVote = (voteType) => {
    if (!user) {
      alert('Please login to vote');
      return;
    }
    voteOnPost(post.id, voteType);
  };

  const handleDelete = () => {
    const result = deletePost(post.id);
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
              disabled={!user}
              className={`p-1.5 rounded-lg transition-all ${
                userVote === 'upvote'
                  ? 'bg-orange-500/20 text-orange-400'
                  : 'text-slate-400 hover:bg-slate-700 hover:text-orange-400'
              } ${!user && 'opacity-50 cursor-not-allowed'}`}
              title={!user ? 'Login to vote' : 'Upvote'}
            >
              <ArrowUp className="w-6 h-6" />
            </button>

            <span
              className={`text-sm font-bold ${
                score > 0
                  ? 'text-orange-400'
                  : score < 0
                  ? 'text-blue-400'
                  : 'text-slate-400'
              }`}
            >
              {score > 0 ? '+' : ''}{score}
            </span>

            <button
              onClick={() => handleVote('downvote')}
              disabled={!user}
              className={`p-1.5 rounded-lg transition-all ${
                userVote === 'downvote'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-slate-400 hover:bg-slate-700 hover:text-blue-400'
              } ${!user && 'opacity-50 cursor-not-allowed'}`}
              title={!user ? 'Login to vote' : 'Downvote'}
            >
              <ArrowDown className="w-6 h-6" />
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
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </Button>
              )}
            </div>

            {/* Post Title */}
            <h3 className="text-xl font-bold text-white mb-2 break-words">
              {post.title}
            </h3>

            {/* Post Content */}
            <p className="text-slate-300 mb-4 whitespace-pre-wrap break-words">
              {post.content}
            </p>

            {/* Post Footer */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{totalComments} {totalComments === 1 ? 'comment' : 'comments'}</span>
              </button>

              <span className="text-xs text-slate-500">
                {post.upvotes} upvote{post.upvotes !== 1 && 's'}
              </span>
              <span className="text-xs text-slate-500">
                {post.downvotes} downvote{post.downvotes !== 1 && 's'}
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
    </>
  );
};

export default PostCard;
