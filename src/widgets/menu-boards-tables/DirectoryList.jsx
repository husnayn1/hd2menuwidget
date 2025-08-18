import React, { useState, useEffect } from 'react';
import { Stage, Layer, Text, Rect, Group } from 'react-konva';

const DirectoryList = ({ widget, settings = {} }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [directoryData, setDirectoryData] = useState([
    { class: "Class 1", room: "Room 2", time: "12pm", day: "Monday" },
    { class: "Class 2", room: "Room 2", time: "12pm", day: "Tuesday" },
    { class: "Class 3", room: "Room 2", time: "12pm", day: "Wednesday" },
    { class: "Class 4", room: "Room 2", time: "12pm", day: "Thursday" },
    { class: "Class 5", room: "Room 2", time: "12pm", day: "Friday" }
  ]);

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
    highlightColor = '#f44336',
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
          text="Directory List"
          fontSize={24}
          fontFamily={textFont}
          fill="#ffffff"
          fontWeight="bold"
        />
        
        {/* Table Headers */}
        <Group>
          <Text
            x={20}
            y={60}
            text="Class"
            fontSize={16}
            fontFamily={textFont}
            fill={highlightColor}
            fontWeight="bold"
          />
          <Text
            x={100}
            y={60}
            text="Room"
            fontSize={16}
            fontFamily={textFont}
            fill={highlightColor}
            fontWeight="bold"
          />
          <Text
            x={180}
            y={60}
            text="Time"
            fontSize={16}
            fontFamily={textFont}
            fill={highlightColor}
            fontWeight="bold"
          />
          <Text
            x={260}
            y={60}
            text="Day"
            fontSize={16}
            fontFamily={textFont}
            fill={highlightColor}
            fontWeight="bold"
          />
          
          {/* Table Data */}
          {directoryData.map((item, index) => (
            <Group key={index}>
              <Text
                x={20}
                y={90 + (index * 30)}
                text={item.class}
                fontSize={14}
                fontFamily={textFont}
                fill={fontColor}
              />
              <Text
                x={100}
                y={90 + (index * 30)}
                text={item.room}
                fontSize={14}
                fontFamily={textFont}
                fill={fontColor}
              />
              <Text
                x={180}
                y={90 + (index * 30)}
                text={item.time}
                fontSize={14}
                fontFamily={textFont}
                fill={fontColor}
              />
              <Text
                x={260}
                y={90 + (index * 30)}
                text={item.day}
                fontSize={14}
                fontFamily={textFont}
                fill={fontColor}
              />
            </Group>
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

export default DirectoryList; 