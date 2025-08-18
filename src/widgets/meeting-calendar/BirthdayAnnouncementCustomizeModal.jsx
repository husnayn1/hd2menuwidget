import React, { useState, useEffect } from "react";
import BirthdayAnnouncement from './BirthdayAnnouncement';

function BirthdayAnnouncementCustomizeModal({ widget, onClose, onSave, onBack }) {
  console.log("BirthdayAnnouncementCustomizeModal opened with widget:", widget);
  const [appName, setAppName] = useState("Birthday Announcement");
  const [tags, setTags] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [fontColor, setFontColor] = useState("#333333");
  const [textFont, setTextFont] = useState("Arial");
  const [highlightColor, setHighlightColor] = useState("#1976d2");
  const [showEachDataFor, setShowEachDataFor] = useState(15);
  const [transitionSpeed, setTransitionSpeed] = useState(0.7);
  const [disableAnimations, setDisableAnimations] = useState(false);
  // Additional birthday-specific options
  const [headerFontSize, setHeaderFontSize] = useState(24);
  const [birthdayItemBackgroundColor, setBirthdayItemBackgroundColor] = useState("#f8f9fa");
  const [birthdayItemBorderColor, setBirthdayItemBorderColor] = useState("#e9ecef");
  const [birthdayItemCornerRadius, setBirthdayItemCornerRadius] = useState(8);
  const [birthdayDateColor, setBirthdayDateColor] = useState("#1976d2");
  const [birthdayDateFontSize, setBirthdayDateFontSize] = useState(18);
  const [birthdayNameFontSize, setBirthdayNameFontSize] = useState(16);
  
  // Data feed settings
  const [dataFeedEnabled, setDataFeedEnabled] = useState(false);
  const [dataFeedUrl, setDataFeedUrl] = useState("");
  const [dataFeedType, setDataFeedType] = useState("google"); // 'google', 'outlook', 'ical'
  
  // Birthday data state
  const [birthdays, setBirthdays] = useState([]);
  const [newBirthday, setNewBirthday] = useState({
    name: '',
    date: ''
  });
  
  const [activeTab, setActiveTab] = useState('settings');
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);

  // Font options
  const fontOptions = [
    "Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana",
    "Tahoma", "Trebuchet MS", "Arial Black", "Impact", "Comic Sans MS",
    "Courier New", "Lucida Console", "Palatino", "Garamond", "Bookman"
  ];

  // Initialize form fields with existing widget values when editing
  useEffect(() => {
    if (widget) {
      console.log("Loading birthday widget data:", widget);
      
      setAppName(widget.appName || widget.name || "Birthday Announcement");
      setTags(widget.tags || "");
      setBackgroundColor(widget.backgroundColor || "#ffffff");
      setFontColor(widget.fontColor || "#333333");
      setTextFont(widget.textFont || "Arial");
      setHighlightColor(widget.highlightColor || "#1976d2");
      setShowEachDataFor(widget.showEachDataFor || 15);
      setTransitionSpeed(widget.transitionSpeed || 0.7);
      setDisableAnimations(widget.disableAnimations || false);
      // Additional birthday-specific options
      setHeaderFontSize(widget.headerFontSize || 24);
      setBirthdayItemBackgroundColor(widget.birthdayItemBackgroundColor || "#f8f9fa");
      setBirthdayItemBorderColor(widget.birthdayItemBorderColor || "#e9ecef");
      setBirthdayItemCornerRadius(widget.birthdayItemCornerRadius || 8);
      setBirthdayDateColor(widget.birthdayDateColor || "#1976d2");
      setBirthdayDateFontSize(widget.birthdayDateFontSize || 18);
      setBirthdayNameFontSize(widget.birthdayNameFontSize || 16);
      
      // Data feed settings
      setDataFeedEnabled(widget.dataFeedEnabled || false);
      setDataFeedUrl(widget.dataFeedUrl || "");
      setDataFeedType(widget.dataFeedType || "google");
      
      // Initialize birthdays data
      setBirthdays(widget.birthdays || []);
    }
  }, [widget]);

  const handleSave = () => {
    const widgetData = {
      ...widget,
      appName: appName || widget?.name || "Birthday Announcement",
      tags,
      backgroundColor,
      fontColor,
      textFont,
      highlightColor,
      showEachDataFor,
      transitionSpeed,
      disableAnimations,
      // Additional birthday-specific options
      headerFontSize,
      birthdayItemBackgroundColor,
      birthdayItemBorderColor,
      birthdayItemCornerRadius,
      birthdayDateColor,
      birthdayDateFontSize,
      birthdayNameFontSize,
      // Data feed settings
      dataFeedEnabled,
      dataFeedUrl,
      dataFeedType,
      birthdays,
      type: "meeting-calendar"
    };

    console.log("Saving birthday widget:", widgetData);
    onSave(widgetData);
  };

  const handlePreview = () => {
    setShowFullscreenPreview(true);
  };

  const handleClosePreview = () => setShowFullscreenPreview(false);
  
  // Birthday management functions
  const handleAddBirthday = () => {
    if (newBirthday.name && newBirthday.date) {
      setBirthdays([...birthdays, { ...newBirthday, id: Date.now() }]);
      setNewBirthday({
        name: '',
        date: ''
      });
    }
  };
  
  const handleRemoveBirthday = (id) => {
    setBirthdays(birthdays.filter(birthday => birthday.id !== id));
  };

  // Get widget preview data
  const getWidgetPreviewData = () => {
    return {
      ...widget,
      backgroundColor,
      fontColor,
      textFont,
      highlightColor,
      // Additional birthday-specific options
      headerFontSize,
      birthdayItemBackgroundColor,
      birthdayItemBorderColor,
      birthdayItemCornerRadius,
      birthdayDateColor,
      birthdayDateFontSize,
      birthdayNameFontSize,
      // Data feed settings
      dataFeedEnabled,
      dataFeedUrl,
      dataFeedType,
      birthdays
    };
  };

  // Add a function to get the dynamic description for the current app
  function getAppDescription(appName) {
    const name = (appName || '').toLowerCase();
    if (name.includes('birthday announcement')) {
      return 'Display upcoming birthdays with data feed integration.';
    } else if (name.includes('happy birthday')) {
      return 'Celebrate birthdays with customizable templates.';
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
          <BirthdayAnnouncement
            widget={getWidgetPreviewData()}
            settings={{
              backgroundColor,
              fontColor,
              textFont,
              highlightColor,
              showEachDataFor,
              transitionSpeed,
              disableAnimations,
              // Additional birthday-specific options
              headerFontSize,
              birthdayItemBackgroundColor,
              birthdayItemBorderColor,
              birthdayItemCornerRadius,
              birthdayDateColor,
              birthdayDateFontSize,
              birthdayNameFontSize
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
                {appName || widget?.name || 'Birthday App'}
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
                {/* Always show full birthday form for all widgets */}
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
                  
                  {/* Birthday-specific customization options */}
                  <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #eee' }}>
                    <h3 style={{ fontWeight: 'bold', marginBottom: 12, fontSize: 16, color: '#1976d2' }}>Birthday Customization</h3>
                    
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Header Font Size</div>
                      <input
                        type="number"
                        value={headerFontSize}
                        onChange={e => setHeaderFontSize(parseInt(e.target.value) || 24)}
                        min="12"
                        max="48"
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Birthday Item Background Color</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input
                          type="color"
                          value={birthdayItemBackgroundColor}
                          onChange={e => setBirthdayItemBackgroundColor(e.target.value)}
                          style={{ width: 32, height: 28, border: '1px solid #ccc', borderRadius: 4 }}
                        />
                        <input
                          value={birthdayItemBackgroundColor}
                          onChange={e => setBirthdayItemBackgroundColor(e.target.value)}
                          placeholder="Enter color code"
                          style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                        />
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Birthday Item Border Color</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input
                          type="color"
                          value={birthdayItemBorderColor}
                          onChange={e => setBirthdayItemBorderColor(e.target.value)}
                          style={{ width: 32, height: 28, border: '1px solid #ccc', borderRadius: 4 }}
                        />
                        <input
                          value={birthdayItemBorderColor}
                          onChange={e => setBirthdayItemBorderColor(e.target.value)}
                          placeholder="Enter color code"
                          style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                        />
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Birthday Item Corner Radius</div>
                      <input
                        type="number"
                        value={birthdayItemCornerRadius}
                        onChange={e => setBirthdayItemCornerRadius(parseInt(e.target.value) || 8)}
                        min="0"
                        max="20"
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Birthday Date Color</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input
                          type="color"
                          value={birthdayDateColor}
                          onChange={e => setBirthdayDateColor(e.target.value)}
                          style={{ width: 32, height: 28, border: '1px solid #ccc', borderRadius: 4 }}
                        />
                        <input
                          value={birthdayDateColor}
                          onChange={e => setBirthdayDateColor(e.target.value)}
                          placeholder="Enter color code"
                          style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                        />
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Birthday Date Font Size</div>
                      <input
                        type="number"
                        value={birthdayDateFontSize}
                        onChange={e => setBirthdayDateFontSize(parseInt(e.target.value) || 18)}
                        min="10"
                        max="32"
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                      />
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Birthday Name Font Size</div>
                      <input
                        type="number"
                        value={birthdayNameFontSize}
                        onChange={e => setBirthdayNameFontSize(parseInt(e.target.value) || 16)}
                        min="10"
                        max="32"
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                      />
                    </div>
                  </div>
                  
                  {/* Data Feed Settings */}
                  <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #eee' }}>
                    <h3 style={{ fontWeight: 'bold', marginBottom: 12, fontSize: 16, color: '#1976d2' }}>Data Feed Integration</h3>
                    
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Enable Data Feed</div>
                      <select
                        value={dataFeedEnabled}
                        onChange={e => setDataFeedEnabled(e.target.value === 'true')}
                        style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                      >
                        <option value={false}>No</option>
                        <option value={true}>Yes</option>
                      </select>
                      <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>Enable integration with calendar services.</div>
                    </div>
                    
                    {dataFeedEnabled && (
                      <>
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Data Feed Type</div>
                          <select
                            value={dataFeedType}
                            onChange={e => setDataFeedType(e.target.value)}
                            style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                          >
                            <option value="google">Google Calendar</option>
                            <option value="outlook">Outlook</option>
                            <option value="ical">iCal Format</option>
                          </select>
                        </div>
                        
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Calendar URL (iCal)</div>
                          <input
                            value={dataFeedUrl}
                            onChange={e => setDataFeedUrl(e.target.value)}
                            placeholder="Enter the iCal URL from your calendar"
                            style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                          />
                          <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                            Go to your Google Calendar and click on the three dots on the right of the selected calendar ▶ Click on "Settings and Share". ▶ Search public address in "ICAL format" ▶ Enter here the URL address provided on the pop-up window.
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Birthdays Data Management */}
                  <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #eee' }}>
                    <h3 style={{ fontWeight: 'bold', marginBottom: 12, fontSize: 16, color: '#1976d2' }}>Birthdays Data</h3>
                    
                    {/* Add New Birthday Form */}
                    <div style={{ marginBottom: 20, padding: 15, border: '1px solid #eee', borderRadius: 8, backgroundColor: '#f9f9f9' }}>
                      <h4 style={{ fontWeight: 'bold', marginBottom: 10, fontSize: 14 }}>Add New Birthday</h4>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                        <div>
                          <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 12 }}>Name</div>
                          <input
                            value={newBirthday.name}
                            onChange={e => setNewBirthday({ ...newBirthday, name: e.target.value })}
                            placeholder="Person's name"
                            style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                          />
                        </div>
                        
                        <div>
                          <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 12 }}>Date</div>
                          <input
                            type="date"
                            value={newBirthday.date}
                            onChange={e => setNewBirthday({ ...newBirthday, date: e.target.value })}
                            style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                          />
                        </div>
                      </div>
                      
                      <button
                        onClick={handleAddBirthday}
                        disabled={!newBirthday.name || !newBirthday.date}
                        style={{
                          background: (!newBirthday.name || !newBirthday.date) ? '#ccc' : '#4CAF50',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 4,
                          padding: '8px 16px',
                          fontWeight: 'bold',
                          fontSize: 14,
                          cursor: (!newBirthday.name || !newBirthday.date) ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Add Birthday
                      </button>
                    </div>
                    
                    {/* Birthdays List */}
                    <div>
                      <h4 style={{ fontWeight: 'bold', marginBottom: 10, fontSize: 14 }}>Current Birthdays</h4>
                      {birthdays.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#666', padding: 20 }}>
                          No birthdays added yet
                        </div>
                      ) : (
                        <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                          {birthdays.map((birthday) => (
                            <div key={birthday.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottom: '1px solid #eee' }}>
                              <div>
                                <div style={{ fontWeight: 'bold', fontSize: 14 }}>{birthday.name}</div>
                                <div style={{ fontSize: 12, color: '#666' }}>
                                  {birthday.date}
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveBirthday(birthday.id)}
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

export default BirthdayAnnouncementCustomizeModal;