import React, { useState, useEffect } from 'react';
import { Stage, Layer, Text, Rect, Group, Circle } from 'react-konva';

const HappyBirthday = ({ widget, settings = {} }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [birthdayPerson, setBirthdayPerson] = useState({
    name: "David Smith",
    date: "January 9",
    image: "🎂"
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const {
    backgroundColor = '#FF8C00',
    fontColor = '#ffffff',
    textFont = 'Arial',
    highlightColor = '#FFD700',
    showEachDataFor = 15,
    transitionSpeed = 0.7,
    disableAnimations = false
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
          stroke="#E67E22"
          strokeWidth={2}
          cornerRadius={15}
        />
        
        {/* Header */}
        <Text
          x={100}
          y={30}
          text="Happy Birthday!"
          fontSize={32}
          fontFamily={textFont}
          fill={fontColor}
          fontWeight="bold"
        />
        
        {/* Birthday Person Image */}
        <Circle
          x={200}
          y={120}
          radius={40}
          fill={highlightColor}
          stroke="#E67E22"
          strokeWidth={3}
        />
        <Text
          x={180}
          y={105}
          text={birthdayPerson.image}
          fontSize={40}
          fontFamily={textFont}
        />
        
        {/* Birthday Person Name */}
        <Text
          x={120}
          y={180}
          text={birthdayPerson.name}
          fontSize={24}
          fontFamily={textFont}
          fill={fontColor}
          fontWeight="bold"
        />
        
        {/* Birthday Date */}
        <Text
          x={150}
          y={210}
          text={birthdayPerson.date}
          fontSize={18}
          fontFamily={textFont}
          fill={highlightColor}
        />
        
        {/* Decorative Elements */}
        <Text
          x={50}
          y={50}
          text="🎉"
          fontSize={24}
          fontFamily={textFont}
        />
        <Text
          x={320}
          y={50}
          text="🎉"
          fontSize={24}
          fontFamily={textFont}
        />
        <Text
          x={50}
          y={250}
          text="🎈"
          fontSize={24}
          fontFamily={textFont}
        />
        <Text
          x={320}
          y={250}
          text="🎈"
          fontSize={24}
          fontFamily={textFont}
        />
      </Layer>
    </Stage>
  );
};

export default HappyBirthday; 