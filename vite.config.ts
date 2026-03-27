import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function normalizeBasePath(rawBase: string | undefined): string {
  if (!rawBase) {
    return './';
  }

  const candidate = rawBase.trim();
  if (candidate === '.' || candidate === './') {
    return './';
  }

  const withLeadingSlash = candidate.startsWith('/') ? candidate : `/${candidate}`;
  const withTrailingSlash = withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
  return withTrailingSlash.replace(/\/+/g, '/');
}

export default defineConfig(({ command }) => {
  const configuredBase = normalizeBasePath(process.env.VITE_BASE_PATH);

  return {
    // Keep local dev on root while building project-site URLs for production.
    base: command === 'serve' ? '/' : configuredBase,
    plugins: [react()]
  };
});
