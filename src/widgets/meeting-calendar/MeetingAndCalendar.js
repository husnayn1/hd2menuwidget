import React from 'react';
import { Stage, Layer, Group, Rect, Text } from 'react-konva';

const cards = [
  {
    title: "Birthday Announcement",
    subtitle: "Data Feed Enabled!",
    details: [
      { date: "Apr 10", name: "John Smith" },
      { date: "Apr 11", name: "Emma Johnson" },
      { date: "Apr 12", name: "James Brown" }
    ],
    color: "#1976d2",
    image: "wid/content-konva/src/images/meeting-calendar/birthday-announcement.svg"
  },
  {
    title: "Birthday Announcement",
    details: [
      { date: "Apr 11", name: "Olivia Wilson" },
      { date: "Apr 12", name: "Daniel Taylor" },
      { date: "Apr 12", name: "Sophia Anderson" }
    ],
    color: "#1976d2",
    image: "wid/content-konva/src/images/meeting-calendar/birthday-announcement.svg"
  },
  {
    title: "Calendar App",
    details: [
      { date: "Today", name: "Ongoing event 5:00 PM - 6:40 PM" },
      { date: "Next event", name: "6:41 PM - 8:40 PM" },
      { date: "Last event", name: "8:30 PM - 10:10 PM" }
    ],
    color: "#b03a2e",
    image: "wid/content-konva/src/images/meeting-calendar/calendar-app.svg"
  },
  {
    title: "Events Calendar",
    details: [
      { date: "Monday, 1 January", name: "12:30 PM" },
      { date: "9:00 AM", name: "Team Meeting" },
      { date: "10:00 AM", name: "Client Call" },
      { date: "11:00 AM", name: "Project Review" }
    ],
    color: "#263238",
    image: "wid/content-konva/src/images/meeting-calendar/calendar-app.svg"
  },
  {
    title: "Happy Birthday",
    subtitle: "Data Feed Enabled!",
    details: [
      { date: "David Smith", name: "January 9" }
    ],
    color: "#f39c12",
    image: "wid/content-konva/src/images/meeting-calendar/happy-birthday.svg"
  },
  {
    title: "Happy Birthday - Elegant",
    subtitle: "Data Feed Enabled!",
    details: [
      { date: "Susan Jones", name: "CEO" }
    ],
    color: "#2980b9",
    image: "wid/content-konva/src/images/meeting-calendar/happy-birthday.svg"
  },
  {
    title: "Happy Birthday - Enterprise",
    subtitle: "Data Feed Enabled!",
    details: [
      { date: "Buddy Garner", name: "Project Manager" }
    ],
    color: "#e74c3c",
    image: "wid/content-konva/src/images/meeting-calendar/happy-birthday.svg"
  },
  {
    title: "Meeting Room Calendar App",
    details: [
      { date: "Phoenix Room", name: "Brainstorming session" },
      { date: "Busy", name: "03:00pm - 04:30pm" },
      { date: "04:00pm", name: "" }
    ],
    color: "#212121",
    image: "wid/content-konva/src/images/meeting-calendar/calendar-app.svg"
  },
  {
    title: "Meeting Room Calendar Bar",
    details: [
      { date: "Ongoing event", name: "Busy 5:00 PM - 6:40 PM" }
    ],
    color: "#e74c3c",
    image: "wid/content-konva/src/images/meeting-calendar/calendar-app.svg"
  }
];

const CARD_WIDTH = 320;
const CARD_HEIGHT = 160;
const CARD_GAP = 24;

export default function MeetingAndCalendarKonva({ onCardSelect }) {
  // Function to handle card click
  const handleCardClick = (card) => {
    if (onCardSelect) {
      onCardSelect(card);
    }
  };

  return (
    <Stage width={1200} height={800}>
      <Layer>
        {/* Sidebar */}
        <Group>
          <Rect x={0} y={0} width={220} height={800} fill="#f5f5f5" />
          <Text x={24} y={40} text="Meeting Room & Calendar" fontSize={20} fontStyle="bold" />
          {/* Add sidebar categories as needed */}
        </Group>

        {/* Cards Grid */}
        {cards.map((card, idx) => {
          const col = idx % 3;
          const row = Math.floor(idx / 3);
          const x = 240 + col * (CARD_WIDTH + CARD_GAP);
          const y = 40 + row * (CARD_HEIGHT + CARD_GAP);

          return (
            <Group
              key={idx}
              x={x}
              y={y}
              onClick={() => handleCardClick(card)}
              onTap={() => handleCardClick(card)}
              onMouseEnter={(e) => {
                // Change cursor to pointer on hover
                const container = e.target.getStage().container();
                container.style.cursor = 'pointer';
              }}
              onMouseLeave={(e) => {
                // Reset cursor
                const container = e.target.getStage().container();
                container.style.cursor = 'default';
              }}
            >
              <Rect width={CARD_WIDTH} height={CARD_HEIGHT} fill={card.color} cornerRadius={12} shadowBlur={6} />
              <Text x={16} y={16} text={card.title} fontSize={18} fontStyle="bold" fill="#fff" />
              {card.subtitle && (
                <Text x={16} y={44} text={card.subtitle} fontSize={14} fill="#fff" />
              )}
              {card.details && card.details.map((d, i) => (
                <Text
                  key={i}
                  x={16}
                  y={70 + i * 22}
                  text={d.date + (d.name ? `  |  ${d.name}` : "")}
                  fontSize={14}
                  fill="#fff"
                />
              ))}
            </Group>
          );
        })}
      </Layer>
    </Stage>
  );
}