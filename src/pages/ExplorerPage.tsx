import { useEffect, useMemo, useState } from 'react';
import { AboutPanel } from '../components/AboutPanel';
import { ComparisonPanel } from '../components/ComparisonPanel';
import { ConversionPanel } from '../components/ConversionPanel';
import { MonthSignTable } from '../components/MonthSignTable';
import { TimelineScrubber } from '../components/TimelineScrubber';
import { OrbitWheel } from '../components/orbit/OrbitWheel';
import { ApsidalAwarenessPanel } from '../components/panels/ApsidalAwarenessPanel';
import { ConstellationReferencePanel } from '../components/panels/ConstellationReferencePanel';
import { FormulaDrawer } from '../components/panels/FormulaDrawer';
import { PrecisionInspectorPanel } from '../components/panels/PrecisionInspectorPanel';
import { DEFAULT_PRESET_YEAR, PERIHELION_PRESETS, findPresetByYear } from '../data/perihelion/anchors';
import { DEFAULT_CUSTOM_ZODIAC_ORDER } from '../data/zodiac/equalSigns';
import {
  CalendarConfig,
  CUSTOM_YEAR_DAYS,
  ZodiacMode,
  createAstronomySnapshot,
  normalizeZodiacOrder,
  sliderToGregorian
} from '../utils/calendarMath';

type ComparisonKey = 'perihelion' | 'tropical' | 'sidereal' | 'gregorian';
type ComparisonState = Record<ComparisonKey, boolean>;
type TopSection = 'intro' | 'explorer' | 'about' | 'tools';
type ExplorerTab = 'overview' | 'narrative';

interface ScenarioPreset {
  id: string;
  name: string;
  builtIn?: boolean;
  selectedYear: number;
  manualOverride: boolean;
  perihelionIso: string;
  zodiacRaw: string;
  selectedDateIso: string;
  zodiacMode: ZodiacMode;
  comparison: ComparisonState;
}

const STORAGE_PRESETS_KEY = 'perihelion.phase5.presets';
const STORAGE_ENTERED_KEY = 'perihelion.phase5.entered';
const STORAGE_ONBOARDING_KEY = 'perihelion.phase5.onboarding.dismissed';

const defaultComparisonState: ComparisonState = {
  perihelion: true,
  tropical: true,
  sidereal: true,
  gregorian: true
};

const BUILT_IN_PRESETS: ScenarioPreset[] = [
  {
    id: 'builtin-default',
    name: 'Default Perihelion Model',
    builtIn: true,
    selectedYear: DEFAULT_PRESET_YEAR,
    manualOverride: false,
    perihelionIso: findPresetByYear(DEFAULT_PRESET_YEAR)?.iso ?? PERIHELION_PRESETS[0].iso,
    zodiacRaw: DEFAULT_CUSTOM_ZODIAC_ORDER.join(', '),
    selectedDateIso: new Date().toISOString(),
    zodiacMode: 'equal',
    comparison: defaultComparisonState
  },
  {
    id: 'builtin-capricorn',
    name: 'Capricorn Start System',
    builtIn: true,
    selectedYear: DEFAULT_PRESET_YEAR,
    manualOverride: false,
    perihelionIso: findPresetByYear(DEFAULT_PRESET_YEAR)?.iso ?? PERIHELION_PRESETS[0].iso,
    zodiacRaw: 'Capricorn, Aquarius, Pisces, Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius',
    selectedDateIso: new Date().toISOString(),
    zodiacMode: 'equal',
    comparison: defaultComparisonState
  },
  {
    id: 'builtin-aries',
    name: 'Aries Start Experimental Mode',
    builtIn: true,
    selectedYear: DEFAULT_PRESET_YEAR,
    manualOverride: false,
    perihelionIso: findPresetByYear(DEFAULT_PRESET_YEAR)?.iso ?? PERIHELION_PRESETS[0].iso,
    zodiacRaw: 'Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces',
    selectedDateIso: new Date().toISOString(),
    zodiacMode: 'constellation',
    comparison: defaultComparisonState
  },
  {
    id: 'builtin-comparison',
    name: 'Comparison View',
    builtIn: true,
    selectedYear: DEFAULT_PRESET_YEAR,
    manualOverride: false,
    perihelionIso: findPresetByYear(DEFAULT_PRESET_YEAR)?.iso ?? PERIHELION_PRESETS[0].iso,
    zodiacRaw: DEFAULT_CUSTOM_ZODIAC_ORDER.join(', '),
    selectedDateIso: new Date().toISOString(),
    zodiacMode: 'constellation',
    comparison: { perihelion: true, tropical: true, sidereal: true, gregorian: true }
  }
];

const sanitizeDate = (input: string | null | undefined, fallback = new Date()) => {
  if (!input) return fallback;
  const candidate = new Date(input);
  return Number.isNaN(candidate.getTime()) ? fallback : candidate;
};

function buildShareParams(state: {
  selectedDate: Date;
  selectedYear: number;
  manualOverride: boolean;
  perihelionIso: string;
  zodiacRaw: string;
  zodiacMode: ZodiacMode;
  comparison: ComparisonState;
  section: TopSection;
  explorerTab: ExplorerTab;
}) {
  const params = new URLSearchParams();
  params.set('dt', state.selectedDate.toISOString());
  params.set('py', String(state.selectedYear));
  params.set('mo', state.manualOverride ? '1' : '0');
  params.set('pa', state.perihelionIso);
  params.set('zo', state.zodiacRaw);
  params.set('zm', state.zodiacMode);
  params.set('cmp',
    (['perihelion', 'tropical', 'sidereal', 'gregorian'] as ComparisonKey[])
      .filter((k) => state.comparison[k])
      .join('|')
  );
  params.set('section', state.section);
  params.set('tab', state.explorerTab);
  return params;
}

function parseComparison(raw: string | null): ComparisonState {
  if (!raw) return defaultComparisonState;
  const enabled = new Set(raw.split('|'));
  return {
    perihelion: enabled.has('perihelion'),
    tropical: enabled.has('tropical'),
    sidereal: enabled.has('sidereal'),
    gregorian: enabled.has('gregorian')
  };
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function exportSvgNodeToPng(svgNode: SVGSVGElement, filename: string) {
  const xml = new XMLSerializer().serializeToString(svgNode);
  const svgBlob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const image = new Image();
  image.src = url;

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Could not load serialized SVG.'));
  });

  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1200;
  const context = canvas.getContext('2d');
  if (!context) {
    URL.revokeObjectURL(url);
    throw new Error('Canvas context unavailable.');
  }

  context.fillStyle = '#050a1a';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 60, 60, 1080, 1080);

  canvas.toBlob((blob) => {
    if (blob) {
      downloadBlob(filename, blob);
    }
  }, 'image/png');

  URL.revokeObjectURL(url);
}

export default function ExplorerPage() {
  const defaultPreset = findPresetByYear(DEFAULT_PRESET_YEAR) ?? PERIHELION_PRESETS[0];
  const searchParams = new URLSearchParams(window.location.search);

  const [selectedYear, setSelectedYear] = useState(Number(searchParams.get('py')) || defaultPreset.year);
  const [manualOverride, setManualOverride] = useState(searchParams.get('mo') === '1');
  const [perihelionIso, setPerihelionIso] = useState(searchParams.get('pa') || defaultPreset.iso);
  const [zodiacRaw, setZodiacRaw] = useState(searchParams.get('zo') || DEFAULT_CUSTOM_ZODIAC_ORDER.join(', '));
  const [selectedDate, setSelectedDate] = useState(sanitizeDate(searchParams.get('dt')));
  const [sliderDay, setSliderDay] = useState(0);
  const [zodiacMode, setZodiacMode] = useState<ZodiacMode>((searchParams.get('zm') as ZodiacMode) || 'equal');
  const [isPlaying, setIsPlaying] = useState(false);
  const [comparison, setComparison] = useState<ComparisonState>(parseComparison(searchParams.get('cmp')));
  const [section, setSection] = useState<TopSection>((searchParams.get('section') as TopSection) || 'intro');
  const [explorerTab, setExplorerTab] = useState<ExplorerTab>((searchParams.get('tab') as ExplorerTab) || 'overview');
  const [copyState, setCopyState] = useState('');
  const [savedPresets, setSavedPresets] = useState<ScenarioPreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState('builtin-default');
  const [showOnboarding, setShowOnboarding] = useState(localStorage.getItem(STORAGE_ONBOARDING_KEY) !== '1');

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_PRESETS_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as ScenarioPreset[];
      setSavedPresets(parsed);
    } catch {
      setSavedPresets([]);
    }
  }, []);

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

  useEffect(() => {
    const params = buildShareParams({
      selectedDate,
      selectedYear,
      manualOverride,
      perihelionIso,
      zodiacRaw,
      zodiacMode,
      comparison,
      section,
      explorerTab
    });

    const nextUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', nextUrl);
  }, [selectedDate, selectedYear, manualOverride, perihelionIso, zodiacRaw, zodiacMode, comparison, section, explorerTab]);

  const currentScenario: ScenarioPreset = {
    id: 'current',
    name: 'Current State',
    selectedYear,
    manualOverride,
    perihelionIso,
    zodiacRaw,
    selectedDateIso: selectedDate.toISOString(),
    zodiacMode,
    comparison
  };

  const allPresets = [...BUILT_IN_PRESETS, ...savedPresets];

  const applyPreset = (preset: ScenarioPreset) => {
    setSelectedYear(preset.selectedYear);
    setManualOverride(preset.manualOverride);
    setPerihelionIso(preset.perihelionIso);
    setZodiacRaw(preset.zodiacRaw);
    setSelectedDate(sanitizeDate(preset.selectedDateIso));
    setZodiacMode(preset.zodiacMode);
    setComparison(preset.comparison);
    setSection('explorer');
  };

  const narrative = useMemo(() => {
    const daysFromPerihelion = snapshot.custom.dayOfYear - 1;
    const daysToAphelion = Math.abs(snapshot.custom.dayOfYear - 180);
    return `On ${selectedDate.toUTCString()}, this model places Earth at day ${snapshot.custom.dayOfYear} (${snapshot.custom.sign} month) in a 360-day perihelion year. ` +
      `That corresponds to ${snapshot.custom.degree.toFixed(2)}° custom longitude, while tropical is ${snapshot.tropical.degree.toFixed(2)}° and sidereal is ${snapshot.sidereal.degree.toFixed(2)}°. ` +
      `You are ${daysFromPerihelion} custom days from perihelion and about ${daysToAphelion} custom days from aphelion midpoint. ` +
      `Reference mode is ${zodiacMode === 'equal' ? 'equal-sign symbolic segmentation' : `constellation overlay (${snapshot.constellation?.label ?? 'active span'})`} with ${Object.entries(comparison)
        .filter(([, enabled]) => enabled)
        .map(([key]) => key)
        .join(', ')} comparison layers visible.`;
  }, [selectedDate, snapshot, zodiacMode, comparison]);

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyState('Share link copied.');
    } catch {
      setCopyState('Could not access clipboard.');
    }
  };

  const savePreset = () => {
    const name = window.prompt('Name this scenario preset');
    if (!name) return;
    const created: ScenarioPreset = { ...currentScenario, id: `preset-${Date.now()}`, name };
    const next = [...savedPresets, created];
    setSavedPresets(next);
    localStorage.setItem(STORAGE_PRESETS_KEY, JSON.stringify(next));
    setSelectedPresetId(created.id);
  };

  const renamePreset = () => {
    const active = savedPresets.find((preset) => preset.id === selectedPresetId);
    if (!active) return;
    const name = window.prompt('Rename preset', active.name);
    if (!name) return;
    const next = savedPresets.map((preset) => (preset.id === active.id ? { ...preset, name } : preset));
    setSavedPresets(next);
    localStorage.setItem(STORAGE_PRESETS_KEY, JSON.stringify(next));
  };

  const deletePreset = () => {
    const active = savedPresets.find((preset) => preset.id === selectedPresetId);
    if (!active) return;
    if (!window.confirm(`Delete ${active.name}?`)) return;
    const next = savedPresets.filter((preset) => preset.id !== selectedPresetId);
    setSavedPresets(next);
    localStorage.setItem(STORAGE_PRESETS_KEY, JSON.stringify(next));
    setSelectedPresetId('builtin-default');
  };

  const exportWheel = async () => {
    const svg = document.getElementById('orbit-wheel-svg') as SVGSVGElement | null;
    if (!svg) return;
    await exportSvgNodeToPng(svg, `perihelion-wheel-${selectedDate.toISOString().slice(0, 10)}.png`);
  };

  const exportJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      shareUrl: window.location.href,
      state: currentScenario,
      snapshot
    };
    downloadBlob('perihelion-calendar-state.json', new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  };

  const exportCsv = () => {
    const lines = ['month,sign,degreeStart,degreeEnd,dayStart,dayEnd'];
    config.zodiacOrder.forEach((sign, index) => {
      const month = index + 1;
      lines.push(`${month},${sign},${index * 30},${index * 30 + 30},${index * 30 + 1},${index * 30 + 30}`);
    });
    downloadBlob('perihelion-month-sign-table.csv', new Blob([lines.join('\n')], { type: 'text/csv' }));
  };

  const exportPresentationCard = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 900;
    const context = canvas.getContext('2d');
    if (!context) return;

    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#091024');
    gradient.addColorStop(1, '#111f43');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#f1f5ff';
    context.font = '700 56px Inter, sans-serif';
    context.fillText('Perihelion Zodiac Calendar', 60, 100);

    context.font = '400 28px Inter, sans-serif';
    context.fillStyle = '#c4d3ff';
    context.fillText(`Snapshot: ${selectedDate.toUTCString()}`, 60, 160);
    context.fillText(`Perihelion day ${snapshot.custom.dayOfYear}/${CUSTOM_YEAR_DAYS} • ${snapshot.custom.sign}`, 60, 210);
    context.fillText(`Custom ${snapshot.custom.degree.toFixed(2)}° • Tropical ${snapshot.tropical.degree.toFixed(2)}° • Sidereal ${snapshot.sidereal.degree.toFixed(2)}°`, 60, 260);

    const svg = document.getElementById('orbit-wheel-svg') as SVGSVGElement | null;
    if (svg) {
      const xml = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const image = new Image();
      image.src = url;
      await new Promise<void>((resolve) => {
        image.onload = () => resolve();
        image.onerror = () => resolve();
      });
      context.drawImage(image, 900, 130, 620, 620);
      URL.revokeObjectURL(url);
    }

    context.fillStyle = '#d6e1ff';
    context.font = '400 24px Inter, sans-serif';
    const wrapped = narrative.match(/.{1,95}(\s|$)/g) ?? [narrative];
    wrapped.slice(0, 5).forEach((line, index) => context.fillText(line.trim(), 60, 340 + index * 42));

    canvas.toBlob((blob) => {
      if (blob) downloadBlob('perihelion-presentation-card.png', blob);
    }, 'image/png');
  };

  const quickJump = (target: 'today' | 'perihelion' | 'aphelion' | 'equinox') => {
    if (target === 'today') {
      setSelectedDate(new Date());
      return;
    }
    if (target === 'perihelion') {
      setSelectedDate(new Date(perihelionIso));
      return;
    }
    if (target === 'aphelion') {
      setSelectedDate(sliderToGregorian(180, config));
      return;
    }
    const year = selectedDate.getUTCFullYear();
    setSelectedDate(new Date(Date.UTC(year, 2, 20, 12, 0, 0)));
  };

  return (
    <div className="app-shell phase4-shell">
      <header className="hero-header panel">
        <div>
          <h1>Perihelion Zodiac Calendar • Explorer</h1>
          <p>
            Publish-ready explorer for a perihelion-anchored 360-day calendar with shareable state, saved scenarios,
            export tools, onboarding guidance, and narrative comparison framing.
          </p>
        </div>
        <div className="nav-actions">
          {(['intro', 'explorer', 'about', 'tools'] as TopSection[]).map((key) => (
            <button key={key} className={`mode-btn ${section === key ? 'active' : ''}`} onClick={() => setSection(key)}>
              {key === 'intro' ? 'Landing' : key === 'tools' ? 'Presets & Tools' : key[0].toUpperCase() + key.slice(1)}
            </button>
          ))}
          <button className="mode-btn" onClick={copyShareLink}>Copy Share Link</button>
        </div>
        {copyState && <p className="helper-note">{copyState}</p>}
      </header>

      {section === 'intro' && (
        <section className="panel landing-grid">
          <article>
            <h2>What this calendar is</h2>
            <p>
              The Perihelion Zodiac Calendar starts each custom year at Earth perihelion and divides one anomalistic cycle into 12
              equal 30-day zodiac months (360 total custom days).
            </p>
          </article>
          <article>
            <h2>Why this anchor matters</h2>
            <p>
              Perihelion is a physically meaningful orbital event. Anchoring there creates a consistent astronomical reset point that
              differs from equinox-based tropical framing.
            </p>
          </article>
          <article>
            <h2>Why days are longer</h2>
            <p>
              The model maps a ~365.2596-day anomalistic year into 360 equal custom days, so each custom day is slightly longer than
              24 hours.
            </p>
          </article>
          <article>
            <h2>Cross-system comparison</h2>
            <p>
              Explorer mode overlays tropical, sidereal, and optional constellation references so you can narrate agreement,
              divergence, and assumptions directly.
            </p>
          </article>
          <button
            type="button"
            className="primary-btn enter-btn"
            onClick={() => {
              localStorage.setItem(STORAGE_ENTERED_KEY, '1');
              setSection('explorer');
            }}
          >
            Enter Explorer
          </button>
        </section>
      )}

      {section === 'explorer' && (
        <>
          <section className="panel">
            <div className="mode-switch">
              <button className={`mode-btn ${explorerTab === 'overview' ? 'active' : ''}`} onClick={() => setExplorerTab('overview')}>Overview</button>
              <button className={`mode-btn ${explorerTab === 'narrative' ? 'active' : ''}`} onClick={() => setExplorerTab('narrative')}>Narrative Interpretation</button>
            </div>
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
            <div className="quick-jumps">
              <button onClick={() => quickJump('today')}>Start with today</button>
              <button onClick={() => quickJump('perihelion')}>Jump to perihelion</button>
              <button onClick={() => quickJump('equinox')}>Jump to equinox</button>
              <button onClick={() => quickJump('aphelion')}>Jump to aphelion midpoint</button>
            </div>
            {showOnboarding && (
              <div className="onboarding-card">
                <h3>How to read this wheel</h3>
                <ul>
                  <li>Outer ring: custom perihelion 12×30° zodiac segmentation.</li>
                  <li>Middle ring: tropical comparison; inner ring: sidereal comparison.</li>
                  <li>Enable constellation mode for uneven real-sky educational reference.</li>
                </ul>
                <button
                  className="mode-btn"
                  onClick={() => {
                    localStorage.setItem(STORAGE_ONBOARDING_KEY, '1');
                    setShowOnboarding(false);
                  }}
                >
                  Dismiss guide
                </button>
              </div>
            )}
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

          {explorerTab === 'narrative' && (
            <section className="panel narrative-panel">
              <h2>Narrative comparison mode</h2>
              <p>{narrative}</p>
            </section>
          )}

          <TimelineScrubber
            sliderDay={sliderDay}
            onSliderDay={setSliderDay}
            config={config}
            onSelectedDateChange={setSelectedDate}
            isPlaying={isPlaying}
            onTogglePlaying={() => setIsPlaying((prev) => !prev)}
          />

          <PrecisionInspectorPanel snapshot={snapshot} />
          <MonthSignTable config={config} activeMonth={snapshot.custom.month} />
          <ConversionPanel config={config} selectedDate={selectedDate} onSelectedDateChange={setSelectedDate} />
        </>
      )}

      {section === 'about' && (
        <>
          <ApsidalAwarenessPanel />
          <FormulaDrawer />
          <AboutPanel />
        </>
      )}

      {section === 'tools' && (
        <>
          <section className="panel">
            <h2>Presets / Scenarios</h2>
            <label>
              Active preset
              <select value={selectedPresetId} onChange={(e) => setSelectedPresetId(e.target.value)}>
                {allPresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}{preset.builtIn ? ' (Built-in)' : ''}
                  </option>
                ))}
              </select>
            </label>
            <div className="quick-jumps">
              <button onClick={() => {
                const preset = allPresets.find((item) => item.id === selectedPresetId);
                if (preset) applyPreset(preset);
              }}>Apply preset</button>
              <button onClick={savePreset}>Create from current state</button>
              <button onClick={renamePreset}>Rename local preset</button>
              <button onClick={deletePreset}>Delete local preset</button>
            </div>
          </section>

          <section className="panel">
            <h2>Export tools</h2>
            <p>Export polished assets for presentations, documentation, or sharing the current scenario.</p>
            <div className="quick-jumps">
              <button onClick={exportWheel}>Export orbit wheel image</button>
              <button onClick={exportPresentationCard}>Export presentation card image</button>
              <button onClick={exportJson}>Export current data as JSON</button>
              <button onClick={exportCsv}>Export month/sign table as CSV</button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
