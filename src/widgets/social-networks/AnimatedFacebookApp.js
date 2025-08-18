import React from 'react';
import './SocialNetworks.css';

const AnimatedFacebookApp = ({ width = 400, height = 300, config = {} }) => {
  // Check if we have real Facebook data or just defaults
  const hasRealData = config && config.url && config.url.includes('facebook.com');
  
  // If we have real Facebook data, render the actual Facebook page with animation
  if (hasRealData) {
    const {
      url,
      mediaOption = 'timeline',
      postCount = 10,
      textSize = 'medium',
      animationType = 'fade',
      animationSpeed = 'medium'
    } = config;
    
    // Map animation speed to CSS transition duration
    const speedMap = {
      'slow': '1.5s',
      'medium': '1s',
      'fast': '0.5s'
    };
    
    // Map animation type to CSS animation name
    const animationMap = {
      'fade': 'fadeIn',
      'slide': 'slideIn',
      'bounce': 'bounceIn',
      'zoom': 'zoomIn'
    };
    
    return (
      <div className="social-network-widget animated-facebook" style={{ width, height, background: '#fff' }}>
        <iframe
          src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(url)}&tabs=${mediaOption}&width=${width-20}&height=${height-20}&small_header=${textSize === 'small'}&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`}
          width={width-20}
          height={height-20}
          style={{ 
            border: 'none', 
            overflow: 'hidden',
            animation: `${animationMap[animationType] || 'fadeIn'} ${speedMap[animationSpeed] || '1s'} ease-in-out`
          }}
          scrolling="no"
          frameBorder="0"
          allowFullScreen={true}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        ></iframe>
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideIn {
              from { transform: translateY(50px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            @keyframes bounceIn {
              0% { transform: scale(0.3); opacity: 0; }
              50% { transform: scale(1.05); opacity: 0.9; }
              70% { transform: scale(0.9); }
              100% { transform: scale(1); opacity: 1; }
            }
            @keyframes zoomIn {
              from { transform: scale(0); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
          `}
        </style>
      </div>
    );
  }
  
  // Default configuration with fallbacks for placeholder content
  const {
    name = "Mark and Paula",
    description = "recently took a trip to Japan. Mark's friend Shane Brown, which made him(Mark) look for help with Mark's car. With Mark, he connects to animal shelter to save an old puppy named Coco and Spot. Mark and his wife found their fur-ever home!",
    profileImage = "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
    backgroundColor = "#3b5998",
    textColor = "#ffffff"
  } = config;

  return (
    <div className="social-network-widget animated-facebook" style={{ width, height, backgroundColor: "#000", color: textColor }}>
      <div className="facebook-header">
        <div className="facebook-logo">facebook</div>
      </div>
      <div className="facebook-content">
        <div className="facebook-profile-image">
          <img src={profileImage} alt="Profile" />
        </div>
        <div className="facebook-post-content">
          <div className="facebook-post-name">{name}</div>
          <div className="facebook-post-description">{description}</div>
        </div>
      </div>
      <div className="facebook-footer">
        <div className="facebook-icon">f/facebook</div>
      </div>
    </div>
  );
};

export default AnimatedFacebookApp;