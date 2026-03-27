import { OrbitWheel } from '../components/orbit/OrbitWheel';
import { DEFAULT_CUSTOM_ZODIAC_ORDER } from '../data/zodiac/equalSigns';
import { createAstronomySnapshot } from '../utils/calendarMath';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

const snapshot = createAstronomySnapshot(new Date(), {
  perihelionIso: '2026-01-04T15:17:00.000Z',
  zodiacOrder: DEFAULT_CUSTOM_ZODIAC_ORDER
}, 'equal');

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <>
      <section className="panel hero-story">
        <p className="eyebrow">Phase 5 • Public knowledge edition</p>
        <h1>Perihelion Zodiac Calendar</h1>
        <p>
          A publishable astronomy-informed calendar experiment that anchors year-start at perihelion, maps the anomalistic cycle to
          360 equal days, and compares symbolic and observational zodiac frameworks.
        </p>
        <div className="cta-row">
          <button onClick={() => onNavigate('/explorer')}>Open Explorer</button>
          <button onClick={() => onNavigate('/how-it-works')}>Read How It Works</button>
        </div>
      </section>

      <section className="panel">
        <h2>Orbit wheel preview</h2>
        <p className="page-intro">Preview the same visual language used in the live explorer.</p>
        <div className="home-orbit-preview">
          <OrbitWheel
            degree={snapshot.custom.degree}
            tropicalDegree={snapshot.tropical.degree}
            siderealDegree={snapshot.sidereal.degree}
            zodiacOrder={DEFAULT_CUSTOM_ZODIAC_ORDER}
            dayOfYear={snapshot.custom.dayOfYear}
            showTropical
            showSidereal
            zodiacMode="equal"
          />
        </div>
      </section>

      <section className="panel principles-grid">
        <article className="comparison-card">
          <h3>Key principles</h3>
          <ul>
            <li>Perihelion anchor</li>
            <li>360 equal days</li>
            <li>12 equal sign-months</li>
            <li>Transparent assumptions</li>
          </ul>
        </article>
        <article className="comparison-card">
          <h3>Year comparison snapshot</h3>
          <p>Tropical tracks seasons, sidereal tracks stars, anomalistic tracks perihelion cycle.</p>
        </article>
        <article className="comparison-card">
          <h3>Why this project exists</h3>
          <p>
            To create a rigorous but readable framework that lets people compare calendar logics without collapsing symbolic and
            astronomical layers.
          </p>
        </article>
      </section>

      <section className="panel pathway-grid">
        <h2>Explore by pathway</h2>
        <div className="two-col">
          <button onClick={() => onNavigate('/year-types')}>Year Types / Astronomy</button>
          <button onClick={() => onNavigate('/zodiac-comparisons')}>Zodiac Comparisons</button>
          <button onClick={() => onNavigate('/formulas')}>Formulas & Assumptions</button>
          <button onClick={() => onNavigate('/notes')}>Notes / Essays</button>
        </div>
      </section>
    </>
  );
}
