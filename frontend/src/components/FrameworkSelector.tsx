import React from 'react';
import { Framework } from '../types';

interface FrameworkSelectorProps {
  selectedFramework: Framework;
  onFrameworkChange: (framework: Framework) => void;
}

const FrameworkSelector: React.FC<FrameworkSelectorProps> = ({ 
  selectedFramework, 
  onFrameworkChange 
}) => {
  return (
    <div className="framework-badges">
      <FrameworkBadge
        framework="pydantic-ai"
        label="Pydantic AI"
        selected={selectedFramework === 'pydantic-ai'}
        onClick={() => onFrameworkChange('pydantic-ai')}
        className="badge-pydantic"
        disabled={true}
        comingSoon={true}
      />
      <FrameworkBadge
        framework="openai-agents"
        label="OpenAI Agents"
        selected={selectedFramework === 'openai-agents'}
        onClick={() => onFrameworkChange('openai-agents')}
        className="badge-openai"
        disabled={true}
        comingSoon={true}
      />
      <FrameworkBadge
        framework="mastra-ai"
        label="Mastra AI"
        selected={selectedFramework === 'mastra-ai'} 
        onClick={() => onFrameworkChange('mastra-ai')}
        className="badge-mastra"
      />
    </div>
  );
};

interface FrameworkBadgeProps {
  framework: Framework;
  label: string;
  selected: boolean;
  onClick: () => void;
  className: string;
  disabled?: boolean;
  comingSoon?: boolean;
}

const FrameworkBadge: React.FC<FrameworkBadgeProps> = ({
  framework,
  label,
  selected,
  onClick,
  className,
  disabled = false,
  comingSoon = false
}) => {
  return (
    <button
      className={`framework-badge ${className} ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      title={comingSoon ? 'Coming soon' : undefined}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1,
        padding: '0.4rem 0.6rem'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span>{label}</span>
        {comingSoon && (
          <span className="coming-soon-badge">Coming Soon</span>
        )}
      </div>
    </button>
  );
};

export default FrameworkSelector;