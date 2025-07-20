'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/utils/auth';
import EventCard from '@/components/events/EventCard';
import Image from 'next/image';
// Removed unused 'process' import

// This is the correct interface for the data received from the backend
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

export default function EventsPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  // State now correctly holds an array of Delegation objects
  const [delegations, setDelegations] = useState<Delegation[]>([]);
  
  // Create event form
  const [newEventName, setNewEventName] = useState('');
  const [newCommittee, setNewCommittee] = useState('');
  const [newAgenda, setNewAgenda] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [newCountry, setNewCountry] = useState(''); // Added state for country on creation
  const [creating, setCreating] = useState(false);
  
  // Join event form
  const [joinEventName, setJoinEventName] = useState(''); // Correctly using event name to join
  const [joinPasscode, setJoinPasscode] = useState('');
  const [joinCountry, setJoinCountry] = useState('');
  const [joining, setJoining] = useState(false);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setUsername('');
    router.push('/auth');
  }, [router]);

  const fetchUserEvents = useCallback(async () => {
    setEventsLoading(true);
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await fetch('http://localhost:5001/api/events/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const eventsData = await response.json();
        setDelegations(eventsData);
      } else {
        console.error('Failed to fetch events');
        if (response.status === 401) handleLogout();
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setEventsLoading(false);
    }
  }, [handleLogout]);

  const handleCreateEvent = async () => {
    // Added country to validation
    if (!newEventName.trim() || !newCommittee.trim() || !newAgenda.trim() || !newPasscode.trim() || !newCountry.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    setCreating(true);
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await fetch('http://localhost:5001/api/events/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        // Added country to the request body
        body: JSON.stringify({
          eventName: newEventName,
          committee: newCommittee,
          agenda: newAgenda,
          passcode: newPasscode,
          country: newCountry
        })
      });
      
      const data = await response.json();

      if (response.ok) {
        setShowCreateModal(false);
        alert('Event created successfully!');
        fetchUserEvents(); // Refetch events to get the latest list
      } else {
        alert(`Failed to create event: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error creating event');
    } finally {
      setCreating(false);
    }
  };

  const handleJoinEvent = async () => {
    // Corrected validation for join by name
    if (!joinEventName.trim() || !joinPasscode.trim() || !joinCountry.trim()) {
      alert('Please enter Event Name, Passcode, and Country');
      return;
    }
    
    setJoining(true);
    const token = localStorage.getItem('authToken');
    
    try {
      // Corrected endpoint for joining by name
      const response = await fetch(`http://localhost:5001/api/events/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventName: joinEventName,
          passcode: joinPasscode,
          country: joinCountry 
        })
      });
      
      const data = await response.json();

      if (response.ok) {
        setShowJoinModal(false);
        alert('Successfully joined event!');
        fetchUserEvents(); // Refetch events to get the latest list
      } else {
        alert(`Failed to join event: ${data.error}`);
      }
    } catch (error) {
      console.error('Error joining event:', error);
      alert('Error joining event');
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveEvent = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to leave this event?')) return;
    
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await fetch(`http://localhost:5001/api/events/${eventId}/leave`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();

      if (response.ok) {
        alert('Successfully left event');
        // Correctly filter delegations based on the nested eventId
        setDelegations(delegations.filter(del => del.eventId._id !== eventId));
      } else {
        alert(`Failed to leave event: ${data.error}`);
      }
    } catch (error) {
      console.error('Error leaving event:', error);
      alert('Error leaving event');
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.push('/auth');
      } else {
        setIsLoggedIn(true);
        const userData = localStorage.getItem('user');
        try {
          if (userData && userData !== 'undefined') {
            const parsedUser = JSON.parse(userData);
            setUsername(parsedUser.username || 'User');
          } else {
            setUsername('User');
          }
        } catch (error) {
          console.error("Failed to parse user data:", error);
          setUsername('User');
        }
        
        fetchUserEvents();
        setLoading(false);
      }
    };
    checkAuth();
  }, [router, fetchUserEvents]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* ... (rest of the JSX is mostly the same, but with corrected modal fields) ... */}
      <nav className="relative z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/e/ee/UN_emblem_blue.svg"
              alt="DiploMate"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">DiploMate</h1>
              <p className="text-sm text-gray-600">AI-powered MUN assistant</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors shadow-lg text-sm flex items-center gap-2"
            >
              🏠 Home
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors shadow-lg text-sm flex items-center gap-2"
            >
              👤 Profile
            </button>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {username.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your MUN Events</h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage your conferences and build comprehensive knowledge bases
          </p>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3"
            >
              <span className="text-2xl">➕</span>
              Create New Event
            </button>
            
            <button
              onClick={() => setShowJoinModal(true)}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3"
            >
              <span className="text-2xl">🤝</span>
              Join Event
            </button>
          </div>
        </div>

        {eventsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : delegations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {delegations.filter(delegation => delegation.eventId).map((delegation) => (
              <EventCard 
                key={delegation._id} 
                event={{
                  id: delegation.eventId._id,
                  name: delegation.eventId.eventName,
                  date: delegation.eventId.createdAt,
                  participants: 0, // This still needs a backend change to be accurate
                  description: `${delegation.eventId.committee} - ${delegation.eventId.agenda}`,
                }}
                onLeave={() => handleLeaveEvent(delegation.eventId._id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏛️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No events yet</h3>
            <p className="text-gray-500">Create your first MUN event or join an existing one to get started</p>
          </div>
        )}
      </main>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Event</h3>
            <div className="space-y-4">
              <input value={newEventName} onChange={(e) => setNewEventName(e.target.value)} placeholder="Event Name *" className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
              <input value={newCommittee} onChange={(e) => setNewCommittee(e.target.value)} placeholder="Committee *" className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
              <textarea value={newAgenda} onChange={(e) => setNewAgenda(e.target.value)} placeholder="Agenda *" className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={3}/>
              <input value={newCountry} onChange={(e) => setNewCountry(e.target.value)} placeholder="Country you will represent *" className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
              <input type="password" value={newPasscode} onChange={(e) => setNewPasscode(e.target.value)} placeholder="Event Passcode *" className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg">Cancel</button>
              <button onClick={handleCreateEvent} disabled={creating || !newEventName.trim() || !newCommittee.trim() || !newAgenda.trim() || !newPasscode.trim() || !newCountry.trim()} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg">{creating ? 'Creating...' : 'Create Event'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Join Event Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Join Event</h3>
            <div className="space-y-4">
              <input value={joinEventName} onChange={(e) => setJoinEventName(e.target.value)} placeholder="Event Name *" className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
              <input type="password" value={joinPasscode} onChange={(e) => setJoinPasscode(e.target.value)} placeholder="Passcode *" className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
              <input value={joinCountry} onChange={(e) => setJoinCountry(e.target.value)} placeholder="Country you will represent *" className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowJoinModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg">Cancel</button>
              <button onClick={handleJoinEvent} disabled={joining || !joinEventName.trim() || !joinPasscode.trim() || !joinCountry.trim()} className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg">{joining ? 'Joining...' : 'Join Event'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
