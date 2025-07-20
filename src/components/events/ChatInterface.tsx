'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ChatInterface({ eventId, eventName }) {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: `Welcome to the **${eventName}** workspace! I'm your AI assistant, ready to help you with research, speech writing, and strategic planning. How can I assist you today?`
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [currentMessage]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentMessage.trim() || isLoading) return;

    const userMessage = currentMessage.trim();
    setCurrentMessage('');
    setIsLoading(true);

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    // Mock AI response
    setTimeout(() => {
      const aiResponse = generateMockResponse(userMessage);
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
      setIsLoading(false);
    }, 1500);
  };

  const generateMockResponse = (userMessage) => {
    const responses = [
      `Based on the knowledge base for **${eventName}**, here's what I found relevant to your query about "${userMessage}":

## Key Points:
- **Diplomatic Position**: Your country's stance aligns with international frameworks
- **Supporting Evidence**: Multiple sources from our knowledge base support this approach
- **Strategic Recommendations**: Consider emphasizing multilateral cooperation

Would you like me to help you draft a formal statement or position paper on this topic?`,
      
      `Great question! Let me analyze this in the context of **${eventName}**:

### Analysis:
1. **Historical Context**: Previous resolutions and precedents
2. **Current Situation**: Latest developments and stakeholder positions
3. **Strategic Options**: Potential diplomatic approaches

### Recommendations:
- Focus on **consensus-building** language
- Reference **relevant UN frameworks**
- Consider **regional partnerships**

How would you like to proceed with this information?`,
      
      `I've processed your request using the event's knowledge base. Here's a comprehensive response:

## Executive Summary
Your query touches on several key areas that are central to this MUN simulation.

## Detailed Analysis
- **Legal Framework**: UN Charter provisions and relevant treaties
- **Precedent Cases**: Historical examples and outcomes
- **Current Dynamics**: Stakeholder positions and interests

## Next Steps
I can help you:
1. Draft a position paper
2. Prepare talking points
3. Develop negotiation strategies

What would be most helpful for your delegation?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">AI Assistant</h2>
        <p className="text-sm text-gray-600">Context-aware MUN guidance</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl px-4 py-3 rounded-xl ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.role === 'ai' ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm">{message.content}</p>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-3 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <textarea
            ref={textareaRef}
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about your MUN event..."
            className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
            rows="1"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!currentMessage.trim() || isLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <span>🚀</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
