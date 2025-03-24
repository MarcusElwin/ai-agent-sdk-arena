import React, { useState } from 'react';
import { TravelRequest } from '../types';

interface TravelFormProps {
  onSubmit: (formData: TravelRequest) => void;
}

const TravelForm: React.FC<TravelFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<TravelRequest>({
    destination: '',
    startDate: '',
    endDate: '',
    budget: 2000,
    preferences: {
      origin: 'New York',
      accommodationType: 'hotel',
      activities: ['sightseeing', 'dining']
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested preferences
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof TravelRequest],
          [child]: value
        }
      }));
    } else {
      // Handle top-level fields
      setFormData(prev => ({
        ...prev,
        [name]: name === 'budget' ? Number(value) : value
      }));
    }
  };

  const handleActivitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    setFormData(prev => {
      const currentActivities = prev.preferences.activities || [];
      
      if (checked) {
        return {
          ...prev,
          preferences: {
            ...prev.preferences,
            activities: [...currentActivities, value]
          }
        };
      } else {
        return {
          ...prev,
          preferences: {
            ...prev.preferences,
            activities: currentActivities.filter(activity => activity !== value)
          }
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="travel-form" style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h2>Plan Your Trip</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="destination" style={{ display: 'block', marginBottom: '5px' }}>Destination</label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            placeholder="e.g., Paris, Tokyo, New York"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="preferences.origin" style={{ display: 'block', marginBottom: '5px' }}>Origin</label>
          <input
            type="text"
            id="preferences.origin"
            name="preferences.origin"
            value={formData.preferences.origin}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            placeholder="e.g., San Francisco"
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="startDate" style={{ display: 'block', marginBottom: '5px' }}>Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="endDate" style={{ display: 'block', marginBottom: '5px' }}>End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="budget" style={{ display: 'block', marginBottom: '5px' }}>Budget (USD)</label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            required
            min="100"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="preferences.accommodationType" style={{ display: 'block', marginBottom: '5px' }}>Accommodation Type</label>
          <select
            id="preferences.accommodationType"
            name="preferences.accommodationType"
            value={formData.preferences.accommodationType}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="hotel">Hotel</option>
            <option value="airbnb">Airbnb</option>
            <option value="hostel">Hostel</option>
            <option value="resort">Resort</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Activities Preferences</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {['sightseeing', 'dining', 'adventure', 'relaxation', 'culture', 'shopping'].map(activity => (
              <div key={activity} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  id={`activity-${activity}`}
                  name="activities"
                  value={activity}
                  checked={formData.preferences.activities?.includes(activity) || false}
                  onChange={handleActivitiesChange}
                  style={{ marginRight: '5px' }}
                />
                <label htmlFor={`activity-${activity}`}>{activity.charAt(0).toUpperCase() + activity.slice(1)}</label>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: '#4c8bf5',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            width: '100%'
          }}
        >
          Generate Travel Plan
        </button>
      </form>
    </div>
  );
};

export default TravelForm;