"use client";
import React, { useState } from "react";
import axios from "axios";

const AuthForms = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const endpoint = isLogin ? "https://mun-1igc.onrender.com/api/users/login" : "https://mun-1igc.onrender.com/api/users/register";
      const response = await axios.post(endpoint, formData);

      const { token, user } = response.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage(`${isLogin ? "Login" : "Signup"} successful! Redirecting...`);

      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || "Something went wrong. Please try again.";
      setMessage(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({ username: "", password: "" });
    setErrors({});
    setMessage("");
    setIsLoading(false);
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
                <h1 className="text-xl sm:text-2xl font-bold font-unifraktur text-gray-800">
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
                disabled={isLoading}
                className="px-4 py-2 sm:px-6 sm:py-2.5 bg-amber-100 hover:bg-stone-100 text-black rounded-xl font-medium transition-colors shadow-lg text-sm sm:text-base disabled:opacity-50"
              >
                {isLogin ? "Need an account?" : "Already have an account?"}
              </button>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Ready to authenticate</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content with top padding to account for fixed header */}
      <div className="relative z-10 pt-24 sm:pt-28 pb-8 px-3 sm:px-4 md:px-8">
        
        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            
            {/* Left Column - Auth Form */}
            <div className="bg-amber-50/80 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl h-fit">
              <div className="p-6 sm:p-8">
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isLogin ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                        {isLogin ? "Welcome Back" : "Join DiploMate"}
                      </h2>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600">
                    {isLogin 
                      ? "Sign in to access your diplomatic tools and continue your MUN journey" 
                      : "Create your account and unlock powerful AI-driven MUN assistance"
                    }
                  </p>
                </div>
                
                {/* Form */}
                <div className="space-y-6">
                  
                  {/* Username Field */}
                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                      Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className={`w-full px-4 py-3.5 border-2 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-300 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 ${
                          errors.username 
                            ? "border-red-400 bg-red-50/70 focus:border-red-500 focus:ring-red-500/20" 
                            : "border-gray-200 hover:border-gray-300 focus:border-blue-500"
                        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        placeholder="Enter your username"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    {errors.username && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.username}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className={`w-full px-4 py-3.5 border-2 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-300 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 ${
                          errors.password 
                            ? "border-red-400 bg-red-50/70 focus:border-red-500 focus:ring-red-500/20" 
                            : "border-gray-200 hover:border-gray-300 focus:border-blue-500"
                        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        placeholder="Enter your password"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`w-full py-4 px-4 rounded-xl font-semibold text-white transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-blue-500/30 ${
                      isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>{isLogin ? "Signing In..." : "Creating Account..."}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>{isLogin ? "Sign In" : "Create Account"}</span>
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    )}
                  </button>

                  {/* Message Display */}
                  {message && (
                    <div className={`p-4 rounded-xl text-sm text-center border transition-all duration-300 ${
                      message.includes("successful") 
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-200" 
                        : "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200"
                    }`}>
                      <div className="flex items-center justify-center gap-2">
                        {message.includes("successful") ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span>{message}</span>
                      </div>
                    </div>
                  )}

                  {/* Toggle Link */}
                  <div className="pt-4 border-t border-gray-200 text-center">
                    <button
                      onClick={toggleAuthMode}
                      disabled={isLoading}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLogin 
                        ? "Don't have an account? Create one here" 
                        : "Already have an account? Sign in instead"
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Features & Benefits */}
            <div className="transition-all duration-700 ease-in-out">
              <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8">
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                    {isLogin ? "Welcome to DiploMate" : "Why Choose DiploMate?"}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    {isLogin 
                      ? "Your AI-powered companion for Model UN excellence"
                      : "Powerful features designed for MUN success"
                    }
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100 hover:shadow-md transition-shadow">
                    <div className="text-3xl">⚡</div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Instant Generation</h3>
                      <p className="text-sm text-gray-600">AI-powered responses generated in seconds, saving you valuable preparation time during committee sessions.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 hover:shadow-md transition-shadow">
                    <div className="text-3xl">🎯</div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Country-Specific Positioning</h3>
                      <p className="text-sm text-gray-600">Tailored responses that reflect your assigned country's real diplomatic stance and foreign policy priorities.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100 hover:shadow-md transition-shadow">
                    <div className="text-3xl">📝</div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Multiple Document Types</h3>
                      <p className="text-sm text-gray-600">Generate opening speeches, position papers, draft resolutions, amendments, and working papers with ease.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-100 hover:shadow-md transition-shadow">
                    <div className="text-3xl">🌍</div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Global Coverage</h3>
                      <p className="text-sm text-gray-600">Comprehensive support for all 193 UN member states with accurate diplomatic language and terminology.</p>
                    </div>
                  </div>
                  
                  {/* Success Stats */}
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
                    <h4 className="font-semibold text-gray-800 mb-3 text-center">Trusted by MUN Delegates Worldwide</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">10K+</div>
                        <div className="text-xs text-gray-600">Speeches Generated</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-indigo-600">193</div>
                        <div className="text-xs text-gray-600">Countries Supported</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">50+</div>
                        <div className="text-xs text-gray-600">Committees Covered</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForms;