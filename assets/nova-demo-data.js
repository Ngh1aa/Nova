/* Nova demo seed — the single source for every record a visitor can change.
   assets/nova-store.js copies this seed into sessionStorage on first use; all
   later edits live in that tab only. "Reset demo data" restores this seed.
   Every value is fictional prototype data. Nothing here represents real money. */
(() => {
  'use strict';
  const deepFreeze = (value) => { if (value && typeof value === 'object') { Object.values(value).forEach(deepFreeze); Object.freeze(value); } return value; };

  window.NovaDemoSeed = deepFreeze({
    version: 1,
    today: '2026-09-15',
    profile: { name: 'Alex Nguyen', email: 'alex.nguyen@novamail.app', phone: '+353 87 555 0142', address: '12 Harbour Row, Dublin 2' },

    // Saved payees. The first four match the recipients the transfer flow has always offered.
    payees: [
      { id: 'maya-chen-2048', name: 'Maya Chen', bank: 'Northfield Bank', iban: 'IE26 NRTH 9300 1520 4820 48', account: 'Personal •••• 2048', nickname: 'Flatmate', category: 'Friends & family', lastPaid: '12 Sep' },
      { id: 'daniel-lee-7184', name: 'Daniel Lee', bank: '', iban: 'IE45 IRCE 9205 0112 3471 84', account: '•••• 7184', nickname: '', category: 'Friends & family', lastPaid: '1 Sep' },
      { id: 'an-nguyen-3052', name: 'An Nguyen', bank: '', iban: 'IE23 BOFI 9000 1710 2730 52', account: '•••• 3052', nickname: 'Sister', category: 'Friends & family', lastPaid: '6 Sep' },
      { id: 'natalie-6610', name: 'Natalie', bank: '', iban: 'IE85 AIBK 9311 5212 3466 10', account: '•••• 6610', nickname: '', category: 'Friends & family', lastPaid: '' }
    ],

    // Planned transfers. Status: scheduled | cancelled.
    scheduled: [
      { id: 'sch-rent-split', payeeId: 'maya-chen-2048', amount: 310, date: '2026-09-30', frequency: 'monthly', reference: 'Rent share', status: 'scheduled' },
      { id: 'sch-gift', payeeId: 'an-nguyen-3052', amount: 50, date: '2026-10-04', frequency: 'once', reference: 'Birthday gift', status: 'scheduled' }
    ],

    goals: [
      { id: 'emergency', name: 'Emergency buffer', current: 2480, target: 4000, contribution: 260, next: '28 Sep', status: 'On track' },
      { id: 'holiday', name: 'Holiday fund', current: 3200, target: 5000, contribution: 0, next: 'Not scheduled', status: 'In progress' }
    ],
    goalActivity: [],

    // Status: active | paused | cancelled.
    subscriptions: [
      { id: 'mobile-plan', name: 'Mobile plan', merchant: 'Telco One', date: 'Sep 22', amount: 32, cadence: 'Monthly', status: 'active' },
      { id: 'streaming-service', name: 'Streaming service', merchant: 'Streamly', date: 'Sep 24', amount: 14.99, cadence: 'Monthly', status: 'active' },
      { id: 'river-gym', name: 'River Gym', merchant: 'River Gym Ltd', date: 'Oct 02', amount: 34, cadence: 'Monthly', status: 'active' }
    ],

    notifications: [
      { id: 'payment', title: 'Review card payment', read: false },
      { id: 'rent', title: 'Rent is due in 5 days', read: false },
      { id: 'savings', title: 'Emergency buffer on track', read: true }
    ],
    notificationPrefs: { payments: true, bills: true, savings: true, security: true, weekly: false, channel: 'push' },

    devices: [
      { id: 'iphone-16-pro', name: 'iPhone 16 Pro', kind: 'phone', location: 'Ho Chi Minh City', lastActive: 'Active now', current: true },
      { id: 'macbook-pro', name: 'MacBook Pro', kind: 'laptop', location: 'Ho Chi Minh City', lastActive: '2 hours ago', current: false },
      { id: 'ipad-air', name: 'iPad Air', kind: 'tablet', location: 'Da Nang', lastActive: '9 days ago', current: false }
    ],
    securityLog: [
      { when: 'Today, 09:42', what: 'Biometric confirmation used', detail: 'Transfer review' },
      { when: 'Yesterday, 18:11', what: 'Login from trusted device', detail: 'MacBook Pro' },
      { when: '12 Sep, 14:08', what: 'Card controls reviewed', detail: 'No changes made' }
    ],
    passcodeChanged: '4 months ago',

    card: { last4: '4821', replacement: null, atmMonthly: 500, contactlessTap: 100 },

    // Dispute drafts the visitor prepares from a transaction. Never sent anywhere.
    disputes: [],

    settings: { dateFormat: 'DD MMM YYYY' }
  });
})();
