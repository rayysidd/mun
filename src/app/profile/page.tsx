'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// UPDATED: The Speech interface now includes topic and country
interface Speech {
  _id: string;
  content: string;
  topic: string;
  country: string;
  createdAt: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  
  // NEW: State to track which card is currently expanded.
  const [selectedSpeechId, setSelectedSpeechId] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    router.push('/auth');
  };

  // NEW: Function to handle clicking on a card.
  const handleCardClick = (speechId: string) => {
    // If the clicked card is already open, close it. Otherwise, open it.
    if (selectedSpeechId === speechId) {
      setSelectedSpeechId(null);
    } else {
      setSelectedSpeechId(speechId);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
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
        const speechesData: Speech[] = await response.json();
        setSpeeches(speechesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-gray-200 h-16 w-16"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, {username}!</h1>
              <p className="text-gray-600">You have saved {speeches.length} speeches.</p>
            </div>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* REWORKED: Recent Speeches Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Saved Speeches</h2>
            <button onClick={() => router.push('/')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg flex items-center space-x-2">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              <span>New Speech</span>
            </button>
          </div>
          
          {speeches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {speeches.map((speech) => (
                <div
                  key={speech._id}
                  className="border border-gray-200 rounded-lg p-4 transition-all duration-300 cursor-pointer hover:shadow-lg hover:border-blue-500"
                  onClick={() => handleCardClick(speech._id)}
                >
                  {/* Card Overview */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">{speech.topic}</h3>
                      <p className="text-gray-600 text-sm mb-2">{speech.country}</p>
                    </div>
                    <div className="text-gray-400 ml-2">
                      {/* Chevron icon indicates expandability */}
                      <svg className={`w-5 h-5 transition-transform duration-300 ${selectedSpeechId === speech._id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Expanded Content View */}
                  {selectedSpeechId === speech._id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-gray-800 text-base whitespace-pre-wrap">{speech.content}</p>
                      <p className="text-gray-500 text-xs mt-4">
                        Saved on: {new Date(speech.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No speeches saved yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Go to the home page to generate and save your first speech. It will appear here once saved.
              </p>
              <button onClick={() => router.push('/')} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg">
                Create Your First Speech
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
