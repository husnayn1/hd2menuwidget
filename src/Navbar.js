import React from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Content", path: "/content" },
  { label: "Players", path: "/players" },
  { label: "Players Group", path: "/players-group" },
  { label: "Reports", path: "/reports" }
];

function Navbar() {
  const location = useLocation();

  return (
    <nav style={{ display: "flex", gap: "16px", padding: "16px", background: "#f4f4f4" }}>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            textDecoration: "none",
            color: "#333",
            background: "transparent",
            fontWeight: "normal",
            transition: "background 0.2s, color 0.2s"
          }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export default Navbar; 