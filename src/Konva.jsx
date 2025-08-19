import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import NewDropdown from './NewDropdown';
import ContentArea from './ContentArea';
import AppGalleryModal from './AppGalleryModal';
import CustomizeClockModal from './widgets/clock/CustomizeClockModal';
import Players from './Players';
import PlayersGroup from './PlayersGroup';
import Reports from './Reports';
import Home from './Home';
import FinanceCustomizeModal from './FinanceCustomizeModal';
import WeatherCustomizeModal from './WeatherCustomizeModal';
import { BirthdayAnnouncementCustomizeModal, CustomizeCalendarModal } from './widgets/meeting-calendar';
import CustomizeSocialNetworkModal from './CustomizeSocialNetworkModal';
import YouTubeVideoModal from './widgets/social-networks/YouTubeVideoModal.jsx';
import FacebookModal from './widgets/social-networks/FacebookModal.jsx';
import AnimatedFacebookModal from './widgets/social-networks/AnimatedFacebookModal.jsx';
import lightningImg from './images/lightning.jpg';
import clocksImg from './images/clocks.png';
import cloudsImg from './images/clouds.jpg';
import './App.css';
import MediaCards from "./components/widget-box/MediaCard.jsx";

function Konva() {
  // Persist media in localStorage
  const [media, setMedia] = useState(() => {
    const saved = localStorage.getItem('media');
    return saved ? JSON.parse(saved) : [];
  });

  // Static images that are always available
  const staticImages = [
    { url: lightningImg, name: 'Lightning', type: 'image' },
    { url: clocksImg, name: 'Clocks', type: 'image' },
    { url: cloudsImg, name: 'Clouds', type: 'image' },
  ];
  
  console.log('Konva - staticImages:', staticImages);

  // Combine static images with user media
  const allMedia = [...staticImages, ...media];
  
  // Debug logging
  console.log('Konva - staticImages:', staticImages);
  console.log('Konva - media:', media);
  console.log('Konva - allMedia:', allMedia);
  useEffect(() => {
    localStorage.setItem('media', JSON.stringify(media));
  }, [media]);

  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAppGallery, setShowAppGallery] = useState(false);
  const [customizingWidget, setCustomizingWidget] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Featured");
  const fileInputRef = useRef();

  const handleNewClick = () => setShowDropdown((v) => !v);
  const handleAppClick = () => {
    setShowAppGallery(true);
    setShowDropdown(false);
    setSelectedCategory("Featured");
  };
  const handleCloseGallery = () => setShowAppGallery(false);

  const handleUploadClick = () => {
    setShowDropdown(false);
    if (fileInputRef.current) fileInputRef.current.value = null;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setMedia((prev) => [...prev, { type: 'image', url, name: file.name }]);
    }
  };

  // Rename functionality
  const handleRenameMedia = (idx, newName) => {
    setMedia(prev => prev.map((item, i) => i === idx ? { ...item, name: newName } : item));
  };

  // Delete functionality
  const handleDeleteMedia = (idx) => {
    setMedia(prev => prev.filter((_, i) => i !== idx));
  };

  const handleWidgetSelect = (widget) => {
    // If it's a YouTube widget, save immediately and do NOT set customizingWidget
    if (widget.widgetSubType === 'youtube-video') {
      handleSaveWidget(widget);
      setShowAppGallery(false);
      return;
    }
    // If it's a Facebook Page widget, handle it with FacebookModal
    if (widget.name === 'Facebook Page') {
      widget.widgetSubType = 'facebook-page';
      handleSaveWidget(widget);
      setShowAppGallery(false);
      return;
    }
    // If it's an Animated Facebook App widget, set the widgetSubType
    if (widget.name === 'Animated Facebook App') {
      widget.widgetSubType = 'animated-facebook';
      setCustomizingWidget(widget);
      setShowAppGallery(false);
      return;
    }
    // If it's a clock widget, save it directly to media so it shows in ContentArea with preview functionality
    if (widget.name?.toLowerCase().includes('clock') || 
        widget.type === 'analog-round' || 
        widget.type === 'analog-square' || 
        widget.type === 'digital-simple' || 
        widget.type === 'bar-modern' || 
        widget.type === 'countdown-app' || 
        widget.type === 'glow-clock' || 
        widget.type === 'holiday-clock' || 
        widget.type === 'lcd-clock' || 
        widget.type === 'multi-city-clock') {
      // Create a properly formatted clock widget for the media array
      const clockWidget = {
        ...widget,
        type: 'widget', // Set as widget type for ContentArea to handle preview
        originalName: widget.name,
        // Set default clock properties
        dialType: 'arabic',
        dialBg: '#ffffff',
        handsColor: '#000000',
        bgColor: '#ffffff',
        highlightColor: '#e83e00',
        fontColor: '#333',
        timeFormat: 'hh:mm:ss',
        ampm: true,
        textFont: 'Arial'
      };
      handleSaveWidget(clockWidget);
      setShowAppGallery(false);
      return;
    }
    setCustomizingWidget(widget);
    setShowAppGallery(false);
  };

  const handleSaveWidget = (widget) => {
    console.log("Saving widget:", widget); // Debug log to see what's being saved
    setMedia((prev) => {
      // Check if this is an existing widget being edited
      // Look for widget with same original name and type
      const existingIndex = prev.findIndex(item => 
        ((item.type === 'widget' || item.type === widget.type) && 
        (item.originalName === widget.originalName || 
         (item.name === widget.name && item.appName === widget.appName)))
      );
      
      if (existingIndex !== -1) {
        // Update existing widget
        const updated = [...prev];
        updated[existingIndex] = { 
          ...widget, 
          type: widget.type || 'widget',
          originalName: widget.originalName || widget.name // Preserve original name
        };
        return updated;
      } else {
        // Add new widget
        return [...prev, { 
          ...widget, 
          type: widget.type || 'widget',
          originalName: widget.name // Store original name for future reference
        }];
      }
    });
    setCustomizingWidget(null);
    setShowAppGallery(false); // Ensure gallery is closed after saving
  };

  const handleEditWidget = (widget) => {
    // Allow editing for all widgets including YouTube and Facebook widgets
    console.log("Editing widget:", widget); // Debug log
    console.log("Widget properties - dialType:", widget.dialType, "dialBg:", widget.dialBg, "handsColor:", widget.handsColor);
    console.log("Widget names - name:", widget.name, "originalName:", widget.originalName, "appName:", widget.appName);
    
    // If it's a Facebook Page widget, set the widgetSubType for proper modal routing
    if (widget.name === 'Facebook Page' || widget.originalName === 'Facebook Page') {
      widget.widgetSubType = 'facebook-page';
    }
    
    // If it's an Animated Facebook App widget, set the widgetSubType for proper modal routing
    if (widget.name === 'Animated Facebook App' || widget.originalName === 'Animated Facebook App') {
      widget.widgetSubType = 'animated-facebook';
    }
    
    setCustomizingWidget(widget);
  };

  const handleBackToGallery = () => {
    setCustomizingWidget(null);
    setShowAppGallery(true);
    // Do not reset selectedCategory, so it stays on the last used category
  };

  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh', background: '#f9f9fb' }}>
        <Sidebar />
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          height: '100vh',
          overflowY: 'auto'
        }}>
          <TopBar onNewClick={handleNewClick} showDropdown={showDropdown} search={search} setSearch={setSearch}>
            <NewDropdown onAppClick={handleAppClick} onUploadClick={handleUploadClick} />

          </TopBar>
          <Routes>
            <Route path="/content" element={<ContentArea media={media} onRenameMedia={handleRenameMedia} onDeleteMedia={handleDeleteMedia} search={search} onEditWidget={handleEditWidget} />} />
            <Route path="/players" element={<Players />} />
            <Route path="/players-group" element={<PlayersGroup />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/" element={<Home />} />
          </Routes>
          {showAppGallery && <AppGalleryModal onClose={handleCloseGallery} onWidgetSelect={handleWidgetSelect} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />}
          {customizingWidget && (
            customizingWidget.type === 'weather' || customizingWidget.name?.toLowerCase().includes('weather') ? (
              <WeatherCustomizeModal widget={customizingWidget} onClose={() => setCustomizingWidget(null)} onSave={handleSaveWidget} onBack={handleBackToGallery} media={allMedia} />
            ) : customizingWidget.type === 'finance' ? (
              <FinanceCustomizeModal widget={customizingWidget} onClose={() => setCustomizingWidget(null)} onSave={handleSaveWidget} onBack={handleBackToGallery} />
            ) : customizingWidget.type === 'meeting-calendar' && customizingWidget.name?.toLowerCase().includes('birthday') ? (
              <BirthdayAnnouncementCustomizeModal widget={customizingWidget} onClose={() => setCustomizingWidget(null)} onSave={handleSaveWidget} onBack={handleBackToGallery} />
            ) : customizingWidget.type === 'meeting-calendar' || (customizingWidget.widgetType === 'calendar' || customizingWidget.name?.toLowerCase().includes('calendar')) ? (
              <CustomizeCalendarModal widget={customizingWidget} onClose={() => setCustomizingWidget(null)} onSave={handleSaveWidget} onBack={handleBackToGallery} />
            ) : customizingWidget.widgetSubType === 'facebook-page' ? (
              <FacebookModal open={true} onClose={() => setCustomizingWidget(null)} onSave={handleSaveWidget} initialData={customizingWidget} />
            ) : customizingWidget.widgetSubType === 'animated-facebook' ? (
              <AnimatedFacebookModal open={true} onClose={() => setCustomizingWidget(null)} onSave={handleSaveWidget} initialData={customizingWidget} />
            ) : customizingWidget.type === 'social-network' ? (
              <CustomizeSocialNetworkModal widget={customizingWidget} onClose={() => setCustomizingWidget(null)} onSave={handleSaveWidget} onBack={handleBackToGallery} />
            ) : (
              <CustomizeClockModal widget={customizingWidget} onClose={() => setCustomizingWidget(null)} onSave={handleSaveWidget} onBack={handleBackToGallery} />
            )}
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
      </div>
    </Router>
  );
}

export default Konva;