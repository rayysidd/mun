'use client';

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { isAuthenticated } from '@/utils/auth';
import MUNForm from "@/components/MUNForm";
import MUNOutput from "@/components/MUNOutput";
import Image from "next/image";

// Define the interface for the delegation data
interface Delegation {
  _id: string;
  eventId: {
    _id: string;
    eventName: string;
    committee: string;
    agenda: string;
  };
  country: string;
}

export default function SpeechPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Form state
  const [country, setCountry] = useState('');
  const [committee, setCommittee] = useState('');
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('');
  const [context, setContext] = useState('');
  const [briefMode, setBriefMode] = useState(false);

  // App flow state
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState('');
  
  // User & Event data state
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [delegations, setDelegations] = useState<Delegation[]>([]);
  const [selectedEventId, setSelectedEventId] = useState('');

  const handleLogout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setUsername('');
    router.push('/auth');
  }, [router]);

  // Combined useEffect for auth and data fetching
  useEffect(() => {
    const fetchUserEvents = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      try {
        const response = await fetch('http://localhost:5001/api/events/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setDelegations(data);
        }
      } catch (error) {
        console.error("Failed to fetch user events:", error);
      }
    };

    const checkAuthAndFetch = () => {
      if (!isAuthenticated()) {
        router.push('/auth');
      } else {
        setIsLoggedIn(true);
        const userData = localStorage.getItem('user');
        setUsername(userData ? JSON.parse(userData).username : 'User');
        fetchUserEvents();
        setLoading(false);
      }
    };
    checkAuthAndFetch();
  }, [router]);

  // useEffect to handle autofill from chat redirection
  useEffect(() => {
    const urlEventId = searchParams.get('eventId');
    const urlCountry = searchParams.get('country');
    const urlCommittee = searchParams.get('committee');
    const urlTopic = searchParams.get('topic');
    const urlContent = searchParams.get('content');
    const urlType = searchParams.get('type');

    if (urlContent) {
      setSelectedEventId(urlEventId || '');
      setCountry(urlCountry || '');
      setCommittee(urlCommittee || '');
      setTopic(urlTopic || '');
      setType(urlType || 'debate speech');
      setOutput(urlContent);
      setSubmitted(true);
    }
  }, [searchParams]);

  // Handler for when user selects an event from the dropdown to autofill
  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
    if (eventId) {
      const selectedDelegation = delegations.find(d => d.eventId._id === eventId);
      if (selectedDelegation) {
        setCountry(selectedDelegation.country);
        setCommittee(selectedDelegation.eventId.committee);
        setTopic(selectedDelegation.eventId.agenda);
      }
    } else {
      setCountry('');
      setCommittee('');
      setTopic('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitted(true);

    const fullContext = [
      committee && `Committee: ${committee}.`,
      briefMode && `Generate a quick update instead of a formal speech.`,
      context
    ].filter(Boolean).join(' ').trim();

    try {
      // This is the call to your original general knowledge AI
      const response = await fetch('http://localhost:5001/api/chat/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, country, type, committee, context: fullContext }),
      });

      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      setOutput(data.speech);
    } catch (error) {
      console.error('Fetch error:', error);
      setOutput('Sorry, something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => setSubmitted(false);
  const handleReset = () => {
    setCountry('');
    setCommittee('');
    setTopic('');
    setType('');
    setContext('');
    setBriefMode(false);
    setSelectedEventId('');
    setOutput('');
    setSubmitted(false);
  };
  const handleProfile = () => router.push('/profile');
  const handleLogin = () => router.push('/auth');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="world-map-background">
          <div className="map-image-container">
            <img 
              src="/images/world-map.jpg" 
              alt="World Map Background"
              className="world-map-image"
            />
          </div>
          <div className="color-overlay"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-silver/20 border-t-silver rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-silver/80 text-lg">Loading Speech Architect...</p>
          <p className="text-silver/60 text-sm mt-2">Preparing your diplomatic tools</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* World Map Background */}
      <div className="world-map-background">
        <div className="map-image-container">
          <img 
            src="/images/world-map.jpg" 
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

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-silver/20 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <div className="logo-container">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/e/ee/UN_emblem_blue.svg"
                alt="DiploMate"
                width={40}
                height={40}
                className="logo-image"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-silver">DiploMate</h1>
              <p className="text-sm text-silver/70">Speech Architect</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-medium transition-all duration-200 shadow-lg text-sm flex items-center gap-2 backdrop-blur-sm border border-gray-500/30"
            >
              🏠 Home
            </button>
            <button
              onClick={() => router.push('/events')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg text-sm flex items-center gap-2 backdrop-blur-sm border border-blue-500/30"
            >
              🏛️ Events
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg text-sm flex items-center gap-2 backdrop-blur-sm border border-green-500/30"
            >
              👤 Profile
            </button>
            {username && (
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {username.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 pt-24 sm:pt-28 pb-8 px-3 sm:px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-silver mb-4">Speech Architect</h1>
            <p className="text-lg text-silver/80 max-w-2xl mx-auto">
              Craft compelling diplomatic speeches with AI-powered assistance tailored to your delegation and committee.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Form Panel */}
            <div className="diplomatic-card bg-slate-800/90 backdrop-blur-lg border border-silver/20 rounded-2xl sm:rounded-3xl shadow-xl h-fit">
              <div className="p-6 sm:p-8">
                <div className="border-b border-silver/20 pb-4 mb-6">
                  <h2 className="text-xl sm:text-2xl font-semibold text-silver mb-2">
                    {output ? 'Edit Speech Parameters' : 'Generate Your Speech'}
                  </h2>
                  <p className="text-sm sm:text-base text-silver/70">
                    {output ? 'Modify settings and generate new content' : 'Fill in the details below to create your diplomatic response'}
                  </p>
                </div>
                
                <MUNForm
                  country={country} setCountry={setCountry}
                  committee={committee} setCommittee={setCommittee}
                  topic={topic} setTopic={setTopic}
                  type={type} setType={setType}
                  context={context} setContext={setContext}
                  isBriefMode={briefMode} setIsBriefMode={setBriefMode}
                  submitted={submitted}
                  isLoading={isLoading}
                  handleSubmit={handleSubmit}
                  delegations={delegations}
                  selectedEventId={selectedEventId}
                  onEventSelect={handleEventSelect}
                />
              </div>
            </div>

            {/* Output Panel */}
            <div className="transition-all duration-700 ease-in-out">
              {output ? (
                <MUNOutput 
                  output={output} 
                  handleBack={handleBack}
                  country={country}
                  topic={topic}
                  type={type}
                  eventId={selectedEventId}
                />
              ) : (
                <div className="diplomatic-card bg-slate-800/90 backdrop-blur-lg border border-silver/20 rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-900/50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                      📝
                    </div>
                    <h3 className="text-2xl font-bold text-silver mb-4">Why Choose DiploMate?</h3>
                    <div className="space-y-4 text-left">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-900/50 rounded-full flex items-center justify-center text-green-400 mt-1 flex-shrink-0 border border-green-400/30">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-semibold text-silver mb-1">AI-Powered Intelligence</h4>
                          <p className="text-silver/70 text-sm">Generate sophisticated speeches tailored to your specific committee and delegation needs.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-900/50 rounded-full flex items-center justify-center text-blue-400 mt-1 flex-shrink-0 border border-blue-400/30">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-semibold text-silver mb-1">Event Integration</h4>
                          <p className="text-silver/70 text-sm">Seamlessly connect with your MUN events to auto-fill delegation details and maintain consistency.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-900/50 rounded-full flex items-center justify-center text-purple-400 mt-1 flex-shrink-0 border border-purple-400/30">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-semibold text-silver mb-1">Professional Output</h4>
                          <p className="text-silver/70 text-sm">Generate formal diplomatic statements, resolutions, and position papers with proper formatting.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-orange-900/50 rounded-full flex items-center justify-center text-orange-400 mt-1 flex-shrink-0 border border-orange-400/30">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-semibold text-silver mb-1">Save & Manage</h4>
                          <p className="text-silver/70 text-sm">Store your speeches in your profile for easy access and build a comprehensive diplomatic portfolio.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 p-4 bg-blue-900/30 rounded-xl border border-blue-400/20 backdrop-blur-sm">
                      <p className="text-sm text-blue-300 font-medium">💡 Pro Tip</p>
                      <p className="text-sm text-blue-200/80 mt-1">Select an event from your active delegations to automatically populate country and committee information!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {output && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-medium transition-all duration-200 shadow-lg flex items-center gap-2 justify-center backdrop-blur-sm border border-gray-500/30"
              >
                🔄 Reset Form
              </button>
              <button
                onClick={handleProfile}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg flex items-center gap-2 justify-center backdrop-blur-sm border border-green-500/30"
              >
                💾 View Saved Speeches
              </button>
            </div>
          )}
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

        .silver {
          color: #c0c0c0;
        }

        .text-silver {
          color: #c0c0c0;
        }

        .text-silver\/80 {
          color: rgba(192, 192, 192, 0.8);
        }

        .text-silver\/70 {
          color: rgba(192, 192, 192, 0.7);
        }

        .text-silver\/60 {
          color: rgba(192, 192, 192, 0.6);
        }

        .text-silver\/20 {
          color: rgba(192, 192, 192, 0.2);
        }

        .border-silver\/20 {
          border-color: rgba(192, 192, 192, 0.2);
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
}
