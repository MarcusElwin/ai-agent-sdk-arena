import React from 'react';
import { X } from 'lucide-react';
import ItineraryDisplay from './ItineraryDisplay';
import { ApiResponse, Framework } from '../types';

interface ItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: ApiResponse | null;
  framework: Framework;
}

const ItineraryModal: React.FC<ItineraryModalProps> = ({
  isOpen,
  onClose,
  itinerary,
  framework,
}) => {
  if (!isOpen || !itinerary) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '0.5rem',
          maxWidth: '90%',
          width: '900px',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            zIndex: 10,
          }}
        >
          <X size={24} />
        </button>

        <div style={{ padding: '1rem' }}>
          <ItineraryDisplay itinerary={itinerary} framework={framework} />
        </div>
      </div>
    </div>
  );
};

export default ItineraryModal;
