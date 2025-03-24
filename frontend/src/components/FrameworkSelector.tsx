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
      />
      <FrameworkBadge
        framework="openai-agents"
        label="OpenAI Agents"
        selected={selectedFramework === 'openai-agents'}
        onClick={() => onFrameworkChange('openai-agents')}
        className="badge-openai"
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
}

const FrameworkBadge: React.FC<FrameworkBadgeProps> = ({
  framework,
  label,
  selected,
  onClick,
  className
}) => {
  return (
    <button
      className={`framework-badge ${className} ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default FrameworkSelector;