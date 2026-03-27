# Perihelion Zodiac Calendar

A public-facing React + TypeScript website for the **Perihelion Zodiac Calendar**: an educational calendar model that starts each year at perihelion and maps the anomalistic cycle into a 360-day symbolic structure.

## Phase 5 overview (publishable website edition)

Phase 5 expands the project from an app-centric experience into a full multi-page publication layer with long-form educational content, comparison framing, notes/essays, roadmap planning, and SEO foundations.

## Top-level site structure

- **Home** (`/`)
- **Explorer** (`/explorer`)
- **About the System** (`/about-system`)
- **How It Works** (`/how-it-works`)
- **Year Types / Astronomy** (`/year-types`)
- **Zodiac Comparisons** (`/zodiac-comparisons`)
- **Formulas & Assumptions** (`/formulas`)
- **Notes / Essays** (`/notes`)
- **Roadmap** (`/roadmap`)

## What Phase 5 adds

### 1) Multi-page navigation and publishing structure

- New site-wide navigation with active-state highlighting
- Mobile menu support
- Route-level page rendering for educational sections + explorer

### 2) Educational knowledge pages

Long-form pages now cover:

- core model definition
- mechanics and step-by-step operation
- year-type comparisons
- zodiac-model comparisons
- formula transparency and limitations

### 3) Seeded notes/essays section

Included starter notes:

- Why Start the Year at Perihelion?
- Why 360 Still Matters
- Equal Signs vs Real Constellations
- Designing a Mean Orbital Calendar
- Perihelion, Time, and Symbolic Order

### 4) Homepage storytelling upgrades

The homepage now includes:

- hero narrative framing
- concise project statement
- orbit wheel preview section
- key principles and comparison snapshots
- pathway buttons into explorer and knowledge pages

### 5) SEO and metadata foundations

- dynamic page titles and descriptions
- Open Graph title/description setup
- semantic heading hierarchy on content pages
- `public/sitemap.xml` and `public/robots.txt`

## Formula summary

- `customDay = anomalisticYear / 360`
- `customHour = customDay / 24`
- `extraSecondsPerHour = customHour - 3600 seconds`

## Notes on model scope

- Mean-model educational framing (not full ephemeris precision)
- Explicit distinction between symbolic, geometric, and observational layers
- Intended for exploration, comparison, and publication-oriented explanation

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

## Updated source structure

```txt
src/
  components/
    orbit/
    panels/
    site/
      KnowledgePage.tsx
      SiteLayout.tsx
  content/
    siteContent.ts
  pages/
    ExplorerPage.tsx
    HomePage.tsx
    NotesPage.tsx
  App.tsx
```

## Roadmap direction

- higher-fidelity astronomy engine options
- richer constellation/boundary references
- historical calendar comparison layers
- publication/export enhancements
- alternate sign-start experiments
- observer sky integration
