(() => {
  'use strict';
  try {
    const screen = new URLSearchParams(location.search).get('screen');
    if (screen === 'card-frozen') localStorage.setItem('nova_card_frozen', 'true');
  } catch {}
})();
