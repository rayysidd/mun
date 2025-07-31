'use client';

import React, { useState } from 'react';

// Define the interface for the delegation data
interface Delegation {
  _id: string;
  eventId: {
    _id: string;
    eventName: string;
    committee: string;
    agenda: string;
  };
  country: string;
}

interface MUNFormProps {
  country: string;
  setCountry: React.Dispatch<React.SetStateAction<string>>;
  committee: string;
  setCommittee: React.Dispatch<React.SetStateAction<string>>;
  topic: string;
  setTopic: React.Dispatch<React.SetStateAction<string>>;
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
  context: string;
  setContext: React.Dispatch<React.SetStateAction<string>>;
  isBriefMode: boolean;
  setIsBriefMode: React.Dispatch<React.SetStateAction<boolean>>;
  submitted: boolean;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  delegations: Delegation[];
  selectedEventId: string;
  onEventSelect: (eventId: string) => void;
}

export default function MUNForm({
  country, setCountry,
  committee, setCommittee,
  topic, setTopic,
  type, setType,
  context, setContext,
  isBriefMode, setIsBriefMode,
  submitted, isLoading,
  handleSubmit,
  delegations,
  selectedEventId,
  onEventSelect,
}: MUNFormProps) {

  // A separate loading state for the "Find Context" button
  const [isFindingContext, setIsFindingContext] = useState(false);

  // The handler for the "Find Context with AI" button
  const handleFindContext = async () => {
    if (!selectedEventId) {
      alert("Please select an event first to search its knowledge base.");
      return;
    }
    const query = prompt("What information are you looking for to add as context?");
    if (!query || !query.trim()) {
      return;
    }
    
    setIsFindingContext(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5001/api/events/${selectedEventId}/query`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              query_text: query,
              use_rag: true,
          }),
      });

      const data = await response.json();
      if (response.ok) {
          const aiContext = `\n\n--- AI-Generated Context for "${query}" ---\n${data.final_answer}`;
          setContext(prevContext => prevContext + aiContext);
      } else {
          alert(`AI Error: ${data.error || data.detail}`);
      }
    } catch (error) {
        console.error("Failed to fetch context from AI:", error);
        alert("An error occurred while fetching context.");
    } finally {
        setIsFindingContext(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 sm:space-y-5 bg-slate-800/90 backdrop-blur-lg p-6 border border-silver/20 rounded-2xl shadow-xl"
    >
      {/* Event Selector Dropdown */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-silver">
          Select an Event (Optional)
        </label>
        <select
          value={selectedEventId}
          onChange={(e) => onEventSelect(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-slate-700/90 border border-silver/20 rounded-xl text-silver focus:border-silver/40 focus:outline-none focus:ring-2 focus:ring-silver/10 backdrop-blur-lg"
          disabled={submitted || isLoading}
        >
          <option value="" className="bg-slate-700 text-silver">-- Select an Event to Autofill --</option>
          {delegations.map((delegation) => (
            <option key={delegation.eventId._id} value={delegation.eventId._id} className="bg-slate-700 text-silver">
              {delegation.eventId.eventName}
            </option>
          ))}
        </select>
      </div>
      
      {/* Country and Committee Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Country */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-silver">
            Country <span className="text-red-400">*</span>
          </label>
          <input
            type="text" 
            value={country} 
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-700/90 border border-silver/20 rounded-xl text-silver placeholder-silver/50 focus:border-silver/40 focus:outline-none focus:ring-2 focus:ring-silver/10 backdrop-blur-lg"
            placeholder="e.g., United States" 
            required 
            disabled={submitted || isLoading}
          />
        </div>

        {/* Committee */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-silver">
            Committee
          </label>
          <input
            type="text" 
            value={committee} 
            onChange={(e) => setCommittee(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-700/90 border border-silver/20 rounded-xl text-silver placeholder-silver/50 focus:border-silver/40 focus:outline-none focus:ring-2 focus:ring-silver/10 backdrop-blur-lg"
            placeholder="e.g., UNSC" 
            disabled={submitted || isLoading}
          />
        </div>
      </div>

      {/* Topic */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-silver">
          Topic <span className="text-red-400">*</span>
        </label>
        <input
          type="text" 
          value={topic} 
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-slate-700/90 border border-silver/20 rounded-xl text-silver placeholder-silver/50 focus:border-silver/40 focus:outline-none focus:ring-2 focus:ring-silver/10 backdrop-blur-lg"
          placeholder="e.g., Climate Change" 
          required 
          disabled={submitted || isLoading}
        />
      </div>

      {/* Content Type */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-silver">
          Content Type <span className="text-red-400">*</span>
        </label>
        <select
          value={type} 
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-slate-700/90 border border-silver/20 rounded-xl text-silver focus:border-silver/40 focus:outline-none focus:ring-2 focus:ring-silver/10 backdrop-blur-lg"
          required 
          disabled={submitted || isLoading}
        >
          <option value="" className="bg-slate-700 text-silver">Select Content type...</option>
          <option value="opening statement" className="bg-slate-700 text-silver">🎤 Opening Statement</option>
          <option value="position paper" className="bg-slate-700 text-silver">📄 Position Paper</option>
          <option value="debate speech" className="bg-slate-700 text-silver">💬 Debate Speech</option>
          <option value="closing remarks" className="bg-slate-700 text-silver">🎯 Closing Remarks</option>
          <option value="amendment proposal" className="bg-slate-700 text-silver">✏️ Amendment Proposal</option>
          <option value="point of information" className="bg-slate-700 text-silver">❓ Point of Information</option>
        </select>
      </div>

      {/* Context */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-semibold text-silver">
            Additional Context
          </label>
          <button
            type="button"
            onClick={handleFindContext}
            disabled={!selectedEventId || isLoading || isFindingContext}
            className="text-xs text-blue-400 font-semibold hover:text-blue-300 disabled:text-silver/40 disabled:no-underline transition-colors px-2 py-1 rounded-lg hover:bg-blue-900/20"
          >
            {isFindingContext ? (
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </div>
            ) : (
              'Find Context with AI'
            )}
          </button>
        </div>
        <textarea
          value={context} 
          onChange={(e) => setContext(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-slate-700/90 border border-silver/20 rounded-xl text-silver placeholder-silver/50 focus:border-silver/40 focus:outline-none focus:ring-2 focus:ring-silver/10 backdrop-blur-lg resize-y"
          placeholder="Provide specific points, or use the AI to find context from your event's knowledge base..."
          rows={3} 
          disabled={submitted || isLoading}
        />
      </div>
      
      {/* Brief Mode */}
      <label className="flex items-center gap-3 mt-4 p-3 rounded-xl bg-slate-700/50 border border-silver/10 cursor-pointer hover:bg-slate-700/70 transition-colors">
        <input
          type="checkbox"
          checked={isBriefMode}
          onChange={() => setIsBriefMode(!isBriefMode)}
          disabled={submitted || isLoading}
          className="w-4 h-4 text-blue-600 bg-slate-600 border-silver/30 rounded focus:ring-blue-500 focus:ring-2"
        />
        <span className="text-sm text-silver/90">Generate quick update instead of formal speech</span>
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 sm:py-4 sm:px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg text-sm sm:text-base backdrop-blur-sm border border-blue-500/30"
        disabled={submitted || isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Generating Response...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <span>🎭</span>
            <span>Generate Diplomatic Response</span>
          </div>
        )}
      </button>

      <style jsx>{`
        .text-silver {
          color: #c0c0c0;
        }

        .text-silver\/90 {
          color: rgba(192, 192, 192, 0.9);
        }

        .text-silver\/50 {
          color: rgba(192, 192, 192, 0.5);
        }

        .text-silver\/40 {
          color: rgba(192, 192, 192, 0.4);
        }

        .border-silver\/40 {
          border-color: rgba(192, 192, 192, 0.4);
        }

        .border-silver\/20 {
          border-color: rgba(192, 192, 192, 0.2);
        }

        .border-silver\/10 {
          border-color: rgba(192, 192, 192, 0.1);
        }

        .placeholder-silver\/50::placeholder {
          color: rgba(192, 192, 192, 0.5);
        }

        .focus\\:ring-silver\\/10:focus {
          --tw-ring-color: rgba(192, 192, 192, 0.1);
        }
      `}</style>
    </form>
  );
}
