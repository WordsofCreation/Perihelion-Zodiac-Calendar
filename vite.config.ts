import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const DEFAULT_PROJECT_BASE = '/Perihelion-Zodiac-Calendar/';

function normalizeBasePath(rawBase: string | undefined): string {
  const candidate = (rawBase ?? DEFAULT_PROJECT_BASE).trim();
  const withLeadingSlash = candidate.startsWith('/') ? candidate : `/${candidate}`;
  const withTrailingSlash = withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
  return withTrailingSlash.replace(/\/+/g, '/');
}

export default defineConfig({
  base: normalizeBasePath(process.env.VITE_BASE_PATH),
  plugins: [react()]
});
