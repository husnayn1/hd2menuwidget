import React, { useEffect, useState } from "react";
import { Stage, Layer, Circle, Line, Text, Group, Rect } from "react-konva";

function drawNumbers(dialType, handsColor, type, size) {
  const numbers = [];
  if (type === "analog-square") {
    // Only 12, 3, 6, 9
    const center = size / 2;
    const offset = size * 0.16;
    const positions = [
      { n: "12", x: center, y: offset },
      { n: "3", x: size - offset, y: center },
      { n: "6", x: center, y: size - offset },
      { n: "9", x: offset, y: center }
    ];
    positions.forEach((pos, i) => {
      numbers.push(
        <Text
          key={i}
          x={pos.x - size * 0.1}
          y={pos.y - size * 0.1}
          text={pos.n}
          fontSize={size * 0.16}
          fill={handsColor}
          fontStyle="bold"
          width={size * 0.2}
          align="center"
        />
      );
    });
  } else {
    // Round clock
    const center = size / 2;
    const radius = size * 0.41;
    for (let i = 1; i <= 12; i++) {
      let label = i.toString();
      if (dialType === "roman") {
        const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
        label = roman[i - 1];
      } else if (dialType === "none") {
        continue;
      }
      const angle = ((i - 3) * Math.PI) / 6;
      numbers.push(
        <Text
          key={i}
          x={center + Math.cos(angle) * radius - size * 0.045}
          y={center + Math.sin(angle) * radius - size * 0.055}
          text={label}
          fontSize={size * 0.08}
          fill={handsColor}
          fontStyle="bold"
          width={size * 0.09}
          align="center"
        />
      );
    }
  }
  return numbers;
}

function drawTicks(type, handsColor, size) {
  const ticks = [];
  const center = size / 2;
  if (type === "analog-square") {
    // 12 long ticks
    const inner = size * 0.36;
    const outer = size * 0.43;
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const x1 = center + Math.cos(angle) * inner;
      const y1 = center + Math.sin(angle) * inner;
      const x2 = center + Math.cos(angle) * outer;
      const y2 = center + Math.sin(angle) * outer;
      ticks.push(
        <Line
          key={i}
          points={[x1, y1, x2, y2]}
          stroke="#888"
          strokeWidth={size * 0.013}
          lineCap="round"
        />
      );
    }
  } else {
    // Round clock: 60 short ticks
    const inner = size * 0.42;
    const outer = size * 0.455;
    for (let i = 0; i < 60; i++) {
      const angle = (i * Math.PI) / 30;
      const x1 = center + Math.cos(angle) * inner;
      const y1 = center + Math.sin(angle) * inner;
      const x2 = center + Math.cos(angle) * outer;
      const y2 = center + Math.sin(angle) * outer;
      ticks.push(
        <Line
          key={i}
          points={[x1, y1, x2, y2]}
          stroke="#888"
          strokeWidth={i % 5 === 0 ? size * 0.013 : size * 0.0045}
        />
      );
    }
  }
  return ticks;
}

function DigitalClock({ size }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const pad = n => n.toString().padStart(2, '0');
  const dateStr = time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div style={{
      width: size,
      height: size * 0.38,
      background: '#eaf4ff',
      borderRadius: size * 0.04,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
      boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
      overflow: 'hidden',
    }}>
      <div style={{
        background: '#2166b3',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: size * 0.09,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `0 ${size * 0.04}px`,
        borderTopLeftRadius: size * 0.04,
        borderBottomLeftRadius: size * 0.04,
        minWidth: size * 0.45,
      }}>
        {dateStr.replace(/\b(\d{1,2})(st|nd|rd|th)\b/, (m, d, s) => `${d}${s}`)}
      </div>
      <div style={{
        background: '#2166b3',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: size * 0.18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
        padding: `0 ${size * 0.04}px`,
        borderTopRightRadius: size * 0.04,
        borderBottomRightRadius: size * 0.04,
        position: 'relative',
      }}>
        <span style={{ fontSize: size * 0.18, lineHeight: 1 }}>{pad(hour12)}:{pad(minutes)}</span>
        <span style={{ fontSize: size * 0.07, marginLeft: 8, alignSelf: 'flex-end', marginBottom: size * 0.03 }}>{ampm}</span>
      </div>
    </div>
  );
}

function AnalogClock({ dialType = "arabic", dialBg = "#fff", handsColor = "#000", bgColor = "#fff", type, size = 220 }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const center = size / 2;
  const hour = time.getHours() % 12;
  const minute = time.getMinutes();
  const second = time.getSeconds();

  // Angles in radians
  const hourAngle = ((hour + minute / 60) * Math.PI) / 6 - Math.PI / 2;
  const minuteAngle = ((minute + second / 60) * Math.PI) / 30 - Math.PI / 2;
  const secondAngle = (second * Math.PI) / 30 - Math.PI / 2;

  return (
    <Stage width={size} height={size} style={{ background: bgColor, borderRadius: type === "analog-square" ? 0 : '50%' }}>
      <Layer>
        {/* Square clock: white background, square border */}
        {type === "analog-square" ? (
          <Rect x={size * 0.045} y={size * 0.045} width={size * 0.91} height={size * 0.91} fill={dialBg} stroke={handsColor} strokeWidth={size * 0.018} />
        ) : (
          <Circle x={center} y={center} radius={size * 0.455} fill={dialBg} stroke={handsColor} strokeWidth={size * 0.018} />
        )}
        {/* Ticks */}
        {drawTicks(dialType, handsColor, size)}
        {/* Numbers */}
        {drawNumbers(dialType, handsColor, type, size)}
        {/* Hour hand */}
        <Line
          points={[center, center, center + Math.cos(hourAngle) * size * 0.25, center + Math.sin(hourAngle) * size * 0.25]}
          stroke={handsColor}
          strokeWidth={size * 0.036}
          lineCap="round"
        />
        {/* Minute hand */}
        <Line
          points={[center, center, center + Math.cos(minuteAngle) * size * 0.36, center + Math.sin(minuteAngle) * size * 0.36]}
          stroke={handsColor}
          strokeWidth={size * 0.027}
          lineCap="round"
        />
        {/* Second hand */}
        <Line
          points={[center, center, center + Math.cos(secondAngle) * size * 0.41, center + Math.sin(secondAngle) * size * 0.41]}
          stroke="#222"
          strokeWidth={size * 0.009}
          lineCap="round"
        />
        {/* Center dot */}
        <Circle x={center} y={center} radius={size * 0.036} fill={handsColor} />
      </Layer>
    </Stage>
  );
}

function BarClockModern({ size = 220 }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const pad = n => n.toString().padStart(2, '0');
  const dateStr = time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  // Analog clock hands
  const center = size / 2;
  const radius = size * 0.22;
  const hour = hours % 12;
  const minute = time.getMinutes();
  const second = time.getSeconds();
  const hourAngle = ((hour + minute / 60) * Math.PI) / 6 - Math.PI / 2;
  const minuteAngle = ((minute + second / 60) * Math.PI) / 30 - Math.PI / 2;
  const secondAngle = (second * Math.PI) / 30 - Math.PI / 2;

  return (
    <div style={{
      width: size * 1.1,
      background: '#fff',
      borderRadius: size * 0.06,
      boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
      padding: size * 0.08,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Stage width={size} height={size} style={{ background: '#f7fafd', borderRadius: '50%' }}>
        <Layer>
          <Circle x={center} y={center} radius={radius} fill="#fff" stroke="#b3d0f7" strokeWidth={2} />
          {/* Hour hand */}
          <Line
            points={[center, center, center + Math.cos(hourAngle) * radius * 0.5, center + Math.sin(hourAngle) * radius * 0.5]}
            stroke="#2166b3"
            strokeWidth={4}
            lineCap="round"
          />
          {/* Minute hand */}
          <Line
            points={[center, center, center + Math.cos(minuteAngle) * radius * 0.8, center + Math.sin(minuteAngle) * radius * 0.8]}
            stroke="#2166b3"
            strokeWidth={3}
            lineCap="round"
          />
          {/* Second hand */}
          <Line
            points={[center, center, center + Math.cos(secondAngle) * radius * 0.9, center + Math.sin(secondAngle) * radius * 0.9]}
            stroke="#e74c3c"
            strokeWidth={2}
            lineCap="round"
          />
          {/* Center dot */}
          <Circle x={center} y={center} radius={5} fill="#2166b3" />
        </Layer>
      </Stage>
      <div style={{ marginTop: size * 0.06, textAlign: 'center' }}>
        <span style={{ fontWeight: 'bold', fontSize: size * 0.18, color: '#202735', letterSpacing: 2 }}>{pad(hour12)}:{pad(minutes)}</span>
        <span style={{ fontWeight: 'bold', fontSize: size * 0.08, color: '#202735', marginLeft: 6 }}>{ampm}</span>
        <div style={{ fontSize: size * 0.08, color: '#202735', marginTop: 2 }}>{dateStr}</div>
      </div>
    </div>
  );
}

function CountdownClock({ size = 220, targetDate, message, title, subtitle, textFont, fontColor, bgColor }) {
  // Use provided targetDate or default to 2 days from now
  const target = targetDate ? new Date(targetDate) : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  // Arc progress (right side)
  const total = Math.max(1, Math.floor((target - now + diff) / 1000)); // avoid division by zero
  const elapsed = total - Math.floor(diff / 1000);
  const arcAngle = (elapsed / total) * Math.PI * 2;
  const arcRadius = size * 0.32;
  const arcCenterX = size * 0.92;
  const arcCenterY = size * 0.4;

  // Tick marks
  const ticks = [];
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    const x1 = arcCenterX + Math.cos(angle) * (arcRadius - 8);
    const y1 = arcCenterY + Math.sin(angle) * (arcRadius - 8);
    const x2 = arcCenterX + Math.cos(angle) * (arcRadius - 2);
    const y2 = arcCenterY + Math.sin(angle) * (arcRadius - 2);
    ticks.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth="2" />);
  }

  // Font and color styles
  const fontFamily = textFont || 'Segoe UI, Arial, sans-serif';
  const mainColor = fontColor || '#fff';
  const background = bgColor || '#0a0a2a';

  return (
    <div style={{
      width: size * 1.3,
      height: size * 0.8,
      background,
      borderRadius: size * 0.04,
      color: mainColor,
      display: 'flex',
      flexDirection: 'row',
      boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
      overflow: 'hidden',
      alignItems: 'stretch',
      border: '3px solid #fff',
      fontFamily,
    }}>
      {/* Left: Text and countdown */}
      <div style={{ flex: 1, padding: size * 0.09, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', minWidth: 0 }}>
        {/* Title and subtitle */}
        {subtitle && <div style={{ fontSize: size * 0.06, fontWeight: 600, color: '#b3b8e0', marginBottom: size * 0.01, textTransform: 'uppercase', letterSpacing: 1 }}>{subtitle}</div>}
        <div style={{ fontSize: size * 0.07, fontWeight: 700, color: mainColor, marginBottom: size * 0.03, textTransform: 'none', whiteSpace: 'pre-line' }}>{title || 'BE READY'}</div>
        {/* Countdown numbers */}
        <div style={{ display: 'flex', gap: size * 0.06, alignItems: 'flex-end', marginBottom: size * 0.04 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: size * 0.14, fontWeight: 700, letterSpacing: 2 }}>{String(days).padStart(2, '0')}</div>
            <div style={{ fontSize: size * 0.045, color: '#e74c3c', fontWeight: 600, marginTop: 2, letterSpacing: 1 }}>DAYS</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: size * 0.14, fontWeight: 700, letterSpacing: 2 }}>{String(hours).padStart(2, '0')}</div>
            <div style={{ fontSize: size * 0.045, color: '#e74c3c', fontWeight: 600, marginTop: 2, letterSpacing: 1 }}>HOURS</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: size * 0.14, fontWeight: 700, letterSpacing: 2 }}>{String(minutes).padStart(2, '0')}</div>
            <div style={{ fontSize: size * 0.045, color: '#e74c3c', fontWeight: 600, marginTop: 2, letterSpacing: 1 }}>MINUTES</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: size * 0.14, fontWeight: 700, letterSpacing: 2 }}>{String(seconds).padStart(2, '0')}</div>
            <div style={{ fontSize: size * 0.045, color: '#e74c3c', fontWeight: 600, marginTop: 2, letterSpacing: 1 }}>SECONDS</div>
          </div>
        </div>
        {/* Message (optional) */}
        {message && <div style={{ fontSize: size * 0.055, color: '#b3b8e0', fontWeight: 500, marginTop: size * 0.01 }}>{message}</div>}
      </div>
      {/* Right: Arc progress and ticks */}
      <div style={{ width: size * 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
        <svg width={size * 1.1} height={size * 0.8} style={{ display: 'block' }}>
          <g>
            {ticks}
            <circle cx={arcCenterX} cy={arcCenterY} r={arcRadius - 8} fill="none" stroke="#fff2" strokeWidth="4" />
            <path d={`M${arcCenterX},${arcCenterY - arcRadius + 8} A${arcRadius - 8},${arcRadius - 8} 0 ${arcAngle > Math.PI ? 1 : 0} 1 ${arcCenterX + Math.sin(arcAngle) * (arcRadius - 8)},${arcCenterY - Math.cos(arcAngle) * (arcRadius - 8)}`} stroke="#e74c3c" strokeWidth="6" fill="none" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function GlowClock({ size = 220, ringColor = '#e83e00', bgCircleColor = '#e1e2eb', fontColor = '#333', timeFormat = 'hh:mm:ss', ampm = true }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const pad = n => n.toString().padStart(2, '0');
  let display = '';
  if (timeFormat === 'hh:mm:ss') {
    display = `${ampm ? ((hours % 12) || 12) : pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  } else if (timeFormat === 'hh:mm') {
    display = `${ampm ? ((hours % 12) || 12) : pad(hours)}:${pad(minutes)}`;
  }
  if (ampm) {
    display += ` ${hours >= 12 ? 'PM' : 'AM'}`;
  }

  // Progress for seconds
  const progress = seconds / 60;
  const radius = size * 0.45;
  const stroke = size * 0.06;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={bgCircleColor}
        strokeWidth={stroke}
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={ringColor}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        filter={`drop-shadow(0 0 8px ${ringColor})`}
        style={{ transition: 'stroke-dashoffset 0.5s linear' }}
      />
      <text
        x={center}
        y={center}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size * 0.16}
        fill={fontColor}
        fontFamily="'Segoe UI', Arial, sans-serif"
        fontWeight="bold"
      >
        {display}
      </text>
    </svg>
  );
}

function HolidayClock({ size = 220 }) {
  const [time, setTime] = React.useState(new Date());
  React.useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const center = size / 2;
  const radius = size * 0.45;
  const hour = time.getHours() % 12;
  const minute = time.getMinutes();
  const second = time.getSeconds();

  // Angles in radians
  const hourAngle = ((hour + minute / 60) * Math.PI) / 6 - Math.PI / 2;
  const minuteAngle = ((minute + second / 60) * Math.PI) / 30 - Math.PI / 2;
  const secondAngle = (second * Math.PI) / 30 - Math.PI / 2;

  // Roman numerals
  const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

  // Holly leaves (simple polygons)
  const hollyLeaves = [
    // Top left
    { x: center - radius * 0.7, y: center - radius * 0.7, rotation: -30 },
    // Bottom left
    { x: center - radius * 0.8, y: center + radius * 0.7, rotation: 30 },
    // Bottom right
    { x: center + radius * 0.8, y: center + radius * 0.7, rotation: 150 },
  ];

  return (
    <Stage width={size} height={size}>
      <Layer>
        {/* Holly leaves */}
        {hollyLeaves.map((leaf, i) => (
          <Group key={i} x={leaf.x} y={leaf.y} rotation={leaf.rotation}>
            <Line
              points={[0, 0, 20, -10, 35, 0, 20, 10, 0, 0]}
              closed
              fill="#228B22"
              stroke="#145214"
              strokeWidth={2}
            />
            <Circle x={35} y={0} radius={4} fill="#b71c1c" />
          </Group>
        ))}
        {/* Ornament top */}
        <Group x={center} y={center - radius - size * 0.08}>
          <Rect x={-size * 0.06} y={-size * 0.04} width={size * 0.12} height={size * 0.08} fill="#FFD700" stroke="#B8860B" strokeWidth={2} cornerRadius={size * 0.04} />
          <Circle x={0} y={-size * 0.04} radius={size * 0.045} stroke="#FFD700" strokeWidth={4} />
        </Group>
        {/* Main clock face */}
        <Circle x={center} y={center} radius={radius} fill="#fffbe6" strokeLinearGradientStartPoint={{x: center-radius, y: center-radius}}
          strokeLinearGradientEndPoint={{x: center+radius, y: center+radius}}
          strokeLinearGradientColorStops={[0, '#B22222', 0.7, '#FFD700', 1, '#B22222']} strokeWidth={size * 0.045} shadowColor="#b71c1c" shadowBlur={12} />
        {/* Ticks */}
        {[...Array(60)].map((_, i) => {
          const angle = (i * Math.PI) / 30;
          const inner = radius * 0.88;
          const outer = radius * 0.97;
          const x1 = center + Math.cos(angle) * inner;
          const y1 = center + Math.sin(angle) * inner;
          const x2 = center + Math.cos(angle) * outer;
          const y2 = center + Math.sin(angle) * outer;
          return (
            <Line
              key={i}
              points={[x1, y1, x2, y2]}
              stroke="#333"
              strokeWidth={i % 5 === 0 ? size * 0.012 : size * 0.004}
            />
          );
        })}
        {/* Roman numerals */}
        {roman.map((label, i) => {
          const angle = ((i - 2) * Math.PI) / 6;
          const r = radius * 0.75;
          const x = center + Math.cos(angle) * r;
          const y = center + Math.sin(angle) * r;
          return (
            <Text
              key={label}
              x={x - size * 0.04}
              y={y - size * 0.045}
              text={label}
              fontSize={size * 0.09}
              fill="#222"
              fontStyle="bold"
              width={size * 0.08}
              align="center"
            />
          );
        })}
        {/* Hour hand */}
        <Line
          points={[center, center, center + Math.cos(hourAngle) * radius * 0.5, center + Math.sin(hourAngle) * radius * 0.5]}
          stroke="#FFD700"
          strokeWidth={size * 0.035}
          lineCap="round"
          shadowColor="#B8860B"
          shadowBlur={6}
        />
        {/* Minute hand */}
        <Line
          points={[center, center, center + Math.cos(minuteAngle) * radius * 0.7, center + Math.sin(minuteAngle) * radius * 0.7]}
          stroke="#FFD700"
          strokeWidth={size * 0.025}
          lineCap="round"
          shadowColor="#B8860B"
          shadowBlur={6}
        />
        {/* Second hand */}
        <Line
          points={[center, center, center + Math.cos(secondAngle) * radius * 0.8, center + Math.sin(secondAngle) * radius * 0.8]}
          stroke="#b71c1c"
          strokeWidth={size * 0.01}
          lineCap="round"
        />
        {/* Center circle */}
        <Circle x={center} y={center} radius={size * 0.04} fill="#FFD700" stroke="#B8860B" strokeWidth={2} />
      </Layer>
    </Stage>
  );
}

function LCDClock({ size = 220, fontColor = '#333', bgColor = '#222' }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  const pad = n => n.toString().padStart(2, '0');
  const hours = pad(time.getHours());
  const minutes = pad(time.getMinutes());
  const seconds = pad(time.getSeconds());
  return (
    <div style={{ width: size, height: size * 0.38, background: bgColor, borderRadius: size * 0.04, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 32px rgba(0,0,0,0.10)', color: fontColor, fontFamily: 'monospace', fontSize: size * 0.18, fontWeight: 'bold', letterSpacing: 2 }}>
      {hours}:{minutes}:{seconds}
    </div>
  );
}

function MultiCityClock({ size = 220 }) {
  // Show 3 cities as a stub
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  const getTime = (offset) => {
    const d = new Date(now.getTime() + offset * 60 * 60 * 1000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  return (
    <div style={{ width: size, background: '#f7fafd', borderRadius: size * 0.06, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: size * 0.08, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontWeight: 'bold', fontSize: size * 0.13, color: '#2166b3', marginBottom: 8 }}>New York: {getTime(-4)}</div>
      <div style={{ fontWeight: 'bold', fontSize: size * 0.13, color: '#e67e22', marginBottom: 8 }}>London: {getTime(1)}</div>
      <div style={{ fontWeight: 'bold', fontSize: size * 0.13, color: '#27ae60' }}>Tokyo: {getTime(9)}</div>
    </div>
  );
}

function Clock({ dialType = "arabic", dialBg = "#fff", handsColor = "#000", bgColor = "#fff", type, size = 220, targetDate, message, title, subtitle, textFont, fontColor, ringColor, bgCircleColor, timeFormat, ampm }) {
  // Normalize the type to handle various input formats
  const normalizedType = type?.toLowerCase() || '';
  
  if (normalizedType === 'digital-simple' || normalizedType.includes('digital')) {
    return <DigitalClock size={size} />;
  }
  if (normalizedType === 'bar-modern' || normalizedType.includes('bar') || normalizedType.includes('modern')) {
    return <BarClockModern size={size} />;
  }
  if (normalizedType === 'countdown-app' || normalizedType.includes('countdown')) {
    return <CountdownClock size={size} targetDate={targetDate} message={message} title={title} subtitle={subtitle} textFont={textFont} fontColor={fontColor} bgColor={bgColor} />;
  }
  if (normalizedType === 'glow-clock' || normalizedType.includes('glow')) {
    return <GlowClock size={size} ringColor={ringColor} bgCircleColor={bgCircleColor} fontColor={fontColor} timeFormat={timeFormat} ampm={ampm} />;
  }
  if (normalizedType === 'holiday-clock' || normalizedType.includes('holiday')) {
    return <HolidayClock size={size} />;
  }
  if (normalizedType === 'lcd-clock' || normalizedType.includes('lcd')) {
    return <LCDClock size={size} fontColor={fontColor} bgColor={bgColor} />;
  }
  if (normalizedType === 'multi-city-clock' || normalizedType.includes('multi city') || normalizedType.includes('multi-city')) {
    return <MultiCityClock size={size} />;
  }
  if (normalizedType === 'analog-round' || normalizedType === 'analog-square' || 
      normalizedType.includes('analog') || normalizedType.includes('round') || normalizedType.includes('square')) {
    return (
      <AnalogClock
        dialType={dialType}
        dialBg={dialBg}
        handsColor={handsColor}
        bgColor={bgColor}
        type={normalizedType.includes('square') ? 'analog-square' : 'analog-round'}
        size={size}
      />
    );
  }
  
  // If no specific type is provided, default to analog round clock
  console.log("Clock component: No specific type provided, defaulting to analog-round. Type:", type);
  return (
    <AnalogClock
      dialType={dialType}
      dialBg={dialBg}
      handsColor={handsColor}
      bgColor={bgColor}
      type="analog-round"
      size={size}
    />
  );
}

export default Clock; 