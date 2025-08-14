'use client'

import React, { useEffect, useState, useRef } from 'react';
import {
  XIcon,
  EyeIcon,
  EyeOffIcon,
  LoaderIcon,
  UserIcon,
  BriefcaseIcon,
  CheckCircleIcon,
} from 'lucide-react';
type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  // User type selection
  const [userType, setUserType] = useState<'traveler' | 'pro'>('traveler');
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Form states
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  // Ref for modal content
  const modalRef = useRef<HTMLDivElement>(null);
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset errors
    setErrors({});
    // Validate form
    let isValid = true;
    const newErrors: {
      email?: string;
      password?: string;
    } = {};
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    if (!isValid) {
      setErrors(newErrors);
      return;
    }
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Close modal on successful login
      onClose();
      // Show success toast (in a real app)
      alert(`Successfully signed in as ${userType === 'traveler' ? 'Traveler' : 'Travel Pro'}`);
    }, 1500);
  };
  // If modal is not open, don't render anything
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
      <div
        ref={modalRef}
        className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          aria-label="Close"
        >
          <XIcon size={24} />
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>
          {/* User Type Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${userType === 'traveler' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
              onClick={() => setUserType('traveler')}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${userType === 'traveler' ? 'bg-blue-100' : 'bg-gray-100'}`}
              >
                <UserIcon
                  size={24}
                  className={userType === 'traveler' ? 'text-blue-600' : 'text-gray-500'}
                />
              </div>
              <span
                className={`font-medium ${userType === 'traveler' ? 'text-blue-600' : 'text-gray-700'}`}
              >
                I'm a Traveler
              </span>
              <span className="text-xs text-gray-500 mt-1">Looking for experiences</span>
            </button>
            <button
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${userType === 'pro' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
              onClick={() => setUserType('pro')}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${userType === 'pro' ? 'bg-green-100' : 'bg-gray-100'}`}
              >
                <BriefcaseIcon
                  size={24}
                  className={userType === 'pro' ? 'text-green-600' : 'text-gray-500'}
                />
              </div>
              <span
                className={`font-medium ${userType === 'pro' ? 'text-green-600' : 'text-gray-700'}`}
              >
                I'm a Travel Pro
              </span>
              <span className="text-xs text-gray-500 mt-1">Guide or expert</span>
            </button>
          </div>
          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${errors.email ? 'border-red-300 focus:ring-red-200 focus:border-red-500' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            {/* Password Field */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button type="button" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${errors.password ? 'border-red-300 focus:ring-red-200 focus:border-red-500' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
            {/* Remember Me */}
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center py-2.5 px-4 rounded-lg font-medium transition-colors ${userType === 'traveler' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
            >
              {isLoading ? (
                <LoaderIcon size={20} className="animate-spin mr-2" />
              ) : userType === 'pro' ? (
                <CheckCircleIcon size={20} className="mr-2" />
              ) : null}
              {isLoading
                ? 'Signing in...'
                : userType === 'traveler'
                  ? 'Sign In'
                  : 'Sign In as Travel Pro'}
            </button>
            {/* Social Login Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink px-3 text-gray-500 text-sm">or continue with</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            {/* Social Login Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                type="button"
                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img
                  src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
              </button>
              <button
                type="button"
                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img
                  src="https://cdn.cdnlogo.com/logos/f/91/facebook-icon.svg"
                  alt="Facebook"
                  className="w-5 h-5"
                />
              </button>
              <button
                type="button"
                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img
                  src="https://cdn.cdnlogo.com/logos/a/10/apple.svg"
                  alt="Apple"
                  className="w-5 h-5"
                />
              </button>
            </div>
            {/* Sign Up Link */}
            <div className="text-center">
              {userType === 'traveler' ? (
                <p className="text-gray-600 text-sm">
                  Don't have an account?{' '}
                  <button type="button" className="text-blue-600 hover:text-blue-800 font-medium">
                    Sign up
                  </button>
                </p>
              ) : (
                <p className="text-gray-600 text-sm">
                  New Travel Pro?{' '}
                  <button type="button" className="text-green-600 hover:text-green-800 font-medium">
                    Apply to join
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default LoginModal;
