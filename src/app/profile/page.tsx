'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from "react-markdown";
import EventCard from '@/components/events/EventCard';
import { isAuthenticated } from '@/utils/auth';

interface Speech {
  _id: string;
  content: string;
  topic: string;
  country: string;
  createdAt: string;
}

interface Delegation {
  _id: string;
  eventId: {
    _id: string;
    eventName: string;
    committee: string;
    agenda: string;
    createdAt: string;
  };
  country: string;
  userId: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'topic' | 'country'>('date');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [delegations, setDelegations] = useState<Delegation[]>([]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    router.push('/auth');
  }, [router]);

  const handleViewSpeech = (speechId: string) => {
    router.push(`/speech/${speechId}`);
  };

  const handleDeleteSpeech = async (speechId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this speech?')) return;

    setDeletingId(speechId);
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`http://localhost:5001/api/users/speeches/${speechId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setSpeeches(speeches.filter(speech => speech._id !== speechId));
      } else {
        alert('Failed to delete speech');
      }
    } catch (error) {
      console.error('Error deleting speech:', error);
      alert('Error deleting speech');
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = async (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      alert('Speech copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy text:', error);
      alert('Failed to copy speech');
    }
  };

  const filteredAndSortedSpeeches = speeches
    .filter(speech =>
      speech.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      speech.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      speech.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'topic':
          return a.topic.localeCompare(b.topic);
        case 'country':
          return a.country.localeCompare(b.country);
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token || !isAuthenticated()) {
        router.push('/auth');
        return;
      }
      
      const userData = localStorage.getItem('user');
      if (userData) {
        setUsername(JSON.parse(userData).username || 'User');
      }

      try {
        const [speechesResponse, eventsResponse] = await Promise.all([
          fetch('http://localhost:5001/api/users/speeches', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:5001/api/events', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!speechesResponse.ok || !eventsResponse.ok) {
          if (speechesResponse.status === 401 || eventsResponse.status === 401) {
            handleLogout();
          }
          throw new Error('Failed to fetch profile data');
        }

        const speechesData: Speech[] = await speechesResponse.json();
        const delegationsData: Delegation[] = await eventsResponse.json();
        
        setSpeeches(speechesData);
        setDelegations(delegationsData);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [router, handleLogout]);

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
          <div className="diplomatic-loader mb-6">
            <div className="w-16 h-16 border-4 border-silver/20 border-t-silver rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="text-silver/80 text-lg">Loading your diplomatic profile...</p>
          <p className="text-silver/60 text-sm mt-2">Gathering your speeches and delegations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden pb-32">
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

      {/* Navigation bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-silver/20 shadow-xl">
  <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
    {/* This entire block is now a button that navigates to the homepage */}
    <div 
      className="flex gap-3 items-center cursor-pointer transition-opacity hover:opacity-80"
      onClick={() => router.push('/')}
    >
      <div className="logo-container">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/e/ee/UN_emblem_blue.svg"
          alt="DiploMate Logo"
          width={40}
          height={40}
          className="logo-image"
        />
      </div>
      <div>
        <h1 className="text-xl font-bold text-silver">DiploMate</h1>
        <p className="text-sm text-silver/70">Diplomatic Atlas</p>
      </div>
    </div>
    <div className="flex gap-4 items-center">
      <button
        onClick={() => router.push('/speech')}
        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-xl text-sm shadow-lg transition-all duration-200 backdrop-blur-sm border border-green-500/30"
      >
        New Speech
      </button>
      <span className="text-silver/80 text-sm hidden sm:block">Hi, {username}</span>
      <button
        onClick={handleLogout}
        className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-2 rounded-xl text-sm shadow-lg transition-all duration-200 backdrop-blur-sm border border-red-500/30"
      >
        Logout
      </button>
    </div>
  </div>
</nav>

      {/* PAGE CONTENT */}
      <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Welcome Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-silver mb-2">Welcome back, {username}!</h2>
          <p className="text-silver/70 text-lg">You have saved {speeches.length} speeches and {delegations.length} events.</p>
        </div>

        
        {/* EVENTS SECTION */}
<section className="mb-12">
  <div className="mb-6 border-b border-silver/20 pb-4">
    <h3 className="text-2xl font-semibold text-silver mb-1">Your MUN Events</h3>
    <p className="text-sm text-silver/70">Manage your in-progress conferences</p>
  </div>

  {delegations.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {delegations.filter(delegation => delegation.eventId).map((delegation) => (
        <div 
          key={delegation._id}
          // Add these two lines to make the event card clickable
          onClick={() => router.push(`/events/${delegation.eventId._id}`)}
          className="diplomatic-card relative bg-slate-800/90 backdrop-blur-lg border border-silver/20 rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 hover:border-silver/40 cursor-pointer"
        >
          <div className="flex items-start justify-between mb-4">
            <h4 className="text-lg font-semibold text-silver">{delegation.eventId.eventName}</h4>
            <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center text-lg">
              🏛️
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="text-sm text-silver/80">
              <span className="text-silver/60">Committee:</span> {delegation.eventId.committee}
            </div>
            <div className="text-sm text-silver/80">
              <span className="text-silver/60">Agenda:</span> {delegation.eventId.agenda}
            </div>
            <div className="text-sm text-silver/80">
              <span className="text-silver/60">Your Country:</span> {delegation.country}
            </div>
          </div>
          
          <div className="text-xs text-silver/60 flex items-center gap-2">
            <span>📅 {new Date(delegation.eventId.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
        🏛️
      </div>
      <p className="text-silver/70 mb-4 text-lg">No events created or joined yet.</p>
      <button
        onClick={() => router.push('/events')}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 backdrop-blur-sm border border-blue-500/30"
      >
        Go to Events
      </button>
    </div>
  )}
</section>

        {/* Speeches Section */}
        <section className="mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-silver">Your Saved Speeches</h3>
              <p className="text-sm text-silver/70">Search and manage your diplomatic statements</p>
            </div>
            {speeches.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
                <input
                  type="text"
                  className="w-full sm:w-56 px-4 py-2 bg-slate-800/90 border border-silver/20 rounded-xl text-silver placeholder-silver/50 backdrop-blur-lg focus:border-silver/40 focus:outline-none"
                  placeholder="Search speeches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'topic' | 'country')}
                  className="px-3 py-2 bg-slate-800/90 border border-silver/20 rounded-xl text-silver backdrop-blur-lg focus:border-silver/40 focus:outline-none"
                >
                  <option value="date">Sort by Date</option>
                  <option value="topic">Sort by Topic</option>
                  <option value="country">Sort by Country</option>
                </select>
              </div>
            )}
          </div>

          {filteredAndSortedSpeeches.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedSpeeches.map((speech) => (
                <div
                  key={speech._id}
                  onClick={() => handleViewSpeech(speech._id)}
                  className="diplomatic-card relative bg-slate-800/90 backdrop-blur-lg border border-silver/20 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-silver/40"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-semibold text-silver leading-tight">{speech.topic}</h4>
                    <div className="flex gap-2 flex-shrink-0 ml-2">
                      <span className="flag-badge bg-blue-900/50 text-silver text-xs px-2 py-1 rounded-lg border border-silver/20">
                        {speech.country}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-silver/60 mb-3 flex items-center gap-2">
                    <span>📅 {new Date(speech.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="text-sm text-silver/80 line-clamp-3 mb-4 prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{speech.content}</ReactMarkdown>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3 text-sm">
                      <button
                        onClick={(e) => copyToClipboard(speech.content, e)}
                        className="diplomatic-action-btn text-silver/70 hover:text-silver transition-colors flex items-center gap-1"
                        disabled={deletingId === speech._id}
                      >
                        📋 Copy
                      </button>
                      <button
                        onClick={(e) => handleDeleteSpeech(speech._id, e)}
                        className="diplomatic-action-btn text-red-400/70 hover:text-red-400 transition-colors flex items-center gap-1"
                        disabled={deletingId === speech._id}
                      >
                        {deletingId === speech._id ? '⏳' : '🗑️'} Delete
                      </button>
                    </div>
                    <div className="text-xs text-silver/50">
                      {speech.content.length} chars
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                🔍
              </div>
              <p className="text-silver/70 text-lg">No speeches found matching "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm('')}
                className="text-silver/60 hover:text-silver text-sm mt-2 transition-colors"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                📝
              </div>
              <p className="text-silver/70 mb-4 text-lg">No saved speeches yet.</p>
              <button
                onClick={() => router.push('/speech')}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 backdrop-blur-sm border border-green-500/30"
              >
                Write Your First Speech
              </button>
            </div>
          )}
        </section>
      </main>

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
        }

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
          height: 2px;
          background: linear-gradient(90deg, #c0c0c0, #e6e6e6, #c0c0c0);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .diplomatic-card:hover::before {
          transform: scaleX(1);
        }

        .diplomatic-stat-card {
          transition: all 0.3s ease;
        }

        .diplomatic-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .diplomatic-action-btn {
          padding: 0.25rem 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
        }

        .diplomatic-action-btn:hover {
          background: rgba(192, 192, 192, 0.1);
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

        .text-silver\/50 {
          color: rgba(192, 192, 192, 0.5);
        }

        .border-silver\/40 {
          border-color: rgba(192, 192, 192, 0.4);
        }

        .border-silver\/20 {
          border-color: rgba(192, 192, 192, 0.2);
        }

        .placeholder-silver\/50::placeholder {
          color: rgba(192, 192, 192, 0.5);
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .diplomatic-card {
            padding: 1.5rem;
          }

          .world-map-image {
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
