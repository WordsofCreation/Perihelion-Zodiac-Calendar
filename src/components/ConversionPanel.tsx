import { FormEvent, useMemo, useState } from 'react';
import {
  CalendarConfig,
  CUSTOM_YEAR_DAYS,
  customToGregorian,
  formatDateTime,
  formatDuration,
  gregorianToCustom
} from '../utils/calendarMath';

interface ConversionPanelProps {
  config: CalendarConfig;
  selectedDate: Date;
  onSelectedDateChange: (date: Date) => void;
}

function toLocalInputValue(date: Date): string {
  const offsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export function ConversionPanel({ config, selectedDate, onSelectedDateChange }: ConversionPanelProps) {
  const [reverseMonth, setReverseMonth] = useState(1);
  const [reverseDay, setReverseDay] = useState(1);
  const [reverseFraction, setReverseFraction] = useState(0);

  const custom = useMemo(() => gregorianToCustom(selectedDate, config), [selectedDate, config]);
  const reverseDate = customToGregorian(reverseMonth, reverseDay, reverseFraction, config);

  const onReverseSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSelectedDateChange(reverseDate);
  };

  return (
    <section className="panel">
      <h2>Calendar Conversion</h2>
      <div className="two-col">
        <div>
          <h3>Gregorian → Perihelion</h3>
          <label>
            Gregorian date/time
            <input
              type="datetime-local"
              value={toLocalInputValue(selectedDate)}
              onChange={(e) => onSelectedDateChange(new Date(e.target.value))}
            />
          </label>
          <ul className="metric-list">
            <li>Custom day number: {custom.dayOfYear} / {CUSTOM_YEAR_DAYS}</li>
            <li>Custom month/day: {custom.month} / {custom.dayOfMonth}</li>
            <li>Zodiac sign: {custom.sign}</li>
            <li>Orbital degree: {custom.degree.toFixed(3)}°</li>
            <li>Year elapsed: {(custom.fractionElapsed * 100).toFixed(3)}%</li>
            <li>Time since perihelion: {formatDuration(custom.elapsedMs)}</li>
            <li>Time until next perihelion: {formatDuration(custom.untilNextPerihelionMs)}</li>
          </ul>
        </div>

        <div>
          <h3>Perihelion → Gregorian (approx)</h3>
          <form onSubmit={onReverseSubmit} className="reverse-form">
            <label>
              Custom month
              <input type="number" min={1} max={12} value={reverseMonth} onChange={(e) => setReverseMonth(Number(e.target.value))} />
            </label>
            <label>
              Custom day (1-30)
              <input type="number" min={1} max={30} value={reverseDay} onChange={(e) => setReverseDay(Number(e.target.value))} />
            </label>
            <label>
              Fraction of custom day
              <input
                type="number"
                min={0}
                max={0.999999}
                step={0.01}
                value={reverseFraction}
                onChange={(e) => setReverseFraction(Number(e.target.value))}
              />
            </label>
            <button type="submit" className="primary-btn">Use as selected date</button>
          </form>
          <p>
            Output Gregorian timestamp: <strong>{formatDateTime(reverseDate)}</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
