import React, { useState, useEffect } from "react";
import CalendarApp from './CalendarApp';

function CalendarAppCustomizeModal({ widget, onClose, onSave, onBack }) {
  const [appName, setAppName] = useState("");
  const [tags, setTags] = useState("");
  const [title, setTitle] = useState("");
  const [calendarUrl, setCalendarUrl] = useState("");
  const [displayEventsFor, setDisplayEventsFor] = useState("Today");
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [showEventsInPeriods, setShowEventsInPeriods] = useState(true);
  const [showTime, setShowTime] = useState(true);
  const [maxEvents, setMaxEvents] = useState(5);
  const [syncFrequency, setSyncFrequency] = useState(10);
  const [cyclingTimeInterval, setCyclingTimeInterval] = useState(10);
  const [calendarTimeout, setCalendarTimeout] = useState(50);
  const [textFont, setTextFont] = useState("Arial");
  const [textShadow, setTextShadow] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("#8B4513");
  const [fontColor, setFontColor] = useState("#ffffff");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [entranceAnimation, setEntranceAnimation] = useState(false);
  const [animateBackgroundImage, setAnimateBackgroundImage] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [errors, setErrors] = useState({});

  const fontOptions = [
    "Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana",
    "Tahoma", "Trebuchet MS", "Arial Black", "Impact", "Comic Sans MS"
  ];

  const displayOptions = ["Today", "Week", "Month"];

  useEffect(() => {
    if (widget) {
      setAppName(widget.appName || "");
      setTags(widget.tags || "");
      setTitle(widget.title || "");
      setCalendarUrl(widget.calendarUrl || "");
      setDisplayEventsFor(widget.displayEventsFor || "Today");
      setShowPastEvents(widget.showPastEvents || false);
      setShowEventsInPeriods(widget.showEventsInPeriods || true);
      setShowTime(widget.showTime || true);
      setMaxEvents(widget.maxEvents || 5);
      setSyncFrequency(widget.syncFrequency || 10);
      setCyclingTimeInterval(widget.cyclingTimeInterval || 10);
      setCalendarTimeout(widget.calendarTimeout || 50);
      setTextFont(widget.textFont || "Arial");
      setTextShadow(widget.textShadow || false);
      setShowIcon(widget.showIcon || true);
      setBackgroundColor(widget.backgroundColor || "#8B4513");
      setFontColor(widget.fontColor || "#ffffff");
      setBackgroundImage(widget.backgroundImage || "");
      setEntranceAnimation(widget.entranceAnimation || false);
      setAnimateBackgroundImage(widget.animateBackgroundImage || false);
    }
  }, [widget]);

  const validateForm = () => {
    const newErrors = {};
    if (!appName.trim()) {
      newErrors.appName = "This field is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = () => {
    if (validateForm()) {
      setShowPreviewModal(true);
    }
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const widgetData = {
      ...widget,
      appName: appName.trim(),
      tags: tags.trim(),
      title: title.trim(),
      calendarUrl: calendarUrl.trim(),
      displayEventsFor,
      showPastEvents,
      showEventsInPeriods,
      showTime,
      maxEvents,
      syncFrequency,
      cyclingTimeInterval,
      calendarTimeout,
      textFont,
      textShadow,
      showIcon,
      backgroundColor,
      fontColor,
      backgroundImage,
      entranceAnimation,
      animateBackgroundImage,
      type: "calendar-app"
    };

    onSave(widgetData);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', borderRadius: 8, width: '90vw', maxWidth: 900, height: '90vh', display: 'flex', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
        
        <button onClick={onBack} style={{ position: 'absolute', top: 18, left: 18, fontSize: 28, background: 'none', border: 'none', cursor: 'pointer', color: '#1976d2', zIndex: 10 }} aria-label="Back to gallery">&#8592;</button>
        <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, fontSize: 22, background: 'none', border: 'none', cursor: 'pointer', color: '#1976d2', zIndex: 10 }}>×</button>
        
        {/* Left Panel - Preview */}
        <div style={{ width: 300, padding: 20, borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f8f8f8', position: 'relative' }}>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1976d2', marginBottom: 15, marginTop: 20 }}>
            Calendar App
          </div>
          
          <div style={{ width: 260, height: 180, background: 'linear-gradient(135deg, #8B4513 0%, #654321 100%)', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 15, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px 15px', background: 'linear-gradient(90deg, #8B4513, #654321)', borderBottom: '1px solid #654321', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: '#FFD700', fontSize: 12, fontWeight: 'bold' }}>Calendar App</div>
              <div style={{ width: 20, height: 20, background: '#FFD700', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>📅</div>
            </div>
            
            <div style={{ flex: 1, padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ background: '#654321', border: '1px solid #8B4513', borderRadius: 6, padding: '8px 10px' }}>
                <div style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>Ongoing event</div>
                <div style={{ color: 'white', fontSize: 9, opacity: 0.9 }}>5:00 PM - 6:40 PM</div>
              </div>
              
              <div style={{ background: '#654321', border: '1px solid #8B4513', borderRadius: 6, padding: '8px 10px' }}>
                <div style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>Next event</div>
                <div style={{ color: 'white', fontSize: 9, opacity: 0.9 }}>6:40 PM - 8:20 PM</div>
              </div>
              
              <div style={{ background: '#654321', border: '1px solid #8B4513', borderRadius: 6, padding: '8px 10px' }}>
                <div style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>Last event</div>
                <div style={{ color: 'white', fontSize: 9, opacity: 0.9 }}>8:30 PM - 10:10 PM</div>
              </div>
            </div>
          </div>
          
          <div style={{ color: '#666', fontSize: 12, textAlign: 'center', marginBottom: 10 }}>
            Present your calendar events on your signage screens! Connect Google Calendar, Outlook Live, or any iCal calendaring server.
          </div>
          
          <div style={{ marginTop: 15 }}>
            <div style={{ fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>
              Better Viewed Like This
            </div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ width: 40, height: 28, backgroundColor: '#e0e0e0', borderRadius: 3, border: '1px solid #ccc' }}></div>
              <div style={{ width: 32, height: 36, backgroundColor: '#e0e0e0', borderRadius: 3, border: '1px solid #ccc' }}></div>
              <div style={{ width: 36, height: 24, backgroundColor: '#e0e0e0', borderRadius: 3, border: '1px solid #ccc' }}></div>
              <div style={{ width: 44, height: 28, backgroundColor: '#e0e0e0', borderRadius: 3, border: '1px solid #ccc' }}></div>
            </div>
          </div>
        </div>
        
        {/* Right Panel - Settings */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 20px 15px 20px', borderBottom: '1px solid #eee' }}>
            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15, textAlign: 'center' }}>
              Customize App
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ display: 'flex', background: '#f0f0f0', borderRadius: 6, padding: 2 }}>
                <div 
                  style={{
                    padding: '8px 16px',
                    borderRadius: 4,
                    cursor: 'pointer',
                    background: activeTab === 'settings' ? '#1976d2' : 'transparent',
                    color: activeTab === 'settings' ? '#fff' : '#666',
                    fontWeight: activeTab === 'settings' ? 'bold' : 'normal'
                  }}
                  onClick={() => setActiveTab('settings')}
                >
                  Settings
                </div>
                <div 
                  style={{
                    padding: '8px 16px',
                    borderRadius: 4,
                    cursor: 'pointer',
                    background: activeTab === 'language' ? '#1976d2' : 'transparent',
                    color: activeTab === 'language' ? '#fff' : '#666',
                    fontWeight: activeTab === 'language' ? 'bold' : 'normal'
                  }}
                  onClick={() => setActiveTab('language')}
                >
                  Language
                </div>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            {activeTab === 'settings' && (
              <>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>App name</div>
                  <input 
                    value={appName} 
                    onChange={e => {
                      setAppName(e.target.value);
                      if (errors.appName && e.target.value.trim()) {
                        setErrors(prev => ({ ...prev, appName: '' }));
                      }
                    }} 
                    placeholder="Enter a name for this app" 
                    style={{ 
                      width: '100%', 
                      padding: 6, 
                      borderRadius: 4, 
                      border: errors.appName ? '1px solid #e74c3c' : '1px solid #ccc', 
                      fontSize: 14 
                    }} 
                  />
                  {errors.appName && (
                    <div style={{ color: '#e74c3c', fontSize: 12, marginTop: 4 }}>
                      {errors.appName}
                    </div>
                  )}
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
                  <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Title</div>
                  <input 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder="Enter title" 
                    style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                  />
                </div>

                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 3, fontSize: 13 }}>Calendar URL (iCal)</div>
                  <input 
                    value={calendarUrl} 
                    onChange={e => setCalendarUrl(e.target.value)} 
                    placeholder="Enter calendar URL" 
                    style={{ width: '100%', padding: 5, borderRadius: 4, border: '1px solid #ccc', fontSize: 13 }} 
                  />
                </div>

                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 3, fontSize: 13 }}>Display events for</div>
                  <select 
                    value={displayEventsFor} 
                    onChange={e => setDisplayEventsFor(e.target.value)} 
                    style={{ width: '100%', padding: 5, borderRadius: 4, border: '1px solid #ccc', fontSize: 13 }}
                  >
                    {displayOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input type="checkbox" checked={showPastEvents} onChange={e => setShowPastEvents(e.target.checked)} />
                    <span style={{ fontSize: 13 }}>Show past events</span>
                  </label>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input type="checkbox" checked={showEventsInPeriods} onChange={e => setShowEventsInPeriods(e.target.checked)} />
                    <span style={{ fontSize: 13 }}>Present events in periods</span>
                  </label>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input type="checkbox" checked={showTime} onChange={e => setShowTime(e.target.checked)} />
                    <span style={{ fontSize: 13 }}>Show time</span>
                  </label>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 3, fontSize: 13 }}>Max events</div>
                  <input 
                    type="number" value={maxEvents} onChange={e => setMaxEvents(parseInt(e.target.value) || 5)} 
                    min="1" max="16" style={{ width: '100%', padding: 5, borderRadius: 4, border: '1px solid #ccc', fontSize: 13 }} 
                  />
                </div>

                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 3, fontSize: 13 }}>Sync frequency (min)</div>
                  <input 
                    type="number" value={syncFrequency} onChange={e => setSyncFrequency(parseInt(e.target.value) || 10)} 
                    min="1" style={{ width: '100%', padding: 5, borderRadius: 4, border: '1px solid #ccc', fontSize: 13 }} 
                  />
                </div>

                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 3, fontSize: 13 }}>Cycling interval (sec)</div>
                  <input 
                    type="number" value={cyclingTimeInterval} onChange={e => setCyclingTimeInterval(parseInt(e.target.value) || 10)} 
                    min="1" style={{ width: '100%', padding: 5, borderRadius: 4, border: '1px solid #ccc', fontSize: 13 }} 
                  />
                </div>

                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 3, fontSize: 13 }}>Timeout (min)</div>
                  <input 
                    type="number" value={calendarTimeout} onChange={e => setCalendarTimeout(parseInt(e.target.value) || 50)} 
                    min="1" style={{ width: '100%', padding: 5, borderRadius: 4, border: '1px solid #ccc', fontSize: 13 }} 
                  />
                </div>

                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 3, fontSize: 13 }}>Text font</div>
                  <select 
                    value={textFont} onChange={e => setTextFont(e.target.value)} 
                    style={{ width: '100%', padding: 5, borderRadius: 4, border: '1px solid #ccc', fontSize: 13 }}
                  >
                    <option value="">Select font</option>
                    {fontOptions.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input type="checkbox" checked={textShadow} onChange={e => setTextShadow(e.target.checked)} />
                    <span style={{ fontSize: 13 }}>Text shadow</span>
                  </label>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input type="checkbox" checked={showIcon} onChange={e => setShowIcon(e.target.checked)} />
                    <span style={{ fontSize: 13 }}>Show icon</span>
                  </label>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 3, fontSize: 13 }}>Background color</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input 
                      type="color" value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)} 
                      style={{ width: 28, height: 24, border: '1px solid #ccc', borderRadius: 3 }} 
                    />
                    <input 
                      value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)} 
                      style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: 13 }} 
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 3, fontSize: 13 }}>Text color</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input 
                      type="color" value={fontColor} onChange={e => setFontColor(e.target.value)} 
                      style={{ width: 28, height: 24, border: '1px solid #ccc', borderRadius: 3 }} 
                    />
                    <input 
                      value={fontColor} onChange={e => setFontColor(e.target.value)} 
                      style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: 13 }} 
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 3, fontSize: 13 }}>Background Image</div>
                  <input 
                    value={backgroundImage} onChange={e => setBackgroundImage(e.target.value)} 
                    placeholder="Enter image URL" 
                    style={{ width: '100%', padding: 5, borderRadius: 4, border: '1px solid #ccc', fontSize: 13 }} 
                  />
                </div>

                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input type="checkbox" checked={entranceAnimation} onChange={e => setEntranceAnimation(e.target.checked)} />
                    <span style={{ fontSize: 13 }}>Entrance animation</span>
                  </label>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input type="checkbox" checked={animateBackgroundImage} onChange={e => setAnimateBackgroundImage(e.target.checked)} />
                    <span style={{ fontSize: 13 }}>Animate background</span>
                  </label>
                </div>
              </>
            )}
            
            {activeTab === 'language' && (
              <div style={{ textAlign: 'center', color: '#666', padding: '40px 20px' }}>
                Language settings will be available here.
              </div>
            )}
          </div>

          <div style={{ padding: '15px 20px', borderTop: '1px solid #eee', background: '#fff', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              onClick={handlePreview}
              style={{
                background: '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                padding: '8px 20px',
                fontWeight: 'bold',
                fontSize: 14,
                cursor: 'pointer'
              }}
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

      {showPreviewModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#fff', borderRadius: 12, width: '80vw', maxWidth: 800, height: '70vh', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
            
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#1976d2', fontSize: '20px', fontWeight: 'bold' }}>
                {appName.trim() || 'Calendar App'} - Preview
              </h3>
              <button 
                onClick={() => setShowPreviewModal(false)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '24px', 
                  cursor: 'pointer', 
                  color: '#666',
                  padding: '5px'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ flex: 1, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
              <div style={{ width: '100%', height: '100%', maxWidth: '600px', maxHeight: '400px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                <CalendarApp 
                  widget={{
                    appName: appName.trim() || 'Calendar App',
                    events: [
                      { title: "Team Meeting", startTime: "2:00 PM", endTime: "3:00 PM" },
                      { title: "Client Call", startTime: "4:00 PM", endTime: "5:00 PM" },
                      { title: "Project Review", startTime: "10:00 AM", endTime: "11:00 AM" }
                    ]
                  }}
                  settings={{
                    calendarUrl,
                    displayEventsFor,
                    showPastEvents,
                    showEventsInPeriods,
                    showTime,
                    maxEvents,
                    syncFrequency,
                    cyclingTimeInterval,
                    calendarTimeout,
                    textFont,
                    textShadow,
                    showIcon,
                    backgroundColor,
                    fontColor,
                    backgroundImage,
                    entranceAnimation,
                    animateBackgroundImage
                  }}
                />
              </div>
            </div>

            <div style={{ padding: '15px 20px', borderTop: '1px solid #eee', background: '#fff', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowPreviewModal(false)}
                style={{
                  background: '#666',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  padding: '8px 20px',
                  fontWeight: 'bold',
                  fontSize: 14,
                  cursor: 'pointer'
                }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarAppCustomizeModal;
