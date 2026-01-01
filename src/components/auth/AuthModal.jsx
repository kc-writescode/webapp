/**
 * AuthModal Component
 * Login and Signup modal with authentication
 */

import React, { useState } from 'react';
import { X, Mail, Eye, EyeOff, Phone } from 'lucide-react';
import { useAuth } from '@contexts/AuthContext';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import { validateUsername, validatePassword, validateEmail, validateIndianPhone } from '@utils/validators';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, signup } = useAuth();
  const [authMode, setAuthMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setErrorMessage('');
  };

  const validateForm = () => {
    const newErrors = {};

    const usernameValidation = validateUsername(formData.username);
    if (!usernameValidation.isValid) {
      newErrors.username = usernameValidation.error;
    }

    if (authMode === 'signup') {
      const emailValidation = validateEmail(formData.email);
      if (!emailValidation.isValid) {
        newErrors.email = emailValidation.error;
      }

      const phoneValidation = validateIndianPhone(formData.phoneNumber);
      if (!phoneValidation.isValid) {
        newErrors.phoneNumber = phoneValidation.error;
      }
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let result;
      if (authMode === 'login') {
        result = login(formData.username, formData.password);
      } else {
        result = signup(formData.username, formData.email, formData.password, formData.phoneNumber);
      }

      if (result.success) {
        // Clear form
        setFormData({ username: '', email: '', password: '', phoneNumber: '' });
        setErrors({});
        onClose();
      } else {
        setErrorMessage(result.error || 'Authentication failed');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const toggleMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
    setErrors({});
    setErrorMessage('');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-2xl border border-slate-700 max-w-md w-full p-8 transform transition-all animate-fadeInScale"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {authMode === 'login' ? 'Welcome Back' : 'Join Our Community'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter your username"
            error={errors.username}
            required
            autoFocus
          />

          {authMode === 'signup' && (
            <>
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter your email"
                error={errors.email}
                icon={Mail}
                required
              />

              <Input
                label="Mobile Number"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="+91 XXXXX XXXXX"
                error={errors.phoneNumber}
                icon={Phone}
                required
              />
            </>
          )}

          <div className="relative">
            <Input
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your password"
              error={errors.password}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            className="mt-6"
          >
            {authMode === 'login' ? 'Login' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={toggleMode}
            className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
          >
            {authMode === 'login'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
