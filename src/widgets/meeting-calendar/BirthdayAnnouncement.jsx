import React, { useState, useEffect, useRef } from 'react';

const BirthdayAnnouncement = ({ widget, settings = {} }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const iframeRef = useRef(null);
  
  // Extract data feed settings
  const {
    dataFeedEnabled = false,
    dataFeedUrl = '',
    dataFeedType = 'google', // 'google', 'outlook', 'ical'
    // ... other settings
  } = settings;

  // Function to parse iCal data for birthdays
  const parseICalBirthdays = (icalData) => {
    // This is a simplified parser - in a real implementation, you would use a proper iCal library
    const birthdays = [];
    const lines = icalData.split('\n');
    let currentEvent = null;
    
    for (const line of lines) {
      if (line.startsWith('BEGIN:VEVENT')) {
        currentEvent = {};
      } else if (line.startsWith('END:VEVENT')) {
        if (currentEvent && currentEvent.summary && currentEvent.date) {
          birthdays.push({
            name: currentEvent.summary,
            date: currentEvent.date
          });
        }
        currentEvent = null;
      } else if (currentEvent) {
        if (line.startsWith('SUMMARY:')) {
          currentEvent.summary = line.substring(8).trim();
        } else if (line.startsWith('DTSTART;VALUE=DATE:')) {
          const dateStr = line.substring(20).trim();
          // Format date as MM/DD
          if (dateStr.length >= 8) {
            const month = dateStr.substring(4, 6);
            const day = dateStr.substring(6, 8);
            currentEvent.date = `${month}/${day}`;
          }
        }
      }
    }
    
    return birthdays;
  };

  // Function to fetch birthdays from data feed
  const fetchBirthdaysFromFeed = async () => {
    if (!dataFeedUrl) return [];
    
    try {
      // In a real implementation, you would fetch from the actual URL
      // For now, we'll simulate with mock data
      const mockICalData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Birthday App//EN
BEGIN:VEVENT
SUMMARY:John Smith
DTSTART;VALUE=DATE:20230410
END:VEVENT
BEGIN:VEVENT
SUMMARY:Emma Johnson
DTSTART;VALUE=DATE:20230411
END:VEVENT
BEGIN:VEVENT
SUMMARY:James Brown
DTSTART;VALUE=DATE:20230412
END:VEVENT
END:VCALENDAR`;
      
      return parseICalBirthdays(mockICalData);
    } catch (error) {
      console.error('Error fetching birthdays:', error);
      return [];
    }
  };

  // Load birthdays based on settings
  useEffect(() => {
    const loadBirthdays = async () => {
      if (dataFeedEnabled && dataFeedUrl) {
        const feedBirthdays = await fetchBirthdaysFromFeed();
        setUpcomingBirthdays(feedBirthdays);
      } else if (widget?.birthdays) {
        setUpcomingBirthdays(widget.birthdays);
      } else {
        // Default birthdays if none provided
        setUpcomingBirthdays([
          { name: "John Smith", date: "Apr 10" },
          { name: "Emma Johnson", date: "Apr 11" },
          { name: "James Brown", date: "Apr 12" }
        ]);
      }
    };

    loadBirthdays();
  }, [dataFeedEnabled, dataFeedUrl, widget?.birthdays]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const {
    backgroundColor = '#ffffff',
    customBackgroundColor = '',
    customBackgroundImage = '',
    disableBackground = false,
    titleFontColor = '#ffffff',
    cardFontColor = '#333333',
    textFont = 'Arial',
    duration = 10,
    filteringOptions = 'Show this week\'s birthdays',
    disableAnimations = false,
    showCurrentMonth = false,
    hideDates = false
  } = settings;

  // Animation for cycling through birthdays
  useEffect(() => {
    if (!disableAnimations && upcomingBirthdays.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === upcomingBirthdays.length - 1 ? 0 : prevIndex + 1
        );
      }, duration * 1000);
      
      return () => clearInterval(interval);
    }
  }, [upcomingBirthdays.length, duration, disableAnimations]);

  // Generate HTML content for iframe
  const generateIframeContent = () => {
    const backgroundStyle = customBackgroundImage 
      ? `background-image: url(${customBackgroundImage}); background-size: cover; background-position: center;`
      : customBackgroundColor 
        ? `background-color: ${customBackgroundColor};`
        : 'background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);';

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Birthday Announcement</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: ${textFont}, sans-serif;
            ${backgroundStyle}
            width: 100%;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px;
            overflow: hidden;
          }
          
          .container {
            display: flex;
            width: 100%;
            height: 100%;
            align-items: center;
            justify-content: space-between;
          }
          
          .title-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding-left: 2rem;
          }
          
          .title {
            color: ${titleFontColor};
            font-size: clamp(1.5rem, 4vw, 2.5rem);
            font-weight: bold;
            line-height: 1.2;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }
          
          .birthday-cards {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding-right: 2rem;
            max-height: 100%;
            overflow: hidden;
          }
          
          .birthday-card {
            display: flex;
            align-items: center;
            gap: 1rem;
            opacity: 0;
            transform: translateX(50px);
            animation: slideIn 0.6s ease-out forwards;
            transition: all 0.3s ease;
          }
          
          .birthday-card:hover {
            transform: scale(1.05);
          }
          
          .birthday-card:nth-child(1) { animation-delay: 0.1s; }
          .birthday-card:nth-child(2) { animation-delay: 0.3s; }
          .birthday-card:nth-child(3) { animation-delay: 0.5s; }
          
          .date-circle {
            width: clamp(40px, 8vw, 60px);
            height: clamp(40px, 8vw, 60px);
            background: white;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            flex-shrink: 0;
          }
          
          .date-month {
            font-size: clamp(0.6rem, 1.5vw, 0.8rem);
            color: #666666;
            font-weight: 500;
            text-transform: uppercase;
          }
          
          .date-day {
            font-size: clamp(0.9rem, 2vw, 1.2rem);
            color: #333333;
            font-weight: bold;
            margin-top: -2px;
          }
          
          .name {
            color: ${titleFontColor};
            font-size: clamp(0.9rem, 2vw, 1.1rem);
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            flex: 1;
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          .pulse {
            animation: pulse 2s infinite;
          }
          
          /* Responsive design */
          @media (max-width: 768px) {
            .container {
              flex-direction: column;
              gap: 1rem;
            }
            
            .title-section {
              padding-left: 1rem;
              text-align: center;
            }
            
            .birthday-cards {
              padding-right: 1rem;
              width: 100%;
            }
            
            .birthday-card {
              justify-content: center;
            }
          }
          
          @media (max-width: 480px) {
            body {
              padding: 10px;
            }
            
            .birthday-cards {
              gap: 0.5rem;
            }
            
            .title {
              font-size: 1.2rem;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="title-section">
            <div class="title">
              Birthday<br>Announcement
            </div>
          </div>
          
          <div class="birthday-cards">
            ${upcomingBirthdays.slice(0, 3).map((birthday, index) => {
              const [month, day] = birthday.date.split(' ');
              return `
                <div class="birthday-card ${index === currentIndex ? 'pulse' : ''}">
                  <div class="date-circle">
                    <div class="date-month">${month}</div>
                    <div class="date-day">${day}</div>
                  </div>
                  <div class="name">${birthday.name}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <script>
          // Dynamic updates from parent component
          let currentIndex = ${currentIndex};
          const birthdays = ${JSON.stringify(upcomingBirthdays)};
          const disableAnimations = ${disableAnimations};
          const duration = ${duration};
          
          function updateHighlight() {
            const cards = document.querySelectorAll('.birthday-card');
            cards.forEach((card, index) => {
              card.classList.toggle('pulse', index === currentIndex);
            });
          }
          
          // Listen for updates from parent
          window.addEventListener('message', (event) => {
            if (event.data.type === 'updateIndex') {
              currentIndex = event.data.index;
              updateHighlight();
            }
          });
          
          // Auto-cycle through birthdays if animations enabled
          if (!disableAnimations && birthdays.length > 1) {
            setInterval(() => {
              currentIndex = (currentIndex + 1) % birthdays.length;
              updateHighlight();
              // Notify parent of index change
              window.parent.postMessage({
                type: 'indexChanged',
                index: currentIndex
              }, '*');
            }, duration * 1000);
          }
        </script>
      </body>
      </html>
    `;
  };

  // Update iframe content when data changes
  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(generateIframeContent());
      doc.close();
    }
  }, [upcomingBirthdays, currentIndex, settings, titleFontColor, textFont, customBackgroundColor, customBackgroundImage, disableAnimations, duration]);

  // Handle messages from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'indexChanged') {
        setCurrentIndex(event.data.index);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
      title="Birthday Announcement Widget"
    />
  );
};

export default BirthdayAnnouncement;