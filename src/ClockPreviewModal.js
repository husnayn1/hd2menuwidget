import React, { useState } from 'react';
import Clock from './Clock';

function ClockPreviewModal({ widget, open, onClose }) {
  const [acceptTerms, setAcceptTerms] = useState(false);

  if (!open || !widget) return null;

  const isClock = widget.name?.toLowerCase().includes("clock") || 
                  widget.type?.includes("clock") || 
                  widget.type?.includes("analog") || 
                  widget.type?.includes("digital") ||
                  widget.type?.includes("glow") ||
                  widget.type?.includes("countdown") ||
                  widget.type?.includes("lcd") ||
                  widget.type?.includes("holiday") ||
                  widget.type?.includes("multi-city");
  
  if (!isClock) return null;

  // Debug log to see widget data
  console.log("ClockPreviewModal - Widget data:", widget);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      background: 'rgba(0,0,0,0.5)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 1000 
    }}>
      <div style={{ 
        background: '#fff', 
        borderRadius: 12, 
        padding: 30, 
        maxWidth: 500, 
        width: '90%', 
        maxHeight: '80vh', 
        overflow: 'auto',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 20 
        }}>
          <h2 style={{ margin: 0, color: '#333' }}>Preview: {widget.name}</h2>
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

        {/* Clock Preview */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: 40,
          background: '#e3f2fd',
          borderRadius: 8,
          marginBottom: 20,
          border: '2px solid #1976d2',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ 
            marginBottom: 15, 
            padding: '8px 16px', 
            background: '#1976d2', 
            color: 'white', 
            borderRadius: 20, 
            fontSize: 12, 
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            🕐 LIVE CLOCK PREVIEW
          </div>
          {(() => {
            // Determine the correct clock type based on widget name
            let clockType = widget.type;
            if (!clockType) {
              if (widget.name?.toLowerCase().includes("analog round")) clockType = "analog-round";
              else if (widget.name?.toLowerCase().includes("analog square")) clockType = "analog-square";
              else if (widget.name?.toLowerCase().includes("digital")) clockType = "digital-simple";
              else if (widget.name?.toLowerCase().includes("bar")) clockType = "bar-modern";
              else if (widget.name?.toLowerCase().includes("countdown")) clockType = "countdown-app";
              else if (widget.name?.toLowerCase().includes("glow")) clockType = "glow-clock";
              else if (widget.name?.toLowerCase().includes("holiday")) clockType = "holiday-clock";
              else if (widget.name?.toLowerCase().includes("lcd")) clockType = "lcd-clock";
              else if (widget.name?.toLowerCase().includes("multi city")) clockType = "multi-city-clock";
              else clockType = "analog-round"; // Default fallback
            }
            
            console.log("Clock type determined:", clockType);
            
            try {
              return (
                <Clock 
                  type={clockType}
                  size={200}
                  dialType={widget.dialType || "arabic"}
                  dialBg={widget.dialBg || "#ffffff"}
                  handsColor={widget.handsColor || "#000000"}
                  bgColor={widget.bgColor || "#ffffff"}
                  timeFormat={widget.timeFormat || "hh:mm:ss"}
                  ampm={widget.ampm !== undefined ? widget.ampm : true}
                  ringColor={widget.highlightColor || "#e83e00"}
                  bgCircleColor={widget.dialBg || "#e1e2eb"}
                  fontColor={widget.fontColor || "#333"}
                  targetDate={widget.eventDateTime}
                  message={widget.completionMessage}
                  title={widget.name}
                  subtitle="Clock Widget"
                  textFont={widget.textFont || "Arial"}
                />
              );
            } catch (error) {
              console.error("Error rendering clock:", error);
              return (
                <div style={{ 
                  width: 200, 
                  height: 200, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  background: '#f8f9fa',
                  borderRadius: '50%',
                  border: '2px solid #ddd',
                  color: '#666',
                  fontSize: 14,
                  textAlign: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: 24, marginBottom: 10 }}>🕐</div>
                    <div>Clock Preview</div>
                    <div style={{ fontSize: 12, marginTop: 5 }}>{widget.name}</div>
                  </div>
                </div>
              );
            }
          })()}
        </div>

        {/* Widget Info */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#555' }}>Widget Information</h3>
          <div style={{ 
            background: '#f8f9fa', 
            padding: 15, 
            borderRadius: 6,
            fontSize: 14,
            lineHeight: 1.5
          }}>
            <div><strong>Name:</strong> {widget.name}</div>
            <div><strong>Type:</strong> {widget.type || "analog-round"}</div>
            <div><strong>Dial Type:</strong> {widget.dialType || "Arabic"}</div>
            <div><strong>Time Format:</strong> {widget.timeFormat || "hh:mm:ss"}</div>
            {widget.ampm !== undefined && (
              <div><strong>12/24 Hour:</strong> {widget.ampm ? "12 Hour (AM/PM)" : "24 Hour"}</div>
            )}
            <div><strong>Dial Background:</strong> {widget.dialBg || "#ffffff"}</div>
            <div><strong>Hands Color:</strong> {widget.handsColor || "#000000"}</div>
            <div><strong>Background Color:</strong> {widget.bgColor || "#ffffff"}</div>
            {widget.type === 'countdown-app' && widget.eventDateTime && (
              <div><strong>Target Date:</strong> {widget.eventDateTime}</div>
            )}
            {widget.type === 'countdown-app' && widget.completionMessage && (
              <div><strong>Completion Message:</strong> {widget.completionMessage}</div>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#555' }}>Terms and Conditions</h3>
          <div style={{ 
            background: '#f8f9fa', 
            padding: 15, 
            borderRadius: 6,
            fontSize: 13,
            lineHeight: 1.4,
            maxHeight: 120,
            overflow: 'auto',
            border: '1px solid #e9ecef'
          }}>
            <p><strong>1. Usage Rights:</strong> This clock widget is provided for display purposes only. Users may not modify, distribute, or use this widget for commercial purposes without proper authorization.</p>
            <p><strong>2. Accuracy:</strong> The clock displays the current system time. While we strive for accuracy, we cannot guarantee perfect synchronization with official time sources.</p>
            <p><strong>3. Customization:</strong> Users may customize the appearance and settings of this widget according to their preferences within the provided options.</p>
            <p><strong>4. Support:</strong> Technical support for this widget is available through our standard support channels during business hours.</p>
            <p><strong>5. Updates:</strong> We reserve the right to update or modify this widget to improve functionality or fix issues.</p>
          </div>
        </div>

        {/* Terms Acceptance Checkbox */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 10, 
          marginBottom: 20,
          padding: 15,
          background: '#f8f9fa',
          borderRadius: 6,
          border: '1px solid #e9ecef'
        }}>
          <input
            type="checkbox"
            id="acceptTerms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            style={{ 
              width: 18, 
              height: 18, 
              cursor: 'pointer' 
            }}
          />
          <label 
            htmlFor="acceptTerms" 
            style={{ 
              cursor: 'pointer', 
              fontSize: 14,
              color: '#333',
              fontWeight: '500'
            }}
          >
            I accept the terms below
          </label>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: 10, 
          justifyContent: 'flex-end' 
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              border: '1px solid #ddd',
              borderRadius: 6,
              background: '#fff',
              color: '#666',
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            Close
          </button>
          <button
            disabled={!acceptTerms}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: 6,
              background: acceptTerms ? '#1976d2' : '#ccc',
              color: '#fff',
              cursor: acceptTerms ? 'pointer' : 'not-allowed',
              fontSize: 14,
              fontWeight: '500'
            }}
            onClick={() => {
              if (acceptTerms) {
                alert('Widget preview accepted! You can now use this widget.');
                onClose();
              }
            }}
          >
            Accept & Use Widget
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClockPreviewModal; 