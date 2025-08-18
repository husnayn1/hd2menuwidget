import React, { useState } from 'react';
import YouTubeVideoModal from './YouTubeVideoModal.jsx';
import './SocialNetworks.css';

const YouTubeVideo = ({ width = 400, height = 300, config = {}, onSave }) => {
  const [showModal, setShowModal] = useState(false);

  const handleSave = (widgetData) => {
    // Pass the widget data to the parent component
    if (onSave) {
      onSave(widgetData);
    }
    setShowModal(false);
  };

  return (
    <div className="social-network-widget youtube-video" style={{ width, height }}>
      <button
        style={{
          width: '100%',
          height: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0
        }}
        onClick={() => setShowModal(true)}
        aria-label="Customize YouTube Video"
      >
        <div className="youtube-content">
          <div className="youtube-logo">
            <svg viewBox="0 0 90 20" preserveAspectRatio="xMidYMid meet" focusable="false" style={{ width: '100%', height: '100%' }}>
              <g viewBox="0 0 90 20" preserveAspectRatio="xMidYMid meet">
                <g>
                  <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"></path>
                  <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"></path>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </button>
      {showModal && (
        <YouTubeVideoModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          initialData={config}
        />
      )}
    </div>
  );
};

export default YouTubeVideo;