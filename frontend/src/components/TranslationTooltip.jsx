import React from 'react';

const TranslationTooltip = ({ word, translation, tooltipPosition, onClose }) => {
    return (
        <div
        style={{
          position: 'absolute',
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y}px`,
          backgroundColor: 'white',
          border: '1px solid #ddd',
          padding: '8px',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 1000,
        }}
      >
        <b>{word}</b>: {translation}
        <button 
          onClick={onClose}
          style={{ marginLeft: '8px', fontSize: '0.8em' }}
        >
          ×
        </button>
      </div>    
    );
}

export default TranslationTooltip;