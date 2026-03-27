import { useEffect, useMemo, useState } from 'react';
import { AboutPanel } from './components/AboutPanel';
import { ComparisonPanel } from './components/ComparisonPanel';
import { ConversionPanel } from './components/ConversionPanel';
import { MonthSignTable } from './components/MonthSignTable';
import { TimelineScrubber } from './components/TimelineScrubber';
import { OrbitWheel } from './components/orbit/OrbitWheel';
import { ApsidalAwarenessPanel } from './components/panels/ApsidalAwarenessPanel';
import { ConstellationReferencePanel } from './components/panels/ConstellationReferencePanel';
import { FormulaDrawer } from './components/panels/FormulaDrawer';
import { PrecisionInspectorPanel } from './components/panels/PrecisionInspectorPanel';
import { DEFAULT_PRESET_YEAR, PERIHELION_PRESETS, findPresetByYear } from './data/perihelion/anchors';
import { DEFAULT_CUSTOM_ZODIAC_ORDER } from './data/zodiac/equalSigns';
import { CalendarConfig, ZodiacMode, createAstronomySnapshot, normalizeZodiacOrder, sliderToGregorian } from './utils/calendarMath';

type ComparisonState = Record<'perihelion' | 'tropical' | 'sidereal' | 'gregorian', boolean>;

export default function App() {
  const defaultPreset = findPresetByYear(DEFAULT_PRESET_YEAR) ?? PERIHELION_PRESETS[0];

  const [selectedYear, setSelectedYear] = useState(defaultPreset.year);
  const [manualOverride, setManualOverride] = useState(false);
  const [perihelionIso, setPerihelionIso] = useState(defaultPreset.iso);
  const [zodiacRaw, setZodiacRaw] = useState(DEFAULT_CUSTOM_ZODIAC_ORDER.join(', '));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sliderDay, setSliderDay] = useState(0);
  const [zodiacMode, setZodiacMode] = useState<ZodiacMode>('equal');
  const [isPlaying, setIsPlaying] = useState(false);
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

  const snapshot = useMemo(() => createAstronomySnapshot(selectedDate, config, zodiacMode), [selectedDate, config, zodiacMode]);

  useEffect(() => {
    setSliderDay(snapshot.custom.fractionElapsed * 360);
  }, [snapshot.custom.fractionElapsed]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = window.setInterval(() => {
      setSliderDay((prev) => {
        const next = (prev + 0.6) % 360;
        setSelectedDate(sliderToGregorian(next, config));
        return next;
      });
    }, 45);

    return () => window.clearInterval(timer);
  }, [isPlaying, config.perihelionIso]);

  return (
    <main className="app-shell">
      <header>
        <h1>Perihelion Zodiac Calendar • Phase 3</h1>
        <p>
          A perihelion-anchored astronomy explorer: custom 360-day primary calendar with anomalistic, tropical,
          sidereal, and optional real-sky constellation reference layers.
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
        custom={snapshot.custom}
        tropical={snapshot.tropical}
        sidereal={snapshot.sidereal}
        showLayer={comparison}
        onToggleLayer={(key, checked) => setComparison((prev) => ({ ...prev, [key]: checked }))}
      />

      <ConstellationReferencePanel mode={zodiacMode} onModeChange={setZodiacMode} activeLabel={snapshot.constellation?.label} />

      <OrbitWheel
        degree={snapshot.custom.degree}
        tropicalDegree={snapshot.tropical.degree}
        siderealDegree={snapshot.sidereal.degree}
        zodiacOrder={config.zodiacOrder}
        dayOfYear={snapshot.custom.dayOfYear}
        showTropical={comparison.tropical}
        showSidereal={comparison.sidereal}
        zodiacMode={zodiacMode}
        constellationLabel={snapshot.constellation?.label}
      />

      <TimelineScrubber
        sliderDay={sliderDay}
        onSliderDay={setSliderDay}
        config={config}
        onSelectedDateChange={setSelectedDate}
        isPlaying={isPlaying}
        onTogglePlaying={() => setIsPlaying((prev) => !prev)}
      />
      <PrecisionInspectorPanel snapshot={snapshot} />
      <ApsidalAwarenessPanel />
      <MonthSignTable config={config} activeMonth={snapshot.custom.month} />
      <ConversionPanel config={config} selectedDate={selectedDate} onSelectedDateChange={setSelectedDate} />
      <FormulaDrawer />
      <AboutPanel />
    </main>
  );
}
