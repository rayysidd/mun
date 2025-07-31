'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/utils/auth';
import Image from 'next/image';

// The interface for the data received from the backend
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
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [delegations, setDelegations] = useState<Delegation[]>([]);
  const [leavingId, setLeavingId] = useState<string | null>(null);

  // Create event form
  const [newEventName, setNewEventName] = useState('');
  const [newCommittee, setNewCommittee] = useState('');
  const [newAgenda, setNewAgenda] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [creating, setCreating] = useState(false);
  
  // Join event form
  const [joinEventName, setJoinEventName] = useState('');
  const [joinPasscode, setJoinPasscode] = useState('');
  const [joinCountry, setJoinCountry] = useState('');
  const [joining, setJoining] = useState(false);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
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
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setEventsLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth');
    } else {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUsername(JSON.parse(userData).username || 'User');
      }
      fetchUserEvents();
      setLoading(false);
    }
  }, [router, fetchUserEvents]);

  const handleCreateEvent = async () => {
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
        body: JSON.stringify({
          eventName: newEventName, committee: newCommittee, agenda: newAgenda, passcode: newPasscode, country: newCountry
        })
      });
      const data = await response.json();
      if (response.ok) {
        setShowCreateModal(false);
        fetchUserEvents();
      } else {
        alert(`Failed to create event: ${data.error}`);
      }
    } catch (error) {
      alert('Error creating event');
    } finally {
      setCreating(false);
    }
  };

  const handleJoinEvent = async () => {
    if (!joinEventName.trim() || !joinPasscode.trim() || !joinCountry.trim()) {
      alert('Please enter Event Name, Passcode, and Country');
      return;
    }
    setJoining(true);
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`http://localhost:5001/api/events/join`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventName: joinEventName, passcode: joinPasscode, country: joinCountry })
      });
      const data = await response.json();
      if (response.ok) {
        setShowJoinModal(false);
        fetchUserEvents();
      } else {
        alert(`Failed to join event: ${data.error}`);
      }
    } catch (error) {
      alert('Error joining event');
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveEvent = async (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to leave this event?')) return;
    setLeavingId(eventId);
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`http://localhost:5001/api/events/${eventId}/leave`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setDelegations(delegations.filter(del => del.eventId._id !== eventId));
      } else {
        alert(`Failed to leave event: ${data.error}`);
      }
    } catch (error) {
      alert('Error leaving event');
    } finally {
      setLeavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        {/* Loading state styled like Profile Page */}
        <div className="world-map-background"><div className="map-image-container"><img src="https://www.georgethegeographer.co.uk/Base_maps/World_b&w_unnamed.jpg" alt="World Map Background" className="world-map-image"/></div><div className="color-overlay"></div></div>
        <div className="text-center relative z-10">
          <div className="diplomatic-loader mb-6"><div className="w-16 h-16 border-4 border-silver/20 border-t-silver rounded-full animate-spin mx-auto"></div></div>
          <p className="text-silver/80 text-lg">Loading your events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden pb-32">
      {/* Background from Profile Page */}
      <div className="world-map-background"><div className="map-image-container"><img src="https://www.georgethegeographer.co.uk/Base_maps/World_b&w_unnamed.jpg" alt="World Map Background" className="world-map-image"/></div><div className="color-overlay"></div></div>
      
      {/* Navigation bar from Profile Page */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-silver/20 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex gap-3 items-center cursor-pointer" onClick={() => router.push('/')}>
            <div className="logo-container"><Image src="https://upload.wikimedia.org/wikipedia/commons/e/ee/UN_emblem_blue.svg" alt="DiploMate Logo" width={40} height={40} className="logo-image"/></div>
            <div><h1 className="text-xl font-bold text-silver">DiploMate</h1><p className="text-sm text-silver/70">Events Hub</p></div>
          </div>
          <div className="flex gap-4 items-center">
            <button onClick={() => router.push('/profile')} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl text-sm shadow-lg transition-all duration-200 backdrop-blur-sm border border-blue-500/30">Profile</button>
            <button onClick={handleLogout} className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-2 rounded-xl text-sm shadow-lg transition-all duration-200 backdrop-blur-sm border border-red-500/30">Logout</button>
          </div>
        </div>
      </nav>

      <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
  <div className="text-center mb-12">
    <h2 className="text-3xl font-bold text-silver mb-2">Your MUN Events</h2>
    <p className="text-silver/70 text-lg mb-8">Manage your conferences and delegations</p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button onClick={() => setShowCreateModal(true)} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 backdrop-blur-sm border border-green-500/30 flex items-center justify-center gap-2">➕ Create Event</button>
      <button onClick={() => setShowJoinModal(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 backdrop-blur-sm border border-blue-500/30 flex items-center justify-center gap-2">🤝 Join Event</button>
    </div>
  </div>
  
  {/* CORRECTED CONDITIONAL RENDERING LOGIC */}
  {eventsLoading ? (
    <div className="text-center py-12">
      <div className="w-12 h-12 border-4 border-silver/20 border-t-silver rounded-full animate-spin mx-auto"></div>
    </div>
  ) : delegations.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {delegations.filter(d => d.eventId).map((delegation) => (
        <div
          key={delegation._id}
          onClick={() => router.push(`/events/${delegation.eventId._id}`)}
          className="diplomatic-card relative bg-slate-800/90 backdrop-blur-lg border border-silver/20 rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 hover:border-silver/40 cursor-pointer"
        >
          <div className="flex items-start justify-between mb-4">
            <h4 className="text-lg font-semibold text-silver flex-1 pr-2">{delegation.eventId.eventName}</h4>
            <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center text-lg flex-shrink-0">🏛️</div>
          </div>
          <div className="space-y-2 mb-4">
            <p className="text-sm text-silver/80"><span className="text-silver/60">Committee:</span> {delegation.eventId.committee}</p>
            <p className="text-sm text-silver/80"><span className="text-silver/60">Agenda:</span> {delegation.eventId.agenda}</p>
            <p className="text-sm text-silver/80 font-semibold"><span className="text-silver/60 font-normal">Your Country:</span> {delegation.country}</p>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-silver/10">
              <span className="text-xs text-silver/60">📅 {new Date(delegation.eventId.createdAt).toLocaleDateString()}</span>
              <button onClick={(e) => handleLeaveEvent(delegation.eventId._id, e)} disabled={leavingId === delegation.eventId._id} className="diplomatic-action-btn text-red-400/70 hover:text-red-400 transition-colors flex items-center gap-1">{leavingId === delegation.eventId._id ? '⏳' : '🗑️'} Leave</button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🏛️</div>
      <p className="text-silver/70 text-lg">No events created or joined yet.</p>
    </div>
  )}
</main>

      {/* MODALS with dark theme */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="diplomatic-card bg-slate-800/95 border border-silver/20 rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-xl font-bold text-silver mb-6">Create New Event</h3>
            <div className="space-y-4">
              <input value={newEventName} onChange={(e) => setNewEventName(e.target.value)} placeholder="Event Name *" className="modal-input" />
              <input value={newCommittee} onChange={(e) => setNewCommittee(e.target.value)} placeholder="Committee *" className="modal-input" />
              <textarea value={newAgenda} onChange={(e) => setNewAgenda(e.target.value)} placeholder="Agenda *" className="modal-input" rows={2}/>
              <input value={newCountry} onChange={(e) => setNewCountry(e.target.value)} placeholder="Country you will represent *" className="modal-input" />
              <input type="password" value={newPasscode} onChange={(e) => setNewPasscode(e.target.value)} placeholder="Event Passcode *" className="modal-input" />
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowCreateModal(false)} className="modal-btn-secondary">Cancel</button>
              <button onClick={handleCreateEvent} disabled={creating || !newEventName || !newCommittee || !newAgenda || !newPasscode || !newCountry} className="modal-btn-primary">{creating ? 'Creating...' : 'Create Event'}</button>
            </div>
          </div>
        </div>
      )}
      {showJoinModal && (
         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="diplomatic-card bg-slate-800/95 border border-silver/20 rounded-2xl p-8 w-full max-w-md">
              <h3 className="text-xl font-bold text-silver mb-6">Join Existing Event</h3>
              <div className="space-y-4">
                <input value={joinEventName} onChange={(e) => setJoinEventName(e.target.value)} placeholder="Event Name *" className="modal-input" />
                <input type="password" value={joinPasscode} onChange={(e) => setJoinPasscode(e.target.value)} placeholder="Passcode *" className="modal-input" />
                <input value={joinCountry} onChange={(e) => setJoinCountry(e.target.value)} placeholder="Country you will represent *" className="modal-input" />
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={() => setShowJoinModal(false)} className="modal-btn-secondary">Cancel</button>
                <button onClick={handleJoinEvent} disabled={joining || !joinEventName || !joinPasscode || !joinCountry} className="modal-btn-primary">{joining ? 'Joining...' : 'Join Event'}</button>
              </div>
            </div>
         </div>
      )}

      {/* Styles from Profile Page */}
      <style jsx>{`
        .world-map-background { position: fixed; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: -1; }
        .map-image-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
        .world-map-image { width: 100%; height: 100%; object-fit: cover; object-position: center; opacity: 0.4; filter: contrast(1.2) brightness(0.8); }
        .color-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(12, 22, 49, 0.85) 0%, rgba(26, 47, 92, 0.75) 25%, rgba(43, 74, 138, 0.7) 50%, rgba(26, 47, 92, 0.75) 75%, rgba(12, 22, 49, 0.85) 100%); }
        .logo-container { padding: 0.5rem; background: linear-gradient(135deg, rgba(192, 192, 192, 0.15), rgba(192, 192, 192, 0.05)); border-radius: 12px; border: 1px solid rgba(192, 192, 192, 0.3); }
        .logo-image { filter: brightness(0) saturate(100%) invert(75%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(1.2) contrast(1); }
        .diplomatic-card { background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 50%, rgba(30, 41, 59, 0.95) 100%); }
        .diplomatic-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #c0c0c0, #e6e6e6, #c0c0c0); transform: scaleX(0); transition: transform 0.3s ease; }
        .diplomatic-card:hover::before { transform: scaleX(1); }
        .diplomatic-action-btn { padding: 0.25rem 0.5rem; border-radius: 0.5rem; transition: all 0.2s ease; }
        .diplomatic-action-btn:hover { background: rgba(192, 192, 192, 0.1); }
        .text-silver { color: #c0c0c0; }
        .text-silver\/80 { color: rgba(192, 192, 192, 0.8); }
        .text-silver\/70 { color: rgba(192, 192, 192, 0.7); }
        .text-silver\/60 { color: rgba(192, 192, 192, 0.6); }
        /* Modal Styles */
        .modal-input {
          width: 100%;
          background: rgba(15, 23, 42, 0.8); /* slate-900 */
          border: 1px solid rgba(192, 192, 192, 0.2); /* border-silver/20 */
          color: rgba(192, 192, 192, 0.8); /* text-silver/80 */
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          transition: border-color 0.2s;
        }
        .modal-input:focus {
          outline: none;
          border-color: rgba(192, 192, 192, 0.4); /* focus:border-silver/40 */
        }
        .modal-btn-primary {
          flex: 1;
          padding: 0.75rem;
          border-radius: 0.5rem;
          background-image: linear-gradient(to right, #2563eb, #4f46e5); /* from-blue-600 to-indigo-600 */
          color: white;
          font-weight: 500;
          transition: all 0.2s;
        }
        .modal-btn-primary:hover {
           background-image: linear-gradient(to right, #1d4ed8, #4338ca); /* hover:from-blue-700 hover:to-indigo-700 */
        }
        .modal-btn-primary:disabled {
          background: rgba(51, 65, 85, 1); /* slate-700 */
          cursor: not-allowed;
          color: rgba(192, 192, 192, 0.5);
        }
        .modal-btn-secondary {
          flex: 1;
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(192, 192, 192, 0.3);
          color: rgba(192, 192, 192, 0.7);
          transition: all 0.2s;
        }
        .modal-btn-secondary:hover {
          background: rgba(192, 192, 192, 0.1);
          color: rgba(192, 192, 192, 0.9);
        }
      `}</style>
    </div>
  );
}