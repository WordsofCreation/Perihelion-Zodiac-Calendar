import { useEffect, useMemo, useState } from 'react';
import { AboutPanel } from './components/AboutPanel';
import { ComparisonPanel } from './components/ComparisonPanel';
import { ConversionPanel } from './components/ConversionPanel';
import { DetailInspector } from './components/DetailInspector';
import { MonthSignTable } from './components/MonthSignTable';
import { OrbitWheel } from './components/OrbitWheel';
import { TimeSystemPanel } from './components/TimeSystemPanel';
import { TimelineScrubber } from './components/TimelineScrubber';
import { DEFAULT_PRESET_YEAR, PERIHELION_PRESETS, findPresetByYear } from './data/perihelionPresets';
import { DEFAULT_CUSTOM_ZODIAC_ORDER } from './data/zodiac';
import { CalendarConfig, gregorianToCustom, gregorianToSidereal, gregorianToTropical, normalizeZodiacOrder } from './utils/calendarMath';

type ComparisonState = Record<'perihelion' | 'tropical' | 'sidereal' | 'gregorian', boolean>;

export default function App() {
  const defaultPreset = findPresetByYear(DEFAULT_PRESET_YEAR) ?? PERIHELION_PRESETS[0];

  const [selectedYear, setSelectedYear] = useState(defaultPreset.year);
  const [manualOverride, setManualOverride] = useState(false);
  const [perihelionIso, setPerihelionIso] = useState(defaultPreset.iso);
  const [zodiacRaw, setZodiacRaw] = useState(DEFAULT_CUSTOM_ZODIAC_ORDER.join(', '));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sliderDay, setSliderDay] = useState(0);
  const [comparison, setComparison] = useState<ComparisonState>({
    perihelion: true,
    tropical: true,
    sidereal: true,
    gregorian: true
  });

  useEffect(() => {
    if (manualOverride) {
      return;
    }
    const preset = findPresetByYear(selectedYear);
    if (preset) {
      setPerihelionIso(preset.iso);
    }
  }, [selectedYear, manualOverride]);

  const config: CalendarConfig = useMemo(
    () => ({
      perihelionIso,
      zodiacOrder: normalizeZodiacOrder(zodiacRaw)
    }),
    [perihelionIso, zodiacRaw]
  );

  const custom = useMemo(() => gregorianToCustom(selectedDate, config), [selectedDate, config]);
  const tropical = useMemo(() => gregorianToTropical(selectedDate), [selectedDate]);
  const sidereal = useMemo(() => gregorianToSidereal(selectedDate), [selectedDate]);

  useEffect(() => {
    setSliderDay(custom.fractionElapsed * 360);
  }, [custom.fractionElapsed]);

  return (
    <main className="app-shell">
      <header>
        <h1>Perihelion Zodiac Calendar • Phase 2</h1>
        <p>
          A perihelion-anchored exploratory instrument comparing a custom 360-day calendar with tropical, sidereal,
          and Gregorian frames.
        </p>
      </header>

      <section className="panel">
        <h2>Settings & Year Anchors</h2>
        <div className="two-col">
          <label>
            Perihelion preset year
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
              {PERIHELION_PRESETS.map((preset) => (
                <option key={preset.year} value={preset.year}>
                  {preset.label}
                </option>
              ))}
            </select>
          </label>

          <label className="toggle-label inline-setting">
            <input type="checkbox" checked={manualOverride} onChange={(e) => setManualOverride(e.target.checked)} />
            Manual perihelion override
          </label>

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

      <ComparisonPanel
        selectedDate={selectedDate}
        custom={custom}
        tropical={tropical}
        sidereal={sidereal}
        showLayer={comparison}
        onToggleLayer={(key, checked) => setComparison((prev) => ({ ...prev, [key]: checked }))}
      />

      <OrbitWheel
        degree={custom.degree}
        tropicalDegree={tropical.degree}
        siderealDegree={sidereal.degree}
        zodiacOrder={config.zodiacOrder}
        dayOfYear={custom.dayOfYear}
        showTropical={comparison.tropical}
        showSidereal={comparison.sidereal}
      />

      <TimelineScrubber sliderDay={sliderDay} onSliderDay={setSliderDay} config={config} onSelectedDateChange={setSelectedDate} />
      <DetailInspector selectedDate={selectedDate} custom={custom} tropical={tropical} sidereal={sidereal} />
      <MonthSignTable config={config} activeMonth={custom.month} />
      <ConversionPanel config={config} selectedDate={selectedDate} onSelectedDateChange={setSelectedDate} />
      <TimeSystemPanel />
      <AboutPanel />
    </main>
  );
}
