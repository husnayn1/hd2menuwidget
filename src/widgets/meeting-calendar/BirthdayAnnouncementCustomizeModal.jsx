import React, { useState, useEffect } from "react";
import BirthdayAnnouncement from './BirthdayAnnouncement';

function BirthdayAnnouncementCustomizeModal({ widget, onClose, onSave, onBack }) {
  const [appName, setAppName] = useState("");
  const [tags, setTags] = useState("");
  const [duration, setDuration] = useState(10);
  const [filteringOptions, setFilteringOptions] = useState("Show this week's birthdays");
  const [textFont, setTextFont] = useState("Arial");
  const [titleFontColor, setTitleFontColor] = useState("#ffffff");
  const [cardFontColor, setCardFontColor] = useState("#333333");
  const [customBackgroundColor, setCustomBackgroundColor] = useState("");
  const [customBackgroundImage, setCustomBackgroundImage] = useState("");
  const [disableBackground, setDisableBackground] = useState(false);
  const [disableAnimations, setDisableAnimations] = useState(false);
  const [showCurrentMonth, setShowCurrentMonth] = useState(false);
  const [hideDates, setHideDates] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [errors, setErrors] = useState({});

  // Font options
  const fontOptions = [
    "Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana",
    "Tahoma", "Trebuchet MS", "Arial Black", "Impact", "Comic Sans MS"
  ];

  const filteringOptionsList = [
    "Show this week's birthdays",
    "Show this month's birthdays",
    "Show all birthdays"
  ];

  // Initialize form fields with existing widget values when editing
  useEffect(() => {
    if (widget) {
      setAppName(widget.appName || "");
      setTags(widget.tags || "");
      setDuration(widget.duration || 10);
      setFilteringOptions(widget.filteringOptions || "Show this week's birthdays");
      setTextFont(widget.textFont || "Arial");
      setTitleFontColor(widget.titleFontColor || "#ffffff");
      setCardFontColor(widget.cardFontColor || "#333333");
      setCustomBackgroundColor(widget.customBackgroundColor || "");
      setCustomBackgroundImage(widget.customBackgroundImage || "");
      setDisableBackground(widget.disableBackground || false);
      setDisableAnimations(widget.disableAnimations || false);
      setShowCurrentMonth(widget.showCurrentMonth || false);
      setHideDates(widget.hideDates || false);
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
      duration,
      filteringOptions,
      textFont,
      titleFontColor,
      cardFontColor,
      customBackgroundColor,
      customBackgroundImage,
      disableBackground,
      disableAnimations,
      showCurrentMonth,
      hideDates,
      type: "birthday-announcement"
    };

    onSave(widgetData);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', borderRadius: 8, width: '90vw', maxWidth: 900, height: '90vh', display: 'flex', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
        
        {/* Back button */}
        <button onClick={onBack} style={{ position: 'absolute', top: 18, left: 18, fontSize: 28, background: 'none', border: 'none', cursor: 'pointer', color: '#1976d2', zIndex: 10 }} aria-label="Back to gallery">&#8592;</button>
        
        {/* Close button */}
        <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, fontSize: 22, background: 'none', border: 'none', cursor: 'pointer', color: '#1976d2', zIndex: 10 }}>×</button>
        
        {/* Left Panel - Preview */}
        <div style={{ width: 300, padding: 20, borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f8f8f8', position: 'relative' }}>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1976d2', marginBottom: 15, marginTop: 20 }}>
            Birthday Announcement
          </div>
          
          {/* Static Gallery Image */}
          <div style={{ width: 260, height: 180, background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 15, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center' }}>
            {/* Birthday Announcement Title */}
            <div style={{ position: 'absolute', left: 15, top: 15, color: 'white', fontSize: 14, fontWeight: 'bold' }}>
              Birthday<br/>Announcement
            </div>
            
            {/* Birthday Cards */}
            <div style={{ position: 'absolute', right: 15, top: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 'bold', color: '#333', flexDirection: 'column', lineHeight: '1' }}>
                  <div>Apr</div>
                  <div>10</div>
                </div>
                <span style={{ color: 'white', fontSize: 12 }}>John Smith</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 'bold', color: '#333', flexDirection: 'column', lineHeight: '1' }}>
                  <div>Apr</div>
                  <div>11</div>
                </div>
                <span style={{ color: 'white', fontSize: 12 }}>Emma Johnson</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 'bold', color: '#333', flexDirection: 'column', lineHeight: '1' }}>
                  <div>Apr</div>
                  <div>12</div>
                </div>
                <span style={{ color: 'white', fontSize: 12 }}>James Brown</span>
              </div>
            </div>
          </div>
          <div style={{ color: '#666', fontSize: 12, textAlign: 'center', marginBottom: 10 }}>
            This app will show a list of birthday events matching the filtering criteria.
          </div>
          
          {/* Better Viewed Like This Section */}
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
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', height: '400px' }}>
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
                  <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Data Feed</div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input 
                      type="text"
                      placeholder=""
                      style={{ 
                        flex: 1, 
                        padding: 8, 
                        borderRadius: 4, 
                        border: '1px solid #ccc', 
                        fontSize: 14 
                      }} 
                    />
                    <button
                      style={{
                        padding: '8px 16px',
                        borderRadius: 4,
                        border: 'none',
                        background: '#1976d2',
                        color: '#fff',
                        fontSize: 14,
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      Choose
                    </button>
                  </div>
                  <select 
                    style={{ 
                      width: '100%', 
                      padding: 8, 
                      borderRadius: 4, 
                      border: '1px solid #ccc', 
                      fontSize: 14,
                      color: '#666',
                      background: '#f8f8f8'
                    }}
                    defaultValue=""
                  >
                    <option value="">Data Feed Requirements</option>
                    <option value="text-date">One text column and one date column</option>
                    <option value="name-birthday">Name and Birthday columns</option>
                    <option value="custom">Custom format</option>
                  </select>
                  <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>
                    This app requires a Data Feed with one text column and one date column.
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Duration <span style={{ color: '#888', fontWeight: 'normal' }}>(optional)</span></div>
                  <input 
                    type="number"
                    value={duration} 
                    onChange={e => setDuration(parseInt(e.target.value) || 10)} 
                    min="1"
                    style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                  />
                  <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                    Time in seconds for displaying each content page.
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Filtering Options</div>
                  <select 
                    value={filteringOptions} 
                    onChange={e => setFilteringOptions(e.target.value)} 
                    style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                  >
                    {filteringOptionsList.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Text Font <span style={{ color: '#888', fontWeight: 'normal' }}>(optional)</span></div>
                  <select 
                    value={textFont} 
                    onChange={e => setTextFont(e.target.value)} 
                    style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                  >
                    <option value="">Click here to select a font</option>
                    {fontOptions.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                  <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                    Change the font used to show the text.
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Title Font Color <span style={{ color: '#888', fontWeight: 'normal' }}>(optional)</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input 
                      type="color" 
                      value={titleFontColor} 
                      onChange={e => setTitleFontColor(e.target.value)} 
                      style={{ width: 32, height: 28, border: '1px solid #ccc', borderRadius: 4 }} 
                    />
                    <input 
                      value={titleFontColor} 
                      onChange={e => setTitleFontColor(e.target.value)} 
                      placeholder="#ffffff"
                      style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                    />
                    <div style={{ width: 20, height: 20, backgroundColor: titleFontColor, border: '1px solid #ccc', borderRadius: 2 }}></div>
                  </div>
                  <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                    Change the font color.
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Card Font Color <span style={{ color: '#888', fontWeight: 'normal' }}>(optional)</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input 
                      type="color" 
                      value={cardFontColor} 
                      onChange={e => setCardFontColor(e.target.value)} 
                      style={{ width: 32, height: 28, border: '1px solid #ccc', borderRadius: 4 }} 
                    />
                    <input 
                      value={cardFontColor} 
                      onChange={e => setCardFontColor(e.target.value)} 
                      placeholder="#333333"
                      style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                    />
                    <div style={{ width: 20, height: 20, backgroundColor: cardFontColor, border: '1px solid #ccc', borderRadius: 2 }}></div>
                  </div>
                  <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                    Change the card font color.
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Custom Background Color <span style={{ color: '#888', fontWeight: 'normal' }}>(optional)</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input 
                      type="color" 
                      value={customBackgroundColor || '#1e3c72'} 
                      onChange={e => setCustomBackgroundColor(e.target.value)} 
                      style={{ width: 32, height: 28, border: '1px solid #ccc', borderRadius: 4 }} 
                    />
                    <input 
                      value={customBackgroundColor} 
                      onChange={e => setCustomBackgroundColor(e.target.value)} 
                      placeholder="Enter color code or use color picker"
                      style={{ flex: 1, padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                    />
                    <div style={{ width: 20, height: 20, backgroundColor: customBackgroundColor || '#1e3c72', border: '1px solid #ccc', borderRadius: 2 }}></div>
                  </div>
                  <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                    Change the background color using color picker or hex code.
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Custom Background Image <span style={{ color: '#888', fontWeight: 'normal' }}>(optional)</span></div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input 
                      type="text"
                      value={customBackgroundImage}
                      onChange={e => setCustomBackgroundImage(e.target.value)}
                      placeholder="Enter image URL or upload"
                      style={{ 
                        flex: 1, 
                        padding: 8, 
                        borderRadius: 4, 
                        border: '1px solid #ccc', 
                        fontSize: 14 
                      }} 
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setCustomBackgroundImage(event.target.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{ display: 'none' }}
                      id="background-image-upload"
                    />
                    <button
                      onClick={() => document.getElementById('background-image-upload').click()}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 4,
                        border: '1px solid #1976d2',
                        background: '#1976d2',
                        color: '#fff',
                        fontSize: 14,
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      Upload
                    </button>
                  </div>
                  {customBackgroundImage && (
                    <div style={{ marginTop: 8 }}>
                      <img 
                        src={customBackgroundImage} 
                        alt="Background preview" 
                        style={{ 
                          width: '100%', 
                          maxHeight: 60, 
                          objectFit: 'cover', 
                          borderRadius: 4, 
                          border: '1px solid #ccc' 
                        }} 
                      />
                      <button
                        onClick={() => setCustomBackgroundImage('')}
                        style={{
                          marginTop: 4,
                          padding: '4px 8px',
                          borderRadius: 4,
                          border: '1px solid #e74c3c',
                          background: '#e74c3c',
                          color: '#fff',
                          fontSize: 12,
                          cursor: 'pointer'
                        }}
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                    Upload an image or enter image URL for custom background.
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={disableBackground} 
                      onChange={e => setDisableBackground(e.target.checked)} 
                    />
                    <span style={{ fontSize: 14 }}>Disable Background</span>
                  </label>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={disableAnimations} 
                      onChange={e => setDisableAnimations(e.target.checked)} 
                    />
                    <span style={{ fontSize: 14 }}>Disable Animations</span>
                  </label>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={showCurrentMonth} 
                      onChange={e => setShowCurrentMonth(e.target.checked)} 
                    />
                    <span style={{ fontSize: 14 }}>Show Current Month</span>
                  </label>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={hideDates} 
                      onChange={e => setHideDates(e.target.checked)} 
                    />
                    <span style={{ fontSize: 14 }}>Hide Dates</span>
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

          {/* Action Buttons */}
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

      {/* Preview Modal */}
      {showPreviewModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#fff', borderRadius: 12, width: '80vw', maxWidth: 800, height: '70vh', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
            
            {/* Preview Header */}
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#1976d2', fontSize: '20px', fontWeight: 'bold' }}>
                {appName.trim() || 'Birthday Announcement'} - Preview
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

            {/* Preview Content */}
            <div style={{ flex: 1, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
              <div style={{ width: '100%', height: '100%', maxWidth: '600px', maxHeight: '400px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                <BirthdayAnnouncement 
                  widget={{
                    appName: appName.trim() || 'Birthday Announcement',
                    birthdays: [
                      { name: "John Smith", date: "Apr 10" },
                      { name: "Emma Johnson", date: "Apr 11" },
                      { name: "James Brown", date: "Apr 12" }
                    ]
                  }}
                  settings={{
                    textFont,
                    titleFontColor,
                    cardFontColor,
                    customBackgroundColor,
                    customBackgroundImage,
                    disableBackground,
                    disableAnimations,
                    duration,
                    filteringOptions,
                    showCurrentMonth,
                    hideDates
                  }}
                />
              </div>
            </div>

            {/* Preview Footer */}
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

export default BirthdayAnnouncementCustomizeModal;
