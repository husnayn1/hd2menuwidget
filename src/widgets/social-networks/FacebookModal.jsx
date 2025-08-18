import React, { useState } from 'react';

function extractFacebookPageId(url) {
  // Basic validation for Facebook URLs
  const regExp = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/([\w.]+)\/?/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : '';
}

const FB_MEDIA_OPTIONS = [
  { value: 'timeline', label: 'Timeline' },
  { value: 'events', label: 'Events' },
  { value: 'messages', label: 'Messages' },
  { value: 'photos', label: 'Photos' },
];

const FB_POST_COUNTS = [
  { value: 5, label: '5 posts' },
  { value: 10, label: '10 posts' },
  { value: 15, label: '15 posts' },
  { value: 20, label: '20 posts' },
];

const FB_TEXT_SIZES = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const FacebookModal = ({ open = true, onClose, onSave, initialData = {} }) => {
  const [form, setForm] = useState({
    appName: initialData.appName || 'Facebook Page',
    tags: initialData.tags || '',
    url: initialData.url || '',
    mediaOption: initialData.mediaOption || 'timeline',
    postCount: initialData.postCount || 10,
    textSize: initialData.textSize || 'medium',
    dataFeed: initialData.dataFeed || true,
    qrCode: initialData.qrCode || true,
    backgroundColor: initialData.backgroundColor || '#ffffff',
    textColor: initialData.textColor || '#333333',
    accentColor: initialData.accentColor || '#4267B2',
    platform: initialData.platform || 'Facebook',
    username: initialData.username || '@example'
  });
  const [activeTab, setActiveTab] = useState('settings');
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePreview = () => {
    // For Facebook Modern and Follow Us, we don't require a URL
    const isFacebookPage = initialData.originalName === 'Facebook Page' ||
                          initialData.name === 'Facebook Page' ||
                          !initialData.originalName;
    
    if (isFacebookPage && (!form.url || !extractFacebookPageId(form.url))) {
      setError('Please enter a valid Facebook page URL.');
      return;
    }
    setError('');
    setShowPreview(true);
  };

  const handleSave = () => {
    // For Facebook Modern and Follow Us, we don't require a URL
    const isFacebookPage = initialData.originalName === 'Facebook Page' ||
                          initialData.name === 'Facebook Page' ||
                          !initialData.originalName;
    
    if (isFacebookPage && (!form.url || !extractFacebookPageId(form.url))) {
      setError('Please enter a valid Facebook page URL.');
      return;
    }
    setError('');

    // Determine widget type based on originalName
    let widgetSubType = 'facebook-page';
    let widgetName = form.appName || "Facebook Page";
    let originalName = "Facebook Page";
    
    if (initialData.originalName === 'Facebook Modern' || initialData.name === 'Facebook Modern') {
      widgetSubType = 'facebook-modern';
      widgetName = form.appName || "Facebook Modern";
      originalName = "Facebook Modern";
    } else if (initialData.originalName === 'Follow Us' || initialData.name === 'Follow Us') {
      widgetSubType = 'follow-us';
      widgetName = form.appName || "Follow Us";
      originalName = "Follow Us";
    }

    const widgetToSave = {
      type: "social-network",
      name: widgetName,
      appName: widgetName,
      originalName: originalName,
      tags: form.tags || [],
      url: form.url,
      mediaOption: form.mediaOption,
      postCount: form.postCount,
      textSize: form.textSize,
      widgetSubType: widgetSubType,
      widgetCategory: 'Social Networks',
      profileUrl: form.url,
      dataFeed: form.dataFeed,
      qrCode: form.qrCode,
      backgroundColor: form.backgroundColor,
      textColor: form.textColor,
      accentColor: form.accentColor,
      platform: form.platform,
      username: form.username
    };
    
    // Call onSave with the widget data
    onSave && onSave(widgetToSave);
    onClose && onClose();
  };

  const pageId = extractFacebookPageId(form.url);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      background: 'rgba(0,0,0,0.3)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 1000 
    }}>
      <div style={{ 
        background: '#fff', 
        borderRadius: 10, 
        boxShadow: '0 4px 32px rgba(0,0,0,0.10)', 
        width: 900, 
        maxWidth: '95vw', 
        height: 600, 
        maxHeight: '90vh', 
        display: 'flex', 
        flexDirection: 'row', 
        overflow: 'hidden', 
        position: 'relative' 
      }}>
        {/* Close button */}
        <button 
          onClick={onClose} 
          style={{ 
            position: 'absolute', 
            top: 15, 
            right: 20, 
            fontSize: 24, 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            color: '#666', 
            zIndex: 10 
          }}
        >
          ×
        </button>

        {/* Back arrow button */}
        <button 
          onClick={onClose} 
          style={{ 
            position: 'absolute', 
            top: 15, 
            left: 20, 
            fontSize: 20, 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            color: '#1976d2', 
            zIndex: 10 
          }}
        >
          ←
        </button>

        {/* Left Panel - App Preview */}
        <div style={{ 
          width: '40%', 
          background: '#f8f8f8', 
          borderRight: '1px solid #eee', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          padding: 40, 
          justifyContent: 'center' 
        }}>
          <div style={{ 
            width: 200, 
            height: 120, 
            border: '1px solid #ddd', 
            borderRadius: 8, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: '#fff', 
            marginBottom: 20 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ 
                width: 40, 
                height: 40, 
                background: '#4267B2', 
                borderRadius: 4, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: 20
              }}>
                f
              </div>
              <span style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>Facebook</span>
            </div>
          </div>
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: 24, 
            color: '#1976d2', 
            marginBottom: 15,
            textAlign: 'center'
          }}>
            Facebook Page
          </div>
          <div style={{ 
            color: '#666', 
            fontSize: 14, 
            textAlign: 'center',
            lineHeight: 1.4
          }}>
            Display content from a Facebook page in your presentation.
          </div>
        </div>

        {/* Right Panel - Settings */}
        <div style={{ 
          flex: 1, 
          padding: 30, 
          display: 'flex', 
          flexDirection: 'column', 
          minWidth: 0,
          overflowY: 'auto'
        }}>
          {/* Title */}
          <div style={{ 
            fontSize: 28, 
            fontWeight: 'bold', 
            marginBottom: 30, 
            color: '#1976d2',
            textAlign: 'center'
          }}>
            Customize App
          </div>

          {/* Tabs */}
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid #eee', 
            marginBottom: 25 
          }}>
            <button
              onClick={() => setActiveTab('settings')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'settings' ? '#fff' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'settings' ? '3px solid #1976d2' : '3px solid transparent',
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: activeTab === 'settings' ? 'bold' : 'normal',
                color: activeTab === 'settings' ? '#1976d2' : '#666'
              }}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab('language')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'language' ? '#fff' : 'transparent',
                border: 'none',
                borderBottom: activeTab === 'language' ? '3px solid #1976d2' : '3px solid transparent',
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: activeTab === 'language' ? 'bold' : 'normal',
                color: activeTab === 'language' ? '#1976d2' : '#666'
              }}
            >
              Language
            </button>
          </div>

          {/* Settings Tab Content */}
          {activeTab === 'settings' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* App name */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ 
                  fontWeight: 'bold', 
                  fontSize: 16, 
                  color: '#333',
                  display: 'block',
                  marginBottom: 8
                }}>
                  App name
                </label>
                <input 
                  type="text" 
                  value={form.appName} 
                  onChange={e => handleChange('appName', e.target.value)} 
                  placeholder="Enter a name for this app" 
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    border: '1px solid #ddd', 
                    borderRadius: 6, 
                    fontSize: 14,
                    outline: 'none'
                  }} 
                />
              </div>

              {/* Tags */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ 
                  fontWeight: 'bold', 
                  fontSize: 16, 
                  color: '#333',
                  display: 'block',
                  marginBottom: 8
                }}>
                  Tags <span style={{ color: '#888', fontWeight: 'normal' }}>(optional)</span>
                </label>
                <input 
                  type="text" 
                  value={form.tags} 
                  onChange={e => handleChange('tags', e.target.value)} 
                  placeholder="Select a tag or enter a new one" 
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    border: '1px solid #ddd', 
                    borderRadius: 6, 
                    fontSize: 14,
                    outline: 'none'
                  }} 
                />
              </div>

              {/* Facebook Page URL */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ 
                  fontWeight: 'bold', 
                  fontSize: 16, 
                  color: '#333',
                  display: 'block',
                  marginBottom: 8
                }}>
                  Facebook Page URL
                </label>
                <input 
                  type="text" 
                  value={form.url} 
                  onChange={e => handleChange('url', e.target.value)} 
                  placeholder="https://www.facebook.com/pagename" 
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    border: '1px solid #ddd', 
                    borderRadius: 6, 
                    fontSize: 14,
                    outline: 'none'
                  }} 
                />
                <div style={{ 
                  fontSize: 12, 
                  color: '#888', 
                  marginTop: 8,
                  lineHeight: 1.4
                }}>
                  The specified URL must look like this:<br />
                  "https://www.facebook.com/pagename"
                </div>
              </div>

              {/* Media Options and Post Count */}
              <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ 
                    fontWeight: 'bold', 
                    fontSize: 16, 
                    color: '#333',
                    display: 'block',
                    marginBottom: 8
                  }}>
                    Media Options
                  </label>
                  <select 
                    value={form.mediaOption} 
                    onChange={e => handleChange('mediaOption', e.target.value)} 
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      border: '1px solid #ddd', 
                      borderRadius: 6, 
                      fontSize: 14,
                      outline: 'none',
                      background: '#fff'
                    }}
                  >
                    {FB_MEDIA_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ 
                    fontWeight: 'bold', 
                    fontSize: 16, 
                    color: '#333',
                    display: 'block',
                    marginBottom: 8
                  }}>
                    Number of Posts
                  </label>
                  <select 
                    value={form.postCount} 
                    onChange={e => handleChange('postCount', parseInt(e.target.value))} 
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      border: '1px solid #ddd', 
                      borderRadius: 6, 
                      fontSize: 14,
                      outline: 'none',
                      background: '#fff'
                    }}
                  >
                    {FB_POST_COUNTS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Text Size */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ 
                  fontWeight: 'bold', 
                  fontSize: 16, 
                  color: '#333',
                  display: 'block',
                  marginBottom: 8
                }}>
                  Text Size
                </label>
                <select 
                  value={form.textSize} 
                  onChange={e => handleChange('textSize', e.target.value)} 
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    border: '1px solid #ddd', 
                    borderRadius: 6, 
                    fontSize: 14,
                    outline: 'none',
                    background: '#fff'
                  }}
                >
                  {FB_TEXT_SIZES.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>

              {error && (
                <div style={{ 
                  color: '#d32f2f', 
                  fontSize: 14, 
                  marginBottom: 20,
                  padding: '8px 12px',
                  background: '#ffebee',
                  borderRadius: 4,
                  border: '1px solid #ffcdd2'
                }}>
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: 12, 
                marginTop: 'auto',
                paddingTop: 20
              }}>
                <button 
                  onClick={handlePreview} 
                  style={{ 
                    padding: '12px 24px', 
                    background: '#1976d2', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 6, 
                    cursor: 'pointer', 
                    fontSize: 14,
                    fontWeight: 'bold'
                  }}
                >
                  Preview
                </button>
                <button 
                  onClick={handleSave} 
                  style={{ 
                    padding: '12px 24px', 
                    background: '#ff9800', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 6, 
                    cursor: 'pointer', 
                    fontSize: 14,
                    fontWeight: 'bold'
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Language Tab Content */}
          {activeTab === 'language' && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', color: '#666' }}>
                <div style={{ fontSize: 18, marginBottom: 10 }}>Language Settings</div>
                <div style={{ fontSize: 14 }}>Language customization options will be available here.</div>
              </div>
            </div>
          )}
        </div>

        {/* Preview Modal */}
        {showPreview && pageId && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            background: 'rgba(0,0,0,0.7)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 2000 
          }}>
            <div style={{ 
              background: '#fff', 
              borderRadius: 10, 
              boxShadow: '0 4px 32px rgba(0,0,0,0.20)', 
              padding: 0, 
              width: '90vw', 
              maxWidth: 700, 
              height: '60vw', 
              maxHeight: 420, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              position: 'relative' 
            }}>
              <button 
                onClick={() => setShowPreview(false)} 
                style={{ 
                  position: 'absolute', 
                  top: 10, 
                  right: 18, 
                  fontSize: 24, 
                  background: 'none', 
                  border: 'none', 
                  color: '#333', 
                  cursor: 'pointer', 
                  zIndex: 10 
                }}
              >
                ×
              </button>
              <iframe
                src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(form.url)}&tabs=${form.mediaOption}&width=680&height=360&small_header=${form.textSize === 'small'}&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`}
                width="680"
                height="360"
                style={{ border: 'none', overflow: 'hidden', borderRadius: 8 }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacebookModal;