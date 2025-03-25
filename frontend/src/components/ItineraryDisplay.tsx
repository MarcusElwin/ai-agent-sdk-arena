import React, { useState } from 'react';
import { ApiResponse, Framework } from '../types';

interface ItineraryDisplayProps {
  itinerary: ApiResponse;
  framework: Framework;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary, framework }) => {
  const [activeTab, setActiveTab] = useState<'transportation' | 'accommodation' | 'activities'>('transportation');

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  // Get badge class based on framework
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

  const getFrameworkDisplayName = (framework: Framework): string => {
    switch (framework) {
      case 'pydantic-ai':
        return 'Pydantic AI';
      case 'openai-agents':
        return 'OpenAI Agents SDK';
      case 'mastra-ai':
        return 'Mastra AI';
      default:
        return framework;
    }
  };

  return (
    <div className="sleek-card">
      <div className="sleek-card-header flex items-center justify-between">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{itinerary.summary}</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {formatDate(itinerary.dates.start)} - {formatDate(itinerary.dates.end)}
          </p>
        </div>
        <div className={`framework-badge ${getBadgeClass(framework)} selected`}>
          {getFrameworkDisplayName(framework)}
        </div>
      </div>
      
      <div className="sleek-card-content">
        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '0.375rem', padding: '0.75rem' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Destination</div>
            <div style={{ fontWeight: '500' }}>{itinerary.destination}</div>
          </div>
          <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '0.375rem', padding: '0.75rem' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Total Budget</div>
            <div style={{ fontWeight: '500' }}>{formatCurrency(itinerary.budget.total)}</div>
          </div>
          <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '0.375rem', padding: '0.75rem' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Remaining</div>
            <div style={{ fontWeight: '500' }}>{formatCurrency(itinerary.budget.remaining)}</div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div style={{ borderBottom: '1px solid var(--border-subtle)', display: 'flex', marginBottom: '1.5rem' }}>
          <div 
            style={{ 
              paddingBottom: '0.5rem', 
              marginRight: '1.5rem',
              borderBottom: activeTab === 'transportation' ? '2px solid var(--primary-blue)' : '2px solid transparent',
              color: activeTab === 'transportation' ? 'var(--primary-blue)' : 'var(--text-secondary)',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('transportation')}
          >
            Transportation
          </div>
          <div 
            style={{ 
              paddingBottom: '0.5rem', 
              marginRight: '1.5rem',
              borderBottom: activeTab === 'accommodation' ? '2px solid var(--primary-blue)' : '2px solid transparent',
              color: activeTab === 'accommodation' ? 'var(--primary-blue)' : 'var(--text-secondary)',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('accommodation')}
          >
            Accommodation
          </div>
          <div 
            style={{ 
              paddingBottom: '0.5rem',
              borderBottom: activeTab === 'activities' ? '2px solid var(--primary-blue)' : '2px solid transparent',
              color: activeTab === 'activities' ? 'var(--primary-blue)' : 'var(--text-secondary)',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('activities')}
          >
            Activities
          </div>
        </div>
        
        {/* Content based on active tab */}
        <div style={{ marginTop: '1rem' }}>
          {activeTab === 'transportation' && (
            <div className="space-y-4">
              {itinerary.transportation && (
                <>
                  <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '0.5rem', overflow: 'hidden' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                      <h3 style={{ fontWeight: '600', margin: 0 }}>Outbound Flight</h3>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: '500' }}>
                            {itinerary.transportation.outbound.airline} {itinerary.transportation.outbound.flightNumber || itinerary.transportation.outbound.flight_number}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {formatDate(itinerary.transportation.outbound.departure.time.split('T')[0])}
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontWeight: '500' }}>{itinerary.transportation.outbound.duration}</div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Direct Flight</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: '500' }}>{formatCurrency(itinerary.transportation.outbound.price)}</div>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                        <div>
                          <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Departure</div>
                          <div>{itinerary.transportation.outbound.departure.airport}</div>
                          <div>{new Date(itinerary.transportation.outbound.departure.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Arrival</div>
                          <div>{itinerary.transportation.outbound.arrival.airport}</div>
                          <div>{new Date(itinerary.transportation.outbound.arrival.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '0.5rem', overflow: 'hidden' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                      <h3 style={{ fontWeight: '600', margin: 0 }}>Return Flight</h3>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: '500' }}>
                            {itinerary.transportation.return.airline} {itinerary.transportation.return.flightNumber || itinerary.transportation.return.flight_number}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {formatDate(itinerary.transportation.return.departure.time.split('T')[0])}
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontWeight: '500' }}>{itinerary.transportation.return.duration}</div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Direct Flight</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: '500' }}>{formatCurrency(itinerary.transportation.return.price)}</div>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                        <div>
                          <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Departure</div>
                          <div>{itinerary.transportation.return.departure.airport}</div>
                          <div>{new Date(itinerary.transportation.return.departure.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Arrival</div>
                          <div>{itinerary.transportation.return.arrival.airport}</div>
                          <div>{new Date(itinerary.transportation.return.arrival.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          
          {activeTab === 'accommodation' && (
            <div>
              {itinerary.accommodation && (
                <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '0.5rem', overflow: 'hidden' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <h3 style={{ fontWeight: '600', margin: 0 }}>{itinerary.accommodation.name}</h3>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: '500' }}>{itinerary.accommodation.type}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{itinerary.accommodation.address}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '600' }}>
                          {formatCurrency(itinerary.accommodation.totalCost || itinerary.accommodation.total_cost)}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {itinerary.accommodation.nights} nights
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginBottom: '1rem' }}>
                      <div>
                        <span style={{ fontWeight: '500' }}>Check-in: </span>
                        {formatDate(itinerary.accommodation.checkIn || itinerary.accommodation.check_in)}
                      </div>
                      <div>
                        <span style={{ fontWeight: '500' }}>Check-out: </span>
                        {formatDate(itinerary.accommodation.checkOut || itinerary.accommodation.check_out)}
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '0.875rem' }}>
                      <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Room Type</div>
                      <div style={{ marginBottom: '1rem' }}>
                        {itinerary.accommodation.roomType || 
                         itinerary.accommodation.room_type || 
                         itinerary.accommodation.propertyType || 
                         itinerary.accommodation.property_type}
                      </div>
                      
                      <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Amenities</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                        {itinerary.accommodation.amenities?.map((amenity: string, index: number) => (
                          <span 
                            key={index} 
                            style={{ 
                              background: 'rgba(255,255,255,0.05)', 
                              borderRadius: '9999px', 
                              padding: '0.25rem 0.75rem', 
                              fontSize: '0.75rem',
                              color: 'var(--text-secondary)',
                              border: '1px solid var(--border-subtle)'
                            }}
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'activities' && (
            <div className="space-y-4">
              {itinerary.activities && Array.isArray(itinerary.activities.activities || itinerary.activities) && (
                (itinerary.activities.activities || itinerary.activities).map((activity: any, index: number) => (
                  <div key={index} style={{ border: '1px solid var(--border-subtle)', borderRadius: '0.5rem', overflow: 'hidden' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                      <h3 style={{ fontWeight: '600', margin: 0 }}>{activity.name}</h3>
                      {activity.price && (
                        <div style={{ fontWeight: '500' }}>{formatCurrency(activity.price)}</div>
                      )}
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <span 
                          style={{ 
                            background: 'rgba(255,255,255,0.05)', 
                            borderRadius: '9999px', 
                            padding: '0.25rem 0.75rem', 
                            fontSize: '0.75rem',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-subtle)'
                          }}
                        >
                          {activity.category}
                        </span>
                        {activity.duration && (
                          <span 
                            style={{ 
                              background: 'rgba(255,255,255,0.05)', 
                              borderRadius: '9999px', 
                              padding: '0.25rem 0.75rem', 
                              fontSize: '0.75rem',
                              color: 'var(--text-secondary)',
                              border: '1px solid var(--border-subtle)'
                            }}
                          >
                            {activity.duration}
                          </span>
                        )}
                        {activity.location && (
                          <span 
                            style={{ 
                              background: 'rgba(255,255,255,0.05)', 
                              borderRadius: '9999px', 
                              padding: '0.25rem 0.75rem', 
                              fontSize: '0.75rem',
                              color: 'var(--text-secondary)',
                              border: '1px solid var(--border-subtle)'
                            }}
                          >
                            {activity.location}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.875rem', margin: 0 }}>{activity.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryDisplay;