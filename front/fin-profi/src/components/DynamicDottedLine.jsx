import React, { useEffect, useState } from 'react';

const DynamicDottedLine = ({ startRef, endRef, progress = 0, containerRef, strokeColor = '#F0F036', strokeWidth = 4, reverse = false }) => {
  const [pathD, setPathD] = useState('');
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    const updatePath = () => {
      if (startRef?.current && endRef?.current && containerRef?.current) {
        const startRect = startRef.current.getBoundingClientRect();
        const endRect = endRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        
        const startX = startRect.left + startRect.width / 2 - containerRect.left;
        const startY = startRect.top + startRect.height / 2 - containerRect.top;
        const endX = endRect.left + endRect.width / 2 - containerRect.left;
        const endY = endRect.top + endRect.height / 2 - containerRect.top;
        
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        
        const isRightCurve = endX > startX;
        const offset = isRightCurve ? 80 : -80;
        const verticalOffset = isRightCurve ? -20 : 20;
        
        const cpX = midX + offset;
        const cpY = midY + verticalOffset;
        
        const newPathD = `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`;
        setPathD(newPathD);
        
        const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        tempPath.setAttribute('d', newPathD);
        setPathLength(tempPath.getTotalLength());
      }
    };
    
    updatePath();
    window.addEventListener('resize', updatePath);
    setTimeout(updatePath, 100);
    
    return () => window.removeEventListener('resize', updatePath);
  }, [startRef, endRef, containerRef]);

  const dashLength = 8;
  const gapLength = 6;
  const segmentLength = dashLength + gapLength;
  
  // Количество видимых желтых сегментов
  const visibleLength = pathLength * (progress / 100);
  const yellowSegments = Math.floor(visibleLength / segmentLength);
  const yellowDashOffset = -(pathLength - yellowSegments * segmentLength);

  // Обрезка: если reverse=true, обрезаем слева (inset 0 0 0 X%)
  // если reverse=false, обрезаем справа (inset 0 X% 0 0)
  const clipInset = reverse 
    ? `inset(0 0 0 ${100 - progress}%)` 
    : `inset(0 ${100 - progress}% 0 0)`;

  return (
    <g>
      {/* Серая пунктирная линия */}
      <path
        d={pathD}
        fill="none"
        stroke="#EEEEEE"
        strokeWidth={strokeWidth}
        strokeDasharray={`${dashLength},${gapLength}`}
        strokeLinecap="round"
      />
      
      {/* Желтая пунктирная линия - обрезается по длине прогресса */}
      {progress > 0 && progress < 100 && (
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dashLength},${gapLength}`}
          strokeDashoffset={yellowDashOffset}
          strokeLinecap="round"
          style={{
            clipPath: clipInset
          }}
        />
      )}
      
      {/* При 100% - полная желтая пунктирная линия */}
      {progress >= 100 && (
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dashLength},${gapLength}`}
          strokeLinecap="round"
        />
      )}
    </g>
  );
};

export default DynamicDottedLine;