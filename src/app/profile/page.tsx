'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

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
  const [selectedSpeechId, setSelectedSpeechId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'topic' | 'country'>('date');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    router.push('/auth');
  }, [router]);

  const handleCardClick = (speechId: string) => {
    if (selectedSpeechId === speechId) {
      setSelectedSpeechId(null);
    } else {
      setSelectedSpeechId(speechId);
    }
  };

  const handleDeleteSpeech = async (speechId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card from expanding
    
    if (!confirm('Are you sure you want to delete this speech?')) {
      return;
    }

    setDeletingId(speechId);
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await fetch(`https://mun-1igc.onrender.com/api/users/speeches/${speechId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setSpeeches(speeches.filter(speech => speech._id !== speechId));
        if (selectedSpeechId === speechId) {
          setSelectedSpeechId(null);
        }
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

  const copyToClipboard = async (text: string) => {
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
      if (!token) {
        router.push('/auth');
        return;
      }
      const userData = localStorage.getItem('user');
      if (userData) {
        setUsername(JSON.parse(userData).username || 'User');
      }
      try {
        const response = await fetch('https://mun-1igc.onrender.com/api/users/speeches', {
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
  }, [router, handleLogout]);

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
      <div className="max-w-6xl mx-auto">
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

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Your Saved Speeches</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => router.push('/')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                <span>New Speech</span>
              </button>
            </div>
          </div>

          {speeches.length > 0 && (
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search speeches by topic, country, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'topic' | 'country')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date">Date</option>
                  <option value="topic">Topic</option>
                  <option value="country">Country</option>
                </select>
              </div>
            </div>
          )}
          
          {filteredAndSortedSpeeches.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedSpeeches.map((speech) => (
                <div
                  key={speech._id}
                  className={`border border-gray-200 rounded-xl p-6 transition-all duration-300 cursor-pointer hover:shadow-lg hover:border-blue-500 ${
                    selectedSpeechId === speech._id ? 'ring-2 ring-blue-500 shadow-lg' : ''
                  }`}
                  onClick={() => handleCardClick(speech._id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-2 text-lg line-clamp-2">{speech.topic}</h3>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {speech.country}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(speech.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-3">{speech.content}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(speech.content);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                        title="Copy speech"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => handleDeleteSpeech(speech._id, e)}
                        disabled={deletingId === speech._id}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200 disabled:opacity-50"
                        title="Delete speech"
                      >
                        {deletingId === speech._id ? (
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                      <div className="text-gray-400">
                        <svg className={`w-4 h-4 transition-transform duration-300 ${selectedSpeechId === speech._id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {selectedSpeechId === speech._id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Full Speech Content:</h4>
                        <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">{speech.content}</p>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Created: {new Date(speech.createdAt).toLocaleString()}</span>
                        <span>{speech.content.length} characters</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : speeches.length > 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No speeches found</h3>
              <p className="text-gray-600 mb-6">
                No speeches match your search criteria. Try adjusting your search terms.
              </p>
              <button 
                onClick={() => setSearchTerm('')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
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