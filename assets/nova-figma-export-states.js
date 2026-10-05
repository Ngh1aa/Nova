/* Export compositions extend canonical product components. No banking service is connected. */
(() => {
  'use strict';
  const capture = window.NovaExport;
  if (!capture?.entry) {
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelector('#app').innerHTML = '<main><h1>Export screen not found</h1><p>Choose one of the 70 screens from the <a href="/figma-export/">export index</a>.</p></main>';
    }, { once: true });
    return;
  }
  const { entry } = capture;
  let data, ui, main;
  const escape = text => String(text).replace(/[&<>"']/g, value => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[value]));
  const href = number => capture.manifest.screens.find(item => item.number === number).path;
  const action = (number, label, secondary = false) => `<a class="btn ${secondary ? 'btn-secondary' : 'btn-primary'}" href="${href(number)}">${escape(label)}</a>`;
  const actions = (...links) => `<div class="action-stack">${links.join('')}</div>`;
  const notice = (title, text, kind = '') => `<div class="callout ${kind ? 'callout-' + kind : ''}" role="status"><strong>${escape(title)}</strong><p>${escape(text)}</p></div>`;
  const rows = pairs => `<div class="review-list">${pairs.map(([label,value]) => `<div class="review-row"><span>${escape(label)}</span><strong>${escape(value)}</strong></div>`).join('')}</div>`;
  const field = (id,label,value = '',type = 'text',hint = '') => `<div class="field"><label for="${id}">${escape(label)}</label><input class="input" id="${id}" type="${type}" value="${escape(value)}" ${type==='number'?'min="0" step="0.01"':''} ${hint ? `aria-describedby="${id}-hint"` : ''}>${hint ? `<span class="field-hint" id="${id}-hint">${escape(hint)}</span>` : ''}</div>`;
  const panel = (title, body) => `<section class="task-panel"><h2>${escape(title)}</h2>${body}</section>`;
  const money = value => ui.euro(value, value < 0);
  const boundary = '<p class="export-simulation">Portfolio prototype · fictional account and identity data. No real money, credentials, documents or bank requests are submitted.</p>';
  function page(title, description, content, back) {
    main.className = 'main-wrap export-page';
    main.innerHTML = ui.pageHeader(title, description, back ? href(back) : '') + content + boundary;
  }
  const columns = (left,right) => `<div class="export-columns"><div class="export-stack">${left}</div><div class="export-stack">${right}</div></div>`;
  function cardObject() {
    // Use the final canonical card composition, including current Nova brand assets.
    return document.querySelector('.v3-bank-card')?.outerHTML || '';
  }
  function cardDetail(state) {
    const card = cardObject();
    const title = state === 'restricted' ? 'Card restricted' : state === 'frozen' ? 'Card frozen' : 'Everyday debit card';
    const explanation = state === 'restricted' ? 'Contact support to review this restriction. Self-service unfreeze is unavailable.' : state === 'frozen' ? 'New payments and ATM withdrawals are paused. Your saved preferences remain unchanged.' : 'Your card is active. Review its controls before changing how it can be used.';
    const controls = state === 'restricted' ? '<button class="btn btn-primary" disabled aria-disabled="true">Self-unfreeze unavailable</button>'+action(58,'Contact support',true) : state === 'frozen' ? action(19,'Authenticate to unfreeze') : action(16,'Freeze card',true);
    page(title, explanation, columns(panel('Card ending 4821',card+rows([['Status',state[0].toUpperCase()+state.slice(1)],['Type','Debit · prototype'],['Daily limit','€1,200'],['Valid through','09/29']])), panel('Protection & controls',notice(title,explanation,state==='restricted'?'risk':'')+actions(controls,action(42,'Spending controls',true),action(44,'Card activity',true)))),38);
  }
  function result(title,text,links,details = []) {
    page(title,text,panel('Prototype result',`<div class="export-status-mark">${ui.icon('check')}</div>${notice(title,text,'success')}${rows(details)}${links}`));
  }
  function authentication(purpose, success, back) {
    page(purpose,'Authenticate before a sensitive action. This capture previews a device confirmation.',columns(panel('Confirm with biometrics',`<div class="export-status-mark">${ui.icon('lock')}</div><h3>Use your device to continue</h3><p>Card ending 4821 · ${escape(purpose)}</p>${notice('Authentication required','No card setting has changed yet. Biometrics are simulated in this prototype.')}${actions(action(success,'Simulate authentication success'),action(back,'Cancel',true))}`),panel('What will change',rows([['New card payments','Restored after confirmation'],['ATM withdrawals','Restored after confirmation'],['Existing payment','Not reversed'],['Merchant subscriptions','Not cancelled']]))),40);
  }
  function transactionState(kind) {
    const t=data.suspicious;
    if(kind==='normal'){
      const payment=data.transactions[0];
      page(payment[0],'A completed everyday card payment.',columns(panel('Payment details',`<p class="eyebrow">${escape(payment[4])} · Card ending 4821</p><div class="export-number">${escape(money(payment[2]))}</div>${rows([['Status','Completed'],['Category',payment[1]],['Channel','Online card'],['Card','•••• 4821']])}`),panel('Need help with this payment?',notice('Payment recognised','No unusual-activity alert is attached to this payment.')+actions(action(18,'Preview report steps',true),action(10,'Back to activity',true)))),10);
    }else if(kind==='recognition'){
      page('Do you recognise this payment?','Check the merchant, time and card before choosing a protective action.',columns(panel(t.merchant,rows([['Amount',money(-t.amount)],['Time',t.timestamp],['Location',t.location],['Card',t.card]])+actions(action(14,'Yes, review payment',true),action(16,'No, protect my card'))),panel('Why Nova surfaced it',notice('Unusual does not mean confirmed fraud',t.reasons.join(' · '),'warning')+'<p>Recognising a merchant does not reverse the payment. If you are unsure, pause new card activity while you investigate.</p>')),14);
    }else if(kind==='restricted'){
      page('Review payment · card restricted','The payment remains completed while access to the card is restricted.',columns(panel(t.merchant,rows([['Amount',money(-t.amount)],['Payment status','Completed'],['Card status','Restricted'],['Card',t.card]])),panel('Support review required',notice('Self-unfreeze is unavailable','This restriction requires support review. Freezing or unfreezing cannot reverse the payment.','risk')+actions('<button class="btn btn-secondary" disabled aria-disabled="true">Unfreeze unavailable</button>',action(58,'Contact support')))),14);
    }
  }
  function moneyOverview(kind) {
    if(kind==='stale'){
      main.prepend(Object.assign(document.createElement('div'),{innerHTML:notice('Offline · estimate may be out of date','Last known snapshot: 15 Sep, 09:42. Reconnect to revalidate before a money action.','warning')}));
      main.querySelectorAll('.decision-action,.v2-quick-btn,.v2-quick-actions a').forEach(node=>{node.removeAttribute('href');node.setAttribute('aria-disabled','true');node.setAttribute('role','link');});
      main.querySelectorAll('time').forEach(node=>node.textContent='Last known · 09:42');
      const footer=document.createElement('section');footer.innerHTML=actions(action(1,'Reconnect demo'));main.append(footer);
    }else if(kind==='horizon'){
      const forecast=main.querySelector('.fi-horizon')?.outerHTML || ui.horizon();
      page('Money Horizon','Your estimate for the next 14 days, after known commitments and the protected buffer.',forecast+columns(panel('How safe to spend is calculated',rows([['Total balance',money(data.account.balance)],['Known bills',money(data.account.committed)],['Planned saving',money(data.account.goal)],['Protected buffer',money(data.account.buffer)],['Safe to spend',money(data.account.safe)]])),panel('Included in this horizon',ui.commitmentRows()+actions(action(7,'Review all commitments',true)))),1);
    }else if(kind==='commitments'){
      page('Upcoming commitments','Known bills inside the next 14 days are reserved before safe to spend.',columns(panel('Scheduled bills',ui.commitmentRows()),panel('Planning summary',rows([['Known bills',money(data.account.committed)],['Planned saving',money(data.account.goal)],['Reserved commitments',money(data.account.committed+data.account.goal)],['Protected separately',money(data.account.buffer)]])+actions(action(23,'Recurring payments',true),action(6,'Money Horizon',true)))),1);
    }else{
      const insight=main.querySelector('.insight-line')?.textContent?.trim() || 'Dining is above your recent weekly pattern';
      page('Dining spending insight','A contextual prompt to review the fictional recent spending pattern.',columns(panel('This week',`<p class="eyebrow">Spending comparison</p><div class="export-number">€34 above</div><p>${escape(insight)}</p>${notice('Planning prompt, not advice','This sample comparison does not assess financial health or predict future spending.')}`),panel('Choose your next step',actions(action(49,'Review spending'),action(50,'Categories & merchants',true),action(1,'Return home',true)))),1);
    }
  }
  function savings(kind) {
    if(kind==='goal'){
      page(data.goal.name,'Keep the goal progress and planned contribution in the same money context.',columns(panel('Goal progress',`<p class="eyebrow">${escape(data.goal.status)}</p><div class="export-number">${money(data.goal.current)}</div><p>of ${money(data.goal.target)} · ${Math.round(data.goal.current/data.goal.target*100)}% complete</p><div class="progress"><span style="width:${data.goal.current/data.goal.target*100}%"></span></div>${rows([['Remaining',money(data.goal.target-data.goal.current)],['Monthly plan',money(data.goal.contribution)],['Next contribution',data.goal.next]])}${actions(action(47,'Contribution settings'),action(48,'Goal activity',true))}`),panel('Planning impact',ui.horizon(true))),45);
    }else{
      page('Emergency buffer activity','A fictional goal ledger; these records are not live account events.',panel('Contribution history',rows([['28 Aug 2026','+€260.00 · demo contribution'],['28 Jul 2026','+€260.00 · demo contribution'],['28 Jun 2026','+€260.00 · demo contribution'],['28 Sep 2026','€260.00 · planned, not moved']])+actions(action(46,'Goal detail',true),action(47,'Adjust contribution',true))),46);
    }
  }
  function insights(kind) {
    const outgoing=data.transactions.filter(item=>item[2]<0);
    const total=outgoing.reduce((sum,item)=>sum-item[2],0);
    const categories=Object.entries(outgoing.reduce((groups,item)=>{groups[item[1]]=(groups[item[1]]||0)-item[2];return groups;},{})).sort((a,b)=>b[1]-a[1]);
    const bars=items=>`<ul class="export-bars">${items.map(([label,amount])=>`<li><div class="bar-heading"><span>${escape(label)}</span><strong>${money(amount)}</strong></div><div class="bar-track"><div class="bar-fill" style="width:${amount/total*100}%"></div></div></li>`).join('')}</ul>`;
    if(kind==='comparison'){
      page('Month comparison','Compare the sample ledger with an explicitly fictional previous-period baseline.',columns(panel('September · sample transactions',`<div class="export-number">${money(total)}</div>${rows([['August sample baseline','€400.00'],['Difference',money(total-400)],['Scope','Sample ledger, not full monthly spending']])}`),panel('Comparison scope',notice('Illustrative baseline','August is an export-only fixture. This is not measured customer behaviour or an outcome claim.')+bars(categories)+actions(action(49,'Spending',true)))),49);
    }else{
      page(kind==='categories'?'Categories & merchants':'Spending overview','Spending from Nova’s canonical fictional transaction sample.',columns(panel('Money out · sample ledger',`<div class="export-number">${money(total)}</div>${bars(categories)}${actions(action(51,'Compare months',true))}`),panel(kind==='categories'?'Merchant breakdown':'Latest payments',kind==='categories'?rows(outgoing.map(item=>[item[0],money(-item[2])])):ui.transactionRows(5,true))),10);
    }
  }
  function profile(kind) {
    if(kind==='personal'){
      page('Personal details','Review fictional profile details. Edits in an export capture are not saved.',panel('Your profile',`<div class="export-identity">${field('profile-name','Full name','Lina Moreau')}${field('profile-email','Email address','lina@example.invalid','email')}${field('profile-phone','Phone number','+33 ••• ••• 42')}${field('profile-address','Address','Sample address · Paris')}</div>${notice('Identity changes need verification','Legal name and contact changes would require secure verification in a real service.')}${actions(action(53,'Security center',true))}`),53);
    }else if(kind==='credentials'){
      page('Biometrics & passcode','Choose how sensitive actions are confirmed.',panel('Authentication methods',`<div class="control-list"><div class="control-row"><div><strong>Biometric confirmation</strong><p>Simulated device verification for transfers and card changes.</p></div><label class="switch"><span class="sr-only">Biometrics enabled</span><input type="checkbox" checked><span></span></label></div><div class="control-row"><div><strong>Passcode fallback</strong><p>A recovery option when biometrics are unavailable.</p></div><span class="status status-success">Available</span></div></div>${notice('Demo-only authentication','No biometric template or production credential is collected.')}${actions(action(32,'Inspect passcode fallback',true))}`),53);
    }else if(kind==='devices'){
      page('Devices & sessions','Recognise trusted devices and review account access.',panel('Fictional active sessions',rows([['This device','Browser demo · current session'],['iPhone 16 Pro','Sample trusted device · 15 Sep, 09:42'],['Apple Watch','Sample paired device']])+notice('Removing access has consequences','A real session revocation would require authentication. This export does not revoke any device.')+actions(action(57,'Secure account',true))),53);
    }else if(kind==='notification-privacy'){
      page('Notification privacy','Keep sensitive amounts and merchant details off a locked screen.',columns(panel('Preview preference',`<label class="export-choice"><input type="radio" name="preview" checked>Hide sensitive details on the lock screen</label><label class="export-choice"><input type="radio" name="preview">Show merchant and amount</label>${notice('Private preview','Nova · A payment needs your review. Open Nova for details.')}`),panel('Inside Nova',notice('Full detail after access','€189.40 · ByteMart Online · unusual card activity','warning')+actions(action(9,'Open notifications',true)))),53);
    }else if(kind==='emergency'){
      page('Secure your account','Card protection and account-access recovery have different consequences.',columns(panel('Protect card payments',notice('Pause card ending 4821','New payments and ATM withdrawals stop. Already authorised payments may still settle.','warning')+actions(action(16,'Review freeze impact'))),panel('Recover account access',notice('Review suspicious access','Contact support if you lost your device or see an unfamiliar session. No real access is revoked by this prototype.')+actions(action(55,'Review devices',true),action(58,'Contact support',true)))),53);
    }else{
      page('Help & support','Choose the right next step for the issue you are reviewing.',panel('How can we help?',actions(action(18,'Question a transaction',true),action(57,'Lost card or device',true),action(70,'Identity verification help',true))+notice('Support preview','This portfolio demo has no live support team or bank case system. Nothing is submitted.')),53);
    }
  }
  function kyc(kind) {
    const intro=kind==='verification'?0:kind==='personal'?1:kind==='id-type'?2:kind==='selfie'?4:5;
    const labels=['Contact','Details','Document','Capture','Selfie','Review'];
    const steps=`<nav class="export-steps" aria-label="Identity verification progress">${labels.map((label,i)=>i===intro?`<strong aria-current="step">${i+1}. ${label}</strong>`:`<span>${i+1}. ${label}</span>`).join('')}</nav>`;
    const identity=rows([['Legal name','Lina Moreau'],['Date of birth','14 Apr 2001'],['Country','France'],['Document','Sample ID •••• 7231'],['Submission','Not submitted · demo']]);
    if(kind==='verification'){
      page('Verify your contact details','A fictional code preview. No text message or email is sent.',steps+columns(panel('Phone verification',field('kyc-phone','Phone number','+33 ••• ••• 42')+field('kyc-code','Verification code','123456','text','Use only this fictional sample. Do not enter a real one-time code.')+actions(action(62,'Verify demo code'))),panel('Email verification',field('kyc-email','Email address','lina@example.invalid','email')+notice('Verified in this demo','This is a fixture, not an identity check.'))),60);
    }else if(kind==='personal'){
      page('Your legal details','Use fictional details to inspect the identity-verification flow.',steps+panel('Personal information',`<div class="export-identity">${field('kyc-name','Legal name','Lina Moreau')}${field('kyc-birth','Date of birth','2001-04-14','date')}${field('kyc-country','Country of residence','France')}${field('kyc-address','Residential address','Fictional address · Paris')}</div>${notice('Why these details','A real regulated service would explain purpose, retention and privacy before collecting identity data.')}${actions(action(63,'Choose identification'))}`),61);
    }else if(kind==='id-type'){
      page('Choose your photo ID','Select a document you can capture clearly.',steps+panel('Document type',`<label class="export-choice"><input type="radio" name="document" checked>National identity card</label><label class="export-choice"><input type="radio" name="document">Passport</label><label class="export-choice"><input type="radio" name="document">Residence permit</label><p class="meta">Use an unexpired document. Available types in a real product would depend on country and provider.</p>${actions(action(64,'Continue to capture'),action(70,'Need another option?',true))}`),62);
    }else if(kind==='selfie'){
      page('Check that it is you','Keep your face visible in even light. This demo never opens a camera.',steps+columns(panel('Selfie guidance',`<div class="export-capture-frame">${ui.icon('user')}<strong>Keep your face in the frame</strong><span>Remove sunglasses · avoid backlighting · stay still</span></div>${actions(action(66,'Use demo selfie'),action(70,'Cannot use this method?',true))}`),panel('Privacy & access',notice('No image is recorded','A real product must explain biometric processing and provide an accessible alternative.')+'<p>Document and face checks have separate failure and recovery paths.</p>')),64);
    }else if(kind==='submitted'){
      page('Review identity details','Check the sample details before the simulated submission.',steps+columns(panel('Check every detail',identity+actions(action(67,'Submit demo & view result'),action(62,'Edit details',true))),panel('Before you continue',notice('No identity data leaves Nova','This capture previews a submission. No verification provider is connected.')+actions(action(64,'Retake document',true)))),65);
    }else if(kind==='approved'){
      result('Identity approved · demo','This is a simulated approval. No identity has been verified by a real provider.',actions(action(1,'Explore demo account'),action(52,'Review profile',true)),[['Identity state','Approved in fictional scenario'],['Real verification','Not performed']]);
    }else{
      page('More information needed','Your verification is paused. The demo has not submitted identity data.',steps+columns(panel('Address detail needs review',notice('Proof of address requested','A fictional mismatch requires a clearer address document before review can continue.','warning')+rows([['Document types','Utility bill or bank statement · sample'],['Requirements','Full name, address and readable date'],['Status','Awaiting additional information']])+actions(action(64,'Preview new capture'),action(70,'Use support path',true))),panel('What happens next',notice('Keep your place','A real service would retain consented progress and explain review timing. No approval is promised here.'))),66);
    }
  }
  function transfer(kind) {
    if(kind==='add-recipient'){
      page('Add a recipient','Inspect a new-recipient form. This export does not save or verify a bank account.',ui.stepper(1)+columns(panel('Recipient details',field('recipient-name','Full name','','text','Use fictional details only.')+field('recipient-bank','Bank name')+field('recipient-account','IBAN or account number')+notice('Verification required','A real service would verify account format and ownership before sending.')+actions(action(25,'Return to saved recipients',true))),panel('Before a first payment','<p>Confirm the name and account details through a trusted channel. Never treat this preview as a verified recipient.</p>')),25);
    }else if(kind==='insufficient'){
      const amount=main.querySelector('#amount');
      amount.value=entry.canonical_state.storage.nova_transfer_amount;
      amount.dispatchEvent(new Event('input',{bubbles:true}));
      main.querySelector('#amount-form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
    }else if(kind==='revalidated'){
      const status=document.createElement('div');status.innerHTML=notice('Reconnected · review revalidated','Demo balance €2,840.00 and transfer €145.00 checked again. Safe to spend after confirmation: €1,155.00. No money moved.','success');
      main.querySelector('.task-panel')?.prepend(status);
    }else if(kind==='processing'){
      page('Preparing your transfer','This pinned processing state does not advance automatically.',ui.stepper(4)+columns(panel('Confirmation in progress',`<div class="export-status-mark">${ui.icon('clock')}</div><h3>Checking your confirmation</h3>${rows([['Recipient',data.recipient.name],['Amount',money(data.recipient.amount)],['Reference',data.recipient.reference]])}<p role="status" aria-live="polite">Processing demo confirmation… No real money moves.</p><button class="btn btn-primary" disabled aria-disabled="true">Processing</button>`),panel('Avoid duplicate confirmation',notice('Keep this window open','A production flow would reconcile the payment status before offering a retry. This capture is permanently pinned.'))),29);
      main.querySelector('.task-panel').setAttribute('aria-busy','true');
    }else if(kind==='cancelled'){
      page('Transfer cancelled','The confirmation did not complete. No money moved.',columns(panel('Your balance is unchanged',notice('Not submitted','This cancellation occurred before a payment submission. There is no successful receipt.','warning')+rows([['Recipient',data.recipient.name],['Amount not sent',money(data.recipient.amount)],['Available balance',money(data.account.balance)],['Safe to spend',money(data.account.safe)]])+actions(action(29,'Review preserved transfer'),action(1,'Return home',true))),panel('Retry with context','<p>The amount, recipient and reference remain available in this fictional scenario. Review them before authenticating again.</p>')),29);
    }
  }
  const compositions = {
    5:()=>moneyOverview('stale'),6:()=>moneyOverview('horizon'),7:()=>moneyOverview('commitments'),8:()=>moneyOverview('insight'),
    11:()=>{const input=main.querySelector('#txn-search');input.value='Greenline';input.dispatchEvent(new Event('input',{bubbles:true}));},
    12:()=>[...main.querySelectorAll('.chip')].find(node=>node.textContent.trim()==='Needs review')?.click(),
    13:()=>transactionState('normal'),15:()=>transactionState('recognition'),16:()=>main.querySelector('#freeze-card')?.click(),
    17:()=>result('Card frozen','New payments and ATM withdrawals are paused in this demo. The existing payment remains completed.',actions(action(18,'Preview report steps'),action(40,'Review frozen card',true)),[['Card','•••• 4821'],['Existing transaction','Not reversed'],['Merchant subscriptions','Not cancelled']]),
    19:()=>authentication('Unfreeze card',20,40),20:()=>result('Card active again','Simulated authentication completed. New payments follow your saved control preferences.',actions(action(39,'Review active card'),action(1,'Return home',true)),[['Card','•••• 4821'],['Card status','Active'],['Payment history','Unchanged']]),
    22:()=>transactionState('restricted'),25:()=>{const recent=main.querySelector('.v4-transfer-list')?.closest('section');recent?.remove();const head=main.querySelector('h1');if(head)head.textContent='Choose a recipient';},
    26:()=>transfer('add-recipient'),28:()=>transfer('insufficient'),30:()=>main.querySelector('#confirm-transfer')?.click(),32:()=>main.querySelector('#use-passcode')?.click(),
    34:()=>transfer('revalidated'),35:()=>transfer('processing'),37:()=>transfer('cancelled'),39:()=>cardDetail('active'),40:()=>cardDetail('frozen'),41:()=>cardDetail('restricted'),
    43:()=>{const controls=main.querySelector('.control-list');if(controls)controls.remove();const h=main.querySelector('h1');if(h)h.textContent='Card limits';},
    44:()=>{page('Card activity','Recent sample payments for card ending 4821.',panel('Latest card payments',ui.transactionRows(data.transactions.length,true)),38);},
    46:()=>savings('goal'),48:()=>savings('activity'),49:()=>insights('spending'),50:()=>insights('categories'),51:()=>insights('comparison'),
    52:()=>profile('personal'),54:()=>profile('credentials'),55:()=>profile('devices'),56:()=>profile('notification-privacy'),57:()=>profile('emergency'),58:()=>profile('support'),
    61:()=>kyc('verification'),62:()=>kyc('personal'),63:()=>kyc('id-type'),65:()=>kyc('selfie'),66:()=>kyc('submitted'),67:()=>kyc('approved'),69:()=>kyc('more-information')
  };
  function init() {
    data=window.NovaProduct.data;ui=window.NovaProduct.components;main=document.querySelector('#main');
    compositions[entry.number]?.();
    document.title='Nova — '+entry.name;
    main.dataset.exportId=entry.id;
    document.querySelectorAll('a[href*="app.html?screen="]').forEach(link=>{
      const route=new URL(link.href),screen=route.searchParams.get('screen'),state=route.searchParams.get('state')||'normal';
      const destination=capture.manifest.screens.find(item=>item.canonical_state.screen===screen&&item.canonical_state.state===state);
      if(destination)link.href=destination.path;
    });
    // Export routes are capture fixtures. Native prototype interactions are QA'd on app.html.
    // Ready is emitted only after fonts/layout settle, for consumers and browser verification.
    Promise.resolve(document.fonts?.ready).then(()=>requestAnimationFrame(()=>{
      document.documentElement.dataset.exportReady='true';
      window.dispatchEvent(new CustomEvent('nova:export-ready',{detail:{id:entry.id}}));
    }));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
