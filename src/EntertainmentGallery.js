import React from "react";

function EntertainmentGallery({ cards, onWidgetSelect }) {
  return (
    <div style={{ padding: 0, width: '100%' }}>
      <div style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 18 }}>Entertainment</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
        {cards.map((card, i) => (
          <div
            key={i}
            style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 18, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'box-shadow 0.2s', minHeight: 200, position: 'relative' }}
            onClick={() => onWidgetSelect && onWidgetSelect(card)}
          >
            <img src={card.image} alt={card.name} style={{ width: 180, height: 90, objectFit: 'cover', marginBottom: 10, borderRadius: 6 }} />
            <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 6 }}>{card.name}</div>
            {card.dataFeed && <div style={{ background: '#2ecc71', color: '#fff', fontWeight: 'bold', fontSize: 13, borderRadius: 4, padding: '2px 8px', marginBottom: 6, position: 'absolute', top: 12, left: 12 }}>{card.dataFeed}</div>}
            <div style={{ color: '#666', fontSize: 14, textAlign: 'center' }}>{card.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EntertainmentGallery; 