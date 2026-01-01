/**
 * CommentItem Component
 * Individual comment with voting and nested replies
 */

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { useCommunity } from '@contexts/CommunityContext';
import { useAuth } from '@contexts/AuthContext';
import Button from '@components/common/Button';
import { formatDistanceToNow } from '@utils/formatters';

const CommentItem = ({ comment, postId, level = 0 }) => {
  const { voteOnComment, addComment, getUserCommentVote } = useCommunity();
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userVote = getUserCommentVote(postId, comment.id);
  const score = comment.upvotes - comment.downvotes;
  const maxNestingLevel = 5; // Maximum depth for nested comments

  const handleVote = (voteType) => {
    if (!user) {
      alert('Please login to vote');
      return;
    }
    voteOnComment(postId, comment.id, voteType);
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please login to reply');
      return;
    }

    if (!replyText.trim()) {
      return;
    }

    setIsSubmitting(true);

    const result = addComment(postId, {
      content: replyText.trim(),
      parentId: comment.id,
    });

    if (result.success) {
      setReplyText('');
      setShowReplyForm(false);
    }

    setIsSubmitting(false);
  };

  return (
    <div className={`${level > 0 ? 'ml-8 border-l-2 border-slate-700 pl-4' : ''}`}>
      <div className="flex gap-3">
        {/* Vote Section */}
        <div className="flex flex-col items-center gap-1 pt-1">
          <button
            onClick={() => handleVote('upvote')}
            disabled={!user}
            className={`p-1 rounded transition-all ${
              userVote === 'upvote'
                ? 'bg-green-500/20 text-green-400'
                : 'text-slate-400 hover:bg-slate-700 hover:text-green-400'
            } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={!user ? 'Login to like' : 'Like'}
          >
            <ThumbsUp className="w-4 h-4" />
          </button>

          <span
            className={`text-xs font-bold ${
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
            disabled={!user}
            className={`p-1 rounded transition-all ${
              userVote === 'downvote'
                ? 'bg-red-500/20 text-red-400'
                : 'text-slate-400 hover:bg-slate-700 hover:text-red-400'
            } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={!user ? 'Login to dislike' : 'Dislike'}
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={comment.avatar}
              alt={comment.username}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm font-semibold text-white">
              {comment.username}
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(comment.createdAt)}
            </span>
          </div>

          <p className="text-sm text-slate-300 mb-2 whitespace-pre-wrap break-words">
            {comment.content}
          </p>

          <div className="flex items-center gap-3">
            {level < maxNestingLevel && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                disabled={!user}
                className="text-xs text-slate-400 hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reply
              </button>
            )}
            {comment.replies && comment.replies.length > 0 && (
              <span className="text-xs text-slate-500">
                {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </span>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && user && (
            <form onSubmit={handleSubmitReply} className="mt-3 space-y-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${comment.username}...`}
                rows={2}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition-all duration-200 resize-none"
                disabled={isSubmitting}
              />
              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!replyText.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Posting...' : 'Reply'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyText('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
