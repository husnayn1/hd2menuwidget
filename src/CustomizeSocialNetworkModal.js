import React, { useState, useEffect } from "react";

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

function CustomizeSocialNetworkModal({ widget, onClose, onSave, onBack }) {
  const [activeTab, setActiveTab] = useState("settings");
  const [appName, setAppName] = useState("");
  const [tags, setTags] = useState("");
  const [dataFeed, setDataFeed] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [embedCode, setEmbedCode] = useState("");
  const [refreshInterval, setRefreshInterval] = useState(60);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
  const [highlightColor, setHighlightColor] = useState("#1976d2");
  const [showQrCode, setShowQrCode] = useState(true);
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showDataFeedRequirements, setShowDataFeedRequirements] = useState(false);
  
  // Language specific states
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [appLabels, setAppLabels] = useState({
    appTitle: "Social Network App",
    noDataAvailable: "No Data Available",
    checkConnection: "Check internet connection/Data Feed",
    followUs: "Follow Us",
    scanQrCode: "Scan QR Code"
  });

  // Determine social network type
  const isFacebook = widget?.name?.toLowerCase().includes("facebook");
  const isYoutube = widget?.name?.toLowerCase().includes("youtube");
  const isFollowUs = widget?.name?.toLowerCase().includes("follow us");
  const isTagbox = widget?.name?.toLowerCase().includes("tagbox");
  const isWallsIo = widget?.name?.toLowerCase().includes("walls.io");

  const handleSave = () => {
    setError("");
    if (!appName.trim()) {
      setError("Please enter the name of this app");
      return;
    }

    const widgetToSave = {
      ...widget,
      type: "social-network",
      name: appName, // Use appName as the display name
      appName: appName, // Store the custom app name
      originalName: widget?.originalName || widget?.name, // Preserve original template name
      tags,
      dataFeed,
      profileUrl,
      embedCode,
      refreshInterval,
      bgColor,
      textColor,
      highlightColor,
      showQrCode,
      acceptTerms,
      selectedLanguage,
      appLabels
    };
    
    console.log("Saving social network widget with data:", widgetToSave);
    onSave(widgetToSave);
  };

  const handlePreview = () => {
    setError("");
    if (!appName.trim()) {
      setError("App name is required.");
      return;
    }
    if (!acceptTerms) {
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

  const [error, setError] = useState("");

  // Initialize form fields with existing widget values when editing
  useEffect(() => {
    if (widget) {
      console.log("Loading social network widget data:", widget);
      
      // For editing existing widgets, only use appName if it was previously set by user
      // Don't auto-fill with widget.name - let user enter custom name
      const currentAppName = widget.appName || "";
      console.log("Setting appName to:", currentAppName);
      
      setAppName(currentAppName);
      setTags(widget.tags || "");
      setDataFeed(widget.dataFeed || "");
      setProfileUrl(widget.profileUrl || "");
      setEmbedCode(widget.embedCode || "");
      setRefreshInterval(widget.refreshInterval || 60);
      setBgColor(widget.bgColor || "#ffffff");
      setTextColor(widget.textColor || "#000000");
      setHighlightColor(widget.highlightColor || "#1976d2");
      setShowQrCode(widget.showQrCode !== undefined ? widget.showQrCode : true);
      setAcceptTerms(widget.acceptTerms || false);
      setSelectedLanguage(widget.selectedLanguage || "en");
      setAppLabels(widget.appLabels || {
        appTitle: widget.name || "Social Network App",
        noDataAvailable: "No Data Available",
        checkConnection: "Check internet connection/Data Feed",
        followUs: "Follow Us",
        scanQrCode: "Scan QR Code"
      });
    }
  }, [widget]);

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
        <div style={{ background: '#f5f5f5', width: 800, height: 600, borderRadius: 8, position: 'relative', display: 'flex', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', overflow: 'hidden' }}>
          {/* Back button */}
          <button onClick={onBack} style={{ position: 'absolute', top: 18, left: 18, fontSize: 28, background: 'none', border: 'none', cursor: 'pointer', color: '#1976d2', zIndex: 10 }} aria-label="Back to gallery">&#8592;</button>
          
          {/* Close button */}
          <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, fontSize: 22, background: 'none', border: 'none', cursor: 'pointer', color: '#1976d2', zIndex: 10 }}>×</button>
          
          {/* Left Panel - App Preview and Description */}
          <div style={{ width: 300, borderRight: '1px solid #eee', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff' }}>
            <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 15, color: '#1976d2' }}>{widget?.name}</div>
            <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
              <img 
                src={widget?.image || "https://via.placeholder.com/180x180?text=Social+Network+Preview"} 
                alt="Preview" 
                style={{ width: 180, height: 180, objectFit: 'contain', borderRadius: 4 }} 
              />
            </div>
            <div style={{ color: '#666', fontSize: 14, textAlign: 'center', marginBottom: 15 }}>
              {widget?.description || "Customize your social network widget settings."}
            </div>
            
            {/* Better Viewed Like This section */}
            <div style={{ width: '100%' }}>
              <div style={{ fontWeight: 'bold', marginBottom: 8, color: '#333', fontSize: 14 }}>Better Viewed Like This</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ width: 60, height: 40, background: '#f0f0f0', border: '1px solid #ddd', borderRadius: 4 }}></div>
                <div style={{ width: 40, height: 60, background: '#f0f0f0', border: '1px solid #ddd', borderRadius: 4 }}></div>
              </div>
            </div>
          </div>
          
          {/* Right Panel - Settings and Customization */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: '#fff' }}>
            {/* Header */}
            <div style={{ padding: '20px 20px 0 20px', borderBottom: '1px solid #eee' }}>
              <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#1976d2' }}>
                Customize Social Network App
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
              {activeTab === 'settings' && (
                <>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>App name</div>
                    <input 
                      value={appName} 
                      onChange={e => setAppName(e.target.value)} 
                      style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                      placeholder="Enter app name"
                    />
                  </div>
                  
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Tags</div>
                    <input 
                      value={tags} 
                      onChange={e => setTags(e.target.value)} 
                      style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                      placeholder="Enter tags separated by commas"
                    />
                  </div>

                  {/* Profile URL field */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>
                      {isFacebook ? "Facebook Page URL" : 
                       isYoutube ? "YouTube Video URL" : 
                       isFollowUs ? "Profile URL" : 
                       isTagbox ? "Tagbox URL" : 
                       isWallsIo ? "Walls.io Wall URL" : 
                       "Social Media URL"}
                    </div>
                    <input 
                      value={profileUrl} 
                      onChange={e => setProfileUrl(e.target.value)} 
                      style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                      placeholder={`Enter ${isFacebook ? "Facebook page" : isYoutube ? "YouTube video" : "profile"} URL`}
                    />
                  </div>

                  {/* Embed code field for advanced users */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Embed Code (Optional)</div>
                    <textarea 
                      value={embedCode} 
                      onChange={e => setEmbedCode(e.target.value)} 
                      style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14, minHeight: 80 }} 
                      placeholder="Enter embed code if you have it"
                    />
                  </div>

                  {/* Refresh interval */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Refresh Interval (seconds)</div>
                    <input 
                      type="number" 
                      min="30" 
                      max="3600" 
                      value={refreshInterval} 
                      onChange={e => setRefreshInterval(parseInt(e.target.value) || 60)} 
                      style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                    />
                  </div>

                  {/* Color settings */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Background Color</div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input 
                        type="color" 
                        value={bgColor} 
                        onChange={e => setBgColor(e.target.value)} 
                        style={{ width: 40, height: 30, padding: 0, border: '1px solid #ccc' }} 
                      />
                      <input 
                        type="text" 
                        value={bgColor} 
                        onChange={e => setBgColor(e.target.value)} 
                        style={{ flex: 1, marginLeft: 8, padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Text Color</div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input 
                        type="color" 
                        value={textColor} 
                        onChange={e => setTextColor(e.target.value)} 
                        style={{ width: 40, height: 30, padding: 0, border: '1px solid #ccc' }} 
                      />
                      <input 
                        type="text" 
                        value={textColor} 
                        onChange={e => setTextColor(e.target.value)} 
                        style={{ flex: 1, marginLeft: 8, padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Highlight Color</div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input 
                        type="color" 
                        value={highlightColor} 
                        onChange={e => setHighlightColor(e.target.value)} 
                        style={{ width: 40, height: 30, padding: 0, border: '1px solid #ccc' }} 
                      />
                      <input 
                        type="text" 
                        value={highlightColor} 
                        onChange={e => setHighlightColor(e.target.value)} 
                        style={{ flex: 1, marginLeft: 8, padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                      />
                    </div>
                  </div>

                  {/* QR Code toggle for Follow Us widget */}
                  {isFollowUs && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input 
                          type="checkbox" 
                          id="showQrCode" 
                          checked={showQrCode} 
                          onChange={e => setShowQrCode(e.target.checked)} 
                          style={{ marginRight: 8 }} 
                        />
                        <label htmlFor="showQrCode" style={{ fontSize: 14 }}>Show QR Code</label>
                      </div>
                    </div>
                  )}

                  {/* Data Feed section */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Data Feed URL (Optional)</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input 
                        value={dataFeed} 
                        onChange={e => setDataFeed(e.target.value)} 
                        style={{ flex: 1, padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                        placeholder="Enter data feed URL"
                      />
                      <button 
                        onClick={handleDataFeedEdit} 
                        style={{ padding: '4px 8px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: 4, fontSize: 12 }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={handleDataFeedChoose} 
                        style={{ padding: '4px 8px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: 4, fontSize: 12 }}
                      >
                        Choose
                      </button>
                      <button 
                        onClick={handleDataFeedClear} 
                        style={{ padding: '4px 8px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: 4, fontSize: 12 }}
                      >
                        Clear
                      </button>
                    </div>
                    <div style={{ marginTop: 4 }}>
                      <button 
                        onClick={() => setShowDataFeedRequirements(!showDataFeedRequirements)} 
                        style={{ background: 'none', border: 'none', color: '#1976d2', fontSize: 12, padding: 0, cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        {showDataFeedRequirements ? 'Hide data feed requirements' : 'Show data feed requirements'}
                      </button>
                    </div>
                    {showDataFeedRequirements && (
                      <div style={{ marginTop: 8, fontSize: 12, color: '#666', background: '#f9f9f9', padding: 8, borderRadius: 4 }}>
                        <p>Data feed should be a JSON endpoint with the following structure:</p>
                        <pre style={{ background: '#f0f0f0', padding: 8, borderRadius: 4, overflowX: 'auto', fontSize: 11 }}>
                          {`{
  "items": [
    {
      "id": "unique_id",
      "text": "Post text content",
      "author": "Author name",
      "profileImage": "https://...",
      "mediaUrl": "https://...",
      "timestamp": "2023-01-01T12:00:00Z"
    }
  ]
}`}
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Terms and conditions */}
                  <div style={{ marginTop: 20, marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <input 
                        type="checkbox" 
                        id="acceptTerms" 
                        checked={acceptTerms} 
                        onChange={e => setAcceptTerms(e.target.checked)} 
                        style={{ marginRight: 8, marginTop: 3 }} 
                      />
                      <label htmlFor="acceptTerms" style={{ fontSize: 12, color: '#666' }}>
                        I understand that this widget may require internet access and may display content from third-party sources. 
                        I am responsible for ensuring I have the necessary rights to display any social media content shown through this widget.
                      </label>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'language' && (
                <>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Default Language</div>
                    <select 
                      value={selectedLanguage} 
                      onChange={e => setSelectedLanguage(e.target.value)} 
                      style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                    >
                      {languageOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginTop: 20 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 8, fontSize: 14 }}>Custom Labels</div>
                    
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
                        {appLabels.followUs}
                      </div>
                      <input 
                        value={appLabels.followUs} 
                        onChange={e => handleAppLabelChange('followUs', e.target.value)} 
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
                        {appLabels.scanQrCode}
                      </div>
                      <input 
                        value={appLabels.scanQrCode} 
                        onChange={e => handleAppLabelChange('scanQrCode', e.target.value)} 
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
                    padding: '8px 16px', 
                    background: '#f0f0f0', 
                    border: '1px solid #ccc', 
                    borderRadius: 4, 
                    fontSize: 14,
                    cursor: 'pointer'
                  }}
                >
                  Preview
                </button>
                <button 
                  onClick={handleSave} 
                  style={{ 
                    padding: '8px 16px', 
                    background: '#1976d2', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 4, 
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
      {showFullscreenPreview && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
          <div style={{ position: 'relative', width: '80%', height: '80%', background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
            <button 
              onClick={handleClosePreview} 
              style={{ position: 'absolute', top: 10, right: 10, fontSize: 24, background: 'none', border: 'none', color: '#333', cursor: 'pointer', zIndex: 10 }}
            >
              ×
            </button>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bgColor }}>
              <div style={{ textAlign: 'center', color: textColor }}>
                <h2 style={{ color: highlightColor }}>{appLabels.appTitle}</h2>
                <p>Social Network Widget Preview</p>
                <p>This is a placeholder for the actual social network content.</p>
                {profileUrl ? (
                  <p>Connected to: {profileUrl}</p>
                ) : (
                  <p>{appLabels.noDataAvailable}</p>
                )}
                {isFollowUs && showQrCode && (
                  <div style={{ marginTop: 20 }}>
                    <p>{appLabels.scanQrCode}</p>
                    <div style={{ width: 150, height: 150, background: '#f0f0f0', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      QR Code Placeholder
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CustomizeSocialNetworkModal;