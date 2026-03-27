# Perihelion Zodiac Calendar

A public-facing React + TypeScript explorer for a **perihelion-anchored calendar model**:

- year starts at perihelion (anomalistic anchor)
- 360 custom days
- 12 equal zodiac months of 30 days each
- overlays for tropical, sidereal, and optional constellation framing

## Phase 4 overview (publish-ready release)

Phase 4 turns the project from prototype into a shareable exploration tool with URL state, local presets, export features, onboarding, and presentation polish.

### Major modes

- **Landing / Intro**: concept-first explanation and entry point.
- **Explorer**: orbit wheel + comparisons + timeline + conversions.
- **About / Formulas**: assumptions, formulas, precision notes.
- **Presets & Tools**: saved scenarios and export actions.

## New in Phase 4

### 1) Shareable URL state

Explorer state now syncs to readable query parameters, including:

- selected Gregorian timestamp
- perihelion preset/manual anchor
- zodiac order text
- mode (equal vs constellation)
- layer visibility toggles
- active top section + explorer tab

Use **Copy Share Link** to share an exact view.

### 2) Saved local presets

Presets can now be stored in local browser storage:

- create from current state
- rename custom presets
- delete custom presets
- apply built-ins + saved scenarios quickly

Built-in examples:

- Default Perihelion Model
- Capricorn Start System
- Aries Start Experimental Mode
- Comparison View

### 3) Export tools

Export options include:

- orbit wheel as PNG image
- presentation card image (title + key metrics + wheel)
- full current state snapshot as JSON
- month/sign mapping as CSV

### 4) Guided onboarding + usability

- lightweight “How to read this wheel” helper
- one-click jumps to **Today / Perihelion / Equinox / Aphelion midpoint**
- “Start with today” shortcut
- clearer information architecture via section navigation

### 5) Narrative comparison mode

A dedicated interpretation panel summarizes the selected view in plain language:

- position inside perihelion year
- active month/sign in this model
- tropical/sidereal comparison
- relative position to perihelion/aphelion
- current reference mode

### 6) Presentation-quality orbit wheel

Upgraded wheel styling for public-facing screenshots:

- stronger ring hierarchy and typography
- improved marker glow/clarity
- polished gradients and labels
- better export compatibility

## Formulas and assumptions

### Core mapping

- anomalistic year (mean) is used as year baseline
- custom day fraction = elapsed_anomalistic_fraction × 360
- custom degree = elapsed_anomalistic_fraction × 360°
- month index = floor(day_index / 30)

### Comparison layers

- tropical and sidereal overlays use stable approximation anchors (mean constants, equinox framing)
- constellation mode is educational and uneven-span, not observatory precision boundaries

### Why custom day > 24h

Because ~365.2596 standard days are compressed into 360 custom days, each custom day represents slightly more than 24h of civil time.

## Limitations

- not a full ephemeris integration
- uses mean year-length constants
- intended for interpretive and educational comparison
- not a civil-time replacement system

## Screenshots

Add screenshots from your environment to publish docs:

- `docs/screenshots/landing.png` (placeholder)
- `docs/screenshots/explorer-wheel.png` (placeholder)
- `docs/screenshots/presets-tools.png` (placeholder)

## Setup

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Structure overview

```txt
src/
  components/
    orbit/
    panels/
  data/
    perihelion/
    zodiac/
  lib/
    astronomy/
    calendar/
  App.tsx
```

## Roadmap ideas

- optional cloud preset sync / user accounts
- richer annotation layers (events, custom notes)
- higher-fidelity astronomical integration option
- printable report templates
- collaborative shared scenarios

