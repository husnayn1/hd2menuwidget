import React from 'react';
import FacebookPage from './widgets/social-networks/FacebookPage';
import FacebookModern from './widgets/social-networks/FacebookModern';
import FollowUs from './widgets/social-networks/FollowUs';

const SocialNetworkPreview = ({ widget, onClose }) => {
  // Determine social network type
  const isAnimatedFacebook = widget?.name?.toLowerCase().includes("animated facebook") || widget?.widgetSubType === 'animated-facebook';
  const isFacebookPage = widget?.name === 'Facebook Page' || widget?.originalName === 'Facebook Page' || widget?.widgetSubType === 'facebook-page';
  const isFacebookModern = widget?.name === 'Facebook Modern' || widget?.originalName === 'Facebook Modern' || widget?.widgetSubType === 'facebook-modern';
  const isFacebook = !isAnimatedFacebook && !isFacebookPage && !isFacebookModern && widget?.name?.toLowerCase().includes("facebook");
  const isYoutube = widget?.name?.toLowerCase().includes("youtube");
  const isFollowUs = widget?.name === 'Follow Us' || widget?.originalName === 'Follow Us' || widget?.widgetSubType === 'follow-us' || widget?.name?.toLowerCase().includes("follow us");
  const isTagbox = widget?.name?.toLowerCase().includes("tagbox");
  const isWallsIo = widget?.name?.toLowerCase().includes("walls.io");

  // Get widget properties with defaults
  const {
    appName = widget?.name || "Social Network",
    bgColor = "#ffffff",
    textColor = "#000000",
    highlightColor = "#1976d2",
    profileUrl = "",
    showQrCode = true,
    appLabels = {
      appTitle: widget?.name || "Social Network",
      noDataAvailable: "No Data Available",
      checkConnection: "Check internet connection/Data Feed",
      followUs: "Follow Us",
      scanQrCode: "Scan QR Code"
    }
  } = widget || {};

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
      <div style={{ position: 'relative', width: '80%', height: '80%', background: bgColor, borderRadius: 8, overflow: 'hidden' }}>
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: 10, right: 10, fontSize: 24, background: 'none', border: 'none', color: textColor, cursor: 'pointer', zIndex: 10 }}
        >
          ×
        </button>
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: textColor, padding: 20 }}>
            <h2 style={{ color: highlightColor }}>{appLabels.appTitle}</h2>
            
            {isAnimatedFacebook && (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png" 
                    alt="Facebook" 
                    style={{ width: 80, height: 80, objectFit: 'contain' }} 
                  />
                </div>
                <p>Animated Facebook App Preview</p>
                {profileUrl ? (
                  <div>
                    <p>Connected to: {profileUrl}</p>
                    <p>Animation Type: {widget.animationType || 'fade'}</p>
                    <p>Animation Speed: {widget.animationSpeed || 'medium'}</p>
                    <p>Media Option: {widget.mediaOption || 'timeline'}</p>
                    <p>Post Count: {widget.postCount || '10'}</p>
                    <p>Text Size: {widget.textSize || 'medium'}</p>
                    <div style={{ 
                      width: 200, 
                      height: 120, 
                      border: '1px solid #ddd', 
                      borderRadius: 8, 
                      margin: '20px auto',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: `${widget.animationType || 'fade'}Animation 2s infinite`
                      }}>
                        <div style={{ 
                          width: 40, 
                          height: 40, 
                          background: '#4267B2', 
                          borderRadius: 4, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: 20
                        }}>f</div>
                      </div>
                    </div>
                    <style>
                      {`
                        @keyframes fadeAnimation {
                          0% { opacity: 0; }
                          50% { opacity: 1; }
                          100% { opacity: 0; }
                        }
                        @keyframes slideAnimation {
                          0% { transform: translateY(20px); opacity: 0; }
                          50% { transform: translateY(0); opacity: 1; }
                          100% { transform: translateY(-20px); opacity: 0; }
                        }
                        @keyframes bounceAnimation {
                          0% { transform: scale(0.3); opacity: 0; }
                          50% { transform: scale(1.05); opacity: 1; }
                          100% { transform: scale(0.3); opacity: 0; }
                        }
                        @keyframes zoomAnimation {
                          0% { transform: scale(0); opacity: 0; }
                          50% { transform: scale(1); opacity: 1; }
                          100% { transform: scale(0); opacity: 0; }
                        }
                      `}
                    </style>
                  </div>
                ) : (
                  <p>{appLabels.noDataAvailable}</p>
                )}
              </div>
            )}
            
            {isFacebookPage && (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png"
                    alt="Facebook"
                    style={{ width: 80, height: 80, objectFit: 'contain' }}
                  />
                </div>
                <p>Facebook Page Preview</p>
                {widget?.url ? (
                  <div style={{ width: '100%', height: '70%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FacebookPage
                      width={Math.min(500, window.innerWidth * 0.6)}
                      height={Math.min(400, window.innerHeight * 0.5)}
                      config={{
                        ...widget,
                        width: Math.min(500, window.innerWidth * 0.6),
                        height: Math.min(400, window.innerHeight * 0.5)
                      }}
                    />
                  </div>
                ) : (
                  <p>{appLabels.noDataAvailable}</p>
                )}
              </div>
            )}
            
            {isFacebookModern && (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png"
                    alt="Facebook"
                    style={{ width: 80, height: 80, objectFit: 'contain' }}
                  />
                </div>
                <p>Facebook Modern Preview</p>
                <div style={{ width: '100%', height: '70%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FacebookModern
                    width={Math.min(500, window.innerWidth * 0.6)}
                    height={Math.min(400, window.innerHeight * 0.5)}
                    config={{
                      ...widget,
                      width: Math.min(500, window.innerWidth * 0.6),
                      height: Math.min(400, window.innerHeight * 0.5)
                    }}
                  />
                </div>
              </div>
            )}
            
            {isFacebook && !isFacebookPage && !isFacebookModern && (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png"
                    alt="Facebook"
                    style={{ width: 80, height: 80, objectFit: 'contain' }}
                  />
                </div>
                <p>Facebook Page Preview</p>
                {profileUrl ? (
                  <p>Connected to: {profileUrl}</p>
                ) : (
                  <p>{appLabels.noDataAvailable}</p>
                )}
              </div>
            )}
            
            {isYoutube && (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ 
                    width: 120, 
                    height: 80, 
                    background: '#ff0000', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto',
                    borderRadius: 8
                  }}>
                    <div style={{ color: '#fff', textAlign: 'center' }}>
                      <div style={{ marginBottom: 4, fontSize: 30 }}>▶</div>
                      <div style={{ fontSize: 12 }}>YouTube</div>
                    </div>
                  </div>
                </div>
                <p>YouTube Video Preview</p>
                {widget?.url ? (
                  <div>
                    <p>Video URL: {widget.url}</p>
                    <p>Quality: {widget.quality || 'Auto'}</p>
                    <p>Subtitle: {widget.subtitle || 'Default'}</p>
                  </div>
                ) : (
                  <p>{appLabels.noDataAvailable}</p>
                )}
              </div>
            )}
            
           
            
            {isFollowUs && (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png"
                    alt="Follow Us"
                    style={{ width: 80, height: 80, objectFit: 'contain' }}
                  />
                </div>
                <p>Follow Us Preview</p>
                <div style={{ width: '100%', height: '70%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FollowUs
                    width={Math.min(500, window.innerWidth * 0.6)}
                    height={Math.min(400, window.innerHeight * 0.5)}
                    config={{
                      ...widget,
                      width: Math.min(500, window.innerWidth * 0.6),
                      height: Math.min(400, window.innerHeight * 0.5)
                    }}
                  />
                </div>
              </div>
            )}
            
            {isTagbox && (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <div 
                    style={{ 
                      width: 200, 
                      height: 120, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: '1px solid #ddd',
                      borderRadius: 8,
                      background: '#f8f8f8'
                    }} 
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 'bold', color: '#8e44ad' }}>tagbox</div>
                      <div>Display</div>
                    </div>
                  </div>
                </div>
                <p>Tagbox Social Media Display</p>
                {profileUrl ? (
                  <p>Connected to: {profileUrl}</p>
                ) : (
                  <p>{appLabels.noDataAvailable}</p>
                )}
              </div>
            )}
            
            {isWallsIo && (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <div 
                    style={{ 
                      width: 200, 
                      height: 120, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: '1px solid #ddd',
                      borderRadius: 8,
                      background: '#1a1a1a'
                    }} 
                  >
                    <div style={{ textAlign: 'center', color: '#ffffff' }}>
                      <div style={{ fontWeight: 'bold', color: '#f39c12' }}>WALLS.IO</div>
                      <div>Social Media Wall</div>
                    </div>
                  </div>
                </div>
                <p>Walls.io Social Media Wall</p>
                {profileUrl ? (
                  <p>Connected to: {profileUrl}</p>
                ) : (
                  <p>{appLabels.noDataAvailable}</p>
                )}
              </div>
            )}
            
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialNetworkPreview;