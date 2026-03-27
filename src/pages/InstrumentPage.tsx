import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_PRESET_YEAR, PERIHELION_PRESETS, findPresetByYear } from '../data/perihelion/anchors';
import { ARIES_START_EXPERIMENTAL_ORDER, DEFAULT_CUSTOM_ZODIAC_ORDER } from '../data/zodiac/equalSigns';
import {
  ANOMALISTIC_YEAR_DAYS,
  CalendarConfig,
  CUSTOM_DAY_SECONDS,
  CUSTOM_YEAR_DAYS,
  DAYS_PER_MONTH,
  EXTRA_DAY_SECONDS,
  EXTRA_SECONDS_PER_HOUR,
  SIDEREAL_YEAR_DAYS,
  TROPICAL_YEAR_DAYS,
  createAstronomySnapshot,
  customToGregorian,
  formatDuration,
  gregorianToCustom,
  normalizeZodiacOrder
} from '../utils/calendarMath';

type TabKey =
  | 'dashboard'
  | 'clock'
  | 'calendar'
  | 'converter'
  | 'astronomical'
  | 'formulas'
  | 'settings';

type CalendarView = 'list' | 'grid';
type SignOrderMode = 'capricorn' | 'aries' | 'custom';

const STORAGE_KEY = 'perihelion.instrument.settings.v1';

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'clock', label: 'Clock' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'converter', label: 'Converter' },
  { key: 'astronomical', label: 'Astronomical Considerations' },
  { key: 'formulas', label: 'Formulas / Assumptions' },
  { key: 'settings', label: 'Settings' }
];

function toLocalInputValue(date: Date): string {
  const offsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function formatClock(secondsInDay: number): string {
  const total = Math.max(0, Math.min(86_399, Math.floor(secondsInDay)));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function getAnchorContext(date: Date) {
  const sorted = [...PERIHELION_PRESETS].sort((a, b) => Date.parse(a.iso) - Date.parse(b.iso));
  const target = date.getTime();

  let last = sorted[0];
  let next = sorted[sorted.length - 1];

  for (let index = 0; index < sorted.length; index += 1) {
    const current = sorted[index];
    const currentMs = Date.parse(current.iso);
    if (currentMs <= target) {
      last = current;
    }
    if (currentMs > target) {
      next = current;
      break;
    }
  }

  if (Date.parse(next.iso) <= target) {
    next = sorted[0];
  }

  return { last, next };
}

export default function InstrumentPage() {
  const stored = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<{
        selectedYear: number;
        perihelionIso: string;
        manualOverride: boolean;
        signMode: SignOrderMode;
        zodiacRaw: string;
        tab: TabKey;
      }>;
    } catch {
      return {};
    }
  }, []);

  const [tab, setTab] = useState<TabKey>(stored.tab ?? 'dashboard');
  const [liveNow, setLiveNow] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(stored.selectedYear ?? DEFAULT_PRESET_YEAR);
  const [manualOverride, setManualOverride] = useState(Boolean(stored.manualOverride));
  const [perihelionIso, setPerihelionIso] = useState(stored.perihelionIso ?? findPresetByYear(DEFAULT_PRESET_YEAR)?.iso ?? PERIHELION_PRESETS[0].iso);
  const [signMode, setSignMode] = useState<SignOrderMode>(stored.signMode ?? 'capricorn');
  const [zodiacRaw, setZodiacRaw] = useState(stored.zodiacRaw ?? DEFAULT_CUSTOM_ZODIAC_ORDER.join(', '));
  const [calendarView, setCalendarView] = useState<CalendarView>('list');
  const [reverseMonth, setReverseMonth] = useState(1);
  const [reverseDay, setReverseDay] = useState(1);
  const [reverseFraction, setReverseFraction] = useState(0);

  useEffect(() => {
    if (!liveNow) return;
    const timer = window.setInterval(() => setSelectedDate(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, [liveNow]);

  useEffect(() => {
    if (!manualOverride) {
      const preset = findPresetByYear(selectedYear);
      if (preset) setPerihelionIso(preset.iso);
    }
  }, [manualOverride, selectedYear]);

  useEffect(() => {
    const payload = { selectedYear, perihelionIso, manualOverride, signMode, zodiacRaw, tab };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [selectedYear, perihelionIso, manualOverride, signMode, zodiacRaw, tab]);

  const zodiacOrder = useMemo(() => {
    if (signMode === 'aries') return ARIES_START_EXPERIMENTAL_ORDER;
    if (signMode === 'custom') return normalizeZodiacOrder(zodiacRaw);
    return DEFAULT_CUSTOM_ZODIAC_ORDER;
  }, [signMode, zodiacRaw]);

  const config: CalendarConfig = useMemo(() => ({ perihelionIso, zodiacOrder }), [perihelionIso, zodiacOrder]);
  const snapshot = useMemo(() => createAstronomySnapshot(selectedDate, config, 'equal'), [selectedDate, config]);
  const custom = snapshot.custom;
  const dayFraction = (custom.fractionElapsed * CUSTOM_YEAR_DAYS) % 1;
  const customSeconds = dayFraction * 24 * 3600;
  const reverseDate = customToGregorian(reverseMonth, reverseDay, reverseFraction, config);

  const monthRows = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => {
        const month = index + 1;
        const startDay = index * DAYS_PER_MONTH + 1;
        const endDay = startDay + DAYS_PER_MONTH - 1;
        const degreeStart = index * 30;
        const degreeEnd = degreeStart + 30;
        return {
          month,
          sign: zodiacOrder[index],
          dayRange: `${startDay}–${endDay}`,
          degreeRange: `${degreeStart}°–${degreeEnd}°`,
          startGregorian: customToGregorian(month, 1, 0, config),
          endGregorian: customToGregorian(month, DAYS_PER_MONTH, 0.99999, config)
        };
      }),
    [config, zodiacOrder]
  );

  const anchors = getAnchorContext(selectedDate);

  return (
    <div className="app-shell instrument-shell">
      <section className="panel hero-panel">
        <p className="eyebrow">Perihelion Zodiac Calendar • Data Instrument</p>
        <h1>Perihelion Calendar & Time System</h1>
        <p>
          A clean, data-first model where each custom year starts at perihelion and one anomalistic cycle is partitioned into
          360 equal custom days across 12 equal zodiac months.
        </p>
      </section>

      <section className="panel tab-row">
        {TABS.map((item) => (
          <button key={item.key} className={`mode-btn ${tab === item.key ? 'active' : ''}`} onClick={() => setTab(item.key)}>
            {item.label}
          </button>
        ))}
      </section>

      {tab === 'dashboard' && (
        <section className="panel">
          <h2>Year Summary Dashboard</h2>
          <div className="comparison-grid">
            <article className="comparison-card"><h3>Active perihelion anchor</h3><p>{perihelionIso}</p></article>
            <article className="comparison-card"><h3>Current custom day</h3><p>{custom.dayOfYear} / 360</p></article>
            <article className="comparison-card"><h3>Current month / sign</h3><p>{custom.month} • {custom.sign}</p></article>
            <article className="comparison-card"><h3>Orbital degree</h3><p>{custom.degree.toFixed(3)}°</p></article>
            <article className="comparison-card"><h3>Anomalistic year fraction</h3><p>{(custom.fractionElapsed * 100).toFixed(4)}%</p></article>
            <article className="comparison-card"><h3>Next perihelion countdown</h3><p>{formatDuration(custom.untilNextPerihelionMs)}</p></article>
            <article className="comparison-card"><h3>Next aphelion marker</h3><p>Custom day 180 ({customToGregorian(6, 30, 0, config).toUTCString()})</p></article>
            <article className="comparison-card"><h3>Selected year preset</h3><p>{selectedYear}</p></article>
            <article className="comparison-card"><h3>System modes</h3><p>Mean-time model • {signMode} sign order</p></article>
          </div>
        </section>
      )}

      {tab === 'clock' && (
        <section className="panel">
          <h2>Custom Clock</h2>
          <p className="inspector-note">This clock is a designed mean-time system derived from anomalistic year averages.</p>
          <div className="two-col">
            <div className="clock-card">
              <h3>Perihelion Time (live)</h3>
              <p className="clock-face">{formatClock(customSeconds)}</p>
              <ul className="metric-list">
                <li>Custom day number: {custom.dayOfYear}</li>
                <li>Custom month: {custom.month}</li>
                <li>Zodiac sign: {custom.sign}</li>
                <li>Elapsed since last perihelion: {formatDuration(custom.elapsedMs)}</li>
                <li>Remaining until next perihelion: {formatDuration(custom.untilNextPerihelionMs)}</li>
              </ul>
            </div>
            <div className="clock-card">
              <h3>Gregorian Comparison</h3>
              <p className="clock-face">{selectedDate.toLocaleTimeString()}</p>
              <ul className="metric-list">
                <li>Gregorian date/time: {selectedDate.toString()}</li>
                <li>Last preset anchor: {anchors.last.label}</li>
                <li>Next preset anchor: {anchors.next.label}</li>
              </ul>
            </div>
          </div>
          <div className="two-col">
            <label className="toggle-label inline-setting">
              <input type="checkbox" checked={liveNow} onChange={(event) => setLiveNow(event.target.checked)} />
              Live now mode
            </label>
            <label>
              Selected Gregorian timestamp
              <input
                type="datetime-local"
                value={toLocalInputValue(selectedDate)}
                onChange={(event) => {
                  setLiveNow(false);
                  setSelectedDate(new Date(event.target.value));
                }}
              />
            </label>
          </div>
        </section>
      )}

      {tab === 'calendar' && (
        <section className="panel">
          <h2>Custom Calendar (360-day year)</h2>
          <div className="quick-jumps">
            <button onClick={() => setCalendarView('list')} className={calendarView === 'list' ? 'mode-btn active' : 'mode-btn'}>List view</button>
            <button onClick={() => setCalendarView('grid')} className={calendarView === 'grid' ? 'mode-btn active' : 'mode-btn'}>Grid view</button>
          </div>

          {calendarView === 'list' && (
            <div className="table-wrap">
              <table className="compare-table month-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Sign</th>
                    <th>Custom day range</th>
                    <th>Gregorian start</th>
                    <th>Gregorian end</th>
                  </tr>
                </thead>
                <tbody>
                  {monthRows.map((row) => (
                    <tr key={row.month} className={custom.month === row.month ? 'active-row' : ''}>
                      <td>{row.month}</td>
                      <td>{row.sign}</td>
                      <td>{row.dayRange}</td>
                      <td>{row.startGregorian.toUTCString()}</td>
                      <td>{row.endGregorian.toUTCString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {calendarView === 'grid' && (
            <div className="calendar-grid">
              {monthRows.map((row) => (
                <article key={row.month} className={`comparison-card ${custom.month === row.month ? 'active-row' : ''}`}>
                  <h3>{row.month}. {row.sign}</h3>
                  <p>{row.dayRange} • {row.degreeRange}</p>
                  <small>{row.startGregorian.toLocaleDateString()} → {row.endGregorian.toLocaleDateString()}</small>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {tab === 'converter' && (
        <section className="panel">
          <h2>Gregorian ↔ Perihelion Converter</h2>
          <div className="two-col">
            <div>
              <h3>Gregorian to perihelion system</h3>
              <label>
                Gregorian date/time
                <input type="datetime-local" value={toLocalInputValue(selectedDate)} onChange={(e) => {
                  setLiveNow(false);
                  setSelectedDate(new Date(e.target.value));
                }} />
              </label>
              <ul className="metric-list">
                <li>Custom year day: {custom.dayOfYear}</li>
                <li>Custom month/sign: {custom.month} / {custom.sign}</li>
                <li>Custom clock time: {formatClock(customSeconds)}</li>
                <li>Orbital degree (360 model): {custom.degree.toFixed(5)}°</li>
                <li>Fraction elapsed: {(custom.fractionElapsed * 100).toFixed(5)}%</li>
                <li>Time since perihelion: {formatDuration(custom.elapsedMs)}</li>
                <li>Time until next perihelion: {formatDuration(custom.untilNextPerihelionMs)}</li>
              </ul>
            </div>

            <div>
              <h3>Perihelion system to Gregorian (approx)</h3>
              <label>Custom month <input type="number" min={1} max={12} value={reverseMonth} onChange={(e) => setReverseMonth(Number(e.target.value))} /></label>
              <label>Custom day <input type="number" min={1} max={30} value={reverseDay} onChange={(e) => setReverseDay(Number(e.target.value))} /></label>
              <label>Fraction of custom day <input type="number" min={0} max={0.999999} step={0.01} value={reverseFraction} onChange={(e) => setReverseFraction(Number(e.target.value))} /></label>
              <ul className="metric-list">
                <li>Approx Gregorian equivalent: {reverseDate.toUTCString()}</li>
                <li>Approx standard-time equivalent: {reverseDate.toLocaleString()}</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {tab === 'astronomical' && (
        <section className="panel">
          <h2>Astronomical Considerations</h2>
          <div className="comparison-grid">
            <article className="comparison-card"><h3>Perihelion</h3><p>Earth's minimum Sun distance; this app uses it as year-start anchor.</p></article>
            <article className="comparison-card"><h3>Aphelion</h3><p>Earth's maximum Sun distance; shown as a reference midpoint marker.</p></article>
            <article className="comparison-card"><h3>Anomalistic year</h3><p>{ANOMALISTIC_YEAR_DAYS.toFixed(6)} mean days (perihelion-to-perihelion).</p></article>
            <article className="comparison-card"><h3>Sidereal year</h3><p>{SIDEREAL_YEAR_DAYS.toFixed(6)} mean days (fixed stars reference).</p></article>
            <article className="comparison-card"><h3>Tropical year</h3><p>{TROPICAL_YEAR_DAYS.toFixed(6)} mean days (seasonal/equinox reference).</p></article>
            <article className="comparison-card"><h3>Why anomalistic</h3><p>The system is explicitly perihelion-anchored, so anomalistic timing governs the model.</p></article>
            <article className="comparison-card"><h3>Year-start difference</h3><p>Perihelion-based starts differ from sidereal/tropical starts because anchors are physically different.</p></article>
            <article className="comparison-card"><h3>Orbital-speed variation</h3><p>True orbital speed varies through the year; this interface uses mean values.</p></article>
            <article className="comparison-card"><h3>Interpretive scope</h3><p>This is a mathematical calendar/time instrument, not a civil-time replacement standard.</p></article>
          </div>
        </section>
      )}

      {tab === 'formulas' && (
        <section className="panel">
          <h2>Formulas / System Logic</h2>
          <details open>
            <summary>Core formulas</summary>
            <ul className="metric-list">
              <li>Anomalistic year ÷ 360 = custom day length.</li>
              <li>Custom day = {CUSTOM_DAY_SECONDS.toFixed(2)}s ≈ 24h 21m 2.31s.</li>
              <li>Extra time beyond 24h = {EXTRA_DAY_SECONDS.toFixed(5)}s per custom day.</li>
              <li>Extra time per civil hour = {EXTRA_SECONDS_PER_HOUR.toFixed(5)}s.</li>
              <li>12 months × 30 days = 360 custom days.</li>
              <li>Zodiac assignment logic: month index maps directly to selected sign order.</li>
            </ul>
          </details>
          <details>
            <summary>Mean values and limitations</summary>
            <ul className="metric-list">
              <li>Uses mean year lengths for consistency and readability.</li>
              <li>Does not integrate daily orbital eccentricity changes as ephemeris software does.</li>
              <li>Designed for transparency and comparison, not legal/civil timekeeping.</li>
            </ul>
          </details>
        </section>
      )}

      {tab === 'settings' && (
        <section className="panel">
          <h2>Year Presets & Settings</h2>
          <div className="two-col">
            <label>
              Select perihelion anchor year
              <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                {PERIHELION_PRESETS.map((preset) => (
                  <option key={preset.year} value={preset.year}>{preset.label}</option>
                ))}
              </select>
            </label>
            <label className="toggle-label inline-setting">
              <input type="checkbox" checked={manualOverride} onChange={(e) => setManualOverride(e.target.checked)} />
              Manual perihelion override
            </label>
            <label>
              Perihelion override timestamp (UTC ISO)
              <input value={perihelionIso} onChange={(e) => setPerihelionIso(e.target.value)} />
            </label>
            <label>
              Zodiac order mode
              <select value={signMode} onChange={(e) => setSignMode(e.target.value as SignOrderMode)}>
                <option value="capricorn">Capricorn-start default</option>
                <option value="aries">Aries-start experimental</option>
                <option value="custom">Custom sequence</option>
              </select>
            </label>
            <label>
              Custom zodiac order (12 comma-separated)
              <textarea value={zodiacRaw} onChange={(e) => setZodiacRaw(e.target.value)} rows={3} />
            </label>
          </div>
          <div className="quick-jumps">
            <button onClick={() => {
              setSelectedYear(DEFAULT_PRESET_YEAR);
              setManualOverride(false);
              setPerihelionIso(findPresetByYear(DEFAULT_PRESET_YEAR)?.iso ?? PERIHELION_PRESETS[0].iso);
              setSignMode('capricorn');
              setZodiacRaw(DEFAULT_CUSTOM_ZODIAC_ORDER.join(', '));
            }}>Reset to default model</button>
          </div>

          <h3>Month and Sign Reference Table</h3>
          <div className="table-wrap">
            <table className="compare-table month-table">
              <thead>
                <tr>
                  <th>Month #</th>
                  <th>Zodiac sign</th>
                  <th>Custom day range</th>
                  <th>Degree range</th>
                  <th>Approx Gregorian start</th>
                  <th>Approx Gregorian end</th>
                </tr>
              </thead>
              <tbody>
                {monthRows.map((row) => (
                  <tr key={row.month} className={custom.month === row.month ? 'active-row' : ''}>
                    <td>{row.month}</td>
                    <td>{row.sign}</td>
                    <td>{row.dayRange}</td>
                    <td>{row.degreeRange}</td>
                    <td>{row.startGregorian.toUTCString()}</td>
                    <td>{row.endGregorian.toUTCString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
