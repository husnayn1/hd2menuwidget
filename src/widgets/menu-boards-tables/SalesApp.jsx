import React, { useState, useEffect } from 'react';
import { Stage, Layer, Text, Rect, Group, Circle } from 'react-konva';

const SalesApp = ({ widget, settings = {} }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [productData, setProductData] = useState({
    name: "AirPods Pro - White",
    price: "$229.99",
    image: "🎧"
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
          text="Sales App - Modern"
          fontSize={20}
          fontFamily={textFont}
          fill="#ffffff"
          fontWeight="bold"
        />
        
        {/* Product Display */}
        <Group>
          {/* Product Image */}
          <Circle
            x={200}
            y={120}
            radius={50}
            fill="#f0f0f0"
            stroke="#e0e0e0"
            strokeWidth={2}
          />
          <Text
            x={180}
            y={105}
            text={productData.image}
            fontSize={40}
            fontFamily={textFont}
          />
          
          {/* Product Name */}
          <Text
            x={100}
            y={190}
            text={productData.name}
            fontSize={18}
            fontFamily={textFont}
            fill={fontColor}
            fontWeight="bold"
            align="center"
            width={200}
          />
          
          {/* Product Price */}
          <Text
            x={150}
            y={220}
            text={productData.price}
            fontSize={24}
            fontFamily={textFont}
            fill={highlightColor}
            fontWeight="bold"
          />
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

export default SalesApp; 