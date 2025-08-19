import { 
  FaCloudUploadAlt, 
  FaRocket, 
  FaDesktop, 
  FaFolder, 
  FaPollH, 
  FaLayerGroup, 
  FaBullseye, 
  FaFileAlt 
} from 'react-icons/fa';

const MediaCards = ({ onAppClick, onUploadClick }) => {


const cardData = [
  {
    icon: FaCloudUploadAlt,
    title: "Upload",
    
  },
  {
    icon: FaRocket,
    title: "App",
    
  },
  {
    icon: FaDesktop,
    title: "Campaign",
    
  },
  {
    icon: FaFolder,
    title: "Composition",
    
  },
  {
    icon: FaPollH,
    title: "Data Feed",    
  },
  {
    icon: FaLayerGroup,
    title: "Folder",
    
  },
  {
    icon: FaBullseye,
    title: "Playlist",
  },
  {
    icon: FaFileAlt,
    title: "Audio Playlist",    
  }
];


  const handleCardClick = (route, external = false) => {
  };

  return (
    <div className="container-fluid py-1 mt-1">
      <div style={styles.mediaCards}>
        {cardData.map((card, index) => {
          const IconComponent = card.icon;
          return (
<div
  key={index}
  style={{
    ...styles.mediaCard,
    backgroundColor: card.title === "App" ? "#ffe6e6" : "white",
    border: card.title === "App" ? "2px solid #d32f2f" : "none",
  }}
>
              <div style={styles.cardIcon}>
                <IconComponent size={24} color="white" />
              </div>
<button
  onClick={() => {
    if (card.title === "Upload") onUploadClick?.();
    if (card.title === "App") onAppClick?.();
  }}
  style={{
    ...styles.addBtn,
    backgroundColor: card.title === "App" ? "#d32f2f" : "white",
    color: card.title === "App" ? "#fff" : "#d32f2f",
  }}
  onMouseEnter={(e) => {
    e.target.style.backgroundColor = '#d32f2f';
    e.target.style.color = '#fff';
  }}
  onMouseLeave={(e) => {
    if (card.title !== "App") {
      e.target.style.backgroundColor = 'white';
      e.target.style.color = '#d32f2f';
    }
  }}
>
  <span style={{ marginRight: '5px' }}>+</span>
  {card.title}
</button>

            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  mediaCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(125px, 1fr))',
    gap: '10px',
    padding: '0px 0',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  mediaCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '5px 5px',
    borderRadius: '8px',
    backgroundColor: 'white',
    textAlign: 'center',
    transition: 'transform 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    cursor: 'pointer',
  },
  cardIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#d32f2f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px',
    overflow: 'hidden'
  },
  addBtn: {
    padding: '5px 8px',
    border: '2px solid #d32f2f',
    borderRadius: '50px',
    color: '#d32f2f',
    cursor: 'pointer',
    fontSize: '11px',
    textDecoration: 'none',
    display: 'inline-block',
    background: 'white',
    transition: 'all 0.3s ease',
    outline: 'none'
  }
};

export default MediaCards;