import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, MapPin, Trash2 } from 'lucide-react';
import { ApiResponse, Framework } from '../types';
import { sendChatMessageWithMastra } from '../lib/mastraClient';
import { extractJsonFromText } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
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

  // When itinerary changes from the API (not from chat), add a message with the results
  useEffect(() => {
    // Only add the summary message if we're not in an active chat session
    // This prevents duplicate itinerary buttons when extracting from chat
    if (itinerary && messages.length <= 1) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: (
          <div className="space-y-2">
            <p>I've created a travel plan for {itinerary.destination}!</p>
            <p>Your {itinerary.dates.end ? `${getDaysBetween(itinerary.dates.start, itinerary.dates.end)}-day` : ''} trip includes:</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
              <li>Flights to {itinerary.destination}</li>
              <li>Stay at {itinerary.accommodation.hotel || itinerary.accommodation.name || 'your accommodation'}</li>
              <li>{itinerary.activities.activities?.length || 0} activities planned</li>
            </ul>
            <p>Total budget: ${formatNumber(itinerary.budget.total)} • Estimated cost: ${formatNumber(itinerary.budget.spent || 0)}</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Click the button below to view the detailed itinerary</p>
          </div>
        ),
        timestamp: new Date(),
      }]);
    }
  }, [itinerary, messages.length]);

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

  // Handler for keyboard navigation in input history
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault(); // Prevent cursor from moving to start of input
      
      // If we're already navigating history or there's no text in the input
      if (historyIndex < inputHistory.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInput(inputHistory[inputHistory.length - 1 - nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault(); // Prevent cursor from moving to end of input
      
      if (historyIndex > 0) {
        // Move forward in history (which is newer messages)
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(inputHistory[inputHistory.length - 1 - nextIndex]);
      } else if (historyIndex === 0) {
        // Clear input when we reach the end of history
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const clearConversation = () => {
    // Reset messages to initial welcome message
    setMessages([{
      id: Date.now().toString(),
      type: 'system',
      content: 'Welcome to AI Travel Planner! Fill out the form on the left to generate a travel plan or ask questions here.',
      timestamp: new Date(),
    }]);
    
    // Clear input field and history navigation
    setInput('');
    setHistoryIndex(-1);
    
    // Reset any additional state if needed
    if (window.dispatchEvent && !itinerary) {
      // Only clear itinerary if one was generated from chat
      const event = new CustomEvent('itineraryUpdated', { detail: null });
      window.dispatchEvent(event);
    }
    
    // Focus the input field after clearing
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

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
    
    // Add the input to history if it's not the same as the last one
    if (inputHistory.length === 0 || inputHistory[inputHistory.length - 1] !== input.trim()) {
      setInputHistory(prev => [...prev, input.trim()]);
    }
    
    // Reset history index when submitting
    setHistoryIndex(-1);
    
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
        let fullStreamedText = '';
        await sendChatMessageWithMastra(
          userInput, 
          itinerary,
          (streamedText) => {
            fullStreamedText = streamedText;
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
        
        // Check if the response contains JSON data for an itinerary
        const extractedJson = extractJsonFromText(fullStreamedText);
        if (extractedJson && extractedJson.destination) {
          // Add a "Show Itinerary" button and dispatch event to update App state
          setTimeout(() => {
            // First, update the main App's itinerary state via custom event
            if (window.dispatchEvent) {
              console.log("Dispatching itineraryUpdated event with data:", extractedJson);
              const event = new CustomEvent('itineraryUpdated', { detail: extractedJson });
              window.dispatchEvent(event);
            }
            
            // Then add the button to the messages
            setMessages(prev => [
              ...prev, 
              {
                id: Date.now().toString(),
                type: 'assistant',
                content: (
                  <button 
                    onClick={showItineraryInModal}
                    className="primary-button" 
                    style={{ 
                      marginTop: '0.5rem', 
                      background: 'var(--primary-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <MapPin size={16} />
                    Show Itinerary
                  </button>
                ),
                timestamp: new Date(),
              }
            ]);
          }, 500);
        }
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
        
        // Check if the response contains JSON data for an itinerary
        const extractedJson = extractJsonFromText(responseContent);
        if (extractedJson && extractedJson.destination) {
          // Add a "Show Itinerary" button and dispatch event to update App state
          setTimeout(() => {
            // First, update the main App's itinerary state via custom event
            if (window.dispatchEvent) {
              console.log("Dispatching itineraryUpdated event with data:", extractedJson);
              const event = new CustomEvent('itineraryUpdated', { detail: extractedJson });
              window.dispatchEvent(event);
            }
            
            // Then add the button to the messages
            setMessages(prev => [
              ...prev, 
              {
                id: Date.now().toString(),
                type: 'assistant',
                content: (
                  <button 
                    onClick={showItineraryInModal}
                    className="primary-button" 
                    style={{ 
                      marginTop: '0.5rem', 
                      background: 'var(--primary-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <MapPin size={16} />
                    Show Itinerary
                  </button>
                ),
                timestamp: new Date(),
              }
            ]);
          }, 500);
        }
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
  
  // Function to show itinerary in modal without hiding JSON
  const showItineraryInModal = () => {
    // Show modal via custom event
    const showItineraryEvent = new CustomEvent('showItineraryModal', { 
      detail: { show: true } 
    });
    window.dispatchEvent(showItineraryEvent);
    
    // We're no longer hiding JSON blocks as they're now nicely formatted with syntax highlighting
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
              {typeof message.content === 'string' ? (
                <div className="markdown-content">
                  {message.content.trim() === '' ? (
                    // Show loading indicator for empty messages (streaming state)
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
                  ) : (
                    // Render markdown for non-empty messages
                    <ReactMarkdown
                      components={{
                        code({node, inline, className, children, ...props}) {
                          const match = /language-(\w+)/.exec(className || '')
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          )
                        }
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                </div>
              ) : React.isValidElement(message.content) ? (
                // Pass through React elements like buttons directly
                message.content
              ) : (
                // Fallback for any other content
                String(message.content)
              )}
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
        {itinerary && !messages.some(msg => 
          typeof msg.content === 'object' && 
          React.isValidElement(msg.content) && 
          msg.content.type === 'button' && 
          msg.content.props?.children?.includes?.('Show Itinerary')
        ) && (
          <div className="chat-message bot-message">
            <div className="message-bubble bot-bubble">
              <button 
                onClick={showItineraryInModal}
                className="primary-button" 
                style={{ 
                  marginTop: '0.5rem', 
                  background: 'var(--primary-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <MapPin size={16} />
                Show Itinerary
              </button>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-container">
        <form onSubmit={handleSubmit} className="chat-form">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask a question about your trip plan..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="form-input"
            disabled={loading}
          />
          <button 
            type="button" 
            className="primary-button" 
            style={{ width: 'auto', marginRight: '8px', background: 'var(--danger-color, #e53935)' }}
            onClick={clearConversation}
            title="Clear conversation"
          >
            <Trash2 size={16} />
          </button>
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