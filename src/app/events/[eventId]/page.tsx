'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { isAuthenticated } from '@/utils/auth';
import SourceManager from '@/components/events/SourceManager';
import ChatInterface from '@/components/events/ChatInterface';
import EventContext from '@/components/events/EventContext';
import Image from 'next/image';


interface Delegate {
  _id: string;
  country: string;
  userId: {
    _id: string;
    username: string;
  };
  // ... any other delegate fields
}
export default function EventWorkspace() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId;
  
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [delegates, setDelegates] = useState([]);
  const [event, setEvent] = useState(null);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    router.push('/auth');
  }, [router]);

  // Replace the existing useEffect in your EventWorkspace component

  useEffect(() => {
  const fetchEventData = async () => {
    if (!isAuthenticated()) {
      router.push('/auth');
      return;
    }

    const userData = localStorage.getItem('user');
    setUsername(userData ? JSON.parse(userData).username : 'User');

    if (eventId) {
      const token = localStorage.getItem('authToken');
      try {
        const response = await fetch(`http://localhost:5001/api/events/${eventId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const { event, delegates } = await response.json();
          setEvent(event);
          setDelegates(delegates);
        } else {
          // Handle errors like 403 Forbidden or 404 Not Found
          console.error("Failed to fetch event data, status:", response.status);
          setEvent(null); // Set event to null to show the "Not Found" page
        }
      } catch (error) {
        console.error("API call failed:", error);
      }
    }
    setLoading(false);
  };

  fetchEventData();
}, [router, eventId]);
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event workspace...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/events')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }
  console.log("Rendering Workspace. Event:", event, "Delegates:", delegates);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-4">
        <div className="max-w-full mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/e/ee/UN_emblem_blue.svg"
              alt="DiploMate"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-lg font-bold text-gray-900">{event.eventName}</h1>
              <p className="text-sm text-gray-600">Event Workspace</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/events')}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors shadow-lg text-sm flex items-center gap-2"
            >
              ← Back to Events
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors shadow-lg text-sm flex items-center gap-2"
            >
              🏠 Home
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {username.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Workspace */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Column - Source Manager */}
        <div className="w-1/5 bg-white border-r border-gray-200 overflow-hidden">
          <SourceManager eventId={eventId} />
        </div>

        {/* Center Column - Chat Interface */}
        <div className="w-11/20 flex flex-col">
          <ChatInterface eventId={eventId} eventName={event.eventName} />
        </div>

        {/* Right Column - Event Context */}
        <div className="w-1/4 bg-white border-l border-gray-200 overflow-hidden">
          <EventContext event={event} delegates={delegates} />
        </div>
      </div>
    </div>
  );
}
