import React, { useState, useEffect } from 'react';
import { Stage, Layer, Text, Rect, Group, Circle } from 'react-konva';

const CalendarApp = ({ widget, settings = {} }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [currentView, setCurrentView] = useState('day'); // 'day', 'week', 'month
  const [viewPeriod, setViewPeriod] = useState(0); // For cycling through periods
  
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

  // Calculate stage dimensions based on orientation
  const isPortrait = false; // This would be determined by settings in a real implementation
  const stageWidth = isPortrait ? 300 : 400;
  const stageHeight = isPortrait ? 400 : 300;

  return (
    <Stage width={stageWidth} height={stageHeight}>
      <Layer>
        {/* Background */}
        <Rect
          x={0}
          y={0}
          width={stageWidth}
          height={stageHeight}
          fill={backgroundColor}
          stroke="#654321"
          strokeWidth={2}
          cornerRadius={10}
        />
        
        {/* Background Image (if provided) */}
        {backgroundImage && (
          <Rect
            x={0}
            y={0}
            width={stageWidth}
            height={stageHeight}
            fillPatternImage={backgroundImage}
          />
        )}
        
        {/* Header */}
        <Text
          x={20}
          y={20}
          text={getHeaderText()}
          fontSize={headerFontSize}
          fontFamily={textFont}
          fill={highlightColor}
          fontWeight="bold"
          shadowBlur={textShadow ? 2 : 0}
        />
        
        {/* Calendar Icon */}
        {showIcon && (
          <>
            <Circle
              x={stageWidth - 50}
              y={40}
              radius={20}
              fill={highlightColor}
              stroke="#654321"
              strokeWidth={2}
            />
            <Text
              x={stageWidth - 60}
              y={30}
              text="📅"
              fontSize={20}
              fontFamily={textFont}
            />
          </>
        )}
        
        {/* Events List */}
        <Group>
          {events.map((event, index) => (
            <Group key={index}>
              <Rect
                x={20}
                y={80 + (index * 60)}
                width={stageWidth - 40}
                height={50}
                fill={eventBackgroundColor}
                stroke={eventBorderColor}
                strokeWidth={1}
                cornerRadius={eventCornerRadius}
              />
              <Text
                x={40}
                y={95 + (index * 60)}
                text={event.title}
                fontSize={eventTitleFontSize}
                fontFamily={textFont}
                fill={eventTitleColor}
                fontWeight="bold"
              />
              {showTime && (
                <Text
                  x={40}
                  y={115 + (index * 60)}
                  text={event.time}
                  fontSize={eventTimeFontSize}
                  fontFamily={textFont}
                  fill={eventTimeColor}
                />
              )}
            </Group>
          ))}
        </Group>
        
        {/* Current Time */}
        <Text
          x={20}
          y={stageHeight - 40}
          text={`Current Time: ${currentTime.toLocaleTimeString(language)}`}
          fontSize={14}
          fontFamily={textFont}
          fill={highlightColor}
        />
      </Layer>
    </Stage>
  );
};

export default CalendarApp;