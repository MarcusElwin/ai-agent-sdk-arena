import React, { useState } from 'react';
import { MapPin, Home, Calendar, DollarSign, Building, ListChecks } from 'lucide-react';
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
      activities: ['sightseeing', 'dining'],
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      // Handle nested preferences
      const [parent, child] = name.split('.');
      if (parent === 'preferences') {
        setFormData(prev => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            [child]: value,
          },
        }));
      }
    } else {
      // Handle top-level fields
      setFormData(prev => ({
        ...prev,
        [name]: name === 'budget' ? Number(value) : value,
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
            activities: [...currentActivities, value],
          },
        };
      } else {
        return {
          ...prev,
          preferences: {
            ...prev.preferences,
            activities: currentActivities.filter(activity => activity !== value),
          },
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="sleek-card" style={{ height: '100%' }}>
      <div className="sleek-card-header">
        <span className="header-with-icon">
          <MapPin size={16} className="header-icon" />
          Plan Your Trip
        </span>
      </div>
      <div
        className="sleek-card-content"
        style={{
          overflow: 'auto',
          height: 'calc(100% - 114px)' /* Adjusted to account for footer height */,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <div
            className="form-content"
            style={{ flex: '1 1 auto', overflow: 'auto', paddingBottom: '16px' }}
          >
            <div className="form-field">
              <label htmlFor="destination" className="form-label">
                <div className="input-label-with-icon">
                  <MapPin size={14} />
                  <span>Destination</span>
                </div>
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                placeholder="e.g., Paris, Tokyo, New York"
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label htmlFor="preferences.origin" className="form-label">
                <div className="input-label-with-icon">
                  <Home size={14} />
                  <span>Origin</span>
                </div>
              </label>
              <input
                type="text"
                id="preferences.origin"
                name="preferences.origin"
                value={formData.preferences.origin}
                onChange={handleChange}
                placeholder="e.g., San Francisco"
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-field">
                <label htmlFor="startDate" className="form-label">
                  <div className="input-label-with-icon">
                    <Calendar size={14} />
                    <span>Start Date</span>
                  </div>
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-field">
                <label htmlFor="endDate" className="form-label">
                  <div className="input-label-with-icon">
                    <Calendar size={14} />
                    <span>End Date</span>
                  </div>
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="budget" className="form-label">
                <div className="input-label-with-icon">
                  <DollarSign size={14} />
                  <span>Budget (USD)</span>
                </div>
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                min="100"
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label htmlFor="preferences.accommodationType" className="form-label">
                <div className="input-label-with-icon">
                  <Building size={14} />
                  <span>Accommodation Type</span>
                </div>
              </label>
              <select
                id="preferences.accommodationType"
                name="preferences.accommodationType"
                value={formData.preferences.accommodationType}
                onChange={handleChange}
                className="form-input"
              >
                <option value="hotel">Hotel</option>
                <option value="airbnb">Airbnb</option>
                <option value="hostel">Hostel</option>
                <option value="resort">Resort</option>
              </select>
            </div>

            <div className="form-field">
              <span className="form-label">
                <div className="input-label-with-icon">
                  <ListChecks size={14} />
                  <span>Activities Preferences</span>
                </div>
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {['sightseeing', 'dining', 'adventure', 'relaxation', 'culture', 'shopping'].map(
                  activity => (
                    <div key={activity} style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        id={`activity-${activity}`}
                        name="activities"
                        value={activity}
                        checked={formData.preferences.activities?.includes(activity) || false}
                        onChange={handleActivitiesChange}
                        style={{ marginRight: '0.5rem' }}
                      />
                      <label
                        htmlFor={`activity-${activity}`}
                        style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}
                      >
                        {activity.charAt(0).toUpperCase() + activity.slice(1)}
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div
            className="form-footer"
            style={{
              flex: '0 0 auto',
              padding: '1.25rem',
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--bg-card)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <button type="submit" className="primary-button">
              Generate Travel Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TravelForm;
