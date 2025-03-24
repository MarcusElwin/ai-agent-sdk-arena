import React, { useState } from 'react';
import TravelForm from './components/TravelForm';
import FrameworkSelector from './components/FrameworkSelector';
import ItineraryDisplay from './components/ItineraryDisplay';
import ChatBox from './components/ChatBox';
import { ApiResponse, Framework, TravelRequest } from './types';

function App() {
  const [selectedFramework, setSelectedFramework] = useState<Framework>('pydantic-ai');
  const [loading, setLoading] = useState<boolean>(false);
  const [itinerary, setItinerary] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'chat'>('form');

  const handleFrameworkChange = (framework: Framework) => {
    setSelectedFramework(framework);
    setItinerary(null);
    setError(null);
  };

  const handleFormSubmit = async (formData: TravelRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      // API endpoints for each framework
      const endpoints = {
        'pydantic-ai': 'http://localhost:8000/plan',
        'openai-agents': 'http://localhost:8001/plan',
        'mastra-ai': 'http://localhost:8002/plan'
      };
      
      const response = await fetch(endpoints[selectedFramework], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setItinerary(data);
      
      // Switch to chat tab on mobile when we get results
      if (window.innerWidth < 768) {
        setActiveTab('chat');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching itinerary:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="container flex items-center justify-between">
          <div>
            <h1 className="app-title">
              <span className="app-logo">
                AI Travel Planner
                <span className="app-logo-icon">🗺️</span>
              </span>
              <span className="welcome-text typing-animation">
                Welcome back! Where are you going for your next{" "}
                <span className="adventure-text">adventure{" "}</span>
                <span className="globe-container">
                  <div className="globe"></div>
                  <div className="plane">✈️</div>
                </span>?
              </span>
            </h1>
          </div>
          <FrameworkSelector 
            selectedFramework={selectedFramework} 
            onFrameworkChange={handleFrameworkChange} 
          />
        </div>
      </header>
      
      {/* Mobile Tabs - Only visible on small screens */}
      <div className="hidden-desktop">
        <div className="mobile-tabs">
          <div 
            className={`mobile-tab ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            Plan Trip
          </div>
          <div 
            className={`mobile-tab ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            Assistant
          </div>
        </div>
        <div className="container">
          {activeTab === 'form' && <TravelForm onSubmit={handleFormSubmit} />}
          {activeTab === 'chat' && (
            <ChatBox 
              framework={selectedFramework}
              loading={loading}
              itinerary={itinerary}
              error={error}
            />
          )}
        </div>
      </div>
      
      {/* Desktop Split Layout - Hidden on small screens */}
      <div className="container">
        <div className="hidden-mobile" style={{ 
          display: 'flex', 
          height: 'calc(100vh - 80px)',
          gap: '1rem',
          marginTop: '0.5rem'
        }}>
          <div style={{ flex: '1 1 50%', minWidth: 0, maxWidth: '50%', height: '100%' }}>
            <TravelForm onSubmit={handleFormSubmit} />
          </div>
          <div style={{ flex: '1 1 50%', minWidth: 0, maxWidth: '50%', height: '100%' }}>
            <ChatBox 
              framework={selectedFramework}
              loading={loading}
              itinerary={itinerary}
              error={error}
            />
          </div>
        </div>
      </div>
      
      {/* Results Section - always below the split panels */}
      {itinerary && (
        <div className="container" style={{ marginTop: '2rem', paddingBottom: '2rem' }}>
          <ItineraryDisplay itinerary={itinerary} framework={selectedFramework} />
        </div>
      )}
    </div>
  );
}

export default App;