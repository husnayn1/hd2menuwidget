import React from 'react';
import './SocialNetworks.css';

const FacebookPage = ({ width = 400, height = 300, config = {} }) => {
  // Check if we have real Facebook data or just defaults
  const hasRealData = config && config.url && config.url.includes('facebook.com');
  
  // If we have real Facebook data, render the actual Facebook page
  if (hasRealData) {
    const {
      url,
      mediaOption = 'timeline',
      postCount = 10,
      textSize = 'medium'
    } = config;
    
    return (
      <div className="social-network-widget facebook-page" style={{ width, height, background: '#fff' }}>
        <iframe
          src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(url)}&tabs=${mediaOption}&width=${width-20}&height=${height-20}&small_header=${textSize === 'small'}&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`}
          width={width-20}
          height={height-20}
          style={{ border: 'none', overflow: 'hidden' }}
          scrolling="no"
          frameBorder="0"
          allowFullScreen={true}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        ></iframe>
      </div>
    );
  }
  
  // Default configuration with fallbacks for placeholder content
  const {
    pageName = "@example",
    pageTitle = "Today's Global Assembly Appearance",
    pageDescription = "Today is Global Assembly Appearance for digital inclusion for the more than 15 million in the world with disabilities. In this assembly, we will be discussing how people using our technologies to explore, create, and connect with others with disabilities. #GlobalAssembly #AI",
    pageImage = "https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80",
    postDate = "ABOUT 1 DAY",
    backgroundColor = "#ffffff",
    textColor = "#333333"
  } = config;

  return (
    <div className="social-network-widget facebook-page" style={{ width, height, backgroundColor, color: textColor }}>
      <div className="facebook-page-header">
        <div className="facebook-page-logo">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png" alt="Facebook" />
        </div>
        <div className="facebook-page-name">{pageName}</div>
      </div>
      
      <div className="facebook-page-content">
        <div className="facebook-page-title">{pageTitle}</div>
        <div className="facebook-page-image">
          <img src={pageImage} alt="Post" />
        </div>
        <div className="facebook-page-description">{pageDescription}</div>
        <div className="facebook-page-date">{postDate}</div>
      </div>
    </div>
  );
};

export default FacebookPage;