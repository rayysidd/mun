'use client';

import React from 'react';

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
}

export default function MUNForm({
  country,
  setCountry,
  committee,
  setCommittee,
  topic,
  setTopic,
  type,
  setType,
  context,
  setContext,
  isBriefMode,
  setIsBriefMode,
  submitted,
  isLoading,
  handleSubmit,
}: MUNFormProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 sm:space-y-5 bg-stone-100 p-6 border border-gray-200 rounded-md shadow-sm"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Country */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-gray-900 focus:outline-none placeholder-gray-400"
            placeholder="e.g., United States, Germany, Japan"
            required
            disabled={submitted || isLoading}
          />
        </div>

        {/* Committee */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Committee
          </label>
          <input
            type="text"
            value={committee}
            onChange={(e) => setCommittee(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-gray-900 focus:outline-none placeholder-gray-400"
            placeholder="e.g., UNSC, General Assembly"
            disabled={submitted || isLoading}
          />
        </div>
      </div>

      {/* Topic */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Topic <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-gray-900 focus:outline-none placeholder-gray-400"
          placeholder="e.g., Climate Change, Nuclear Disarmament, Human Rights"
          required
          disabled={submitted || isLoading}
        />
      </div>

      {/* Type */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Content Type <span className="text-red-500">*</span>
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-gray-900 focus:outline-none placeholder-gray-400"
          required
          disabled={submitted || isLoading}
        >
          <option value="">Select Content type...</option>
          <option value="opening statement">🎤 Opening Statement</option>
          <option value="position paper">📄 Position Paper</option>
          <option value="debate speech">💬 Debate Speech</option>
          <option value="closing remarks">🎯 Closing Remarks</option>
          <option value="amendment proposal">✏️ Amendment Proposal</option>
          <option value="point of information">❓ Point of Information</option>
        </select>
      </div>

      {/* Brief Mode */}
      <label className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          checked={isBriefMode}
          onChange={() => setIsBriefMode(!isBriefMode)}
          disabled={submitted || isLoading}
        />
        <span className="text-sm">Generate quick update instead of formal speech</span>
      </label>

      {/* Context */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Additional Context
        </label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-gray-900 focus:outline-none placeholder-gray-400 resize-none"
          placeholder="Provide any additional context, background information, or specific points you want to address..."
          rows={3}
          disabled={submitted || isLoading}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full relative overflow-hidden bg-[#154360] text-white py-3 px-4 sm:py-4 sm:px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg text-sm sm:text-base"
        disabled={submitted || isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Generating Response...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <span>Generate Diplomatic Response</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
      </button>
    </form>
  );
}
