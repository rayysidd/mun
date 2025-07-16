'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// NEW: Define a TypeScript interface for the Speech object for type safety.
interface Speech {
  _id: string;
  content: string;
  createdAt: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  
  // NEW: State to hold the array of fetched speeches. This replaces the old 'speechCount' state.
  const [speeches, setSpeeches] = useState<Speech[]>([]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    router.push('/auth');
  };

  useEffect(() => {
    // UPDATED: The logic is wrapped in an async function to allow for fetching.
    const fetchProfileData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/auth');
        return; // Exit early if no token
      }

      // Set username from localStorage (this part is the same)
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUsername(parsedUser.username || 'User');
      }

      // NEW: Fetch the user's speeches from the backend API.
      try {
        const response = await fetch('http://localhost:5001/api/users/speeches', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          // If the token is invalid or expired, log the user out.
          if (response.status === 400 || response.status === 401) {
            handleLogout();
          }
          throw new Error('Failed to fetch speeches');
        }

        const speechesData: Speech[] = await response.json();
        setSpeeches(speechesData); // Store the fetched speeches in state.

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Stop loading once data is fetched or an error occurs.
      }
    };

    fetchProfileData();
  }, [router]);

  // The loading skeleton remains the same and is perfectly fine.
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
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {username.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Welcome back, {username}!
              </h1>
               {/* UPDATED: Displaying speech count dynamically from the fetched data's length */}
              <p className="text-gray-600">You have saved {speeches.length} speeches.</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
              >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Speeches Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Saved Speeches</h2>
            <button onClick={() => router.push('/')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Speech</span>
            </button>
          </div>
          
          {/* UPDATED: Logic to render fetched speeches or the 'No speeches' message */}
          {speeches.length > 0 ? (
            <div className="space-y-4">
              {/* NEW: Mapping over the speeches array to render each one dynamically */}
              {speeches.map((speech) => (
                <div key={speech._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      {/* Displaying a snippet of the actual speech content */}
                      <p className="text-gray-800 text-base mb-2 line-clamp-3">
                        {speech.content}
                      </p>
                      {/* Formatting the creation date for readability */}
                      <p className="text-gray-500 text-sm">
                        Saved on: {new Date(speech.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {/* The delete button is here for UI, but functionality is not implemented yet */}
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-red-600 transition-colors" title="Delete (functionality not implemented)">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // This part for when there are no speeches remains the same and works perfectly.
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