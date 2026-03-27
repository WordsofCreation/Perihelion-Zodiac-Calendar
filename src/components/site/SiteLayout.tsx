import { useState } from 'react';
import type { ReactNode } from 'react';

export interface NavItem {
  path: string;
  label: string;
}

interface SiteLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  navItems: NavItem[];
  children: ReactNode;
}

export function SiteLayout({ currentPath, onNavigate, navItems, children }: SiteLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = (path: string) => {
    onNavigate(path);
    setMobileOpen(false);
  };

  return (
    <div className="site-shell">
      <header className="site-header panel">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="brand-link">
          <strong>Perihelion Zodiac Calendar</strong>
          <span>Explorer + knowledge atlas</span>
        </a>
        <button className="mobile-nav-toggle" onClick={() => setMobileOpen((prev) => !prev)} aria-expanded={mobileOpen}>
          Menu
        </button>
        <nav className={`site-nav ${mobileOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
              }}
              className={currentPath === item.path ? 'active' : ''}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>
      <main className="site-main">{children}</main>
      <footer className="site-footer panel">
        <p>
          Built as an educational, exploratory model of a perihelion-anchored calendar system. Use the explorer for live interaction,
          then move through the knowledge pages for assumptions and context.
        </p>
      </footer>
    </div>
  );
}
