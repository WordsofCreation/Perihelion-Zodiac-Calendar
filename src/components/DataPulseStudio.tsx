import type { AstronomySnapshot } from '../lib/astronomy/types';

interface DataPulseStudioProps {
  snapshot: AstronomySnapshot;
}

const MONTH_LABELS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function DataPulseStudio({ snapshot }: DataPulseStudioProps) {
  const yearProgress = clampPercent(snapshot.custom.fractionElapsed * 100);
  const dayProgress = clampPercent(((snapshot.custom.dayOfMonth - 1) / 30) * 100);
  const monthIntensity = Array.from({ length: 12 }, (_, index) => {
    const monthStart = index * 30;
    const distance = Math.abs(snapshot.custom.degree - (monthStart + 15));
    const wrappedDistance = Math.min(distance, 360 - distance);
    return clampPercent(100 - wrappedDistance * 2.8);
  });

  return (
    <section className="panel data-pulse-studio">
      <div className="data-pulse-header">
        <p className="eyebrow">Live visual tool</p>
        <h2>Orbital Pulse Studio</h2>
        <p className="page-intro">A cinematic readout of where this moment sits inside the perihelion year model.</p>
      </div>

      <div className="data-pulse-grid">
        <article className="pulse-core">
          <div
            className="pulse-ring"
            style={{
              background: `conic-gradient(from -90deg, #72f1ff 0 ${yearProgress}%, rgba(29, 47, 92, 0.35) ${yearProgress}% 100%)`
            }}
            aria-label="Perihelion year completion ring"
          >
            <div className="pulse-ring-inner">
              <small>Year progress</small>
              <strong>{yearProgress.toFixed(2)}%</strong>
              <span>Day {snapshot.custom.dayOfYear} of 360</span>
            </div>
          </div>

          <div className="pulse-track-wrap">
            <div className="pulse-track-labels">
              <span>Month {snapshot.custom.month} pace</span>
              <span>{dayProgress.toFixed(1)}%</span>
            </div>
            <div className="pulse-track">
              <div className="pulse-track-fill" style={{ width: `${dayProgress}%` }} />
            </div>
          </div>
        </article>

        <article className="pulse-details">
          <div className="comparison-grid">
            <div className="comparison-card">
              <h3>Custom vs Tropical</h3>
              <p>{snapshot.offsets.customVsTropicalDeg.toFixed(2)}° offset</p>
            </div>
            <div className="comparison-card">
              <h3>Custom vs Sidereal</h3>
              <p>{snapshot.offsets.customVsSiderealDeg.toFixed(2)}° offset</p>
            </div>
            <div className="comparison-card">
              <h3>Current Sign</h3>
              <p>{snapshot.custom.sign}</p>
            </div>
            <div className="comparison-card">
              <h3>Orbital Degree</h3>
              <p>{snapshot.custom.degree.toFixed(3)}°</p>
            </div>
          </div>

          <div className="month-intensity-map" role="img" aria-label="Monthly intensity map">
            {monthIntensity.map((intensity, index) => (
              <div key={MONTH_LABELS[index]} className={`month-intensity-cell ${snapshot.custom.month === index + 1 ? 'active' : ''}`}>
                <span>{MONTH_LABELS[index]}</span>
                <div className="month-intensity-bar">
                  <div style={{ height: `${Math.max(10, intensity)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
