/**
 * Authentication Context
 * Manages user authentication state with Supabase
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@services/supabaseClient';
import { DEFAULT_PREFERENCES } from '@utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Supabase
  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();

        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          setIsAuthenticated(true);

          // Fetch profile
          const userProfile = await fetchProfile(initialSession.user.id);
          if (userProfile) {
            setProfile(userProfile);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state changed:', event);

      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        setIsAuthenticated(true);

        // Fetch profile on sign in
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const userProfile = await fetchProfile(currentSession.user.id);
          if (userProfile) {
            setProfile(userProfile);
          }
        }
      } else {
        setSession(null);
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Sign up with email and password
  const signup = useCallback(async (email, password, username, phoneNumber = '') => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            phone_number: phoneNumber,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // If email confirmation is required
      if (data.user && !data.session) {
        return {
          success: true,
          user: data.user,
          message: 'Please check your email to confirm your account.',
          requiresConfirmation: true
        };
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An error occurred during signup' };
    } finally {
      setLoading(false);
    }
  }, []);

  // Login with email and password
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, url: data.url };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { success: false, error: 'An error occurred during Google sign-in' };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { success: false, error: error.message };
      }

      setUser(null);
      setProfile(null);
      setSession(null);
      setIsAuthenticated(false);

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'An error occurred during logout' };
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (updates) => {
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      setProfile(data);
      return { success: true, profile: data };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'An error occurred while updating profile' };
    }
  }, [user]);

  // Update user preferences
  const updatePreferences = useCallback(async (preferences) => {
    try {
      if (!user || !profile) {
        return { success: false, error: 'No user logged in' };
      }

      const updatedPreferences = {
        ...profile.preferences,
        ...preferences,
      };

      const { data, error } = await supabase
        .from('profiles')
        .update({
          preferences: updatedPreferences,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      setProfile(data);
      return { success: true, profile: data };
    } catch (error) {
      console.error('Update preferences error:', error);
      return { success: false, error: 'An error occurred while updating preferences' };
    }
  }, [user, profile]);

  // Toggle bookmark on a post
  const toggleBookmark = useCallback(async (postId) => {
    try {
      if (!user || !profile) {
        return { success: false, error: 'Must be logged in' };
      }

      const bookmarkedPosts = profile.bookmarked_posts || [];
      const isBookmarked = bookmarkedPosts.includes(postId);

      const updatedBookmarks = isBookmarked
        ? bookmarkedPosts.filter((id) => id !== postId)
        : [...bookmarkedPosts, postId];

      const { data, error } = await supabase
        .from('profiles')
        .update({
          bookmarked_posts: updatedBookmarks,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      setProfile(data);
      return { success: true, isBookmarked: !isBookmarked };
    } catch (error) {
      console.error('Toggle bookmark error:', error);
      return { success: false, error: 'Failed to update bookmark' };
    }
  }, [user, profile]);

  // Check if a post is bookmarked
  const isPostBookmarked = useCallback((postId) => {
    if (!profile) return false;
    return (profile.bookmarked_posts || []).includes(postId);
  }, [profile]);

  // Reset password
  const resetPassword = useCallback(async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'An error occurred' };
    }
  }, []);

  // Combined user object for backwards compatibility
  const combinedUser = profile ? {
    id: user?.id,
    username: profile.username,
    email: profile.email || user?.email,
    phoneNumber: profile.phone_number,
    avatar: profile.avatar,
    preferences: profile.preferences || DEFAULT_PREFERENCES,
    bookmarkedPosts: profile.bookmarked_posts || [],
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  } : null;

  const value = {
    user: combinedUser,
    session,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    signInWithGoogle,
    updateProfile,
    updatePreferences,
    toggleBookmark,
    isPostBookmarked,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
