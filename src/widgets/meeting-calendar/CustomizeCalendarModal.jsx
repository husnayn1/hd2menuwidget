import React, { useState, useEffect } from "react";
import CalendarApp from './CalendarApp';

function CustomizeCalendarModal({ widget, onClose, onSave, onBack }) {
  console.log("CustomizeCalendarModal opened with widget:", widget);
  const [appName, setAppName] = useState("");
  const [tags, setTags] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#8B4513");
  const [fontColor, setFontColor] = useState("#ffffff");
  const [textFont, setTextFont] = useState("Arial");
  const [highlightColor, setHighlightColor] = useState("#FFD700");
  const [showEachDataFor, setShowEachDataFor] = useState(15);
  const [transitionSpeed, setTransitionSpeed] = useState(0.7);
  const [disableAnimations, setDisableAnimations] = useState(false);
  // Additional calendar-specific options
  const [eventTitleColor, setEventTitleColor] = useState("#ffffff");
  const [eventTimeColor, setEventTimeColor] = useState("#ffffff");
  const [eventBackgroundColor, setEventBackgroundColor] = useState("#654321");
  const [eventBorderColor, setEventBorderColor] = useState("#8B4513");
  const [eventCornerRadius, setEventCornerRadius] = useState(8);
  const [headerFontSize, setHeaderFontSize] = useState(28);
  const [eventTitleFontSize, setEventTitleFontSize] = useState(16);
  const [eventTimeFontSize, setEventTimeFontSize] = useState(14);
  
  // New settings from requirements
  const [language, setLanguage] = useState("en");
  const [calendarUrl, setCalendarUrl] = useState("");
  const [displayEventsFor, setDisplayEventsFor] = useState("today");
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [showEventsInPeriods, setShowEventsInPeriods] = useState(false);
  const [showTime, setShowTime] = useState(true);
  const [maxEvents, setMaxEvents] = useState(5);
  const [syncFrequency, setSyncFrequency] = useState(10);
  const [cyclingTimeInterval, setCyclingTimeInterval] = useState(10);
  const [calendarTimeout, setCalendarTimeout] = useState(50);
  const [textShadow, setTextShadow] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [entranceAnimation, setEntranceAnimation] = useState("fade");
  const [animateBackgroundImage, setAnimateBackgroundImage] = useState(false);
  const [viewMode, setViewMode] = useState("day"); // 'day', 'week', 'month'
  
  // Calendar data state
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    startTime: '',
    endTime: '',
    date: '',
    location: ''
  });
  
  const [activeTab, setActiveTab] = useState('settings');
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);

  // Font options
  const fontOptions = [
    "Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana",
    "Tahoma", "Trebuchet MS", "Arial Black", "Impact", "Comic Sans MS",
    "Courier New", "Lucida Console", "Palatino", "Garamond", "Bookman"
  ];

  // Event status colors
  const eventStatusColors = [
    { label: "Default", value: "#654321" },
    { label: "Ongoing", value: "#FF6B35" },
    { label: "Next", value: "#4CAF50" },
    { label: "Last", value: "#2196F3" },
    { label: "Busy", value: "#e74c3c" }
  ];

  // Initialize form fields with existing widget values when editing
  useEffect(() => {
    if (widget) {
      console.log("Loading calendar widget data:", widget);
      
      if (widget.appName) {
        setAppName(widget.appName);
      }
      setTags(widget.tags || "");
      setBackgroundColor(widget.backgroundColor || "#8B4513");
      setFontColor(widget.fontColor || "#ffffff");
      setTextFont(widget.textFont || "Arial");
      setHighlightColor(widget.highlightColor || "#FFD700");
      setShowEachDataFor(widget.showEachDataFor || 15);
      setTransitionSpeed(widget.transitionSpeed || 0.7);
      setDisableAnimations(widget.disableAnimations || false);
      // Additional calendar-specific options
      setEventTitleColor(widget.eventTitleColor || "#ffffff");
      setEventTimeColor(widget.eventTimeColor || "#ffffff");
      setEventBackgroundColor(widget.eventBackgroundColor || "#654321");
      setEventBorderColor(widget.eventBorderColor || "#8B4513");
      setEventCornerRadius(widget.eventCornerRadius || 8);
      setHeaderFontSize(widget.headerFontSize || 28);
      setEventTitleFontSize(widget.eventTitleFontSize || 16);
      setEventTimeFontSize(widget.eventTimeFontSize || 14);
      
      // New settings from requirements
      setLanguage(widget.language || "en");
      setCalendarUrl(widget.calendarUrl || "");
      setDisplayEventsFor(widget.displayEventsFor || "today");
      setShowPastEvents(widget.showPastEvents || false);
      setShowEventsInPeriods(widget.showEventsInPeriods || false);
      setShowTime(widget.showTime || true);
      setMaxEvents(widget.maxEvents || 5);
      setSyncFrequency(widget.syncFrequency || 10);
      setCyclingTimeInterval(widget.cyclingTimeInterval || 10);
      setCalendarTimeout(widget.calendarTimeout || 50);
      setTextShadow(widget.textShadow || false);
      setShowIcon(widget.showIcon || true);
      setBackgroundImage(widget.backgroundImage || "");
      setEntranceAnimation(widget.entranceAnimation || "fade");
      setAnimateBackgroundImage(widget.animateBackgroundImage || false);
      setViewMode(widget.viewMode || "day");
      
      // Initialize events data
      setEvents(widget.events || []);
    }
  }, [widget]);

  const handleSave = () => {
    const widgetData = {
      ...widget,
      appName: appName || widget?.name,
      tags,
      backgroundColor,
      fontColor,
      textFont,
      highlightColor,
      showEachDataFor,
      transitionSpeed,
      disableAnimations,
      // Additional calendar-specific options
      eventTitleColor,
      eventTimeColor,
      eventBackgroundColor,
      eventBorderColor,
      eventCornerRadius,
      headerFontSize,
      eventTitleFontSize,
      eventTimeFontSize,
      // New settings from requirements
      language,
      calendarUrl,
      displayEventsFor,
      showPastEvents,
      showEventsInPeriods,
      showTime,
      maxEvents,
      syncFrequency,
      cyclingTimeInterval,
      calendarTimeout,
      textShadow,
      showIcon,
      backgroundImage,
      entranceAnimation,
      animateBackgroundImage,
      viewMode,
      events,
      type: "meeting-calendar"
    };

    console.log("Saving calendar widget:", widgetData);
    onSave(widgetData);
  };

  const handlePreview = () => {
    setShowFullscreenPreview(true);
  };

  const handleClosePreview = () => setShowFullscreenPreview(false);
  
  // Event management functions
  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.startTime) {
      setEvents([...events, { ...newEvent, id: Date.now() }]);
      setNewEvent({
        title: '',
        startTime: '',
        endTime: '',
        date: '',
        location: ''
      });
    }
  };
  
  const handleRemoveEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  // Get widget preview data
  const getWidgetPreviewData = () => {
    return {
      ...widget,
      backgroundColor,
      fontColor,
      textFont,
      highlightColor,
      // Additional calendar-specific options
      eventTitleColor,
      eventTimeColor,
      eventBackgroundColor,
      eventBorderColor,
      eventCornerRadius,
      headerFontSize,
      eventTitleFontSize,
      eventTimeFontSize,
      // New settings from requirements
      language,
      calendarUrl,
      displayEventsFor,
      showPastEvents,
      showEventsInPeriods,
      showTime,
      maxEvents,
      syncFrequency,
      cyclingTimeInterval,
      calendarTimeout,
      textShadow,
      showIcon,
      backgroundImage,
      entranceAnimation,
      animateBackgroundImage,
      viewMode,
      events
    };
  };

  // Add a function to get the dynamic description for the current app
  function getAppDescription(appName) {
    const name = (appName || '').toLowerCase();
    if (name.includes('meeting room calendar app')) {
      return 'Display meeting room availability and schedules.';
    } else if (name.includes('meeting room calendar bar')) {
      return 'Compact view of meeting room status.';
    } else if (name.includes('events calendar')) {
      return 'Show daily events and schedules in calendar format.';
    } else {
      return 'Meeting Room & Calendar widget.';
    }
  }

  return (
    <>
      {showFullscreenPreview ? (
        <div>
          <button
            onClick={handleClosePreview}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 28,
              height: 28,
              fontSize: 18,
              cursor: 'pointer',
              zIndex: 1001
            }}
            aria-label="Close preview"
          >
            ×
          </button>
          <CalendarApp
            widget={getWidgetPreviewData()}
            settings={{
              backgroundColor,
              fontColor,
              textFont,
              highlightColor,
              showEachDataFor,
              transitionSpeed,
              disableAnimations,
              // Additional calendar-specific options
              eventTitleColor,
              eventTimeColor,
              eventBackgroundColor,
              eventBorderColor,
              eventCornerRadius,
              headerFontSize,
              eventTitleFontSize,
              eventTimeFontSize
            }}
          />
        </div>
      ) : (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 4px 32px rgba(0,0,0,0.10)', display: 'flex', minWidth: 900, minHeight: 600, maxWidth: '90vw', maxHeight: '90vh', overflow: 'hidden' }}>
          {/* Back button */}
          <button onClick={onBack} style={{ position: 'absolute', top: 18, left: 18, fontSize: 28, background: 'none', border: 'none', cursor: 'pointer', color: '#1976d2', zIndex: 10 }} aria-label="Back to gallery">&#8592;</button>
          
          {/* Close button */}
          <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, fontSize: 22, background: 'none', border: 'none', cursor: 'pointer', color: '#1976d2', zIndex: 10 }}>×</button>
          
            {/* Left Panel: Only image, back button, and description */}
            <div style={{ width: 360, padding: 32, borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f8f8f8', position: 'relative' }}>
              {/* Back button */}
              <button onClick={onBack} style={{ position: 'absolute', top: 18, left: 18, fontSize: 28, background: 'none', border: 'none', cursor: 'pointer', color: '#1976d2', zIndex: 10 }} aria-label="Back to gallery">&#8592;</button>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1976d2', marginBottom: 18, marginTop: 10 }}>
                {appName || widget?.name || 'Calendar App'}
              </div>
              <div style={{ width: 320, height: 240, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {widget?.image ? (
                  <img src={widget.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 8 }} />
                ) : (
                  <div style={{ color: '#bbb', fontSize: 18, textAlign: 'center' }}>No preview image</div>
                )}
                </div>
              <div style={{ color: '#666', fontSize: 14, textAlign: 'center', marginBottom: 15 }}>
                {getAppDescription(appName || widget?.name)}
            </div>
          </div>
          
          {/* Right Panel - Settings and Customization */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: '#fff' }}>
            {/* Header */}
            <div style={{ padding: '20px 20px 0 20px', borderBottom: '1px solid #eee' }}>
              <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#1976d2' }}>
                Customize App
              </div>
              
              {/* Tabs */}
              <div style={{ marginBottom: 15 }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #ddd' }}>
                  <div 
                    style={{ 
                      padding: '6px 12px', 
                      background: activeTab === 'settings' ? '#fff' : '#f5f5f5', 
                      color: activeTab === 'settings' ? '#1976d2' : '#666', 
                      borderBottom: activeTab === 'settings' ? '2px solid #1976d2' : 'none',
                      fontWeight: 'bold',
                      fontSize: 14,
                      cursor: 'pointer'
                    }}
                    onClick={() => setActiveTab('settings')}
                  >
                    Settings
                  </div>
                  <div 
                    style={{ 
                      padding: '6px 12px', 
                      background: activeTab === 'language' ? '#fff' : '#f5f5f5', 
                      color: activeTab === 'language' ? '#1976d2' : '#666',
                      borderBottom: activeTab === 'language' ? '2px solid #1976d2' : 'none',
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: activeTab === 'language' ? 'bold' : 'normal'
                    }}
                    onClick={() => setActiveTab('language')}
                  >
                    Language
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                {/* Always show full calendar form for all widgets */}
                {activeTab === 'settings' && !showFullscreenPreview && (
                <>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>App name</div>
                    <input 
                      value={appName} 
                      onChange={e => setAppName(e.target.value)} 
                      placeholder="Enter a name for this app" 
                      style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                    />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Tags <span style={{ color: '#888', fontWeight: 'normal' }}>(optional)</span></div>
                    <input 
                      value={tags} 
                      onChange={e => setTags(e.target.value)} 
                      placeholder="Select a tag or enter a new one" 
                      style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                    />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Background Color</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={e => setBackgroundColor(e.target.value)}
                        style={{ width: 32, height: 28, border: '1px solid #ccc', borderRadius: 4 }}
                      />
                      <input 
                        value={backgroundColor} 
                        onChange={e => setBackgroundColor(e.target.value)} 
                        placeholder="Enter color code"
                        style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                      />
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Font Color</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input 
                        type="color" 
                        value={fontColor} 
                        onChange={e => setFontColor(e.target.value)} 
                        style={{ width: 32, height: 28, border: '1px solid #ccc', borderRadius: 4 }} 
                      />
                      <input 
                        value={fontColor} 
                        onChange={e => setFontColor(e.target.value)} 
                        placeholder="Enter color code"
                        style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                      />
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Highlight Color</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input 
                        type="color" 
                        value={highlightColor} 
                        onChange={e => setHighlightColor(e.target.value)} 
                        style={{ width: 32, height: 28, border: '1px solid #ccc', borderRadius: 4 }} 
                      />
                      <input 
                        value={highlightColor} 
                        onChange={e => setHighlightColor(e.target.value)} 
                        placeholder="Enter color code"
                        style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                      />
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Text font <span style={{ color: '#888', fontWeight: 'normal' }}>(optional)</span></div>
                    <select 
                      value={textFont} 
                      onChange={e => setTextFont(e.target.value)} 
                      style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                    >
                      <option value="">Click here to select a font</option>
                      {fontOptions.map(font => <option key={font} value={font}>{font}</option>)}
                    </select>
                    <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>Change the font used to show the text.</div>
                  </div>
                  
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Show each data for (seconds)</div>
                    <input 
                      type="number" 
                      value={showEachDataFor} 
                      onChange={e => setShowEachDataFor(parseInt(e.target.value) || 15)} 
                      min="1"
                      style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                    />
                  </div>
                  
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Transition speed (seconds)</div>
                    <input 
                      type="number" 
                      value={transitionSpeed} 
                      onChange={e => setTransitionSpeed(parseFloat(e.target.value) || 0.7)} 
                      min="0.1"
                      step="0.1"
                      style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                    />
                  </div>
                  
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Disable animations</div>
                    <select
                      value={disableAnimations}
                      onChange={e => setDisableAnimations(e.target.value === 'true')}
                      style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                    >
                      <option value={false}>No</option>
                      <option value={true}>Yes</option>
                    </select>
                  </div>
                  
                  {/* Calendar-specific customization options */}
                  <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #eee' }}>
                    <h3 style={{ fontWeight: 'bold', marginBottom: 12, fontSize: 16, color: '#1976d2' }}>Calendar Customization</h3>
                    
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Header Font Size</div>
                      <input
                        type="number"
                        value={headerFontSize}
                        onChange={e => setHeaderFontSize(parseInt(e.target.value) || 28)}
                        min="12"
                        max="48"
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Event Title Font Size</div>
                      <input
                        type="number"
                        value={eventTitleFontSize}
                        onChange={e => setEventTitleFontSize(parseInt(e.target.value) || 16)}
                        min="10"
                        max="32"
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Event Time Font Size</div>
                      <input
                        type="number"
                        value={eventTimeFontSize}
                        onChange={e => setEventTimeFontSize(parseInt(e.target.value) || 14)}
                        min="8"
                        max="24"
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Event Title Color</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input
                          type="color"
                          value={eventTitleColor}
                          onChange={e => setEventTitleColor(e.target.value)}
                          style={{ width: 32, height: 28, border: '1px solid #ccc', borderRadius: 4 }}
                        />
                        <input
                          value={eventTitleColor}
                          onChange={e => setEventTitleColor(e.target.value)}
                          placeholder="Enter color code"
                          style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                        />
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Event Time Color</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input
                          type="color"
                          value={eventTimeColor}
                          onChange={e => setEventTimeColor(e.target.value)}
                          style={{ width: 32, height: 28, border: '1px solid #ccc', borderRadius: 4 }}
                        />
                        <input
                          value={eventTimeColor}
                          onChange={e => setEventTimeColor(e.target.value)}
                          placeholder="Enter color code"
                          style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                        />
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Event Background Color</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input
                          type="color"
                          value={eventBackgroundColor}
                          onChange={e => setEventBackgroundColor(e.target.value)}
                          style={{ width: 32, height: 28, border: '1px solid #ccc', borderRadius: 4 }}
                        />
                        <input
                          value={eventBackgroundColor}
                          onChange={e => setEventBackgroundColor(e.target.value)}
                          placeholder="Enter color code"
                          style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                        />
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Event Border Color</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input
                          type="color"
                          value={eventBorderColor}
                          onChange={e => setEventBorderColor(e.target.value)}
                          style={{ width: 32, height: 28, border: '1px solid #ccc', borderRadius: 4 }}
                        />
                        <input
                          value={eventBorderColor}
                          onChange={e => setEventBorderColor(e.target.value)}
                          placeholder="Enter color code"
                          style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                        />
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Event Corner Radius</div>
                      <input
                        type="number"
                        value={eventCornerRadius}
                        onChange={e => setEventCornerRadius(parseInt(e.target.value) || 8)}
                        min="0"
                        max="20"
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                      />
                    </div>
                  </div>
                  
                  {/* Events Data Management */}
                  <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #eee' }}>
                    <h3 style={{ fontWeight: 'bold', marginBottom: 12, fontSize: 16, color: '#1976d2' }}>Events Data</h3>
                    
                    {/* Add New Event Form */}
                    <div style={{ marginBottom: 20, padding: 15, border: '1px solid #eee', borderRadius: 8, backgroundColor: '#f9f9f9' }}>
                      <h4 style={{ fontWeight: 'bold', marginBottom: 10, fontSize: 14 }}>Add New Event</h4>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                        <div>
                          <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 12 }}>Event Title</div>
                          <input
                            value={newEvent.title}
                            onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                            placeholder="Event title"
                            style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                          />
                        </div>
                        
                        <div>
                          <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 12 }}>Date</div>
                          <input
                            type="date"
                            value={newEvent.date}
                            onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                            style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                          />
                        </div>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                        <div>
                          <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 12 }}>Start Time</div>
                          <input
                            type="time"
                            value={newEvent.startTime}
                            onChange={e => setNewEvent({ ...newEvent, startTime: e.target.value })}
                            style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                          />
                        </div>
                        
                        <div>
                          <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 12 }}>End Time</div>
                          <input
                            type="time"
                            value={newEvent.endTime}
                            onChange={e => setNewEvent({ ...newEvent, endTime: e.target.value })}
                            style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                          />
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 12 }}>Location</div>
                        <input
                          value={newEvent.location}
                          onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                          placeholder="Event location"
                          style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                        />
                      </div>
                      
                      <button
                        onClick={handleAddEvent}
                        disabled={!newEvent.title || !newEvent.date || !newEvent.startTime}
                        style={{
                          background: (!newEvent.title || !newEvent.date || !newEvent.startTime) ? '#ccc' : '#4CAF50',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 4,
                          padding: '8px 16px',
                          fontWeight: 'bold',
                          fontSize: 14,
                          cursor: (!newEvent.title || !newEvent.date || !newEvent.startTime) ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Add Event
                      </button>
                    </div>
                    
                    {/* Events List */}
                    <div>
                      <h4 style={{ fontWeight: 'bold', marginBottom: 10, fontSize: 14 }}>Current Events</h4>
                      {events.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#666', padding: 20 }}>
                          No events added yet
                        </div>
                      ) : (
                        <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                          {events.map((event) => (
                            <div key={event.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottom: '1px solid #eee' }}>
                              <div>
                                <div style={{ fontWeight: 'bold', fontSize: 14 }}>{event.title}</div>
                                <div style={{ fontSize: 12, color: '#666' }}>
                                  {event.date} | {event.startTime} - {event.endTime || 'N/A'} | {event.location || 'No location'}
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveEvent(event.id)}
                                style={{
                                  background: '#f44336',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: 4,
                                  padding: '4px 8px',
                                  fontSize: 12,
                                  cursor: 'pointer'
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              
              {activeTab === 'language' && (
                <div style={{ textAlign: 'center', color: '#666', padding: '40px 20px' }}>
                  Language settings will be available here.
                </div>
              )}
              </div>
              {/* Action Buttons - Fixed at bottom of right panel */}
              <div style={{ padding: '15px 20px', borderTop: '1px solid #eee', background: '#fff', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  onClick={handlePreview}
                  style={{
                    background: (!appName.trim()) ? '#ccc' : '#1976d2',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '8px 20px',
                    fontWeight: 'bold',
                    fontSize: 14,
                    cursor: (!appName.trim()) ? 'not-allowed' : 'pointer'
                  }}
                  disabled={!appName.trim()}
                >
                  Preview
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    background: '#ff8800',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '8px 20px',
                    fontWeight: 'bold',
                    fontSize: 14,
                    cursor: 'pointer'
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CustomizeCalendarModal;