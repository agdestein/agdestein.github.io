import { themes } from './themes';
export function setupSite() {
  const root=document.documentElement;
  const trigger=document.querySelector<HTMLButtonElement>('[data-theme-toggle]')!;
  const panel=document.querySelector<HTMLElement>('#theme-panel')!;
  const options=[...document.querySelectorAll<HTMLButtonElement>('[data-theme-option]')];
  const motionButton=document.querySelector<HTMLButtonElement>('[data-motion-toggle]')!;
  const save=(key:string,value:string)=>{try{localStorage.setItem(key,value);}catch{}};
  function sync() {
    const current=root.dataset.theme || 'aurora';
    options.forEach(b=>{const selected=b.dataset.themeOption===current;b.setAttribute('aria-checked',String(selected));b.tabIndex=selected?0:-1;});
    const motion=root.dataset.motion!=='off';motionButton.textContent=motion?'On':'Off';motionButton.setAttribute('aria-pressed',String(motion));
    const index=themes.findIndex(t=>t.id===current);
    const theme=themes[index] || themes[0];
    document.querySelectorAll('[data-scene-label]').forEach(e=>e.textContent=`${String(index+1).padStart(2,'0')} / ${theme.label} · ${theme.caption}`);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',getComputedStyle(root).getPropertyValue('--bg').trim());
  }
  function closePanel(focus=false) { panel.hidden=true;trigger.setAttribute('aria-expanded','false');if(focus)trigger.focus(); }
  trigger.addEventListener('click',()=>{panel.hidden=!panel.hidden;trigger.setAttribute('aria-expanded',String(!panel.hidden));});
  options.forEach((button,index)=>{
    const choose=()=>{root.dataset.theme=button.dataset.themeOption;save('sda-theme',root.dataset.theme!);sync();};
    button.addEventListener('click',choose);
    button.addEventListener('keydown',e=>{if(['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?options.length-1:(index+(['ArrowDown','ArrowRight'].includes(e.key)?1:-1)+options.length)%options.length;options[next].click();options[next].focus();}});
  });
  motionButton.addEventListener('click',()=>{root.dataset.motion=root.dataset.motion==='off'?'on':'off';save('sda-motion',root.dataset.motion!);sync();});
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  reduced.addEventListener('change',e=>{let explicit=false;try{explicit=!!localStorage.getItem('sda-motion');}catch{}if(!explicit){root.dataset.motion=e.matches?'off':'on';sync();}});
  document.addEventListener('click',e=>{if(!panel.hidden && !trigger.parentElement!.contains(e.target as Node))closePanel();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)closePanel(true);});
  const menu=document.querySelector<HTMLButtonElement>('[data-menu-toggle]')!, mobile=document.querySelector<HTMLElement>('#mobile-nav')!;
  menu.addEventListener('click',()=>{mobile.hidden=!mobile.hidden;menu.setAttribute('aria-expanded',String(!mobile.hidden));menu.setAttribute('aria-label',mobile.hidden?'Open navigation':'Close navigation');});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobile.hidden){mobile.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');menu.focus();}});
  const dialog=document.querySelector<HTMLDialogElement>('.search-dialog')!, input=document.querySelector<HTMLInputElement>('#site-search')!;
  const results=document.querySelector('.search-results')!, status=document.querySelector('.search-status')!;
  const entries: {title:string,description:string,kind:string,url:string}[]=JSON.parse(document.querySelector('#search-data')!.textContent!);
  function search() {
    const query=input.value.trim().toLowerCase();results.replaceChildren();
    if(!query){status.textContent='Search by title, topic, author, or venue.';return;}
    const hits=entries.filter(e=>`${e.title} ${e.description}`.toLowerCase().includes(query));
    status.textContent=hits.length?`${hits.length} result${hits.length===1?'':'s'}${hits.length>15?' · showing the first 15':''}`:'No matches. Try another word.';
    for(const hit of hits.slice(0,15)){const li=document.createElement('li'),a=document.createElement('a'),small=document.createElement('small');a.href=hit.url;a.textContent=hit.title;small.textContent=hit.kind;a.append(small);li.append(a);results.append(li);}
  }
  const openSearch=()=>{closePanel();if(!dialog.open)dialog.showModal();input.focus();search();};
  document.querySelector('[data-search-open]')!.addEventListener('click',openSearch);
  document.querySelector('[data-search-close]')!.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();dialog.close();}});
  dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
  document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();openSearch();}});
  input.addEventListener('input',search);sync();
}
