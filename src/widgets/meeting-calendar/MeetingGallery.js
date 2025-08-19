import React from "react";
import { FaDatabase, FaGlobe } from "react-icons/fa"; 


function MeetingGallery({ cards, onWidgetSelect }) {
  return (
    <div style={{ padding: '10px 20px', width: "100%", backgroundColor : '#ececec' }}>
      <div style={{color:'#135f87', alignItems:'center',textAlign:'center', fontSize: 28, fontWeight: "bold", marginBottom: 18 }}>
        Meeting Room & Calendar
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 10,
        }}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              padding: 0,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transition: "box-shadow 0.2s",
              minHeight: 220,
              position: "relative",
              overflow: "hidden",
            }}
            onClick={() => onWidgetSelect && onWidgetSelect(card)}
          >
            {/* Top row: title center, icons right */}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
                padding:'3px 0px'
              }}
            >
              <div style={{color:'#135f87', flex: 1, textAlign: "center", fontWeight: "bold", fontSize: 14 }}>
                {card.name}
              </div>
              <div style={{ display: "flex", gap: 8, position: "absolute", top: 5, right: 10 }}>
                <FaGlobe size={18} color="#005481" />


<FaDatabase size={18} color="#47c098" />
              </div>
            </div>


            {/* Full-width green bar */}
            {card.dataFeed && (
              <div
                style={{
                  background: "#4dc39c",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 14,
                  padding: "6px 0",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                Data Feed Enabled
              </div>
            )}


{/* Image with hover overlay */}
<div style={{ position: "relative", width: "270px", height: "160px"}} className="image-container">
  <img
    src={card.image}
    alt={card.name}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover", // Changed from "inherit" to "cover"
    }}
  />

  {/* Overlay with description */}
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      color: "#fff",
      fontSize: 14,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      opacity: 0,
      transition: "opacity 0.3s ease",
      zIndex: 2,
      borderRadius: 6,
    }}
    className="image-overlay"
  >
    {card.description}
  </div>
</div>




          </div>
        ))}
      </div>


    </div>
  );
}

export default MeetingGallery;
