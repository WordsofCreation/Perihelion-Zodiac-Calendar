import { useEffect, useMemo, useState } from 'react';
import { KnowledgePage } from './components/site/KnowledgePage';
import { SiteLayout } from './components/site/SiteLayout';
import { notes, pageContent } from './content/siteContent';
import ExplorerPage from './pages/ExplorerPage';
import { HomePage } from './pages/HomePage';
import { NotesPage } from './pages/NotesPage';

const NAV_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/explorer', label: 'Explorer' },
  { path: '/about-system', label: 'About the System' },
  { path: '/how-it-works', label: 'How It Works' },
  { path: '/year-types', label: 'Year Types / Astronomy' },
  { path: '/zodiac-comparisons', label: 'Zodiac Comparisons' },
  { path: '/formulas', label: 'Formulas & Assumptions' },
  { path: '/notes', label: 'Notes / Essays' },
  { path: '/roadmap', label: 'Roadmap' }
] as const;

const pageMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Perihelion Zodiac Calendar | Orbit-Anchored Calendar Explorer',
    description: 'Explore a perihelion-anchored 360-day zodiac calendar with educational astronomy pages and comparison tools.'
  },
  '/explorer': {
    title: 'Explorer | Perihelion Zodiac Calendar',
    description: 'Interactive orbit wheel and comparison explorer for perihelion, tropical, sidereal, and constellation framing.'
  },
  '/about-system': {
    title: 'About the System | Perihelion Zodiac Calendar',
    description: 'Understand the perihelion anchor, 360-day structure, equal zodiac months, and custom day logic.'
  },
  '/how-it-works': {
    title: 'How It Works | Perihelion Zodiac Calendar',
    description: 'Step-by-step mechanics of anomalistic-year mapping, day/hour derivation, and explorer behavior.'
  },
  '/year-types': {
    title: 'Year Types Compared | Perihelion Zodiac Calendar',
    description: 'Compare tropical, sidereal, anomalistic, and Gregorian year definitions and what each one measures.'
  },
  '/zodiac-comparisons': {
    title: 'Zodiac Models Compared | Perihelion Zodiac Calendar',
    description: 'Contrast tropical, sidereal, constellation, and perihelion-anchored zodiac models with clear framing.'
  },
  '/formulas': {
    title: 'Formulas & Assumptions | Perihelion Zodiac Calendar',
    description: 'Transparent formulas, assumptions, and limitations behind the mean orbital calendar model.'
  },
  '/notes': {
    title: 'Notes & Essays | Perihelion Zodiac Calendar',
    description: 'Publishable thought pieces exploring perihelion, symbolic order, equal signs, and model design.'
  },
  '/roadmap': {
    title: 'Roadmap | Perihelion Zodiac Calendar',
    description: 'Future work: precision astronomy engine, constellation references, publishing tools, and sky integration.'
  }
};

function setMetaTag(selector: string, attribute: 'name' | 'property', value: string, content: string) {
  let node = document.querySelector(selector) as HTMLMetaElement | null;
  if (!node) {
    node = document.createElement('meta');
    node.setAttribute(attribute, value);
    document.head.appendChild(node);
  }
  node.setAttribute('content', content);
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const navigate = (nextPath: string) => {
    if (nextPath === path) return;
    window.history.pushState({}, '', nextPath);
    setPath(nextPath);
  };

  const meta = pageMeta[path] ?? pageMeta['/'];

  useEffect(() => {
    document.title = meta.title;
    setMetaTag('meta[name="description"]', 'name', 'description', meta.description);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', meta.title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', meta.description);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
  }, [meta]);

  const content = useMemo(() => {
    switch (path) {
      case '/explorer':
        return <ExplorerPage />;
      case '/about-system':
        return <KnowledgePage {...pageContent.about} />;
      case '/how-it-works':
        return <KnowledgePage {...pageContent.howItWorks} />;
      case '/year-types':
        return <KnowledgePage {...pageContent.yearTypes} />;
      case '/zodiac-comparisons':
        return <KnowledgePage {...pageContent.zodiac} />;
      case '/formulas':
        return <KnowledgePage {...pageContent.formulas} />;
      case '/notes':
        return <NotesPage notes={notes} />;
      case '/roadmap':
        return <KnowledgePage {...pageContent.roadmap} />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  }, [path]);

  return (
    <SiteLayout currentPath={path} onNavigate={navigate} navItems={[...NAV_ITEMS]}>
      {content}
    </SiteLayout>
  );
}
