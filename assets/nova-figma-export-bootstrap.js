/* Runs before the canonical renderer. Captures have isolated, in-memory storage. */
(() => {
  'use strict';
  const manifest = window.NovaExportManifest;
  const path = location.pathname.replace(/\/$/, '');
  const requested = new URLSearchParams(location.search).get('capture');
  const entry = manifest.screens.find(item => item.path === path || (path === '/figma-export.html' && item.id === requested));
  if (!entry) {
    document.documentElement.dataset.exportError = 'unknown-screen';
    window.NovaExport = Object.freeze({ error: 'Unknown export screen' });
    return;
  }
  const memory = new Map(Object.entries(entry.canonical_state.storage));
  // Shadow Storage only in this document; browser-origin localStorage is untouched.
  const storage = Object.freeze({
    getItem: key => memory.has(String(key)) ? memory.get(String(key)) : null,
    setItem: (key, value) => memory.set(String(key), String(value)),
    removeItem: key => memory.delete(String(key)), clear: () => memory.clear(),
    key: index => [...memory.keys()][index] ?? null, get length() { return memory.size; }
  });
  Object.defineProperty(window, 'localStorage', { configurable: true, value: storage });
  const query = new URLSearchParams({ screen: entry.canonical_state.screen, state: entry.canonical_state.state, pin: '1' });
  history.replaceState(null, '', entry.path + '?' + query);
  window.NovaExport = Object.freeze({ entry, storage, manifest });
  document.documentElement.dataset.exportScreen = entry.id;
})();
