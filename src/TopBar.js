import React, { useRef, useEffect } from "react";

function TopBar({ onNewClick, showDropdown, children, search, setSearch }) {
  const dropdownRef = useRef();

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
    <div style={{ padding: 10, background: "#fafafa", borderBottom: "1px solid #ddd", position: "relative", display: 'flex', alignItems: 'center' }}>
      <button style={{ background: '#b44a00', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }} onClick={() => onNewClick(v => !v)}>+ New</button>
      {showDropdown && (
        <div ref={dropdownRef}>
          {children}
        </div>
      )}
      <input
        placeholder="Search folders and files by name..."
        style={{ marginLeft: 30, padding: 8, borderRadius: 4, border: '1px solid #ccc', flex: 1, maxWidth: 350 }}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
    </div>
  );
}

export default TopBar; 