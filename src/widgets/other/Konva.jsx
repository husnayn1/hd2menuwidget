import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../../Sidebar';
import TopBar from '../../TopBar';
import NewDropdown from '../../NewDropdown';
import ContentArea from '../../ContentArea';
import AppGalleryModal from '../../AppGalleryModal';
import { CustomizeClockModal } from '../clock';
import Players from './Players';
import PlayersGroup from './PlayersGroup';
import Reports from '../../Reports';
import Home from '../../Home';
import { FinanceCustomizeModal } from '../finance';
import WeatherCustomizeModal from '../../WeatherCustomizeModal';
import '../../App.css';
import MediaCards from "../../components/widget-box/MediaCard";

function Konva() {
  // Persist media in localStorage
  const [media, setMedia] = useState(() => {
    const saved = localStorage.getItem('media');
    return saved ? JSON.parse(saved) : [];
  });
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
    // For social network widgets, save directly to content area
    if (widget.type === 'social-network') {
      handleSaveWidget(widget);
      return;
    }
    
    // For other widget types, open customize modal
    setCustomizingWidget(widget);
    setShowAppGallery(false);
  };

  const handleSaveWidget = (widget) => {
    setMedia((prev) => {
      // Check if this is an existing widget being edited
      // Look for widget with same original name and type
      const existingIndex = prev.findIndex(item => 
        item.type === widget.type && 
        (item.originalName === widget.originalName || 
         (item.name === widget.name && item.appName === widget.appName))
      );
      
      if (existingIndex !== -1) {
        // Update existing widget
        const updated = [...prev];
        updated[existingIndex] = { 
          ...widget, 
          originalName: widget.originalName || widget.name // Preserve original name
        };
        return updated;
      } else {
        // Add new widget
        return [...prev, { 
          ...widget, 
          originalName: widget.name // Store original name for future reference
        }];
      }
    });
    setCustomizingWidget(null);
  };

  const handleEditWidget = (widget) => {
    // Directly open the customize app page with the widget for editing
    console.log("Editing widget:", widget); // Debug log
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
          // height: '100vh',
          // overflowY: 'auto',
          marginTop:'20px',
        }}>
          {/* <TopBar onNewClick={handleNewClick} showDropdown={showDropdown} search={search} setSearch={setSearch}>
            <NewDropdown onAppClick={handleAppClick} onUploadClick={handleUploadClick} />
          </TopBar> */}
            <MediaCards  onAppClick={handleAppClick} onUploadClick={handleUploadClick} />
          <Routes>
            <Route path="/content" element={<ContentArea media={media} onRenameMedia={handleRenameMedia} onDeleteMedia={handleDeleteMedia} search={search} onEditWidget={handleEditWidget} />} />
            <Route path="/players" element={<Players />} />
            <Route path="/players-group" element={<PlayersGroup />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/" element={<Home />} />
          </Routes>
          {showAppGallery && <AppGalleryModal onClose={handleCloseGallery} onWidgetSelect={handleWidgetSelect} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />}
          {customizingWidget && (
            customizingWidget.type === 'finance' ? (
              <FinanceCustomizeModal widget={customizingWidget} onClose={() => setCustomizingWidget(null)} onSave={handleSaveWidget} onBack={handleBackToGallery} />
            ) : customizingWidget.type === 'weather' || customizingWidget.name?.includes('Weather') ? (
              <WeatherCustomizeModal widget={customizingWidget} onClose={() => setCustomizingWidget(null)} onSave={handleSaveWidget} onBack={handleBackToGallery} />
            ) : (
              <CustomizeClockModal widget={customizingWidget} onClose={() => setCustomizingWidget(null)} onSave={handleSaveWidget} onBack={handleBackToGallery} />
            )
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