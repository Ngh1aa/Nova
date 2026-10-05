(() => {
  'use strict';
  const manifest=window.NovaExportManifest;
  const search=document.querySelector('#search'),group=document.querySelector('#group'),viewport=document.querySelector('#viewport');
  const escape=text=>String(text).replace(/[&<>"']/g,value=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[value]));
  for(const name of new Set(manifest.screens.map(item=>item.group)))group.add(new Option(name,name));
  document.querySelector('#deployment').textContent=manifest.deployment_status==='NOT_DEPLOYED'?'Local export package. Public URLs will be confirmed after deployment.':'Export deployment: '+manifest.deployment_status+'. The capture URLs use the origin of this page.';
  function render(){
    const matches=manifest.screens.filter(item=>(!group.value||item.group===group.value)&&(`${item.number} ${item.name} ${item.group}`.toLowerCase().includes(search.value.trim().toLowerCase())));
    document.querySelector('#count').textContent=`${matches.length} / 70 screens`;
    const size=manifest.viewports.find(item=>item.width===Number(viewport.value));
    document.querySelector('#screens').innerHTML=matches.map(item=>`<tr><th scope="row">${item.number}</th><td><strong>${escape(item.name)}</strong><small>${escape(item.group)} · ${size.width} × ${size.height}</small><small>${escape(item.audit.status)}</small></td><td class="state-column"><code>${escape(item.canonical_state.screen)} / ${escape(item.canonical_state.state)}</code></td><td><div class="capture-actions"><a href="${item.path}" target="_blank" rel="noopener">Open</a><button type="button" data-copy="${item.path}">Copy URL</button></div><small>${item.path}</small></td><td><span class="status ${item.ready?'status-success':'status-pending'}">${item.ready?'Ready · local QA':'QA pending'}</span><small>${escape(item.public_status)}</small></td></tr>`).join('');
  }
  document.querySelector('#screens').addEventListener('click',async event=>{
    const button=event.target.closest('[data-copy]');if(!button)return;
    const url=location.origin+button.dataset.copy;
    try{await navigator.clipboard.writeText(url);document.querySelector('#feedback').textContent=`Copied ${url}. Set dMaya to ${viewport.selectedOptions[0].textContent}.`;}catch{document.querySelector('#feedback').textContent=`Copy this URL: ${url}`;}
  });
  for(const element of [search,group,viewport])element.addEventListener(element===search?'input':'change',render);
  render();
})();
