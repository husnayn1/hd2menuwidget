import React from 'react';
import './SocialNetworks.css';

const FacebookModern = ({ width = 400, height = 300, config = {} }) => {
  // Default configuration with fallbacks
  const {
    dataFeed = true,
    qrCode = true,
    backgroundColor = "#ffffff",
    textColor = "#333333",
    accentColor = "#4267B2"
  } = config;

  return (
    <div className="social-network-widget facebook-modern" style={{ width, height, backgroundColor, color: textColor }}>
      <div className="data-feed-banner" style={{ backgroundColor: accentColor, color: "#ffffff" }}>
        Data Feed Enabled!
      </div>
      
      <div className="facebook-modern-content">
        <div className="facebook-modern-text">
          <p>This is a sample text that explains how the data feed works. The data feed pulls data from a real-time API source. This provides real-time content that is always up-to-date.</p>
        </div>
        
        {qrCode && (
          <div className="facebook-modern-qr">
            <div className="fb-logo-container">
              <div className="fb-logo">FB</div>
            </div>
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://facebook.com" 
              alt="Facebook QR Code" 
              className="qr-code" 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FacebookModern;