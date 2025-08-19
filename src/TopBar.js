import React, { useRef, useEffect } from "react";
import MediaCards from "./components/widget-box/MediaCard";

function TopBar({ onNewClick, showDropdown, children, search, setSearch }) {
  const dropdownRef = useRef();

  console.log("dropdownRef",dropdownRef)

  
  useEffect(() => {
    if (!showDropdown) return;
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onNewClick(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [showDropdown, onNewClick]);

  return (
<div style={{ padding: 10, background: "#fafafa", borderBottom: "1px solid #ddd", position: "relative" }}>
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    {/* Left: New Button */}
    <button
      style={{
        background: '#b44a00',
        color: '#fff',
        border: 'none',
        borderRadius: 4,
        padding: '8px 18px',
        fontWeight: 'bold',
        fontSize: 16,
        cursor: 'pointer'
      }}
      onClick={() => onNewClick(v => !v)}
    >
      + New
    </button>

    {/* Right: Search */}
    <input
      placeholder="Search folders and files by name..."
      style={{
        padding: 8,
        borderRadius: 4,
        border: '1px solid #ccc',
        flex: 1,
        maxWidth: 350,
        marginLeft: 20
      }}
      value={search}
      onChange={e => setSearch(e.target.value)}
    />
  </div>

  {/* Dropdown / MediaCards below */}
  {showDropdown && (
    <div ref={dropdownRef} style={{ marginTop: 10 }}>
      {children}
    </div>
  )}


  <MediaCards />
</div>
  );
}

export default TopBar; 