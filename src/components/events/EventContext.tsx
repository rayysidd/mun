'use client';

interface EventDetails {
  _id: string;
  eventName: string;
  committee: string;
  agenda: string;
  createdAt: string;
}

interface Delegate {
  _id: string;
  country: string;
  userId: {
    _id: string;
    username: string;
  };
}

interface EventContextProps {
  event: EventDetails;
  delegates: Delegate[];
}

export default function EventContext({ event, delegates }: EventContextProps) {
  return (
    <div className="h-full flex flex-col bg-slate-800/50 text-silver">
      {/* Header */}
      <div className="p-4 border-b border-blue-900/50">
        <h3 className="text-lg font-semibold text-white mb-1">Event Context</h3>
        <p className="text-sm text-white">Committee information and participants</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Event Details */}
        <div className="p-4 border-b border-silver/20">
          <h4 className="text-sm font-semibold text-white mb-3">Event Details</h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs uppercase tracking-wide text-white">Committee</label>
              <p className="text-sm mt-1 font-medium text-white">{event.committee}</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-white">Agenda</label>
              <p className="text-sm mt-1 leading-relaxed text-white">{event.agenda}</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-white">Created</label>
              <p className="text-sm mt-1 text-white">
                {new Date(event.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Delegates */}
        <div className="p-4">
          <h4 className="text-sm font-semibold text-white mb-3">
            Delegates ({delegates.length})
          </h4>
          {delegates.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-lg bg-slate-600/50 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-sm text-white">No other delegates yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {delegates.map((delegate) => (
                <div
                  key={delegate._id}
                  // FIX: Applied the new dark blue card style here
                  className="flex items-center gap-3 p-3 rounded-lg bg-blue-950/60 backdrop-blur-sm border border-blue-800/40 hover:border-blue-700/60 transition-colors shadow-md"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {delegate.userId.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {delegate.userId.username}
                    </p>
                    <p className="text-xs font-medium text-white">
                      {delegate.country}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="p-4 mt-auto border-t border-silver/20 bg-slate-800/80">
          <h4 className="text-sm font-semibold text-white mb-3">Quick Actions</h4>
          <div className="space-y-2">
            {/* FIX: Applied the new dark blue card style to these buttons */}
            <button className="w-full text-left p-3 rounded-lg bg-blue-950/60 backdrop-blur-sm border border-blue-800/40 hover:border-blue-700/60 transition-colors shadow-md text-sm text-white">
              📋 View Committee Rules
            </button>
            <button className="w-full text-left p-3 rounded-lg bg-blue-950/60 backdrop-blur-sm border border-blue-800/40 hover:border-blue-700/60 transition-colors shadow-md text-sm text-white">
              🌍 Country Information
            </button>
            <button className="w-full text-left p-3 rounded-lg bg-blue-950/60 backdrop-blur-sm border border-blue-800/40 hover:border-blue-700/60 transition-colors shadow-md text-sm text-white">
              📊 Voting Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}