"use client";
import React, { useState } from 'react';

const AuthForms = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const simulateAuth = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate success response with token
    return {
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
      user: { username: formData.username }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const result = await simulateAuth();
      
      if (result.success) {
        // Store token in localStorage
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        setMessage(`${isLogin ? 'Login' : 'Signup'} successful! Redirecting to dashboard...`);
        
        // Simulate redirect after short delay
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      }
    } catch (error) {
      setMessage('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ username: '', password: '' });
    setErrors({});
    setMessage('');
    setIsLoading(false);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-stone-50 from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-200">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/e/ee/UN_emblem_blue.svg"
                  alt="UN Logo"
                  className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  DiploMate
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  AI-powered MUN assistant
                </p>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleAuthMode}
                className="px-4 py-2 sm:px-6 sm:py-2.5 bg-amber-100 hover:bg-stone-100 text-black rounded-xl font-medium transition-colors shadow-lg text-sm sm:text-base"
              >
                {isLogin ? 'Need an account?' : 'Already have an account?'}
              </button>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Ready to authenticate</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="relative z-10 pt-24 sm:pt-28 pb-8 px-3 sm:px-4 md:px-8">
        <div className="max-w-md mx-auto">
          
          {/* Auth Form */}
          <div className="bg-amber-50/80 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl">
            <div className="p-6 sm:p-8">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  {isLogin 
                    ? 'Sign in to access your diplomatic tools' 
                    : 'Join DiploMate to enhance your MUN experience'
                  }
                </p>
              </div>
              
              <div className="space-y-4">
                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.username 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                    placeholder="Enter your username"
                    disabled={isLoading}
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.password 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-200 ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {isLogin ? 'Signing In...' : 'Creating Account...'}
                    </div>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </button>

                {/* Message Display */}
                {message && (
                  <div className={`p-3 rounded-xl text-sm text-center ${
                    message.includes('successful') 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {message}
                  </div>
                )}
              </div>

              {/* Toggle Link */}
              <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                <button
                  onClick={toggleAuthMode}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                  disabled={isLoading}
                >
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"
                  }
                </button>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-8 bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              What you'll get with DiploMate
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-gray-600">AI Speech Generation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-gray-600">Country Positioning</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-gray-600">Draft Resolutions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-gray-600">Position Papers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForms;