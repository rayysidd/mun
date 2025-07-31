'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { isAuthenticated } from '@/utils/auth';

// Assuming these components are in the specified paths
import SourceManager from '@/components/events/SourceManager';
import ChatInterface from '@/components/events/ChatInterface';
import EventContext from '@/components/events/EventContext';


interface EventDetails {
  _id: string;
  eventName: string;
  committee: string;
  agenda: string;
  createdAt: string;
}

interface Delegate {
  _id: string;
  country: string;
  userId: {
    _id: string;
    username: string;
  };
}

export default function EventWorkspace() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    router.push('/auth');
  }, [router]);

  useEffect(() => {
    const fetchEventData = async () => {
      const token = localStorage.getItem('authToken');
      if (!isAuthenticated() || !token) {
        router.push('/auth');
        return;
      }
      
      let parsedUser;
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          parsedUser = JSON.parse(userData);
          setUserId(parsedUser?.id || '');
          setUsername(parsedUser?.username || 'User');
        }
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        handleLogout();
      }

      if (eventId) {
        try {
          const response = await fetch(`http://localhost:5001/api/events/${eventId}`, { 
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.status === 401) {
            handleLogout();
            return;
          }
          if (response.ok) {
            const { event, delegates } = await response.json();
            setEvent(event); 
            setDelegates(delegates);
          } else { 
            setEvent(null); 
          }
        } catch (error) { 
          console.error("API call failed:", error);
          setEvent(null);
        }
      }
      setLoading(false);
    };
    fetchEventData();
  }, [router, eventId, handleLogout]);

  const currentUserDelegation = useMemo(() => 
      delegates.find(d => d.userId._id === userId), 
  [delegates, userId]);

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
        <div className="text-center relative z-10">
          <div className="diplomatic-loader mb-6">
            <div className="w-16 h-16 border-4 border-silver/20 border-t-silver rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="text-silver/80 text-lg">Loading Event Workspace...</p>
          <p className="text-silver/60 text-sm mt-2">Preparing the diplomatic floor</p>
        </div>
        <style jsx>{`
            .world-map-background { position: fixed; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: -1; }
            .map-image-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
            .world-map-image { width: 100%; height: 100%; object-fit: cover; object-position: center; opacity: 0.4; filter: contrast(1.2) brightness(0.8); }
            .color-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(12, 22, 49, 0.85) 0%, rgba(26, 47, 92, 0.75) 25%, rgba(43, 74, 138, 0.7) 50%, rgba(26, 47, 92, 0.75) 75%, rgba(12, 22, 49, 0.85) 100%); }
            .text-silver { color: #c0c0c0; }
            .text-silver\/80 { color: rgba(192, 192, 192, 0.8); }
            .text-silver\/60 { color: rgba(192, 192, 192, 0.6); }
            .border-silver { border-color: #c0c0c0; }
            .border-silver\/20 { border-color: rgba(192, 192, 192, 0.2); }
        `}</style>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
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
        <div className="text-center relative z-10">
            <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                🏛️
            </div>
            <h1 className="text-2xl font-bold text-silver mb-2">Event Not Found</h1>
            <p className="text-silver/70 mb-6">The event you are looking for does not exist or you do not have access.</p>
            <button
                onClick={() => router.push('/profile')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 backdrop-blur-sm border border-blue-500/30"
            >
                Back to Profile
            </button>
        </div>
        <style jsx>{`
            .world-map-background { position: fixed; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: -1; }
            .map-image-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
            .world-map-image { width: 100%; height: 100%; object-fit: cover; object-position: center; opacity: 0.4; filter: contrast(1.2) brightness(0.8); }
            .color-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(12, 22, 49, 0.85) 0%, rgba(26, 47, 92, 0.75) 25%, rgba(43, 74, 138, 0.7) 50%, rgba(26, 47, 92, 0.75) 75%, rgba(12, 22, 49, 0.85) 100%); }
            .text-silver { color: #c0c0c0; }
            .text-silver\/70 { color: rgba(192, 192, 192, 0.7); }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 ">
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

      {/* Navigation bar */}
      <nav className="z-10 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shadow-xl">
        <div className="max-w-full mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex gap-3 items-center cursor-pointer" onClick={() => router.push('/profile')}>
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
              <p className="text-sm text-silver/70">Event Workspace</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex gap-4 items-center">
            <button onClick={() => router.push('/profile')} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl text-sm shadow-lg transition-all duration-200 backdrop-blur-sm border border-blue-500/30">Profile</button>
            <button onClick={handleLogout} className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-2 rounded-xl text-sm shadow-lg transition-all duration-200 backdrop-blur-sm border border-red-500/30">Logout</button>
          </div>
            <span className="text-silver/80 text-sm hidden sm:block">Hi, {username}</span>
            
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        <div className="w-1/4 xl:w-1/5 border-r border-silver/10 min-h-0">
          <SourceManager 
            eventId={eventId} 
            selectedSources={selectedSources} 
            onSourceSelectionChange={setSelectedSources}
          />
        </div>
        <div className="w-1/2 xl:w-3/5 flex flex-col min-h-0">
          <ChatInterface 
            eventId={eventId} 
            eventName={event.eventName} 
            userCountry={currentUserDelegation?.country} 
            eventCommittee={event.committee} 
            eventAgenda={event.agenda} 
            selectedSources={selectedSources}
          />
        </div>
        <div className="w-1/4 border-l border-white/10 min-h-0">
          <EventContext 
            event={event} 
            delegates={delegates} 
          />
        </div>
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
        .text-silver { color: #c0c0c0; }
        .text-silver\/80 { color: rgba(192, 192, 192, 0.8); }
        .text-silver\/70 { color: rgba(192, 192, 192, 0.7); }
        .border-silver\/20 { border-color: rgba(192, 192, 192, 0.2); }
        .placeholder-silver\/50::placeholder { color: rgba(192, 192, 192, 0.5); }
      `}</style>
    </div>
  );
}
