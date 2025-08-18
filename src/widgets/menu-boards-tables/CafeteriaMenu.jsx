import React, { useState, useEffect } from 'react';
import { Stage, Layer, Text, Rect, Group } from 'react-konva';

const CafeteriaMenu = ({ widget, settings = {} }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [menuData, setMenuData] = useState({
    breakfast: [
      "French Toast",
      "Boiled Eggs", 
      "Fruits",
      "Waffles",
      "Cereal",
      "Juice & Coffee"
    ],
    lunch: [
      "Rice and Beans",
      "Steak",
      "Seasoned Salad",
      "French Fries",
      "Soda and Juice"
    ],
    snackTime: [
      "Peanut Butter Jelly Sandwich",
      "Cheese Bread",
      "Bagels",
      "Orange Juice"
    ]
  });

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
    highlightColor = '#4CAF50',
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
          stroke="#e0e0e0"
          strokeWidth={1}
        />
        
        {/* Header */}
        <Rect
          x={0}
          y={0}
          width={400}
          height={40}
          fill={highlightColor}
        />
        <Text
          x={20}
          y={10}
          text="Cafeteria"
          fontSize={24}
          fontFamily={textFont}
          fill="#ffffff"
          fontWeight="bold"
        />
        
        {/* Menu Sections */}
        <Group>
          {/* Breakfast */}
          <Text
            x={20}
            y={60}
            text="Breakfast"
            fontSize={18}
            fontFamily={textFont}
            fill={highlightColor}
            fontWeight="bold"
          />
          {menuData.breakfast.map((item, index) => (
            <Text
              key={index}
              x={20}
              y={85 + (index * 20)}
              text={`• ${item}`}
              fontSize={14}
              fontFamily={textFont}
              fill={fontColor}
            />
          ))}
          
          {/* Lunch */}
          <Text
            x={140}
            y={60}
            text="Lunch"
            fontSize={18}
            fontFamily={textFont}
            fill={highlightColor}
            fontWeight="bold"
          />
          {menuData.lunch.map((item, index) => (
            <Text
              key={index}
              x={140}
              y={85 + (index * 20)}
              text={`• ${item}`}
              fontSize={14}
              fontFamily={textFont}
              fill={fontColor}
            />
          ))}
          
          {/* Snack Time */}
          <Text
            x={260}
            y={60}
            text="Snack Time"
            fontSize={18}
            fontFamily={textFont}
            fill={highlightColor}
            fontWeight="bold"
          />
          {menuData.snackTime.map((item, index) => (
            <Text
              key={index}
              x={260}
              y={85 + (index * 20)}
              text={`• ${item}`}
              fontSize={14}
              fontFamily={textFont}
              fill={fontColor}
            />
          ))}
        </Group>
        
        {/* Footer */}
        <Text
          x={20}
          y={280}
          text={`Last updated: ${currentTime.toLocaleTimeString()}`}
          fontSize={12}
          fontFamily={textFont}
          fill="#666666"
        />
      </Layer>
    </Stage>
  );
};

export default CafeteriaMenu; 