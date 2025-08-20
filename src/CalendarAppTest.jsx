import React, { useState } from 'react';
import CalendarApp from './widgets/meeting-calendar/CalendarApp';
import CalendarAppCustomizeModal from './widgets/meeting-calendar/CalendarAppCustomizeModal';

const CalendarAppTest = () => {
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [currentWidget, setCurrentWidget] = useState({
    id: 'test-calendar',
    appName: 'My Calendar',
    type: 'calendar-app',
    backgroundColor: '#8B4513',
    fontColor: '#ffffff',
    textFont: 'Arial',
    showTime: true,
    maxEvents: 5,
    displayEventsFor: 'Today',
    showIcon: true,
    textShadow: false,
    syncFrequency: 10,
    cyclingTimeInterval: 10,
    calendarTimeout: 50,
    showPastEvents: false,
    showEventsInPeriods: true,
    entranceAnimation: false,
    animateBackgroundImage: false
  });

  const mockEvents = [
    { title: "Team Standup", time: "9:00 AM - 9:30 AM" },
    { title: "Client Presentation", time: "11:00 AM - 12:00 PM" },
    { title: "Lunch Meeting", time: "1:00 PM - 2:00 PM" },
    { title: "Code Review", time: "3:00 PM - 4:00 PM" },
    { title: "Project Planning", time: "4:30 PM - 5:30 PM" }
  ];

  const presetThemes = [
    {
      name: "Corporate Blue",
      backgroundColor: "#1e3c72",
      fontColor: "#ffffff"
    },
    {
      name: "Forest Green", 
      backgroundColor: "#2d5016",
      fontColor: "#ffffff"
    },
    {
      name: "Sunset Orange",
      backgroundColor: "#cc5500", 
      fontColor: "#ffffff"
    },
    {
      name: "Deep Purple",
      backgroundColor: "#4a148c",
      fontColor: "#ffffff"
    }
  ];

  const handleSave = (widgetData) => {
    setCurrentWidget(widgetData);
    setShowCustomizeModal(false);
    console.log('Calendar App saved:', widgetData);
  };

  const applyPreset = (preset) => {
    setCurrentWidget(prev => ({
      ...prev,
      backgroundColor: preset.backgroundColor,
      fontColor: preset.fontColor
    }));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#1976d2', marginBottom: '20px' }}>Calendar App Widget Test</h1>
      
      {/* Controls */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={() => setShowCustomizeModal(true)}
          style={{
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Customize Calendar
        </button>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', color: '#333' }}>Quick Themes:</span>
          {presetThemes.map((preset, index) => (
            <button
              key={index}
              onClick={() => applyPreset(preset)}
              style={{
                background: preset.backgroundColor,
                color: preset.fontColor,
                border: 'none',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
              title={preset.name}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Widget Preview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        
        {/* Desktop View */}
        <div>
          <h3 style={{ color: '#333', marginBottom: '10px' }}>Desktop View (600x400)</h3>
          <div style={{ 
            width: '600px', 
            height: '400px', 
            border: '2px solid #ddd', 
            borderRadius: '8px', 
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <CalendarApp 
              widget={{
                ...currentWidget,
                events: mockEvents
              }}
              settings={currentWidget}
            />
          </div>
        </div>

        {/* Tablet View */}
        <div>
          <h3 style={{ color: '#333', marginBottom: '10px' }}>Tablet View (400x300)</h3>
          <div style={{ 
            width: '400px', 
            height: '300px', 
            border: '2px solid #ddd', 
            borderRadius: '8px', 
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <CalendarApp 
              widget={{
                ...currentWidget,
                events: mockEvents
              }}
              settings={currentWidget}
            />
          </div>
        </div>

        {/* Mobile View */}
        <div>
          <h3 style={{ color: '#333', marginBottom: '10px' }}>Mobile View (300x400)</h3>
          <div style={{ 
            width: '300px', 
            height: '400px', 
            border: '2px solid #ddd', 
            borderRadius: '8px', 
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <CalendarApp 
              widget={{
                ...currentWidget,
                events: mockEvents
              }}
              settings={currentWidget}
            />
          </div>
        </div>

        {/* Square View */}
        <div>
          <h3 style={{ color: '#333', marginBottom: '10px' }}>Square View (350x350)</h3>
          <div style={{ 
            width: '350px', 
            height: '350px', 
            border: '2px solid #ddd', 
            borderRadius: '8px', 
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <CalendarApp 
              widget={{
                ...currentWidget,
                events: mockEvents
              }}
              settings={currentWidget}
            />
          </div>
        </div>
      </div>

      {/* Current Settings Display */}
      <div style={{ 
        background: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '8px', 
        border: '1px solid #e9ecef' 
      }}>
        <h3 style={{ color: '#333', marginBottom: '10px' }}>Current Settings</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '14px' }}>
          <div><strong>App Name:</strong> {currentWidget.appName}</div>
          <div><strong>Background:</strong> {currentWidget.backgroundColor}</div>
          <div><strong>Font Color:</strong> {currentWidget.fontColor}</div>
          <div><strong>Font:</strong> {currentWidget.textFont}</div>
          <div><strong>Show Time:</strong> {currentWidget.showTime ? 'Yes' : 'No'}</div>
          <div><strong>Max Events:</strong> {currentWidget.maxEvents}</div>
          <div><strong>Display For:</strong> {currentWidget.displayEventsFor}</div>
          <div><strong>Show Icon:</strong> {currentWidget.showIcon ? 'Yes' : 'No'}</div>
        </div>
      </div>

      {/* Customize Modal */}
      {showCustomizeModal && (
        <CalendarAppCustomizeModal
          widget={currentWidget}
          onClose={() => setShowCustomizeModal(false)}
          onSave={handleSave}
          onBack={() => setShowCustomizeModal(false)}
        />
      )}
    </div>
  );
};

export default CalendarAppTest;
