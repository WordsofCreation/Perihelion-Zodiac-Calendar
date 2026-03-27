import { CONSTELLATION_SPANS } from '../../data/zodiac/constellations';
import { ZodiacMode } from '../../lib/astronomy/types';

interface ConstellationReferencePanelProps {
  mode: ZodiacMode;
  onModeChange: (mode: ZodiacMode) => void;
  activeLabel?: string;
}

export function ConstellationReferencePanel({ mode, onModeChange, activeLabel }: ConstellationReferencePanelProps) {
  return (
    <section className="panel">
      <h2>Real Sky Reference Mode</h2>
      <div className="mode-switch" role="radiogroup" aria-label="zodiac mode toggle">
        <button className={mode === 'equal' ? 'mode-btn active' : 'mode-btn'} onClick={() => onModeChange('equal')}>
          Equal Signs
        </button>
        <button className={mode === 'constellation' ? 'mode-btn active' : 'mode-btn'} onClick={() => onModeChange('constellation')}>
          Constellation Reference
        </button>
      </div>

      {mode === 'constellation' && (
        <p className="inspector-note">
          Constellation mode is an approximate educational overlay with uneven spans; it is separate from symbolic 12×30° sign logic.
          Active label: <strong>{activeLabel ?? '—'}</strong>
        </p>
      )}

      <div className="table-wrap">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Span</th>
              <th>Width</th>
            </tr>
          </thead>
          <tbody>
            {CONSTELLATION_SPANS.map((span) => (
              <tr key={span.name} className={mode === 'constellation' && span.name === activeLabel ? 'active-row' : ''}>
                <td>{span.name}</td>
                <td>{span.startDeg}° → {span.endDeg}°</td>
                <td>{(span.endDeg - span.startDeg).toFixed(1)}°</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
