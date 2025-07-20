'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from "react-markdown";
import EventCard from '@/components/events/EventCard'; // <-- Import reusable card
import { isAuthenticated } from '@/utils/auth'; // Assuming you have this helper

interface Speech {
  _id: string;
  content: string;
  topic: string;
  country: string;
  createdAt: string;
}

// Interface for the data returned by the /api/events/ endpoint
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

  // NEW: State for delegations, replacing the hardcoded events
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
        // Fetch both speeches and events in parallel for efficiency
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
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-pulse text-center">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 relative overflow-hidden pb-32">
      {/* Navigation bar & background */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex gap-3 items-center">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/e/ee/UN_emblem_blue.svg"
              alt="DiploMate Logo"
              width={40}
              height={40}
              className="object-contain w-8 h-8"
            />
            <div>
              <h1 className="text-xl font-bold font-unifraktur text-gray-800">DiploMate</h1>
              <p className="text-sm text-gray-500">AI MUN Assistant</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => router.push('/')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm shadow"
            >
              New Speech
            </button>
            <span className="text-gray-600 text-sm hidden sm:block">Hi, {username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm shadow"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Welcome back, {username}!</h2>
          {/* Corrected to use delegations.length */}
          <p className="text-gray-600">You have saved {speeches.length} speeches and {delegations.length} events.</p>
        </div>

        

        {/* EVENTS SECTION */}
        <section>
          <div className="mb-6 border-b pb-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-1">Your MUN Events</h3>
            <p className="text-sm text-gray-600">Manage your in-progress conferences</p>
          </div>

          {delegations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Corrected to map over delegations */}
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
                  // You might need an onLeave handler here if EventCard supports it
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No events created or joined yet.</p>
              <button
                onClick={() => router.push('/events')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg"
              >
                Go to Events
              </button>
            </div>
          )}
        </section>

        {/* Speeches */}
        <section className="mb-12 mt-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800">Your Saved Speeches</h3>
              <p className="text-sm text-gray-600">Search and manage your diplomatic statements</p>
            </div>
            {speeches.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
                <input
                  type="text"
                  className="w-full sm:w-56 px-4 py-2 border border-gray-300 rounded-xl"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'topic' | 'country')}
                  className="px-3 py-2 border border-gray-300 rounded-xl"
                >
                  <option value="date">Date</option>
                  <option value="topic">Topic</option>
                  <option value="country">Country</option>
                </select>
              </div>
            )}
          </div>

          {/* Render speeches */}
          {filteredAndSortedSpeeches.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
              {filteredAndSortedSpeeches.map((speech) => (
                <div
                  key={speech._id}
                  onClick={() => handleViewSpeech(speech._id)}
                  className="bg-white border border-gray-100 shadow hover:shadow-md rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <h4 className="text-md font-semibold text-gray-800 mb-1">{speech.topic}</h4>
                  <div className="text-xs text-gray-500 mb-2">
                    <span>{speech.country} • </span>
                    <span>{new Date(speech.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm text-gray-700 line-clamp-3">
                    <ReactMarkdown>{speech.content}</ReactMarkdown>
                  </div>
                  <div className="flex mt-4 items-center gap-3 text-sm text-gray-500">
                    <button
                      onClick={(e) => copyToClipboard(speech.content, e)}
                      className="hover:text-blue-600"
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={(e) => handleDeleteSpeech(speech._id, e)}
                      className="hover:text-red-600"
                    >
                      ❌ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm mt-4">No saved speeches yet.</p>
          )}
        </section>
        
      </main>
    </div>
  );
};

export default ProfilePage;
