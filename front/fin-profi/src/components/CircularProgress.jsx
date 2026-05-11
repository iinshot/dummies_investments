import React from 'react';

const CircularProgress = ({ progress, size = 20, completed = false }) => {
  // Если прогресс 100% или completed = true, показываем галочку
  if (completed || progress >= 100) {
    return (
      <div className="module-article-check completed">
        <span className="check-icon">✓</span>
      </div>
    );
  }

  // Если прогресс 0, показываем пустой кружок
  if (progress === 0) {
    return <div className="module-article-check" style={{ width: size, height: size }}></div>;
  }

  // Расчет для круговой диаграммы
  const center = size / 2;
  const radius = size / 2 - 1;
  
  // Угол в радианах (от 12 часов по часовой стрелке)
  const angle = (progress / 100) * 360;
  const radians = ((angle - 90) * Math.PI) / 180;
  
  // Конечная точка дуги
  const x = center + radius * Math.cos(radians);
  const y = center + radius * Math.sin(radians);
  
  // Флаг для большого сектора
  const largeArcFlag = angle > 180 ? 1 : 0;
  
  // Формируем путь для сектора
  const pathData = `M ${center} ${center} L ${center} ${center - radius} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x} ${y} Z`;

  return (
    <div className="module-article-progress" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Фоновый круг */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#EEEEEE"
          strokeWidth={2}
        />
        {/* Закрашенный сектор */}
        <path
          d={pathData}
          fill="#C8C800"
          stroke="none"
        />
      </svg>
    </div>
  );
};

export default CircularProgress;