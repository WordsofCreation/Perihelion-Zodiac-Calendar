import { TROPICAL_ZODIAC_ORDER } from '../data/zodiac';
import { CUSTOM_YEAR_DAYS, DAYS_PER_MONTH } from '../utils/calendarMath';

interface OrbitWheelProps {
  degree: number;
  tropicalDegree: number;
  siderealDegree: number;
  zodiacOrder: string[];
  dayOfYear: number;
  showTropical: boolean;
  showSidereal: boolean;
}

const size = 420;
const center = size / 2;
const customRadius = 150;
const tropicalRadius = 118;
const siderealRadius = 86;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angle = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function describeArc(radius: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(center, center, radius, endAngle);
  const end = polarToCartesian(center, center, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export function OrbitWheel({
  degree,
  tropicalDegree,
  siderealDegree,
  zodiacOrder,
  dayOfYear,
  showTropical,
  showSidereal
}: OrbitWheelProps) {
  const customMarker = polarToCartesian(center, center, customRadius, degree);
  const tropicalMarker = polarToCartesian(center, center, tropicalRadius, tropicalDegree);
  const siderealMarker = polarToCartesian(center, center, siderealRadius, siderealDegree);

  return (
    <section className="panel orbit-panel">
      <h2>Orbit Wheel Comparison</h2>
      <svg viewBox={`0 0 ${size} ${size}`} className="orbit-svg" role="img" aria-label="Perihelion orbit comparison wheel">
        <circle cx={center} cy={center} r={customRadius + 30} className="orbit-backdrop" />

        {zodiacOrder.map((sign, index) => {
          const start = index * 30;
          const end = start + 30;
          const mid = start + 15;
          const labelPoint = polarToCartesian(center, center, customRadius + 28, mid);
          const dayStart = index * DAYS_PER_MONTH + 1;
          const dayEnd = dayStart + DAYS_PER_MONTH - 1;

          return (
            <g key={`${sign}-${index}`}>
              <path d={describeArc(customRadius, start, end)} className="orbit-segment orbit-segment-custom" />
              <line
                x1={center}
                y1={center}
                x2={polarToCartesian(center, center, customRadius + 16, start).x}
                y2={polarToCartesian(center, center, customRadius + 16, start).y}
                className="orbit-divider"
              />
              <text x={labelPoint.x} y={labelPoint.y} textAnchor="middle" dominantBaseline="middle" className="orbit-label">
                {sign}
              </text>
              <title>{`${sign} | ${start}°-${end}° | Month ${index + 1} | Days ${dayStart}-${dayEnd}`}</title>
            </g>
          );
        })}

        {showTropical && (
          <g>
            {TROPICAL_ZODIAC_ORDER.map((sign, index) => {
              const start = index * 30;
              const end = start + 30;
              const labelPoint = polarToCartesian(center, center, tropicalRadius - 16, start + 15);
              return (
                <g key={`tropical-${sign}`}>
                  <path d={describeArc(tropicalRadius, start, end)} className="orbit-segment orbit-segment-tropical" />
                  <text
                    x={labelPoint.x}
                    y={labelPoint.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="orbit-label tropical-label"
                  >
                    {sign.slice(0, 3)}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {showSidereal && (
          <g>
            {TROPICAL_ZODIAC_ORDER.map((sign, index) => {
              const start = index * 30;
              const end = start + 30;
              return <path key={`sidereal-${sign}`} d={describeArc(siderealRadius, start, end)} className="orbit-segment orbit-segment-sidereal" />;
            })}
          </g>
        )}

        <circle cx={center} cy={center} r={5} className="perihelion-dot" />
        <text x={center} y={center - 14} textAnchor="middle" className="perihelion-label">
          Perihelion anchor 0°
        </text>

        <line x1={center} y1={center} x2={customMarker.x} y2={customMarker.y} className="marker-line" />
        <circle cx={customMarker.x} cy={customMarker.y} r={8} className="marker-dot marker-dot-custom" />

        {showTropical && <circle cx={tropicalMarker.x} cy={tropicalMarker.y} r={5} className="marker-dot marker-dot-tropical" />}
        {showSidereal && <circle cx={siderealMarker.x} cy={siderealMarker.y} r={5} className="marker-dot marker-dot-sidereal" />}
      </svg>
      <div className="orbit-meta">
        <p>Perihelion day: {dayOfYear} / {CUSTOM_YEAR_DAYS}</p>
        <p>
          Degrees — Perihelion: {degree.toFixed(2)}° • Tropical: {tropicalDegree.toFixed(2)}° • Sidereal:{' '}
          {siderealDegree.toFixed(2)}°
        </p>
      </div>
    </section>
  );
}
