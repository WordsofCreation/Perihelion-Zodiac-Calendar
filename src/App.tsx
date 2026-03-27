import { useEffect } from 'react';
import InstrumentPage from './pages/InstrumentPage';

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
  useEffect(() => {
    const title = 'Perihelion Zodiac Calendar | Calendar + Time Instrument';
    const description =
      'A clean, data-driven perihelion-based custom calendar and custom clock system with conversion tools, formulas, and astronomical reference panels.';

    document.title = title;
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
  }, []);

  return <InstrumentPage />;
}
