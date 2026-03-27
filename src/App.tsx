import { useMemo, useState } from 'react';
import { ConversionPanel } from './components/ConversionPanel';
import { OrbitWheel } from './components/OrbitWheel';
import { TimeSystemPanel } from './components/TimeSystemPanel';
import { TimelineScrubber } from './components/TimelineScrubber';
import { CalendarConfig, DEFAULT_ZODIAC_ORDER, gregorianToCustom } from './utils/calendarMath';

const DEFAULT_PERIHELION = '2026-01-04T16:17:00Z';

function normalizeSigns(raw: string): string[] {
  const parsed = raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (parsed.length !== 12) {
    return DEFAULT_ZODIAC_ORDER;
  }

  return parsed;
}

export default function App() {
  const [perihelionIso, setPerihelionIso] = useState(DEFAULT_PERIHELION);
  const [zodiacRaw, setZodiacRaw] = useState(DEFAULT_ZODIAC_ORDER.join(', '));
  const [sliderDay, setSliderDay] = useState(0);
  const [comparison, setComparison] = useState({
    perihelion: true,
    tropical: false,
    sidereal: false,
    gregorian: true
  });

  const config: CalendarConfig = useMemo(
    () => ({
      perihelionIso,
      zodiacOrder: normalizeSigns(zodiacRaw)
    }),
    [perihelionIso, zodiacRaw]
  );

  const nowCustom = gregorianToCustom(new Date(), config);

  return (
    <main className="app-shell">
      <header>
        <h1>Perihelion Zodiac Calendar</h1>
        <p>
          A designed, perihelion-anchored model: 360 equal days, 12 zodiac months, and mean anomalistic timing.
        </p>
      </header>

      <section className="panel">
        <h2>Settings</h2>
        <div className="two-col">
          <label>
            Perihelion timestamp (UTC ISO)
            <input value={perihelionIso} onChange={(e) => setPerihelionIso(e.target.value)} />
          </label>
          <label>
            Zodiac order (comma-separated, exactly 12)
            <textarea value={zodiacRaw} onChange={(e) => setZodiacRaw(e.target.value)} rows={3} />
          </label>
        </div>
      </section>

      <OrbitWheel degree={nowCustom.degree} zodiacOrder={config.zodiacOrder} dayOfYear={nowCustom.dayOfYear} />
      <TimelineScrubber sliderDay={sliderDay} onSliderDay={setSliderDay} config={config} />
      <ConversionPanel config={config} />
      <TimeSystemPanel />

      <section className="panel">
        <h2>Comparison Toggles</h2>
        <div className="toggle-row">
          {(
            [
              ['perihelion', 'Perihelion calendar'],
              ['tropical', 'Tropical zodiac reference'],
              ['sidereal', 'Sidereal year reference'],
              ['gregorian', 'Gregorian date reference']
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="toggle-label">
              <input
                type="checkbox"
                checked={comparison[key]}
                onChange={(e) => setComparison((prev) => ({ ...prev, [key]: e.target.checked }))}
              />
              {label}
            </label>
          ))}
        </div>
        <ul className="metric-list">
          {comparison.perihelion && <li>Perihelion layer: active (0° begins at configured perihelion timestamp).</li>}
          {comparison.tropical && <li>Tropical layer: informational overlay only in v1.</li>}
          {comparison.sidereal && <li>Sidereal layer: informational overlay only in v1.</li>}
          {comparison.gregorian && <li>Gregorian layer: local date/time context displayed in all panels.</li>}
        </ul>
      </section>

      <section className="panel about">
        <h2>About this system</h2>
        <p>
          This visualization starts each custom year at perihelion, divides the orbit into 360 equal custom days, and
          groups them into 12 months of 30 days mapped to zodiac signs.
        </p>
        <p>
          The day length uses a mean anomalistic-year basis (24h 21m 2.31s) so Day 360 lands at the next perihelion in
          the conceptual model.
        </p>
      </section>
    </main>
  );
}
