'use client';

import { useState, useEffect, useCallback } from 'react';

// Define the TypeScript interface for a Source object
interface Source {
  _id: string;
  title: string;
  content: string; // This will hold the URL
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export default function SourceManager({ eventId }) {
  const [sources, setSources] = useState<Source[]>([]);
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceTitle, setNewSourceTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const fetchSources = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`http://localhost:5001/api/events/${eventId}/sources`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSources(data);
      } else {
        console.error('Failed to fetch sources');
      }
    } catch (error) {
      console.error('Error fetching sources:', error);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  const handleAddSource = async () => {
    if (!newSourceUrl.trim() || !newSourceTitle.trim()) {
      alert('Please provide both a title and a URL.');
      return;
    }
    
    setIsAdding(true);
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await fetch(`http://localhost:5001/api/events/${eventId}/sources`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newSourceTitle,
          content: newSourceUrl,
          type: 'url', // Explicitly set the type
        }),
      });

      if (response.ok) {
        setNewSourceUrl('');
        setNewSourceTitle('');
        await fetchSources(); // Re-fetch sources to update the list
      } else {
        const errorData = await response.json();
        alert(`Failed to add source: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error adding source:', error);
      alert('An error occurred while adding the source.');
    } finally {
      setIsAdding(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'processing':
      case 'pending':
        return '⏳';
      case 'failed':
        return '❌';
      default:
        return '📄';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'processing':
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Knowledge Base</h2>
        <p className="text-sm text-gray-600">Add URLs for the AI to learn from.</p>
      </div>

      {/* Sources List */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <p className="text-sm text-gray-500">Loading sources...</p>
        ) : (
          <div className="space-y-3">
            {sources.map((source) => (
              <div
                key={source._id}
                className="bg-white rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0 mt-0.5">
                    {getStatusIcon(source.status)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate text-sm">
                      {source.title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {source.content}
                    </p>
                    <span className={`text-xs font-medium ${getStatusColor(source.status)} mt-1 inline-block`}>
                      {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {sources.length === 0 && (
              <div className="text-center py-8">
                  <p className="text-sm text-gray-500">No sources added yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Add a URL below to get started.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Source Form */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="space-y-2">
           <input
            type="text"
            value={newSourceTitle}
            onChange={(e) => setNewSourceTitle(e.target.value)}
            placeholder="Source Title (e.g., UN Charter)"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
            disabled={isAdding}
          />
          <input
            type="url"
            value={newSourceUrl}
            onChange={(e) => setNewSourceUrl(e.target.value)}
            placeholder="Paste URL here..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
            disabled={isAdding}
          />
          <button
            onClick={handleAddSource}
            disabled={!newSourceUrl.trim() || !newSourceTitle.trim() || isAdding}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-md font-medium transition-colors text-sm flex items-center justify-center gap-2"
          >
            {isAdding ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Adding...
              </>
            ) : (
              <>
                <span>➕</span>
                Add Source
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
