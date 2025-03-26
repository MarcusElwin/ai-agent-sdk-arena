import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Bot, Send } from 'lucide-react';
import { ApiResponse, Framework } from '../types';
import { sendChatMessageWithMastra } from '../lib/mastraClient';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || loading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    
    // Create a temporary loading message
    const loadingId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: loadingId,
      type: 'system',
      content: (
        <div className="ai-thinking">
          <div className="thinking-container">
            <Bot size={18} className="thinking-icon" />
            <div className="thinking-animation">
              <span className="thinking-text">Thinking</span>
              <span className="thinking-dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </span>
            </div>
          </div>
        </div>
      ),
      timestamp: new Date(),
    }]);

    try {
      const assistantMessageId = (Date.now() + 2).toString();
      
      if (framework === 'mastra-ai') {
        // Remove the loading message
        setMessages(prev => prev.filter(msg => msg.id !== loadingId));
        
        // Add an empty message that will be updated with streaming content
        setMessages(prev => [...prev, {
          id: assistantMessageId,
          type: 'assistant',
          content: '',
          timestamp: new Date(),
        }]);
        
        // Use Mastra client with streaming for chat
        await sendChatMessageWithMastra(
          userInput, 
          itinerary,
          (streamedText) => {
            // Update the message content with each chunk received
            setMessages(prev => 
              prev.map(msg => 
                msg.id === assistantMessageId 
                  ? { ...msg, content: streamedText } 
                  : msg
              )
            );
          }
        );
      } else {
        // Get an actual response for non-Mastra frameworks
        // This could be expanded to use other framework clients
        const responseContent = await sendChatMessageWithMastra(userInput, itinerary);
        
        // Remove the loading message
        setMessages(prev => prev.filter(msg => msg.id !== loadingId));
        
        // Add the assistant response
        const assistantMessage: Message = {
          id: assistantMessageId,
          type: 'assistant',
          content: responseContent,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      // Remove the loading message and show error
      setMessages(prev => prev.filter(msg => msg.id !== loadingId));
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        type: 'system',
        content: `Error: ${error instanceof Error ? error.message : "Failed to get response"}`,
        timestamp: new Date(),
      }]);
    }
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
      <div className="sleek-card-header">
        <span className="header-with-icon">
          <Bot size={16} className="header-icon" />
          AI Assistant
        </span>
        <div className={`framework-badge ${getBadgeClass(framework)} selected`} style={{ marginLeft: 'auto' }}>
          {getFrameworkName(framework)}
        </div>
      </div>
      <div className="chat-messages" style={{ overflowY: 'auto', height: 'calc(100% - 114px)', padding: '1rem' }}>
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
              <div className="ai-thinking">
                <div className="thinking-container">
                  <Bot size={18} className="thinking-icon" />
                  <div className="thinking-animation">
                    <span className="thinking-text">Creating your travel plan</span>
                    <span className="thinking-dots">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-container">
        <form onSubmit={handleSubmit} className="chat-form">
          <input
            type="text"
            placeholder="Ask a question about your trip plan..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="form-input"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="primary-button" 
            style={{ width: 'auto' }}
            disabled={loading || input.trim() === ''}
          >
            <Send size={16} style={{ marginRight: '4px' }} />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;