import React, { useState } from 'react';
// import YouTube from 'react-youtube'; // Uncomment if react-youtube is installed

const YT_QUALITIES = [
  { value: 'auto', label: 'Auto' },
  { value: 'hd1080', label: '1080p' },
  { value: 'hd720', label: '720p' },
  { value: 'large', label: '480p' },
  { value: 'medium', label: '360p' },
];
const YT_SUBTITLES = [
  { value: 'default', label: 'Default' },
  { value: 'off', label: 'Off' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
];

function extractYouTubeId(url) {
  const regExp = /^.*(?:youtu.be\/|v=|\/v\/|embed\/|shorts\/|playlist\?list=)([\w-]{11,}).*$/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : '';
}

const YouTubeVideoModal = ({ open = true, onClose, onSave, initialData = {} }) => {
  const [form, setForm] = useState({
    appName: initialData.appName || 'YouTube Video',
    tags: initialData.tags || '',
    url: initialData.url || '',
    quality: initialData.quality || 'auto',
    subtitle: initialData.subtitle || 'default',
  });
  const [activeTab, setActiveTab] = useState('settings');
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePreview = () => {
    if (!form.url || !extractYouTubeId(form.url)) {
      setError('Please enter a valid YouTube video URL.');
      return;
    }
    setError('');
    setShowPreview(true);
  };

const handleSave = () => {
  if (!form.url || !extractYouTubeId(form.url)) {
    setError('Please enter a valid YouTube video URL.');
    return;
  }
  setError('');

  const widgetToSave = {
    type: "social-network",
    name: form.appName || "YouTube Video",
    appName: form.appName || "YouTube Video",
    originalName: "YouTube Video",
    tags: form.tags || [],
    url: form.url,
    quality: form.quality,
    subtitle: form.subtitle,
    widgetSubType: 'youtube-video',
    widgetCategory: 'Social Networks'
  };
  
  // Call onSave with the widget data
  onSave && onSave(widgetToSave);
  onClose && onClose();
};
// ...existing code...
  const videoId = extractYouTubeId(form.url);

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
                height: 28, 
                background: '#ff0000', 
                borderRadius: 4, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <div style={{ 
                  width: 0, 
                  height: 0, 
                  borderLeft: '8px solid #fff', 
                  borderTop: '6px solid transparent', 
                  borderBottom: '6px solid transparent',
                  marginLeft: 2
                }}></div>
              </div>
              <span style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>YouTube</span>
            </div>
          </div>
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: 24, 
            color: '#1976d2', 
            marginBottom: 15,
            textAlign: 'center'
          }}>
            YouTube Video
          </div>
          <div style={{ 
            color: '#666', 
            fontSize: 14, 
            textAlign: 'center',
            lineHeight: 1.4
          }}>
            Automatically plays a video from YouTube in a loop.
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

              {/* YouTube Video URL */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ 
                  fontWeight: 'bold', 
                  fontSize: 16, 
                  color: '#333',
                  display: 'block',
                  marginBottom: 8
                }}>
                  YouTube Video URL
                </label>
                <input 
                  type="text" 
                  value={form.url} 
                  onChange={e => handleChange('url', e.target.value)} 
                  placeholder="https://www.youtube.com/watch?v=..." 
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
                  The specified URL must look like one of these:<br />
                  "https://www.youtube.com/watch?v=9d8wWcJLnFI",<br />
                  "https://www.youtube.com/playlist?list=PLivjPDIt6ApRnSNK_H90ufThcTOtKxXyM"
                </div>
              </div>

              {/* Video Quality and Subtitle */}
              <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ 
                    fontWeight: 'bold', 
                    fontSize: 16, 
                    color: '#333',
                    display: 'block',
                    marginBottom: 8
                  }}>
                    Video Quality
                  </label>
                  <select 
                    value={form.quality} 
                    onChange={e => handleChange('quality', e.target.value)} 
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
                    {YT_QUALITIES.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}
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
                    Subtitle (If available)
                  </label>
                  <select 
                    value={form.subtitle} 
                    onChange={e => handleChange('subtitle', e.target.value)} 
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
                    {YT_SUBTITLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <div style={{ 
                    fontSize: 12, 
                    color: '#888', 
                    marginTop: 8,
                    lineHeight: 1.4
                  }}>
                    If the selected subtitle is not available the publisher's default subtitle will be shown instead.
                  </div>
                </div>
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
        {showPreview && videoId && (
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
              background: '#000', 
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
                  color: '#fff', 
                  cursor: 'pointer', 
                  zIndex: 10 
                }}
              >
                ×
              </button>
              <iframe
                width="100%"
                height="360"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&vq=${form.quality}&cc_load_policy=${form.subtitle !== 'off' ? 1 : 0}&cc_lang_pref=${form.subtitle !== 'default' ? form.subtitle : ''}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: 8, width: '100%', maxWidth: 680, height: 360, background: '#000' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeVideoModal;