'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from "react-markdown";

interface Speech {
  _id: string;
  content: string;
  topic: string;
  country: string;
  createdAt: string;
}

const SpeechDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const speechId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [speech, setSpeech] = useState<Speech | null>(null);
  const [username, setUsername] = useState('');
  const [copying, setCopying] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    router.push('/auth');
  }, [router]);

  const copyToClipboard = async () => {
    if (!speech) return;
    
    setCopying(true);
    try {
      await navigator.clipboard.writeText(speech.content);
      alert('Speech copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy text:', error);
      alert('Failed to copy speech');
    } finally {
      setCopying(false);
    }
  };

  const handleDeleteSpeech = async () => {
    if (!speech) return;
    
    if (!confirm('Are you sure you want to delete this speech? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await fetch(`http://localhost:5001/api/users/speeches/${speechId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        router.push('/profile');
      } else {
        alert('Failed to delete speech');
      }
    } catch (error) {
      console.error('Error deleting speech:', error);
      alert('Error deleting speech');
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const fetchSpeech = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/auth');
        return;
      }

      const userData = localStorage.getItem('user');
      if (userData) {
        setUsername(JSON.parse(userData).username || 'User');
      }

      try {
        const response = await fetch('http://localhost:5001/api/users/speeches', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
          if (response.status === 400 || response.status === 401) handleLogout();
          throw new Error('Failed to fetch speeches');
        }
        
        const speeches: Speech[] = await response.json();
        const foundSpeech = speeches.find(s => s._id === speechId);
        
        if (foundSpeech) {
          setSpeech(foundSpeech);
        } else {
          setError('Speech not found');
        }
      } catch (error) {
        console.error(error);
        setError('Failed to load speech');
      } finally {
        setLoading(false);
      }
    };

    fetchSpeech();
  }, [speechId, router, handleLogout]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
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
        <div className="diplomatic-card bg-slate-800/90 backdrop-blur-lg border border-silver/20 rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 relative z-10">
          <div className="animate-pulse">
            <div className="h-8 bg-silver/20 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-silver/20 rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-silver/20 rounded"></div>
              <div className="h-4 bg-silver/20 rounded w-5/6"></div>
              <div className="h-4 bg-silver/20 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !speech) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
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
        <div className="diplomatic-card bg-slate-800/90 backdrop-blur-lg border border-silver/20 rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center relative z-10">
          <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-400/30">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-silver mb-2">Speech Not Found</h2>
          <p className="text-silver/70 mb-6">{error || 'The speech you are looking for does not exist.'}</p>
          <button 
            onClick={() => router.push('/profile')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm border border-blue-500/30"
          >
            Back to Profile
          </button>
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

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-silver/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
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
                  Speech Detail
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/profile')}
                className="px-4 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-medium transition-all duration-200 shadow-lg text-sm sm:text-base flex items-center gap-2 backdrop-blur-sm border border-gray-500/30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Profile</span>
              </button>
              
              <button
                onClick={() => router.push('/speech')}
                className="px-4 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg text-sm sm:text-base flex items-center gap-2 backdrop-blur-sm border border-green-500/30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">New Speech</span>
              </button>
              
              <div className="flex items-center gap-2 text-sm text-silver/70">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">Hi, {username}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg text-sm sm:text-base flex items-center gap-2 backdrop-blur-sm border border-red-500/30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 pt-24 sm:pt-28 pb-8 px-3 sm:px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Speech Header */}
          <div className="diplomatic-card bg-slate-800/90 backdrop-blur-lg border border-silver/20 rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-silver mb-4">{speech.topic}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900/50 text-blue-300 border border-blue-400/30">
                    {speech.country}
                  </span>
                  <span className="text-sm text-silver/60">
                    Created: {new Date(speech.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-silver/70">
                  <span>{speech.content.split(' ').length} words</span>
                  <span>•</span>
                  <span>{speech.content.length} characters</span>
                  <span>•</span>
                  <span>~{Math.ceil(speech.content.split(' ').length / 150)} min read</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-silver/20">
              <button
                onClick={copyToClipboard}
                disabled={copying}
                className="diplomatic-action-btn flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg disabled:opacity-50 backdrop-blur-sm border border-blue-500/30"
              >
                {copying ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
                <span>{copying ? 'Copying...' : 'Copy Speech'}</span>
              </button>
              
              <button
                onClick={handleDeleteSpeech}
                disabled={deleting}
                className="diplomatic-action-btn flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg disabled:opacity-50 backdrop-blur-sm border border-red-500/30"
              >
                {deleting ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
                <span>{deleting ? 'Deleting...' : 'Delete Speech'}</span>
              </button>
            </div>
          </div>

          {/* Speech Content */}
          <div className="diplomatic-card bg-slate-800/90 backdrop-blur-lg border border-silver/20 rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8">
            <div className="border-b border-silver/20 pb-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-silver mb-2">Speech Content</h2>
              <p className="text-sm sm:text-base text-silver/70">Full diplomatic response</p>
            </div>
            
            <div className="prose prose-lg max-w-none prose-invert">
              <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-silver/10">
                <div className="text-silver/90 leading-relaxed whitespace-pre-wrap text-base sm:text-lg">
                  <ReactMarkdown 
                    components={{
                      h1: ({children}) => <h1 className="text-silver font-bold text-2xl mb-4">{children}</h1>,
                      h2: ({children}) => <h2 className="text-silver font-bold text-xl mb-3">{children}</h2>,
                      h3: ({children}) => <h3 className="text-silver font-semibold text-lg mb-2">{children}</h3>,
                      p: ({children}) => <p className="text-silver/90 mb-4 leading-relaxed">{children}</p>,
                      strong: ({children}) => <strong className="text-silver font-semibold">{children}</strong>,
                      em: ({children}) => <em className="text-silver/80 italic">{children}</em>,
                      ul: ({children}) => <ul className="text-silver/90 list-disc list-inside mb-4 space-y-2">{children}</ul>,
                      ol: ({children}) => <ol className="text-silver/90 list-decimal list-inside mb-4 space-y-2">{children}</ol>,
                      li: ({children}) => <li className="text-silver/90">{children}</li>,
                      blockquote: ({children}) => (
                        <blockquote className="border-l-4 border-silver/30 pl-4 italic text-silver/80 bg-slate-800/50 py-3 rounded-r-lg my-4">
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {speech.content}
                  </ReactMarkdown>
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

        .diplomatic-action-btn:hover {
          transform: translateY(-1px);
        }

        .text-silver {
          color: #c0c0c0;
        }

        .text-silver\/90 {
          color: rgba(192, 192, 192, 0.9);
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

        .border-silver\/20 {
          border-color: rgba(192, 192, 192, 0.2);
        }

        .border-silver\/10 {
          border-color: rgba(192, 192, 192, 0.1);
        }

        .bg-silver\/20 {
          background-color: rgba(192, 192, 192, 0.2);
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

export default SpeechDetailPage;
