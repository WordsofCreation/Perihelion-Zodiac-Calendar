# Perihelion Zodiac Calendar

An interactive React + TypeScript web app that visualizes a **perihelion-anchored 360-day calendar**.

## What this model does

- Starts the custom year at a configurable perihelion timestamp.
- Uses a **mean anomalistic-year abstraction**.
- Splits the year into **360 equal custom days**.
- Splits those days into **12 months of 30 days**, mapped to zodiac signs.
- Defaults zodiac order to:
  1. Capricorn
  2. Aquarius
  3. Pisces
  4. Aries
  5. Taurus
  6. Gemini
  7. Cancer
  8. Leo
  9. Virgo
  10. Libra
  11. Scorpio
  12. Sagittarius

> This is a designed conceptual calendar system for visualization. It does **not** replace UTC/civil timekeeping.

## Features

1. **Orbit Wheel**
   - 360° ring with 12 segments.
   - Perihelion marker at 0°.
   - Current position marker with smooth updates.
   - Segment tooltips (sign, degree range, month, day range).

2. **Calendar Conversion Panel**
   - Gregorian date/time -> custom day/month/sign/degree.
   - Fraction elapsed, time since perihelion, and time until next perihelion.
   - Reverse conversion (custom month/day/fraction) -> approximate Gregorian timestamp.

3. **Time System Panel**
   - Standard vs custom day values side-by-side.
   - Uses custom day length `24h 21m 2.31s`.
   - Extra per-hour value displayed as `52.59625` seconds/hour.

4. **Timeline / Year Scrubber**
   - Slider across the full 360-day model year.
   - Updates degree, sign/month, orbit position, and mapped Gregorian timestamp.

5. **Comparison Toggles**
   - Perihelion calendar overlay
   - Tropical reference overlay (informational in v1)
   - Sidereal reference overlay (informational in v1)
   - Gregorian reference overlay

## Core formulas

Located in `src/utils/calendarMath.ts`.

- `customDaySeconds = 24*3600 + 21*60 + 2.31`
- `meanYearMs = 360 * customDaySeconds * 1000`
- `fractionElapsed = ((t - perihelion) mod meanYearMs) / meanYearMs`
- `degree = fractionElapsed * 360`
- `monthIndex = floor(dayIndex / 30)` where `dayIndex = floor(fractionElapsed * 360)`

Reverse conversion approximation:

- `offsetMs = (dayIndex + fractionWithinDay) * customDaySeconds * 1000`
- `gregorian = perihelion + offsetMs`

## Setup

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Project structure

- `src/utils/calendarMath.ts`: calendar and conversion math.
- `src/components/OrbitWheel.tsx`: orbital wheel visualization.
- `src/components/ConversionPanel.tsx`: Gregorian/custom conversions.
- `src/components/TimeSystemPanel.tsx`: custom time-system display.
- `src/components/TimelineScrubber.tsx`: year slider and mapping.
- `src/App.tsx`: settings, comparison toggles, composition.

## Configuration

Inside the app's **Settings** panel:

- Edit perihelion timestamp as UTC ISO string.
- Edit zodiac order via comma-separated list of exactly 12 signs.

If the zodiac list is invalid, the app falls back to the default zodiac sequence.
