import React, { useState, useEffect } from "react";
import FinanceKonva from './FinanceKonva';

function FinanceCustomizeModal({ widget, onClose, onSave, onBack }) {
  console.log("FinanceCustomizeModal opened with widget:", widget);
  const [appName, setAppName] = useState("");
  const [tags, setTags] = useState("");
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [exchangeCurrency, setExchangeCurrency] = useState("EUR");
  const [theme, setTheme] = useState("light");
  const [showGridLabel, setShowGridLabel] = useState("yes");
  const [customFontColor, setCustomFontColor] = useState("");
  const [textFont, setTextFont] = useState("");
  const [divisorLineColor, setDivisorLineColor] = useState("");
  const [customBgColor, setCustomBgColor] = useState("");
  const [customBgImage, setCustomBgImage] = useState("");
  const [activeTab, setActiveTab] = useState('settings');
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);
  const [error, setError] = useState("");

  // Add state for up to 4 exchange currencies
  const [exchangeCurrency1, setExchangeCurrency1] = useState('EUR');
  const [exchangeCurrency2, setExchangeCurrency2] = useState('GBP');
  const [exchangeCurrency3, setExchangeCurrency3] = useState('JPY');
  const [exchangeCurrency4, setExchangeCurrency4] = useState('CAD');

  // Font options
  const fontOptions = [
    "Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana", 
    "Tahoma", "Trebuchet MS", "Arial Black", "Impact", "Comic Sans MS",
    "Courier New", "Lucida Console", "Palatino", "Garamond", "Bookman"
  ];

  // Restore currency options to only those supported by Frankfurter API
  const currencyOptions = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'NZD', name: 'New Zealand Dollar' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'SEK', name: 'Swedish Krona' },
    { code: 'NOK', name: 'Norwegian Krone' },
    { code: 'DKK', name: 'Danish Krone' },
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'PKR', name: 'Pakistani Rupee' },
    { code: 'SAR', name: 'Saudi Riyal' },
    { code: 'BHD', name: 'Bahraini Dinar' },
    { code: 'KWD', name: 'Kuwaiti Dinar' },
    { code: 'QAR', name: 'Qatari Riyal' },
    // ... add more as needed, but only those supported by Frankfurter ...
  ];

  // Theme options
  const themeOptions = [
    { value: "light", label: "Light Theme" },
    { value: "dark", label: "Dark Theme" },
    { value: "blue", label: "Blue Theme" },
    { value: "green", label: "Green Theme" },
    { value: "red", label: "Red Theme" }
  ];

  // Grid label options
  const gridLabelOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" }
  ];

  // Initialize form fields with existing widget values when editing
  useEffect(() => {
    if (widget) {
      console.log("Loading finance widget data:", widget);
      
      setAppName(widget.appName || widget.name || "");
      setTags(widget.tags || "");
      setBaseCurrency(widget.baseCurrency || "USD");
      setExchangeCurrency(widget.exchangeCurrency || "EUR");
      setTheme(widget.theme || "light");
      setShowGridLabel(widget.showGridLabel || "yes");
      setCustomFontColor(widget.customFontColor || "");
      setTextFont(widget.textFont || "");
      setDivisorLineColor(widget.divisorLineColor || "");
      setCustomBgColor(widget.customBgColor || "");
      setCustomBgImage(widget.customBgImage || "");
    }
  }, [widget]);

  const handleSave = () => {
    setError("");
    if (!appName.trim()) {
      setError("Please enter the name of this app");
      return;
    }

    const widgetData = {
      ...widget,
      appName: appName,
      tags,
      baseCurrency,
      exchangeCurrency,
      exchangeCurrency1,
      exchangeCurrency2,
      exchangeCurrency3,
      exchangeCurrency4,
      theme,
      showGridLabel,
      customFontColor,
      textFont,
      divisorLineColor,
      customBgColor,
      customBgImage,
      type: "finance"
    };

    console.log("Saving finance widget:", widgetData);
    onSave(widgetData);
  };

  const handlePreview = () => {
    setError("");
    if (!appName.trim()) {
      setError("Please enter the name of this app");
      return;
    }
    if (!baseCurrency || !exchangeCurrency) {
      setError('Please select both base and exchange currencies before previewing.');
      return;
    }
    setShowFullscreenPreview(true);
  };

  const handleClosePreview = () => setShowFullscreenPreview(false);

  const handleImageChoose = () => {
    // Simulate image selection
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setCustomBgImage(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Sample images for testing
  const sampleImages = [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop'
  ];

  // Get widget preview data
  const getWidgetPreviewData = () => {
    return {
      ...widget,
      baseCurrency,
      exchangeCurrency,
      exchangeCurrency1,
      exchangeCurrency2,
      exchangeCurrency3,
      exchangeCurrency4,
      theme,
      showGridLabel,
      customFontColor,
      textFont,
      divisorLineColor,
      customBgColor,
      customBgImage
    };
  };

  // Add a function to get the dynamic description for the current app
  function getAppDescription(appName) {
    const name = (appName || '').toLowerCase();
    if (name.includes('7 days exchange rate')) {
      return 'Displays current exchange rate for selected currency and 7 days history chart.';
    } else if (name.includes('exchange rate chart')) {
      return 'Shows a multi-currency exchange rate chart for up to 4 selected currencies.';
    } else if (name.includes('exchange rate table')) {
      return 'Shows a table of exchange rates for up to 4 selected currencies.';
    } else if (name.includes('exchange rate') && !name.includes('chart') && !name.includes('table')) {
      return 'Displays the latest exchange rates for up to 4 selected currencies.';
    } else if (name.includes('currency exchange scroller')) {
      return 'Scrolls the selected exchange currency rate across the screen.';
    } else if (name.includes('mini chart')) {
      return 'Displays a mini chart for the selected currency pair.';
    } else if (name.includes('multi-currency exchange rate')) {
      return 'Shows the latest rates for up to 4 selected currencies.';
    } else if (name.includes('single exchange rate chart')) {
      return 'Shows a 7-day chart for the selected currency pair.';
    } else if (name.includes('single exchange rate')) {
      return 'Displays the latest rate and daily change for the selected currency pair.';
    } else if (name.includes('single ticker')) {
      return 'Shows a ticker for the selected currency pair.';
    } else if (name.includes('ticker tape')) {
      return 'Shows a scrolling ticker tape for up to 4 selected currency pairs.';
    } else if (name.includes('ticker')) {
      return 'Displays a ticker for the selected currency pair.';
    } else if (name.includes('symbol info')) {
      return 'Displays current exchange rate for the selected currency pair.';
    } else if (name.includes('symbol overview')) {
      return 'Shows an overview of the selected currency pair.';
    } else {
      return 'Displays finance widget information.';
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
          <FinanceKonva
            open={true}
            onClose={handleClosePreview}
            widget={getWidgetPreviewData()}
            settings={{
              showEachDataFor: 10,
              transitionSpeed: 0.7,
              backgroundColor: customBgColor || '#ffffff',
              disableAnimations: false,
              highlightColor: '#1976d2',
              fontColor: customFontColor || '#333',
              textFont: textFont || 'Arial',
              customFontColor: customFontColor,
              customBgImage: customBgImage
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
                {appName || widget?.name || 'Finance App'}
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
                {/* Always show full finance form for all widgets */}
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
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Base Currency</div>
                    <select 
                      value={baseCurrency} 
                      onChange={e => setBaseCurrency(e.target.value)} 
                      style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                    >
                      {currencyOptions.map(currency => (
                        <option key={currency.code} value={currency.code}>
                            {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>
                    {((appName || widget?.name || '').toLowerCase().includes('exchange rate') &&
                      !(appName || widget?.name || '').toLowerCase().includes('scroller') &&
                      !(appName || widget?.name || '').toLowerCase().includes('7 days')) ? (
                      <>
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Exchange Currency 1</div>
                          <select value={exchangeCurrency1} onChange={e => setExchangeCurrency1(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}>
                            {currencyOptions.map(currency => (
                              <option key={currency.code} value={currency.code}>{currency.name}</option>
                            ))}
                          </select>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Exchange Currency 2</div>
                          <select value={exchangeCurrency2} onChange={e => setExchangeCurrency2(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}>
                            {currencyOptions.map(currency => (
                              <option key={currency.code} value={currency.code}>{currency.name}</option>
                            ))}
                          </select>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Exchange Currency 3</div>
                          <select value={exchangeCurrency3} onChange={e => setExchangeCurrency3(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}>
                            {currencyOptions.map(currency => (
                              <option key={currency.code} value={currency.code}>{currency.name}</option>
                            ))}
                          </select>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Exchange Currency 4</div>
                          <select value={exchangeCurrency4} onChange={e => setExchangeCurrency4(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}>
                            {currencyOptions.map(currency => (
                              <option key={currency.code} value={currency.code}>{currency.name}</option>
                            ))}
                          </select>
                        </div>
                      </>
                    ) : (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Exchange Currency</div>
                    <select 
                      value={exchangeCurrency} 
                      onChange={e => setExchangeCurrency(e.target.value)} 
                      style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                    >
                      {currencyOptions.map(currency => (
                            <option key={currency.code} value={currency.code}>{currency.name}</option>
                      ))}
                    </select>
                  </div>
                    )}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Theme</div>
                    <select 
                      value={theme} 
                      onChange={e => setTheme(e.target.value)} 
                      style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                    >
                      {themeOptions.map(theme => (
                        <option key={theme.value} value={theme.value}>
                          {theme.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Show grid label</div>
                    <select 
                      value={showGridLabel} 
                      onChange={e => setShowGridLabel(e.target.value)} 
                      style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                    >
                      {gridLabelOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Custom Font Color <span style={{ color: '#888', fontWeight: 'normal' }}>(optional)</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input 
                        type="color" 
                        value={customFontColor} 
                        onChange={e => setCustomFontColor(e.target.value)} 
                        style={{ width: 32, height: 28, border: '1px solid #ccc', borderRadius: 4 }} 
                      />
                      <input 
                        value={customFontColor} 
                        onChange={e => setCustomFontColor(e.target.value)} 
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
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Choose the color of the divisor line <span style={{ color: '#888', fontWeight: 'normal' }}>(optional)</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input 
                        type="color" 
                        value={divisorLineColor} 
                        onChange={e => setDivisorLineColor(e.target.value)} 
                        style={{ width: 32, height: 28, border: '1px solid #ccc', borderRadius: 4 }} 
                      />
                      <input 
                        value={divisorLineColor} 
                        onChange={e => setDivisorLineColor(e.target.value)} 
                        placeholder="Enter color code"
                        style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                      />
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Custom Background Color <span style={{ color: '#888', fontWeight: 'normal' }}>(optional)</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input 
                        type="color" 
                        value={customBgColor} 
                        onChange={e => setCustomBgColor(e.target.value)} 
                        style={{ width: 32, height: 28, border: '1px solid #ccc', borderRadius: 4 }} 
                      />
                      <input 
                        value={customBgColor} 
                        onChange={e => setCustomBgColor(e.target.value)} 
                        placeholder="Enter color code"
                        style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                      />
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 14 }}>Custom Background Image <span style={{ color: '#888', fontWeight: 'normal' }}>(optional)</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input 
                        value={customBgImage} 
                        onChange={e => setCustomBgImage(e.target.value)} 
                        placeholder="Enter image URL or choose file"
                        style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} 
                      />
                      <button 
                        onClick={handleImageChoose}
                        style={{ 
                          padding: '4px 8px', 
                          background: '#1976d2', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: 4, 
                          cursor: 'pointer',
                          fontSize: 12,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        📷 Choose
                      </button>
                      <button 
                        onClick={() => setCustomBgImage(sampleImages[0])}
                        style={{ 
                          padding: '4px 8px', 
                          background: '#4caf50', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: 4, 
                          cursor: 'pointer',
                          fontSize: 12
                        }}
                        title="Add sample image"
                      >
                        🖼️ Sample
                      </button>
                    </div>
                    {customBgImage && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Background Image Preview:</div>
                        <img 
                          src={customBgImage} 
                          alt="Background preview" 
                          style={{ 
                            width: '100%', 
                            maxHeight: 100, 
                            objectFit: 'cover', 
                            borderRadius: 4, 
                            border: '1px solid #ddd' 
                          }} 
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {activeTab === 'language' && (
                <div style={{ textAlign: 'center', color: '#666', padding: '40px 20px' }}>
                  Language settings will be available here.
                </div>
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
                  borderRadius: 4,
                  margin: '0 20px'
                }}>
                  {error}
                </div>
              )}

              {/* Action Buttons - Fixed at bottom of right panel */}
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
        </div>
      )}
    </>
  );
}

export default FinanceCustomizeModal; 