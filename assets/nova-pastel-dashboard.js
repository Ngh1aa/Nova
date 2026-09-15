(() => {
  'use strict';

  const screen = new URLSearchParams(location.search).get('screen') || 'home';

  const groups = {
    home: ['home', 'notifications', 'security'],
    activity: ['activity', 'transaction-detail'],
    pay: ['transfer-recipient', 'transfer-amount', 'transfer-review', 'biometric-failed', 'offline', 'transfer-success', 'error'],
    cards: ['cards', 'card-frozen', 'card-controls'],
    savings: ['savings', 'savings-detail', 'subscriptions']
  };

  function activeKey() {
    return Object.entries(groups).find(([, screens]) => screens.includes(screen))?.[0] || 'home';
  }

  function buildTopTabs() {
    const row = document.querySelector('.ios26-nav-row');
    if (!row || row.querySelector('.nova-top-tabs')) return;

    const tabs = [
      ['Overview', 'home', 'app.html?screen=home'],
      ['Activity', 'activity', 'app.html?screen=activity'],
      ['Pay', 'pay', 'app.html?screen=transfer-recipient'],
      ['Cards', 'cards', 'app.html?screen=cards'],
      ['Savings', 'savings', 'app.html?screen=savings']
    ];
    const current = activeKey();
    const nav = document.createElement('nav');
    nav.className = 'nova-top-tabs';
    nav.setAttribute('aria-label', 'Primary sections');
    nav.innerHTML = tabs.map(([label, key, href]) =>
      `<a href="${href}" class="${key === current ? 'active' : ''}" ${key === current ? 'aria-current="page"' : ''}>${label}</a>`
    ).join('');

    const actions = row.querySelector('.ios26-nav-actions');
    row.insertBefore(nav, actions || null);
  }

  function compactDesktopRail() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    const brand = sidebar.querySelector('.brand');
    if (brand) {
      brand.innerHTML = '<img class="nova-rail-mark" src="assets/nova-mark.svg" alt="">';
      brand.setAttribute('aria-label', 'Nova home');
    }

    sidebar.querySelectorAll('.side-nav a').forEach((link) => {
      const label = link.querySelector('span:not(.nav-glyph)')?.textContent?.trim();
      if (label && !link.title) link.title = label;
      if (label && !link.getAttribute('aria-label')) link.setAttribute('aria-label', label);
    });
  }

  function addPastelSemantics() {
    document.body.classList.add('nova-pastel-dashboard');
    document.documentElement.dataset.novaNav = activeKey();

    const homeSections = document.querySelectorAll('.home-page .section');
    const accents = ['pink', 'yellow', 'lavender', 'blue'];
    homeSections.forEach((section, index) => {
      section.dataset.pastelAccent = accents[index] || 'blue';
    });
  }

  function init() {
    buildTopTabs();
    compactDesktopRail();
    addPastelSemantics();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
