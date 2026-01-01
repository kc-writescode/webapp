/**
 * CommentSection Component
 * Displays and manages comments with nested replies
 */

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useCommunity } from '@contexts/CommunityContext';
import { useAuth } from '@contexts/AuthContext';
import Button from '@components/common/Button';
import AuthModal from '@components/auth/AuthModal';
import CommentItem from './CommentItem';

const CommentSection = ({ postId, comments }) => {
  const { addComment } = useCommunity();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please login to comment');
      return;
    }

    if (!commentText.trim()) {
      return;
    }

    setIsSubmitting(true);

    const result = addComment(postId, {
      content: commentText.trim(),
    });

    if (result.success) {
      setCommentText('');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4">
      {/* Comment Form */}
      {user && (
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <div className="flex gap-3">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-8 h-8 rounded-full flex-shrink-0 mt-1"
            />
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition-all duration-200 resize-none"
                disabled={isSubmitting}
              />
              <div className="flex items-center gap-2 mt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  icon={MessageSquare}
                  disabled={!commentText.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Posting...' : 'Comment'}
                </Button>
                {commentText && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setCommentText('')}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      )}

      {!user && (
        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg text-center">
          <p className="text-slate-400 text-sm mb-3">
            Please login to add comments
          </p>
          <Button variant="primary" size="sm" onClick={() => setShowAuthModal(true)}>
            Login / Sign Up
          </Button>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              level={0}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 mx-auto text-slate-600 mb-2" />
          <p className="text-slate-400 text-sm">
            No comments yet. Be the first to comment!
          </p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
