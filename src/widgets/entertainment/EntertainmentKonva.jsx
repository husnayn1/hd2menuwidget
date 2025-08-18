import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Image, Text, Rect, Group } from "react-konva";

function EntertainmentKonva({ open, onClose, widget, settings }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(1);
  const [slideOffset, setSlideOffset] = useState(0);
  const [imageElement, setImageElement] = useState(null);
  const [nextImageElement, setNextImageElement] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState('slide'); // 'slide', 'fade', 'zoom', 'flip', 'bounce', 'rotate', 'roll'
  const [rotation, setRotation] = useState(0);
  const [bounceOffset, setBounceOffset] = useState(0);
  const [rollOffset, setRollOffset] = useState(0);
  const [rollRadius, setRollRadius] = useState(0);
  const timerRef = useRef();
  const progressRef = useRef();
  
  // Stage dimensions
  const stageWidth = 800;
  const stageHeight = 600;

  // Sample data for different entertainment types
  const getEntertainmentData = (widgetName) => {
    const name = widgetName.toLowerCase();
    
    if (name.includes('american football')) {
      return {
        images: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80"
        ],
        facts: [
          "American football evolved from rugby and soccer in the late 19th century.",
          "The NFL was founded in 1920 as the American Professional Football Association.",
          "The Super Bowl is the most-watched television event in the United States.",
          "A regulation football field is 100 yards long with 10-yard end zones.",
          "The first Super Bowl was played in 1967 between the Green Bay Packers and Kansas City Chiefs."
        ]
      };
    } else if (name.includes('animal facts')) {
      return {
        images: [
          "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80"
        ],
        facts: [
          "Cats spend 70% of their lives sleeping - that's 13-16 hours a day!",
          "A group of lions is called a 'pride' and can have up to 30 members.",
          "Elephants are the only mammals that cannot jump.",
          "A chameleon's tongue can be twice the length of its body.",
          "Honeybees can recognize human faces and remember them for days."
        ]
      };
    } else if (name.includes('basketball')) {
      return {
        images: [
          "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80"
        ],
        facts: [
          "Basketball was invented by Dr. James Naismith in 1891.",
          "The NBA was founded in 1946 as the Basketball Association of America.",
          "Michael Jordan won 6 NBA championships with the Chicago Bulls.",
          "The basketball hoop is exactly 10 feet high from the floor.",
          "The first basketball game was played with peach baskets as hoops."
        ]
      };
    } else if (name.includes('cricket facts')) {
      return {
        images: [
          "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"
        ],
        facts: [
          "Cricket is the second most popular sport in the world after soccer.",
          "The longest cricket match lasted 9 days in 1939.",
          "A cricket ball can travel at speeds up to 100 mph when bowled.",
          "The first international cricket match was played in 1844.",
          "Cricket was included in the Olympics only once, in 1900."
        ]
      };
    } else if (name.includes('famous quotes')) {
      return {
        images: [
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"
        ],
        facts: [
          "\"Be the change you wish to see in the world.\" - Mahatma Gandhi",
          "\"The only way to do great work is to love what you do.\" - Steve Jobs",
          "\"Life is what happens when you're busy making other plans.\" - John Lennon",
          "\"Success is not final, failure is not fatal.\" - Winston Churchill",
          "\"The future belongs to those who believe in the beauty of their dreams.\" - Eleanor Roosevelt"
        ]
      };
    } else {
      return {
        images: [widget?.image || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80"],
        facts: [widget?.description || "Interesting facts and information will be displayed here."]
      };
    }
  };

  const entertainmentData = getEntertainmentData(widget?.name);
  const showEachFactFor = settings?.showEachFactFor || 15;
  const transitionSpeed = settings?.transitionSpeed || 0.7;
  const backgroundColor = settings?.backgroundColor || '#ffffff';
  const disableAnimations = settings?.disableAnimations || false;
  const highlightColor = settings?.highlightColor || '#1976d2';
  const fontColor = settings?.fontColor || '#555';
  const textFont = settings?.textFont || 'Arial';

  // Load current image
  useEffect(() => {
    if (!open) return;
    
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImageElement(img);
    };
    img.src = entertainmentData.images[currentImage % entertainmentData.images.length];
  }, [currentImage, entertainmentData.images, open]);

  // Preload next image for smooth transition
  useEffect(() => {
    if (!open) return;
    
    const nextIndex = (currentImage + 1) % entertainmentData.images.length;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setNextImageElement(img);
    };
    img.src = entertainmentData.images[nextIndex];
  }, [currentImage, entertainmentData.images, open]);

  // Professional animation transitions with advanced effects
  useEffect(() => {
    if (!open) return;
    
    if (disableAnimations) {
              setFade(1);
        setSlideOffset(0);
        setRotation(0);
        setBounceOffset(0);
        setRollOffset(0);
        setRollRadius(0);
        setIsTransitioning(false);
    } else {
      setIsTransitioning(true);
      
      // Always use rolling animation for every transition
      setTransitionType('roll');
      
              // Always apply rolling animation for every image/text change
        if (transitionType === 'roll') {
          // Professional rolling animation
          setFade(0);
          setRollOffset(0);
          setRollRadius(0);
          
          // Start rolling from right side
          setRollOffset(800);
          setRollRadius(0);
          setFade(1);
          
          // Roll in circular motion
          const rollDuration = transitionSpeed * 1000;
          const startTime = Date.now();
          
          const rollAnimation = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / rollDuration;
            
            if (progress < 1) {
              // Circular rolling motion
              const angle = progress * Math.PI * 2; // Full circle
              const radius = 200; // Rolling radius
              
              // Calculate position on circular path
              const x = 400 + radius * Math.cos(angle);
              const y = 250 + radius * Math.sin(angle);
              
              // Calculate rotation based on position
              const rotationAngle = (angle * 180) / Math.PI;
              
              setRollOffset(x - 400); // Center offset
              setRollRadius(rotationAngle);
              setRotation(rotationAngle);
              
              requestAnimationFrame(rollAnimation);
            } else {
              // Settle into final position
              setRollOffset(0);
              setRollRadius(0);
              setRotation(0);
              setIsTransitioning(false);
            }
          };
          
          requestAnimationFrame(rollAnimation);
        }
    }
  }, [currentImage, open, disableAnimations, transitionSpeed]);

  // Initial fade in when component opens
  useEffect(() => {
    if (open && !disableAnimations) {
      setFade(0);
      setTimeout(() => {
        setFade(1);
      }, 100);
    }
  }, [open, disableAnimations]);

  // Auto advance timer
  useEffect(() => {
    if (!open) return;
    
    timerRef.current && clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCurrentImage((prev) => (prev + 1) % Math.max(entertainmentData.images.length, entertainmentData.facts.length));
    }, showEachFactFor * 1000);
    return () => clearTimeout(timerRef.current);
  }, [currentImage, entertainmentData.images.length, entertainmentData.facts.length, showEachFactFor, open]);

  // Progress bar animation
  useEffect(() => {
    if (!open || !progressRef.current) return;
    
    const progressBar = progressRef.current;
    let startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / showEachFactFor, 1);
      progressBar.width(stageWidth * progress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }, [currentImage, showEachFactFor, open, stageWidth]);

  if (!open) return null;

  const currentFact = entertainmentData.facts[currentImage % entertainmentData.facts.length];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.8)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 24,
          right: 36,
          fontSize: 32,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#fff',
          zIndex: 10000
        }}
        aria-label="Close preview"
      >
        ×
      </button>
      
      <Stage width={stageWidth} height={stageHeight}>
        <Layer>
          {/* Background */}
          <Rect
            x={0}
            y={0}
            width={stageWidth}
            height={stageHeight}
            fill={backgroundColor}
            cornerRadius={16}
            shadowColor="black"
            shadowBlur={20}
            shadowOpacity={0.3}
            shadowOffset={{ x: 0, y: 4 }}
          />
          
          {/* Progress Bar Background */}
          <Rect
            x={0}
            y={0}
            width={stageWidth}
            height={6}
            fill="#eee"
            cornerRadius={6}
          />
          
          {/* Progress Bar */}
          <Rect
            ref={progressRef}
            x={0}
            y={0}
            width={0}
            height={6}
            fill={highlightColor}
            cornerRadius={6}
          />
          
          {/* Current Image with professional animations */}
          {imageElement && (
            <Image
              image={imageElement}
              x={50 + slideOffset + (transitionType === 'roll' ? rollOffset : 0)}
              y={50 + bounceOffset + (transitionType === 'roll' ? rollRadius * 0.5 : 0)}
              width={700}
              height={400}
              cornerRadius={12}
              opacity={fade}
              scaleX={transitionType === 'zoom' ? 1 + slideOffset : 1}
              scaleY={transitionType === 'zoom' ? 1 + slideOffset : 1}
              rotation={rotation}
              shadowColor="black"
              shadowBlur={10}
              shadowOpacity={0.2}
              shadowOffset={{ x: 0, y: 2 }}
            />
          )}
          
          {/* Next Image for slide effect */}
          {nextImageElement && isTransitioning && transitionType === 'slide' && (
            <Image
              image={nextImageElement}
              x={850 + slideOffset} // Start from right side
              y={50}
              width={700}
              height={400}
              cornerRadius={12}
              opacity={1}
              shadowColor="black"
              shadowBlur={10}
              shadowOpacity={0.2}
              shadowOffset={{ x: 0, y: 2 }}
            />
          )}
          

          
          {/* Title with professional animations */}
          <Text
            text={widget?.name}
            x={70 + slideOffset + (transitionType === 'roll' ? rollOffset : 0)}
            y={320 + bounceOffset + (transitionType === 'roll' ? rollRadius * 0.5 : 0)}
            width={660}
            fontSize={28}
            fontFamily={textFont}
            fill={fontColor}
            align="center"
            opacity={fade}
            fontStyle="bold"
            scaleX={transitionType === 'zoom' ? 1 + slideOffset : 1}
            scaleY={transitionType === 'zoom' ? 1 + slideOffset : 1}
            rotation={rotation}
            shadowColor={highlightColor}
            shadowBlur={6}
            shadowOpacity={0.9}
            shadowOffset={{ x: 2, y: 2 }}
          />
          
          {/* Fact/Description with professional animations */}
          <Text
            text={currentFact}
            x={70 + slideOffset + (transitionType === 'roll' ? rollOffset : 0)}
            y={370 + bounceOffset + (transitionType === 'roll' ? rollRadius * 0.5 : 0)}
            width={660}
            fontSize={18}
            fontFamily={textFont}
            fill={fontColor}
            align="center"
            opacity={fade}
            lineHeight={1.4}
            scaleX={transitionType === 'zoom' ? 1 + slideOffset : 1}
            scaleY={transitionType === 'zoom' ? 1 + slideOffset : 1}
            rotation={rotation}
            shadowColor={highlightColor}
            shadowBlur={6}
            shadowOpacity={0.9}
            shadowOffset={{ x: 2, y: 2 }}
          />
          
          {/* Counter */}
          <Group x={stageWidth - 100} y={stageHeight - 40}>
            <Rect
              x={0}
              y={0}
              width={80}
              height={30}
              fill="rgba(255,255,255,0.8)"
              cornerRadius={4}
            />
            <Text
              text={`${currentImage + 1} / ${Math.max(entertainmentData.images.length, entertainmentData.facts.length)}`}
              x={10}
              y={8}
              fontSize={14}
              fill="#aaa"
              fontFamily={textFont}
            />
          </Group>
        </Layer>
      </Stage>
    </div>
  );
}

export default EntertainmentKonva; 