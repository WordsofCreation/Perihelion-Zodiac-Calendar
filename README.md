# Perihelion Zodiac Calendar

An interactive React + TypeScript app for exploring a **perihelion-anchored 360-day calendar** against tropical, sidereal, and Gregorian references.

## Phase 2 highlights

Phase 2 upgrades the app from a prototype into a richer comparison and interpretation tool.

### 1) Perihelion year presets + manual anchor override

- Added curated perihelion UTC presets for multiple recent/upcoming years (`2021` through `2029`).
- Added a year selector for fast anchor switching.
- Added manual perihelion override toggle + freeform ISO timestamp input.
- Switching the year/anchor updates:
  - orbit position
  - custom calendar conversion
  - day/month/sign outputs
  - time-until-next-perihelion values

## 2) Enhanced comparison layer

For a selected Gregorian timestamp, the app now displays side-by-side cards for:

- Perihelion calendar (day/month/sign/degree)
- Tropical zodiac (approx sign + degree)
- Sidereal reference (approx sign + degree)
- Gregorian date/time

Layer toggles control both cards and wheel overlays.

## 3) Orbit wheel boundary layering

The wheel now uses multiple visual rings:

- Outer ring: custom perihelion 12 equal months
- Middle ring: tropical zodiac boundaries (dashed amber)
- Inner ring: sidereal reference boundaries (dashed cyan)

Animated markers indicate active positions across systems.

## 4) Detail inspector panel

Added a scientific-style inspector for selected date/time:

- Gregorian date/time
- Perihelion day/month/sign
- 360-model degree
- anomalistic-year fraction elapsed
- tropical/sidereal degree references
- perihelion-vs-tropical offset note

## 5) Month/sign reference table

New full table for the custom 12-month system:

- month number
- sign name
- custom day range
- degree range
- approximate Gregorian start/end for current perihelion year

The active month row highlights as the selected date changes.

## 6) Expanded explanation layer

The about section now covers:

- anomalistic year
- perihelion anchor logic
- why the custom day is longer than 24h
- mathematical elegance of equal segmentation
- limits vs real unequal constellations
- interpretive scope (not civil-time replacement)

## 7) UI polish

- smoother marker animation
- cleaner card and table layouts
- stronger typography hierarchy
- improved spacing and visual grouping
- better mobile responsiveness while keeping the dark cosmic style

## Astronomical precision scope (current phase)

This phase intentionally uses modular approximations (not a full ephemeris engine):

- custom system: mean anomalistic-year abstraction
- tropical reference: equinox-anchored approximation
- sidereal reference: sidereal-year approximation + fixed ayanamsa offset

The code is structured to let future phases replace these with more exact formulas.

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

- `src/data/perihelionPresets.ts`: perihelion preset dataset and helpers.
- `src/data/zodiac.ts`: custom/tropical zodiac ordering.
- `src/data/comparisonMeta.ts`: comparison layer metadata.
- `src/utils/calendarMath.ts`: calendar + comparison math utilities.
- `src/components/OrbitWheel.tsx`: layered orbit comparison visualization.
- `src/components/ComparisonPanel.tsx`: side-by-side comparison cards.
- `src/components/DetailInspector.tsx`: detailed readout panel.
- `src/components/MonthSignTable.tsx`: active month/sign reference table.
- `src/components/ConversionPanel.tsx`: Gregorian/custom conversion tools.
- `src/components/TimelineScrubber.tsx`: interactive date scrubber.
- `src/components/TimeSystemPanel.tsx`: day/year-length comparison metrics.
- `src/components/AboutPanel.tsx`: educational explanation panel.
- `src/App.tsx`: phase orchestration, controls, and state wiring.

## Notes

This project is a designed interpretive astronomy-calendar visualization and should not be used as a civil-time authority or high-precision astrometric engine.
