import { CalendarConfig, gregorianToCustom, sliderToGregorian } from '../utils/calendarMath';

interface TimelineScrubberProps {
  sliderDay: number;
  onSliderDay: (value: number) => void;
  config: CalendarConfig;
}

export function TimelineScrubber({ sliderDay, onSliderDay, config }: TimelineScrubberProps) {
  const date = sliderToGregorian(sliderDay, config);
  const mapped = gregorianToCustom(date, config);

  return (
    <section className="panel">
      <h2>Timeline / Year Scrubber</h2>
      <label>
        Scrub day in 360-day year: {sliderDay.toFixed(2)}
        <input
          type="range"
          min={0}
          max={360}
          step={0.01}
          value={sliderDay}
          onChange={(e) => onSliderDay(Number(e.target.value))}
        />
      </label>
      <div className="timeline-info">
        <p>Mapped month/sign: {mapped.month} / {mapped.sign}</p>
        <p>Degree position: {mapped.degree.toFixed(2)}°</p>
        <p>Gregorian timestamp: {date.toLocaleString()}</p>
      </div>
    </section>
  );
}
