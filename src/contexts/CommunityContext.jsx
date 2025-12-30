/**
 * Community Context
 * Manages community posts, comments, likes/dislikes
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getItem, setItem, STORAGE_KEYS } from '@utils/localStorage';
import { v4 as uuidv4 } from 'uuid';

const CommunityContext = createContext(null);

export const CommunityProvider = ({ children }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load posts from localStorage
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    try {
      const savedPosts = getItem(STORAGE_KEYS.COMMUNITY_POSTS, []);
      setPosts(savedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // CREATE POST
  const createPost = useCallback((postData) => {
    if (!user) return { success: false, error: 'Must be logged in to post' };

    try {
      const newPost = {
        id: uuidv4(),
        userId: user.id,
        username: user.username,
        avatar: user.avatar,
        title: postData.title,
        content: postData.content,
        category: postData.category || 'general',
        upvotes: 0,
        downvotes: 0,
        votedBy: [], // Array of { userId, type: 'upvote' | 'downvote' }
        comments: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      setItem(STORAGE_KEYS.COMMUNITY_POSTS, updatedPosts);

      return { success: true, post: newPost };
    } catch (error) {
      console.error('Error creating post:', error);
      return { success: false, error: 'Failed to create post' };
    }
  }, [user, posts]);

  // VOTE ON POST
  const voteOnPost = useCallback((postId, voteType) => {
    if (!user) return { success: false, error: 'Must be logged in to vote' };

    try {
      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          const existingVote = post.votedBy.find((v) => v.userId === user.id);
          let newVotedBy = [...post.votedBy];
          let upvotes = post.upvotes;
          let downvotes = post.downvotes;

          if (existingVote) {
            // Remove existing vote
            if (existingVote.type === 'upvote') upvotes--;
            else downvotes--;
            newVotedBy = newVotedBy.filter((v) => v.userId !== user.id);

            // If clicking the same vote type, just remove it
            if (existingVote.type === voteType) {
              return { ...post, upvotes, downvotes, votedBy: newVotedBy, updatedAt: Date.now() };
            }
          }

          // Add new vote
          if (voteType === 'upvote') upvotes++;
          else downvotes++;
          newVotedBy.push({ userId: user.id, type: voteType });

          return { ...post, upvotes, downvotes, votedBy: newVotedBy, updatedAt: Date.now() };
        }
        return post;
      });

      setPosts(updatedPosts);
      setItem(STORAGE_KEYS.COMMUNITY_POSTS, updatedPosts);
      return { success: true };
    } catch (error) {
      console.error('Error voting on post:', error);
      return { success: false, error: 'Failed to vote' };
    }
  }, [user, posts]);

  // ADD COMMENT
  const addComment = useCallback((postId, commentData) => {
    if (!user) return { success: false, error: 'Must be logged in to comment' };

    try {
      const newComment = {
        id: uuidv4(),
        userId: user.id,
        username: user.username,
        avatar: user.avatar,
        content: commentData.content,
        parentId: commentData.parentId || null, // For nested comments
        upvotes: 0,
        downvotes: 0,
        votedBy: [],
        replies: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          let updatedComments = [...post.comments];

          if (commentData.parentId) {
            // Add as reply to existing comment
            updatedComments = addReplyToComment(updatedComments, commentData.parentId, newComment);
          } else {
            // Add as top-level comment
            updatedComments.push(newComment);
          }

          return { ...post, comments: updatedComments, updatedAt: Date.now() };
        }
        return post;
      });

      setPosts(updatedPosts);
      setItem(STORAGE_KEYS.COMMUNITY_POSTS, updatedPosts);

      return { success: true, comment: newComment };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false, error: 'Failed to add comment' };
    }
  }, [user, posts]);

  // Helper function to add reply to nested comment
  const addReplyToComment = (comments, parentId, reply) => {
    return comments.map((comment) => {
      if (comment.id === parentId) {
        return { ...comment, replies: [...comment.replies, reply] };
      }
      if (comment.replies && comment.replies.length > 0) {
        return { ...comment, replies: addReplyToComment(comment.replies, parentId, reply) };
      }
      return comment;
    });
  };

  // VOTE ON COMMENT
  const voteOnComment = useCallback((postId, commentId, voteType) => {
    if (!user) return { success: false, error: 'Must be logged in to vote' };

    try {
      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          const updatedComments = voteOnCommentRecursive(post.comments, commentId, voteType);
          return { ...post, comments: updatedComments, updatedAt: Date.now() };
        }
        return post;
      });

      setPosts(updatedPosts);
      setItem(STORAGE_KEYS.COMMUNITY_POSTS, updatedPosts);
      return { success: true };
    } catch (error) {
      console.error('Error voting on comment:', error);
      return { success: false, error: 'Failed to vote on comment' };
    }
  }, [user, posts]);

  // Helper function to vote on nested comment
  const voteOnCommentRecursive = (comments, commentId, voteType) => {
    return comments.map((comment) => {
      if (comment.id === commentId) {
        const existingVote = comment.votedBy.find((v) => v.userId === user.id);
        let newVotedBy = [...comment.votedBy];
        let upvotes = comment.upvotes;
        let downvotes = comment.downvotes;

        if (existingVote) {
          if (existingVote.type === 'upvote') upvotes--;
          else downvotes--;
          newVotedBy = newVotedBy.filter((v) => v.userId !== user.id);

          if (existingVote.type === voteType) {
            return { ...comment, upvotes, downvotes, votedBy: newVotedBy, updatedAt: Date.now() };
          }
        }

        if (voteType === 'upvote') upvotes++;
        else downvotes++;
        newVotedBy.push({ userId: user.id, type: voteType });

        return { ...comment, upvotes, downvotes, votedBy: newVotedBy, updatedAt: Date.now() };
      }

      if (comment.replies && comment.replies.length > 0) {
        return { ...comment, replies: voteOnCommentRecursive(comment.replies, commentId, voteType) };
      }

      return comment;
    });
  };

  // DELETE POST
  const deletePost = useCallback((postId) => {
    if (!user) return { success: false, error: 'Must be logged in' };

    try {
      const post = posts.find((p) => p.id === postId);
      if (post.userId !== user.id) {
        return { success: false, error: 'Can only delete your own posts' };
      }

      const updatedPosts = posts.filter((p) => p.id !== postId);
      setPosts(updatedPosts);
      setItem(STORAGE_KEYS.COMMUNITY_POSTS, updatedPosts);

      return { success: true };
    } catch (error) {
      console.error('Error deleting post:', error);
      return { success: false, error: 'Failed to delete post' };
    }
  }, [user, posts]);

  // GET USER VOTE ON POST
  const getUserVote = useCallback((postId) => {
    if (!user) return null;
    const post = posts.find((p) => p.id === postId);
    if (!post) return null;
    const vote = post.votedBy.find((v) => v.userId === user.id);
    return vote ? vote.type : null;
  }, [user, posts]);

  // GET USER VOTE ON COMMENT
  const getUserCommentVote = useCallback((postId, commentId) => {
    if (!user) return null;
    const post = posts.find((p) => p.id === postId);
    if (!post) return null;

    const findCommentVote = (comments) => {
      for (const comment of comments) {
        if (comment.id === commentId) {
          const vote = comment.votedBy.find((v) => v.userId === user.id);
          return vote ? vote.type : null;
        }
        if (comment.replies && comment.replies.length > 0) {
          const vote = findCommentVote(comment.replies);
          if (vote) return vote;
        }
      }
      return null;
    };

    return findCommentVote(post.comments);
  }, [user, posts]);

  const value = {
    posts,
    loading,
    createPost,
    voteOnPost,
    addComment,
    voteOnComment,
    deletePost,
    getUserVote,
    getUserCommentVote,
  };

  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};

export default CommunityContext;
