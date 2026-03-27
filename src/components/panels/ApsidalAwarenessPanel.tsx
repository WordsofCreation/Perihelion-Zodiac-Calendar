import { ANOMALISTIC_YEAR_DAYS, SIDEREAL_YEAR_DAYS, TROPICAL_YEAR_DAYS } from '../../lib/astronomy/constants';

const rows = [
  {
    name: 'Anomalistic year',
    days: ANOMALISTIC_YEAR_DAYS,
    measures: 'Perihelion-to-perihelion orbital cycle',
    matters: 'Primary rhythm for this calendar; drives 0° custom reset.'
  },
  {
    name: 'Tropical year',
    days: TROPICAL_YEAR_DAYS,
    measures: 'Cycle of seasons (equinox to equinox)',
    matters: 'Useful for symbolic zodiac seasons and civil/seasonal framing.'
  },
  {
    name: 'Sidereal year',
    days: SIDEREAL_YEAR_DAYS,
    measures: 'Earth relative to distant stars',
    matters: 'Shows stellar background drift compared with tropical framing.'
  }
];

export function ApsidalAwarenessPanel() {
  const deltaAT = (ANOMALISTIC_YEAR_DAYS - TROPICAL_YEAR_DAYS) * 86400;
  const deltaAS = (ANOMALISTIC_YEAR_DAYS - SIDEREAL_YEAR_DAYS) * 86400;

  return (
    <section className="panel">
      <h2>Apsidal / Perihelion Awareness</h2>
      <p className="inspector-note">
        These year definitions diverge because Earth&apos;s orbit orientation and equinox reference do not advance at the same rate.
      </p>
      <div className="table-wrap">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Year type</th>
              <th>Length (days)</th>
              <th>What it measures</th>
              <th>Why it matters here</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>{row.days.toFixed(6)}</td>
                <td>{row.measures}</td>
                <td>{row.matters}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="metric-list">
        <li>Anomalistic − Tropical: {deltaAT.toFixed(2)} seconds/year.</li>
        <li>Anomalistic − Sidereal: {deltaAS.toFixed(2)} seconds/year.</li>
      </ul>
    </section>
  );
}
