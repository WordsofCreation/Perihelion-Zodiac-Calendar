import { useState } from 'react';
import {
  ANOMALISTIC_YEAR_DAYS,
  CUSTOM_DAY_SECONDS,
  CUSTOM_YEAR_DAYS,
  EXTRA_SECONDS_PER_HOUR,
  STANDARD_DAY_SECONDS
} from '../../lib/astronomy/constants';

export function FormulaDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <section className="panel">
      <button type="button" className="drawer-toggle" onClick={() => setOpen((prev) => !prev)}>
        {open ? 'Hide' : 'Show'} formulas, assumptions, and limits
      </button>
      {open && (
        <div className="drawer-body">
          <h3>Formula basis</h3>
          <ul className="metric-list">
            <li>Custom day = 24h + 21m + 2.31s = {CUSTOM_DAY_SECONDS.toFixed(2)} s.</li>
            <li>Custom year division = 360 equal days and 12 equal 30-day months.</li>
            <li>Anomalistic basis (mean) = {ANOMALISTIC_YEAR_DAYS.toFixed(6)} days.</li>
            <li>Orbital degree in custom model = anomalistic fraction × 360.</li>
            <li>Extra seconds/hour = ({CUSTOM_DAY_SECONDS.toFixed(2)} - {STANDARD_DAY_SECONDS}) / 24 = {EXTRA_SECONDS_PER_HOUR.toFixed(5)} s.</li>
            <li>360-day logic preserves clean 30° symbolic segmentation.</li>
          </ul>
          <h3>Limitations</h3>
          <ul className="metric-list">
            <li>Mean-year constants ignore short-term dynamical variation.</li>
            <li>Tropical and sidereal references are modeled using stable anchors.</li>
            <li>Constellation overlays are educational and not a precision ephemeris.</li>
            <li>This is an interpretive astronomy-calendar explorer, not civil time authority.</li>
            <li>Primary premise remains the perihelion-anchored {CUSTOM_YEAR_DAYS}-day calendar model.</li>
          </ul>
        </div>
      )}
    </section>
  );
}
