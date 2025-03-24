import React from 'react';
import { ApiResponse, Framework } from '../types';

interface ItineraryDisplayProps {
  itinerary: ApiResponse;
  framework: Framework;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary, framework }) => {
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

  return (
    <div className="itinerary-display" style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>{itinerary.summary}</h2>
        <span style={{
          backgroundColor: getFrameworkColor(framework),
          color: 'white',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          {getFrameworkDisplayName(framework)}
        </span>
      </div>

      {/* Trip Summary */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Trip Summary</h3>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <div style={{ flex: 1, border: '1px solid #ddd', borderRadius: '4px', padding: '10px' }}>
            <div style={{ fontWeight: 'bold' }}>Destination</div>
            <div>{itinerary.destination}</div>
          </div>
          <div style={{ flex: 1, border: '1px solid #ddd', borderRadius: '4px', padding: '10px' }}>
            <div style={{ fontWeight: 'bold' }}>Dates</div>
            <div>{formatDate(itinerary.dates.start)} - {formatDate(itinerary.dates.end)}</div>
          </div>
          <div style={{ flex: 1, border: '1px solid #ddd', borderRadius: '4px', padding: '10px' }}>
            <div style={{ fontWeight: 'bold' }}>Budget</div>
            <div>
              <div>Total: {formatCurrency(itinerary.budget.total)}</div>
              <div>Spent: {formatCurrency(itinerary.budget.spent)}</div>
              <div>Remaining: {formatCurrency(itinerary.budget.remaining)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Transportation */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Transportation</h3>
        {itinerary.transportation && (
          <div>
            <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '15px', marginBottom: '10px' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>Outbound Flight</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{itinerary.transportation.outbound.airline} {itinerary.transportation.outbound.flightNumber}</div>
                  <div>{formatDate(itinerary.transportation.outbound.departure.time.split('T')[0])}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold' }}>{itinerary.transportation.outbound.duration}</div>
                  <div>Direct Flight</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold' }}>{formatCurrency(itinerary.transportation.outbound.price)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Departure</div>
                  <div>{itinerary.transportation.outbound.departure.airport}</div>
                  <div>{new Date(itinerary.transportation.outbound.departure.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', color: '#666' }}>Arrival</div>
                  <div>{itinerary.transportation.outbound.arrival.airport}</div>
                  <div>{new Date(itinerary.transportation.outbound.arrival.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
              </div>
            </div>

            <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '15px' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>Return Flight</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{itinerary.transportation.return.airline} {itinerary.transportation.return.flightNumber}</div>
                  <div>{formatDate(itinerary.transportation.return.departure.time.split('T')[0])}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold' }}>{itinerary.transportation.return.duration}</div>
                  <div>Direct Flight</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold' }}>{formatCurrency(itinerary.transportation.return.price)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Departure</div>
                  <div>{itinerary.transportation.return.departure.airport}</div>
                  <div>{new Date(itinerary.transportation.return.departure.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', color: '#666' }}>Arrival</div>
                  <div>{itinerary.transportation.return.arrival.airport}</div>
                  <div>{new Date(itinerary.transportation.return.arrival.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Accommodation */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Accommodation</h3>
        {itinerary.accommodation && (
          <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0' }}>{itinerary.accommodation.name}</h4>
                <div>{itinerary.accommodation.address}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold' }}>{formatCurrency(itinerary.accommodation.totalCost || itinerary.accommodation.total_cost)}</div>
                <div>{itinerary.accommodation.nights} nights</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <div>Check-in: {formatDate(itinerary.accommodation.checkIn || itinerary.accommodation.check_in)}</div>
              <div>Check-out: {formatDate(itinerary.accommodation.checkOut || itinerary.accommodation.check_out)}</div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{itinerary.accommodation.type} Details</div>
              <div>{itinerary.accommodation.roomType || itinerary.accommodation.room_type || itinerary.accommodation.propertyType || itinerary.accommodation.property_type}</div>
              <div style={{ marginTop: '10px' }}>
                <span style={{ fontWeight: 'bold' }}>Amenities: </span>
                {itinerary.accommodation.amenities?.join(', ')}
              </div>
              {itinerary.accommodation.notes && (
                <div style={{ marginTop: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>Notes: </span>
                  {itinerary.accommodation.notes.join(', ')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Activities */}
      <div>
        <h3>Activities & Experiences</h3>
        {itinerary.activities && (
          <div>
            {/* Check if activities is an array or has an activities property */}
            {Array.isArray(itinerary.activities.activities || itinerary.activities) ? (
              (itinerary.activities.activities || itinerary.activities).map((activity: any, index: number) => (
                <div key={index} style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '15px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <h4 style={{ margin: 0 }}>{activity.name}</h4>
                    {activity.price && <div style={{ fontWeight: 'bold' }}>{formatCurrency(activity.price)}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                    <div>{activity.category}</div>
                    {activity.duration && <div>• {activity.duration}</div>}
                    {activity.location && <div>• {activity.location}</div>}
                  </div>
                  <div>{activity.description}</div>
                </div>
              ))
            ) : (
              <div>No activities found</div>
            )}

            {/* Display restaurants if available */}
            {Array.isArray(itinerary.activities.dining) && itinerary.activities.dining.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h4>Recommended Dining</h4>
                {itinerary.activities.dining.map((restaurant: any, index: number) => (
                  <div key={index} style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '15px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <h4 style={{ margin: 0 }}>{restaurant.name}</h4>
                      <div>{restaurant.price_range}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                      <div>{restaurant.cuisine} Cuisine</div>
                      <div>• {restaurant.location}</div>
                    </div>
                    <div>{restaurant.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions
function getFrameworkColor(framework: Framework): string {
  switch (framework) {
    case 'pydantic-ai':
      return '#2ecc71';
    case 'openai-agents':
      return '#3498db';
    case 'mastra-ai':
      return '#9b59b6';
    default:
      return '#95a5a6';
  }
}

function getFrameworkDisplayName(framework: Framework): string {
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
}

export default ItineraryDisplay;