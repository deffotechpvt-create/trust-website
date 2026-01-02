import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import App from '@/App';

describe('App routes smoke test', () => {
  const paths = ['/', '/shipping', '/cancellation-refunds', '/donate'];

  afterEach(() => cleanup());

  for (const path of paths) {
    it(`renders ${path} without crashing`, async () => {
      // App includes BrowserRouter; use history API to set location before render
      window.history.pushState({}, '', path);
      render(<App />);

      // some pages set the title via useSEO; ensure title is set or at least app renders
      expect(document.title).toBeDefined();
    });
  }
});
