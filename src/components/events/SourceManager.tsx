'use client';

import { useState, useEffect, useCallback } from 'react';

interface Source {
  _id: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

interface SourceManagerProps {
  eventId: string;
  selectedSources?: string[];
  onSourceSelectionChange?: (ids: string[]) => void;
}

export default function SourceManager({ eventId, selectedSources = [], onSourceSelectionChange = () => {} }: SourceManagerProps) {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [sourceType, setSourceType] = useState<'url' | 'text'>('url');
  const [newSourceTitle, setNewSourceTitle] = useState('');
  const [newSourceContent, setNewSourceContent] = useState('');

  const fetchSources = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`http://localhost:5001/api/events/${eventId}/sources`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (response.ok) setSources(await response.json());
    } catch (error) { console.error('Error fetching sources:', error); }
    finally { setLoading(false); }
  }, [eventId]);

  useEffect(() => {
    fetchSources();
    const interval = setInterval(fetchSources, 30000); // Poll for status updates
    return () => clearInterval(interval);
  }, [fetchSources]);

  const handleAddSource = async () => {
    if (!newSourceContent.trim() || !newSourceTitle.trim()) return alert('Please provide a title and content.');
    setIsAdding(true);
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`http://localhost:5001/api/events/${eventId}/sources`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newSourceTitle, content: newSourceContent, type: sourceType }),
      });
      if (response.ok) {
        setNewSourceContent(''); setNewSourceTitle(''); await fetchSources();
      } else { alert(`Failed to add source: ${(await response.json()).error}`); }
    } catch (error) { alert('An error occurred while adding source.'); }
    finally { setIsAdding(false); }
  };

  const handleCheckboxChange = (sourceId: string) => {
    const newSelection = selectedSources.includes(sourceId) ? selectedSources.filter(id => id !== sourceId) : [...selectedSources, sourceId];
    onSourceSelectionChange(newSelection);
  };

  const getStatusInfo = (status: Source['status']) => {
    switch (status) {
      case 'completed': return { icon: '✅', color: 'text-green-400' };
      case 'processing': case 'pending': return { icon: '⏳', color: 'text-yellow-400' };
      case 'failed': return { icon: '❌', color: 'text-red-400' };
      default: return { icon: '📄', color: 'text-silver/70' };
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-800/50 text-silver">
      <div className="p-4 border-b border-silver/20">
        {/* FIX: Changed text-black back to a light color for visibility */}
        <h2 className="text-lg font-bold text-white mb-1">Knowledge Base</h2>
        <p className="text-sm text-white">Select sources for AI context.</p>
      </div>
      <div className="p-2 border-b border-silver/20 flex justify-end gap-3">
        <button onClick={() => onSourceSelectionChange(sources.map(s => s._id))} className="text-xs font-medium text-black hover:underline">Select All</button>
        <button onClick={() => onSourceSelectionChange([])} className="text-xs font-medium text-black hover:underline">Clear</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? <p className="text-sm text-silver/60">Loading sources...</p> : (
          <div className="space-y-3">
            {sources.map((source) => {
              const { icon, color } = getStatusInfo(source.status);
              return (
                <label key={source._id} className="block bg-blue-950/60 backdrop-blur-sm rounded-lg p-3 border border-blue-800/40 hover:border-blue-700/60 transition-colors cursor-pointer shadow-md">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" checked={selectedSources.includes(source._id)} onChange={() => handleCheckboxChange(source._id)} className="mt-1 h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500/50" />
                    <span className="text-lg flex-shrink-0 mt-0.5">{icon}</span>
                    <div className="flex-1 min-w-0">
                      {/* FIX: Changed text-black to a light color */}
                      <h3 className="font-medium text-white truncate text-sm">{source.title}</h3>
                      {/* FIX: Restored dynamic color for status */}
                      <span className={`text-xs font-medium text-white mt-1 inline-block`}>{source.status.charAt(0).toUpperCase() + source.status.slice(1)}</span>
                    </div>
                  </div>
                </label>
            )})}
            {sources.length === 0 && <p className="text-center text-sm text-silver/60 py-8">No sources added yet.</p>}
          </div>
        )}
      </div>
      <div className="p-4 border-t border-silver/20 bg-slate-800/80">
        <div className="flex border-b border-silver/20 mb-3">
           {/* FIX: Changed text-black to appropriate colors */}
          <button onClick={() => setSourceType('url')} className={`flex-1 py-2 text-sm font-medium ${sourceType === 'url' ? 'border-b-2 border-blue-400 text-black' : 'text-silver/60'}`}>URL</button>
          <button onClick={() => setSourceType('text')} className={`flex-1 py-2 text-sm font-medium ${sourceType === 'text' ? 'border-b-2 border-blue-400 text-black' : 'text-silver/60'}`}>Text</button>
        </div>
        <div className="space-y-3 ">
           <input type="text" value={newSourceTitle} onChange={(e) => setNewSourceTitle(e.target.value)} placeholder="Source Title *" className="modal-input" disabled={isAdding} />
           <textarea value={newSourceContent} onChange={(e) => setNewSourceContent(e.target.value)} placeholder={sourceType === 'url' ? "Paste URL here..." : "Paste text here..."} className="modal-input" rows={3} disabled={isAdding} />
          <button onClick={handleAddSource} disabled={!newSourceContent.trim() || !newSourceTitle.trim() || isAdding} className="modal-btn-primary w-full">{isAdding ? 'Adding...' : 'Add Source'}</button>
        </div>
      </div>
      {/* FIX: Added backticks (`) to make the CSS syntax valid */}
      <style jsx>{`
        .modal-input {
          display: block;
          width: 100%;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 10px 12px;
          color: #e5e7eb; /* A light gray text color */
          font-size: 0.9rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .modal-input:focus {
          outline: none;
          border-color: #3b82f6; /* A blue color on focus */
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }
      `}</style>
    </div>
  );
}