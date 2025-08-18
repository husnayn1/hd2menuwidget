import React from 'react';
import './SocialNetworks.css';

const TagboxDisplay = ({ width = 400, height = 300, config = {} }) => {
  // Default configuration with fallbacks
  const {
    backgroundColor = "#ffffff",
    textColor = "#333333"
  } = config;

  return (
    <div className="social-network-widget tagbox-display" style={{ width, height, backgroundColor, color: textColor }}>
      <div className="tagbox-content">
        <div className="tagbox-logo">
          <svg width="200" height="60" viewBox="0 0 200 60">
            <text x="10" y="40" fontFamily="Arial" fontSize="24" fill="#8e44ad" fontWeight="bold">tagbox</text>
            <text x="110" y="40" fontFamily="Arial" fontSize="24" fill="#333">Display</text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TagboxDisplay;