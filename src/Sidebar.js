import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Content", path: "/content" },
  { label: "Players", path: "/players" },
  { label: "Player Groups", path: "/players-group" },
  { label: "Reports", path: "/reports" }
];

function Sidebar() {
  const [hovered, setHovered] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  if (collapsed) {
    return (
      <div style={{
        width: 24,
        background: "#444",
        height: "100vh",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 0,
        boxSizing: 'border-box',
      }}>
        {/* Only show left arrow for expand */}
        <div
          style={{ cursor: 'pointer', width: 24, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setCollapsed(false)}
        >
          {/* Left arrow chevron */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M16 19l-7-7 7-7" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: 200,
      background: "#e0e0e0",
      height: "100vh",
      padding: 20,
      boxSizing: 'border-box'
    }}>
      {/* HD2 Title/Logo */}
      <div
        style={{
          fontWeight: 'bold',
          marginBottom: 30,
          fontSize: 22,
          color: '#b44a00',
          cursor: 'pointer'
        }}
        onClick={() => setCollapsed(true)}
      >
        HD2
      </div>
      {navItems.map((item, idx) => (
        <Link
          key={item.label}
          to={item.path}
          style={{ textDecoration: 'none' }}
        >
          <div
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            style={{
              marginBottom: 20,
              fontWeight: location.pathname === item.path ? 'bold' : 'normal',
              color: location.pathname === item.path ? '#fff' : (hovered === idx ? '#b44a00' : '#444'),
              background: location.pathname === item.path ? '#b44a00' : (hovered === idx ? '#e9e9e9' : 'transparent'),
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '4px 8px',
              transition: 'background 0.2s, color 0.2s'
            }}
          >
            {item.label}
            <span style={{
              marginLeft: 'auto',
              opacity: hovered === idx ? 1 : 0,
              transition: 'opacity 0.2s'
            }}>
              {/* Arrow SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M8 5l8 7-8 7" stroke="#b44a00" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Sidebar;