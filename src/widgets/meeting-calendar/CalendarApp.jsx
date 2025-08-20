import React, { useState, useEffect, useRef } from 'react';

const CalendarApp = ({ widget, settings = {} }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [currentView, setCurrentView] = useState('day'); // 'day', 'week', 'month
  const [viewPeriod, setViewPeriod] = useState(0); // For cycling through periods
  const iframeRef = useRef(null);

  // Extract all settings
  const {
    // Basic appearance settings
    backgroundColor = '#8B4513',
    fontColor = '#ffffff',
    textFont = 'Arial',
    highlightColor = '#FFD700',
    showEachDataFor = 15,
    transitionSpeed = 0.7,
    disableAnimations = false,
    
    // Calendar-specific options
    eventTitleColor = '#ffffff',
    eventTimeColor = '#ffffff',
    eventBackgroundColor = '#654321',
    eventBorderColor = '#8B4513',
    eventCornerRadius = 8,
    headerFontSize = 28,
    eventTitleFontSize = 16,
    eventTimeFontSize = 14,
    
    // New settings from requirements
    calendarUrl = '',
    displayEventsFor = 'today', // 'today', 'week', 'month'
    showPastEvents = false,
    showEventsInPeriods = false,
    showTime = true,
    maxEvents = 5,
    syncFrequency = 10, // minutes
    cyclingTimeInterval = 10, // seconds
    calendarTimeout = 50, // minutes
    textShadow = false,
    showIcon = true,
    backgroundImage = '',
    entranceAnimation = 'fade',
    animateBackgroundImage = false,
    
    // View mode settings
    viewMode = 'day', // 'day', 'week', 'month'
    language = 'en'
  } = settings;

  // Function to parse iCal data
  const parseICalData = (icalData) => {
    // This is a simplified parser - in a real implementation, you would use a proper iCal library
    const events = [];
    const lines = icalData.split('\n');
    let currentEvent = null;
    
    for (const line of lines) {
      if (line.startsWith('BEGIN:VEVENT')) {
        currentEvent = {};
      } else if (line.startsWith('END:VEVENT')) {
        if (currentEvent && currentEvent.title && currentEvent.startTime) {
          events.push(currentEvent);
        }
        currentEvent = null;
      } else if (currentEvent) {
        if (line.startsWith('SUMMARY:')) {
          currentEvent.title = line.substring(8).trim();
        } else if (line.startsWith('DTSTART:')) {
          const dateTimeStr = line.substring(8).trim();
          // Parse date/time - simplified for this example
          currentEvent.startTime = dateTimeStr.substring(9, 15); // Extract time portion
        } else if (line.startsWith('DTEND:')) {
          const dateTimeStr = line.substring(6).trim();
          // Parse date/time - simplified for this example
          currentEvent.endTime = dateTimeStr.substring(9, 15); // Extract time portion
        }
      }
    }
    
    return events;
  };

  // Function to fetch calendar data from iCal URL
  const fetchCalendarData = async () => {
    if (!calendarUrl) return [];
    
    try {
      // In a real implementation, you would fetch from the actual URL
      // For now, we'll simulate with mock data
      const mockICalData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Calendar App//EN
BEGIN:VEVENT
SUMMARY:Team Meeting
DTSTART:20230410T140000Z
DTEND:20230410T150000Z
END:VEVENT
BEGIN:VEVENT
SUMMARY:Client Call
DTSTART:20230410T160000Z
DTEND:20230410T170000Z
END:VEVENT
BEGIN:VEVENT
SUMMARY:Project Review
DTSTART:20230411T100000Z
DTEND:20230411T110000Z
END:VEVENT
END:VCALENDAR`;
      
      return parseICalData(mockICalData);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      return [];
    }
  };

  // Load calendar events based on settings
  useEffect(() => {
    const loadEvents = async () => {
      if (calendarUrl) {
        const fetchedEvents = await fetchCalendarData();
        setCalendarEvents(fetchedEvents);
      } else if (widget?.events && widget.events.length > 0) {
        setCalendarEvents(widget.events);
      } else {
        // Default events if none provided
        setCalendarEvents([
          { title: "Team Meeting", startTime: "2:00 PM", endTime: "3:00 PM" },
          { title: "Client Call", startTime: "4:00 PM", endTime: "5:00 PM" },
          { title: "Project Review", startTime: "10:00 AM", endTime: "11:00 AM" }
        ]);
      }
    };

    loadEvents();
    
    // Set up periodic sync based on syncFrequency
    const syncInterval = setInterval(() => {
      loadEvents();
    }, syncFrequency * 60 * 1000); // Convert minutes to milliseconds

    return () => clearInterval(syncInterval);
  }, [calendarUrl, syncFrequency, widget?.events]);

  // Set up cycling through periods based on cyclingTimeInterval
  useEffect(() => {
    if (showEventsInPeriods && cyclingTimeInterval > 0) {
      const cycleInterval = setInterval(() => {
        setViewPeriod(prev => prev + 1);
      }, cyclingTimeInterval * 1000); // Convert seconds to milliseconds

      return () => clearInterval(cycleInterval);
    }
  }, [showEventsInPeriods, cyclingTimeInterval]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format events for display based on current view and settings
  const formatEventsForDisplay = () => {
    let eventsToShow = [...calendarEvents];
    
    // Filter past events if needed
    if (!showPastEvents) {
      const now = new Date();
      eventsToShow = eventsToShow.filter(event => {
        // This is a simplified check - in a real implementation you would compare actual dates/times
        return true; // For now, show all events
      });
    }
    
    // Limit number of events
    if (maxEvents && eventsToShow.length > maxEvents) {
      eventsToShow = eventsToShow.slice(0, maxEvents);
    }
    
    // Format time display based on settings
    return eventsToShow.map(event => ({
      ...event,
      time: showTime ? `${event.startTime} - ${event.endTime || 'N/A'}` : ''
    }));
  };
  
  const events = formatEventsForDisplay();

  // Get header text based on view mode and language
  const getHeaderText = () => {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    switch (viewMode) {
      case 'week':
        return `Week of ${today.toLocaleDateString(language, options)}`;
      case 'month':
        return today.toLocaleDateString(language, { month: 'long', year: 'numeric' });
      case 'day':
      default:
        return today.toLocaleDateString(language, options);
    }
  };

  // Generate HTML content for iframe
  const generateIframeContent = () => {
    const backgroundStyle = backgroundImage 
      ? `background-image: url(${backgroundImage}); background-size: cover; background-position: center;`
      : `background-color: ${backgroundColor};`;

    return `
      <!DOCTYPE html>
      <html lang="${language}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Calendar App</title>
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
            flex-direction: column;
            padding: 15px;
            overflow: hidden;
            color: ${fontColor};
          }
          
          .calendar-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            border-radius: 12px;
            background: linear-gradient(135deg, ${backgroundColor}dd, ${backgroundColor}aa);
            backdrop-filter: blur(10px);
            border: 2px solid ${eventBorderColor};
            overflow: hidden;
          }
          
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px 20px;
            background: linear-gradient(90deg, ${backgroundColor}, ${eventBackgroundColor});
            border-bottom: 2px solid ${eventBorderColor};
          }
          
          .header-text {
            color: ${highlightColor};
            font-size: clamp(16px, 4vw, ${headerFontSize}px);
            font-weight: bold;
            text-shadow: ${textShadow ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none'};
          }
          
          .calendar-icon {
            width: clamp(30px, 6vw, 40px);
            height: clamp(30px, 6vw, 40px);
            background: ${highlightColor};
            border-radius: 8px;
            display: ${showIcon ? 'flex' : 'none'};
            align-items: center;
            justify-content: center;
            font-size: clamp(16px, 3vw, 20px);
            color: ${backgroundColor};
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          }
          
          .events-container {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          
          .event-card {
            background: ${eventBackgroundColor};
            border: 2px solid ${eventBorderColor};
            border-radius: ${eventCornerRadius}px;
            padding: 12px 15px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            opacity: 0;
            transform: translateY(20px);
            animation: slideIn 0.6s ease-out forwards;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          
          .event-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.2);
          }
          
          .event-card:nth-child(1) { animation-delay: 0.1s; }
          .event-card:nth-child(2) { animation-delay: 0.2s; }
          .event-card:nth-child(3) { animation-delay: 0.3s; }
          .event-card:nth-child(4) { animation-delay: 0.4s; }
          .event-card:nth-child(5) { animation-delay: 0.5s; }
          
          .event-title {
            color: ${eventTitleColor};
            font-size: clamp(14px, 3vw, ${eventTitleFontSize}px);
            font-weight: bold;
            text-shadow: ${textShadow ? '1px 1px 2px rgba(0,0,0,0.3)' : 'none'};
          }
          
          .event-time {
            color: ${eventTimeColor};
            font-size: clamp(12px, 2.5vw, ${eventTimeFontSize}px);
            opacity: 0.9;
            display: ${showTime ? 'block' : 'none'};
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .no-events {
            text-align: center;
            color: ${fontColor};
            opacity: 0.7;
            font-style: italic;
            padding: 40px 20px;
          }
          
          /* Responsive design */
          @media (max-width: 768px) {
            .header {
              padding: 10px 15px;
            }
            
            .events-container {
              padding: 10px;
              gap: 8px;
            }
            
            .event-card {
              padding: 10px 12px;
            }
          }
          
          @media (max-width: 480px) {
            body {
              padding: 10px;
            }
            
            .header {
              flex-direction: column;
              gap: 8px;
              text-align: center;
            }
          }
        </style>
      </head>
      <body>
        <div class="calendar-container">
          <div class="header">
            <div class="header-text">${getHeaderText()}</div>
            <div class="calendar-icon">📅</div>
          </div>
          
          <div class="events-container">
            ${events.length > 0 ? events.map((event, index) => `
              <div class="event-card">
                <div class="event-title">${event.title}</div>
                ${event.time ? `<div class="event-time">${event.time}</div>` : ''}
              </div>
            `).join('') : '<div class="no-events">No events scheduled</div>'}
          </div>
        </div>
        
        <script>
          // Auto-refresh calendar data
          const syncFrequency = ${syncFrequency};
          const cyclingInterval = ${cyclingTimeInterval};
          
          // Simulate data refresh
          if (syncFrequency > 0) {
            setInterval(() => {
              console.log('Refreshing calendar data...');
            }, syncFrequency * 60 * 1000);
          }
          
          // Handle period cycling
          if (${showEventsInPeriods} && cyclingInterval > 0) {
            setInterval(() => {
              console.log('Cycling through periods...');
            }, cyclingInterval * 1000);
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
  }, [calendarEvents, settings, currentTime]);

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
      title="Calendar App Widget"
    />
  );
};

export default CalendarApp;