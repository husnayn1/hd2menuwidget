import React, { useState, useEffect } from "react";
import Clock from "./Clock";
import EntertainmentKonva from "./EntertainmentKonva";

const dialTypes = [
  { value: "arabic", label: "Arabic Numerals Dial" },
  { value: "roman", label: "Roman Numerals Dial" },
  { value: "none", label: "No Numerals Dial" }
];

const fontOptions = [
  "Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana", "Roboto", "Open Sans", "Lato"
];

const languageOptions = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" }
];

const CLOCK_PLACEHOLDER = "https://via.placeholder.com/220x220?text=Clock+Preview";

function CustomizeClockModal({ widget, onClose, onSave, onBack }) {
  const [activeTab, setActiveTab] = useState("settings");
  const [appName, setAppName] = useState("");
  const [tags, setTags] = useState("");
  const [dataFeed, setDataFeed] = useState("");
  const [dialType, setDialType] = useState("arabic");
  const [dialBg, setDialBg] = useState("#ffffff");
  const [handsColor, setHandsColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [previewMode, setPreviewMode] = useState(false);
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);
  // Add local state for countdown fields
  const [eventDateTime, setEventDateTime] = useState("");
  const [completionMessage, setCompletionMessage] = useState("");
  // Add local state for glow clock fields
  const [timeFormat, setTimeFormat] = useState("hh:mm:ss");
  const [ampm, setAmpm] = useState(true);
  
  // Entertainment app specific states
  const [highlightColor, setHighlightColor] = useState("");
  const [textFont, setTextFont] = useState("");
  const [fontColor, setFontColor] = useState("");
  const [disableAnimations, setDisableAnimations] = useState(false);
  const [showEachFactFor, setShowEachFactFor] = useState(15);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showDataFeedRequirements, setShowDataFeedRequirements] = useState(false);
  const [transitionSpeed, setTransitionSpeed] = useState(0.7);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  // Language specific states
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [appLabels, setAppLabels] = useState({
    appTitle: "Entertainment App",
    noDataAvailable: "No Data Available",
    checkConnection: "Check internet connection/Data Feed",
    photoBy: "Photo by:"
  });

  // Enhanced detection for different app types
  const isClock = widget?.name?.toLowerCase().includes("clock");
  const isEntertainment = widget?.category === "Entertainment" || 
                         widget?.name?.toLowerCase().includes("football") ||
                         widget?.name?.toLowerCase().includes("basketball") ||
                         widget?.name?.toLowerCase().includes("baseball") ||
                         widget?.name?.toLowerCase().includes("cricket") ||
                         widget?.name?.toLowerCase().includes("hockey") ||
                         widget?.name?.toLowerCase().includes("rugby") ||
                         widget?.name?.toLowerCase().includes("volleyball") ||
                         widget?.name?.toLowerCase().includes("quotes") ||
                         widget?.name?.toLowerCase().includes("quiz") ||
                         widget?.name?.toLowerCase().includes("trivia") ||
                         widget?.name?.toLowerCase().includes("facts") ||
                         widget?.name?.toLowerCase().includes("health") ||
                         widget?.name?.toLowerCase().includes("travel") ||
                         widget?.name?.toLowerCase().includes("movies") ||
                         widget?.name?.toLowerCase().includes("history") ||
                         widget?.name?.toLowerCase().includes("scientific") ||
                         widget?.name?.toLowerCase().includes("animal") ||
                         widget?.name?.toLowerCase().includes("entertainment");
  const isSquareAnalog = widget?.type === "analog-square";

  const handleSave = () => {
    const widgetToSave = {
      ...widget,
      type: widget?.type || "widget",
      name: appName || widget?.name, // Use appName as the display name
      appName: appName || widget?.name, // Store the custom app name
      originalName: widget?.originalName || widget?.name, // Preserve original template name
      tags,
      dataFeed,
      dialType,
      dialBg,
      handsColor,
      bgColor,
      highlightColor,
      textFont,
      fontColor,
      disableAnimations,
      showEachFactFor,
      transitionSpeed,
      backgroundColor,
      acceptTerms,
      selectedLanguage,
      appLabels,
      eventDateTime,
      completionMessage
    };
    
    console.log("Saving widget with data:", widgetToSave); // Debug log
    console.log("App name being saved:", widgetToSave.appName); // Debug appName specifically
    
    onSave(widgetToSave);
  };

  const handlePreview = () => {
    setError("");
    if (!appName.trim()) {
      setError("App name is required.");
      return;
    }
    // For clock widgets, don't require terms acceptance for preview
    if (isEntertainment && !acceptTerms) {
      setError("You must accept the terms below before previewing.");
      return;
    }
    setShowFullscreenPreview(true);
  };
  const handleClosePreview = () => setShowFullscreenPreview(false);

  const handleDataFeedEdit = () => {
    // Handle data feed editing
    console.log("Edit data feed");
  };

  const handleDataFeedChoose = () => {
    // Handle data feed selection
    console.log("Choose data feed");
  };

  const handleDataFeedClear = () => {
    setDataFeed("");
  };

  const handleAppLabelChange = (key, value) => {
    setAppLabels(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // DEBUG: Log the widget type for preview
  console.log("Widget type for preview:", widget?.type);
  const [error, setError] = useState("");

  // Initialize form fields with existing widget values when editing
  useEffect(() => {
    if (widget) {
      console.log("Loading widget data:", widget); // Debug log
      console.log("Widget appName:", widget.appName); // Debug appName specifically
      console.log("Widget name:", widget.name); // Debug name specifically
      
      // For editing existing widgets, prioritize appName over name
      const currentAppName = widget.appName || widget.name || "";
      console.log("Setting appName to:", currentAppName); // Debug what we're setting
      
      setAppName(currentAppName);
      setTags(widget.tags || "");
      setDataFeed(widget.dataFeed || "");
      setDialType(widget.dialType || "arabic");
      setDialBg(widget.dialBg || "#ffffff");
      setHandsColor(widget.handsColor || "#000000");
      setBgColor(widget.bgColor || "#ffffff");
      setEventDateTime(widget.eventDateTime || "");
      setCompletionMessage(widget.completionMessage || "");
      setTimeFormat(widget.timeFormat || "hh:mm:ss");
      setAmpm(widget.ampm !== undefined ? widget.ampm : true);
      setHighlightColor(widget.highlightColor || "");
      setTextFont(widget.textFont || "");
      setFontColor(widget.fontColor || "");
      setDisableAnimations(widget.disableAnimations || false);
      setShowEachFactFor(widget.showEachFactFor || 15);
      setTransitionSpeed(widget.transitionSpeed || 0.7);
      setBackgroundColor(widget.backgroundColor || "#ffffff");
      setSelectedLanguage(widget.selectedLanguage || "en");
      setAppLabels(widget.appLabels || {
        appTitle: widget.name || "Entertainment App",
        noDataAvailable: "No Data Available",
        checkConnection: "Check internet connection/Data Feed",
        photoBy: "Photo by:"
      });
    }
  }, [widget]);

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
        <div style={{ background: '#f5f5f5', width: 900, height: 600, borderRadius: 8, position: 'relative', display: 'flex', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', overflow: 'hidden' }}>
          {/* Back button */}
          <button onClick={onBack} style={{ position: 'absolute', top: 18, left: 18, fontSize: 28, background: 'none', border: 'none', cursor: 'pointer', color: '#1976d2', zIndex: 10 }} aria-label="Back to gallery">&#8592;</button>
          
          {/* Close button */}
          <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, fontSize: 22, background: 'none', border: 'none', cursor: 'pointer', color: '#1976d2', zIndex: 10 }}>×</button>
          
          {/* Left Panel - App Preview and Description */}
          <div style={{ width: 300, borderRight: '1px solid #eee', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff' }}>
            <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 15, color: '#1976d2' }}>{widget?.name}</div>
            <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: widget?.type === 'analog-square' ? 0 : 8, width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
              {(() => {
                // For entertainment widgets, show the actual image
                if (isEntertainment) {
                  return (
                    <img 
                      src={widget?.image || "https://via.placeholder.com/180x180?text=Entertainment+Preview"} 
                      alt="Preview" 
                      style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: 4 }} 
                    />
                  );
                }
                
                // For clock widgets, show the clock
                let clockType = widget?.type;
                if (!clockType) {
                  if (widget?.name?.toLowerCase().includes("analog round")) clockType = "analog-round";
                  else if (widget?.name?.toLowerCase().includes("analog square")) clockType = "analog-square";
                  else if (widget?.name?.toLowerCase().includes("digital")) clockType = "digital-simple";
                  else if (widget?.name?.toLowerCase().includes("bar")) clockType = "bar-modern";
                  else if (widget?.name?.toLowerCase().includes("countdown")) clockType = "countdown-app";
                  else if (widget?.name?.toLowerCase().includes("glow")) clockType = "glow-clock";
                  else if (widget?.name?.toLowerCase().includes("holiday")) clockType = "holiday-clock";
                  else if (widget?.name?.toLowerCase().includes("lcd")) clockType = "lcd-clock";
                  else if (widget?.name?.toLowerCase().includes("multi city")) clockType = "multi-city-clock";
                  else clockType = "analog-round"; // Default fallback
                }
                
                console.log("CustomizeClockModal - Clock type determined:", clockType);
                
                if (clockType === 'digital-simple') {
                  return <Clock type="digital-simple" size={180} />;
                } else if (clockType === 'bar-modern') {
                  return <Clock type="bar-modern" size={180} />;
                } else if (clockType === 'glow-clock') {
                  return <Clock type="glow-clock" size={180} ringColor={highlightColor || '#e83e00'} bgCircleColor={dialBg || '#e1e2eb'} fontColor={fontColor || '#333'} timeFormat={timeFormat || 'hh:mm:ss'} ampm={ampm} />;
                } else if (clockType === 'countdown-app') {
                  return <div style={{ color: '#bbb', fontSize: 16, textAlign: 'center' }}>Set date/time and click Preview</div>;
                } else if (clockType === 'analog-round' || clockType === 'analog-square') {
                  return (
                    <Clock 
                      dialType={dialType} 
                      dialBg={dialBg} 
                      handsColor={handsColor} 
                      bgColor={bgColor} 
                      type={clockType}
                      size={180}
                    />
                  );
                } else {
                  return <img src={widget?.image || "https://via.placeholder.com/180x180?text=Clock+Preview"} alt="Preview" style={{ width: 180, height: 180, objectFit: 'contain' }} />;
                }
              })()}
            </div>
            <div style={{ color: '#666', fontSize: 14, textAlign: 'center', marginBottom: 15 }}>
              {widget?.type !== 'bar-modern' && widget?.description}
            </div>
            
            {/* Better Viewed Like This section for entertainment apps */}
            {isEntertainment && (
              <div style={{ width: '100%' }}>
                <div style={{ fontWeight: 'bold', marginBottom: 8, color: '#333', fontSize: 14 }}>Better Viewed Like This</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ width: 60, height: 40, background: '#f0f0f0', border: '1px solid #ddd', borderRadius: 4 }}></div>
                  <div style={{ width: 40, height: 60, background: '#f0f0f0', border: '1px solid #ddd', borderRadius: 4 }}></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Panel - Settings and Customization */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: '#fff' }}>
            {/* Header */}
            <div style={{ padding: '20px 20px 0 20px', borderBottom: '1px solid #eee' }}>
              <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#1976d2' }}>
                {widget?.type === 'widget' ? 'Edit Widget Properties' : 'Customize App'}
              </div>
              
              {/* Tabs - Only show for entertainment apps */}
              {isEntertainment && (
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
              )}
            </div>

            {/* Scrollable Content */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
              {(activeTab === 'settings' || isClock) && (
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
                  {/* Countdown-specific fields for countdown-app */}
                  {widget?.type === 'countdown-app' && (
                    <>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Event Date and Time</div>
                        <input
                          type="datetime-local"
                          value={eventDateTime}
                          onChange={e => setEventDateTime(e.target.value)}
                          style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                        />
                        <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Select date and time</div>
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Completion Message <span style={{ color: '#888', fontWeight: 'normal' }}>(optional)</span></div>
                        <input
                          type="text"
                          value={completionMessage}
                          onChange={e => setCompletionMessage(e.target.value)}
                          style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                          placeholder="Done!"
                        />
                        <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Set a text that will appear at the end of the count.</div>
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Title</div>
                        <input
                          type="text"
                          value={appLabels?.appTitle || ''}
                          onChange={e => handleAppLabelChange('appTitle', e.target.value)}
                          style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                          placeholder="Countdown Title"
                        />
                        <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Set a text that will appear at top of the app.</div>
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Subtitle <span style={{ color: '#888', fontWeight: 'normal' }}>(optional)</span></div>
                        <input
                          type="text"
                          value={appLabels?.subtitle || ''}
                          onChange={e => handleAppLabelChange('subtitle', e.target.value)}
                          style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                          placeholder="Be Ready"
                        />
                        <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Set a text that will appear above the title.</div>
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Text Font <span style={{ color: '#888', fontWeight: 'normal' }}>(optional)</span></div>
                        <select 
                          value={textFont} 
                          onChange={e => setTextFont(e.target.value)} 
                          style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                        >
                          <option value="">Click here to select a font</option>
                          {fontOptions.map(font => <option key={font} value={font}>{font}</option>)}
                        </select>
                        <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>Change the font used to show the text</div>
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Font Color <span style={{ color: '#888', fontWeight: 'normal' }}>(optional)</span></div>
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
                        <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>Change the font color inside the cards</div>
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Background Color <span style={{ color: '#888', fontWeight: 'normal' }}>(optional)</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <input 
                            type="color" 
                            value={bgColor} 
                            onChange={e => setBgColor(e.target.value)} 
                            style={{ width: 32, height: 28, border: '1px solid #ccc', borderRadius: 4 }} 
                          />
                          <input 
                            value={bgColor} 
                            onChange={e => setBgColor(e.target.value)} 
                            placeholder="Enter color code"
                            style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                          />
                        </div>
                        <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>Change the background color</div>
                      </div>
                    </>
                  )}
                  
                  {/* Clock specific settings */}
                  {isClock && (
                    <>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Dial type</div>
                        <select 
                          value={dialType} 
                          onChange={e => setDialType(e.target.value)} 
                          style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                        >
                          {dialTypes.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                      </div>
                      
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Dial background color</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <input 
                            type="color" 
                            value={dialBg} 
                            onChange={e => setDialBg(e.target.value)} 
                            style={{ width: 32, height: 28, border: '1px solid #ccc', borderRadius: 4 }} 
                          />
                          <input 
                            value={dialBg} 
                            onChange={e => setDialBg(e.target.value)} 
                            style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                          />
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Hands and dial color</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <input 
                            type="color" 
                            value={handsColor} 
                            onChange={e => setHandsColor(e.target.value)} 
                            style={{ width: 32, height: 28, border: '1px solid #ccc', borderRadius: 4 }} 
                          />
                          <input 
                            value={handsColor} 
                            onChange={e => setHandsColor(e.target.value)} 
                            style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                          />
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Background color</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <input 
                            type="color" 
                            value={bgColor} 
                            onChange={e => setBgColor(e.target.value)} 
                            style={{ width: 32, height: 28, border: '1px solid #ccc', borderRadius: 4 }} 
                          />
                          <input 
                            value={bgColor} 
                            onChange={e => setBgColor(e.target.value)} 
                            style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* GlowClock-specific fields for glow-clock */}
                  {widget?.type === 'glow-clock' && (
                    <>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Time Options</div>
                        <select value={timeFormat} onChange={e => setTimeFormat(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}>
                          <option value="hh:mm:ss">HH/MM/SS</option>
                          <option value="hh:mm">HH/MM</option>
                        </select>
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Time format</div>
                        <select value={ampm ? 'ampm' : '24h'} onChange={e => setAmpm(e.target.value === 'ampm')} style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}>
                          <option value="ampm">AM/PM</option>
                          <option value="24h">24 Hour</option>
                        </select>
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Background Circle Color <span style={{ color: '#888', fontWeight: 'normal' }}>(optional)</span></div>
                        <input type="color" value={dialBg} onChange={e => setDialBg(e.target.value)} style={{ width: 32, height: 28, border: '1px solid #ccc', borderRadius: 4, marginRight: 8 }} />
                        <input value={dialBg} onChange={e => setDialBg(e.target.value)} style={{ width: 'calc(100% - 40px)', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} />
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Circle Color <span style={{ color: '#888', fontWeight: 'normal' }}>(optional)</span></div>
                        <input type="color" value={highlightColor} onChange={e => setHighlightColor(e.target.value)} style={{ width: 32, height: 28, border: '1px solid #ccc', borderRadius: 4, marginRight: 8 }} />
                        <input value={highlightColor} onChange={e => setHighlightColor(e.target.value)} style={{ width: 'calc(100% - 40px)', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} />
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Font Color <span style={{ color: '#888', fontWeight: 'normal' }}>(optional)</span></div>
                        <input type="color" value={fontColor} onChange={e => setFontColor(e.target.value)} style={{ width: 32, height: 28, border: '1px solid #ccc', borderRadius: 4, marginRight: 8 }} />
                        <input value={fontColor} onChange={e => setFontColor(e.target.value)} style={{ width: 'calc(100% - 40px)', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} />
                      </div>
                    </>
                  )}

                  {/* Entertainment app specific settings */}
                  {isEntertainment && (
                    <>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Show Each Fact For <span style={{ color: '#888', fontWeight: 'normal' }}>(seconds)</span></div>
                        <input 
                          type="number"
                          value={showEachFactFor} 
                          onChange={e => setShowEachFactFor(parseInt(e.target.value) || 15)} 
                          min="5"
                          max="60"
                          style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                        />
                        <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>Duration for each fact/image (5-60 seconds)</div>
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Transition Speed <span style={{ color: '#888', fontWeight: 'normal' }}>(seconds)</span></div>
                        <input 
                          type="number"
                          value={transitionSpeed} 
                          onChange={e => setTransitionSpeed(parseFloat(e.target.value) || 0.7)} 
                          min="0.1"
                          max="2"
                          step="0.1"
                          style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                        />
                        <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>Fade transition duration (0.1-2 seconds)</div>
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
                        <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Highlight Color <span style={{ color: '#888', fontWeight: 'normal' }}>(progress bar)</span></div>
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
                        <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>Color for progress bar and highlights</div>
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Text Color</div>
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
                        <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Font Family</div>
                        <select 
                          value={textFont} 
                          onChange={e => setTextFont(e.target.value)} 
                          style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                        >
                          <option value="">Default</option>
                          <option value="Arial, sans-serif">Arial</option>
                          <option value="Helvetica, sans-serif">Helvetica</option>
                          <option value="Times New Roman, serif">Times New Roman</option>
                          <option value="Georgia, serif">Georgia</option>
                          <option value="Verdana, sans-serif">Verdana</option>
                          <option value="Roboto, sans-serif">Roboto</option>
                          <option value="Open Sans, sans-serif">Open Sans</option>
                          <option value="Lato, sans-serif">Lato</option>
                        </select>
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={disableAnimations} 
                            onChange={e => setDisableAnimations(e.target.checked)} 
                          />
                          <span style={{ fontWeight: 'bold', fontSize: 14 }}>Disable Animations</span>
                        </label>
                        <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>Turn off fade transitions</div>
                      </div>

                      <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 6, cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={acceptTerms} 
                            onChange={e => setAcceptTerms(e.target.checked)} 
                            style={{ marginTop: 2 }}
                          />
                          <div>
                            <span style={{ fontWeight: 'bold', fontSize: 14 }}>I accept the terms below</span>
                            <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                              It is user's responsibility to review all Data Feeds used and make sure the selected content is adequate to each target audience.
                            </div>
                          </div>
                        </label>
                      </div>
                    </>
                  )}
                </>
              )}

              {activeTab === 'language' && isEntertainment && (
                <>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 16 }}>Language</div>
                    <select 
                      value={selectedLanguage} 
                      onChange={e => setSelectedLanguage(e.target.value)} 
                      style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                    >
                      {languageOptions.map(lang => <option key={lang.value} value={lang.value}>{lang.label}</option>)}
                    </select>
                    <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                      Changing the language will affect any text displayed on the app as well as how dates and numbers are formatted.
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 16 }}>App Labels</div>
                    <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
                      These labels will be displayed in the app. You can choose to override them if the default translation shown below does not fit your needs.
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ 
                        background: '#f5f5f5', 
                        padding: '6px 10px', 
                        borderRadius: 4, 
                        fontSize: 12, 
                        color: '#666',
                        marginBottom: 4
                      }}>
                        {appLabels.appTitle}
                      </div>
                      <input 
                        value={appLabels.appTitle} 
                        onChange={e => handleAppLabelChange('appTitle', e.target.value)} 
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                      />
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <div style={{ 
                        background: '#f5f5f5', 
                        padding: '6px 10px', 
                        borderRadius: 4, 
                        fontSize: 12, 
                        color: '#666',
                        marginBottom: 4
                      }}>
                        {appLabels.noDataAvailable}
                      </div>
                      <input 
                        value={appLabels.noDataAvailable} 
                        onChange={e => handleAppLabelChange('noDataAvailable', e.target.value)} 
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                      />
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <div style={{ 
                        background: '#f5f5f5', 
                        padding: '6px 10px', 
                        borderRadius: 4, 
                        fontSize: 12, 
                        color: '#666',
                        marginBottom: 4
                      }}>
                        {appLabels.checkConnection}
                      </div>
                      <input 
                        value={appLabels.checkConnection} 
                        onChange={e => handleAppLabelChange('checkConnection', e.target.value)} 
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                      />
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <div style={{ 
                        background: '#f5f5f5', 
                        padding: '6px 10px', 
                        borderRadius: 4, 
                        fontSize: 12, 
                        color: '#666',
                        marginBottom: 4
                      }}>
                        {appLabels.photoBy}
                      </div>
                      <input 
                        value={appLabels.photoBy} 
                        onChange={e => handleAppLabelChange('photoBy', e.target.value)} 
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Action Buttons - Fixed at bottom */}
            <div style={{ padding: '15px 20px', borderTop: '1px solid #eee', background: '#fff' }}>
              {error && (
                <div style={{ color: 'red', marginBottom: 10, fontWeight: 'bold', textAlign: 'right' }}>{error}</div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button 
                  onClick={handlePreview} 
                  style={{ 
                    background: (!appName.trim() || (isEntertainment && !acceptTerms)) ? '#ccc' : '#1976d2', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 4, 
                    padding: '8px 20px', 
                    fontWeight: 'bold', 
                    fontSize: 14, 
                    cursor: (!appName.trim() || (isEntertainment && !acceptTerms)) ? 'not-allowed' : 'pointer' 
                  }}
                  disabled={!appName.trim() || (isEntertainment && !acceptTerms)}
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
      </div>
      
      {/* Fullscreen Preview Modal */}
      {isEntertainment && (
        <EntertainmentKonva
          open={showFullscreenPreview}
          onClose={handleClosePreview}
          widget={widget}
          settings={{
            showEachFactFor,
            transitionSpeed,
            backgroundColor,
            highlightColor,
            textFont,
            fontColor,
            disableAnimations
          }}
        />
      )}
      {isClock && showFullscreenPreview && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          background: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 1000 
        }}>
          <button
            onClick={handleClosePreview}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              fontSize: 30,
              background: 'none',
              border: 'none',
              color: '#000',
              cursor: 'pointer',
              zIndex: 10,
              fontWeight: 'bold'
            }}
          >
            ×
          </button>
          <Clock
            type={(() => {
              // Determine the correct clock type based on widget name
              let clockType = widget?.type;
              if (!clockType) {
                if (widget?.name?.toLowerCase().includes("analog round")) clockType = "analog-round";
                else if (widget?.name?.toLowerCase().includes("analog square")) clockType = "analog-square";
                else if (widget?.name?.toLowerCase().includes("digital")) clockType = "digital-simple";
                else if (widget?.name?.toLowerCase().includes("bar")) clockType = "bar-modern";
                else if (widget?.name?.toLowerCase().includes("countdown")) clockType = "countdown-app";
                else if (widget?.name?.toLowerCase().includes("glow")) clockType = "glow-clock";
                else if (widget?.name?.toLowerCase().includes("holiday")) clockType = "holiday-clock";
                else if (widget?.name?.toLowerCase().includes("lcd")) clockType = "lcd-clock";
                else if (widget?.name?.toLowerCase().includes("multi city")) clockType = "multi-city-clock";
                else clockType = "analog-round"; // Default fallback
              }
              return clockType;
            })()}
            width={Math.min(window.innerWidth * 0.8, 800)}
            height={Math.min(window.innerHeight * 0.8, 800)}
            dialType={dialType}
            dialBg={dialBg}
            handsColor={handsColor}
            bgColor={bgColor}
            highlightColor={highlightColor}
            fontColor={fontColor}
            timeFormat={timeFormat}
            ampm={ampm}
            eventDateTime={eventDateTime}
            completionMessage={completionMessage}
            textFont={textFont}
          />
        </div>
      )}
    </>
  );
}

export default CustomizeClockModal; 