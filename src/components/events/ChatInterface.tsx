'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';

interface Message {
  _id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

interface ChatInterfaceProps {
  eventId: string;
  eventName: string;
  userCountry?: string;
  eventCommittee: string;
  eventAgenda: string;
  selectedSources: string[];
}

export default function ChatInterface({
  eventId,
  eventName,
  userCountry,
  eventCommittee,
  eventAgenda,
  selectedSources
}: ChatInterfaceProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useRAG, setUseRAG] = useState(true);
  const [savingSourceIndex, setSavingSourceIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [inputMessage]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      _id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      
      const response = await fetch(`${apiBaseUrl}/api/events/${eventId}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query_text: inputMessage,
          use_rag: useRAG,
          selected_sources: selectedSources
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = {
          _id: (Date.now() + 1).toString(),
          content: data.final_answer,
          sender: 'ai',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        _id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAsSource = async (aiContent: string, messageIndex: number) => {
    setSavingSourceIndex(messageIndex);
    let userQuery = 'AI Response';
    
    for (let i = messageIndex - 1; i >= 0; i--) {
        if (messages[i].sender === 'user') {
            userQuery = `AI Response to: "${messages[i].content.substring(0, 40)}..."`;
            break;
        }
    }
    
    try {
        const token = localStorage.getItem('authToken');
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

        const response = await fetch(`${apiBaseUrl}/api/events/${eventId}/sources`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: userQuery,
                content: aiContent,
                type: 'text',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save source');
        }
        console.log('Source saved successfully!');

    } catch (error) {
        console.error('Error saving source:', error);
    } finally {
        setSavingSourceIndex(null);
    }
  };

  const isLikelySpeech = (content: string): boolean => {
    return content.split(' ').length > 50;
  };

  const generateSpeech = (content: string) => {
    const params = new URLSearchParams({
      eventId,
      country: userCountry || '',
      committee: eventCommittee,
      topic: eventAgenda,
      content,
      type: 'debate speech'
    });
    router.push(`/speech?${params.toString()}`);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-800/50 text-silver">
      {/* Header */}
      <div className="p-4 border-b border-silver/20">
        <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
        {userCountry && (
          <p className="text-sm text-silver/70 mt-1">
            Representing: <span className="text-blue-300 font-medium">{userCountry}</span>
          </p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-silver mb-2">Start Your Diplomatic Consultation</h4>
            <p className="max-w-md mx-auto text-silver/60">
              Ask me anything about {eventName}, get help with position papers, or discuss negotiation strategies.
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message._id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    // CHANGE: Updated AI message bubble style
                    : 'bg-blue-950/60 backdrop-blur-sm border border-blue-800/40 text-silver'
                }`}
              >
                {message.sender === 'ai' ? (
                  <div>
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({children}) => <p className="text-silver/90 mb-2 last:mb-0">{children}</p>,
                          strong: ({children}) => <strong className="text-silver font-semibold">{children}</strong>,
                          ul: ({children}) => <ul className="text-silver/90 list-disc list-inside space-y-1">{children}</ul>,
                          ol: ({children}) => <ol className="text-silver/90 list-decimal list-inside space-y-1">{children}</ol>
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        {isLikelySpeech(message.content) && (
                          <button
                            onClick={() => generateSpeech(message.content)}
                            className="text-xs px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                          >
                            Generate Speech
                          </button>
                        )}
                        <button
                          onClick={() => handleSaveAsSource(message.content, index)}
                          disabled={savingSourceIndex === index}
                          className="text-xs px-3 py-1 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {savingSourceIndex === index ? 'Saving...' : '💾 Save as Source'}
                        </button>
                      </div>
                      <span className="text-xs text-silver/50">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-white">{message.content}</p>
                    <span className="text-xs mt-2 block text-blue-200/75">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            {/* CHANGE: Updated loading indicator style */}
            <div className="bg-blue-950/60 backdrop-blur-sm border border-blue-800/40 rounded-2xl px-4 py-3 shadow-md">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-silver/60 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-silver/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-silver/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm text-silver/60">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-silver/20 bg-slate-800/80">
        <div className="flex items-center justify-end mb-3">
            <label className="flex items-center gap-2 text-sm text-silver/70 cursor-pointer">
              <input
                type="checkbox"
                checked={useRAG}
                onChange={(e) => setUseRAG(e.target.checked)}
                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500/50"
              />
              Use Knowledge Base {selectedSources.length > 0 ? `(${selectedSources.length} selected)` : ''}
            </label>
        </div>
        <div className="flex gap-3">
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about diplomatic strategies, committee procedures, or request assistance..."
            // CHANGE: Updated textarea style
            className="flex-1 rounded-xl px-4 py-3 bg-slate-900/70 border border-silver/20 text-silver placeholder-silver/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg self-end ${
              !inputMessage.trim() || isLoading
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}