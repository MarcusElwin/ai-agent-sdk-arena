import React, { useState, useEffect, useRef } from 'react';
import { ApiResponse, Framework } from '../types';

interface ChatBoxProps {
  framework: Framework;
  loading: boolean;
  itinerary: ApiResponse | null;
  error: string | null;
}

type MessageType = 'user' | 'assistant' | 'system';

interface Message {
  id: string;
  type: MessageType;
  content: string | React.ReactNode;
  timestamp: Date;
}

const ChatBox: React.FC<ChatBoxProps> = ({ framework, loading, itinerary, error }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to AI Travel Planner! Fill out the form on the left to generate a travel plan or ask questions here.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const getFrameworkName = (framework: Framework): string => {
    switch (framework) {
      case 'pydantic-ai':
        return 'Pydantic AI';
      case 'openai-agents':
        return 'OpenAI Agents SDK';
      case 'mastra-ai':
        return 'Mastra AI';
    }
  };

  const getBadgeClass = (framework: Framework): string => {
    switch (framework) {
      case 'pydantic-ai':
        return 'badge-pydantic';
      case 'openai-agents':
        return 'badge-openai';
      case 'mastra-ai':
        return 'badge-mastra';
    }
  };

  // When itinerary changes, add a message with the results
  useEffect(() => {
    if (itinerary) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: (
          <div className="space-y-2">
            <p>I've created a travel plan for {itinerary.destination}!</p>
            <p>Your {itinerary.dates.end ? `${getDaysBetween(itinerary.dates.start, itinerary.dates.end)}-day` : ''} trip includes:</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
              <li>Flights with {itinerary.transportation.outbound.airline}</li>
              <li>Stay at {itinerary.accommodation.name}</li>
              <li>{itinerary.activities.activities?.length || 0} activities planned</li>
            </ul>
            <p>Total budget: ${formatNumber(itinerary.budget.total)} • Estimated cost: ${formatNumber(itinerary.budget.spent)}</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>See the full details in the itinerary below</p>
          </div>
        ),
        timestamp: new Date(),
      }]);
    }
  }, [itinerary]);

  // When there's an error, add an error message
  useEffect(() => {
    if (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'system',
        content: `Error: ${error}`,
        timestamp: new Date(),
      }]);
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "Please use the form to plan your trip. Once you submit the form, I'll create a detailed travel itinerary for you.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  function getDaysBetween(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  function formatNumber(num: number): string {
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }

  return (
    <div className="sleek-card chat-container" style={{ height: '100%' }}>
      <div className="sleek-card-header flex items-center justify-between">
        <div>AI Assistant</div>
        <div className={`framework-badge ${getBadgeClass(framework)} selected`}>
          {getFrameworkName(framework)}
        </div>
      </div>
      <div className="chat-messages" style={{ overflowY: 'auto', height: 'calc(100% - 124px)', padding: '1rem' }}>
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`chat-message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div 
              className={`message-bubble ${
                message.type === 'user' 
                  ? 'user-bubble' 
                  : message.type === 'system' 
                  ? 'system-bubble' 
                  : 'bot-bubble'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-message bot-message">
            <div className="message-bubble bot-bubble">
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <span style={{ marginLeft: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Creating your travel plan...
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-container" style={{ 
        padding: '16px', 
        borderTop: '1px solid var(--border-subtle)', 
        background: 'var(--bg-card)',
        height: '74px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <form onSubmit={handleSubmit} className="chat-form" style={{ width: '100%' }}>
          <input
            type="text"
            placeholder="Ask a question about your trip plan..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="form-input"
            style={{ height: '42px' }}
            disabled={loading}
          />
          <button 
            type="submit" 
            className="primary-button" 
            style={{ width: 'auto', height: '42px' }}
            disabled={loading || input.trim() === ''}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;