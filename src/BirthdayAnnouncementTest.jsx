import React, { useState } from 'react';
import BirthdayAnnouncement from './widgets/meeting-calendar/BirthdayAnnouncement';
import BirthdayAnnouncementCustomizeModal from './widgets/meeting-calendar/BirthdayAnnouncementCustomizeModal';

const BirthdayAnnouncementTest = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentSettings, setCurrentSettings] = useState({
    textFont: 'Arial',
    titleFontColor: '#ffffff',
    cardFontColor: '#333333',
    customBackgroundColor: '',
    customBackgroundImage: '',
    disableBackground: false,
    disableAnimations: false,
    duration: 10,
    filteringOptions: "Show this week's birthdays",
    showCurrentMonth: false,
    hideDates: false
  });

  const [testWidget] = useState({
    birthdays: [
      { name: "John Smith", date: "Apr 10" },
      { name: "Emma Johnson", date: "Apr 11" },
      { name: "James Brown", date: "Apr 12" },
      { name: "Sarah Wilson", date: "Apr 13" },
      { name: "Mike Davis", date: "Apr 14" }
    ]
  });

  const handleSave = (newSettings) => {
    setCurrentSettings(newSettings);
    setShowModal(false);
  };

  const presetBackgrounds = [
    { name: 'Default Gradient', color: '', image: '' },
    { name: 'Blue Theme', color: '#2196F3', image: '' },
    { name: 'Purple Theme', color: '#9C27B0', image: '' },
    { name: 'Green Theme', color: '#4CAF50', image: '' },
    { name: 'Orange Theme', color: '#FF9800', image: '' },
    { name: 'Sample Image', color: '', image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=600&fit=crop' }
  ];

  return (
    <div style={{ 
      padding: '20px', 
      minHeight: '100vh', 
      background: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
          color: 'white',
          padding: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold' }}>
            🎉 Birthday Announcement Widget Test
          </h1>
          <p style={{ margin: '10px 0 0 0', fontSize: '1.1rem', opacity: 0.9 }}>
            Dynamic & Responsive iframe-based widget with live customization
          </p>
        </div>

        {/* Controls */}
        <div style={{ 
          padding: '20px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Quick Presets:</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {presetBackgrounds.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSettings(prev => ({
                    ...prev,
                    customBackgroundColor: preset.color,
                    customBackgroundImage: preset.image
                  }))}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '12px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#f0f0f0'}
                  onMouseOut={(e) => e.target.style.background = 'white'}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(25,118,210,0.3)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#1565c0'}
            onMouseOut={(e) => e.target.style.background = '#1976d2'}
          >
            🎨 Customize Widget
          </button>
        </div>

        {/* Widget Display Area */}
        <div style={{ padding: '30px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginBottom: '30px'
          }}>
            {/* Desktop View */}
            <div>
              <h3 style={{ marginBottom: '15px', color: '#333' }}>🖥️ Desktop View (400x300)</h3>
              <div style={{ 
                width: '400px', 
                height: '300px', 
                border: '2px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <BirthdayAnnouncement 
                  widget={testWidget}
                  settings={currentSettings}
                />
              </div>
            </div>

            {/* Tablet View */}
            <div>
              <h3 style={{ marginBottom: '15px', color: '#333' }}>📱 Tablet View (300x200)</h3>
              <div style={{ 
                width: '300px', 
                height: '200px', 
                border: '2px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <BirthdayAnnouncement 
                  widget={testWidget}
                  settings={currentSettings}
                />
              </div>
            </div>

            {/* Mobile View */}
            <div>
              <h3 style={{ marginBottom: '15px', color: '#333' }}>📱 Mobile View (250x150)</h3>
              <div style={{ 
                width: '250px', 
                height: '150px', 
                border: '2px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <BirthdayAnnouncement 
                  widget={testWidget}
                  settings={currentSettings}
                />
              </div>
            </div>
          </div>

          {/* Full Width Responsive Test */}
          <div>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>🔄 Full Width Responsive Test</h3>
            <div style={{ 
              width: '100%', 
              height: '250px', 
              border: '2px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              resize: 'both'
            }}>
              <BirthdayAnnouncement 
                widget={testWidget}
                settings={currentSettings}
              />
            </div>
            <p style={{ 
              fontSize: '12px', 
              color: '#666', 
              marginTop: '10px',
              fontStyle: 'italic'
            }}>
              💡 Try resizing this container by dragging the bottom-right corner to test responsiveness
            </p>
          </div>
        </div>

        {/* Settings Display */}
        <div style={{ 
          background: '#f8f9fa',
          padding: '20px',
          borderTop: '1px solid #eee'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>⚙️ Current Settings</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            fontSize: '14px'
          }}>
            <div><strong>Font:</strong> {currentSettings.textFont}</div>
            <div><strong>Title Color:</strong> <span style={{ color: currentSettings.titleFontColor }}>{currentSettings.titleFontColor}</span></div>
            <div><strong>Duration:</strong> {currentSettings.duration}s</div>
            <div><strong>Animations:</strong> {currentSettings.disableAnimations ? 'Disabled' : 'Enabled'}</div>
            <div><strong>Background Color:</strong> {currentSettings.customBackgroundColor || 'Default Gradient'}</div>
            <div><strong>Background Image:</strong> {currentSettings.customBackgroundImage ? 'Custom Image' : 'None'}</div>
          </div>
        </div>
      </div>

      {/* Customize Modal */}
      {showModal && (
        <BirthdayAnnouncementCustomizeModal
          widget={{ ...testWidget, ...currentSettings }}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          onBack={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default BirthdayAnnouncementTest;
