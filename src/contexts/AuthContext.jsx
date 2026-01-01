/**
 * Authentication Context
 * Manages user authentication state with localStorage persistence
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getItem, setItem, removeItem, migrateData, STORAGE_KEYS } from '@utils/localStorage';
import { DEFAULT_PREFERENCES } from '@utils/constants';
import { v4 as uuidv4 } from 'uuid';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        // Migrate old data if exists
        migrateData();

        // Load user data
        const storedUser = getItem(STORAGE_KEYS.USER);
        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = useCallback((username, password) => {
    try {
      // In a real app, this would validate against a backend
      // For now, we'll check against localStorage or create new user

      const existingUser = getItem(STORAGE_KEYS.USER);

      // Check if user exists and password matches (very basic check)
      if (existingUser) {
        if (existingUser.username === username && existingUser.password === password) {
          setUser(existingUser);
          setIsAuthenticated(true);
          return { success: true, user: existingUser };
        } else {
          return { success: false, error: 'Invalid username or password' };
        }
      }

      // If no existing user, create new one (simplified for demo)
      const newUser = {
        id: uuidv4(),
        username,
        password, // In production, NEVER store plain text passwords!
        email: `${username}@example.com`,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=3b82f6&color=fff`,
        createdAt: Date.now(),
        preferences: { ...DEFAULT_PREFERENCES },
        karma: 0,
        bookmarkedPosts: [],
      };

      setItem(STORAGE_KEYS.USER, newUser);
      setUser(newUser);
      setIsAuthenticated(true);

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  }, []);

  // Signup function
  const signup = useCallback((username, email, password, phoneNumber = '') => {
    try {
      // Check if user already exists
      const existingUser = getItem(STORAGE_KEYS.USER);
      if (existingUser && existingUser.username === username) {
        return { success: false, error: 'Username already exists' };
      }

      // Create new user
      const newUser = {
        id: uuidv4(),
        username,
        email,
        phoneNumber,
        password, // In production, NEVER store plain text passwords!
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=3b82f6&color=fff`,
        createdAt: Date.now(),
        preferences: { ...DEFAULT_PREFERENCES },
        karma: 0,
        bookmarkedPosts: [],
      };

      setItem(STORAGE_KEYS.USER, newUser);
      setUser(newUser);
      setIsAuthenticated(true);

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An error occurred during signup' };
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    try {
      removeItem(STORAGE_KEYS.USER);
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'An error occurred during logout' };
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback((updates) => {
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      const updatedUser = {
        ...user,
        ...updates,
        updatedAt: Date.now(),
      };

      setItem(STORAGE_KEYS.USER, updatedUser);
      setUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'An error occurred while updating profile' };
    }
  }, [user]);

  // Update user preferences
  const updatePreferences = useCallback((preferences) => {
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      const updatedUser = {
        ...user,
        preferences: {
          ...user.preferences,
          ...preferences,
        },
        updatedAt: Date.now(),
      };

      setItem(STORAGE_KEYS.USER, updatedUser);
      setUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Update preferences error:', error);
      return { success: false, error: 'An error occurred while updating preferences' };
    }
  }, [user]);

  // Update karma
  const updateKarma = useCallback((delta) => {
    try {
      if (!user) return { success: false };

      const updatedUser = {
        ...user,
        karma: (user.karma || 0) + delta,
        updatedAt: Date.now(),
      };

      setItem(STORAGE_KEYS.USER, updatedUser);
      setUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Update karma error:', error);
      return { success: false };
    }
  }, [user]);

  // Toggle bookmark on a post
  const toggleBookmark = useCallback((postId) => {
    try {
      if (!user) return { success: false, error: 'Must be logged in' };

      const bookmarkedPosts = user.bookmarkedPosts || [];
      const isBookmarked = bookmarkedPosts.includes(postId);

      const updatedBookmarks = isBookmarked
        ? bookmarkedPosts.filter((id) => id !== postId)
        : [...bookmarkedPosts, postId];

      const updatedUser = {
        ...user,
        bookmarkedPosts: updatedBookmarks,
        updatedAt: Date.now(),
      };

      setItem(STORAGE_KEYS.USER, updatedUser);
      setUser(updatedUser);

      return { success: true, isBookmarked: !isBookmarked };
    } catch (error) {
      console.error('Toggle bookmark error:', error);
      return { success: false, error: 'Failed to update bookmark' };
    }
  }, [user]);

  // Check if a post is bookmarked
  const isPostBookmarked = useCallback((postId) => {
    if (!user) return false;
    return (user.bookmarkedPosts || []).includes(postId);
  }, [user]);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    updatePreferences,
    updateKarma,
    toggleBookmark,
    isPostBookmarked,
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
