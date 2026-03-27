import {
  ANOMALISTIC_YEAR_DAYS,
  CUSTOM_DAY_SECONDS,
  SIDEREAL_YEAR_DAYS,
  TROPICAL_YEAR_DAYS,
  CustomDateParts,
  ZodiacPosition,
  formatDateTime,
  formatDuration
} from '../utils/calendarMath';

interface DetailInspectorProps {
  selectedDate: Date;
  custom: CustomDateParts;
  tropical: ZodiacPosition;
  sidereal: ZodiacPosition;
}

export function DetailInspector({ selectedDate, custom, tropical, sidereal }: DetailInspectorProps) {
  const deltaTropical = ((custom.degree - tropical.degree + 540) % 360) - 180;

  return (
    <section className="panel">
      <h2>Detail Inspector</h2>
      <div className="two-col">
        <div>
          <ul className="metric-list">
            <li>Gregorian date/time: {formatDateTime(selectedDate)}</li>
            <li>Perihelion year day: {custom.dayOfYear}/360</li>
            <li>Custom month/day: {custom.month}/{custom.dayOfMonth}</li>
            <li>Custom zodiac sign: {custom.sign}</li>
            <li>Orbital degree (360 model): {custom.degree.toFixed(4)}°</li>
            <li>Anomalistic-year fraction elapsed: {(custom.fractionElapsed * 100).toFixed(5)}%</li>
            <li>Time until next perihelion: {formatDuration(custom.untilNextPerihelionMs)}</li>
          </ul>
        </div>

        <div>
          <ul className="metric-list">
            <li>
              Tropical reference: {tropical.sign} {tropical.degreeInSign.toFixed(2)}° ({tropical.degree.toFixed(2)}° total)
            </li>
            <li>
              Sidereal reference: {sidereal.sign} {sidereal.degreeInSign.toFixed(2)}° ({sidereal.degree.toFixed(2)}° total)
            </li>
            <li>
              Perihelion vs tropical offset: {deltaTropical >= 0 ? '+' : ''}
              {deltaTropical.toFixed(2)}°
            </li>
            <li>Model custom day length: {(CUSTOM_DAY_SECONDS / 3600).toFixed(6)} h</li>
            <li>Anomalistic model year: {ANOMALISTIC_YEAR_DAYS.toFixed(6)} days</li>
            <li>Tropical year reference: {TROPICAL_YEAR_DAYS.toFixed(6)} days</li>
            <li>Sidereal year reference: {SIDEREAL_YEAR_DAYS.toFixed(6)} days</li>
          </ul>
        </div>
      </div>
      <p className="inspector-note">
        Comparison note: your custom model is anchored to perihelion and equal 30° zodiac months, while tropical framing
        is anchored to seasonal equinoxes.
      </p>
    </section>
  );
}
