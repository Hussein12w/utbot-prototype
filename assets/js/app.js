/* Bulldozer — interactive frontend prototype. Vanilla JS, hash routing, no backend, nothing is stored. */
(function(){
'use strict';
const S = { lang:'ar', user:null, favs:new Set(['l3','m4']), city:'', post:null, f:{}, slide:0, notifRead:false, gal:null, coType:'', lastPath:null, keepScroll:false, q:'' };
try { const l = localStorage.getItem('utbot_lang'); if (l==='en'||l==='ar'||l==='ur') S.lang = l; } catch(e) {}
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const t = k => (I18N[S.lang][k] !== undefined ? I18N[S.lang][k] : (I18N.en[k] !== undefined ? I18N.en[k] : k));
const L = o => !o ? '' : (typeof o === 'string' ? o : (o[S.lang] !== undefined ? o[S.lang] : o.en));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = n => new Intl.NumberFormat('en-US', {maximumFractionDigits:2}).format(n);
const byId = (a, id) => a.find(x => x.id === id);
const cat = id => byId(CATS, id) || {};
const city = id => byId(CITIES, id) || {};
const co = id => byId(COMPANIES, id) || {};
const title = it => it[S.lang] || it.en;
const desc = it => it['d' + S.lang] || it.den;
const LANGS = ['ar','en','ur'];
const langBtns = () => LANGS.map(l => `<button data-act="setlang" data-l="${l}" class="${S.lang===l?'on':''}" lang="${l}">${I18N[l].lang_name}${S.lang===l?ic('check','sm'):''}</button>`).join('');
const ago = d => d === 0 ? t('today') : t('ago_d').replace('{n}', d);
const artOf = it => it.art || cat(it.cat).art;
const vOf = id => (parseInt(String(id).replace(/\D/g,''),10) || 0) % 4;
const priceHTML = (p, unit) => `<span class="price">${fmt(p)} <small>${t('cur')}${unit && unit !== 'total' ? ' ' + t('u_' + unit) : ''}</small></span>`;
const pic = (dir, name) => `<img class="ph" src="assets/img/${dir}/${name}.jpg" alt="" loading="lazy" onload="this.classList.add('ok')" onerror="this.remove()">`;
const photo = (id, suf='') => `<img class="ph" src="assets/img/listings/${id}${suf}.jpg" alt="" loading="lazy" onload="this.classList.add('ok')" onerror="this.remove()">`;

const P = {
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  pin:'<path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
  chev:'<path d="m9 18 6-6-6-6"/>', chevl:'<path d="m15 18-6-6 6-6"/>',
  cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  gauge:'<path d="M12 14l4-4"/><path d="M3.3 19a10 10 0 1 1 17.4 0"/>',
  phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  chat:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
  flag:'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>', close:'<path d="M18 6 6 18M6 6l12 12"/>',
  upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  building:'<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
  road:'<path d="M4 22 9 2M20 22 15 2M12 4v2M12 10v3M12 17v3"/>',
  truck:'<path d="M10 17h4V5H2v12h3M14 9h4l4 4v4h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>',
  star:'<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  filter:'<path d="M22 3H2l8 9.5V19l4 2v-8.5z"/>',
  home:'<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  box:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
  tag:'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><circle cx="7" cy="7" r="1.5"/>',
  crane:'<path d="M6 21V3l13 4H6M3 21h7M15 7v5"/><rect x="13" y="12" width="4" height="3" rx=".5"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
  send:'<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  users:'<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M16 3.1a4 4 0 0 1 0 7.8M22 21a7 7 0 0 0-4-6.3"/>',
  eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  edit:'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  wa:'<path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.6z"/><path d="M9 9.5c.2 2 2.4 4.3 4.5 4.6l1.2-1.2 2 1-.4 1.6c-3.7.4-8.5-3.9-8.2-7.6L9.7 7.5l1 2z"/>'
};
const ic = (n, c='') => `<svg class="ic ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]||''}</svg>`;
const logoMark = () => `<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="10" fill="#F7B500"/><path d="M8 29h24l-3.5 5h-17z" fill="#1E1F22"/><path d="M13 29V18l8.5-7 7.5 6-3.6 4.4-4-3.2-2.6 2.1V29" fill="none" stroke="#1E1F22" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
const logo = () => `<a href="#/" class="logo" aria-label="Bulldozer"><span class="logo-mark">${logoMark()}</span><span class="logo-word">Bull<b>dozer</b></span></a>`;

/* ---------------- Shell ---------------- */
const NAV = [
  ['', 'home', 'home', '#/'], ['equipment', 'equipment', 'crane', '#/equipment'], ['materials', 'materials', 'box', '#/materials'],
  ['projects', 'projects', 'road', '#/projects'], ['companies', 'companies', 'building', '#/companies'], ['services', 'services', 'wrench', '#/services'], ['browse', 'rent_nav', 'tag', '#/browse/rent']
];
function shell(){
  const cityOpts = `<option value="">${t('all_uae')}</option>` + CITIES.map(c => `<option value="${c.id}"${S.city===c.id?' selected':''}>${L(c)}</option>`).join('');
  const notif = `<div class="pop notif-pop" id="notifPop" hidden><div class="pop-h"><b>${t('notifications')}</b><button class="link" data-act="notif-read">${t('mark_read')}</button></div>
    ${NOTIFS.map(n => `<div class="notif${S.notifRead?'':' unread'}"><span class="n-ic">${ic('bell')}</span><div><p>${esc(L(n))}</p><small>${t('ago_h').replace('{n}', n.h)}</small></div></div>`).join('')}</div>`;
  const userBox = S.user
    ? `<div class="pop-wrap"><button class="avatar-btn" data-act="umenu"><span class="avatar">${esc(S.user.name.trim().charAt(0))}</span><span class="only-d">${esc(S.user.name.split(' ')[0])}</span></button>
        <div class="pop user-pop" id="userPop" hidden><a href="#/account/ads">${ic('box')} ${t('my_ads')}</a><a href="#/account/favs">${ic('heart')} ${t('favorites')}</a><a href="#/account/msgs">${ic('chat')} ${t('messages')}</a><button data-act="logout">${ic('logout')} ${t('logout')}</button></div></div>`
    : `<a href="#/login" class="btn btn-dark only-d">${t('login')}</a>`;
  return `
  <div class="demo-strip" id="demoStrip"${S.hideStrip?' hidden':''}><div class="wrap">${ic('info')}<span>${t('demo_strip')}</span><button data-act="hide-strip" aria-label="close">${ic('close')}</button></div></div>
  <header class="hdr">
    <div class="wrap hdr-top">
      <button class="icon-btn only-m" data-act="drawer" aria-label="menu">${ic('menu')}</button>
      <div class="brand">${logo()}<div class="brand-txt"><strong>${t('brand_tag')}</strong><span>${t('brand_sub')}</span></div></div>
      <form class="search" data-form="search" role="search">
        <select name="scope" aria-label="scope"><option value="">${t('all')}</option><option value="equipment">${t('equipment')}</option><option value="materials">${t('materials')}</option></select>
        <input name="q" type="search" placeholder="${t('search_ph')}" value="${esc(S.q)}" aria-label="search">
        <button type="submit" aria-label="search">${ic('search')}</button>
      </form>
      <div class="hdr-actions">
        <label class="city-sel">${ic('pin')}<select data-act="city" aria-label="${t('city')}">${cityOpts}</select></label>
        <div class="pop-wrap"><button class="hbtn" data-act="langmenu" aria-label="language">${ic('globe')}<span>${t('lang_name')}</span></button><div class="pop lang-pop" id="langPop" hidden>${langBtns()}</div></div>
        <div class="pop-wrap"><button class="icon-btn bell" data-act="notif" aria-label="${t('notifications')}">${ic('bell')}${S.notifRead?'':'<i class="dot">3</i>'}</button>${notif}</div>
        ${userBox}
        <a href="#/post" class="btn btn-y post-btn">${ic('plus')}<span>${t('post_ad')}</span></a>
      </div>
    </div>
    <nav class="mainnav"><div class="wrap navrow">${NAV.map(n => `<a href="${n[3]}" data-nav="${n[0]}">${ic(n[2])}<span>${t(n[1])}</span></a>`).join('')}</div></nav>
  </header>
  <main id="view"></main>
  <footer class="ftr"><div class="wrap ftr-grid">
    <div class="ftr-about">${logo()}<p>${t('f_about')}</p><span class="badge-soon">${ic('phone')} ${t('download_app')}</span></div>
    <div><h4>${t('f_links')}</h4><a href="#/equipment">${t('equipment')}</a><a href="#/materials">${t('materials')}</a><a href="#/projects">${t('projects')}</a><a href="#/companies">${t('companies')}</a><a href="#/services">${t('services')}</a></div>
    <div><h4>${t('f_help')}</h4><a href="#" data-act="demo">${t('about')}</a><a href="#" data-act="demo">${t('pricing')}</a><a href="#" data-act="demo">${t('faq')}</a><a href="#" data-act="demo">${t('terms')}</a><a href="#" data-act="demo">${t('privacy')}</a></div>
    <div><h4>${t('f_contact')}</h4><p class="ltr">+971 4 000 0000</p><p class="ltr">hello@bulldozer.ae</p><p>${L(city('dxb'))} — ${t('x_country')}</p></div>
  </div><div class="wrap ftr-bot"><span>© 2026 Bulldozer — ${t('rights')}</span><span class="muted">${t('sample')}</span></div></footer>
  <nav class="tabbar">
    <a href="#/" data-tab="">${ic('home')}<span>${t('home')}</span></a>
    <a href="#/equipment" data-tab="equipment">${ic('grid')}<span>${t('equipment')}</span></a>
    <a href="#/post" class="tab-post" data-tab="post"><b>${ic('plus')}</b><span>${t('post_ad')}</span></a>
    <a href="#/fav" data-tab="fav">${ic('heart')}<span>${t('favorites')}</span></a>
    <a href="${S.user?'#/account/ads':'#/login'}" data-tab="account">${ic('user')}<span>${S.user?t('my_account'):t('login')}</span></a>
  </nav>
  <div class="drawer" id="drawer" hidden><div class="dr-bg" data-act="drawer"></div><aside class="dr-panel">
    <div class="dr-h">${logo()}<button class="icon-btn" data-act="drawer" aria-label="close">${ic('close')}</button></div>
    ${NAV.map(n => `<a href="${n[3]}" data-act="drawer-link">${ic(n[2])}<span>${t(n[1])}</span></a>`).join('')}
    <hr><a href="#/post" data-act="drawer-link">${ic('plus')}<span>${t('post_ad')}</span></a>
    <a href="${S.user?'#/account/ads':'#/login'}" data-act="drawer-link">${ic('user')}<span>${S.user?t('my_account'):t('login')}</span></a>
    <div class="dr-langs">${ic('globe')}${langBtns()}</div>
    <label class="city-sel dr-city">${ic('pin')}<select data-act="city">${cityOpts}</select></label>
  </aside></div>
  <div class="modal" id="modal" hidden></div>
  <div class="toasts" id="toasts" aria-live="polite"></div>`;
}
function renderShell(){
  document.documentElement.lang = S.lang;
  document.documentElement.dir = t('dir');
  document.title = t('x_title');
  document.getElementById('app').innerHTML = shell();
}

/* ---------------- Router ---------------- */
let heroTimer = null;
function route(){
  const h = location.hash.replace(/^#\/?/, '');
  const [path, qs] = h.split('?');
  const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
  const p = parts[0] || '';
  const params = new URLSearchParams(qs || '');
  if (S.lastPath !== path) { S.f = {deal:'', city:S.city, ymin:'', pmax:'', sort:'new'}; }
  clearInterval(heroTimer);
  let html;
  switch (p) {
    case '': html = vHome(); break;
    case 'equipment': case 'materials': html = vGroup(p); break;
    case 'c': html = vCat(parts[1]); break;
    case 'browse': html = vDeal(parts[1]); break;
    case 'featured': html = vList('featured'); break;
    case 'all': html = vList('all'); break;
    case 'search': html = vSearch(parts[1] || ''); break;
    case 'l': html = vListing(parts[1]); break;
    case 'projects': html = vProjects(); break;
    case 'p': html = vProject(parts[1]); break;
    case 'companies': html = vCompanies(); break;
    case 'co': html = vCompany(parts[1]); break;
    case 'services': html = vServices(); break;
    case 'post': html = vPost(params); break;
    case 'login': html = vLogin(params.get('tab')); break;
    case 'account': html = vAccount(parts[1] || 'ads'); break;
    case 'fav': html = vFavPage(); break;
    default: html = vNF();
  }
  $('#view').innerHTML = html;
  $$('[data-nav]').forEach(a => a.classList.toggle('on', a.dataset.nav === p || (p==='c' && a.dataset.nav === cat(parts[1]).g)));
  $$('[data-tab]').forEach(a => a.classList.toggle('on', a.dataset.tab === p || (p==='login' && a.dataset.tab==='account')));
  if (!S.keepScroll && S.lastPath !== path) window.scrollTo(0, 0);
  S.keepScroll = false; S.lastPath = path;
  if (p === '') heroTimer = setInterval(() => slide(1), 6500);
  if ($('#resGrid')) applyFilters();
}

/* ---------------- Components ---------------- */
function card(it){
  const c = cat(it.cat), fav = S.favs.has(it.id);
  const meta = it.deal === 'supply' ? `<span>${ic('box')} ${esc(L(it.qty))}</span>` : `<span>${ic('cal')} ${it.year}</span>`;
  return `<a class="card" href="#/l/${it.id}">
    <div class="media">${ART(artOf(it), vOf(it.id))}${photo(it.id)}
      <div class="badges">${it.featured?`<span class="b b-y">${t('featured_b')}</span>`:''}${it.isNew?`<span class="b b-g">${t('new_b')}</span>`:''}</div>
      <button class="fav${fav?' on':''}" data-fav="${it.id}" aria-label="${t('add_fav')}">${ic('heart')}</button>
      <span class="deal deal-${it.deal}">${t(it.deal)}</span></div>
    <div class="cbody"><div class="ctop"><span class="ccat">${L(c)}</span>${it.brand && it.brand!=='—' ? `<span class="cmodel">${esc(it.brand)} ${esc(it.model||'')}</span>` : ''}</div>
      <h3>${esc(title(it))}</h3>
      <div class="cmeta"><span>${ic('pin')} ${L(city(it.city))}</span>${meta}</div>
      <div class="cfoot">${priceHTML(it.price, it.unit)}<span class="ago">${ago(it.days)}</span></div></div></a>`;
}
const secHead = (h, link, linkTxt) => `<div class="sec-h"><h2>${h}</h2>${link?`<a href="${link}" class="more">${linkTxt||t('view_all')} ${ic('chev','flip')}</a>`:''}</div>`;
const catTile = c => `<a class="cat-tile" href="#/c/${c.id}"><div class="ct-art">${ART(c.art,0,true)}${pic('categories', c.id)}</div><span>${L(c)}</span></a>`;
const stars = r => `<span class="stars">${ic('star')} ${r.toFixed(1)}</span>`;
function coCard(c){
  return `<a class="co-card" href="#/co/${c.id}"><div class="co-logo" style="--c:${c.color}">${c.ab}</div><div class="co-info"><h3>${esc(L(c))} <span class="vf" title="${t('verified')}">${ic('shield')}</span></h3>
    <p>${t('type_'+c.type)} · ${L(city(c.city))}</p><div class="co-meta">${stars(c.rating)}<span>${c.n} ${t('listings_n')}</span></div></div></a>`;
}
function projCard(p){
  return `<a class="proj" href="#/p/${p.id}"><div class="proj-top"><span class="tag">${t(p.type)}</span><span class="ago">${ago(p.days)}</span></div>
    <h3>${esc(L(p))}</h3><p class="muted clamp2">${esc(desc(p))}</p>
    <div class="proj-meta"><span>${ic('pin')} ${L(city(p.city))}</span><span>${ic('clock')} ${p.dur} ${t('days')}</span><span>${ic('users')} ${p.bids} ${t('bids')}</span></div>
    <div class="proj-foot"><div><small>${t('budget')}</small><b>${fmt(p.b1)} – ${fmt(p.b2)} <em>${t('cur')}</em></b></div><span class="btn btn-sm btn-dark">${t('submit_offer')}</span></div></a>`;
}
function servCard(s){
  const c = co(s.seller);
  return `<div class="serv"><div class="serv-art">${ART(s.art, vOf(s.id))}${pic('services', s.id)}</div><div class="serv-b"><span class="tag">${t(s.type)}</span><h3>${esc(L(s))}</h3><p class="muted clamp2">${esc(desc(s))}</p>
    <div class="serv-f"><div><small>${t('from')}</small>${priceHTML(s.price, s.unit)}</div><button class="btn btn-sm btn-y" data-act="contact" data-seller="${s.seller}" data-svc="${s.id}">${t('request_service')}</button></div>
    <a class="serv-prov" href="#/co/${c.id}">${t('provider')}: ${esc(L(c))}</a></div></div>`;
}
const crumbs = arr => `<nav class="crumbs"><a href="#/">${t('home')}</a>${arr.map(a => `${ic('chev','flip sm')}${a[1]?`<a href="${a[1]}">${esc(a[0])}</a>`:`<span>${esc(a[0])}</span>`}`).join('')}</nav>`;

/* ---------------- Home ---------------- */
const SLIDES = [
  {img:'assets/img/hero-1.jpg', k:'hero1', b1:['#/equipment','explore_eq'], b2:['#/projects','view_projects']},
  {img:'assets/img/hero-2.jpg', k:'hero2', b1:['#/browse/rent','browse_rent'], b2:['#/post?type=rent','promo_btn']}
];
function slide(d, to){
  const n = SLIDES.length; S.slide = to !== undefined ? to : (S.slide + d + n) % n;
  $$('.slide').forEach((s,i) => s.classList.toggle('on', i === S.slide));
  $$('.dots button').forEach((s,i) => s.classList.toggle('on', i === S.slide));
}
function vHome(){
  const eqCats = CATS.filter(c => c.g === 'equipment'), matCats = CATS.filter(c => c.g === 'materials');
  const featured = LISTINGS.filter(l => l.featured && l.deal !== 'supply').slice(0, 8);
  const latest = LISTINGS.slice().sort((a,b) => a.days - b.days).slice(0, 10);
  const minP = id => Math.min(...LISTINGS.filter(l => l.cat === id).map(l => l.price));
  const unitOf = id => (LISTINGS.find(l => l.cat === id) || {}).unit;
  return `
  <section class="hero">
    ${SLIDES.map((s,i) => `<div class="slide${i===S.slide?' on':''}" style="background-image:url('${s.img}')"><div class="wrap hero-in"><div class="hero-txt">
      <h1><span>${t(s.k+'_a')}</span><span>${t(s.k+'_b')}</span><span class="y">${t(s.k+'_c')}</span></h1>
      <p class="lead">${t(s.k+'_p')}</p><p>${t(s.k+'_p2')}</p>
      <div class="hero-btns"><a class="btn btn-y btn-lg" href="${s.b1[0]}">${t(s.b1[1])}</a><a class="btn btn-white btn-lg" href="${s.b2[0]}">${t(s.b2[1])}</a></div>
    </div></div></div>`).join('')}
    <button class="hnav hl" data-act="slide" data-d="-1" aria-label="previous">${ic('chevl')}</button>
    <button class="hnav hr" data-act="slide" data-d="1" aria-label="next">${ic('chev')}</button>
    <div class="dots">${SLIDES.map((s,i) => `<button class="${i===S.slide?'on':''}" data-act="slide-to" data-i="${i}" aria-label="slide ${i+1}"></button>`).join('')}</div>
  </section>

  <section class="wrap intents">
    <div class="intent i-buy"><div class="i-txt"><h2>${t('buy_title')}</h2><p>${t('buy_desc')}</p>
      <div class="i-btns"><a class="btn btn-y" href="#/post?type=proj">${t('buy_btn')}</a><a class="btn btn-line" href="#/browse/sale">${t('sale')}</a><a class="btn btn-line" href="#/browse/rent">${t('rent')}</a></div></div></div>
    <div class="intent i-sell"><div class="i-txt"><h2>${t('sell_title')}</h2><p>${t('sell_desc')}</p>
      <div class="i-btns"><a class="btn btn-y" href="#/post">${t('sell_btn')}</a></div></div></div>
    <div class="stats">
      <div>${ic('crane')}<b>+15,000</b><span>${t('st_eq')}</span></div><div>${ic('building')}<b>+3,200</b><span>${t('st_co')}</span></div>
      <div>${ic('road')}<b>+8,000</b><span>${t('st_pr')}</span></div><div>${ic('users')}<b>+25,000</b><span>${t('st_us')}</span></div>
    </div>
  </section>

  <section class="wrap sec">${secHead(t('sec_eq'), '#/equipment')}
    <div class="cat-strip">${eqCats.map(catTile).join('')}<a class="cat-tile more-tile" href="#/materials">${ic('grid')}<span>${t('more_cats')}</span></a></div></section>

  <section class="wrap sec">${secHead(t('featured'), '#/featured')}<div class="grid">${featured.map(card).join('')}</div></section>

  <section class="wrap sec">${secHead(t('sec_mat'), '#/materials')}
    <div class="mat-grid">${matCats.map(c => `<a class="mat" href="#/c/${c.id}"><div class="mat-art">${ART(c.art, 0)}${pic('categories', c.id)}</div><div class="mat-b"><b>${L(c)}</b><small>${t('from')} ${fmt(minP(c.id))} ${t('cur')} ${t('u_'+unitOf(c.id))}</small></div></a>`).join('')}</div></section>

  <section class="wrap"><div class="promo"><div class="promo-txt"><h2>${t('promo_t')}</h2><p>${t('promo_p')}</p><a class="btn btn-y btn-lg" href="#/post?type=rent">${ic('plus')} ${t('promo_btn')}</a></div></div></section>

  <section class="wrap sec">${secHead(t('latest'), '#/all')}<div class="hscroll">${latest.map(card).join('')}</div></section>

  <section class="wrap sec">${secHead(t('sec_projects'), '#/projects')}<div class="proj-grid">${PROJECTS.slice(0,3).map(projCard).join('')}</div></section>

  <section class="wrap sec">${secHead(t('sec_companies'), '#/companies')}<div class="co-grid">${COMPANIES.slice(0,8).map(coCard).join('')}</div></section>

  <section class="wrap sec">${secHead(t('sec_services'), '#/services')}<div class="serv-grid">${SERVICES.slice(0,3).map(servCard).join('')}</div></section>

  <section class="wrap sec how"><h2>${t('how_t')}</h2><div class="how-grid">
    ${[['search','how1'],['chat','how2'],['check','how3']].map((h,i) => `<div class="how-step"><span class="hn">${i+1}</span>${ic(h[0])}<h3>${t(h[1])}</h3><p>${t(h[1]+'p')}</p></div>`).join('')}
  </div></section>`;
}

/* ---------------- Browse / category / search ---------------- */
let BASE = [];
function browse(o){
  BASE = o.items;
  const deals = o.deals || ['sale','rent','supply'];
  const chip = (v, lbl) => `<button class="chip${S.f.deal===v?' on':''}" data-flt="deal" data-v="${v}">${lbl}</button>`;
  const years = [2024,2022,2020,2018,2015];
  return `<section class="page-head"><div class="wrap">${crumbs(o.crumbs)}<h1>${esc(o.title)}</h1>${o.sub?`<p>${o.sub}</p>`:''}${o.tiles||''}</div></section>
  ${o.before||''}
  <div class="wrap browse">
    <aside class="filters" id="filters"><div class="flt-h"><b>${ic('filter')} ${t('filters')}</b><button class="link" data-act="flt-reset">${t('reset')}</button></div>
      ${o.fixedDeal?'':`<div class="flt-g"><label>${t('deal_type')}</label><div class="chips">${chip('', t('any'))}${deals.map(d => chip(d, t(d))).join('')}</div></div>`}
      <div class="flt-g"><label>${t('city')}</label><select data-flt="city"><option value="">${t('all_uae')}</option>${CITIES.map(c => `<option value="${c.id}"${S.f.city===c.id?' selected':''}>${L(c)}</option>`).join('')}</select></div>
      ${o.noYear?'':`<div class="flt-g"><label>${t('year_from')}</label><select data-flt="ymin"><option value="">${t('any')}</option>${years.map(y => `<option${String(S.f.ymin)===String(y)?' selected':''}>${y}</option>`).join('')}</select></div>`}
      <div class="flt-g"><label>${t('max_price')} (${t('cur')})</label><input type="number" min="0" inputmode="numeric" data-flt="pmax" value="${esc(S.f.pmax)}" placeholder="—"></div>
      <button class="btn btn-dark full only-m" data-act="toggle-filters">${t('apply')}</button>
    </aside>
    <div class="results"><div class="res-bar"><button class="btn btn-line only-m" data-act="toggle-filters">${ic('filter')} ${t('show_filters')}</button><span id="resCount" class="muted"></span>
      <label class="sort">${t('sort')}<select data-flt="sort"><option value="new"${S.f.sort==='new'?' selected':''}>${t('newest')}</option><option value="asc"${S.f.sort==='asc'?' selected':''}>${t('price_low')}</option><option value="desc"${S.f.sort==='desc'?' selected':''}>${t('price_high')}</option></select></label></div>
      <div class="grid g3" id="resGrid"></div></div>
  </div>`;
}
function applyFilters(){
  const f = S.f;
  let a = BASE.filter(it => (!f.deal || it.deal === f.deal) && (!f.city || it.city === f.city) && (!f.ymin || !it.year || it.year >= +f.ymin) && (!f.pmax || it.price <= +f.pmax));
  if (f.sort === 'asc') a.sort((x,y) => x.price - y.price); else if (f.sort === 'desc') a.sort((x,y) => y.price - x.price); else a.sort((x,y) => x.days - y.days);
  $('#resGrid').innerHTML = a.length ? a.map(card).join('') : `<div class="empty">${ic('search')}<p>${t('no_results')}</p><button class="btn btn-line" data-act="flt-reset">${t('reset')}</button></div>`;
  $('#resCount').textContent = `${a.length} ${t('results')}`;
}
function vGroup(g){
  const cats = CATS.filter(c => c.g === g);
  return browse({ title:t(g), crumbs:[[t(g)]], items:LISTINGS.filter(l => cat(l.cat).g === g), noYear:g==='materials', deals:g==='materials'?['supply']:['sale','rent'],
    tiles:`<div class="cat-strip compact">${cats.map(catTile).join('')}</div>` });
}
function vCat(id){
  const c = cat(id); if (!c.id) return vNF();
  const sib = CATS.filter(x => x.g === c.g);
  return browse({ title:L(c), crumbs:[[t(c.g), '#/'+c.g],[L(c)]], items:LISTINGS.filter(l => l.cat === id), noYear:c.g==='materials', deals:c.g==='materials'?['supply']:['sale','rent'],
    tiles:`<div class="chips scroll">${sib.map(x => `<a class="chip${x.id===id?' on':''}" href="#/c/${x.id}">${L(x)}</a>`).join('')}</div>` });
}
function vDeal(d){
  if (!['sale','rent'].includes(d)) return vNF();
  S.f.deal = d;
  return browse({ title:`${t('equipment')} — ${t(d)}`, crumbs:[[t('equipment'),'#/equipment'],[t(d)]], items:LISTINGS.filter(l => l.deal === d), fixedDeal:true,
    tiles:`<div class="chips scroll"><a class="chip${d==='sale'?' on':''}" href="#/browse/sale">${t('sale')}</a><a class="chip${d==='rent'?' on':''}" href="#/browse/rent">${t('rent')}</a></div>` });
}
function vList(kind){
  const items = kind === 'featured' ? LISTINGS.filter(l => l.featured) : LISTINGS.slice();
  const ttl = kind === 'featured' ? t('featured') : t('x_all');
  return browse({ title:ttl, crumbs:[[ttl]], items, tiles:`<div class="cat-strip compact">${CATS.map(catTile).join('')}</div>` });
}
function vSearch(q){
  S.q = q; const s = q.trim().toLowerCase();
  const scope = S.scope || '';
  const hit = it => [it.ar, it.en, it.ur, cat(it.cat).ur, it.brand, it.model, cat(it.cat).ar, cat(it.cat).en, L(city(it.city))].join(' ').toLowerCase().includes(s);
  const items = LISTINGS.filter(it => (!scope || cat(it.cat).g === scope) && (!s || hit(it)));
  const cos = s ? COMPANIES.filter(c => (c.ar + ' ' + c.en + ' ' + c.ur).toLowerCase().includes(s)) : [];
  return browse({ title:`${t('search_for')} “${q}”`, crumbs:[[t('search_for')]], items,
    before: cos.length ? `<div class="wrap sec">${secHead(t('companies_found'))}<div class="co-grid">${cos.map(coCard).join('')}</div></div>` : '' });
}

/* ---------------- Listing detail ---------------- */
function galMain(it, v){
  return `${ART(artOf(it), v)}${photo(it.id, v ? '-' + (v+1) : '')}<span class="gal-count">${ic('image')} ${v+1} / 4</span>`;
}
function miniMap(cid){
  const c = city(cid);
  return `<svg viewBox="0 0 400 260" class="uae-map small" aria-hidden="true"><rect width="400" height="260" fill="#d7e8f2"/>${UAE_PATH}
    ${CITIES.map(x => `<circle cx="${x.x}" cy="${x.y}" r="3" fill="#9aa1a9"/>`).join('')}
    <g transform="translate(${c.x} ${c.y})">${PIN}</g><text x="${c.x}" y="${c.y+20}" text-anchor="middle" class="mp-l">${L(c)}</text></svg>`;
}
const UAE_PATH = `<path d="M14 150 L60 148 L100 156 L140 150 L178 136 L214 116 L240 100 L262 82 L284 58 L300 36 L316 26 L326 44 L332 70 L346 96 L352 124 L342 140 L320 150 L304 170 L306 200 L284 214 L240 228 L190 244 L120 250 L60 248 L14 236 Z" fill="#f3ead6" stroke="#d6c39b" stroke-width="2"/>`;
const PIN = `<path d="M0 0 C-10 -14 -12 -18 -12 -24 A12 12 0 0 1 12 -24 C12 -18 10 -14 0 0Z" fill="#1E1F22"/><circle cy="-24" r="5" fill="#F7B500"/>`;
function vListing(id){
  const it = byId(LISTINGS, id); if (!it) return vNF();
  const c = cat(it.cat), s = co(it.seller), fav = S.favs.has(id);
  if (!S.gal || S.gal.id !== id) S.gal = {id, v:0};
  const v = S.gal.v;
  const rows = [[t('category'), L(c)], [t('deal'), t(it.deal)]];
  if (it.brand && it.brand !== '—') rows.push([t('brand'), it.brand]);
  if (it.model) rows.push([t('model'), it.model]);
  if (it.year) rows.push([t('year'), it.year]);
  if (it.hours) rows.push([t('hours'), fmt(it.hours) + ' ' + t('hrs')]);
  if (it.cond) rows.push([t('condition'), t(it.cond === 'new' ? 'newc' : 'used')]);
  if (it.qty) rows.push([t('qty'), L(it.qty)]);
  if (it.delivery) rows.push([t('delivery'), t('available')]);
  if (it.op) rows.push([t('operator'), t('with_op')]);
  (it.specs || []).forEach(sp => rows.push([L(SPEC_LABELS[sp[0]]) || sp[0], sp[1]]));
  rows.push([t('ad_no'), 'BD-' + (10240 + vOf(id) * 7 + id.length * 13)]);
  const similar = LISTINGS.filter(l => l.id !== id && (l.cat === it.cat || cat(l.cat).g === c.g)).sort((a,b) => (b.cat===it.cat) - (a.cat===it.cat)).slice(0, 4);
  return `<div class="wrap detail-wrap">${crumbs([[t(c.g), '#/'+c.g],[L(c), '#/c/'+c.id],[title(it)]])}
  <div class="detail">
    <div class="d-main">
      <div class="gal"><div class="gal-main" id="galMain">${ART(artOf(it), vOf(id))}${photo(it.id)}
        <div class="badges">${it.featured?`<span class="b b-y">${t('featured_b')}</span>`:''}${it.isNew?`<span class="b b-g">${t('new_b')}</span>`:''}<span class="b b-k">${t(it.deal)}</span></div></div>
        </div>
      <div class="box"><h2>${t('specs')}</h2><dl class="specs">${rows.map(r => `<div><dt>${r[0]}</dt><dd>${esc(r[1])}</dd></div>`).join('')}</dl></div>
      <div class="box"><h2>${t('description')}</h2><p class="desc">${esc(desc(it))}</p></div>
      <div class="box"><h2>${t('location')}</h2><div class="loc-row"><div>${miniMap(it.city)}</div><p>${ic('pin')} <b>${L(city(it.city))}</b> — ${esc(L(it.area))}</p></div></div>
    </div>
    <aside class="d-side">
      <div class="box buy-box"><span class="deal-tag deal-${it.deal}">${t(it.deal)}</span><h1>${esc(title(it))}</h1>
        <p class="muted">${ic('pin')} ${L(city(it.city))} · ${esc(L(it.area))} · ${ic('eye')} ${fmt(it.views)}</p>
        <div class="big-price">${priceHTML(it.price, it.unit)}</div>
        <div class="facts">${it.year?`<span>${ic('cal')} ${it.year}</span>`:''}${it.hours?`<span>${ic('gauge')} ${fmt(it.hours)} ${t('hrs')}</span>`:''}${it.km?`<span>${ic('gauge')} ${fmt(it.km)} km</span>`:''}${it.qty?`<span>${ic('box')} ${esc(L(it.qty))}</span>`:''}${it.op?`<span>${ic('user')} ${t('with_op')}</span>`:''}</div>
        <button class="btn btn-y btn-lg full" data-act="contact" data-seller="${s.id}" data-item="${id}">${ic('chat')} ${t('contact_seller')}</button>
        <div class="two"><button class="btn btn-dark" data-act="reveal" data-seller="${s.id}" id="revealBtn">${ic('phone')} <span>${t('show_phone')}</span></button><button class="btn btn-wa" data-act="wa">${ic('wa')} ${t('whatsapp')}</button></div>
        <div class="row-acts"><button class="act fav-wide${fav?' on':''}" data-fav="${id}">${ic('heart')} <span>${fav?t('in_fav'):t('add_fav')}</span></button><button class="act" data-act="share">${ic('share')} ${t('share')}</button><button class="act" data-act="report">${ic('flag')} ${t('report')}</button></div>
      </div>
      <div class="box seller"><h3>${t('seller_info')}</h3><a class="co-row" href="#/co/${s.id}"><div class="co-logo" style="--c:${s.color}">${s.ab}</div><div><b>${esc(L(s))}</b><small>${ic('shield')} ${t('verified')} · ${t('type_'+s.type)}</small></div></a>
        <div class="seller-stats"><div><b>${s.rating}</b><small>${t('rating')}</small></div><div><b>${s.n}</b><small>${t('listings_n')}</small></div><div><b>${s.since}</b><small>${t('member_since')}</small></div></div>
        <a class="btn btn-line full" href="#/co/${s.id}">${t('view_profile')}</a></div>
      <div class="box tips"><h3>${ic('shield')} ${t('safety')}</h3><ul><li>${t('safety1')}</li><li>${t('safety2')}</li><li>${t('safety3')}</li></ul></div>
    </aside>
  </div>
  <section class="sec">${secHead(t('similar'), '#/c/'+c.id)}<div class="grid">${similar.map(card).join('')}</div></section></div>`;
}

/* ---------------- Companies / projects / services ---------------- */
function vCompanies(){
  const types = ['dealer','rental','supplier','marine','contractor'];
  const list = COMPANIES.filter(c => !S.coType || c.type === S.coType);
  return `<section class="page-head"><div class="wrap">${crumbs([[t('companies')]])}<h1>${t('companies')}</h1><p>${t('comp_intro')}</p>
    <div class="chips scroll"><button class="chip${!S.coType?' on':''}" data-act="cotype" data-v="">${t('all')}</button>${types.map(x => `<button class="chip${S.coType===x?' on':''}" data-act="cotype" data-v="${x}">${t('type_'+x)}</button>`).join('')}</div></div></section>
  <div class="wrap sec"><div class="co-grid big">${list.map(coCard).join('')}</div></div>`;
}
function vCompany(id){
  const c = co(id); if (!c.id) return vNF();
  const items = LISTINGS.filter(l => l.seller === id);
  return `<section class="co-cover"><div class="co-cover-art">${ART('company', vOf(id))}${pic('companies', id)}</div><div class="wrap co-head">
    <div class="co-logo xl" style="--c:${c.color}">${c.ab}</div><div class="co-h-txt"><h1>${esc(L(c))} <span class="vf">${ic('shield')}</span></h1>
    <p>${t('type_'+c.type)} · ${ic('pin')} ${L(city(c.city))} · ${t('member_since')} ${c.since}</p><div class="co-meta">${stars(c.rating)}<span>${c.n} ${t('listings_n')}</span></div></div>
    <div class="co-h-acts"><button class="btn btn-y" data-act="contact" data-seller="${id}">${ic('chat')} ${t('contact_company')}</button><button class="btn btn-line" data-act="share">${ic('share')} ${t('share')}</button></div></div></section>
  <div class="wrap sec">${crumbs([[t('companies'),'#/companies'],[L(c)]])}${secHead(t('company_listings'))}<div class="grid">${items.map(card).join('') || `<p class="muted">${t('no_results')}</p>`}</div></div>`;
}
function vProjects(){
  return `<section class="page-head"><div class="wrap head-flex"><div>${crumbs([[t('projects')]])}<h1>${t('projects')}</h1><p>${t('proj_intro')}</p></div>
    <a class="btn btn-y btn-lg" href="#/post?type=proj">${ic('plus')} ${t('request_project')}</a></div></section>
  <div class="wrap sec"><div class="proj-grid two-col">${PROJECTS.map(projCard).join('')}</div></div>`;
}
function vProject(id){
  const p = byId(PROJECTS, id); if (!p) return vNF();
  const o = co(p.owner);
  return `<div class="wrap detail-wrap">${crumbs([[t('projects'),'#/projects'],[L(p)]])}
  <div class="detail"><div class="d-main">
    <div class="proj-hero">${ART(p.type==='pt_marine'?'marine':p.type==='pt_road'?'road':p.type==='pt_supply'?'mixer':'excavator', vOf(id))}${pic('projects', id)}<span class="tag">${t(p.type)}</span></div>
    <div class="box"><h1 class="h1-sm">${esc(L(p))}</h1><p class="desc">${esc(desc(p))}</p></div>
    <div class="box"><h2>${t('req_eq')}</h2><div class="eq-chips">${p.eq.map(e => `<a class="eq-chip" href="#/c/${e}"><span>${ART(cat(e).art,0,true)}</span>${L(cat(e))}</a>`).join('')}</div></div>
    <div class="box"><h2>${t('location')}</h2><div class="loc-row"><div>${miniMap(p.city)}</div><p>${ic('pin')} <b>${L(city(p.city))}</b></p></div></div>
  </div><aside class="d-side"><div class="box buy-box"><small class="muted">${t('budget')}</small><div class="big-price"><span class="price">${fmt(p.b1)} – ${fmt(p.b2)} <small>${t('cur')}</small></span></div>
    <div class="facts"><span>${ic('clock')} ${p.dur} ${t('days')}</span><span>${ic('cal')} ${p.start}</span><span>${ic('users')} ${p.bids} ${t('bids')}</span></div>
    <button class="btn btn-y btn-lg full" data-act="offer" data-p="${id}">${ic('send')} ${t('submit_offer')}</button>
    <div class="row-acts"><button class="act" data-act="share">${ic('share')} ${t('share')}</button><button class="act" data-act="report">${ic('flag')} ${t('report')}</button></div></div>
    <div class="box seller"><h3>${t('project_owner')}</h3><a class="co-row" href="#/co/${o.id}"><div class="co-logo" style="--c:${o.color}">${o.ab}</div><div><b>${esc(L(o))}</b><small>${ic('shield')} ${t('verified')}</small></div></a></div>
  </aside></div>
  <section class="sec">${secHead(t('sec_projects'), '#/projects')}<div class="proj-grid">${PROJECTS.filter(x => x.id !== id).slice(0,3).map(projCard).join('')}</div></section></div>`;
}
function vServices(){
  return `<section class="page-head"><div class="wrap">${crumbs([[t('services')]])}<h1>${t('services')}</h1><p>${t('serv_intro')}</p></div></section>
  <div class="wrap sec"><div class="serv-grid">${SERVICES.map(servCard).join('')}</div></div>`;
}

/* ---------------- Account / favorites / login ---------------- */
function favGrid(){
  const items = LISTINGS.filter(l => S.favs.has(l.id));
  return items.length ? `<div class="grid g3">${items.map(card).join('')}</div>` : `<div class="empty">${ic('heart')}<p>${t('no_favs')}</p><a class="btn btn-y" href="#/equipment">${t('browse_now')}</a></div>`;
}
function vFavPage(){
  return `<section class="page-head slim"><div class="wrap">${crumbs([[t('favorites')]])}<h1>${t('favorites')}</h1></div></section><div class="wrap sec">${favGrid()}</div>`;
}
function vAccount(tab){
  if (!S.user) { S.after = '#/account/' + tab; return vLogin(); }
  const mine = [LISTINGS[8], LISTINGS[1]];
  const msgs = [['co2', {ar:'نعم المعدة متاحة من الأحد القادم، هل تحتاج مشغّل؟', en:'Yes, it is available from next Sunday. Do you need an operator?'}, '10:24'],
                ['co7', {ar:'تم إرسال عرض السعر المحدّث على بريدك.', en:'The updated quotation has been sent to your email.'}, t('ago_d').replace('{n}',1)],
                ['co3', {ar:'يمكننا التوريد غداً صباحاً إلى الموقع.', en:'We can deliver to site tomorrow morning.'}, t('ago_d').replace('{n}',2)]];
  let body;
  if (tab === 'favs') body = favGrid();
  else if (tab === 'msgs') body = `<div class="msg-list">${msgs.map((m,i) => { const c = co(m[0]); return `<button class="msg${i===0?' unread':''}" data-act="demo"><div class="co-logo" style="--c:${c.color}">${c.ab}</div><div><b>${esc(L(c))}</b><p>${esc(L(m[1]))}</p></div><small>${m[2]}</small></button>`; }).join('')}</div>`;
  else body = `<div class="my-ads">${mine.map((it,i) => `<div class="my-ad"><a href="#/l/${it.id}" class="my-ad-art">${ART(artOf(it), vOf(it.id))}${photo(it.id)}</a><div class="my-ad-b"><a href="#/l/${it.id}"><b>${esc(title(it))}</b></a><span>${priceHTML(it.price, it.unit)}</span>
      <small>${ic('eye')} ${fmt(it.views)} · ${ago(it.days)}</small></div><span class="status ${i?'pend':'act'}">${i?t('pending'):t('active')}</span><button class="btn btn-sm btn-line" data-act="demo">${ic('edit')} ${t('edit')}</button></div>`).join('')}
      <a class="btn btn-y" href="#/post">${ic('plus')} ${t('post_ad')}</a></div>`;
  const tabs = [['ads','my_ads','box'],['favs','favorites','heart'],['msgs','messages','chat']];
  return `<section class="page-head slim"><div class="wrap"><h1>${t('hello')}${S.lang==='en'?', ':'، '}${esc(S.user.name)}</h1><p>${t('acc_sub')}</p></div></section>
  <div class="wrap account"><aside class="acc-nav">${tabs.map(x => `<a href="#/account/${x[0]}" class="${tab===x[0]?'on':''}">${ic(x[2])} ${t(x[1])}</a>`).join('')}<button data-act="logout">${ic('logout')} ${t('logout')}</button></aside>
  <div class="acc-body">${body}</div></div>`;
}
function vLogin(tab){
  const reg = tab === 'register';
  return `<div class="wrap auth"><div class="auth-card">
    <div class="auth-side"><div class="as-art">${ART('excavator', 0, true)}</div><h2>${t('login_side_t')}</h2><ul><li>${ic('check')} ${t('login_side1')}</li><li>${ic('check')} ${t('login_side2')}</li><li>${ic('check')} ${t('login_side3')}</li></ul></div>
    <div class="auth-form"><h1>${t('welcome')}</h1><p class="muted">${t('login_sub')}</p>
      <div class="tabs"><a href="#/login" class="${reg?'':'on'}">${t('login_tab')}</a><a href="#/login?tab=register" class="${reg?'on':''}">${t('reg_tab')}</a></div>
      <form data-form="auth" novalidate>
        ${reg ? `<label class="fld"><span>${t('full_name')}</span><input name="name" required placeholder="${t('x_name')}"></label>
          <div class="fld"><span>${t('acc_type')}</span><div class="chips"><label class="chip on"><input type="radio" name="at" checked hidden>${t('individual')}</label><label class="chip"><input type="radio" name="at" hidden>${t('company')}</label></div></div>` : ''}
        <label class="fld"><span>${t('email_phone')}</span><input name="id" class="ltr-in" placeholder="name@company.ae / +971 5x xxx xxxx"></label>
        <label class="fld"><span>${t('password')}</span><input name="pw" type="password" placeholder="••••••••"></label>
        ${reg ? '' : `<a href="#" class="link small" data-act="demo">${t('forgot')}</a>`}
        <button class="btn btn-y btn-lg full" type="submit">${reg ? t('create_acc') : t('login')}</button>
        <div class="or"><span>${t('or')}</span></div>
        <div class="two"><button type="button" class="btn btn-line" data-act="social">G · ${t('with_google')}</button><button type="button" class="btn btn-line" data-act="social"> ${t('with_apple')}</button></div>
        <p class="demo-note">${ic('info')} ${t('demo_login')}</p>
      </form></div></div></div>`;
}
function vNF(){ return `<div class="wrap empty big">${ic('search')}<h1>404</h1><p>${t('not_found')}</p><a class="btn btn-y" href="#/">${t('back_home')}</a></div>`; }

/* ---------------- Post-an-ad wizard (demo only — nothing is saved) ---------------- */
const PTYPES = [['sell','t_sell','excavator'],['rent','t_rent','loader'],['mat','t_mat','gravel'],['proj','t_proj','road'],['serv','t_serv','service']];
const REQ = { sell:['title','cat','brand','price'], rent:['title','cat','brand','price'], mat:['mtype','title','qty','price'], proj:['title','ptype','b1','desc'], serv:['stype','title','price'] };
const newPost = type => { const ok = PTYPES.some(p => p[0] === type); return { step: ok ? 2 : 1, type: ok ? type : null, d:{cond:'used', period:'day', unit:'ton', eq:[], op:false, delivery:true}, imgs:[], city:'', area:'', pin:null, phone:'', wa:true, agree:false, done:false, err:[] }; };
function vPost(params){
  const ty = params.get('type');
  if (!S.post || (S.post.done && !S.keepScroll) || (ty && ty !== S.post.type && !S.keepScroll)) S.post = newPost(ty);
  const Pp = S.post;
  return `<section class="page-head slim"><div class="wrap">${crumbs([[t('post_ad')]])}<h1>${t('post_title')}</h1><p>${t('post_sub')}</p></div></section>
  <div class="wrap post">${Pp.done ? postDone() : `
    <ol class="steps">${[1,2,3,4,5].map(i => `<li class="${i<Pp.step?'done':''}${i===Pp.step?' cur':''}"><span>${i<Pp.step?ic('check'):i}</span><em>${t('s'+i)}</em></li>`).join('')}</ol>
    <div class="post-card">${postStep()}</div>`}</div>`;
}
function rerenderPost(){ S.keepScroll = true; const y = window.scrollY; route(); const el = $('.post'); window.scrollTo(0, el ? Math.min(y, el.offsetTop - 80) : y); }
const pv = k => S.post.d[k] == null ? '' : S.post.d[k];
const errc = k => S.post.err.includes(k) ? ' err' : '';
function fld(k, lbl, type='text', o={}){
  const req = (REQ[S.post.type]||[]).includes(k);
  let ctl;
  if (type === 'select') ctl = `<select data-pf="${k}"><option value="">—</option>${o.opts.map(x => `<option value="${x[0]}"${String(pv(k))===String(x[0])?' selected':''}>${esc(x[1])}</option>`).join('')}</select>`;
  else if (type === 'textarea') ctl = `<textarea data-pf="${k}" rows="4" placeholder="${o.ph||''}">${esc(pv(k))}</textarea>`;
  else ctl = `<input type="${type}" data-pf="${k}" value="${esc(pv(k))}" placeholder="${o.ph||''}"${type==='number'?' min="0" inputmode="numeric"':''}>`;
  return `<label class="fld${o.full?' full':''}${errc(k)}"><span>${t(lbl)}${req?' <i>*</i>':''}</span>${ctl}${req?`<em class="req">${t('required')}</em>`:''}</label>`;
}
const chipsF = (k, lbl, opts, multi, full) => `<div class="fld${full?' full':''}"><span>${t(lbl)}</span><div class="chips">${opts.map(o => { const on = multi ? (S.post.d[k]||[]).includes(o[0]) : pv(k) === o[0];
  return `<button type="button" class="chip${on?' on':''}" data-pchip="${k}" data-v="${o[0]}" data-multi="${multi?1:''}">${multi&&on?ic('check','sm'):''}${esc(o[1])}</button>`; }).join('')}</div></div>`;
const toggleF = (k, lbl) => `<label class="toggle"><input type="checkbox" data-pf="${k}"${S.post.d[k]?' checked':''}><span class="tg"></span>${t(lbl)}</label>`;
const eqOpts = () => CATS.filter(c => c.g === 'equipment').map(c => [c.id, L(c)]);
const years = () => Array.from({length:22}, (_,i) => [2026-i, 2026-i]);
function postFields(){
  const ty = S.post.type;
  if (ty === 'sell' || ty === 'rent') return `
    ${fld('title','f_title','text',{full:true, ph:t('x_title_ph')})}
    ${fld('cat','f_cat','select',{opts:eqOpts()})}${fld('brand','f_brand','text',{ph:'CAT, Komatsu, Volvo…'})}
    ${fld('model','f_model')}${fld('year','f_year','select',{opts:years()})}${fld('hours','f_hours','number')}
    ${chipsF('cond','f_cond',[['used',t('used')],['new',t('newc')]])}
    ${ty==='rent' ? chipsF('period','f_period',[['day',t('p_day')],['week',t('p_week')],['month',t('p_month')]]) + `<div class="fld">${toggleF('op','f_operator')}</div>` : ''}
    ${fld('price','f_price','number')}${fld('desc','f_desc','textarea',{full:true, ph:t('f_desc_ph')})}`;
  if (ty === 'mat') return `
    ${fld('mtype','f_mat_type','select',{opts:CATS.filter(c => c.g==='materials').map(c => [c.id, L(c)])})}${fld('title','f_mat_name')}
    ${fld('qty','f_qty','number')}${fld('unit','f_unit','select',{opts:[['ton',t('x_ton')],['m3','م³ / m³'],['bag',t('x_bag')],['piece',t('x_piece')]]})}
    ${fld('price','f_unit_price','number')}<div class="fld">${toggleF('delivery','f_delivery')}</div>
    ${fld('desc','f_desc','textarea',{full:true, ph:t('f_desc_ph')})}`;
  if (ty === 'proj') return `
    ${fld('title','f_title','text',{full:true})}${fld('ptype','f_proj_type','select',{opts:['pt_exc','pt_road','pt_build','pt_marine','pt_supply'].map(x => [x, t(x)])})}
    ${fld('start','f_start','date')}${fld('b1','f_budget_from','number')}${fld('b2','f_budget_to','number')}${fld('days','f_days','number')}
    ${chipsF('eq','f_req_eq', eqOpts(), true, true)}${fld('desc','f_desc','textarea',{full:true})}`;
  return `
    ${fld('stype','f_serv_type','select',{opts:['sv_transport','sv_operator','sv_maint','sv_insp','sv_survey'].map(x => [x, t(x)])})}${fld('title','f_title')}
    ${fld('price','f_price_from','number')}${fld('coverage','f_coverage','select',{opts:[['all',t('all_uae')]].concat(CITIES.map(c => [c.id, L(c)]))})}
    ${fld('desc','f_desc','textarea',{full:true, ph:t('f_desc_ph')})}`;
}
const SAMPLES = {
  sell:{ ar:{title:'حفارة كوماتسو PC210 بحالة ممتازة', desc:'حفارة كوماتسو موديل 2020، صيانة دورية، جنزير جديد، جاهزة للمعاينة.'}, en:{title:'Komatsu PC210 Excavator — Excellent Condition', desc:'2020 Komatsu, regularly serviced, new undercarriage, ready for inspection.'}, d:{cat:'excavators', brand:'Komatsu', model:'PC210-10', year:2020, hours:5200, cond:'used', price:245000}, art:'excavator' },
  rent:{ ar:{title:'حفارة فولفو EC300 للإيجار الشهري', desc:'متوفرة مع مشغّل محترف وتوصيل إلى الموقع داخل أبوظبي.'}, en:{title:'Volvo EC300 Excavator for Monthly Rent', desc:'Available with a professional operator and delivery to site within Abu Dhabi.'}, d:{cat:'excavators', brand:'Volvo', model:'EC300', year:2022, hours:2100, cond:'used', period:'month', op:true, price:38000}, art:'excavator' },
  mat:{ ar:{title:'رمل مغسول 0–5 مم', desc:'رمل مغسول مطابق للمواصفات مع توريد سريع للموقع.'}, en:{title:'Washed sand 0–5 mm', desc:'Spec-compliant washed sand with fast delivery to site.'}, d:{mtype:'sand', qty:3000, unit:'ton', price:42, delivery:true}, art:'sand' },
  proj:{ ar:{title:'حفر قبو بعمق طابقين لمبنى تجاري', desc:'مطلوب حفر وسند جوانب ونقل المخلفات لمبنى تجاري بمساحة 2,500 م².'}, en:{title:'Two-level basement excavation for a commercial building', desc:'Excavation, shoring and debris removal required for a 2,500 m² commercial building.'}, d:{ptype:'pt_exc', b1:220000, b2:300000, days:30, start:'2026-11-20', eq:['excavators','trucks']}, art:'excavator' },
  serv:{ ar:{title:'نقل معدات ثقيلة بين الإمارات', desc:'شاحنات لوبد حتى 60 طن مع تصاريح الطرق والتأمين.'}, en:{title:'Heavy equipment transport across the UAE', desc:'Low-beds up to 60 t with road permits and insurance.'}, d:{stype:'sv_transport', price:1100, coverage:'all'}, art:'dumptruck' }
};
SAMPLES.sell.ur = {title:'کوماتسو PC210 کھدائی مشین — بہترین حالت', desc:'2020 ماڈل کوماتسو، باقاعدہ سروس، نئی زنجیر، معائنے کے لیے تیار۔'};
SAMPLES.rent.ur = {title:'وولوو EC300 کھدائی مشین ماہانہ کرائے پر', desc:'ماہر آپریٹر کے ساتھ دستیاب، ابوظہبی میں سائٹ تک ترسیل۔'};
SAMPLES.mat.ur = {title:'دھلی ہوئی ریت 0–5 ملی میٹر', desc:'معیار کے مطابق دھلی ہوئی ریت، سائٹ تک تیز ترسیل۔'};
SAMPLES.proj.ur = {title:'تجارتی عمارت کے لیے دو منزلہ تہہ خانے کی کھدائی', desc:'2,500 م² تجارتی عمارت کے لیے کھدائی، دیواروں کی سپورٹ اور ملبے کی منتقلی درکار ہے۔'};
SAMPLES.serv.ur = {title:'امارات بھر میں بھاری آلات کی نقل و حمل', desc:'60 ٹن تک لو بیڈ ٹرک، سڑک کے اجازت ناموں اور انشورنس کے ساتھ۔'};
function postStep(){
  const Pp = S.post, st = Pp.step;
  const foot = (next, nextLbl) => `<div class="post-foot">${st>1?`<button class="btn btn-line" data-act="pback">${ic('chevl','flip')} ${t('back')}</button>`:'<span></span>'}
    <button class="btn btn-y btn-lg" data-act="${next}"${st===1&&!Pp.type?' disabled':''}>${nextLbl||t('next')} ${st<5?ic('chev','flip'):ic('check')}</button></div>`;
  if (st === 1) return `<h2>${t('s1')}</h2><div class="type-grid">${PTYPES.map(p => `<button class="type-card${Pp.type===p[0]?' on':''}" data-act="ptype" data-k="${p[0]}"><div class="tc-art">${ART(p[2],0,true)}</div><b>${t(p[1])}</b><small>${t(p[1]+'_d')}</small><i class="tc-check">${ic('check')}</i></button>`).join('')}</div>${foot('pnext')}`;
  if (st === 2) return `<div class="ps-h"><h2>${t('s2')} — <span class="y-txt">${t(PTYPES.find(p => p[0]===Pp.type)[1])}</span></h2><button class="btn btn-sm btn-line" data-act="psample">${ic('edit')} ${t('fill_sample')}</button></div><div class="form-grid">${postFields()}</div>${foot('pnext')}`;
  if (st === 3) return `<h2>${t('s3')}</h2>
    <label class="drop" id="drop"><input type="file" accept="image/*" multiple data-act="files" hidden>${ic('upload')}<b>${t('up_t')}</b><small>${t('up_p')}</small></label>
    <div class="ph-tools"><button class="btn btn-sm btn-line" data-act="psamples">${ic('image')} ${t('up_samples')}</button><span class="tip">${ic('info')} ${t('photos_tip')}</span></div>
    <div class="pthumbs">${Pp.imgs.map((im,i) => `<div class="pthumb">${im.url?`<img src="${im.url}" alt="">`:ART(im.art, im.v)}${i===0?`<span class="cover">${t('cover')}</span>`:`<button class="mk" data-act="pcover" data-i="${i}">${t('set_cover')}</button>`}<button class="rm" data-act="prm" data-i="${i}" aria-label="remove">${ic('close')}</button></div>`).join('')}</div>${foot('pnext')}`;
  if (st === 4) return `<h2>${t('s4')}</h2><div class="loc-grid"><div class="form-grid one">
      <label class="fld${errc('city')}"><span>${t('f_city')} <i>*</i></span><select data-pl="city"><option value="">—</option>${CITIES.map(c => `<option value="${c.id}"${Pp.city===c.id?' selected':''}>${L(c)}</option>`).join('')}</select><em class="req">${t('required')}</em></label>
      <label class="fld"><span>${t('f_area')}</span><input data-pl="area" value="${esc(Pp.area)}" placeholder="${t('f_area_ph')}"></label>
      <label class="fld"><span>${t('f_phone')}</span><input data-pl="phone" class="ltr-in" value="${esc(Pp.phone)}" placeholder="+971 5x xxx xxxx"></label>
      <label class="toggle"><input type="checkbox" data-pl="wa"${Pp.wa?' checked':''}><span class="tg"></span>${t('f_wa')}</label></div>
    <div class="map-box"><svg viewBox="0 0 400 260" class="uae-map" id="uaeMap"><rect width="400" height="260" fill="#d7e8f2"/>${UAE_PATH}
      <text x="95" y="100" class="sea">${t('gulf')}</text><text x="372" y="190" class="sea" transform="rotate(-72 372 190)">${t('oman_g')}</text>
      ${CITIES.map(c => `<g class="mcity${Pp.city===c.id?' on':''}" data-city="${c.id}"><circle cx="${c.x}" cy="${c.y}" r="6"/><text x="${c.x}" y="${c.y-10}" text-anchor="middle">${L(c)}</text></g>`).join('')}
      ${Pp.pin?`<g transform="translate(${Pp.pin.x} ${Pp.pin.y})" class="drop-pin">${PIN}</g>`:''}</svg>
      <p class="tip">${ic(Pp.pin?'check':'pin')} ${Pp.pin?t('pin_set'):t('map_hint')}</p></div></div>${foot('pnext')}`;
  /* step 5: preview */
  const ty = Pp.type, d = Pp.d, cov = Pp.imgs[0];
  const media = cov ? (cov.url ? `<img src="${cov.url}" alt="" class="ph ok">` : ART(cov.art, cov.v)) : ART(SAMPLES[ty].art, 0);
  const deal = ty==='sell'?'sale':ty==='rent'?'rent':ty==='mat'?'supply':'';
  const catName = ty==='mat' ? L(cat(d.mtype)) : ty==='proj' ? t(d.ptype||'pt_exc') : ty==='serv' ? t(d.stype||'sv_transport') : L(cat(d.cat));
  const priceTxt = ty==='proj' ? `<span class="price">${fmt(+d.b1||0)}${d.b2?' – '+fmt(+d.b2):''} <small>${t('cur')}</small></span>` : priceHTML(+d.price||0, ty==='rent'?d.period:ty==='mat'?d.unit:'total');
  const sum = [[t('s1'), t(PTYPES.find(p => p[0]===ty)[1])],[t('category'), catName]];
  if (d.brand) sum.push([t('brand'), d.brand + ' ' + (d.model||'')]); if (d.year) sum.push([t('year'), d.year]); if (d.hours) sum.push([t('hours'), fmt(d.hours)]);
  if (d.qty) sum.push([t('f_qty'), fmt(d.qty)]); if (d.days) sum.push([t('duration'), d.days + ' ' + t('days')]);
  sum.push([t('location'), (L(city(Pp.city)) || '—') + (Pp.area ? ' · ' + Pp.area : '')], [t('s3'), Pp.imgs.length]);
  return `<h2>${t('s5')}</h2><p class="muted">${t('preview_note')}</p><div class="prev-grid">
    <div class="card preview"><div class="media">${media}<div class="badges"><span class="b b-g">${t('new_b')}</span></div>${deal?`<span class="deal deal-${deal}">${t(deal)}</span>`:''}</div>
      <div class="cbody"><div class="ctop"><span class="ccat">${esc(catName)}</span>${d.brand?`<span class="cmodel">${esc(d.brand)} ${esc(d.model||'')}</span>`:''}</div><h3>${esc(d.title||'—')}</h3>
      <div class="cmeta"><span>${ic('pin')} ${L(city(Pp.city))||'—'}</span>${d.year?`<span>${ic('cal')} ${d.year}</span>`:''}</div><div class="cfoot">${priceTxt}<span class="ago">${t('today')}</span></div></div></div>
    <div><div class="box"><h3>${t('summary')}</h3><dl class="specs one">${sum.map(r => `<div><dt>${r[0]}</dt><dd>${esc(r[1])}</dd></div>`).join('')}</dl>${d.desc?`<p class="desc">${esc(d.desc)}</p>`:''}</div>
      <label class="check${Pp.err.includes('agree')?' err':''}"><input type="checkbox" data-pl="agree"${Pp.agree?' checked':''}> ${t('agree')}</label></div></div>${foot('publish', t('publish'))}`;
}
function postDone(){
  const ty = S.post.type, c = ty==='mat' ? S.post.d.mtype : (ty==='sell'||ty==='rent') ? S.post.d.cat : null;
  return `<div class="post-card done"><div class="done-ic">${ic('check')}</div><h2>${t('done_t')}</h2><p>${t('done_p')}</p><p class="ref">${t('ad_ref')}: <b>${S.post.ref}</b></p>
    <div class="done-acts"><button class="btn btn-y" data-act="pnew">${ic('plus')} ${t('post_another')}</button>${c?`<a class="btn btn-line" href="#/c/${c}">${L(cat(c))}</a>`:''}<a class="btn btn-dark" href="#/">${t('back_home')}</a></div></div>`;
}
function postValidate(){
  const Pp = S.post; Pp.err = [];
  if (Pp.step === 2) (REQ[Pp.type]||[]).forEach(k => { if (!String(pv(k)).trim()) Pp.err.push(k); });
  if (Pp.step === 4 && !Pp.city) Pp.err.push('city');
  if (Pp.step === 5 && !Pp.agree) Pp.err.push('agree');
  return !Pp.err.length;
}
function addFiles(files){
  Array.from(files || []).filter(f => /^image\//.test(f.type)).slice(0, Math.max(0, 10 - S.post.imgs.length)).forEach(f => S.post.imgs.push({url:URL.createObjectURL(f)}));
  rerenderPost();
}

/* ---------------- Modals & toasts ---------------- */
function openModal(html, cls=''){
  const m = $('#modal');
  m.innerHTML = `<div class="m-bg" data-act="mclose"></div><div class="m-box ${cls}" role="dialog" aria-modal="true"><button class="m-x" data-act="mclose" aria-label="close">${ic('close')}</button>${html}</div>`;
  m.hidden = false; document.body.classList.add('noscroll');
  requestAnimationFrame(() => m.classList.add('show'));
}
function closeModal(){ const m = $('#modal'); if (!m) return; m.classList.remove('show'); m.hidden = true; m.innerHTML = ''; document.body.classList.remove('noscroll'); }
function toast(msg, icn='check'){
  const el = document.createElement('div'); el.className = 'toast'; el.innerHTML = `${ic(icn)}<span>${esc(msg)}</span>`;
  $('#toasts').appendChild(el); requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2600);
}
const phoneOf = sid => { const n = sid.replace(/\D/g,''); return `+971 5${n} 4${n}2 18${n}7`; };
function contactModal(sid, iid, svc){
  const s = co(sid), it = iid ? byId(LISTINGS, iid) : svc ? byId(SERVICES, svc) : null;
  const mini = it ? `<div class="m-item"><div class="m-art">${ART(artOf(it), vOf(it.id))}${it.cat ? photo(it.id) : pic('services', it.id)}</div><div><b>${esc(title(it))}</b>${priceHTML(it.price, it.unit)}</div></div>` : '';
  openModal(`<h2>${svc ? t('request_service') : sid && !iid ? t('contact_company') : t('contact_seller')}</h2>${mini}
    <div class="co-row"><div class="co-logo" style="--c:${s.color}">${s.ab}</div><div><b>${esc(L(s))}</b><small>${ic('shield')} ${t('verified')} · ${stars(s.rating)}</small></div></div>
    <div class="phone-row"><span class="ltr" id="mPhone">+971 5• ••• ••••</span><button class="btn btn-sm btn-dark" data-act="reveal-m" data-seller="${sid}">${ic('eye')} ${t('show_phone')}</button></div>
    <div class="two"><button class="btn btn-line" data-act="call">${ic('phone')} ${t('call')}</button><button class="btn btn-wa" data-act="wa">${ic('wa')} ${t('whatsapp')}</button></div>
    <form data-form="msg" class="m-form"><div class="two"><label class="fld"><span>${t('your_name')}</span><input value="${S.user ? esc(S.user.name) : ''}"></label><label class="fld"><span>${t('your_phone')}</span><input class="ltr-in" placeholder="+971 5x xxx xxxx"></label></div>
    <label class="fld"><span>${t('send_message')}</span><textarea rows="3">${t('msg_ph')}</textarea></label><button class="btn btn-y btn-lg full" type="submit">${ic('send')} ${t('send_message')}</button></form>`);
}
function offerModal(pid){
  const p = byId(PROJECTS, pid);
  openModal(`<h2>${t('submit_offer')}</h2><div class="m-item"><div class="m-art">${ART('road', 0)}</div><div><b>${esc(L(p))}</b><span class="muted">${t('budget')}: ${fmt(p.b1)} – ${fmt(p.b2)} ${t('cur')}</span></div></div>
    <form data-form="offer" class="m-form"><div class="two"><label class="fld"><span>${t('offer_price')}</span><input type="number" value="${Math.round((p.b1+p.b2)/2)}"></label><label class="fld"><span>${t('offer_days')}</span><input type="number" value="${p.dur}"></label></div>
    <label class="fld"><span>${t('offer_note')}</span><textarea rows="3"></textarea></label><button class="btn btn-y btn-lg full" type="submit">${ic('send')} ${t('submit_offer')}</button></form>`);
}
function reportModal(){
  const rs = t('x_reasons');
  openModal(`<h2>${t('report')}</h2><form data-form="report" class="m-form">${rs.map((r,i) => `<label class="check"><input type="radio" name="r"${i?'':' checked'}> ${r}</label>`).join('')}
    <button class="btn btn-dark btn-lg full" type="submit">${t('report')}</button></form>`, 'sm');
}
function toggleFav(id){
  const on = !S.favs.has(id); on ? S.favs.add(id) : S.favs.delete(id);
  $$(`[data-fav="${id}"]`).forEach(b => { b.classList.toggle('on', on); const sp = b.querySelector('span'); if (sp) sp.textContent = on ? t('in_fav') : t('add_fav'); });
  toast(on ? t('fav_added') : t('fav_removed'), 'heart');
  if (/^(fav|account\/favs)/.test(S.lastPath || '') && !on) { S.keepScroll = true; route(); }
}
function login(name){
  S.user = {name}; toast(t('logged_in'));
  const go = S.after || '#/account/ads'; S.after = null; renderShell();
  if (location.hash === go) route(); else location.hash = go;
}
function goHash(h){ if (location.hash === h) { S.keepScroll = false; S.lastPath = null; route(); } else location.hash = h; }
function setMapPin(x, y, cid){
  const Pp = S.post; if (!Pp) return;
  if (!cid) { let best = null, bd = 1e9; CITIES.forEach(c => { const d = (c.x-x)**2 + (c.y-y)**2; if (d < bd) { bd = d; best = c; } }); cid = best.id; }
  Pp.city = cid; Pp.pin = {x:Math.round(x), y:Math.round(y)}; Pp.err = Pp.err.filter(e => e !== 'city'); rerenderPost();
}

/* ---------------- Events ---------------- */
document.addEventListener('click', e => {
  const T = e.target;
  if (!T.closest('.pop-wrap')) $$('.pop').forEach(p => p.hidden = true);
  const favB = T.closest('[data-fav]');
  if (favB) { e.preventDefault(); e.stopPropagation(); toggleFav(favB.dataset.fav); return; }
  const pc = T.closest('[data-pchip]');
  if (pc) { const k = pc.dataset.pchip, v = pc.dataset.v, d = S.post.d;
    if (pc.dataset.multi) { const a = d[k] || []; d[k] = a.includes(v) ? a.filter(x => x !== v) : a.concat(v); } else d[k] = v; rerenderPost(); return; }
  const fd = T.closest('button[data-flt="deal"]');
  if (fd) { S.f.deal = fd.dataset.v; $$('button[data-flt="deal"]').forEach(b => b.classList.toggle('on', b === fd)); applyFilters(); return; }
  const map = T.closest('#uaeMap');
  if (map) { const mc = T.closest('[data-city]'); if (mc) { const c = city(mc.dataset.city); setMapPin(c.x, c.y, c.id); }
    else { const r = map.getBoundingClientRect(); setMapPin((e.clientX - r.left) / r.width * 400, (e.clientY - r.top) / r.height * 260); } return; }
  const a = T.closest('[data-act]'); if (!a) return;
  const act = a.dataset.act;
  if (act === 'city' || act === 'files') return;
  const Pp = S.post;
  switch (act) {
    case 'hide-strip': S.hideStrip = true; $('#demoStrip').hidden = true; break;
    case 'drawer': { const d = $('#drawer'); d.hidden = !d.hidden; document.body.classList.toggle('noscroll', !d.hidden); break; }
    case 'drawer-link': $('#drawer').hidden = true; document.body.classList.remove('noscroll'); break;
    case 'langmenu': { const p = $('#langPop'); p.hidden = !p.hidden; $$('.pop').forEach(x => { if (x !== p) x.hidden = true; }); break; }
    case 'setlang': if (a.dataset.l === S.lang) { $$('.pop').forEach(x => x.hidden = true); break; } S.lang = a.dataset.l; try { localStorage.setItem('utbot_lang', S.lang); } catch(_) {} document.body.classList.remove('noscroll'); S.keepScroll = true; renderShell(); route(); break;
    case 'notif': { const p = $('#notifPop'); p.hidden = !p.hidden; const u = $('#userPop'); if (u) u.hidden = true; break; }
    case 'notif-read': S.notifRead = true; $$('.notif').forEach(n => n.classList.remove('unread')); { const d = $('.bell .dot'); if (d) d.remove(); } break;
    case 'umenu': { const p = $('#userPop'); p.hidden = !p.hidden; $('#notifPop').hidden = true; break; }
    case 'logout': S.user = null; toast(t('logged_out'), 'logout'); renderShell(); goHash('#/'); break;
    case 'slide': slide(+a.dataset.d); clearInterval(heroTimer); heroTimer = setInterval(() => slide(1), 6500); break;
    case 'slide-to': slide(0, +a.dataset.i); break;
    case 'gal': S.gal.v = +a.dataset.v; S.keepScroll = true; route(); break;
    case 'contact': contactModal(a.dataset.seller, a.dataset.item, a.dataset.svc); break;
    case 'reveal': { const sp = a.querySelector('span'); if (sp) { sp.textContent = phoneOf(a.dataset.seller); sp.classList.add('ltr'); } toast(t('phone_revealed'), 'phone'); break; }
    case 'reveal-m': $('#mPhone').textContent = phoneOf(a.dataset.seller); a.remove(); break;
    case 'call': toast(t('calling'), 'phone'); break;
    case 'wa': toast(t('whatsapp') + ' — ' + t('demo_only'), 'wa'); break;
    case 'share': try { navigator.clipboard && navigator.clipboard.writeText(location.href); } catch(_) {} toast(t('link_copied'), 'share'); break;
    case 'report': reportModal(); break;
    case 'offer': offerModal(a.dataset.p); break;
    case 'mclose': closeModal(); break;
    case 'demo': e.preventDefault(); toast(t('demo_only'), 'info'); break;
    case 'social': login(t('x_name')); break;
    case 'cotype': S.coType = a.dataset.v; S.keepScroll = true; route(); break;
    case 'toggle-filters': $('#filters').classList.toggle('open'); break;
    case 'flt-reset': S.f = {deal: (S.lastPath||'').startsWith('browse') ? S.f.deal : '', city:'', ymin:'', pmax:'', sort:'new'}; S.keepScroll = true; { const lp = S.lastPath; route(); S.lastPath = lp; } break;
    case 'ptype': Pp.type = a.dataset.k; Pp.err = []; rerenderPost(); break;
    case 'pnext': if (!Pp.type) return; if (!postValidate()) { toast(t('req_msg'), 'info'); rerenderPost(); return; } Pp.step = Math.min(5, Pp.step + 1); Pp.err = []; rerenderPost(); break;
    case 'pback': Pp.step = Math.max(1, Pp.step - 1); Pp.err = []; rerenderPost(); break;
    case 'psample': { const s = SAMPLES[Pp.type]; Object.assign(Pp.d, JSON.parse(JSON.stringify(s.d)), s[S.lang] || s.en); Pp.err = [];
      if (!Pp.city) { Pp.city = 'auh'; Pp.area = t('x_area'); Pp.phone = '+971 50 123 4567'; Pp.pin = {x:city('auh').x + 8, y:city('auh').y - 4}; } rerenderPost(); break; }
    case 'psamples': { const d = Pp.d; const art = (Pp.type==='sell'||Pp.type==='rent') ? (cat(d.cat).art || 'excavator') : Pp.type==='mat' ? (cat(d.mtype).art || 'sand') : SAMPLES[Pp.type].art;
      for (let i = 0; i < 4 && Pp.imgs.length < 10; i++) Pp.imgs.push({art, v:i}); rerenderPost(); break; }
    case 'pcover': { const i = +a.dataset.i; Pp.imgs.unshift(Pp.imgs.splice(i, 1)[0]); rerenderPost(); break; }
    case 'prm': { const [im] = Pp.imgs.splice(+a.dataset.i, 1); if (im && im.url) URL.revokeObjectURL(im.url); rerenderPost(); break; }
    case 'publish': if (!postValidate()) { toast(t('agree_msg'), 'info'); rerenderPost(); return; }
      Pp.done = true; Pp.ref = 'BD-D' + Math.floor(100000 + Math.random() * 900000); rerenderPost(); window.scrollTo(0, 0); break;
    case 'pnew': S.post = newPost(); goHash('#/post'); break;
  }
});
document.addEventListener('input', e => {
  const el = e.target, Pp = S.post;
  if (el.dataset.pf && Pp) { const k = el.dataset.pf; Pp.d[k] = el.type === 'checkbox' ? el.checked : el.value;
    if (Pp.err.includes(k) && String(Pp.d[k]).trim()) { Pp.err = Pp.err.filter(x => x !== k); const f = el.closest('.fld'); if (f) f.classList.remove('err'); } }
  if (el.dataset.pl && Pp) { const k = el.dataset.pl; Pp[k] = el.type === 'checkbox' ? el.checked : el.value;
    if (k === 'agree') { Pp.err = []; const c = el.closest('.check'); if (c) c.classList.remove('err'); }
    if (k === 'city' && el.value) { const c = city(el.value); setMapPin(c.x, c.y, c.id); } }
  if (el.dataset.flt && el.tagName !== 'BUTTON') { S.f[el.dataset.flt] = el.value; applyFilters(); }
});
document.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset.act === 'city') { S.city = el.value; S.f.city = el.value; $$('select[data-act="city"]').forEach(s => s.value = el.value);
    const fs = $('select[data-flt="city"]'); if (fs) { fs.value = el.value; applyFilters(); }
    toast((el.value ? L(city(el.value)) : t('all_uae')), 'pin'); }
  if (el.dataset.act === 'files') addFiles(el.files);
});
document.addEventListener('submit', e => {
  const f = e.target, k = f.dataset.form; if (!k) return; e.preventDefault();
  if (k === 'search') { const q = f.elements.namedItem('q').value.trim(); S.scope = f.elements.namedItem('scope').value; goHash('#/search/' + encodeURIComponent(q)); }
  if (k === 'auth') { const n = f.elements.namedItem('name'); login((n && n.value.trim()) || t('x_name')); }
  if (k === 'msg') { closeModal(); toast(t('msg_sent'), 'send'); }
  if (k === 'offer') { closeModal(); toast(t('offer_sent'), 'send'); }
  if (k === 'report') { closeModal(); toast(t('reported'), 'flag'); }
});
document.addEventListener('dragover', e => { const d = e.target.closest && e.target.closest('#drop'); if (d) { e.preventDefault(); d.classList.add('over'); } });
document.addEventListener('dragleave', e => { const d = e.target.closest && e.target.closest('#drop'); if (d) d.classList.remove('over'); });
document.addEventListener('drop', e => { const d = e.target.closest && e.target.closest('#drop'); if (d) { e.preventDefault(); addFiles(e.dataTransfer.files); } });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); const d = $('#drawer'); if (d) d.hidden = true; document.body.classList.remove('noscroll'); } });

/* ---------------- Boot ---------------- */
window.addEventListener('hashchange', route);
renderShell(); route();
})();
