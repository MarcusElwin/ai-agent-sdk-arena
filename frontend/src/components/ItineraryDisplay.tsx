import React, { useState } from 'react';
import { MapPin, Calendar, DollarSign, Clock, ExternalLink, MapIcon } from 'lucide-react';
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

  // Use console.log to debug itinerary structure
  React.useEffect(() => {
    console.log("Itinerary data in ItineraryDisplay:", itinerary);
  }, [itinerary]);

  return (
    <div className="sleek-card">
      <div className="sleek-card-header flex items-center justify-between">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapIcon size={20} />
            {itinerary.summary}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Calendar size={14} />
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
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={14} />
              Destination
            </div>
            <div style={{ fontWeight: '500' }}>{itinerary.destination}</div>
          </div>
          <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '0.375rem', padding: '0.75rem' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <DollarSign size={14} />
              Total Budget
            </div>
            <div style={{ fontWeight: '500' }}>{formatCurrency(itinerary.budget.total)}</div>
          </div>
          <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '0.375rem', padding: '0.75rem' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <DollarSign size={14} />
              Remaining
            </div>
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
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onClick={() => setActiveTab('transportation')}
          >
            <ExternalLink size={16} />
            Transportation
          </div>
          <div 
            style={{ 
              paddingBottom: '0.5rem', 
              marginRight: '1.5rem',
              borderBottom: activeTab === 'accommodation' ? '2px solid var(--primary-blue)' : '2px solid transparent',
              color: activeTab === 'accommodation' ? 'var(--primary-blue)' : 'var(--text-secondary)',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onClick={() => setActiveTab('accommodation')}
          >
            <MapPin size={16} />
            Accommodation
          </div>
          <div 
            style={{ 
              paddingBottom: '0.5rem',
              borderBottom: activeTab === 'activities' ? '2px solid var(--primary-blue)' : '2px solid transparent',
              color: activeTab === 'activities' ? 'var(--primary-blue)' : 'var(--text-secondary)',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onClick={() => setActiveTab('activities')}
          >
            <Clock size={16} />
            Activities
          </div>
        </div>
        
        {/* Content based on active tab */}
        <div style={{ marginTop: '1rem' }}>
          {activeTab === 'transportation' && (
            <div className="space-y-4">
              {itinerary.transportation && (
                <div>
                  {/* Outbound Flight */}
                  {itinerary.transportation.outbound && (
                    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '0.5rem', overflow: 'hidden', marginBottom: '1rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                        <h3 style={{ fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <ExternalLink size={16} />
                          Outbound Flight
                        </h3>
                      </div>
                      <div style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                          <div>
                            <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <MapPin size={14} />
                              Flight to {itinerary.destination}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Calendar size={14} />
                              {formatDate(itinerary.dates.start)}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                              <Clock size={14} />
                              Duration: {itinerary.transportation.outbound?.duration || 'Details in itinerary'}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontWeight: '500', textAlign: 'right', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                              <DollarSign size={14} />
                              {itinerary.transportation.outbound?.cost ? formatCurrency(itinerary.transportation.outbound.cost) : 'Included'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Return Flight */}
                  {(itinerary.transportation.inbound || itinerary.transportation.return) && (
                    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '0.5rem', overflow: 'hidden' }}>
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                        <h3 style={{ fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <ExternalLink size={16} />
                          Return Flight
                        </h3>
                      </div>
                      <div style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                          <div>
                            <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <MapPin size={14} />
                              Return flight from {itinerary.destination}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Calendar size={14} />
                              {formatDate(itinerary.dates.end)}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                              <Clock size={14} />
                              Duration: {(itinerary.transportation.inbound?.duration || itinerary.transportation.return?.duration) || 'Details in itinerary'}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontWeight: '500', textAlign: 'right', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                              <DollarSign size={14} />
                              {(itinerary.transportation.inbound?.cost || itinerary.transportation.return?.cost) 
                                ? formatCurrency(itinerary.transportation.inbound?.cost || itinerary.transportation.return?.cost) 
                                : 'Included'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'accommodation' && (
            <div>
              {itinerary.accommodation && (
                <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '0.5rem', overflow: 'hidden' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <h3 style={{ fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapIcon size={16} />
                      {itinerary.accommodation.name || itinerary.accommodation.hotel || 'Accommodation'}
                    </h3>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={14} />
                          {itinerary.accommodation.address || `${itinerary.destination}`}
                        </div>
                        {itinerary.accommodation.description && (
                          <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                            {itinerary.accommodation.description}
                          </div>
                        )}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}>
                          <DollarSign size={14} />
                          {itinerary.accommodation.cost ? formatCurrency(itinerary.accommodation.cost) : 'See details in itinerary'}
                        </div>
                        {itinerary.accommodation.nights && (
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            {itinerary.accommodation.nights} nights
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                      <div>
                        <span style={{ fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Calendar size={14} />
                          Check-in:
                        </span>{' '}
                        {formatDate(itinerary.dates.start)}
                      </div>
                      <div>
                        <span style={{ fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Calendar size={14} />
                          Check-out:
                        </span>{' '}
                        {formatDate(itinerary.dates.end)}
                      </div>
                    </div>
                    
                    {itinerary.accommodation.amenities && (
                      <div style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
                        <div style={{ fontWeight: '500', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={14} />
                          Amenities:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {Array.isArray(itinerary.accommodation.amenities) ? 
                            itinerary.accommodation.amenities.map((amenity: string, index: number) => (
                              <span key={index} style={{ 
                                fontSize: '0.75rem', 
                                padding: '0.25rem 0.5rem', 
                                background: 'rgba(255,255,255,0.05)', 
                                borderRadius: '1rem',
                                border: '1px solid var(--border-subtle)'
                              }}>
                                {amenity}
                              </span>
                            )) : 
                            <span>{itinerary.accommodation.amenities}</span>
                          }
                        </div>
                      </div>
                    )}
                    
                    {itinerary.accommodation.url && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <button
                          className="secondary-button"
                          style={{ 
                            fontSize: '0.75rem',
                            padding: '0.375rem 0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                          onClick={() => window.open(itinerary.accommodation.url, '_blank')}
                        >
                          <ExternalLink size={14} />
                          View Details
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'activities' && (
            <div className="space-y-4">
              {itinerary.activities && itinerary.activities.activities && (
                <>
                  {itinerary.activities.activities.map((activity: any, index: number) => (
                    <div key={index} style={{ border: '1px solid var(--border-subtle)', borderRadius: '0.5rem', overflow: 'hidden' }}>
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                        <h3 style={{ fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={14} /> 
                          {activity.name}
                        </h3>
                        {activity.cost && (
                          <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <DollarSign size={14} />
                            {formatCurrency(activity.cost)}
                          </div>
                        )}
                      </div>
                      <div style={{ padding: '1rem' }}>
                        <p style={{ fontSize: '0.875rem', margin: '0' }}>{activity.description}</p>
                        
                        {/* Activity action buttons */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                          <button
                            className="secondary-button"
                            style={{ 
                              fontSize: '0.75rem',
                              padding: '0.375rem 0.75rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                            onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(activity.name + ' ' + itinerary.destination)}`, '_blank')}
                          >
                            <MapIcon size={14} />
                            View on Map
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
              
              {/* Weather info card at the bottom if available */}
              {itinerary.weather && (
                <div style={{ 
                  border: '1px solid var(--border-subtle)', 
                  borderRadius: '0.5rem', 
                  overflow: 'hidden',
                  background: 'linear-gradient(to right, rgba(25, 118, 210, 0.05), rgba(25, 118, 210, 0.1))'
                }}>
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ fontWeight: '600', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={16} />
                      Weather Information
                    </h3>
                    <p style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={14} />
                      {itinerary.weather.description || 
                       `During your stay, ${itinerary.destination} is expected to have varied weather.`}
                    </p>
                    
                    {itinerary.weather.temperature && (
                      <div style={{ 
                        display: 'flex',
                        gap: '1rem',
                        marginTop: '0.75rem',
                        fontSize: '0.875rem',
                        flexWrap: 'wrap'
                      }}>
                        <div style={{ 
                          padding: '0.5rem 0.75rem', 
                          background: 'rgba(25, 118, 210, 0.1)', 
                          borderRadius: '0.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <MapIcon size={14} />
                          <span style={{ fontWeight: '500' }}>
                            {typeof itinerary.weather.temperature === 'object' 
                              ? `Temperature: ${itinerary.weather.temperature.min}°-${itinerary.weather.temperature.max}°`
                              : `Temperature: ${itinerary.weather.temperature}°`}
                          </span>
                        </div>
                        
                        {itinerary.weather.precipitation && (
                          <div style={{ 
                            padding: '0.5rem 0.75rem', 
                            background: 'rgba(25, 118, 210, 0.1)', 
                            borderRadius: '0.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <ExternalLink size={14} />
                            <span style={{ fontWeight: '500' }}>
                              Precipitation: {itinerary.weather.precipitation}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {itinerary.weather.url && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <button
                          className="secondary-button"
                          style={{ 
                            fontSize: '0.75rem',
                            padding: '0.375rem 0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                          onClick={() => window.open(itinerary.weather.url, '_blank')}
                        >
                          <ExternalLink size={14} />
                          View Detailed Weather
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryDisplay;