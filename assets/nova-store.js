/* Nova demo store — sessionStorage persistence for the prototype.
   Seeded from assets/nova-demo-data.js. Changes survive navigation and reload
   within the current tab only and are cleared by "Reset demo data".
   request() simulates latency and, when enabled, a failed request, so every
   flow can show its loading and recoverable-error states. No backend exists. */
(() => {
  'use strict';
  const STATE_KEY = 'nova_demo_state_v1';
  const FAILURE_KEY = 'nova_demo_failure_mode';
  const seed = window.NovaDemoSeed;
  const clone = (value) => JSON.parse(JSON.stringify(value));

  const session = (() => { try { const s = window.sessionStorage; s.getItem('x'); return s; } catch { return null; } })();
  const memory = new Map();
  const read = (key) => { try { return session ? session.getItem(key) : memory.get(key) ?? null; } catch { return memory.get(key) ?? null; } };
  const write = (key, value) => { try { if (session) session.setItem(key, value); else memory.set(key, value); } catch { memory.set(key, value); } };
  const drop = (key) => { try { session?.removeItem(key); } catch {} memory.delete(key); };

  let cache = null;
  function load() {
    if (cache) return cache;
    let stored = null;
    try { stored = JSON.parse(read(STATE_KEY) || 'null'); } catch { stored = null; }
    const base = clone(seed);
    cache = stored && stored.version === seed.version ? { ...base, ...stored } : base;
    return cache;
  }
  function persist() { write(STATE_KEY, JSON.stringify(cache)); listeners.forEach((fn) => { try { fn(cache); } catch {} }); }
  const listeners = new Set();

  const store = {
    key: STATE_KEY,
    seed,
    get(name) { return clone(load()[name]); },
    set(name, value) { load()[name] = clone(value); persist(); return store.get(name); },
    list(name) { const value = load()[name]; return Array.isArray(value) ? clone(value) : []; },
    find(name, id) { return store.list(name).find((item) => item.id === id) || null; },
    upsert(name, item) {
      const items = store.list(name); const index = items.findIndex((entry) => entry.id === item.id);
      if (index >= 0) items[index] = { ...items[index], ...item }; else items.push(item);
      store.set(name, items); return store.find(name, item.id);
    },
    remove(name, id) { store.set(name, store.list(name).filter((item) => item.id !== id)); },
    uid(prefix) { return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`; },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },

    failureMode() { const mode = read(FAILURE_KEY); return mode === 'next' || mode === 'always' ? mode : 'off'; },
    setFailureMode(mode) { if (mode === 'off') drop(FAILURE_KEY); else write(FAILURE_KEY, mode); },

    /* Simulated network call. Resolves with action() after a short delay or
       rejects with a recoverable error when failure simulation is on. */
    request(action, { delay = 420 } = {}) {
      // The outcome is decided when the request starts. A successful change is written
      // to the tab at once (so a reload never loses it); the delay only simulates the
      // round trip before the UI confirms. A failed request changes nothing.
      const mode = store.failureMode();
      if (mode === 'next') store.setFailureMode('off');
      let outcome;
      if (mode !== 'off') {
        outcome = { error: Object.assign(new Error('The demo service did not respond. Nothing was changed. Check your connection and try again.'), { simulated: true }) };
      } else {
        try { outcome = { value: action ? action() : undefined }; } catch (error) { outcome = { error }; }
      }
      return new Promise((resolve, reject) => setTimeout(() => (outcome.error ? reject(outcome.error) : resolve(outcome.value)), delay));
    },

    /* Clears every Nova key in this tab (store, card, transfer and preference keys). */
    reset() {
      cache = null;
      try { if (session) Object.keys(session).filter((key) => key.startsWith('nova_')).forEach((key) => session.removeItem(key)); } catch {}
      memory.clear();
    }
  };

  window.NovaStore = Object.freeze(store);
})();
