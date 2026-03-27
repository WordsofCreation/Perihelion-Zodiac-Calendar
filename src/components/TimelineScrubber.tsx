import { CalendarConfig, CUSTOM_YEAR_DAYS, gregorianToCustom, sliderToGregorian } from '../utils/calendarMath';

interface TimelineScrubberProps {
  sliderDay: number;
  onSliderDay: (value: number) => void;
  config: CalendarConfig;
  onSelectedDateChange: (date: Date) => void;
  isPlaying: boolean;
  onTogglePlaying: () => void;
}

export function TimelineScrubber({
  sliderDay,
  onSliderDay,
  config,
  onSelectedDateChange,
  isPlaying,
  onTogglePlaying
}: TimelineScrubberProps) {
  const date = sliderToGregorian(sliderDay, config);
  const mapped = gregorianToCustom(date, config);

  return (
    <section className="panel">
      <h2>Timeline / Year Scrubber</h2>
      <div className="timeline-header">
        <button type="button" className={isPlaying ? 'mode-btn active' : 'mode-btn'} onClick={onTogglePlaying}>
          {isPlaying ? 'Pause animation' : 'Play full-year animation'}
        </button>
      </div>
      <label>
        Scrub day in 360-day year: {sliderDay.toFixed(2)}
        <input
          type="range"
          min={0}
          max={CUSTOM_YEAR_DAYS}
          step={0.01}
          value={sliderDay}
          onChange={(e) => {
            const value = Number(e.target.value);
            onSliderDay(value);
            onSelectedDateChange(sliderToGregorian(value, config));
          }}
        />
      </label>
      <div className="timeline-info">
        <p>
          Mapped custom date: Month {mapped.month}, Day {mapped.dayOfMonth} ({mapped.sign})
        </p>
        <p>Degree position: {mapped.degree.toFixed(2)}°</p>
        <p>Gregorian timestamp: {date.toLocaleString()}</p>
      </div>
    </section>
  );
}
