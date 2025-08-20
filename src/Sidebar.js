import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaFileAlt,
  FaUsers,
  FaLayerGroup,
  FaChartBar,
  FaUserCircle,
} from "react-icons/fa";

const navItems = [
  { label: "Content", path: "/content", icon: <FaFileAlt size={18} /> },
  { label: "Players", path: "/players", icon: <FaUsers size={18} /> },
  { label: "Player Groups", path: "/players-group", icon: <FaLayerGroup size={18} /> },
  { label: "Reports", path: "/reports", icon: <FaChartBar size={18} /> },
];

function Sidebar() {
  const [hovered, setHovered] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div
      style={{
        width: collapsed ? 70 : 170,
        fontSize: collapsed ? "20px" : "14px",
        background: "#808080",
        height: "100vh",
        padding: "0 12px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        position: "relative",
        transition: "width 0.2s",
      }}
    >
      {/* Collapse/Expand button (Top Right) */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 1,
          cursor: "pointer",
          padding: 4,
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M16 19l-7-7 7-7"
              stroke="#fff"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M8 5l8 7-8 7"
              stroke="#fff"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Top Logo */}
      <div style={{ textAlign: "center", marginBottom: 20, marginTop :30 }}>
        <img
          src="/hd2menu.png"
          alt="HD2 Logo"
          style={{
            width: 50,
            height: 40,
            // borderRadius: "50%",
          }}
        />
      </div>

      {/* Navigation Items */}
      <div>
        {navItems.map((item, idx) => (
          <Link key={item.label} to={item.path} style={{ textDecoration: "none" }}>
            <div
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              style={{
                marginBottom: 8,
                fontWeight: "bold",
                color: "#fff",
                background:
                  location.pathname === item.path
                    ? "#9a9a9a"
                    : hovered === idx
                    ? "#a0a0a0"
                    : "transparent",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                padding: collapsed ? "8px 12px" : "8px 12px",
                transition: "background 0.2s",
                position: "relative",
              }}
            >
              <span style={{ marginRight: collapsed ? 4 : 10 }}>{item.icon}</span>
              {!collapsed && item.label}

              {/* Tooltip */}
              {collapsed && hovered === idx && (
                <div
                  style={{
                    position: "absolute",
                    left: "60px",
                    background: "#333",
                    color: "#fff",
                    padding: "4px 8px",
                    borderRadius: 4,
                    whiteSpace: "nowrap",
                    zIndex: 1000,
                    fontSize: 12,
                  }}
                >
                  {item.label}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom User Profile */}
      <div
        style={{
          
          display: "flex",
          alignItems: "center",
          padding: "12px 10px",
          borderTop: "1px solid rgba(255,255,255,0.3)",
          cursor: "pointer",
          color: "#fff",
          justifyContent: collapsed ? "center" : "flex-start",
          marginTop : '270px',
        }}
      >
        <FaUserCircle size={28} style={{ marginRight: collapsed ? 0 : 10 }} />
        {!collapsed && <div style={{ fontWeight: "bold" }}>Babar Azam</div>}
      </div>
    </div>
  );
}

export default Sidebar;
