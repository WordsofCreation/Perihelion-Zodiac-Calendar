# Perihelion Zodiac Calendar

An interactive React + TypeScript app for exploring a **perihelion-anchored 360-day calendar** as the primary system, with tropical, sidereal, and optional real-sky constellation comparison layers.

## Phase 3 highlights

Phase 3 turns the project into a stronger hybrid of calendar design + astronomy comparison while preserving the original premise.

### 1) Stronger astronomy calculation layer

The app now uses a dedicated astronomy service architecture:

- `src/lib/astronomy/constants.ts`
- `src/lib/astronomy/engine.ts`
- `src/lib/astronomy/types.ts`

Core calculations now include:

- anomalistic-year elapsed fraction from a selected perihelion anchor
- custom 360-degree orbital position
- tropical year fraction and reference degree
- sidereal year fraction and reference degree
- explicit cross-system degree offsets

Precision scope is transparent:

- **Exact in-app inputs:** selected Gregorian timestamp + selected perihelion anchor timestamp
- **Mean-based constants:** year lengths (anomalistic/tropical/sidereal)
- **Approximate framing:** equinox anchor for tropical/sidereal comparisons

### 2) Real constellation reference mode

Added an optional mode switch:

- **Equal Signs** (symbolic 12×30°)
- **Constellation Reference** (uneven educational spans)

Constellation mode includes:

- a clear educational warning note
- unequal span table
- orbit wheel overlay ring for real-sky style boundaries
- active constellation label in inspector/wheel

### 3) Apsidal / perihelion awareness panel

New panel explains why year lengths differ:

- anomalistic year
- tropical year
- sidereal year

Includes what each measures and why each matters for this model.

### 4) Precision inspector

Advanced technical readout now includes:

- Gregorian timestamp
- active perihelion anchor
- anomalistic elapsed fraction
- custom day + custom month/sign
- equal-sign degree
- tropical and sidereal comparison degrees
- constellation label (when enabled)
- explicit precision/approximation notes

### 5) Formula + assumptions drawer

Expandable transparency layer with:

- custom day formula
- anomalistic year basis
- 360-day / 12×30 segmentation logic
- extra seconds-per-hour derivation
- limitations and approximation notes

### 6) Better architecture for extension

Refactored structure now separates concerns:

- `src/lib/astronomy/*` for orbital/year model math
- `src/lib/calendar/*` for calendar formatting/conversion utilities
- `src/data/perihelion/*` for anchor data
- `src/data/zodiac/*` for equal signs + uneven constellation spans
- `src/components/orbit/*` for orbit visualization
- `src/components/panels/*` for educational/inspector panels

Legacy import paths are preserved via lightweight compatibility exports where practical.

### 7) UI polish + interaction improvements

- stronger layer legend clarity
- clear active state for mode controls
- denser technical data layout with improved readability
- smoother marker transitions
- richer mode messaging around symbolic vs real-sky framing

### 8) Stretch goal included: animation mode

The timeline scrubber now supports an optional play/pause mode that advances through the full custom year and updates:

- orbit marker
- month/sign mapping
- comparison metrics
- constellation reference output

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

## Notes

This project is an interpretive astronomy-calendar explorer. It is not an observatory-grade ephemeris, not an astrometry package, and not a civil-time authority.
