import { FormEvent, useState } from 'react';
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
}

export function ConversionPanel({ config }: ConversionPanelProps) {
  const nowIso = new Date().toISOString().slice(0, 16);
  const [gregorianInput, setGregorianInput] = useState(nowIso);
  const [reverseMonth, setReverseMonth] = useState(1);
  const [reverseDay, setReverseDay] = useState(1);
  const [reverseFraction, setReverseFraction] = useState(0);

  const gregorianDate = new Date(gregorianInput);
  const custom = gregorianToCustom(gregorianDate, config);
  const reverseDate = customToGregorian(reverseMonth, reverseDay, reverseFraction, config);

  const onReverseSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
              value={gregorianInput}
              onChange={(e) => setGregorianInput(e.target.value)}
            />
          </label>
          <ul className="metric-list">
            <li>Custom day number: {custom.dayOfYear} / {CUSTOM_YEAR_DAYS}</li>
            <li>Custom month: {custom.month}</li>
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
          </form>
          <p>Output Gregorian timestamp: <strong>{formatDateTime(reverseDate)}</strong></p>
        </div>
      </div>
    </section>
  );
}
