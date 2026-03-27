import { COMPARISON_LAYERS } from '../data/comparisonMeta';
import { CustomDateParts, ZodiacPosition, formatDateTime } from '../utils/calendarMath';

interface ComparisonPanelProps {
  selectedDate: Date;
  custom: CustomDateParts;
  tropical: ZodiacPosition;
  sidereal: ZodiacPosition;
  showLayer: Record<'perihelion' | 'tropical' | 'sidereal' | 'gregorian', boolean>;
  onToggleLayer: (key: 'perihelion' | 'tropical' | 'sidereal' | 'gregorian', checked: boolean) => void;
}

export function ComparisonPanel({ selectedDate, custom, tropical, sidereal, showLayer, onToggleLayer }: ComparisonPanelProps) {
  return (
    <section className="panel">
      <h2>Comparison Layer</h2>
      <div className="toggle-row">
        {COMPARISON_LAYERS.map((layer) => (
          <label key={layer.key} className="toggle-label">
            <input
              type="checkbox"
              checked={showLayer[layer.key]}
              onChange={(e) => onToggleLayer(layer.key, e.target.checked)}
            />
            {layer.title}
          </label>
        ))}
      </div>

      <div className="comparison-grid">
        {showLayer.gregorian && (
          <article className="comparison-card">
            <h3>Gregorian</h3>
            <p>{formatDateTime(selectedDate)}</p>
            <small>Civil reference frame used as input timestamp.</small>
          </article>
        )}

        {showLayer.perihelion && (
          <article className="comparison-card">
            <h3>Perihelion calendar</h3>
            <p>
              Day {custom.dayOfYear} • Month {custom.month} Day {custom.dayOfMonth}
            </p>
            <p>
              {custom.sign} • {custom.degree.toFixed(2)}°
            </p>
            <small>{(custom.fractionElapsed * 100).toFixed(3)}% of anomalistic model year elapsed.</small>
          </article>
        )}

        {showLayer.tropical && (
          <article className="comparison-card">
            <h3>Tropical zodiac (approx)</h3>
            <p>
              {tropical.sign} {tropical.degreeInSign.toFixed(2)}°
            </p>
            <p>Total longitude: {tropical.degree.toFixed(2)}°</p>
            <small>{COMPARISON_LAYERS.find((layer) => layer.key === 'tropical')?.description}</small>
          </article>
        )}

        {showLayer.sidereal && (
          <article className="comparison-card">
            <h3>Sidereal reference (approx)</h3>
            <p>
              {sidereal.sign} {sidereal.degreeInSign.toFixed(2)}°
            </p>
            <p>Total longitude: {sidereal.degree.toFixed(2)}°</p>
            <small>{COMPARISON_LAYERS.find((layer) => layer.key === 'sidereal')?.description}</small>
          </article>
        )}
      </div>
    </section>
  );
}
