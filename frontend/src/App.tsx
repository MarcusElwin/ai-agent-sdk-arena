import React, { useState, useEffect } from 'react';
import TravelForm from './components/TravelForm';
import FrameworkSelector from './components/FrameworkSelector';
import ItineraryDisplay from './components/ItineraryDisplay';
import ItineraryModal from './components/ItineraryModal';
import ChatBox from './components/ChatBox';
import { ApiResponse, Framework, TravelRequest } from './types';
import { planTripWithMastra } from './lib/mastraClient';
// Import package.json to get the version
import packageInfo from '../package.json';

function App() {
  const [selectedFramework, setSelectedFramework] = useState<Framework>('mastra-ai');
  const [loading, setLoading] = useState<boolean>(false);
  const [itinerary, setItinerary] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'chat'>('form');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleFrameworkChange = (framework: Framework) => {
    // Only change if framework is Mastra AI (the only enabled one)
    if (framework === 'mastra-ai') {
      setSelectedFramework(framework);
      setItinerary(null);
      setError(null);
    } else {
      // For non-implemented frameworks, show clear error message
      const frameworkName = framework === 'pydantic-ai' ? 'Pydantic AI' : 'OpenAI Agents';
      setError(`${frameworkName} is coming soon! Please use Mastra AI for now.`);
    }
  };

  const handleFormSubmit = async (formData: TravelRequest) => {
    setLoading(true);
    setError(null);

    try {
      let data;

      if (selectedFramework === 'mastra-ai') {
        // Use Mastra client directly
        data = await planTripWithMastra(formData);
      } else {
        // For non-implemented frameworks, throw a descriptive error
        const frameworkName = selectedFramework === 'pydantic-ai' ? 'Pydantic AI' : 'OpenAI Agents';
        throw new Error(`${frameworkName} is coming soon! Please use Mastra AI for now.`);
      }

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

  // Add event listeners for itinerary updates from chat responses and modal control
  useEffect(() => {
    const handleItineraryUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.destination) {
        setItinerary(event.detail);
      }
    };

    const handleShowModal = (event: CustomEvent) => {
      if (event.detail && event.detail.show) {
        setIsModalOpen(true);
      }
    };

    window.addEventListener('itineraryUpdated', handleItineraryUpdate as EventListener);
    window.addEventListener('showItineraryModal', handleShowModal as EventListener);

    return () => {
      window.removeEventListener('itineraryUpdated', handleItineraryUpdate as EventListener);
      window.removeEventListener('showItineraryModal', handleShowModal as EventListener);
    };
  }, []);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="container flex items-center justify-between">
          <div className="flex items-center">
            <div className="version-badge">v{packageInfo.version} (Beta)</div>
            <h1 className="app-title">
              <span className="app-logo">
                AI Travel Planner
                <span className="globe-container" style={{ marginLeft: '8px', marginTop: '2px' }}>
                  <div className="globe"></div>
                  <div className="plane">✈️</div>
                </span>
              </span>
              <span className="welcome-text">
                Welcome back! Where are you going for your next{' '}
                <span className="text-accent">adventure</span>?<span className="text-cursor"></span>
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
        <div
          className="hidden-mobile"
          style={{
            display: 'flex',
            height: 'calc(100vh - 60px)',
            gap: '1rem',
            marginTop: '0.5rem',
          }}
        >
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

      {/* Add Itinerary Modal */}
      <ItineraryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itinerary={itinerary}
        framework={selectedFramework}
      />

      {/* Results Section - only shown when not using modal */}
      {false && itinerary && (
        <div
          className="container"
          style={{ marginTop: '2rem', paddingBottom: '2rem' }}
          id="itinerary-display"
        >
          <ItineraryDisplay itinerary={itinerary} framework={selectedFramework} />
        </div>
      )}
    </div>
  );
}

export default App;
