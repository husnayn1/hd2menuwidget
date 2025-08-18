import React, { useState, useEffect } from 'react';
import { Stage, Layer, Text, Rect, Group } from 'react-konva';

const BirthdayAnnouncement = ({ widget, settings = {} }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  
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
    fontColor = '#333333',
    textFont = 'Arial',
    highlightColor = '#1976d2',
    showEachDataFor = 15,
    transitionSpeed = 0.7,
    disableAnimations = false,
    // Additional birthday-specific options
    headerFontSize = 24,
    birthdayItemBackgroundColor = '#f8f9fa',
    birthdayItemBorderColor = '#e9ecef',
    birthdayItemCornerRadius = 8,
    birthdayDateColor = '#1976d2',
    birthdayDateFontSize = 18,
    birthdayNameFontSize = 16
  } = settings;

  return (
    <Stage width={400} height={300}>
      <Layer>
        {/* Background */}
        <Rect
          x={0}
          y={0}
          width={400}
          height={300}
          fill={backgroundColor}
          stroke="#e0e0e0"
          strokeWidth={1}
        />
        
        {/* Header */}
        <Text
          x={20}
          y={20}
          text="Upcoming Birthdays"
          fontSize={headerFontSize}
          fontFamily={textFont}
          fill={highlightColor}
          fontWeight="bold"
        />
        
        {/* Birthday List */}
        <Group>
          {upcomingBirthdays.map((birthday, index) => (
            <Group key={index}>
              <Rect
                x={20}
                y={60 + (index * 60)}
                width={360}
                height={50}
                fill={birthdayItemBackgroundColor}
                stroke={birthdayItemBorderColor}
                strokeWidth={1}
                cornerRadius={birthdayItemCornerRadius}
              />
              <Text
                x={40}
                y={75 + (index * 60)}
                text={birthday.date}
                fontSize={birthdayDateFontSize}
                fontFamily={textFont}
                fill={birthdayDateColor}
                fontWeight="bold"
              />
              <Text
                x={120}
                y={75 + (index * 60)}
                text={birthday.name}
                fontSize={birthdayNameFontSize}
                fontFamily={textFont}
                fill={fontColor}
              />
            </Group>
          ))}
        </Group>
        
        {/* Footer */}
        <Text
          x={20}
          y={260}
          text={`Last updated: ${currentTime.toLocaleTimeString()}`}
          fontSize={12}
          fontFamily={textFont}
          fill="#666666"
        />
      </Layer>
    </Stage>
  );
};

export default BirthdayAnnouncement;