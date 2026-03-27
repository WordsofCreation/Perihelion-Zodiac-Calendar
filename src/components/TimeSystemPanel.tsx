import {
  CUSTOM_DAY_SECONDS,
  EXTRA_DAY_SECONDS,
  EXTRA_SECONDS_PER_HOUR,
  STANDARD_DAY_SECONDS
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
          <h3>Representation</h3>
          <p>UTC hour tick: 3,600 s</p>
          <p>Custom hour tick: {(CUSTOM_DAY_SECONDS / 24).toFixed(5)} s</p>
          <p>
            This model applies a mean anomalistic-year abstraction for design clarity, not for replacing UTC civil
            timekeeping.
          </p>
          <table className="compare-table">
            <thead>
              <tr>
                <th>System</th>
                <th>One Day</th>
                <th>One Hour</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Standard</td>
                <td>{STANDARD_DAY_SECONDS.toFixed(2)} s</td>
                <td>3600.00000 s</td>
              </tr>
              <tr>
                <td>Perihelion</td>
                <td>{CUSTOM_DAY_SECONDS.toFixed(2)} s</td>
                <td>{(CUSTOM_DAY_SECONDS / 24).toFixed(5)} s</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
