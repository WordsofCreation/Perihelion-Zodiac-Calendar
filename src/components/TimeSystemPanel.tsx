import {
  ANOMALISTIC_YEAR_DAYS,
  CUSTOM_DAY_SECONDS,
  EXTRA_DAY_SECONDS,
  EXTRA_SECONDS_PER_HOUR,
  SIDEREAL_YEAR_DAYS,
  STANDARD_DAY_SECONDS,
  TROPICAL_YEAR_DAYS
} from '../utils/calendarMath';

export function TimeSystemPanel() {
  return (
    <section className="panel">
      <h2>Time System</h2>
      <div className="two-col">
        <div>
          <h3>Base values</h3>
          <ul className="metric-list">
            <li>Standard day: 24h (86,400 s)</li>
            <li>Custom perihelion day: 24h 21m 2.31s ({CUSTOM_DAY_SECONDS.toFixed(2)} s)</li>
            <li>Extra time per day: {EXTRA_DAY_SECONDS.toFixed(2)} s</li>
            <li>Extra per hour: {EXTRA_SECONDS_PER_HOUR.toFixed(5)} s</li>
          </ul>
        </div>
        <div>
          <h3>Year-length comparison</h3>
          <table className="compare-table">
            <thead>
              <tr>
                <th>Year model</th>
                <th>Days</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Anomalistic (model basis)</td>
                <td>{ANOMALISTIC_YEAR_DAYS.toFixed(6)}</td>
              </tr>
              <tr>
                <td>Tropical</td>
                <td>{TROPICAL_YEAR_DAYS.toFixed(6)}</td>
              </tr>
              <tr>
                <td>Sidereal</td>
                <td>{SIDEREAL_YEAR_DAYS.toFixed(6)}</td>
              </tr>
            </tbody>
          </table>
          <p>
            This phase keeps clean approximations and a modular structure so future ephemeris-grade formulas can be
            dropped in without UI rewrites.
          </p>
          <p>Reference hour in custom model: {(CUSTOM_DAY_SECONDS / 24).toFixed(5)} s.</p>
          <p>Reference hour in civil time: {STANDARD_DAY_SECONDS / 24} s.</p>
        </div>
      </div>
    </section>
  );
}
