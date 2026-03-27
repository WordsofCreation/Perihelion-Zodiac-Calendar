import { CUSTOM_YEAR_DAYS, DAYS_PER_MONTH } from '../utils/calendarMath';

interface OrbitWheelProps {
  degree: number;
  zodiacOrder: string[];
  dayOfYear: number;
}

const size = 360;
const center = size / 2;
const radius = 130;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angle = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function describeArc(startAngle: number, endAngle: number): string {
  const start = polarToCartesian(center, center, radius, endAngle);
  const end = polarToCartesian(center, center, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export function OrbitWheel({ degree, zodiacOrder, dayOfYear }: OrbitWheelProps) {
  const marker = polarToCartesian(center, center, radius, degree);

  return (
    <section className="panel orbit-panel">
      <h2>Orbit Wheel</h2>
      <svg viewBox={`0 0 ${size} ${size}`} className="orbit-svg" role="img" aria-label="Perihelion orbit wheel">
        <circle cx={center} cy={center} r={radius + 20} className="orbit-backdrop" />
        {zodiacOrder.map((sign, index) => {
          const start = index * 30;
          const end = start + 30;
          const mid = start + 15;
          const labelPoint = polarToCartesian(center, center, radius + 32, mid);
          const dayStart = index * DAYS_PER_MONTH + 1;
          const dayEnd = dayStart + DAYS_PER_MONTH - 1;
          return (
            <g key={`${sign}-${index}`}>
              <path d={describeArc(start, end)} className="orbit-segment" />
              <line
                x1={center}
                y1={center}
                x2={polarToCartesian(center, center, radius + 14, start).x}
                y2={polarToCartesian(center, center, radius + 14, start).y}
                className="orbit-divider"
              />
              <text x={labelPoint.x} y={labelPoint.y} textAnchor="middle" dominantBaseline="middle" className="orbit-label">
                {sign}
              </text>
              <title>{`${sign} | ${start}°-${end}° | Month ${index + 1} | Days ${dayStart}-${dayEnd}`}</title>
            </g>
          );
        })}

        <circle cx={center} cy={center} r={5} className="perihelion-dot" />
        <text x={center} y={center - 16} textAnchor="middle" className="perihelion-label">
          Perihelion 0°
        </text>

        <line x1={center} y1={center} x2={marker.x} y2={marker.y} className="marker-line" />
        <circle cx={marker.x} cy={marker.y} r={8} className="marker-dot" />
      </svg>
      <div className="orbit-meta">
        <p>Current day: {dayOfYear} / {CUSTOM_YEAR_DAYS}</p>
        <p>Orbital degree: {degree.toFixed(2)}°</p>
      </div>
    </section>
  );
}
