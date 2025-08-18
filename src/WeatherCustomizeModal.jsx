import React, { useState, useRef } from 'react';
import WeatherPreview from './WeatherPreview';

const WeatherCustomizeModal = ({ widget, onClose, onSave, onBack, media = [] }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    appName: widget?.appName || '',
    tags: '',
    forecastLocation: '',
    locationName: '',
    usePlayerLocation: true,
    units: 'Fahrenheit',
    textFont: '',
    textColor: '',
    backgroundColor: '',
    backgroundImage: '',
    topSectionColor: '#ffeb3b',
    bottomSectionColor: '#87ceeb',
    // Enhanced language settings
    language: 'English',
    customLabels: {
      now: 'now',
      informationNotAvailable: 'Information not available.',
      sun: 'Sun',
      mon: 'Mon',
      tue: 'Tue',
      wed: 'Wed',
      thu: 'Thu',
      fri: 'Fri',
      sat: 'Sat'
    }
  });

  // Language definitions with translations
  const languageDefinitions = {
    English: {
      now: 'now',
      informationNotAvailable: 'Information not available.',
      sun: 'Sun',
      mon: 'Mon',
      tue: 'Tue',
      wed: 'Wed',
      thu: 'Thu',
      fri: 'Fri',
      sat: 'Sat'
    },
    Spanish: {
      now: 'ahora',
      informationNotAvailable: 'Información no disponible.',
      sun: 'Dom',
      mon: 'Lun',
      tue: 'Mar',
      wed: 'Mié',
      thu: 'Jue',
      fri: 'Vie',
      sat: 'Sáb'
    },
    French: {
      now: 'maintenant',
      informationNotAvailable: 'Information non disponible.',
      sun: 'Dim',
      mon: 'Lun',
      tue: 'Mar',
      wed: 'Mer',
      thu: 'Jeu',
      fri: 'Ven',
      sat: 'Sam'
    },
    German: {
      now: 'jetzt',
      informationNotAvailable: 'Information nicht verfügbar.',
      sun: 'So',
      mon: 'Mo',
      tue: 'Di',
      wed: 'Mi',
      thu: 'Do',
      fri: 'Fr',
      sat: 'Sa'
    },
    Italian: {
      now: 'ora',
      informationNotAvailable: 'Informazione non disponibile.',
      sun: 'Dom',
      mon: 'Lun',
      tue: 'Mar',
      wed: 'Mer',
      thu: 'Gio',
      fri: 'Ven',
      sat: 'Sab'
    },
    Portuguese: {
      now: 'agora',
      informationNotAvailable: 'Informação não disponível.',
      sun: 'Dom',
      mon: 'Seg',
      tue: 'Ter',
      wed: 'Qua',
      thu: 'Qui',
      fri: 'Sex',
      sat: 'Sáb'
    },
    Russian: {
      now: 'сейчас',
      informationNotAvailable: 'Информация недоступна.',
      sun: 'Вс',
      mon: 'Пн',
      tue: 'Вт',
      wed: 'Ср',
      thu: 'Чт',
      fri: 'Пт',
      sat: 'Сб'
    },
    Chinese: {
      now: '现在',
      informationNotAvailable: '信息不可用。',
      sun: '日',
      mon: '一',
      tue: '二',
      wed: '三',
      thu: '四',
      fri: '五',
      sat: '六'
    },
    Japanese: {
      now: '今',
      informationNotAvailable: '情報が利用できません。',
      sun: '日',
      mon: '月',
      tue: '火',
      wed: '水',
      thu: '木',
      fri: '金',
      sat: '土'
    },
    Korean: {
      now: '지금',
      informationNotAvailable: '정보를 사용할 수 없습니다.',
      sun: '일',
      mon: '월',
      tue: '화',
      wed: '수',
      thu: '목',
      fri: '금',
      sat: '토'
    }
  };

  const fileInputRef = useRef();
  const newImageInputRef = useRef();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCustomLabelChange = (labelKey, value) => {
    setFormData(prev => ({
      ...prev,
      customLabels: {
        ...prev.customLabels,
        [labelKey]: value
      }
    }));
  };

  // Handle language change with automatic label updates
  const handleLanguageChange = (newLanguage) => {
    const newLabels = languageDefinitions[newLanguage];
    setFormData(prev => ({
      ...prev,
      language: newLanguage,
      customLabels: {
        ...prev.customLabels,
        ...newLabels
      }
    }));
  };

  // Reset custom labels to default for selected language
  const resetToDefaultLabels = () => {
    const currentLanguage = formData.language;
    const defaultLabels = languageDefinitions[currentLanguage];
    setFormData(prev => ({
      ...prev,
      customLabels: {
        ...prev.customLabels,
        ...defaultLabels
      }
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        backgroundImage: url
      }));
      setShowImageSelector(false);
    }
  };

  const handleChooseImage = () => {
    setShowImageSelector(true);
  };

  const handleSelectExistingImage = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      backgroundImage: imageUrl
    }));
    setShowImageSelector(false);
  };

  const handleUploadNewImage = () => {
    newImageInputRef.current?.click();
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleSave = () => {
    const widgetToSave = {
      ...widget,
      ...formData,
      type: 'weather'
    };
  };

  // Filter only image media
  const imageMedia = media.filter(item => item.type === 'image');
  
  // Debug logging
  console.log('WeatherCustomizeModal - media prop:', media);
  console.log('WeatherCustomizeModal - imageMedia:', imageMedia);
  console.log('WeatherCustomizeModal - media length:', media.length);
  console.log('WeatherCustomizeModal - imageMedia length:', imageMedia.length);
  console.log('WeatherCustomizeModal - media types:', media.map(item => ({ name: item.name, type: item.type, url: item.url })));

  // Helper to get real-time day based on index
  const getRealTimeDay = (index) => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const days = [
      formData.customLabels.sun,
      formData.customLabels.mon,
      formData.customLabels.tue,
      formData.customLabels.wed,
      formData.customLabels.thu,
      formData.customLabels.fri,
      formData.customLabels.sat
    ];
    return days[(dayOfWeek + index) % 7];
  };

  // Get current day name for display
  const getCurrentDayName = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[dayOfWeek];
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 10,
        boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
        width: 900,
        maxWidth: '95vw',
        height: '95vh',
        maxHeight: 800,
        display: 'flex',
        overflow: 'hidden',
        '@media (max-width: 768px)': {
          width: '100vw',
          height: '100vh',
          borderRadius: 0,
          flexDirection: 'column'
        }
      }}>
        {/* Left Panel - App Preview */}
        <div style={{
          width: '45%',
          padding: 'clamp(16px, 3vw, 32px)',
          borderRight: '1px solid #eee',
          display: 'flex',
          flexDirection: 'column',
          '@media (max-width: 768px)': {
            width: '100%',
            borderRight: 'none',
            borderBottom: '1px solid #eee',
            padding: '20px'
          }
        }}>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1976d2', marginBottom: 20 }}>
            {widget?.name || 'Modern Weather Forecast'}
          </div>
          
          {/* App Preview - Show static gallery image */}
          <div style={{
            width: '100%',
            height: 200,
            borderRadius: 8,
            overflow: 'hidden',
            marginBottom: 20,
            border: '1px solid #ddd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f5f5'
          }}>
            <img 
              src={widget?.image || "https://via.placeholder.com/300x200?text=Weather+Preview"} 
              alt="Weather Preview" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain' 
              }} 
            />
          </div>
          
          <div style={{ color: '#666', fontSize: 14, lineHeight: 1.5, marginBottom: 20 }}>
            Full screen weather app. Current conditions with three day forecast. Works offline for up to 24 hours.
          </div>
          
          <div style={{ marginTop: 'auto' }}>
            <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
              Better Viewed Like This
            </div>
            <div style={{
              width: 80,
              height: 60,
              border: '2px dashed #ccc',
              borderRadius: 4,
              background: '#f9f9f9'
            }}></div>
          </div>
        </div>

        {/* Right Panel - Settings */}
        <div className="widget-form" style={{
          width: '55%',
          padding: 'clamp(16px, 3vw, 32px)',
          display: 'flex',
          flexDirection: 'column',
          '@media (max-width: 768px)': {
            width: '100%',
            padding: '20px',
            flex: 1
          }
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                onClick={onBack}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 20,
                  cursor: 'pointer',
                  marginRight: 10,
                  color: '#666'
                }}
              >
                ←
              </button>
              <div style={{ fontSize: 20, fontWeight: 'bold' }}>Customize App</div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ×
            </button>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #eee',
            marginBottom: 24
          }}>
            <div 
              onClick={() => setActiveTab('settings')}
              style={{
                padding: '8px 16px',
                borderBottom: activeTab === 'settings' ? '2px solid #1976d2' : '2px solid transparent',
                color: activeTab === 'settings' ? '#1976d2' : '#666',
                fontWeight: activeTab === 'settings' ? 'bold' : 'normal',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Settings
            </div>
            <div 
              onClick={() => setActiveTab('language')}
              style={{
                padding: '8px 16px',
                borderBottom: activeTab === 'language' ? '2px solid #1976d2' : '2px solid transparent',
                color: activeTab === 'language' ? '#1976d2' : '#666',
                fontWeight: activeTab === 'language' ? 'bold' : 'normal',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Language
            </div>
          </div>

          {/* Settings Form */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {activeTab === 'settings' ? (
              <>
                {/* App Name */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                    App name
                  </label>
                  <input
                    type="text"
                    value={formData.appName}
                    onChange={(e) => handleInputChange('appName', e.target.value)}
                    placeholder="Enter a name for this app"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: 6,
                      fontSize: 14
                    }}
                  />
                </div>

                {/* Tags */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                    Tags (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="Select a tag or enter a new one"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: 6,
                      fontSize: 14
                    }}
                  />
                </div>

                {/* Forecast Location */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                    Forecast location
                  </label>
                  <input
                    type="text"
                    value={formData.forecastLocation}
                    onChange={(e) => handleInputChange('forecastLocation', e.target.value)}
                    placeholder="Enter a location"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: 6,
                      fontSize: 14
                    }}
                  />
                  <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                    Type the location of the forecast and choose from the dropdown.
                  </div>
                </div>

                {/* Location Name */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                    Location name (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.locationName}
                    onChange={(e) => handleInputChange('locationName', e.target.value)}
                    placeholder="Enter location name"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: 6,
                      fontSize: 14
                    }}
                  />
                  <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                    How to display the name of the location. Leave blank to hide it.
                  </div>
                </div>

                {/* Use Player Location */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <input
                      type="checkbox"
                      checked={formData.usePlayerLocation}
                      onChange={(e) => handleInputChange('usePlayerLocation', e.target.checked)}
                      style={{ marginRight: 8 }}
                    />
                    <span style={{ fontWeight: 'bold' }}>Use player location</span>
                  </label>
                  <div style={{ fontSize: 12, color: '#666', marginLeft: 24 }}>
                    Only available on Android Player 8.1.3 or greater.
                  </div>
                  <div style={{ fontSize: 12, color: '#666', marginLeft: 24, marginTop: 4 }}>
                    Player location will be based on GPS, or location can be manually configured at the player settings page. Enabling this feature will override the Forecast location field.
                  </div>
                </div>

                {/* Units */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                    Units
                  </label>
                  <select
                    value={formData.units}
                    onChange={(e) => handleInputChange('units', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: 6,
                      fontSize: 14
                    }}
                  >
                    <option value="Fahrenheit">Fahrenheit</option>
                    <option value="Celsius">Celsius</option>
                  </select>
                </div>

                {/* Text Font */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                    Text font (optional)
                  </label>
                  <select
                    value={formData.textFont}
                    onChange={(e) => handleInputChange('textFont', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: 6,
                      fontSize: 14
                    }}
                  >
                    <option value="">Click here to select a font</option>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                  </select>
                </div>

                {/* Text Color */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                    Text color (optional)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={formData.textColor}
                      onChange={(e) => handleInputChange('textColor', e.target.value)}
                      placeholder="#000000"
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        border: '1px solid #ddd',
                        borderRadius: 6,
                        fontSize: 14,
                        marginRight: 8
                      }}
                    />
                    <input
                      type="color"
                      value={formData.textColor || '#ffffff'}
                      onChange={(e) => handleInputChange('textColor', e.target.value)}
                      style={{
                        width: 40,
                        height: 40,
                        border: '1px solid #ddd',
                        borderRadius: 4,
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                </div>

                {/* Top Section Background Color */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                    Top section color (current weather area)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={formData.topSectionColor || '#ffeb3b'}
                      onChange={(e) => handleInputChange('topSectionColor', e.target.value)}
                      placeholder="#ffeb3b"
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        border: '1px solid #ddd',
                        borderRadius: 6,
                        fontSize: 14,
                        marginRight: 8
                      }}
                    />
                    <input
                      type="color"
                      value={formData.topSectionColor || '#ffeb3b'}
                      onChange={(e) => handleInputChange('topSectionColor', e.target.value)}
                      style={{
                        width: 40,
                        height: 40,
                        border: '1px solid #ddd',
                        borderRadius: 4,
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                </div>

                {/* Bottom Section Background Color */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                    Bottom section color (forecast area)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={formData.bottomSectionColor || '#87ceeb'}
                      onChange={(e) => handleInputChange('bottomSectionColor', e.target.value)}
                      placeholder="#87ceeb"
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        border: '1px solid #ddd',
                        borderRadius: 6,
                        fontSize: 14,
                        marginRight: 8
                      }}
                    />
                    <input
                      type="color"
                      value={formData.bottomSectionColor || '#87ceeb'}
                      onChange={(e) => handleInputChange('bottomSectionColor', e.target.value)}
                      style={{
                        width: 40,
                        height: 40,
                        border: '1px solid #ddd',
                        borderRadius: 4,
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                </div>

                {/* Overall Background Color */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                    Overall background color (optional)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={formData.backgroundColor}
                      onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                      placeholder="#ffffff"
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        border: '1px solid #ddd',
                        borderRadius: 6,
                        fontSize: 14,
                        marginRight: 8
                      }}
                    />
                    <input
                      type="color"
                      value={formData.backgroundColor || '#1976d2'}
                      onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                      style={{
                        width: 40,
                        height: 40,
                        border: '1px solid #ddd',
                        borderRadius: 4,
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                </div>

                {/* Background Image */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                    Background image (optional)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={formData.backgroundImage}
                      onChange={(e) => handleInputChange('backgroundImage', e.target.value)}
                      placeholder="Select background image"
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        border: '1px solid #ddd',
                        borderRadius: 6,
                        fontSize: 14,
                        marginRight: 8
                      }}
                    />
                    <button 
                      onClick={handleChooseImage}
                      style={{
                        padding: '10px 16px',
                        background: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: 14,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      📁 Choose
                    </button>
                  </div>
                  {formData.backgroundImage && (
                    <div style={{ marginTop: 8 }}>
                      <img 
                        src={formData.backgroundImage} 
                        alt="Background preview" 
                        style={{ 
                          width: 100, 
                          height: 60, 
                          objectFit: 'cover', 
                          borderRadius: 4,
                          border: '1px solid #ddd'
                        }} 
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Language Settings */}
                <div style={{ marginBottom: 30 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', fontSize: 16 }}>
                    Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #ddd',
                      borderRadius: 6,
                      fontSize: 14,
                      background: '#fff'
                    }}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Italian">Italian</option>
                    <option value="Portuguese">Portuguese</option>
                    <option value="Russian">Russian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Korean">Korean</option>
                  </select>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 8, lineHeight: 1.4 }}>
                    Changing the language will affect any text displayed on the app as well as how dates and numbers are formatted.
                  </div>
                </div>

                {/* App Labels Section */}
                <div style={{ marginBottom: 30 }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    marginBottom: 15 
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
                      App Labels
                    </div>
                    <button
                      onClick={resetToDefaultLabels}
                      style={{
                        padding: '6px 12px',
                        background: '#f0f0f0',
                        color: '#666',
                        border: '1px solid #ddd',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: 12
                      }}
                    >
                      Reset to Default
                    </button>
                  </div>
                  <div style={{ fontSize: 14, color: '#666', marginBottom: 20, lineHeight: 1.4 }}>
                    These labels will be displayed in the app. You can choose to override them if the default translation shown below does not fit your needs.
                  </div>
                  
                  {/* Information not available */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: '#333' }}>
                      Information not available.
                    </label>
                    <input
                      type="text"
                      value={formData.customLabels.informationNotAvailable}
                      onChange={(e) => handleCustomLabelChange('informationNotAvailable', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #ddd',
                        borderRadius: 6,
                        fontSize: 14
                      }}
                    />
                  </div>

                  {/* Now label */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: '#333' }}>
                      now
                    </label>
                    <input
                      type="text"
                      value={formData.customLabels.now}
                      onChange={(e) => handleCustomLabelChange('now', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #ddd',
                        borderRadius: 6,
                        fontSize: 14
                      }}
                    />
                  </div>

                  {/* Days of the week */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#333' }}>
                      Days of the Week
                    </div>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: 20,
                      '@media (max-width: 768px)': {
                        gridTemplateColumns: '1fr',
                        gap: 15
                      }
                    }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: '#333' }}>
                          Sun
                        </label>
                        <input
                          type="text"
                          value={formData.customLabels.sun}
                          onChange={(e) => handleCustomLabelChange('sun', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #ddd',
                            borderRadius: 6,
                            fontSize: 14
                          }}
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: '#333' }}>
                          Mon
                        </label>
                        <input
                          type="text"
                          value={formData.customLabels.mon}
                          onChange={(e) => handleCustomLabelChange('mon', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #ddd',
                            borderRadius: 6,
                            fontSize: 14
                          }}
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: '#333' }}>
                          Tue
                        </label>
                        <input
                          type="text"
                          value={formData.customLabels.tue}
                          onChange={(e) => handleCustomLabelChange('tue', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #ddd',
                            borderRadius: 6,
                            fontSize: 14
                          }}
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: '#333' }}>
                          Wed
                        </label>
                        <input
                          type="text"
                          value={formData.customLabels.wed}
                          onChange={(e) => handleCustomLabelChange('wed', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #ddd',
                            borderRadius: 6,
                            fontSize: 14
                          }}
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: '#333' }}>
                          Thu
                        </label>
                        <input
                          type="text"
                          value={formData.customLabels.thu}
                          onChange={(e) => handleCustomLabelChange('thu', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #ddd',
                            borderRadius: 6,
                            fontSize: 14
                          }}
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: '#333' }}>
                          Fri
                        </label>
                        <input
                          type="text"
                          value={formData.customLabels.fri}
                          onChange={(e) => handleCustomLabelChange('fri', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #ddd',
                            borderRadius: 6,
                            fontSize: 14
                          }}
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: '#333' }}>
                          Sat
                        </label>
                        <input
                          type="text"
                          value={formData.customLabels.sat}
                          onChange={(e) => handleCustomLabelChange('sat', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #ddd',
                            borderRadius: 6,
                            fontSize: 14
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              color: '#d32f2f',
              fontSize: 14,
              marginBottom: 10,
              padding: '8px 12px',
              backgroundColor: '#ffebee',
              border: '1px solid #ffcdd2',
              borderRadius: 4
            }}>
              {error}
            </div>
          )}

          {/* Footer */}
          <div style={{
            padding: '20px 0',
            display: 'flex',
            gap: 10,
            justifyContent: 'flex-end',
            borderTop: '1px solid #eee'
          }}>
            <button
              onClick={(e) => {
                const form = e.target.closest('.widget-form');
                const appNameInput = form.querySelector('input[required]');
                if (!appNameInput.checkValidity()) {
                  appNameInput.reportValidity();
                  return;
                }
                handlePreview();
              }}
              style={{
                padding: '10px 20px',
                background: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              Preview
            </button>
            <button
              onClick={(e) => {
                const form = e.target.closest('.widget-form');
                const appNameInput = form.querySelector('input[required]');
                if (!appNameInput.checkValidity()) {
                  appNameInput.reportValidity();
                  return;
                }
                handleSave();
              }}
              style={{
                padding: '10px 20px',
                background: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
      
      {/* Hidden file input for background image */}
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* Hidden file input for new image upload */}
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={newImageInputRef}
        onChange={handleFileChange}
      />
      
      {/* Weather Preview Modal */}
      {showPreview && (
        <WeatherPreview 
          formData={formData} 
          onClose={() => setShowPreview(false)} 
        />
      )}

      {/* Background Image Selector Modal */}
      {showImageSelector && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 200
        }}>
                     <div style={{
             background: '#fff',
             borderRadius: 10,
             boxShadow: '0 4px 32px rgba(0,0,0,0.15)',
             width: '95vw',
             maxWidth: 900,
             height: '90vh',
             maxHeight: 700,
             display: 'flex',
             flexDirection: 'column',
             overflow: 'hidden',
             '@media (max-width: 768px)': {
               width: '100vw',
               height: '100vh',
               borderRadius: 0
             }
           }}>
            {/* Header */}
            <div style={{
              padding: '20px 30px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ fontSize: 20, fontWeight: 'bold' }}>Select Background Image</div>
              <button
                onClick={() => setShowImageSelector(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div style={{
              flex: 1,
              padding: '20px 30px',
              overflowY: 'auto'
            }}>
              {/* New Upload Button */}
              <div style={{ marginBottom: 20 }}>
                <button
                  onClick={handleUploadNewImage}
                  style={{
                    padding: '12px 24px',
                    background: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <span style={{ fontSize: 18 }}>+</span>
                  New
                </button>
              </div>

              {/* Existing Images Grid */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 15 }}>Content Library</div>
                                 <div style={{
                   display: 'grid',
                   gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                   gap: 'clamp(10px, 2vw, 15px)',
                   '@media (max-width: 768px)': {
                     gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                     gap: 10
                   }
                 }}>
                  {imageMedia.map((item, index) => (
                                         <div
                       key={index}
                       onClick={() => handleSelectExistingImage(item.url)}
                       style={{
                         cursor: 'pointer',
                         border: '2px solid #ddd',
                         borderRadius: 8,
                         overflow: 'hidden',
                         transition: 'all 0.3s ease',
                         transform: 'scale(1)',
                         ':hover': {
                           borderColor: '#1976d2',
                           transform: 'scale(1.05)',
                           boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                         }
                       }}
                       onMouseEnter={(e) => {
                         e.target.style.transform = 'scale(1.05)';
                         e.target.style.borderColor = '#1976d2';
                         e.target.style.boxShadow = '0 4px 12px rgba(25, 118, 210, 0.3)';
                       }}
                       onMouseLeave={(e) => {
                         e.target.style.transform = 'scale(1)';
                         e.target.style.borderColor = '#ddd';
                         e.target.style.boxShadow = 'none';
                       }}
                     >
                      <img
                        src={item.url}
                        alt={item.name}
                        style={{
                          width: '100%',
                          height: 100,
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{
                        padding: '8px 12px',
                        fontSize: 12,
                        color: '#666',
                        background: '#f9f9f9'
                      }}>
                        {item.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* No Images Message */}
              {imageMedia.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#666'
                }}>
                  <div style={{ fontSize: 18, marginBottom: 10 }}>No images in content library</div>
                  <div style={{ fontSize: 14 }}>Click "New" to upload an image from your computer</div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: '20px 30px',
              borderTop: '1px solid #eee',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowImageSelector(false)}
                style={{
                  padding: '10px 20px',
                  background: '#666',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCustomizeModal; 