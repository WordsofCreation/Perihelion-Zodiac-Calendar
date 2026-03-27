import { CONSTELLATION_SPANS } from '../../data/zodiac/constellations';
import { CUSTOM_YEAR_DAYS, DAYS_PER_MONTH } from '../../lib/astronomy/constants';
import { ZodiacMode } from '../../lib/astronomy/types';

interface OrbitWheelProps {
  degree: number;
  tropicalDegree: number;
  siderealDegree: number;
  zodiacOrder: string[];
  dayOfYear: number;
  showTropical: boolean;
  showSidereal: boolean;
  zodiacMode: ZodiacMode;
  constellationLabel?: string;
}

const size = 520;
const center = size / 2;
const customRadius = 190;
const tropicalRadius = 150;
const siderealRadius = 124;
const constellationRadius = 94;

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
  showSidereal,
  zodiacMode,
  constellationLabel
}: OrbitWheelProps) {
  const customMarker = polarToCartesian(center, center, customRadius, degree);
  const tropicalMarker = polarToCartesian(center, center, tropicalRadius, tropicalDegree);
  const siderealMarker = polarToCartesian(center, center, siderealRadius, siderealDegree);

  return (
    <section className="panel orbit-panel">
      <h2>Orbit Wheel • Presentation Mode</h2>
      <svg id="orbit-wheel-svg" viewBox={`0 0 ${size} ${size}`} className="orbit-svg" role="img" aria-label="Perihelion orbit comparison wheel">
        <defs>
          <radialGradient id="wheelGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1f3275" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0a1128" stopOpacity="0.95" />
          </radialGradient>
        </defs>

        <circle cx={center} cy={center} r={customRadius + 58} className="orbit-backdrop" />
        <circle cx={center} cy={center} r={customRadius + 34} fill="url(#wheelGlow)" />

        {zodiacOrder.map((sign, index) => {
          const start = index * 30;
          const end = start + 30;
          const mid = start + 15;
          const labelPoint = polarToCartesian(center, center, customRadius + 50, mid);
          const dayStart = index * DAYS_PER_MONTH + 1;
          const dayEnd = dayStart + DAYS_PER_MONTH - 1;

          return (
            <g key={`${sign}-${index}`}>
              <path d={describeArc(customRadius, start, end)} className="orbit-segment orbit-segment-custom" />
              <line
                x1={center}
                y1={center}
                x2={polarToCartesian(center, center, customRadius + 30, start).x}
                y2={polarToCartesian(center, center, customRadius + 30, start).y}
                className="orbit-divider"
              />
              <text x={labelPoint.x} y={labelPoint.y} textAnchor="middle" dominantBaseline="middle" className="orbit-label">
                {sign}
              </text>
              <title>{`${sign} | ${start}°-${end}° | Month ${index + 1} | Days ${dayStart}-${dayEnd}`}</title>
            </g>
          );
        })}

        {showTropical && Array.from({ length: 12 }).map((_, index) => (
          <path
            key={`tropical-${index}`}
            d={describeArc(tropicalRadius, index * 30, index * 30 + 30)}
            className="orbit-segment orbit-segment-tropical"
          />
        ))}

        {showSidereal && Array.from({ length: 12 }).map((_, index) => (
          <path
            key={`sidereal-${index}`}
            d={describeArc(siderealRadius, index * 30, index * 30 + 30)}
            className="orbit-segment orbit-segment-sidereal"
          />
        ))}

        {zodiacMode === 'constellation' && (
          <g>
            {CONSTELLATION_SPANS.map((span) => (
              <path
                key={span.name}
                d={describeArc(constellationRadius, span.startDeg, span.endDeg)}
                className="orbit-segment orbit-segment-constellation"
              >
                <title>{`${span.name}: ${span.startDeg}° to ${span.endDeg}°`}</title>
              </path>
            ))}
          </g>
        )}

        <circle cx={center} cy={center} r={6} className="perihelion-dot" />
        <text x={center} y={center - 18} textAnchor="middle" className="perihelion-label">
          Perihelion anchor 0°
        </text>

        <line x1={center} y1={center} x2={customMarker.x} y2={customMarker.y} className="marker-line" />
        <circle cx={customMarker.x} cy={customMarker.y} r={10} className="marker-dot marker-dot-custom" />

        {showTropical && <circle cx={tropicalMarker.x} cy={tropicalMarker.y} r={7} className="marker-dot marker-dot-tropical" />}
        {showSidereal && <circle cx={siderealMarker.x} cy={siderealMarker.y} r={7} className="marker-dot marker-dot-sidereal" />}
      </svg>
      <div className="orbit-meta">
        <p>Perihelion day: {dayOfYear} / {CUSTOM_YEAR_DAYS}</p>
        <p>
          Degrees — Perihelion: {degree.toFixed(2)}° • Tropical: {tropicalDegree.toFixed(2)}° • Sidereal: {siderealDegree.toFixed(2)}°
        </p>
        <p className="legend-text">
          Rings: outer = custom equal months, middle = tropical, inner = sidereal
          {zodiacMode === 'constellation' ? ', core = uneven constellation reference' : ''}.
        </p>
        {zodiacMode === 'constellation' && <p>Active constellation reference: <strong>{constellationLabel ?? '—'}</strong></p>}
      </div>
    </section>
  );
}
