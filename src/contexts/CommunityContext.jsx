/**
 * Community Context
 * Manages community posts, comments, likes/dislikes
 * Uses Supabase for data persistence with real-time updates
 */

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@services/supabaseClient';

const CommunityContext = createContext(null);

export const CommunityProvider = ({ children }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const subscriptionRef = useRef(null);

  // Load posts from Supabase
  useEffect(() => {
    loadPosts();

    // Set up real-time subscription
    setupRealtimeSubscription();

    return () => {
      // Clean up subscription on unmount
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, []);

  const setupRealtimeSubscription = () => {
    subscriptionRef.current = supabase
      .channel('community-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        handlePostChange
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'comments' },
        handleCommentChange
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'post_votes' },
        handlePostVoteChange
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'comment_votes' },
        handleCommentVoteChange
      )
      .subscribe();
  };

  const handlePostChange = async (payload) => {
    if (payload.eventType === 'INSERT') {
      // Fetch the full post with comments
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('id', payload.new.id)
        .single();

      if (data) {
        const post = await enrichPostWithComments(data);
        setPosts((prev) => [post, ...prev]);
      }
    } else if (payload.eventType === 'UPDATE') {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === payload.new.id
            ? { ...p, ...transformPostFromDb(payload.new) }
            : p
        )
      );
    } else if (payload.eventType === 'DELETE') {
      setPosts((prev) => prev.filter((p) => p.id !== payload.old.id));
    }
  };

  const handleCommentChange = async (payload) => {
    if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
      // Refresh the post that this comment belongs to
      const postId = payload.new.post_id;
      await refreshPostComments(postId);
    } else if (payload.eventType === 'DELETE') {
      const postId = payload.old.post_id;
      await refreshPostComments(postId);
    }
  };

  const handlePostVoteChange = async (payload) => {
    const postId = payload.new?.post_id || payload.old?.post_id;
    if (postId) {
      // Refresh post vote counts
      const { data } = await supabase
        .from('posts')
        .select('upvotes, downvotes')
        .eq('id', postId)
        .single();

      if (data) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, upvotes: data.upvotes, downvotes: data.downvotes }
              : p
          )
        );
      }
    }
  };

  const handleCommentVoteChange = async (payload) => {
    const commentId = payload.new?.comment_id || payload.old?.comment_id;
    if (commentId) {
      // Get the post that contains this comment and refresh
      const { data: comment } = await supabase
        .from('comments')
        .select('post_id')
        .eq('id', commentId)
        .single();

      if (comment) {
        await refreshPostComments(comment.post_id);
      }
    }
  };

  const refreshPostComments = async (postId) => {
    const { data: comments } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (comments) {
      const nestedComments = buildNestedComments(comments);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, comments: nestedComments } : p
        )
      );
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);

      // Fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('Error loading posts:', postsError);
        return;
      }

      // Fetch all comments
      const { data: commentsData } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: true });

      // Fetch user's votes if authenticated
      let userPostVotes = [];
      let userCommentVotes = [];

      if (user?.id) {
        const [postVotesRes, commentVotesRes] = await Promise.all([
          supabase.from('post_votes').select('*').eq('user_id', user.id),
          supabase.from('comment_votes').select('*').eq('user_id', user.id),
        ]);
        userPostVotes = postVotesRes.data || [];
        userCommentVotes = commentVotesRes.data || [];
      }

      // Transform and combine data
      const enrichedPosts = postsData.map((post) => {
        const postComments = (commentsData || []).filter((c) => c.post_id === post.id);
        const nestedComments = buildNestedComments(postComments, userCommentVotes);

        return {
          ...transformPostFromDb(post),
          comments: nestedComments,
          votedBy: userPostVotes
            .filter((v) => v.post_id === post.id)
            .map((v) => ({ userId: v.user_id, type: v.vote_type })),
        };
      });

      setPosts(enrichedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Transform post from database format
  const transformPostFromDb = (post) => ({
    id: post.id,
    userId: post.user_id,
    username: post.username,
    avatar: post.avatar,
    title: post.title,
    content: post.content,
    category: post.category,
    upvotes: post.upvotes,
    downvotes: post.downvotes,
    isEdited: post.is_edited,
    createdAt: new Date(post.created_at).getTime(),
    updatedAt: new Date(post.updated_at).getTime(),
    votedBy: [],
    comments: [],
  });

  // Transform comment from database format
  const transformCommentFromDb = (comment, userVotes = []) => ({
    id: comment.id,
    userId: comment.user_id,
    username: comment.username,
    avatar: comment.avatar,
    content: comment.content,
    parentId: comment.parent_id,
    upvotes: comment.upvotes,
    downvotes: comment.downvotes,
    isEdited: comment.is_edited,
    createdAt: new Date(comment.created_at).getTime(),
    updatedAt: new Date(comment.updated_at).getTime(),
    votedBy: userVotes
      .filter((v) => v.comment_id === comment.id)
      .map((v) => ({ userId: v.user_id, type: v.vote_type })),
    replies: [],
  });

  // Build nested comment structure
  const buildNestedComments = (comments, userVotes = []) => {
    const commentMap = new Map();
    const rootComments = [];

    // First pass: transform all comments
    comments.forEach((comment) => {
      commentMap.set(comment.id, transformCommentFromDb(comment, userVotes));
    });

    // Second pass: build tree structure
    comments.forEach((comment) => {
      const transformedComment = commentMap.get(comment.id);
      if (comment.parent_id && commentMap.has(comment.parent_id)) {
        const parent = commentMap.get(comment.parent_id);
        parent.replies.push(transformedComment);
      } else {
        rootComments.push(transformedComment);
      }
    });

    return rootComments;
  };

  const enrichPostWithComments = async (post) => {
    const { data: comments } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true });

    const nestedComments = buildNestedComments(comments || []);

    return {
      ...transformPostFromDb(post),
      comments: nestedComments,
    };
  };

  // CREATE POST
  const createPost = useCallback(async (postData) => {
    if (!user) return { success: false, error: 'Must be logged in to post' };

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          username: user.username,
          avatar: user.avatar,
          title: postData.title,
          content: postData.content,
          category: postData.category || 'general',
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating post:', error);
        return { success: false, error: error.message };
      }

      const newPost = {
        ...transformPostFromDb(data),
        comments: [],
        votedBy: [],
      };

      // Don't add to state - real-time subscription will handle it
      return { success: true, post: newPost };
    } catch (error) {
      console.error('Error creating post:', error);
      return { success: false, error: 'Failed to create post' };
    }
  }, [user]);

  // VOTE ON POST
  const voteOnPost = useCallback(async (postId, voteType) => {
    if (!user) return { success: false, error: 'Must be logged in to vote' };

    try {
      // Check for existing vote
      const { data: existingVote } = await supabase
        .from('post_votes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remove vote (toggle off)
          await supabase
            .from('post_votes')
            .delete()
            .eq('id', existingVote.id);
        } else {
          // Change vote type
          await supabase
            .from('post_votes')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id);
        }
      } else {
        // Create new vote
        await supabase
          .from('post_votes')
          .insert({
            post_id: postId,
            user_id: user.id,
            vote_type: voteType,
          });
      }

      // Update local state optimistically
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            const existingUserVote = post.votedBy.find((v) => v.userId === user.id);
            let newVotedBy = [...post.votedBy];
            let upvotes = post.upvotes;
            let downvotes = post.downvotes;

            if (existingUserVote) {
              if (existingUserVote.type === 'upvote') upvotes--;
              else downvotes--;
              newVotedBy = newVotedBy.filter((v) => v.userId !== user.id);

              if (existingUserVote.type !== voteType) {
                if (voteType === 'upvote') upvotes++;
                else downvotes++;
                newVotedBy.push({ userId: user.id, type: voteType });
              }
            } else {
              if (voteType === 'upvote') upvotes++;
              else downvotes++;
              newVotedBy.push({ userId: user.id, type: voteType });
            }

            return { ...post, upvotes, downvotes, votedBy: newVotedBy };
          }
          return post;
        })
      );

      return { success: true };
    } catch (error) {
      console.error('Error voting on post:', error);
      return { success: false, error: 'Failed to vote' };
    }
  }, [user]);

  // ADD COMMENT
  const addComment = useCallback(async (postId, commentData) => {
    if (!user) return { success: false, error: 'Must be logged in to comment' };

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          parent_id: commentData.parentId || null,
          username: user.username,
          avatar: user.avatar,
          content: commentData.content,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding comment:', error);
        return { success: false, error: error.message };
      }

      const newComment = transformCommentFromDb(data);

      // Update local state
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            if (commentData.parentId) {
              // Add as reply
              const addReplyToComment = (comments) =>
                comments.map((c) => {
                  if (c.id === commentData.parentId) {
                    return { ...c, replies: [...c.replies, newComment] };
                  }
                  if (c.replies.length > 0) {
                    return { ...c, replies: addReplyToComment(c.replies) };
                  }
                  return c;
                });
              return { ...post, comments: addReplyToComment(post.comments) };
            } else {
              // Add as top-level comment
              return { ...post, comments: [...post.comments, newComment] };
            }
          }
          return post;
        })
      );

      return { success: true, comment: newComment };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false, error: 'Failed to add comment' };
    }
  }, [user]);

  // VOTE ON COMMENT
  const voteOnComment = useCallback(async (postId, commentId, voteType) => {
    if (!user) return { success: false, error: 'Must be logged in to vote' };

    try {
      // Check for existing vote
      const { data: existingVote } = await supabase
        .from('comment_votes')
        .select('*')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          await supabase.from('comment_votes').delete().eq('id', existingVote.id);
        } else {
          await supabase
            .from('comment_votes')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id);
        }
      } else {
        await supabase.from('comment_votes').insert({
          comment_id: commentId,
          user_id: user.id,
          vote_type: voteType,
        });
      }

      // Update local state
      const updateCommentVote = (comments) =>
        comments.map((comment) => {
          if (comment.id === commentId) {
            const existingUserVote = comment.votedBy.find((v) => v.userId === user.id);
            let newVotedBy = [...comment.votedBy];
            let upvotes = comment.upvotes;
            let downvotes = comment.downvotes;

            if (existingUserVote) {
              if (existingUserVote.type === 'upvote') upvotes--;
              else downvotes--;
              newVotedBy = newVotedBy.filter((v) => v.userId !== user.id);

              if (existingUserVote.type !== voteType) {
                if (voteType === 'upvote') upvotes++;
                else downvotes++;
                newVotedBy.push({ userId: user.id, type: voteType });
              }
            } else {
              if (voteType === 'upvote') upvotes++;
              else downvotes++;
              newVotedBy.push({ userId: user.id, type: voteType });
            }

            return { ...comment, upvotes, downvotes, votedBy: newVotedBy };
          }
          if (comment.replies.length > 0) {
            return { ...comment, replies: updateCommentVote(comment.replies) };
          }
          return comment;
        });

      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return { ...post, comments: updateCommentVote(post.comments) };
          }
          return post;
        })
      );

      return { success: true };
    } catch (error) {
      console.error('Error voting on comment:', error);
      return { success: false, error: 'Failed to vote on comment' };
    }
  }, [user]);

  // UPDATE POST
  const updatePost = useCallback(async (postId, updates) => {
    if (!user) return { success: false, error: 'Must be logged in' };

    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) return { success: false, error: 'Post not found' };
      if (post.userId !== user.id) {
        return { success: false, error: 'Can only edit your own posts' };
      }

      // Check if within 24 hours
      const hoursSinceCreation = (Date.now() - post.createdAt) / (1000 * 60 * 60);
      if (hoursSinceCreation > 24) {
        return { success: false, error: 'Posts can only be edited within 24 hours of creation' };
      }

      const { error } = await supabase
        .from('posts')
        .update({
          title: updates.title || post.title,
          content: updates.content || post.content,
          is_edited: true,
        })
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      // Update local state
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              title: updates.title || p.title,
              content: updates.content || p.content,
              isEdited: true,
              updatedAt: Date.now(),
            };
          }
          return p;
        })
      );

      return { success: true };
    } catch (error) {
      console.error('Error updating post:', error);
      return { success: false, error: 'Failed to update post' };
    }
  }, [user, posts]);

  // UPDATE COMMENT
  const updateComment = useCallback(async (postId, commentId, newContent) => {
    if (!user) return { success: false, error: 'Must be logged in' };

    try {
      // Find the comment
      const post = posts.find((p) => p.id === postId);
      if (!post) return { success: false, error: 'Post not found' };

      const findComment = (comments) => {
        for (const comment of comments) {
          if (comment.id === commentId) return comment;
          if (comment.replies.length > 0) {
            const found = findComment(comment.replies);
            if (found) return found;
          }
        }
        return null;
      };

      const comment = findComment(post.comments);
      if (!comment) return { success: false, error: 'Comment not found' };
      if (comment.userId !== user.id) {
        return { success: false, error: 'Can only edit your own comments' };
      }

      const hoursSinceCreation = (Date.now() - comment.createdAt) / (1000 * 60 * 60);
      if (hoursSinceCreation > 24) {
        return { success: false, error: 'Comments can only be edited within 24 hours' };
      }

      const { error } = await supabase
        .from('comments')
        .update({
          content: newContent,
          is_edited: true,
        })
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      // Update local state
      const updateCommentRecursive = (comments) =>
        comments.map((c) => {
          if (c.id === commentId) {
            return { ...c, content: newContent, isEdited: true, updatedAt: Date.now() };
          }
          if (c.replies.length > 0) {
            return { ...c, replies: updateCommentRecursive(c.replies) };
          }
          return c;
        });

      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            return { ...p, comments: updateCommentRecursive(p.comments) };
          }
          return p;
        })
      );

      return { success: true };
    } catch (error) {
      console.error('Error updating comment:', error);
      return { success: false, error: 'Failed to update comment' };
    }
  }, [user, posts]);

  // DELETE POST
  const deletePost = useCallback(async (postId) => {
    if (!user) return { success: false, error: 'Must be logged in' };

    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) return { success: false, error: 'Post not found' };
      if (post.userId !== user.id) {
        return { success: false, error: 'Can only delete your own posts' };
      }

      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      setPosts((prev) => prev.filter((p) => p.id !== postId));
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
        if (comment.replies.length > 0) {
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
    updatePost,
    voteOnPost,
    addComment,
    updateComment,
    voteOnComment,
    deletePost,
    getUserVote,
    getUserCommentVote,
    refreshPosts: loadPosts,
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
