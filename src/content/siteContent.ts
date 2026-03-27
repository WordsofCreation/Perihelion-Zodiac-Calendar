export interface ContentSection {
  title: string;
  body: string[];
  bullets?: string[];
}

export interface NoteEntry {
  slug: string;
  title: string;
  summary: string;
  body: string[];
}

export const pageContent: Record<string, { title: string; intro: string; sections: ContentSection[] }> = {
  about: {
    title: 'About the Perihelion Zodiac Calendar',
    intro:
      'The Perihelion Zodiac Calendar is a conceptual time model that begins each year at perihelion, then maps one anomalistic cycle into 360 equal days and 12 equal zodiac months.',
    sections: [
      {
        title: 'Perihelion as the year-start anchor',
        body: [
          'Instead of anchoring the year to an equinox, this system starts at Earth’s perihelion, the annual point of closest distance to the Sun.',
          'That anchor is physically orbital, not seasonal, giving the calendar a consistent apsidal reference frame.'
        ]
      },
      {
        title: '360-day structure and 12 equal months',
        body: [
          'The full year is represented as 360 custom days, divided into 12 months of exactly 30 days each.',
          'Each month maps to one zodiac sector, creating a clean degree/day/month alignment: 30° = 30 days = 1 month.'
        ],
        bullets: ['12 equal months × 30 days', 'No uneven month lengths inside the model', 'Direct mapping between geometry and calendar structure']
      },
      {
        title: 'Custom day length and elegance',
        body: [
          'Because the anomalistic year is longer than 360 × 24h, each custom day is slightly longer than a Gregorian day.',
          'This preserves equal sector logic without introducing leap months or irregular boundaries.'
        ]
      }
    ]
  },
  howItWorks: {
    title: 'How It Works',
    intro: 'A step-by-step description of the mechanics behind the explorer and the mean orbital model.',
    sections: [
      {
        title: '1) Start from the anomalistic year',
        body: [
          'The model uses the mean anomalistic year (~365.2596 days), the perihelion-to-perihelion orbital period.'
        ]
      },
      {
        title: '2) Divide by 360',
        body: [
          'The year length is divided by 360 to derive a custom day. This creates a coherent circular calendar where each degree corresponds to one custom day.'
        ]
      },
      {
        title: '3) Map day -> month -> sign',
        body: [
          'Day 1 starts at perihelion. Days 1-30 are month/sign 1, days 31-60 are month/sign 2, and so on through all 12 signs.'
        ]
      },
      {
        title: '4) Explain longer hours',
        body: [
          'If a custom day is longer than 24h, then each custom hour is also slightly longer. The explorer exposes that shift as part of the educational framing.'
        ]
      },
      {
        title: '5) Visual explorer behavior',
        body: [
          'The wheel shows the custom perihelion ring and comparison overlays (tropical/sidereal) so users can see convergence and divergence in one interface.'
        ]
      }
    ]
  },
  yearTypes: {
    title: 'Year Types Compared',
    intro: 'Four year definitions answer four different questions.',
    sections: [
      {
        title: 'Tropical year',
        body: ['Measures equinox-to-equinox cycle and supports seasons in Earth-based calendrical systems.']
      },
      {
        title: 'Sidereal year',
        body: ['Measures orbital period against distant stars; useful for star-referenced celestial framing.']
      },
      {
        title: 'Anomalistic year',
        body: ['Measures perihelion-to-perihelion cycle. This project uses it because perihelion is the chosen anchor event.']
      },
      {
        title: 'Gregorian year',
        body: ['Civil calendar framework with leap-year rules to approximate tropical seasonal continuity.']
      }
    ]
  },
  zodiac: {
    title: 'Zodiac Models Compared',
    intro: 'The site distinguishes symbolic, geometric, and observational frames rather than collapsing them into one claim.',
    sections: [
      {
        title: 'Tropical zodiac',
        body: ['Season-anchored, equal 30° signs tied to the equinox framework.']
      },
      {
        title: 'Sidereal equal-sign framing',
        body: ['Star-referenced equal 30° signs with an ayanamsha offset from tropical zero points.']
      },
      {
        title: 'Actual constellations',
        body: ['Unequal IAU constellation spans with non-uniform boundaries and durations along the ecliptic.']
      },
      {
        title: 'Perihelion zodiac (this project)',
        body: ['Equal 30° sectors anchored at perihelion rather than equinox.', 'Symbolic interpretive layer is presented as a model, not an observational replacement.']
      }
    ]
  },
  formulas: {
    title: 'Formulas & Assumptions',
    intro: 'Core formulas and the limits of the mean model are presented explicitly for transparency.',
    sections: [
      {
        title: 'Custom day derivation',
        body: ['customDay = anomalisticYear / 360', 'customHour = customDay / 24']
      },
      {
        title: 'Extra seconds per hour',
        body: ['extraSecondsPerHour = (customHour - 3600 seconds)', 'Equivalent daily drift is distributed across each custom hour.']
      },
      {
        title: 'Model limitations',
        body: [
          'The explorer is mean-model based and does not attempt full n-body precision or epoch-specific perturbation integration.',
          'Real orbital elements vary, so values are educationally coherent but intentionally simplified.'
        ]
      }
    ]
  },
  roadmap: {
    title: 'Roadmap',
    intro: 'Future development directions for astronomy, interpretation, and publishing workflows.',
    sections: [
      {
        title: 'Astronomy engine upgrades',
        body: ['Higher-fidelity ephemerides', 'Epoch-aware perihelion/perigee handling', 'Improved constellation boundary calculations']
      },
      {
        title: 'Interpretive and comparative layers',
        body: ['Historical calendar comparisons', 'Alternate sign-start systems', 'Configurable symbolic profiles']
      },
      {
        title: 'Publishing tools',
        body: ['Export-ready charts and essay embeds', 'Versioned notes library', 'Cross-linked research bibliography support']
      },
      {
        title: 'Observational integration',
        body: ['Sky-map overlays', 'Observer latitude context', 'Date-to-sky narrative mode']
      }
    ]
  }
};

export const notes: NoteEntry[] = [
  {
    slug: 'why-start-at-perihelion',
    title: 'Why Start the Year at Perihelion?',
    summary: 'An argument for using a concrete orbital event as the opening boundary of a symbolic calendar.',
    body: [
      'Perihelion is not culturally arbitrary: it is a recurring orbital extreme.',
      'Using perihelion as day 1 reframes the year as an apsidal cycle and makes the starting point physically explicit.'
    ]
  },
  {
    slug: 'why-360-still-matters',
    title: 'Why 360 Still Matters',
    summary: 'A reflection on why base-360 geometry remains useful for cyclical systems and educational visuals.',
    body: [
      'The 360 partition is mathematically expressive and historically resilient in angular reasoning.',
      'In this project, it creates legible one-to-one alignment between days, degrees, and month segments.'
    ]
  },
  {
    slug: 'equal-signs-vs-real-constellations',
    title: 'Equal Signs vs Real Constellations',
    summary: 'How equal symbolic sectors differ from non-uniform star-bound constellations.',
    body: [
      'Equal signs are a geometric framework; constellations are observational regions with uneven spans.',
      'The explorer keeps both visible so users can evaluate interpretation versus sky geometry.'
    ]
  },
  {
    slug: 'designing-a-mean-orbital-calendar',
    title: 'Designing a Mean Orbital Calendar',
    summary: 'Why the project intentionally adopts mean orbital assumptions before precision dynamics.',
    body: [
      'Mean models are easier to teach and reason about when introducing a new system.',
      'Precision layers can be added later without discarding the educational architecture.'
    ]
  },
  {
    slug: 'perihelion-time-and-symbolic-order',
    title: 'Perihelion, Time, and Symbolic Order',
    summary: 'A note on combining astronomical anchoring with symbolic calendrical storytelling.',
    body: [
      'The project treats symbolic mapping as interpretive, while still grounding sequence boundaries in orbital mechanics.',
      'This keeps the model honest about scope while inviting deeper philosophical exploration.'
    ]
  }
];
