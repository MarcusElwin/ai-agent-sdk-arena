import React, { useState } from 'react';
import TravelForm from './components/TravelForm';
import FrameworkSelector from './components/FrameworkSelector';
import ItineraryDisplay from './components/ItineraryDisplay';
import { ApiResponse, Framework, TravelRequest } from './types';

function App() {
  const [selectedFramework, setSelectedFramework] = useState<Framework>('pydantic-ai');
  const [loading, setLoading] = useState<boolean>(false);
  const [itinerary, setItinerary] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching itinerary:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1>AI Travel Planner - Framework Comparison</h1>
        <p>Compare different AI agent frameworks for travel planning</p>
      </header>
      
      <main>
        <FrameworkSelector 
          selectedFramework={selectedFramework} 
          onFrameworkChange={handleFrameworkChange} 
        />
        
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <div style={{ flex: '1' }}>
            <TravelForm onSubmit={handleFormSubmit} />
          </div>
          
          <div style={{ flex: '2' }}>
            {loading && <div>Loading itinerary...</div>}
            {error && <div style={{ color: 'red' }}>Error: {error}</div>}
            {itinerary && <ItineraryDisplay itinerary={itinerary} framework={selectedFramework} />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;