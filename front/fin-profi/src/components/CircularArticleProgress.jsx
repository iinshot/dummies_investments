import React, { forwardRef } from 'react';

const CircularArticleProgress = forwardRef(({ progress, size = 120, strokeWidth = 5, number, onClick }, ref) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="article-circle-progress-wrapper" onClick={onClick} style={{ width: size, height: size, position: 'relative', cursor: 'pointer' }} ref={ref}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Фоновый круг (серая обводка) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#EEEEEE"
          strokeWidth={strokeWidth}
        />
        {/* Прогресс круг (желтая обводка) - заполняется в зависимости от прогресса */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F0F036"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      {/* Внутренний кружок - всегда белый, не меняется */}
      <div className="article-circle-inner" style={{ width: size - 10, height: size - 10, backgroundColor: '#FFFFFF' }}>
        <span className="article-number-circle">{number}</span>
      </div>
    </div>
  );
});

CircularArticleProgress.displayName = 'CircularArticleProgress';

export default CircularArticleProgress;