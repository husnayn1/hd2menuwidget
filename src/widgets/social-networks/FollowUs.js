import React from 'react';
import './SocialNetworks.css';

const FollowUs = ({ width = 400, height = 300, config = {} }) => {
  // Default configuration with fallbacks
  const {
    platform = "Facebook",
    username = "@example",
    qrCode = true,
    backgroundColor = "#1877f2", // Facebook blue
    textColor = "#ffffff"
  } = config;

  return (
    <div className="social-network-widget follow-us" style={{ width, height, backgroundColor, color: textColor }}>
      <div className="follow-us-content">
        <div className="follow-us-platform">
          <div className="platform-logo">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png" alt="Facebook" />
          </div>
          <div className="platform-name">{platform}</div>
        </div>
        
        <div className="follow-us-username">{username}</div>
        
        {qrCode && (
          <div className="follow-us-qr">
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://facebook.com/example" 
              alt="QR Code" 
              className="qr-code" 
            />
          </div>
        )}
      </div>
      
      <div className="follow-us-tabs">
        <div className="tab active">Home</div>
        <div className="tab">About</div>
        <div className="tab">Posts</div>
        <div className="tab">Reviews</div>
        <div className="tab">Photos</div>
      </div>
    </div>
  );
};

export default FollowUs;