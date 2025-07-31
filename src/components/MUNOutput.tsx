'use client';

import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from "react-markdown";

interface MUNOutputProps {
  output: string;
  handleBack: () => void;
  country: string;
  topic: string;
  type: string;
  eventId: string;
}

export default function MUNOutput({ output, handleBack, country, topic, type, eventId }: MUNOutputProps) {
  const outputRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.focus();
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([output], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${country}_${type.replace(/\s+/g, '_')}_${topic.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You need to be logged in to save speeches');
      return;
    }

    if (!eventId) {
      alert('This speech is not associated with an event and cannot be saved.');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('http://localhost:5001/api/users/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: output,
          topic: topic,
          country: country,
          eventId: eventId 
        }),
      });
      
      if (!response.ok) throw new Error('Failed to save speech');

      await response.json(); 
      alert('Speech saved successfully!');
    } catch (err) {
      console.error('Error saving speech:', err);
      alert('Error saving speech. Try again later.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 ml-0 sm:ml-8 mt-6 sm:mt-0 flex flex-col animate-in slide-in-from-right duration-500">
      {/* Header */}
      <div className="diplomatic-card bg-slate-800/90 backdrop-blur-lg rounded-t-2xl px-4 py-4 sm:px-8 sm:py-6 border-b border-silver/20 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-silver flex items-center gap-2">
              🏛️ Generated Response
            </h2>
            <div className="flex flex-wrap items-center gap-2 sm:space-x-4 mt-3 text-xs sm:text-sm">
              <span className="bg-blue-900/50 text-blue-300 px-2 py-1 sm:px-3 rounded-full font-medium border border-blue-400/30">
                {country}
              </span>
              <span className="bg-green-900/50 text-green-300 px-2 py-1 sm:px-3 rounded-full font-medium border border-green-400/30">
                {type}
              </span>
            </div>
          </div>
          <div className="flex space-x-2 sm:space-x-3">
            <button 
              onClick={handleCopy} 
              className="diplomatic-action-btn flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 bg-slate-700/90 hover:bg-slate-600/90 text-silver rounded-xl font-medium text-xs sm:text-sm border border-silver/20 transition-all duration-200"
            >
              <span>{copied ? '✅' : '📋'}</span>
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button 
              onClick={handleDownload} 
              className="diplomatic-action-btn flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 bg-indigo-900/50 hover:bg-indigo-800/50 text-indigo-300 rounded-xl font-medium text-xs sm:text-sm border border-indigo-400/30 transition-all duration-200"
            >
              <span>💾</span>
              <span className="hidden sm:inline">Download</span>
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="diplomatic-action-btn flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 bg-teal-900/50 hover:bg-teal-800/50 text-teal-300 rounded-xl font-medium text-xs sm:text-sm border border-teal-400/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-3 h-3 border border-teal-300 border-t-transparent rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span className="hidden sm:inline">Save</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Output Content */}
      <div 
        ref={outputRef} 
        tabIndex={-1} 
        className="diplomatic-card bg-slate-700/90 backdrop-blur-lg flex-1 p-4 sm:p-8 rounded-b-2xl shadow-xl overflow-auto max-h-[50vh] sm:max-h-[70vh] border border-silver/20 border-t-0"
      >
        <div className="prose prose-sm sm:prose-lg max-w-none prose-invert">
          <div className="whitespace-pre-wrap text-silver/90 leading-relaxed text-sm sm:text-base">
            <ReactMarkdown 
              components={{
                h1: ({children}) => <h1 className="text-silver font-bold text-xl mb-4">{children}</h1>,
                h2: ({children}) => <h2 className="text-silver font-bold text-lg mb-3">{children}</h2>,
                h3: ({children}) => <h3 className="text-silver font-semibold text-base mb-2">{children}</h3>,
                p: ({children}) => <p className="text-silver/90 mb-3 leading-relaxed">{children}</p>,
                strong: ({children}) => <strong className="text-silver font-semibold">{children}</strong>,
                em: ({children}) => <em className="text-silver/80 italic">{children}</em>,
                ul: ({children}) => <ul className="text-silver/90 list-disc list-inside mb-3 space-y-1">{children}</ul>,
                ol: ({children}) => <ol className="text-silver/90 list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                li: ({children}) => <li className="text-silver/90">{children}</li>,
                blockquote: ({children}) => (
                  <blockquote className="border-l-4 border-silver/30 pl-4 italic text-silver/80 bg-slate-800/50 py-2 rounded-r-lg my-4">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {output}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <button 
          onClick={handleBack} 
          className="diplomatic-action-btn flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 bg-slate-700/90 hover:bg-slate-600/90 text-silver rounded-xl font-medium border border-silver/20 transition-all duration-200"
        >
          <span>←</span>
          <span>Back to Edit</span>
        </button>
        <div className="text-xs sm:text-sm text-silver/60 flex items-center space-x-3 bg-slate-800/50 px-3 py-2 rounded-lg border border-silver/10">
          <div className="flex items-center space-x-1">
            <span>📊</span>
            <span>{output.split(' ').length} words</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <span>📝</span>
            <span>{output.split('\n').length} lines</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .diplomatic-card {
          background: linear-gradient(135deg, 
            rgba(30, 41, 59, 0.95) 0%, 
            rgba(51, 65, 85, 0.9) 50%, 
            rgba(30, 41, 59, 0.95) 100%
          );
        }

        .diplomatic-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #c0c0c0, #e6e6e6, #c0c0c0);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .diplomatic-card:hover::before {
          transform: scaleX(1);
        }

        .diplomatic-action-btn:hover {
          transform: translateY(-1px);
        }

        .text-silver {
          color: #c0c0c0;
        }

        .text-silver\/90 {
          color: rgba(192, 192, 192, 0.9);
        }

        .text-silver\/80 {
          color: rgba(192, 192, 192, 0.8);
        }

        .text-silver\/60 {
          color: rgba(192, 192, 192, 0.6);
        }

        .border-silver\/20 {
          border-color: rgba(192, 192, 192, 0.2);
        }

        .border-silver\/10 {
          border-color: rgba(192, 192, 192, 0.1);
        }
      `}</style>
    </div>
  );
}
