import { AstronomySnapshot } from '../../lib/astronomy/types';
import { formatDateTime, formatDuration } from '../../lib/calendar/perihelionCalendar';

interface PrecisionInspectorPanelProps {
  snapshot: AstronomySnapshot;
}

export function PrecisionInspectorPanel({ snapshot }: PrecisionInspectorPanelProps) {
  return (
    <section className="panel">
      <h2>Precision Inspector</h2>
      <div className="two-col">
        <ul className="metric-list">
          <li>Gregorian timestamp: {formatDateTime(new Date(snapshot.gregorianTimestamp))}</li>
          <li>Active perihelion anchor: {snapshot.perihelionAnchor}</li>
          <li>Anomalistic elapsed fraction: {(snapshot.anomalistic.fractionElapsed * 100).toFixed(6)}%</li>
          <li>Custom day number: {snapshot.custom.dayOfYear} / 360</li>
          <li>Custom month/sign: M{snapshot.custom.month} • {snapshot.custom.sign}</li>
          <li>Equal-sign zodiac degree: {snapshot.custom.degree.toFixed(4)}°</li>
          <li>Tropical reference degree: {snapshot.tropical.degree.toFixed(4)}°</li>
          <li>Sidereal reference degree: {snapshot.sidereal.degree.toFixed(4)}°</li>
          {snapshot.constellation && <li>Constellation reference: {snapshot.constellation.label} ({snapshot.constellation.degreeInConstellation.toFixed(2)}° in span)</li>}
          <li>Time since perihelion anchor: {formatDuration(snapshot.custom.elapsedMs)}</li>
          <li>Time until next perihelion anchor: {formatDuration(snapshot.custom.untilNextPerihelionMs)}</li>
        </ul>
        <div>
          <h3>Precision / approximation notes</h3>
          <ul className="metric-list">
            {snapshot.approximationNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
