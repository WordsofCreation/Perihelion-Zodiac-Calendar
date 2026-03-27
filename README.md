# Perihelion Zodiac Calendar

A React + TypeScript application focused on a **clean, data-driven perihelion calendar and time instrument**.

## Product focus

This phase intentionally centers on:

- perihelion-anchored custom year logic
- custom clock / custom day system
- Gregorian ↔ perihelion conversion
- transparent astronomy references
- formulas, assumptions, and settings controls

It explicitly avoids star maps, observatory views, and sky-rendering features.

## Core model

- Year start = exact perihelion anchor instant
- Governing year type = anomalistic year
- 360 equal custom days per year
- 12 equal months of 30 days each
- Zodiac signs assigned by month order
- Custom day length ≈ 24h 21m 2.31s
- Extra time beyond 24h distributed as ≈ 52.59625 extra seconds per hour

## Application sections

- **Dashboard**: command-center metrics for active year state
- **Clock**: live custom clock + Gregorian comparison
- **Calendar**: full 12×30 custom-year browsing (list + grid)
- **Converter**: Gregorian ↔ perihelion conversions
- **Astronomical Considerations**: key reference concepts and caveats
- **Formulas / Assumptions**: transparent derivations and limits
- **Settings**: presets, overrides, zodiac mode controls, reset defaults

## Included capabilities

- Live “now” mode and selected timestamp mode
- Prominent custom clock with custom hour/minute/second and Gregorian comparison
- Perihelion year presets and manual perihelion override
- Capricorn-start default mode and Aries-start experimental mode
- Custom zodiac order support
- Full 12-month/360-day calendar with list, year-grid, and month-day browse
- Active month/sign/day highlighting in tables and cards
- Gregorian ↔ custom conversions with elapsed-year and orbital-degree outputs
- Astronomical considerations and formula transparency panels
- Local persistence of app settings

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

## Notes on scope

This project is a mathematical and interpretive calendar/time system for exploration and reference.
It is not intended as a replacement for civil time standards or ephemeris-grade astrodynamics software.

## Deployment configuration (current default)

This project is currently configured for a **GitHub Pages project site** at:

- `https://wordsofcreation.github.io/Perihelion-Zodiac-Calendar/`

Vite uses `/Perihelion-Zodiac-Calendar/` as the production `base`, so built assets resolve correctly from the repository subpath.

For local development (`npm run dev`), Vite serves from root (`/`) so local routing and asset loading work normally.

## Future root-site deployment

The project can still be deployed at the root (`/`) when needed.

Use an override at build time:

```bash
VITE_BASE_PATH=/ npm run build
```

You can also point to another subpath by setting `VITE_BASE_PATH` to that path.

## Recommended GitHub Pages workflow

1. Build with `npm run build`.
2. Upload the generated `dist/` folder as the Pages artifact in GitHub Actions.
3. Deploy with `actions/deploy-pages`.
4. In **Settings → Pages**, set **Source** to **GitHub Actions**.
5. Keep `.github/workflows/deploy-pages.yml` on `main`; each push to `main` builds and deploys automatically.
6. Confirm generated asset URLs begin with `/Perihelion-Zodiac-Calendar/`.
7. Confirm `sitemap.xml` and `robots.txt` point at the project-site URL.

If Pages is set to “Deploy from a branch”, GitHub will serve the repo source `index.html` directly (which references `/src/main.tsx`), and the browser will render a blank page because TypeScript/TSX source is not bundled for production.
