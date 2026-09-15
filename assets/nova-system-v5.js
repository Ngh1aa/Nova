(() => {
  'use strict';

  function refineSidebar() {
    const nav = document.querySelector('.v4-rail-nav');
    if (!nav || nav.querySelector('.v5-rail-primary')) return;

    const links = [...nav.querySelectorAll(':scope > a')];
    if (links.length < 7) return;

    links.forEach((link) => {
      const svg = link.querySelector(':scope > svg');
      if (!svg) return;
      const tile = document.createElement('span');
      tile.className = 'v5-rail-icon';
      link.insertBefore(tile, link.firstChild);
      tile.appendChild(svg);
    });

    const primary = document.createElement('div');
    primary.className = 'v5-rail-primary';
    const divider = document.createElement('div');
    divider.className = 'v5-rail-divider';
    divider.setAttribute('aria-hidden', 'true');
    const secondary = document.createElement('div');
    secondary.className = 'v5-rail-secondary';

    links.slice(0, 5).forEach((link) => primary.appendChild(link));
    links.slice(5).forEach((link) => secondary.appendChild(link));

    nav.replaceChildren(primary, divider, secondary);
  }

  refineSidebar();
})();