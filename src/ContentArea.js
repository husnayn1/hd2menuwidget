import React, { useState, useRef, useEffect } from "react";
import lightningImg from './images/lightning.jpg';
import clocksImg from './images/clocks.png';
import cloudsImg from './images/clouds.jpg';
import { EntertainmentKonva, FinanceKonva, FinanceCustomizeModal, ClockPreviewModal, Clock, FacebookPage, BirthdayAnnouncement, CalendarApp } from './widgets';
import { MeetingAndCalendar } from './widgets/meeting-calendar';
import FacebookModern from './widgets/social-networks/FacebookModern';
import FollowUs from './widgets/social-networks/FollowUs';
import WeatherPreview from './WeatherPreview';
import SocialNetworkPreview from './SocialNetworkPreview';

const MENU_ACTIONS = [
  { label: "Publish", icon: "↗" },
  { label: "Unpublish", icon: "↩" },
  { label: "Restrictions", icon: "🔒" },
  { label: "Preview", icon: "▶" },
  { label: "Edit Properties", icon: "✏️" },
  { label: "Display Configuration", icon: "🖥️" },
  { label: "Move", icon: "➔" },
  { label: "Mark as Favorite", icon: "★" },
  { label: "Duplicate", icon: "📄" },
  { label: "New Campaign", icon: "📢" },
  { label: "New Playlist", icon: "📚" },
  { label: "New Composition", icon: "🖼️" },
  { label: "Show Usage", icon: "📊" },
  { label: "Download", icon: "⬇️", download: true },
  { label: "Permissions", icon: "🔑" },
  { label: "Download Excel Report", icon: "📊" },
  { label: "Delete", icon: "🗑️", danger: true, delete: true }
];

function highlightMatch(name, search) {
  if (!search) return name;
  const idx = name.toLowerCase().indexOf(search.toLowerCase());
  if (idx === -1) return name;
  return <>
    {name.slice(0, idx)}
    <span style={{ background: '#ffe066', borderRadius: 3 }}>{name.slice(idx, idx + search.length)}</span>
    {name.slice(idx + search.length)}
  </>;
}

function ContentArea({ media, onRenameMedia, onDeleteMedia, search, onEditWidget }) {
  const [editingIdx, setEditingIdx] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [menu, setMenu] = useState({ open: false, x: 0, y: 0, idx: null });
  const [previewWidget, setPreviewWidget] = useState(null);
  const [customizeWidget, setCustomizeWidget] = useState(null);
  const menuRef = useRef();

  // Close menu on click outside or scroll
  useEffect(() => {
    if (!menu.open) return;
    const handle = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenu({ open: false, x: 0, y: 0, idx: null });
    };
    const handleScroll = () => setMenu({ open: false, x: 0, y: 0, idx: null });
    document.addEventListener('mousedown', handle);
    document.addEventListener('touchstart', handle);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handle);
      document.removeEventListener('touchstart', handle);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [menu.open]);

  // Long-press for mobile
  let longPressTimer = useRef();
  const handleTouchStart = (e, idx) => {
    longPressTimer.current = setTimeout(() => {
      const touch = e.touches[0];
      setMenu({ open: true, x: touch.clientX, y: touch.clientY, idx });
    }, 600);
  };
  const handleTouchEnd = () => clearTimeout(longPressTimer.current);

  const handleContextMenu = (e, idx) => {
    e.preventDefault();
    
    // Calculate position to ensure menu stays within viewport
    const menuWidth = 380;
    const menuHeight = 400; // Approximate height for all menu items
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let x = e.clientX;
    let y = e.clientY;
    
    // Adjust X position if menu would go off-screen
    if (x + menuWidth > viewportWidth) {
      x = viewportWidth - menuWidth - 10;
    }
    
    // Adjust Y position if menu would go off-screen
    if (y + menuHeight > viewportHeight) {
      y = viewportHeight - menuHeight - 10;
    }
    
    // Ensure minimum position
    x = Math.max(10, x);
    y = Math.max(10, y);
    
    setMenu({ open: true, x, y, idx });
  };

  const handleMenuAction = (action) => {
    if (action.download && menu.idx !== null) {
      // Download image
      const item = allMedia[menu.idx];
      if (item && item.type === 'image') {
        const link = document.createElement('a');
        link.href = item.url;
        link.download = item.name || 'image';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else if (action.delete && menu.idx !== null) {
      // Delete image or widget
      const item = allMedia[menu.idx];
      if (item) {
        // For static images and test widgets, just close the menu (they can't be permanently deleted)
        if (item.name === 'Lightning' || item.name === 'Clocks' || item.name === 'Clouds' || 
            item.name === 'Analog Round Clock' || item.name === '7 days exchange rate') {
          console.log(`Cannot delete static/test item: ${item.name}`);
          setMenu({ open: false, x: 0, y: 0, idx: null });
          return;
        }
        // For actual media items, find their index in the original media array and delete
        const mediaIndex = media.findIndex(mediaItem => mediaItem === item);
        if (mediaIndex !== -1) {
          onDeleteMedia(mediaIndex);
        }
      }
    } else if (action.label === "Preview" && menu.idx !== null) {
      // Preview widget
      const item = allMedia[menu.idx];
      if (item && (item.type === 'widget' || item.type === 'finance' || item.type === 'weather' || item.type === 'news-feed' || item.type === 'rss-feed' || item.type === 'news-ticker')) {
        setPreviewWidget(item);
      }
    } else if (action.label === "Edit Properties" && menu.idx !== null) {
      // Edit widget properties - for all widgets including clocks, finance, weather, meeting-calendar, menu-board, news-feed, and rss-feed
      const item = allMedia[menu.idx];
      if (item && (item.type === 'widget' || item.type === 'finance' || item.type === 'weather' || item.type === 'meeting-calendar' || item.type === 'menu-board' || item.type === 'news-feed' || item.type === 'rss-feed' || item.type === 'news-ticker')) {
        // Check if it's a finance widget
        const isFinance = item.type === "finance" || item.name?.toLowerCase().includes("exchange") || 
                         item.name?.toLowerCase().includes("ticker") || 
                         item.name?.toLowerCase().includes("currency") ||
                         item.name?.toLowerCase().includes("symbol") ||
                         item.name?.toLowerCase().includes("chart");
        
        // Check if it's a weather widget
        const isWeather = item.type === 'weather' || item.name?.toLowerCase().includes('weather');
        
        // Check if it's a meeting-calendar widget
        const isMeetingCalendar = item.type === 'meeting-calendar' || 
                                 item.name?.toLowerCase().includes('meeting room') || 
                                 item.name?.toLowerCase().includes('calendar') || 
                                 item.name?.toLowerCase().includes('birthday');
        
        // Check if it's a menu-board widget
        const isMenuBoard = item.type === 'menu-board' || 
                           item.name?.toLowerCase().includes('menu') || 
                           item.name?.toLowerCase().includes('cafeteria') || 
                           item.name?.toLowerCase().includes('directory') || 
                           item.name?.toLowerCase().includes('sales') || 
                           item.name?.toLowerCase().includes('table');
        
        // Check if it's a news or RSS feed widget
        const isNewsFeed = item.type === 'news-feed' || item.type === 'rss-feed' || item.type === 'news-ticker' ||
                          item.name?.toLowerCase().includes('news') || 
                          item.name?.toLowerCase().includes('rss') || 
                          item.name?.toLowerCase().includes('feed') || 
                          item.name?.toLowerCase().includes('ticker');
        
        if (isFinance) {
          console.log("Opening FinanceCustomizeModal for:", item);
          setCustomizeWidget({ ...item, type: 'finance' }); // always enforce type
        } else if (isWeather) {
          console.log("Opening WeatherCustomizeModal for:", item);
          if (onEditWidget) {
            onEditWidget(item);
          }
        } else if (isMeetingCalendar) {
          console.log("Opening Meeting Room & Calendar customize modal for:", item);
          if (onEditWidget) {
            onEditWidget(item);
          }
        } else if (isMenuBoard) {
          console.log("Opening Menu Boards & Tables customize modal for:", item);
          if (onEditWidget) {
            onEditWidget(item);
          }
        } else if (isNewsFeed) {
          console.log("Opening News & RSS Feeds customize modal for:", item);
          if (onEditWidget) {
            onEditWidget(item);
          }
        } else if (onEditWidget) {
          onEditWidget(item);
        }
      }
    } else {
      alert(`Action: ${action.label}`);
    }
    setMenu({ open: false, x: 0, y: 0, idx: null });
  };

  // Handle direct click on widgets for preview
  const handleWidgetClick = (item, idx) => {
    console.log("Widget clicked:", item.name, "Type:", item.type);
    console.log("Full widget data:", item);
    
    // For all widget types, show preview instead of opening edit mode
    // This allows users to see the actual widget preview when clicking
    setPreviewWidget(item);
  };

  const handleEditClick = (idx, currentName) => {
    setEditingIdx(idx);
    setEditValue(currentName);
  };

  const handleEditChange = (e) => setEditValue(e.target.value);

  const handleEditSave = (idx) => {
    if (editValue.trim()) {
      onRenameMedia(idx, editValue.trim());
    }
    setEditingIdx(null);
    setEditValue("");
  };

  const handleEditKeyDown = (e, idx) => {
    if (e.key === 'Enter') handleEditSave(idx);
    if (e.key === 'Escape') {
      setEditingIdx(null);
      setEditValue("");
    }
  };

  const filteredMedia = search
    ? media.filter(item => item.name && item.name.toLowerCase().includes(search.toLowerCase()))
    : media;

  // Prepare static images as media-like objects
  const staticImages = [
    { url: lightningImg, name: 'Lightning', type: 'image' },
    { url: clocksImg, name: 'Clocks', type: 'image' },
    { url: cloudsImg, name: 'Clouds', type: 'image' },
  ];
  
  const allMedia = [...staticImages, ...filteredMedia];

  return (
    <div style={{ padding: 30, flex: 1, background: '#f9f9fb', minHeight: 0, height: '100%' }}>
      {/* Media heading with dummy image */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
        <img src={clocksImg} alt="Clocks" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }} />
        <div style={{ fontSize: 20, fontWeight: 'bold' }}>Media</div>
      </div>
      {/* Unified horizontal row for static and uploaded media */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, maxHeight: '60vh', overflowY: 'auto' }}>
        {allMedia.length === 0 && (
          <div style={{ color: '#bbb', fontSize: 16 }}>No media found.</div>
        )}
        {allMedia.map((item, idx) => {
          console.log("Rendering item:", item.name, "Type:", item.type, "Full item:", item);
          return (
          <div
            key={idx}
            style={{ 
              width: 120, 
              height: 160, /* Increased height to accommodate the widget name */
              background: '#fff', 
              border: '1px solid #eee', 
              borderRadius: 8, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'flex-start', /* Changed to flex-start to align content from top */
              color: '#444', 
              fontSize: 16, 
              overflow: 'hidden', 
              padding: 6, 
              position: 'relative', 
              userSelect: 'none',
              cursor: item.type === 'widget' || item.type === 'weather' || item.type === 'meeting-calendar' || item.type === 'menu-board' || item.type === 'news-feed' || item.type === 'rss-feed' || item.type === 'news-ticker' || item.type === 'social-network' || item.name?.toLowerCase().includes('weather') || item.name?.toLowerCase().includes('meeting room') || item.name?.toLowerCase().includes('calendar') || item.name?.toLowerCase().includes('birthday') || item.name?.toLowerCase().includes('menu') || item.name?.toLowerCase().includes('cafeteria') || item.name?.toLowerCase().includes('directory') || item.name?.toLowerCase().includes('sales') || item.name?.toLowerCase().includes('table') || item.name?.toLowerCase().includes('news') || item.name?.toLowerCase().includes('rss') || item.name?.toLowerCase().includes('feed') || item.name?.toLowerCase().includes('ticker') || item.name?.toLowerCase().includes('youtube') || item.name?.toLowerCase().includes('facebook') ? 'pointer' : 'default'
            }}
                          onClick={item.type === 'widget' || item.type === 'weather' || item.type === 'meeting-calendar' || item.type === 'menu-board' || item.type === 'news-feed' || item.type === 'rss-feed' || item.type === 'news-ticker' || item.type === 'social-network' || item.name?.toLowerCase().includes('weather') || item.name?.toLowerCase().includes('meeting room') || item.name?.toLowerCase().includes('calendar') || item.name?.toLowerCase().includes('birthday') || item.name?.toLowerCase().includes('menu') || item.name?.toLowerCase().includes('cafeteria') || item.name?.toLowerCase().includes('directory') || item.name?.toLowerCase().includes('sales') || item.name?.toLowerCase().includes('table') || item.name?.toLowerCase().includes('news') || item.name?.toLowerCase().includes('rss') || item.name?.toLowerCase().includes('feed') || item.name?.toLowerCase().includes('ticker') || item.name?.toLowerCase().includes('youtube') || item.name?.toLowerCase().includes('facebook') ? () => handleWidgetClick(item, idx) : undefined}
            onContextMenu={e => handleContextMenu(e, idx)}
            onTouchStart={e => handleTouchStart(e, idx)}
            onTouchEnd={handleTouchEnd}
          >
            {/* Widget Name Label */}
            <div style={{ 
              fontSize: 12, 
              fontWeight: 'bold', 
              color: '#1976d2', 
              marginBottom: 6, 
              textAlign: 'center',
              width: '100%',
              padding: '4px 2px',
              borderBottom: '1px solid #eee'
            }}>
              {item.name}
            </div>
            {item.type === 'image' ? (
              <>
                <img src={item.url} alt={item.name} style={{ maxWidth: '100%', maxHeight: 90, marginBottom: 6 }} />
                <div style={{ fontSize: 13, color: '#888', wordBreak: 'break-all', textAlign: 'center', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {editingIdx === media.indexOf(item) ? (
                    <>
                      <input
                        value={editValue}
                        onChange={handleEditChange}
                        onBlur={() => handleEditSave(media.indexOf(item))}
                        onKeyDown={e => handleEditKeyDown(e, media.indexOf(item))}
                        autoFocus
                        style={{ fontSize: 13, padding: 2, borderRadius: 3, border: '1px solid #ccc', width: 70 }}
                      />
                      <button onClick={() => handleEditSave(media.indexOf(item))} style={{ marginLeft: 2, fontSize: 13, cursor: 'pointer', border: 'none', background: 'transparent', color: '#1976d2' }}>✔</button>
                    </>
                  ) : (
                    <>
                      <span>{highlightMatch(item.name, search)}</span>
                      {item !== staticImages[0] && item !== staticImages[1] && item !== staticImages[2] && (
                        <button onClick={() => handleEditClick(media.indexOf(item), item.name)} style={{ marginLeft: 2, fontSize: 13, cursor: 'pointer', border: 'none', background: 'transparent', color: '#1976d2' }} title="Rename">
                          ✎
                        </button>
                      )}
                    </>
                  )}
                </div>
              </>
            ) : item.type === 'widget' || item.type === 'social-network' ? (
              <>
                {(() => {
                  // Simplified clock detection - just check the name
                  const isClock = item.name?.toLowerCase().includes("clock");
                  
                  console.log("Widget check:", item.name, "isClock:", isClock, "item.type:", item.type);
                  
                  if (isClock) {
                    // Determine the correct clock type based on widget name
                    let clockType = item.type;
                    console.log("Clock detection - Item type:", item.type, "Item name:", item.name);

                    
                    if (!clockType) {
                      if (item.name?.toLowerCase().includes("analog round")) clockType = "analog-round";
                      else if (item.name?.toLowerCase().includes("analog square")) clockType = "analog-square";
                      else if (item.name?.toLowerCase().includes("digital")) clockType = "digital-simple";
                      else if (item.name?.toLowerCase().includes("bar")) clockType = "bar-modern";
                      else if (item.name?.toLowerCase().includes("countdown")) clockType = "countdown-app";
                      else if (item.name?.toLowerCase().includes("glow")) clockType = "glow-clock";
                      else if (item.name?.toLowerCase().includes("holiday")) clockType = "holiday-clock";
                      else if (item.name?.toLowerCase().includes("lcd")) clockType = "lcd-clock";
                      else if (item.name?.toLowerCase().includes("multi city")) clockType = "multi-city-clock";
                      else clockType = "analog-round"; // Default fallback
                    }
                    
                    console.log("Final clock type determined:", clockType);
                    
                     // Use the actual Clock component with saved customizations
                     console.log("Rendering clock widget:", item.name, "Type:", clockType, "Item data:", item);
                     
                     // Simple clock rendering for all clock types
                     const now = new Date();
                     
                     // Check if it's a digital clock
                     if (item.name?.toLowerCase().includes("digital")) {
                       const timeString = now.toLocaleTimeString([], { 
                         hour: '2-digit', 
                         minute: '2-digit',
                         hour12: true
                       });
                       
                       return (
                         <div style={{ 
                           width: 90, 
                           height: 90, 
                           display: 'flex', 
                           alignItems: 'center', 
                           justifyContent: 'center',
                           marginBottom: 6,
                           borderRadius: 4,
                           background: '#ffffff',
                           border: '1px solid #eee',
                           position: 'relative'
                         }}>
                           <div style={{
                             fontSize: 16,
                             fontWeight: 'bold',
                             color: '#333',
                             textAlign: 'center',
                             fontFamily: 'Arial'
                           }}>
                             {timeString}
                           </div>
                         </div>
                       );
                     } else {
                       // For different clock types, show their specific designs
                       const hours = now.getHours() % 12;
                       const minutes = now.getMinutes();
                       const seconds = now.getSeconds();
                       
                       const hourAngle = ((hours + minutes / 60) * Math.PI) / 6 - Math.PI / 2;
                       const minuteAngle = (minutes * Math.PI) / 30 - Math.PI / 2;
                       const secondAngle = (seconds * Math.PI) / 30 - Math.PI / 2;
                       
                       // Determine clock type
                       const clockName = item.name?.toLowerCase();
                       const isSquare = clockName.includes("square");
                       const isHoliday = clockName.includes("holiday");
                       const isLcd = clockName.includes("lcd");
                       const isGlow = clockName.includes("glow");
                       const isCountdown = clockName.includes("countdown");
                       const isBar = clockName.includes("bar");
                       const isMultiCity = clockName.includes("multi city");
                       
                       // Holiday Clock - Special themed design
                       if (isHoliday) {
                         return (
                           <div style={{ 
                             width: 90, 
                             height: 90, 
                             display: 'flex', 
                             alignItems: 'center', 
                             justifyContent: 'center',
                             marginBottom: 6,
                             borderRadius: '50%',
                             background: '#fffbe6',
                             border: '2px solid #e74c3c',
                             position: 'relative'
                           }}>
                             <div style={{ fontSize: 32, color: '#e74c3c' }}>🎄</div>
                           </div>
                         );
                       }
                       
                       // LCD Clock - Digital LCD style
                       if (isLcd) {
                         const timeString = now.toLocaleTimeString([], { 
                           hour: '2-digit', 
                           minute: '2-digit',
                           second: '2-digit',
                           hour12: false
                         });
                         
                         return (
                           <div style={{ 
                             width: 90, 
                             height: 90, 
                             display: 'flex', 
                             alignItems: 'center', 
                             justifyContent: 'center',
                             marginBottom: 6,
                             borderRadius: 4,
                             background: '#222',
                             border: '1px solid #444',
                             position: 'relative'
                           }}>
                             <div style={{
                               fontSize: 14,
                               fontWeight: 'bold',
                               color: '#00ff00',
                               textAlign: 'center',
                               fontFamily: 'monospace',
                               letterSpacing: 1
                             }}>
                               {timeString}
                             </div>
                           </div>
                         );
                       }
                       
                       // Glow Clock - Glowing ring effect
                       if (isGlow) {
                         const progress = seconds / 60;
                         const radius = 35;
                         const circumference = 2 * Math.PI * radius;
                         const offset = circumference * (1 - progress);
                         
                         return (
                           <div style={{ 
                             width: 90, 
                             height: 90, 
                             display: 'flex', 
                             alignItems: 'center', 
                             justifyContent: 'center',
                             marginBottom: 6,
                             borderRadius: '50%',
                             background: '#ffffff',
                             border: '1px solid #eee',
                             position: 'relative'
                           }}>
                             <svg width="80" height="80" viewBox="0 0 80 80">
                               {/* Background ring */}
                               <circle cx="40" cy="40" r="35" fill="none" stroke="#e1e2eb" strokeWidth="4"/>
                               {/* Glowing progress ring */}
                               <circle 
                                 cx="40" cy="40" r="35" 
                                 fill="none" 
                                 stroke="#e83e00" 
                                 strokeWidth="4"
                                 strokeDasharray={circumference}
                                 strokeDashoffset={offset}
                                 strokeLinecap="round"
                                 filter="drop-shadow(0 0 4px #e83e00)"
                               />
                               {/* Time display */}
                               <text
                                 x="40" y="45"
                                 textAnchor="middle"
                                 fontSize="12"
                                 fill="#333"
                                 fontFamily="Arial"
                                 fontWeight="bold"
                               >
                                 {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                               </text>
                             </svg>
                           </div>
                         );
                       }
                       
                       // Bar Clock - Modern bar style
                       if (isBar) {
                         const timeString = now.toLocaleTimeString([], { 
                           hour: '2-digit', 
                           minute: '2-digit',
                           hour12: true
                         });
                         
                         return (
                           <div style={{ 
                             width: 90, 
                             height: 90, 
                             display: 'flex', 
                             alignItems: 'center', 
                             justifyContent: 'center',
                             marginBottom: 6,
                             borderRadius: 8,
                             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                             border: '1px solid #eee',
                             position: 'relative'
                           }}>
                             <div style={{
                               fontSize: 14,
                               fontWeight: 'bold',
                               color: '#ffffff',
                               textAlign: 'center',
                               fontFamily: 'Arial'
                             }}>
                               {timeString}
                             </div>
                           </div>
                         );
                       }
                       
                       // Multi City Clock - Multiple time zones
                       if (isMultiCity) {
                         const getTime = (offset) => {
                           const d = new Date(now.getTime() + offset * 60 * 60 * 1000);
                           return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                         };
                         
                         return (
                           <div style={{ 
                             width: 90, 
                             height: 90, 
                             display: 'flex', 
                             flexDirection: 'column',
                             alignItems: 'center', 
                             justifyContent: 'center',
                             marginBottom: 6,
                             borderRadius: 8,
                             background: '#f7fafd',
                             border: '1px solid #eee',
                             position: 'relative',
                             padding: 4
                           }}>
                             <div style={{ fontSize: 10, fontWeight: 'bold', color: '#2166b3' }}>NY: {getTime(-4)}</div>
                             <div style={{ fontSize: 10, fontWeight: 'bold', color: '#e67e22' }}>LD: {getTime(1)}</div>
                             <div style={{ fontSize: 10, fontWeight: 'bold', color: '#27ae60' }}>TK: {getTime(9)}</div>
                           </div>
                         );
                       }
                       
                       // Default analog clock (round or square)
                       return (
                         <div style={{ 
                           width: 90, 
                           height: 90, 
                           display: 'flex', 
                           alignItems: 'center', 
                           justifyContent: 'center',
                           marginBottom: 6,
                           borderRadius: isSquare ? 4 : '50%',
                           background: '#ffffff',
                           border: '1px solid #eee',
                           position: 'relative'
                         }}>
                           <svg width="80" height="80" viewBox="0 0 80 80">
                             {/* Clock face - square or round */}
                             {isSquare ? (
                               <rect x="4" y="4" width="72" height="72" fill="#ffffff" stroke="#000000" strokeWidth="2"/>
                             ) : (
                               <circle cx="40" cy="40" r="35" fill="#ffffff" stroke="#000000" strokeWidth="2"/>
                             )}
                             {/* Hour hand */}
                             <line 
                               x1="40" y1="40" 
                               x2={40 + Math.cos(hourAngle) * 15} 
                               y2={40 + Math.sin(hourAngle) * 15}
                               stroke="#000000" 
                               strokeWidth="3" 
                               strokeLinecap="round"
                             />
                             {/* Minute hand */}
                             <line 
                               x1="40" y1="40" 
                               x2={40 + Math.cos(minuteAngle) * 20} 
                               y2={40 + Math.sin(minuteAngle) * 20}
                               stroke="#000000" 
                               strokeWidth="2" 
                               strokeLinecap="round"
                             />
                             {/* Center dot */}
                             <circle cx="40" cy="40" r="2" fill="#000000"/>
                           </svg>
                         </div>
                       );
                     }
                  } else if (item.type === 'social-network' && item.widgetSubType === 'youtube-video') {
                    // For YouTube Video widgets, show the actual video embed
                    if (item.url) {
                      // Extract YouTube video ID from URL
                      const extractYouTubeId = (url) => {
                        const regExp = /^.*(?:youtu.be\/|v=|\/v\/|embed\/|shorts\/|playlist\?list=)([\w-]{11,}).*$/;
                        const match = url.match(regExp);
                        return match && match[1] ? match[1] : '';
                      };
                      
                      const videoId = extractYouTubeId(item.url);
                      
                      if (videoId) {
                        return (
                          <div style={{
                            width: 90,
                            height: 90,
                            marginBottom: 6,
                            borderRadius: 4,
                            border: '1px solid #eee',
                            position: 'relative',
                            overflow: 'hidden',
                            background: '#000'
                          }}>
                            <iframe
                              width="90"
                              height="90"
                              src={`https://www.youtube.com/embed/${videoId}?autoplay=0&vq=${item.quality || 'auto'}&cc_load_policy=${item.subtitle !== 'off' ? 1 : 0}&cc_lang_pref=${item.subtitle !== 'default' ? item.subtitle : ''}`}
                              title="YouTube video player"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              style={{ width: '100%', height: '100%', border: 'none' }}
                            />
                          </div>
                        );
                      }
                    }
                    
                    // Fallback to static YouTube preview
                    return (
                      <div style={{ 
                        width: 90, 
                        height: 90, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginBottom: 6,
                        borderRadius: 4,
                        background: '#ff0000',
                        border: '1px solid #eee',
                        position: 'relative'
                      }}>
                        <div style={{ color: '#fff', textAlign: 'center', fontSize: 10 }}>
                          <div style={{ marginBottom: 4, fontSize: 20 }}>▶</div>
                          <div style={{ fontSize: 8 }}>YouTube</div>
                        </div>
                      </div>
                    );
                  } else if (item.type === 'finance') {
                    // For finance widgets, show a finance preview
                    return (
                      <div style={{ 
                        width: 90, 
                        height: 90, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginBottom: 6,
                        borderRadius: 4,
                        background: '#2c3e50',
                        border: '1px solid #eee',
                        position: 'relative'
                      }}>
                        <div style={{ color: '#fff', textAlign: 'center', fontSize: 10 }}>
                          <div style={{ marginBottom: 4 }}>💱</div>
                          <div style={{ fontSize: 8 }}>Finance</div>
                        </div>
                      </div>
                    );
                  } else if (item.type === 'weather' || item.name?.toLowerCase().includes('weather')) {
                    // For weather widgets, show the customized weather widget
                    return (
                      <div style={{
                        width: 90,
                        height: 90,
                        borderRadius: 8,
                        overflow: 'hidden',
                        marginBottom: 6,
                        background: item.backgroundImage ? `url(${item.backgroundImage})` : (item.backgroundColor || 'linear-gradient(135deg, #1976d2, #42a5f5)'),
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        position: 'relative',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}>
                        {/* Weather Widget Preview */}
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative'
                        }}>
                          {/* Top Section - Current Weather */}
                          <div style={{
                            height: '60%',
                            background: item.topSectionColor ? `linear-gradient(135deg, ${item.topSectionColor}, ${item.topSectionColor}dd)` : 'linear-gradient(135deg, #ffeb3b, #ffc107)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            position: 'relative'
                          }}>
                            <div style={{ fontSize: 20, color: 'white' }}>☀️</div>
                            <div style={{ 
                              textAlign: 'right', 
                              color: item.textColor || 'white',
                              fontFamily: item.textFont || 'Arial, sans-serif'
                            }}>
                              <div style={{ 
                                fontSize: 8, 
                                fontWeight: 'bold',
                                fontFamily: item.textFont || 'Arial, sans-serif'
                              }}>
                                {item.forecastLocation || 'Lahore'}
                              </div>
                              <div style={{ 
                                fontSize: 10, 
                                fontWeight: 'bold',
                                fontStyle: 'italic',
                                fontFamily: item.textFont || 'Arial, sans-serif'
                              }}>
                                NOW
                              </div>
                              <div style={{ 
                                fontSize: 16, 
                                fontWeight: 'bold',
                                fontStyle: 'italic',
                                fontFamily: item.textFont || 'Arial, sans-serif'
                              }}>
                                32°{item.units === 'Celsius' ? 'C' : 'F'}
                              </div>
                            </div>
                          </div>

                          {/* Bottom Section - Forecast */}
                          <div style={{
                            height: '40%',
                            background: item.bottomSectionColor ? `linear-gradient(135deg, ${item.bottomSectionColor}, ${item.bottomSectionColor}dd)` : 'linear-gradient(135deg, #87ceeb, #4fc3f7)',
                            padding: '4px 12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            {['TUE', 'WED', 'THU'].map((day, index) => (
                              <div key={index} style={{
                                textAlign: 'center',
                                color: item.textColor || 'white',
                                fontFamily: item.textFont || 'Arial, sans-serif'
                              }}>
                                <div style={{ 
                                  fontSize: 10, 
                                  marginBottom: 2,
                                  fontFamily: item.textFont || 'Arial, sans-serif'
                                }}>
                                  ☀️
                                </div>
                                <div style={{ 
                                  fontSize: 6, 
                                  fontWeight: 'bold',
                                  fontStyle: 'italic',
                                  fontFamily: item.textFont || 'Arial, sans-serif'
                                }}>
                                  {day}
                                </div>
                                <div style={{ 
                                  fontSize: 5, 
                                  fontWeight: 'bold',
                                  fontStyle: 'italic',
                                  fontFamily: item.textFont || 'Arial, sans-serif'
                                }}>
                                  35°/28°{item.units === 'Celsius' ? 'C' : 'F'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  } else if (item.type === 'meeting-calendar' || item.name?.toLowerCase().includes('meeting room') || item.name?.toLowerCase().includes('calendar') || item.name?.toLowerCase().includes('birthday')) {
                    // For meeting-calendar widgets, show a preview using the actual components or preview images
                    const isBirthday = item.name?.toLowerCase().includes('birthday');
                    
                    // Check if we have a preview image
                    let previewImage = null;
                    if (item.name?.toLowerCase().includes('birthday')) {
                      previewImage = './images/meeting-calendar/birthday-announcement.svg';
                    } else if (item.name?.toLowerCase().includes('happy birthday')) {
                      previewImage = './images/meeting-calendar/happy-birthday.svg';
                    } else {
                      previewImage = './images/meeting-calendar/calendar-app.svg';
                    }
                    
                    return (
                      <div style={{
                        width: 90,
                        height: 90,
                        marginBottom: 6,
                        borderRadius: 4,
                        border: '1px solid #eee',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={previewImage}
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    );
                  } else if (item.type === 'social-network' || item.name?.toLowerCase().includes('facebook') || item.name?.toLowerCase().includes('youtube') || item.name?.toLowerCase().includes('follow us') || item.name?.toLowerCase().includes('tagbox') || item.name?.toLowerCase().includes('walls.io')) {
                    // For social network widgets, show a social media preview
                    const isFacebook = item.name?.toLowerCase().includes('facebook');
                    const isYouTube = item.name?.toLowerCase().includes('youtube');
                    const isFollowUs = item.name?.toLowerCase().includes('follow us');
                    const isTagbox = item.name?.toLowerCase().includes('tagbox');
                    const isWallsIo = item.name?.toLowerCase().includes('walls.io');
                    
                    if (isFacebook) {
                      // For Facebook widgets, use the actual components
                      const isFacebookPage = item.name === 'Facebook Page' || item.originalName === 'Facebook Page' || item.widgetSubType === 'facebook-page';
                      const isFacebookModern = item.name === 'Facebook Modern' || item.originalName === 'Facebook Modern' || item.widgetSubType === 'facebook-modern';
                      
                      if (isFacebookPage && item.url) {
                        return (
                          <div style={{
                            width: 90,
                            height: 90,
                            marginBottom: 6,
                            borderRadius: 4,
                            border: '1px solid #eee',
                            position: 'relative',
                            overflow: 'hidden'
                          }}>
                            <FacebookPage
                              width={90}
                              height={90}
                              config={item}
                            />
                          </div>
                        );
                      } else if (isFacebookModern) {
                        return (
                          <div style={{
                            width: 90,
                            height: 90,
                            marginBottom: 6,
                            borderRadius: 4,
                            border: '1px solid #eee',
                            position: 'relative',
                            overflow: 'hidden'
                          }}>
                            <FacebookModern
                              width={90}
                              height={90}
                              config={item}
                            />
                          </div>
                        );
                      } else {
                        // Fallback to static preview for other Facebook widgets
                        return (
                          <div style={{
                            width: 90,
                            height: 90,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 6,
                            borderRadius: 4,
                            background: '#3b5998',
                            border: '1px solid #eee',
                            position: 'relative'
                          }}>
                            <div style={{ color: '#fff', textAlign: 'center', fontSize: 10 }}>
                              <div style={{ marginBottom: 4, fontSize: 20 }}>f</div>
                              <div style={{ fontSize: 8 }}>Facebook</div>
                            </div>
                          </div>
                        );
                      }
                    } else if (isYouTube) {
                      // For YouTube widgets, show the actual video thumbnail or embed
                      if (item.url && item.widgetSubType === 'youtube-video') {
                        // Extract YouTube video ID from URL
                        const extractYouTubeId = (url) => {
                          const regExp = /^.*(?:youtu.be\/|v=|\/v\/|embed\/|shorts\/|playlist\?list=)([\w-]{11,}).*$/;
                          const match = url.match(regExp);
                          return match && match[1] ? match[1] : '';
                        };
                        
                        const videoId = extractYouTubeId(item.url);
                        
                        if (videoId) {
                          return (
                            <div style={{
                              width: 90,
                              height: 90,
                              marginBottom: 6,
                              borderRadius: 4,
                              border: '1px solid #eee',
                              position: 'relative',
                              overflow: 'hidden',
                              background: '#000'
                            }}>
                              <iframe
                                width="90"
                                height="90"
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=0&vq=${item.quality || 'auto'}&cc_load_policy=${item.subtitle !== 'off' ? 1 : 0}&cc_lang_pref=${item.subtitle !== 'default' ? item.subtitle : ''}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ width: '100%', height: '100%', border: 'none' }}
                              />
                            </div>
                          );
                        }
                      }
                      
                      // Fallback to static YouTube preview
                      return (
                        <div style={{ 
                          width: 90, 
                          height: 90, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          marginBottom: 6,
                          borderRadius: 4,
                          background: '#ff0000',
                          border: '1px solid #eee',
                          position: 'relative'
                        }}>
                          <div style={{ color: '#fff', textAlign: 'center', fontSize: 10 }}>
                            <div style={{ marginBottom: 4, fontSize: 20 }}>▶</div>
                            <div style={{ fontSize: 8 }}>YouTube</div>
                          </div>
                        </div>
                      );
                    } else if (isFollowUs) {
                      return (
                        <div style={{
                          width: 90,
                          height: 90,
                          marginBottom: 6,
                          borderRadius: 4,
                          border: '1px solid #eee',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          <FollowUs
                            width={90}
                            height={90}
                            config={item}
                          />
                        </div>
                      );
                    } else if (isTagbox) {
                      return (
                        <div style={{ 
                          width: 90, 
                          height: 90, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          marginBottom: 6,
                          borderRadius: 4,
                          background: '#8e44ad',
                          border: '1px solid #eee',
                          position: 'relative'
                        }}>
                          <div style={{ color: '#fff', textAlign: 'center', fontSize: 10 }}>
                            <div style={{ marginBottom: 4, fontSize: 16 }}>#</div>
                            <div style={{ fontSize: 8 }}>Tagbox</div>
                          </div>
                        </div>
                      );
                    } else if (isWallsIo) {
                      return (
                        <div style={{ 
                          width: 90, 
                          height: 90, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          marginBottom: 6,
                          borderRadius: 4,
                          background: '#2c3e50',
                          border: '1px solid #eee',
                          position: 'relative'
                        }}>
                          <div style={{ color: '#fff', textAlign: 'center', fontSize: 10 }}>
                            <div style={{ marginBottom: 4, fontSize: 16 }}>W</div>
                            <div style={{ fontSize: 8 }}>Walls.io</div>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div style={{ 
                          width: 90, 
                          height: 90, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          marginBottom: 6,
                          borderRadius: 4,
                          background: '#3498db',
                          border: '1px solid #eee',
                          position: 'relative'
                        }}>
                          <div style={{ color: '#fff', textAlign: 'center', fontSize: 10 }}>
                            <div style={{ marginBottom: 4, fontSize: 16 }}>🌐</div>
                            <div style={{ fontSize: 8 }}>Social</div>
                          </div>
                        </div>
                      );
                    }
                  } else {
                    // For non-clock widgets, show the image
                    return (
                      <img src={item.image} alt={item.name} style={{ maxWidth: '100%', maxHeight: 90, marginBottom: 6, borderRadius: 4 }} />
                    );
                  }
                })()}
                <div style={{ fontSize: 13, color: '#888', wordBreak: 'break-all', textAlign: 'center', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {editingIdx === media.indexOf(item) ? (
                    <>
                      <input
                        value={editValue}
                        onChange={handleEditChange}
                        onBlur={() => handleEditSave(media.indexOf(item))}
                        onKeyDown={e => handleEditKeyDown(e, media.indexOf(item))}
                        autoFocus
                        style={{ fontSize: 13, padding: 2, borderRadius: 3, border: '1px solid #ccc', width: 70 }}
                      />
                      <button onClick={() => handleEditSave(media.indexOf(item))} style={{ marginLeft: 2, fontSize: 13, cursor: 'pointer', border: 'none', background: 'transparent', color: '#1976d2' }}>✔</button>
                    </>
                  ) : (
                    <>
                      <span>{highlightMatch(item.name, search)}</span>
                      <button onClick={() => handleEditClick(media.indexOf(item), item.name)} style={{ marginLeft: 2, fontSize: 13, cursor: 'pointer', border: 'none', background: 'transparent', color: '#1976d2' }} title="Rename">
                        ✎
                      </button>
                    </>
                  )}
                </div>
                <div style={{ fontSize: 11, color: '#1976d2', fontWeight: 'bold', marginTop: 2 }}>
                  {item.type === 'finance' ? 'FINANCE' :
                   item.type === 'weather' || item.name?.toLowerCase().includes('weather') ? 'WEATHER' :
                   item.type === 'meeting-calendar' || item.name?.toLowerCase().includes('meeting room') || item.name?.toLowerCase().includes('calendar') || item.name?.toLowerCase().includes('birthday') ? 'MEETING' :
                   item.type === 'social-network' || item.name?.toLowerCase().includes('facebook') || item.name?.toLowerCase().includes('youtube') || item.name?.toLowerCase().includes('follow us') || item.name?.toLowerCase().includes('tagbox') || item.name?.toLowerCase().includes('walls.io') ? 'SOCIAL' :
                   'WIDGET'}
                </div>
              </>
            ) : (
              item.name
            )}
          </div>
        );
        })}
        {/* Context Menu */}
        {menu.open && (
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: menu.y,
              left: menu.x,
              zIndex: 9999,
              background: '#fff',
              border: '1px solid #ddd',
              borderRadius: 8,
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
              minWidth: 380,
              maxWidth: 400,
              padding: 8,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 2,
              fontSize: 14,
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
          >
            {MENU_ACTIONS.map((action, i) => (
              <div
                key={action.label}
                onClick={() => handleMenuAction(action)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 12px',
                  cursor: 'pointer',
                  color: action.danger ? '#d32f2f' : '#444',
                  fontWeight: action.danger ? 'bold' : 'normal',
                  borderRadius: 6,
                  transition: 'background 0.2s',
                  background: i === MENU_ACTIONS.length - 1 ? '#fff8f8' : 'transparent',
                  whiteSpace: 'nowrap',
                  minHeight: '20px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = i === MENU_ACTIONS.length - 1 ? '#fff8f8' : 'transparent';
                }}
                onMouseDown={e => e.preventDefault()}
              >
                <span style={{ width: 20, textAlign: 'center', fontSize: '16px' }}>{action.icon}</span>
                <span style={{ fontSize: '13px' }}>{action.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Widget Preview Modal */}
      {previewWidget && (
        (() => {
          // Debug logging for clock widgets
          if (previewWidget.name?.toLowerCase().includes("clock")) {
            console.log("ContentArea - Clock widget preview data:", previewWidget);
          }
          
          // Determine widget type
          const isClock = (previewWidget.name?.toLowerCase().includes("clock") ||
                         previewWidget.type === 'analog-round' ||
                         previewWidget.type === 'analog-square' ||
                         previewWidget.type === 'digital-simple' ||
                         previewWidget.type === 'bar-modern' ||
                         previewWidget.type === 'countdown-app' ||
                         previewWidget.type === 'glow-clock' ||
                         previewWidget.type === 'holiday-clock' ||
                         previewWidget.type === 'lcd-clock' ||
                         previewWidget.type === 'multi-city-clock' ||
                         previewWidget.originalName?.toLowerCase().includes("clock")) &&
                         // Ensure it's not an entertainment widget
                         !previewWidget.name?.toLowerCase().includes("american") &&
                         !previewWidget.name?.toLowerCase().includes("football") &&
                         !previewWidget.name?.toLowerCase().includes("basketball") &&
                         !previewWidget.name?.toLowerCase().includes("baseball") &&
                         !previewWidget.name?.toLowerCase().includes("animal") &&
                         !previewWidget.name?.toLowerCase().includes("fact") &&
                         !previewWidget.type?.includes("entertainment");
          
          // Check for entertainment widgets first
          const isEntertainment = previewWidget.type === 'entertainment' ||
                                 previewWidget.name?.toLowerCase().includes("american") ||
                                 previewWidget.name?.toLowerCase().includes("football") ||
                                 previewWidget.name?.toLowerCase().includes("basketball") ||
                                 previewWidget.name?.toLowerCase().includes("baseball") ||
                                 previewWidget.name?.toLowerCase().includes("animal") ||
                                 previewWidget.name?.toLowerCase().includes("fact") ||
                                 previewWidget.name?.toLowerCase().includes("curiosity") ||
                                 previewWidget.name?.toLowerCase().includes("sport");
          
          const isFinance = previewWidget.type === "finance" || previewWidget.name?.toLowerCase().includes("exchange") || 
                           previewWidget.name?.toLowerCase().includes("ticker") || 
                           previewWidget.name?.toLowerCase().includes("currency") ||
                           previewWidget.name?.toLowerCase().includes("symbol") ||
                           previewWidget.name?.toLowerCase().includes("chart");
          const isWeather = previewWidget.type === 'weather' || previewWidget.name?.toLowerCase().includes('weather');
          const isSocialNetwork = previewWidget.type === 'social-network' || 
                                 previewWidget.name?.toLowerCase().includes('facebook') || 
                                 previewWidget.name?.toLowerCase().includes('youtube') || 
                                 previewWidget.name?.toLowerCase().includes('follow us') || 
                                 previewWidget.name?.toLowerCase().includes('tagbox') || 
                                 previewWidget.name?.toLowerCase().includes('walls.io');
          const isMeetingCalendar = previewWidget.type === 'meeting-calendar' ||
                                   previewWidget.name?.toLowerCase().includes('meeting room') ||
                                   previewWidget.name?.toLowerCase().includes('calendar') ||
                                   previewWidget.name?.toLowerCase().includes('birthday');
          const isMenuBoard = previewWidget.type === 'menu-board' ||
                             previewWidget.name?.toLowerCase().includes('menu') ||
                             previewWidget.name?.toLowerCase().includes('cafeteria') ||
                             previewWidget.name?.toLowerCase().includes('directory') ||
                             previewWidget.name?.toLowerCase().includes('sales') ||
                             previewWidget.name?.toLowerCase().includes('table');
          const isNewsFeed = previewWidget.type === 'news-feed' || previewWidget.type === 'rss-feed' || previewWidget.type === 'news-ticker' ||
                            previewWidget.name?.toLowerCase().includes('news') ||
                            previewWidget.name?.toLowerCase().includes('rss') ||
                            previewWidget.name?.toLowerCase().includes('feed') ||
                            previewWidget.name?.toLowerCase().includes('ticker');
          
          if (isEntertainment) {
            return (
              <EntertainmentKonva
                open={true}
                onClose={() => setPreviewWidget(null)}
                widget={previewWidget}
                settings={{
                  showEachFactFor: previewWidget.showEachFactFor || 15,
                  transitionSpeed: previewWidget.transitionSpeed || 0.7,
                  backgroundColor: previewWidget.backgroundColor || '#ffffff',
                  disableAnimations: previewWidget.disableAnimations || false,
                  highlightColor: previewWidget.highlightColor || '#1976d2',
                  fontColor: previewWidget.fontColor || '#555',
                  textFont: previewWidget.textFont || 'Arial'
                }}
              />
            );
          } else if (isClock) {
            return "clock";
          } else if (isFinance) {
            return "finance";
          } else if (isWeather) {
            return "weather";
          } else if (isSocialNetwork) {
            return "social-network";
          } else if (isMeetingCalendar) {
            return "meeting-calendar";
          } else if (isMenuBoard) {
            return "menu-board";
          } else if (isNewsFeed) {
            return "news-feed";
          } else {
            return "entertainment";
          }
        })() === "clock" ? (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            background: '#ffffff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 1000 
          }}>
            <button
              onClick={() => setPreviewWidget(null)}
              style={{ 
                position: 'absolute', 
                top: 20, 
                right: 20, 
                fontSize: 30, 
                background: 'rgba(0,0,0,0.1)', 
                border: 'none', 
                color: '#333', 
                cursor: 'pointer', 
                zIndex: 10,
                borderRadius: '50%',
                width: 50,
                height: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
            <Clock
              type={(() => {
                // Handle explicit type from App Gallery
                if (previewWidget.type && previewWidget.type !== "widget") {
                  return previewWidget.type;
                }
                // Handle name-based detection for all clock types
                const name = previewWidget.name?.toLowerCase() || "";
                if (name.includes("analog round")) return "analog-round";
                if (name.includes("analog square")) return "analog-square";
                if (name.includes("digital")) return "digital-simple";
                if (name.includes("bar") || name.includes("modern")) return "bar-modern";
                if (name.includes("countdown")) return "countdown-app";
                if (name.includes("glow")) return "glow-clock";
                if (name.includes("holiday")) return "holiday-clock";
                if (name.includes("lcd")) return "lcd-clock";
                if (name.includes("multi city")) return "multi-city-clock";
                // Default fallback
                return "analog-round";
              })()}
              width={Math.min(window.innerWidth * 0.8, 800)}
              height={Math.min(window.innerHeight * 0.8, 800)}
              dialType={previewWidget.dialType || "arabic"}
              dialBg={previewWidget.dialBg || "#ffffff"}
              handsColor={previewWidget.handsColor || "#000000"}
              bgColor={previewWidget.bgColor || "#ffffff"}
              highlightColor={previewWidget.highlightColor || "#e83e00"}
              fontColor={previewWidget.fontColor || "#333"}
              timeFormat={previewWidget.timeFormat || "hh:mm:ss"}
              ampm={previewWidget.ampm !== undefined ? previewWidget.ampm : true}
              eventDateTime={previewWidget.eventDateTime || ""}
              completionMessage={previewWidget.completionMessage || ""}
              textFont={previewWidget.textFont || "Arial"}
            />
          </div>
        ) : (() => {
          // Determine widget type
          const isFinance = previewWidget.type === "finance" || previewWidget.name?.toLowerCase().includes("exchange") || 
                           previewWidget.name?.toLowerCase().includes("ticker") || 
                           previewWidget.name?.toLowerCase().includes("currency") ||
                           previewWidget.name?.toLowerCase().includes("symbol") ||
                           previewWidget.name?.toLowerCase().includes("chart");
          const isWeather = previewWidget.type === 'weather' || previewWidget.name?.toLowerCase().includes('weather');
          const isSocialNetwork = previewWidget.type === 'social-network' || 
                                 previewWidget.name?.toLowerCase().includes('facebook') || 
                                 previewWidget.name?.toLowerCase().includes('youtube') || 
                                 previewWidget.name?.toLowerCase().includes('follow us') || 
                                 previewWidget.name?.toLowerCase().includes('tagbox') || 
                                 previewWidget.name?.toLowerCase().includes('walls.io');
          const isMeetingCalendar = previewWidget.type === 'meeting-calendar' ||
                                   previewWidget.name?.toLowerCase().includes('meeting room') ||
                                   previewWidget.name?.toLowerCase().includes('calendar') ||
                                   previewWidget.name?.toLowerCase().includes('birthday');
          const isMenuBoard = previewWidget.type === 'menu-board' ||
                             previewWidget.name?.toLowerCase().includes('menu') ||
                             previewWidget.name?.toLowerCase().includes('cafeteria') ||
                             previewWidget.name?.toLowerCase().includes('directory') ||
                             previewWidget.name?.toLowerCase().includes('sales') ||
                             previewWidget.name?.toLowerCase().includes('table');
          const isNewsFeed = previewWidget.type === 'news-feed' || previewWidget.type === 'rss-feed' || previewWidget.type === 'news-ticker' ||
                            previewWidget.name?.toLowerCase().includes('news') ||
                            previewWidget.name?.toLowerCase().includes('rss') ||
                            previewWidget.name?.toLowerCase().includes('feed') ||
                            previewWidget.name?.toLowerCase().includes('ticker');
          const isEntertainment = previewWidget.type === 'entertainment' ||
                                 previewWidget.name?.toLowerCase().includes("american") ||
                                 previewWidget.name?.toLowerCase().includes("football") ||
                                 previewWidget.name?.toLowerCase().includes("basketball") ||
                                 previewWidget.name?.toLowerCase().includes("baseball") ||
                                 previewWidget.name?.toLowerCase().includes("animal") ||
                                 previewWidget.name?.toLowerCase().includes("fact") ||
                                 previewWidget.name?.toLowerCase().includes("curiosity") ||
                                 previewWidget.name?.toLowerCase().includes("sport");
          
          if (isEntertainment) {
            return (
              <EntertainmentKonva
                open={true}
                onClose={() => setPreviewWidget(null)}
                widget={previewWidget}
                settings={{
                  showEachFactFor: previewWidget.showEachFactFor || 15,
                  transitionSpeed: previewWidget.transitionSpeed || 0.7,
                  backgroundColor: previewWidget.backgroundColor || '#ffffff',
                  disableAnimations: previewWidget.disableAnimations || false,
                  highlightColor: previewWidget.highlightColor || '#1976d2',
                  fontColor: previewWidget.fontColor || '#555',
                  textFont: previewWidget.textFont || 'Arial'
                }}
              />
            );
          } else if (isFinance) {
            return (
              <FinanceKonva
                open={true}
                onClose={() => setPreviewWidget(null)}
                widget={previewWidget}
                settings={{
                  showEachDataFor: previewWidget.showEachDataFor || 10,
                  transitionSpeed: previewWidget.transitionSpeed || 0.7,
                  backgroundColor: previewWidget.backgroundColor || '#ffffff',
                  disableAnimations: previewWidget.disableAnimations || false,
                  highlightColor: previewWidget.highlightColor || '#1976d2',
                  fontColor: previewWidget.fontColor || '#333',
                  textFont: previewWidget.textFont || 'Arial'
                }}
              />
            );
          } else if (isWeather) {
            return (
              <WeatherPreview 
                formData={previewWidget} 
                onClose={() => setPreviewWidget(null)} 
              />
            );
          } else if (isSocialNetwork) {
            // Special handling for Facebook Page widgets
            const isFacebookPage = previewWidget.name === 'Facebook Page' ||
                                 previewWidget.originalName === 'Facebook Page' ||
                                 previewWidget.widgetSubType === 'facebook-page';
            
            if (isFacebookPage) {
              return (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
                  <div style={{ position: 'relative', width: '80%', height: '80%', background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
                    <button
                      onClick={() => setPreviewWidget(null)}
                      style={{ position: 'absolute', top: 10, right: 10, fontSize: 24, background: 'none', border: 'none', color: '#000', cursor: 'pointer', zIndex: 10 }}
                    >
                      ×
                    </button>
                    <FacebookPage
                      width={window.innerWidth * 0.8 - 40}
                      height={window.innerHeight * 0.8 - 40}
                      config={previewWidget}
                    />
                  </div>
                </div>
              );
            } else if (previewWidget.widgetSubType === 'facebook-modern') {
              return (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
                  <div style={{ position: 'relative', width: '80%', height: '80%', background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
                    <button
                      onClick={() => setPreviewWidget(null)}
                      style={{ position: 'absolute', top: 10, right: 10, fontSize: 24, background: 'none', border: 'none', color: '#000', cursor: 'pointer', zIndex: 10 }}
                    >
                      ×
                    </button>
                    <FacebookModern
                      width={window.innerWidth * 0.8 - 40}
                      height={window.innerHeight * 0.8 - 40}
                      config={previewWidget}
                    />
                  </div>
                </div>
              );
            } else if (previewWidget.widgetSubType === 'follow-us') {
              return (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
                  <div style={{ position: 'relative', width: '80%', height: '80%', background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
                    <button
                      onClick={() => setPreviewWidget(null)}
                      style={{ position: 'absolute', top: 10, right: 10, fontSize: 24, background: 'none', border: 'none', color: '#000', cursor: 'pointer', zIndex: 10 }}
                    >
                      ×
                    </button>
                    <FollowUs
                      width={window.innerWidth * 0.8 - 40}
                      height={window.innerHeight * 0.8 - 40}
                      config={previewWidget}
                    />
                  </div>
                </div>
              );
            } else {
              return (
                <SocialNetworkPreview
                  widget={previewWidget}
                  onClose={() => setPreviewWidget(null)}
                />
              );
            }
          } else if (isMeetingCalendar) {
            // For meeting-calendar widgets, show a preview using the actual components or preview images
            const isBirthday = previewWidget.name?.toLowerCase().includes('birthday');
            
            // Check if we have a preview image
            let previewImage = null;
            if (previewWidget.name?.toLowerCase().includes('birthday')) {
              previewImage = './images/meeting-calendar/birthday-announcement.svg';
            } else if (previewWidget.name?.toLowerCase().includes('happy birthday')) {
              previewImage = './images/meeting-calendar/happy-birthday.svg';
            } else {
              previewImage = './images/meeting-calendar/calendar-app.svg';
            }
            
            return (
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
                <div style={{ position: 'relative', width: '80%', height: '80%', background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
                  <button
                    onClick={() => setPreviewWidget(null)}
                    style={{ position: 'absolute', top: 10, right: 10, fontSize: 24, background: 'none', border: 'none', color: '#000', cursor: 'pointer', zIndex: 10 }}
                  >
                    ×
                  </button>
                  <img
                    src={previewImage}
                    alt={previewWidget.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
              </div>
            );
          } else if (isMenuBoard) {
            // For menu-board widgets, show a preview
            return (
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
                <div style={{ position: 'relative', width: '80%', height: '80%', background: '#fff', borderRadius: 8, overflow: 'hidden', padding: 20 }}>
                  <button
                    onClick={() => setPreviewWidget(null)}
                    style={{ position: 'absolute', top: 10, right: 10, fontSize: 24, background: 'none', border: 'none', color: '#000', cursor: 'pointer', zIndex: 10 }}
                  >
                    ×
                  </button>
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <h2 style={{ marginBottom: 20, color: '#333' }}>{previewWidget.name}</h2>
                    <div style={{ fontSize: 18, color: '#666' }}>
                      {previewWidget.type === 'menu-board' ? 'Menu Board Widget Preview' : 'Widget Preview'}
                    </div>
                    <div style={{ marginTop: 20, padding: 20, background: '#f5f5f5', borderRadius: 8 }}>
                      <p>This widget would display menu information, directory listings, or sales data based on your configuration.</p>
                      <p>Click "Edit Properties" from the context menu to customize this widget.</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          } else if (isNewsFeed) {
            // For news and RSS feed widgets, show a preview
            return (
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
                <div style={{ position: 'relative', width: '80%', height: '80%', background: '#fff', borderRadius: 8, overflow: 'hidden', padding: 20 }}>
                  <button
                    onClick={() => setPreviewWidget(null)}
                    style={{ position: 'absolute', top: 10, right: 10, fontSize: 24, background: 'none', border: 'none', color: '#000', cursor: 'pointer', zIndex: 10 }}
                  >
                    ×
                  </button>
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <h2 style={{ marginBottom: 20, color: '#333' }}>{previewWidget.name}</h2>
                    <div style={{ fontSize: 18, color: '#666' }}>
                      {previewWidget.type === 'news-feed' ? 'News Feed Widget Preview' : 
                       previewWidget.type === 'rss-feed' ? 'RSS Feed Widget Preview' : 
                       'News Ticker Widget Preview'}
                    </div>
                    <div style={{ marginTop: 20, padding: 20, background: '#f5f5f5', borderRadius: 8 }}>
                      <p>This widget would display news content, RSS feeds, or ticker information based on your configuration.</p>
                      <p>Click "Edit Properties" from the context menu to customize this widget.</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          } else {
            // Fallback for any other widget types
            return (
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
                <div style={{ position: 'relative', width: '80%', height: '80%', background: '#fff', borderRadius: 8, overflow: 'hidden', padding: 20 }}>
                  <button
                    onClick={() => setPreviewWidget(null)}
                    style={{ position: 'absolute', top: 10, right: 10, fontSize: 24, background: 'none', border: 'none', color: '#000', cursor: 'pointer', zIndex: 10 }}
                  >
                    ×
                  </button>
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <h2 style={{ marginBottom: 20, color: '#333' }}>{previewWidget.name}</h2>
                    <div style={{ fontSize: 18, color: '#666' }}>
                      Widget Preview
                    </div>
                    <div style={{ marginTop: 20, padding: 20, background: '#f5f5f5', borderRadius: 8 }}>
                      <p>This widget would display content based on your configuration.</p>
                      <p>Click "Edit Properties" from the context menu to customize this widget.</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })()
      )}
      
      {/* Finance Customize Modal */}
      {customizeWidget && (
        <FinanceCustomizeModal
          widget={customizeWidget}
          onClose={() => setCustomizeWidget(null)}
          onSave={(updatedWidget) => {
            // Update the widget in media array
            const widgetIndex = media.findIndex(item => item === customizeWidget);
            if (widgetIndex !== -1) {
              const updatedMedia = [...media];
              updatedMedia[widgetIndex] = { ...updatedWidget };
              // You might need to add a function to update media
              console.log("Updated finance widget:", updatedWidget);
            }
            setCustomizeWidget(null);
          }}
          onBack={() => setCustomizeWidget(null)}
        />
      )}
      

    </div>
  );
}

export default ContentArea;