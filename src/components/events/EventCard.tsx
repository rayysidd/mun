'use client';

import Link from 'next/link';

// The StopCircleIcon component is now defined as an inline SVG to remove the dependency.
const StopCircleIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default function EventCard({ event, onLeave }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLeaveClick = (e) => {
    // Prevent the Link from navigating when the button is clicked
    e.preventDefault();
    e.stopPropagation();
    onLeave();
  };

  return (
    // The Link component now wraps the main div
    <Link href={`/events/${event.id}`} className="block">
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 overflow-hidden group">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
          <h3 className="text-lg font-bold mb-2 line-clamp-2">{event.name}</h3>
          <div className="flex items-center gap-2 text-blue-100">
            <span className="text-sm">📅</span>
            <span className="text-sm">{formatDate(event.date)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 h-16">
            {event.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">👥</span>
              <span className="text-sm text-gray-700">
                {/* This will show '0 participants' for now. A backend change is needed for the real count. */}
                {event.participants} participants
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-blue-600 group-hover:text-blue-700 transition-colors">
              <span className="text-sm font-medium">Open</span>
              <span className="text-sm">→</span>
            </div>
          </div>
        </div>

        {/* Footer with actions */}
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 flex justify-between items-center">
          <div className="flex gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✓ Active
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              📚 Knowledge Base
            </span>
          </div>
          
          {/* Leave Event Button */}
          <button
            onClick={handleLeaveClick}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md p-1 transition-colors"
            title="Leave Event"
          >
            <StopCircleIcon className="h-4 w-4" />
            Leave
          </button>
        </div>
      </div>
    </Link>
  );
}
