'use client';

import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from "react-markdown";

interface MUNOutputProps {
  output: string;
  handleBack: () => void;
  country: string;
  topic: string;
  type: string;
}

export default function MUNOutput({ output, handleBack, country, topic, type }: MUNOutputProps) {
  const outputRef = useRef<HTMLDivElement>(null);
  // FIX: Re-added the 'copied' state to be used with the new copy button.
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.focus();
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Hide "Copied!" message after 2 seconds
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

  const handleSave = async () =>{
    const token = localStorage.getItem('authToken');
    if(!token){
      alert('You need to be logged in to save speeches');
      return;
    }

    try{
      const response = await fetch('https://mun-1igc.onrender.com/api/users/save',{
        method :'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({content: output,topic:topic,country:country}),
      });
      if (!response.ok) throw new Error('Failed to save speech');

      // FIX: Removed the unused 'data' variable.
      await response.json(); 
      alert('Speech saved successfully!');
    }catch(err){
      console.error('Error saving speech:', err);
      alert('Error saving speech. Try again later.');
    }
  };
  return (
    <div className="flex-1 ml-0 sm:ml-8 mt-6 sm:mt-0 flex flex-col animate-in slide-in-from-right duration-500">
      {/* Header */}
      <div className="bg-white rounded-t-2xl px-4 py-4 sm:px-8 sm:py-6 border-b border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
              🏛️ Generated Response
            </h2>
            <div className="flex flex-wrap items-center gap-2 sm:space-x-4 mt-2 text-xs sm:text-sm text-gray-600">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 sm:px-3 rounded-full font-medium">
                {country}
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 sm:px-3 rounded-full font-medium">
                {type}
              </span>
            </div>
          </div>
          <div className="flex space-x-2 sm:space-x-3">
            
            {/* NEW: Added a Copy button */}
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md text-xs sm:text-sm"
            >
              <span>{copied ? '✅ Copied!' : '📋 Copy'}</span>
            </button>
            
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md text-xs sm:text-sm"
            >
              <span>💾</span>
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={handleSave}
              className="flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md text-xs sm:text-sm"
            >
              <span>💾</span>
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        ref={outputRef}
        tabIndex={-1}
        className="bg-amber-50 flex-1 p-4 sm:p-8 rounded-b-2xl shadow-lg overflow-auto max-h-[50vh] sm:max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        aria-label="MUN Research Output"
      >
        <div className="prose prose-sm sm:prose-lg max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-sm sm:text-base">
            <ReactMarkdown>{output}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:scale-105 text-sm sm:text-base"
        >
          <span>←</span>
          <span>Back to Edit</span>
        </button>
        
        <div className="text-xs sm:text-sm text-gray-500 flex items-center space-x-2">
          <span>📊</span>
          <span>{output.split(' ').length} words</span>
          <span>•</span>
          <span>{output.split('\n').length} lines</span>
        </div>
      </div>
    </div>
  );
}
