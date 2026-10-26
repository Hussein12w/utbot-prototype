/* Bulldozer — core: state, helpers, icons, shared components, shell, router. Frontend prototype only. */
'use strict';
const S = { lang:'ar', user:null, favs:new Set(['l3','m4']), city:'', post:null, f:{}, slide:0, notifRead:false,
  lastPath:null, keepScroll:false, q:'', scope:'', dir:{q:'', city:'', ver:false}, login:{mode:'login', step:'phone', phone:'', kind:'individual', name:''}, after:null };
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
const sec = id => byId(SECTIONS, id) || {};
const ctypeOf = id => byId(COMPANY_TYPES, id) || {};
const title = it => it[S.lang] || it.en || it.ar || '';
const desc = it => (S.lang === 'ur' ? it.d_ur : it['d' + S.lang]) || it.den || it.dar || '';
const LANGS = ['ar','en','ur'];
const ago = d => d === 0 ? t('today') : t('ago_d').replace('{n}', d);
const artOf = it => it.art || cat(it.cat).art || sec(it.sec).art;
const vOf = id => (parseInt(String(id).replace(/\D/g,''),10) || 0) % 4;
const advOf = it => co(it.seller || it.owner);
const priceHTML = (p, unit) => `<span class="price">${fmt(p)} <small>${t('cur')}${unit && unit !== 'total' ? ' ' + t('u_' + unit) : ''}</small></span>`;
function priceOf(it){
  if (it.deal === 'exchange') return `<span class="price swap-p">${ic('swap')} ${t('exchange')}</span>`;
  if (it.price == null || it.price === '') return `<span class="price ask">${t('price_ask')}</span>`;
  if (it.deal === 'wanted') return `<span class="price-wrap"><small class="pre">${t('budget_upto')}</small>${priceHTML(it.price, it.unit)}</span>`;
  return priceHTML(it.price, it.unit);
}
const pic = (dir, name) => `<img class="ph" src="assets/img/${dir}/${name}.jpg" alt="" loading="lazy" onload="this.classList.add('ok')" onerror="this.remove()">`;
const photo = id => pic('listings', id);
const catLabel = it => (it.sec === 'heavy' || it.sec === 'materials') && it.cat ? L(cat(it.cat)) : L(sec(it.sec));

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
  wa:'<path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.6z"/><path d="M9 9.5c.2 2 2.4 4.3 4.5 4.6l1.2-1.2 2 1-.4 1.6c-3.7.4-8.5-3.9-8.2-7.6L9.7 7.5l1 2z"/>',
  swap:'<path d="M7 4 3 8l4 4"/><path d="M3 8h13a4 4 0 0 1 4 4"/><path d="m17 20 4-4-4-4"/><path d="M21 16H8a4 4 0 0 1-4-4"/>',
  bolt:'<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  cabin:'<rect x="2" y="7" width="20" height="12" rx="1"/><path d="M2 10h20M10 19v-6h4v6M16 13h3v3h-3zM5 13h3v3H5z"/>',
  helmet:'<path d="M2 18h20M4 18v-3a8 8 0 0 1 16 0v3M10 7V4h4v3"/>',
  flask:'<path d="M9 3h6M10 3v6L4 19a1.5 1.5 0 0 0 1.3 2h13.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7 15h10"/>',
  anchor:'<circle cx="12" cy="5" r="2.5"/><path d="M12 7.5V21M5 12H2a10 10 0 0 0 20 0h-3M8 11h8"/>',
  drill:'<path d="M12 2v6M8 8h8l-2 6h-4zM12 14v8M9 18l3 4 3-4"/>',
  drop:'<path d="M12 2.7s7 7.3 7 12.3a7 7 0 0 1-14 0c0-5 7-12.3 7-12.3z"/>',
  tunnel:'<path d="M3 21V11a9 9 0 0 1 18 0v10M7 21v-9a5 5 0 0 1 10 0v9M3 21h18"/>',
  pipe:'<path d="M2 9h9a3 3 0 0 1 3 3v10M2 5v8M10 22h8"/><path d="M14 13h8v-4h-8"/>',
  camera:'<path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
  lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  doc:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>'
};
const ic = (n, c='') => `<svg class="ic ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]||''}</svg>`;
const logoMark = () => `<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="10" fill="#F7B500"/><path d="M8 29h24l-3.5 5h-17z" fill="#1E1F22"/><path d="M13 29V18l8.5-7 7.5 6-3.6 4.4-4-3.2-2.6 2.1V29" fill="none" stroke="#1E1F22" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
const logo = () => `<a href="#/" class="logo" aria-label="Bulldozer"><span class="logo-mark">${logoMark()}</span><span class="logo-word">Bull<b>dozer</b></span></a>`;

/* ---------------- Shared components ---------------- */
const vbadge = a => a && a.verified ? `<span class="vbadge" title="${t('verified_badge')}">${ic('check')}</span>` : '';
const advName = a => `<span class="adv-n">${esc(L(a))}${vbadge(a)}</span>`;
const avatar = (a, cls='') => `<div class="co-logo ${cls}" style="--c:${a.color||'#1E1F22'}">${esc(a.ab||'?')}</div>`;
const kindLabel = a => a.kind === 'company' && a.ctype ? `${t('k_company')} · ${L(ctypeOf(a.ctype))}` : t('k_' + (a.kind || 'individual'));
const urgentB = () => `<span class="b b-r">${ic('bolt')} ${t('urgent')}</span>`;

function card(it, opts={}){
  const fav = S.favs.has(it.id), a = advOf(it);
  let meta = `<span>${ic('pin')} ${L(city(it.city))}</span>`;
  if (it.deal === 'supply' && it.qty) meta += `<span>${ic('box')} ${esc(L(it.qty))}</span>`;
  else if (it.year) meta += `<span>${ic('cal')} ${it.year}</span>`;
  const tag = opts.static ? 'div' : 'a';
  return `<${tag} class="card${it.urgent?' is-urgent':''}"${opts.static?'':` href="#/l/${it.id}"`}>
    <div class="media">${opts.media || (ART(artOf(it), vOf(it.id)) + photo(it.id))}
      <div class="badges">${it.urgent?urgentB():''}${it.featured&&!it.urgent?`<span class="b b-y">${t('featured_b')}</span>`:''}${it.isNew?`<span class="b b-g">${t('new_b')}</span>`:''}</div>
      ${opts.static?'':`<button class="fav${fav?' on':''}" data-fav="${it.id}" aria-label="${t('add_fav')}">${ic('heart')}</button>`}
      <span class="deal deal-${it.deal}">${t(it.deal)}</span></div>
    <div class="cbody"><div class="ctop"><span class="ccat">${esc(catLabel(it))}</span>${it.brand && it.brand!=='—' ? `<span class="cmodel">${esc(it.brand)} ${esc(it.model||'')}</span>` : ''}</div>
      <h3>${esc(title(it))}</h3>
      <div class="cmeta">${meta}</div>
      ${a.id ? `<div class="cadv">${ic('user','sm')} ${advName(a)}</div>` : ''}
      <div class="cfoot">${priceOf(it)}<span class="ago">${ago(it.days||0)}</span></div></div></${tag}>`;
}
const secHead = (h, link, linkTxt) => `<div class="sec-h"><h2>${h}</h2>${link?`<a href="${link}" class="more">${linkTxt||t('view_all')} ${ic('chev','flip')}</a>`:''}</div>`;
const catTile = c => `<a class="cat-tile" href="#/c/${c.id}"><div class="ct-art">${ART(c.art,0,true)}${pic('categories', c.id)}</div><span>${L(c)}</span></a>`;
const secCount = id => id === 'opp' ? PROJECTS.length : LISTINGS.filter(l => l.sec === id).length;
const secTile = s => `<a class="sec-tile" href="#/s/${s.id}"><span class="st-ic">${ic(s.icon)}</span><b>${L(s)}</b><small>${t('ads_count').replace('{n}', secCount(s.id))}</small></a>`;
function projCard(p){
  const a = advOf(p);
  return `<a class="proj${p.urgent?' is-urgent':''}" href="#/p/${p.id}"><div class="proj-top"><span class="tag">${t(p.type)}</span>${p.urgent?urgentB():`<span class="ago">${ago(p.days)}</span>`}</div>
    <h3>${esc(L(p))}</h3><p class="muted clamp2">${esc(desc(p))}</p>
    <div class="proj-meta"><span>${ic('pin')} ${L(city(p.city))}</span><span>${ic('clock')} ${p.dur} ${t('days')}</span><span>${ic('users')} ${p.bids} ${t('bids')}</span></div>
    ${a.id ? `<div class="cadv">${ic('user','sm')} ${advName(a)}</div>` : ''}
    <div class="proj-foot"><div><small>${t('budget')}</small><b>${fmt(p.b1)} – ${fmt(p.b2)} <em>${t('cur')}</em></b></div><span class="btn btn-sm btn-dark">${t('submit_offer')}</span></div></a>`;
}
function servCard(s){
  const a = co(s.seller);
  return `<div class="serv"><div class="serv-art">${ART(s.art, vOf(s.id))}${pic('services', s.id)}</div><div class="serv-b"><span class="tag">${t(s.type)}</span><h3>${esc(L(s))}</h3><p class="muted clamp2">${esc(desc(s))}</p>
    <div class="serv-f"><div><small>${t('from')}</small>${priceHTML(s.price, s.unit)}</div><button class="btn btn-sm btn-y" data-act="contact" data-seller="${s.seller}" data-svc="${s.id}">${t('request_service')}</button></div>
    <a class="serv-prov" href="#/u/${a.id}">${t('provider')}: ${advName(a)}</a></div></div>`;
}
function advCard(a){
  const n = LISTINGS.filter(l => l.seller === a.id).length + PROJECTS.filter(p => p.owner === a.id).length;
  return `<a class="co-card" href="#/u/${a.id}">${avatar(a)}<div class="co-info"><h3>${advName(a)}</h3>
    <p>${esc(kindLabel(a))} · ${L(city(a.city))}</p><div class="co-meta">${a.verified?`<span class="ok-t">${t('verified_acc')}</span>`:`<span class="no-t">${t('not_verified')}</span>`}<span>${t('ads_count').replace('{n}', n)}</span></div></div></a>`;
}
const crumbs = arr => `<nav class="crumbs"><a href="#/">${t('home')}</a>${arr.map(a => `${ic('chev','flip sm')}${a[1]?`<a href="${a[1]}">${esc(a[0])}</a>`:`<span>${esc(a[0])}</span>`}`).join('')}</nav>`;
const UAE_PATH = `<path d="M14 150 L60 148 L100 156 L140 150 L178 136 L214 116 L240 100 L262 82 L284 58 L300 36 L316 26 L326 44 L332 70 L346 96 L352 124 L342 140 L320 150 L304 170 L306 200 L284 214 L240 228 L190 244 L120 250 L60 248 L14 236 Z" fill="#f3ead6" stroke="#d6c39b" stroke-width="2"/>`;
const PIN = `<path d="M0 0 C-10 -14 -12 -18 -12 -24 A12 12 0 0 1 12 -24 C12 -18 10 -14 0 0Z" fill="#1E1F22"/><circle cy="-24" r="5" fill="#F7B500"/>`;
function miniMap(cid){
  const c = city(cid);
  return `<svg viewBox="0 0 400 260" class="uae-map small" aria-hidden="true"><rect width="400" height="260" fill="#d7e8f2"/>${UAE_PATH}
    ${CITIES.map(x => `<circle cx="${x.x}" cy="${x.y}" r="3" fill="#9aa1a9"/>`).join('')}
    <g transform="translate(${c.x} ${c.y})">${PIN}</g><text x="${c.x}" y="${c.y+20}" text-anchor="middle" class="mp-l">${L(c)}</text></svg>`;
}

/* ---------------- Shell ---------------- */
const NAV = [['', 'home', '#/'], ['s:heavy', 'sec_heavy', '#/s/heavy'], ['s:wanted', 'sec_wanted', '#/s/wanted'], ['s:opp', 'sec_opp', '#/s/opp'],
  ['s:exchange', 'sec_exchange', '#/s/exchange'], ['s:generators', 'sec_generators', '#/s/generators'], ['s:cabins', 'sec_cabins', '#/s/cabins'],
  ['s:contractor', 'sec_contractor', '#/s/contractor'], ['s:materials', 'sec_materials', '#/s/materials'], ['companies', 'companies', '#/companies'], ['s:other', 'sec_other', '#/s/other']];
const navLabel = n => n[1].startsWith('sec_') ? L(sec(n[1].slice(4))) : t(n[1]);
const langBtns = () => LANGS.map(l => `<button data-act="setlang" data-l="${l}" class="${S.lang===l?'on':''}" lang="${l}">${I18N[l].lang_name}${S.lang===l?ic('check','sm'):''}</button>`).join('');
function shell(){
  const cityOpts = `<option value="">${t('all_uae')}</option>` + CITIES.map(c => `<option value="${c.id}"${S.city===c.id?' selected':''}>${L(c)}</option>`).join('');
  const notif = `<div class="pop notif-pop" id="notifPop" hidden><div class="pop-h"><b>${t('notifications')}</b><button class="link" data-act="notif-read">${t('mark_read')}</button></div>
    ${NOTIFS.map(n => `<div class="notif${S.notifRead?'':' unread'}"><span class="n-ic">${ic('bell')}</span><div><p>${esc(L(n))}</p><small>${t('ago_h').replace('{n}', n.h)}</small></div></div>`).join('')}</div>`;
  const u = S.user;
  const userBox = u
    ? `<div class="pop-wrap"><button class="avatar-btn" data-act="umenu"><span class="avatar">${esc(u.name.trim().charAt(0))}</span><span class="only-d">${esc(u.name.split(' ')[0])}</span>${vbadge(u)}</button>
        <div class="pop user-pop" id="userPop" hidden><a href="#/account/profile">${ic('user')} ${t('my_profile')}${u.verified?'':`<i class="dot-warn"></i>`}</a><a href="#/account/ads">${ic('box')} ${t('my_ads')}</a><a href="#/account/favs">${ic('heart')} ${t('favorites')}</a><a href="#/account/msgs">${ic('chat')} ${t('messages')}</a><button data-act="logout">${ic('logout')} ${t('logout')}</button></div></div>`
    : `<a href="#/login" class="btn btn-dark only-d">${ic('phone')} ${t('login')}</a>`;
  const navLinks = cls => NAV.map(n => `<a href="${n[2]}" data-nav="${n[0]}"${cls}>${n[0]===''?ic('home'):''}<span>${navLabel(n)}</span></a>`).join('');
  return `
  <div class="demo-strip" id="demoStrip"${S.hideStrip?' hidden':''}><div class="wrap">${ic('info')}<span>${t('demo_strip')}</span><button data-act="hide-strip" aria-label="close">${ic('close')}</button></div></div>
  <header class="hdr">
    <div class="wrap hdr-top">
      <button class="icon-btn only-m" data-act="drawer" aria-label="menu">${ic('menu')}</button>
      <div class="brand">${logo()}<div class="brand-txt"><strong>${t('brand_tag')}</strong><span>${t('brand_sub')}</span></div></div>
      <form class="search" data-form="search" role="search">
        <select name="scope" aria-label="scope"><option value="">${t('all')}</option><option value="ads"${S.scope==='ads'?' selected':''}>${t('sc_ads')}</option><option value="accounts"${S.scope==='accounts'?' selected':''}>${t('sc_accounts')}</option></select>
        <input name="q" type="search" placeholder="${t('search_ph')}" value="${esc(S.q)}" aria-label="search">
        <button type="submit" aria-label="search">${ic('search')}</button>
      </form>
      <div class="hdr-actions">
        <label class="city-sel">${ic('pin')}<select data-act="city" aria-label="${t('city')}">${cityOpts}</select></label>
        <div class="pop-wrap"><button class="hbtn" data-act="langmenu" aria-label="language">${ic('globe')}<span>${t('lang_name')}</span></button><div class="pop lang-pop" id="langPop" hidden>${langBtns()}</div></div>
        <div class="pop-wrap"><button class="icon-btn bell" data-act="notif" aria-label="${t('notifications')}">${ic('bell')}${S.notifRead?'':'<i class="dot">3</i>'}</button>${notif}</div>
        ${userBox}
        <a href="#/post?mode=request" class="btn btn-line req-btn only-d">${ic('search')} ${t('post_request')}</a>
        <a href="#/post" class="btn btn-y post-btn">${ic('plus')}<span>${t('post_ad')}</span></a>
      </div>
    </div>
    <nav class="mainnav"><div class="wrap navrow">${navLinks('')}</div></nav>
  </header>
  <main id="view"></main>
  <footer class="ftr"><div class="wrap ftr-grid">
    <div class="ftr-about">${logo()}<p>${t('f_about')}</p><span class="badge-soon">${ic('tag')} ${t('free_note')}</span></div>
    <div><h4>${t('f_links')}</h4>${['heavy','wanted','opp','exchange','contractor'].map(id => `<a href="#/s/${id}">${L(sec(id))}</a>`).join('')}<a href="#/companies">${t('dir_h')}</a></div>
    <div><h4>${t('f_help')}</h4><a href="#" data-act="demo">${t('about')}</a><a href="#" data-act="boost">${t('pricing')}</a><a href="#" data-act="demo">${t('faq')}</a><a href="#" data-act="demo">${t('terms')}</a><a href="#" data-act="demo">${t('privacy')}</a></div>
    <div><h4>${t('f_contact')}</h4><p class="ltr">+971 4 000 0000</p><p class="ltr">hello@bulldozer.ae</p><p>${L(city('dxb'))} — ${t('x_country')}</p></div>
  </div><div class="wrap ftr-bot"><span>© 2026 Bulldozer — ${t('rights')}</span><span class="muted">${t('sample')}</span></div></footer>
  <nav class="tabbar">
    <a href="#/" data-tab="">${ic('home')}<span>${t('home')}</span></a>
    <a href="#/s/heavy" data-tab="s">${ic('grid')}<span>${L(sec('heavy'))}</span></a>
    <a href="#/post" class="tab-post" data-tab="post"><b>${ic('plus')}</b><span>${t('post_ad')}</span></a>
    <a href="#/companies" data-tab="companies">${ic('building')}<span>${t('dir_h')}</span></a>
    <a href="${u?'#/account/profile':'#/login'}" data-tab="account">${ic('user')}<span>${u?t('my_account'):t('login')}</span></a>
  </nav>
  <div class="drawer" id="drawer" hidden><div class="dr-bg" data-act="drawer"></div><aside class="dr-panel">
    <div class="dr-h">${logo()}<button class="icon-btn" data-act="drawer" aria-label="close">${ic('close')}</button></div>
    ${NAV.map(n => `<a href="${n[2]}" data-act="drawer-link">${n[0]===''?ic('home'):ic(n[0]==='companies'?'building':sec(n[0].slice(2)).icon)}<span>${navLabel(n)}</span></a>`).join('')}
    <hr><a href="#/post" data-act="drawer-link">${ic('plus')}<span>${t('post_ad')}</span></a>
    <a href="#/post?mode=request" data-act="drawer-link">${ic('search')}<span>${t('post_request')}</span></a>
    <a href="${u?'#/account/profile':'#/login'}" data-act="drawer-link">${ic('user')}<span>${u?t('my_account'):t('login')}</span></a>
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
function navKey(p, parts){
  if (p === 's') return 's:' + parts[1];
  if (p === 'c') return 's:' + (cat(parts[1]).g === 'materials' ? 'materials' : 'heavy');
  if (p === 'l') { const it = byId(LISTINGS, parts[1]); return it ? 's:' + it.sec : ''; }
  if (p === 'p') return 's:opp';
  if (p === 'browse') return 's:heavy';
  if (p === 'companies') return 'companies';
  return p === '' ? '' : '-';
}
function route(){
  const h = location.hash.replace(/^#\/?/, '');
  const [path, qs] = h.split('?');
  const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
  let p = parts[0] || '';
  const params = new URLSearchParams(qs || '');
  const alias = {equipment:['s','heavy'], materials:['s','materials'], projects:['s','opp'], co:['u', parts[1]]};
  if (alias[p]) { const a = alias[p]; parts.splice(0, 2, a[0], a[1]); p = a[0]; }
  if (S.lastPath !== path) S.f = {deal:'', city:S.city, ymin:'', pmax:'', sort:'new', urg:false, ver:false, kind:''};
  clearInterval(heroTimer);
  let html;
  switch (p) {
    case '': html = vHome(); break;
    case 's': html = vSection(parts[1]); break;
    case 'c': html = vCat(parts[1]); break;
    case 'browse': html = vDeal(parts[1]); break;
    case 'featured': case 'all': case 'urgent': html = vList(p); break;
    case 'search': html = vSearch(parts[1] || ''); break;
    case 'l': html = vListing(parts[1]); break;
    case 'p': html = vProject(parts[1]); break;
    case 'companies': html = vCompanies(parts[1]); break;
    case 'u': html = vProfile(parts[1], parts[2] || 'ads'); break;
    case 'services': html = vServices(); break;
    case 'post': html = vPost(params); break;
    case 'login': html = vLogin(params); break;
    case 'account': html = vAccount(parts[1] || 'profile'); break;
    case 'fav': html = vFavPage(); break;
    default: html = vNF();
  }
  $('#view').innerHTML = html;
  const nk = navKey(p, parts);
  $$('[data-nav]').forEach(a => a.classList.toggle('on', a.dataset.nav === nk));
  $$('[data-tab]').forEach(a => a.classList.toggle('on', a.dataset.tab === p || (p==='login' && a.dataset.tab==='account')));
  const onNav = $('.navrow a.on'); if (onNav && onNav.scrollIntoView && S.lastPath !== path) { try { onNav.scrollIntoView({block:'nearest', inline:'center'}); } catch(e) {} }
  if (!S.keepScroll && S.lastPath !== path) window.scrollTo(0, 0);
  S.keepScroll = false; S.lastPath = path;
  if (p === '') heroTimer = setInterval(() => slide(1), 7000);
  if ($('#resGrid')) applyFilters();
}
