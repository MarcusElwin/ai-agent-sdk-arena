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
    <div className="framework-selector" style={{ marginBottom: '20px' }}>
      <h2>Select AI Framework</h2>
      <div style={{ display: 'flex', gap: '15px' }}>
        <FrameworkOption 
          name="Pydantic AI" 
          value="pydantic-ai" 
          description="Python-based agent framework with strong typing through Pydantic" 
          selected={selectedFramework === 'pydantic-ai'}
          onChange={() => onFrameworkChange('pydantic-ai')}
        />
        
        <FrameworkOption 
          name="OpenAI Agents" 
          value="openai-agents" 
          description="OpenAI's Python framework for building AI agents" 
          selected={selectedFramework === 'openai-agents'}
          onChange={() => onFrameworkChange('openai-agents')}
        />
        
        <FrameworkOption 
          name="Mastra AI" 
          value="mastra-ai" 
          description="TypeScript-based agent framework for multi-agent coordination" 
          selected={selectedFramework === 'mastra-ai'}
          onChange={() => onFrameworkChange('mastra-ai')}
        />
      </div>
    </div>
  );
};

interface FrameworkOptionProps {
  name: string;
  value: string;
  description: string;
  selected: boolean;
  onChange: () => void;
}

const FrameworkOption: React.FC<FrameworkOptionProps> = ({
  name,
  value,
  description,
  selected,
  onChange
}) => {
  return (
    <div 
      onClick={onChange}
      style={{
        border: `2px solid ${selected ? '#4c8bf5' : '#e0e0e0'}`,
        borderRadius: '8px',
        padding: '15px',
        flex: 1,
        cursor: 'pointer',
        backgroundColor: selected ? '#f0f7ff' : 'white',
        transition: 'all 0.2s ease'
      }}
    >
      <h3 style={{ margin: '0 0 10px 0' }}>{name}</h3>
      <p style={{ margin: 0, fontSize: '14px' }}>{description}</p>
    </div>
  );
};

export default FrameworkSelector;