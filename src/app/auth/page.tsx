"use client";
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import Image from "next/image";

const AuthForms = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<{ username?: string, password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { username?: string, password?: string } = {};
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const endpoint = isLogin ? "http://localhost:5001/api/users/login" : "http://localhost:5001/api/users/register";
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
      let errMsg = "Something went wrong. Please try again.";
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error: string }>;
        if (axiosError.response && axiosError.response.data && axiosError.response.data.error) {
          errMsg = axiosError.response.data.error;
        }
      }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      
      {/* World Map Background */}
      <div className="world-map-background">
        <div className="map-image-container">
          <img 
            src="https://www.georgethegeographer.co.uk/Base_maps/World_b&w_unnamed.jpg" 
            alt="World Map Background"
            className="world-map-image"
          />
        </div>
        <div className="color-overlay"></div>
      </div>

      {/* Floating Diplomatic Elements */}
      <div className="floating-elements">
        <div className="diplomatic-icon icon-1">🏛️</div>
        <div className="diplomatic-icon icon-2">⚖️</div>
        <div className="diplomatic-icon icon-3">🌍</div>
        <div className="diplomatic-icon icon-4">🤝</div>
        <div className="diplomatic-icon icon-5">📜</div>
        <div className="diplomatic-icon icon-6">🕊️</div>
      </div>

      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-silver/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="logo-container">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/e/ee/UN_emblem_blue.svg"
                  alt="UN Logo"
                  width={40}
                  height={40}
                  className="logo-image"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-silver">
                  DiploMate
                </h1>
                <p className="text-xs sm:text-sm text-silver/70 hidden sm:block">
                  Diplomatic Atlas
                </p>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleAuthMode}
                disabled={isLoading}
                className="px-4 py-2 sm:px-6 sm:py-2.5 bg-slate-700/90 hover:bg-slate-600/90 text-silver rounded-xl font-medium transition-all duration-200 shadow-lg text-sm sm:text-base disabled:opacity-50 backdrop-blur-sm border border-silver/20"
              >
                {isLogin ? "Need an account?" : "Already have an account?"}
              </button>
              <div className="hidden md:flex items-center gap-2 text-sm text-silver/70">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
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
            <div className="diplomatic-card bg-slate-800/90 backdrop-blur-lg border border-silver/20 rounded-2xl sm:rounded-3xl shadow-xl h-fit">
              <div className="p-6 sm:p-8">
                <div className="border-b border-silver/20 pb-4 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg border border-blue-500/30">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isLogin ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-semibold text-silver">
                        {isLogin ? "Welcome Back" : "Join DiploMate"}
                      </h2>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-silver/70">
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
                    <label htmlFor="username" className="block text-sm font-semibold text-silver">
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
                        className={`w-full px-4 py-3.5 border-2 rounded-xl bg-slate-700/90 backdrop-blur-sm transition-all duration-300 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 placeholder-silver/50 text-silver ${
                          errors.username 
                            ? "border-red-400 bg-red-900/30 focus:border-red-400 focus:ring-red-500/20" 
                            : "border-silver/20 hover:border-silver/30 focus:border-blue-400"
                        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        placeholder="Enter your username"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="w-5 h-5 text-silver/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    {errors.username && (
                      <p className="text-sm text-red-400 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.username}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-silver">
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
                        className={`w-full px-4 py-3.5 border-2 rounded-xl bg-slate-700/90 backdrop-blur-sm transition-all duration-300 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 placeholder-silver/50 text-silver ${
                          errors.password 
                            ? "border-red-400 bg-red-900/30 focus:border-red-400 focus:ring-red-500/20" 
                            : "border-silver/20 hover:border-silver/30 focus:border-blue-400"
                        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        placeholder="Enter your password"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="w-5 h-5 text-silver/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-400 flex items-center gap-1">
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
                    className={`w-full py-4 px-4 rounded-xl font-semibold text-white transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-blue-500/30 backdrop-blur-sm ${
                      isLoading
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 border border-blue-500/30"
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
                    <div className={`p-4 rounded-xl text-sm text-center border transition-all duration-300 backdrop-blur-sm ${
                      message.includes("successful") 
                        ? "bg-green-900/30 text-green-300 border-green-400/30" 
                        : "bg-red-900/30 text-red-300 border-red-400/30"
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
                  <div className="pt-4 border-t border-silver/20 text-center">
                    <button
                      onClick={toggleAuthMode}
                      disabled={isLoading}
                      className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors duration-200 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="diplomatic-card bg-slate-800/90 backdrop-blur-lg border border-silver/20 rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8">
                <div className="border-b border-silver/20 pb-4 mb-6">
                  <h2 className="text-xl sm:text-2xl font-semibold text-silver mb-2">
                    {isLogin ? "Welcome to DiploMate" : "Why Choose DiploMate?"}
                  </h2>
                  <p className="text-sm sm:text-base text-silver/70">
                    {isLogin 
                      ? "Your AI-powered companion for Model UN excellence"
                      : "Powerful features designed for MUN success"
                    }
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-blue-900/30 rounded-xl border border-blue-400/20 hover:bg-blue-900/40 transition-all duration-200">
                    <div className="text-3xl">⚡</div>
                    <div>
                      <h3 className="font-semibold text-silver mb-1">Instant Generation</h3>
                      <p className="text-sm text-silver/70">AI-powered responses generated in seconds, saving you valuable preparation time during committee sessions.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-indigo-900/30 rounded-xl border border-indigo-400/20 hover:bg-indigo-900/40 transition-all duration-200">
                    <div className="text-3xl">🎯</div>
                    <div>
                      <h3 className="font-semibold text-silver mb-1">Country-Specific Positioning</h3>
                      <p className="text-sm text-silver/70">Tailored responses that reflect your assigned country's real diplomatic stance and foreign policy priorities.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-purple-900/30 rounded-xl border border-purple-400/20 hover:bg-purple-900/40 transition-all duration-200">
                    <div className="text-3xl">📝</div>
                    <div>
                      <h3 className="font-semibold text-silver mb-1">Multiple Document Types</h3>
                      <p className="text-sm text-silver/70">Generate opening speeches, position papers, draft resolutions, amendments, and working papers with ease.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-green-900/30 rounded-xl border border-green-400/20 hover:bg-green-900/40 transition-all duration-200">
                    <div className="text-3xl">🌍</div>
                    <div>
                      <h3 className="font-semibold text-silver mb-1">Global Coverage</h3>
                      <p className="text-sm text-silver/70">Comprehensive support for all 193 UN member states with accurate diplomatic language and terminology.</p>
                    </div>
                  </div>
                  
                  {/* Success Stats */}
                  <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-xl p-4 border border-silver/20 backdrop-blur-sm">
                    <h4 className="font-semibold text-silver mb-3 text-center">Trusted by MUN Delegates Worldwide</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-400">10K+</div>
                        <div className="text-xs text-silver/60">Speeches Generated</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-indigo-400">193</div>
                        <div className="text-xs text-silver/60">Countries Supported</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-400">50+</div>
                        <div className="text-xs text-silver/60">Committees Covered</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .world-map-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: -1;
        }

        .map-image-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .world-map-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          opacity: 0.4;
          filter: contrast(1.2) brightness(0.8);
        }

        .color-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, 
            rgba(12, 22, 49, 0.85) 0%, 
            rgba(26, 47, 92, 0.75) 25%, 
            rgba(43, 74, 138, 0.7) 50%, 
            rgba(26, 47, 92, 0.75) 75%, 
            rgba(12, 22, 49, 0.85) 100%
          );
          mix-blend-mode: multiply;
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }

        .diplomatic-icon {
          position: absolute;
          font-size: 2rem;
          opacity: 0.5;
          animation: diplomaticFloat 25s infinite ease-in-out;
          filter: grayscale(0.2) brightness(1.3) drop-shadow(0 0 10px rgba(192, 192, 192, 0.3));
        }

        .icon-1 { top: 15%; left: 10%; animation-delay: 0s; }
        .icon-2 { top: 25%; right: 15%; animation-delay: -5s; }
        .icon-3 { top: 45%; left: 5%; animation-delay: -10s; }
        .icon-4 { top: 35%; right: 8%; animation-delay: -15s; }
        .icon-5 { bottom: 30%; left: 12%; animation-delay: -20s; }
        .icon-6 { bottom: 20%; right: 20%; animation-delay: -3s; }

        .logo-container {
          padding: 0.5rem;
          background: linear-gradient(135deg, rgba(192, 192, 192, 0.15), rgba(192, 192, 192, 0.05));
          border-radius: 12px;
          border: 1px solid rgba(192, 192, 192, 0.3);
        }

        .logo-image {
          filter: brightness(0) saturate(100%) invert(75%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(1.2) contrast(1);
        }

        .diplomatic-card {
          background: linear-gradient(135deg, 
            rgba(30, 41, 59, 0.95) 0%, 
            rgba(51, 65, 85, 0.9) 50%, 
            rgba(30, 41, 59, 0.95) 100%
          );
        }

        .diplomatic-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #c0c0c0, #e6e6e6, #c0c0c0);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .diplomatic-card:hover::before {
          transform: scaleX(1);
        }

        .text-silver {
          color: #c0c0c0;
        }

        .text-silver\/70 {
          color: rgba(192, 192, 192, 0.7);
        }

        .text-silver\/60 {
          color: rgba(192, 192, 192, 0.6);
        }

        .text-silver\/50 {
          color: rgba(192, 192, 192, 0.5);
        }

        .border-silver\/20 {
          border-color: rgba(192, 192, 192, 0.2);
        }

        .border-silver\/30 {
          border-color: rgba(192, 192, 192, 0.3);
        }

        .placeholder-silver\/50::placeholder {
          color: rgba(192, 192, 192, 0.5);
        }

        @keyframes diplomaticFloat {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.5; }
          25% { transform: translateY(-15px) scale(1.1); opacity: 0.7; }
          50% { transform: translateY(-5px) scale(0.9); opacity: 0.6; }
          75% { transform: translateY(-10px) scale(1.05); opacity: 0.8; }
        }

        @media (max-width: 768px) {
          .diplomatic-card {
            padding: 1.5rem;
          }

          .world-map-image {
            opacity: 0.3;
          }

          .diplomatic-icon {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthForms;
