'use client';

import { useState } from 'react';

// The component now accepts 'event' and 'delegates' as props
export default function EventContext({ event, delegates }) {
  const [activeTab, setActiveTab] = useState('overview');

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // A fallback in case the props are not yet loaded
  if (!event || !delegates) {
    return (
        <div className="p-4">
            <p className="text-sm text-gray-500">Loading context...</p>
        </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Event Context</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('participants')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'participants'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Participants
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div>
              {/* CORRECTED: Using eventName and agenda from the event object */}
              <h3 className="font-semibold text-gray-900 mb-2">{event.eventName}</h3>
              <p className="text-sm text-gray-600 mb-3">{event.agenda}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">📅</span>
                  {/* CORRECTED: Using createdAt from the event object */}
                  <span className="text-sm text-gray-700">{formatDate(event.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">👥</span>
                  {/* CORRECTED: Using the length of the delegates array */}
                  <span className="text-sm text-gray-700">{delegates.length} participants</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="font-medium text-blue-900 mb-2">🎯 Quick Stats</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Knowledge Sources:</span>
                  <span className="text-blue-900 font-medium">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Chat Messages:</span>
                  <span className="text-blue-900 font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Last Activity:</span>
                  <span className="text-blue-900 font-medium">2 min ago</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-3">
              <h4 className="font-medium text-green-900 mb-2">💡 AI Insights</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Strong consensus on climate action</li>
                <li>• Economic development priorities</li>
                <li>• Regional cooperation opportunities</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'participants' && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Participating Delegations</h3>
            <div className="space-y-2">
              {/* CORRECTED: Mapping over the delegates array */}
              {delegates.map((delegate) => (
                <div
                  key={delegate._id} // Using the unique delegate ID as the key
                  className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {/* Displaying first 2 letters of the country */}
                    {delegate.country.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    {/* Displaying country and username from the populated delegate object */}
                    <p className="font-medium text-gray-900 text-sm">{delegate.country}</p>
                    <p className="text-xs text-gray-500">{delegate.userId.username}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-3 mt-4">
              <h4 className="font-medium text-yellow-900 mb-2">🤝 Collaboration Tips</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Build coalitions with like-minded countries</li>
                <li>• Consider regional bloc positions</li>
                <li>• Identify potential opposition early</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
