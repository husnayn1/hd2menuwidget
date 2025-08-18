import React, { useState, useEffect, useRef } from "react";

function EntertainmentPreviewModal({ open, onClose, widget, settings }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(true);
  const timerRef = useRef();
  const progressRef = useRef();

  // Sample data for different entertainment types
  const getEntertainmentData = (widgetName) => {
    const name = widgetName.toLowerCase();
    
    if (name.includes('american football')) {
      return {
        images: [
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80"
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
      // Default data for other entertainment types
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

  useEffect(() => {
    if (!open) return;
    
    if (disableAnimations) {
      setFade(true);
    } else {
      setFade(false);
      const fadeTimeout = setTimeout(() => setFade(true), 100);
      return () => clearTimeout(fadeTimeout);
    }
  }, [currentImage, open, disableAnimations]);

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
    
    progressRef.current.style.transition = 'none';
    progressRef.current.style.width = '0%';
    setTimeout(() => {
      if (progressRef.current) {
        progressRef.current.style.transition = `width ${showEachFactFor}s linear`;
        progressRef.current.style.width = '100%';
      }
    }, 50);
  }, [currentImage, showEachFactFor, open]);

  if (!open) return null;

  const currentImageUrl = entertainmentData.images[currentImage % entertainmentData.images.length];
  const currentFact = entertainmentData.facts[currentImage % entertainmentData.facts.length];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: '#fff',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
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
          color: '#333',
          zIndex: 10000
        }}
        aria-label="Close preview"
      >
        ×
      </button>
      
      <div style={{
        background: backgroundColor,
        borderRadius: 16,
        boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90vw',
        height: '90vh',
        maxWidth: 900,
        maxHeight: 600,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Progress Bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, height: 6, width: '100%', background: '#eee', zIndex: 2 }}>
          <div ref={progressRef} style={{ height: '100%', width: 0, background: settings?.highlightColor || '#1976d2', borderRadius: 6, transition: `width ${showEachFactFor}s linear` }} />
        </div>
        
        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', padding: '40px 20px' }}>
          {/* Image with fade transition */}
          <img
            src={currentImageUrl}
            alt={widget?.name}
            style={{
              width: '100%',
              maxWidth: 500,
              height: 300,
              objectFit: 'cover',
              borderRadius: 12,
              marginBottom: 30,
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              opacity: fade ? 1 : 0,
              transition: disableAnimations ? 'none' : `opacity ${transitionSpeed}s`,
              background: '#f0f0f0',
              display: 'block',
            }}
          />
          
          {/* Title */}
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: 28, 
            marginBottom: 16, 
            color: '#222', 
            textAlign: 'center', 
            opacity: fade ? 1 : 0, 
            transition: disableAnimations ? 'none' : `opacity ${transitionSpeed}s`,
            fontFamily: settings?.textFont || 'inherit'
          }}>
            {widget?.name}
          </div>
          
          {/* Fact/Description with fade transition */}
          <div style={{ 
            color: settings?.fontColor || '#555', 
            fontSize: 18, 
            textAlign: 'center', 
            minHeight: 60, 
            opacity: fade ? 1 : 0, 
            transition: disableAnimations ? 'none' : `opacity ${transitionSpeed}s`,
            maxWidth: 600,
            lineHeight: 1.5,
            fontFamily: settings?.textFont || 'inherit'
          }}>
            {currentFact}
          </div>
          
          {/* Counter */}
          <div style={{ 
            position: 'absolute', 
            bottom: 20, 
            right: 20, 
            color: '#aaa', 
            fontSize: 14,
            background: 'rgba(255,255,255,0.8)',
            padding: '4px 8px',
            borderRadius: 4
          }}>
            {currentImage + 1} / {Math.max(entertainmentData.images.length, entertainmentData.facts.length)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EntertainmentPreviewModal; 