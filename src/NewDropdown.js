import React from "react";

function NewDropdown({ onAppClick, onUploadClick }) {
  return (
    <div style={{
      position: "absolute", top: 50, left: 10, background: "#fff", border: "1px solid #ccc", zIndex: 10, width: 220, borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    }}>
      <div style={{ padding: 12, cursor: "pointer", display: 'flex', alignItems: 'center', gap: 10 }} onClick={onUploadClick}>
        <span role="img" aria-label="upload">☁️</span> Upload File
      </div>
      <div style={{ padding: 12, cursor: "pointer", display: 'flex', alignItems: 'center', gap: 10 }} onClick={onAppClick}>
        <span role="img" aria-label="app">🧩</span> App
      </div>
      <div style={{ padding: 12, cursor: "pointer", display: 'flex', alignItems: 'center', gap: 10 }}>
        <span role="img" aria-label="campaign">📄</span> Campaign
      </div>
      <div style={{ padding: 12, cursor: "pointer", display: 'flex', alignItems: 'center', gap: 10 }}>
        <span role="img" aria-label="composition">🖥️</span> Composition
      </div>
      <div style={{ padding: 12, cursor: "pointer", display: 'flex', alignItems: 'center', gap: 10 }}>
        <span role="img" aria-label="datafeed">🗄️</span> Data Feed
      </div>
      <div style={{ padding: 12, cursor: "pointer", display: 'flex', alignItems: 'center', gap: 10 }}>
        <span role="img" aria-label="folder">📁</span> Folder
      </div>
      <div style={{ padding: 12, cursor: "pointer", display: 'flex', alignItems: 'center', gap: 10 }}>
        <span role="img" aria-label="playlist">📚</span> Playlist
      </div>
      <div style={{ padding: 12, cursor: "pointer", display: 'flex', alignItems: 'center', gap: 10, borderBottomLeftRadius: 6, borderBottomRightRadius: 6 }}>
        <span role="img" aria-label="audioplaylist">🎵</span> Audio Playlist
      </div>
    </div>
  );
}

export default NewDropdown; 