import React from 'react';
import './SocialNetworks.css';

const WallsIo = ({ width = 400, height = 300, config = {} }) => {
  // Default configuration with fallbacks
  const {
    backgroundColor = "#1a1a1a",
    textColor = "#ffffff"
  } = config;

  return (
    <div className="social-network-widget walls-io" style={{ width, height, backgroundColor, color: textColor }}>
      <div className="walls-io-content">
        <div className="walls-io-logo">
          <svg width="200" height="100" viewBox="0 0 200 100">
            <g transform="translate(50, 25)">
              <path d="M50,0 L100,50 L50,100 L0,50 Z" fill="#f39c12" />
              <path d="M40,30 L60,30 L60,70 L40,70 Z" fill="#ffffff" />
              <text x="110" y="55" fontFamily="Arial" fontSize="24" fill="#ffffff" fontWeight="bold">WALLS.IO</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default WallsIo;