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
const catLabel = it => ['heavy','materials','sandgravel'].includes(it.sec) && it.cat ? L(cat(it.cat)) : L(sec(it.sec));

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
  boat:'<path d="M2 18c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0M4 15l-1-4h18l-2 4M7 11V6h7l3 5M10 6V3"/>',
  layers:'<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 12 10 5 10-5M2 17l10 5 10-5"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7 10-7"/>',
  doc:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>'
};
const ic = (n, c='') => `<svg class="ic ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]||''}</svg>`;
const logoMark = () => `<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="10" fill="#F7B500"/><path d="M8 29h24l-3.5 5h-17z" fill="#1E1F22"/><path d="M13 29V18l8.5-7 7.5 6-3.6 4.4-4-3.2-2.6 2.1V29" fill="none" stroke="#1E1F22" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
const logo = (cls='') => `<a href="#/" class="logo ${cls}" aria-label="Bulldozer"><span class="logo-img"><img src="assets/img/logo.jpg" alt=""></span><span class="logo-words"><b lang="ar">بلدوزر</b><b lang="en">Bulldozer</b></span></a>`;

/* ---------------- Shared components ---------------- */
const vbadge = a => a && a.verified ? `<span class="vbadge" title="${t('verified_badge')}">${ic('check')}</span>` : '';
const advName = a => `<span class="adv-n">${esc(L(a))}${vbadge(a)}</span>`;
const avatar = (a, cls='') => `<div class="co-logo ${cls}" style="--c:${a.color||'#1E1F22'}">${esc(a.ab||'?')}</div>`;
const kindLabel = a => a.kind === 'company' && a.ctype ? `${t('k_company')} · ${L(ctypeOf(a.ctype))}` : t('k_' + (a.kind || 'individual'));
const urgentB = () => `<span class="b b-r">${ic('bolt')} ${t('urgent')}</span>`;

function attrs(it){
  const out = [];
  if (it.year) out.push(`${ic('cal','sm')} ${it.year}`);
  if (it.hours) out.push(`${ic('gauge','sm')} ${fmt(it.hours)} ${t('hrs')}`);
  else if (it.km) out.push(`${ic('gauge','sm')} ${fmt(it.km)} km`);
  if (it.qty) out.push(`${ic('box','sm')} ${esc(L(it.qty))}`);
  if (it.swap) out.push(`${ic('swap','sm')} ${esc(L(it.swap))}`);
  out.push(`${ic('tag','sm')} ${t(it.deal)}`);
  return out.slice(0, 3).map(x => `<span>${x}</span>`).join('');
}
const badgesOf = it => `${it.urgent?urgentB():''}${it.featured&&!it.urgent?`<span class="b b-y">${t('featured_b')}</span>`:''}${it.isNew?`<span class="b b-g">${t('new_b')}</span>`:''}`;
/* Grid card (Dubizzle-like): photo, price first, title, attribute line, location + time */
function card(it, opts={}){
  const fav = S.favs.has(it.id);
  const tag = opts.static ? 'div' : 'a';
  return `<${tag} class="card dz${it.urgent?' is-urgent':''}"${opts.static?'':` href="#/l/${it.id}"`}>
    <div class="media">${opts.media || (ART(artOf(it), vOf(it.id)) + photo(it.id))}
      <div class="badges">${badgesOf(it)}</div>
      ${opts.static?'':`<button class="fav${fav?' on':''}" data-fav="${it.id}" aria-label="${t('add_fav')}">${ic('heart')}</button>`}</div>
    <div class="cbody"><div class="cprice">${priceOf(it)}</div>
      <h3>${esc(title(it))}</h3>
      <div class="cattrs">${attrs(it)}</div>
      <div class="cloc"><span>${ic('pin','sm')} ${L(city(it.city))}${it.area?` · ${esc(L(it.area))}`:''}</span><span class="ago">${ago(it.days||0)}</span></div></div></${tag}>`;
}
/* List card (Dubizzle results view): photo on the side, details, Call / WhatsApp / Chat */
function listCard(it){
  const fav = S.favs.has(it.id), a = advOf(it);
  return `<article class="lcard${it.urgent?' is-urgent':''}"><a class="stretch" href="#/l/${it.id}" aria-label="${esc(title(it))}"></a>
    <div class="media">${ART(artOf(it), vOf(it.id))}${photo(it.id)}<div class="badges">${badgesOf(it)}</div></div>
    <div class="lbody"><div class="ltop"><div class="cprice">${priceOf(it)}</div><button class="fav${fav?' on':''}" data-fav="${it.id}" aria-label="${t('add_fav')}">${ic('heart')}</button></div>
      <span class="lcat">${esc(catLabel(it))}${it.brand && it.brand!=='—' ? ` · <span class="ltr">${esc(it.brand)} ${esc(it.model||'')}</span>` : ''}</span>
      <h3>${esc(title(it))}</h3>
      <div class="cattrs">${attrs(it)}</div>
      <p class="ldesc">${esc(desc(it))}</p>
      <div class="lfoot"><span class="cloc">${ic('pin','sm')} ${L(city(it.city))}${it.area?` · ${esc(L(it.area))}`:''} · ${ago(it.days||0)}</span>
        <div class="lacts"><button class="btn btn-sm btn-line" data-act="call">${ic('phone')} ${t('call')}</button><button class="btn btn-sm btn-wa" data-act="wa">${ic('wa')} ${t('whatsapp')}</button><button class="btn btn-sm btn-dark" data-act="contact" data-seller="${a.id}" data-item="${it.id}">${ic('chat')} ${t('chat')}</button></div></div></div></article>`;
}
const secHead = (h, link, linkTxt) => `<div class="sec-h"><h2>${h}</h2>${link?`<a href="${link}" class="more">${linkTxt||t('view_all')} ${ic('chev','flip')}</a>`:''}</div>`;
const catTile = (c, deal) => `<a class="cat-tile" href="#/c/${c.id}${deal?'?deal='+deal:''}"><div class="ct-art">${ART(c.art,0,true)}${pic('categories', c.id)}</div><span>${L(c)}</span></a>`;
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
    <p>${esc(kindLabel(a))} · ${L(city(a.city))}</p><div class="co-meta"><span>${t('ads_count').replace('{n}', n)}</span></div></div></a>`;
}
const crumbs = arr => `<nav class="crumbs"><button class="back-btn" data-act="back" aria-label="${t('back')}">${ic('arrow','flipb')}<span>${t('back')}</span></button><a href="#/">${t('home')}</a>${arr.map(a => `${ic('chev','flip sm')}${a[1]?`<a href="${a[1]}">${esc(a[0])}</a>`:`<span>${esc(a[0])}</span>`}`).join('')}</nav>`;
const UAE_PATH = `<path d="M14 150 L60 148 L100 156 L140 150 L178 136 L214 116 L240 100 L262 82 L284 58 L300 36 L316 26 L326 44 L332 70 L346 96 L352 124 L342 140 L320 150 L304 170 L306 200 L284 214 L240 228 L190 244 L120 250 L60 248 L14 236 Z" fill="#f3ead6" stroke="#d6c39b" stroke-width="2"/>`;
const PIN = `<path d="M0 0 C-10 -14 -12 -18 -12 -24 A12 12 0 0 1 12 -24 C12 -18 10 -14 0 0Z" fill="#1E1F22"/><circle cy="-24" r="5" fill="#F7B500"/>`;
function miniMap(cid){
  const c = city(cid);
  return `<svg viewBox="0 0 400 260" class="uae-map small" aria-hidden="true"><rect width="400" height="260" fill="#d7e8f2"/>${UAE_PATH}
    ${CITIES.map(x => `<circle cx="${x.x}" cy="${x.y}" r="3" fill="#9aa1a9"/>`).join('')}
    <g transform="translate(${c.x} ${c.y})">${PIN}</g><text x="${c.x}" y="${c.y+20}" text-anchor="middle" class="mp-l">${L(c)}</text></svg>`;
}

/* ---------------- Shell ---------------- */
const NAV = [['', 'home', '#/'], ['s:marine_leisure', 'sec_marine_leisure', '#/s/marine_leisure'], ['s:marine_port', 'sec_marine_port', '#/s/marine_port'],
  ['rent', 'nav_rent', '#/browse/rent'], ['sale', 'nav_sale', '#/browse/sale'], ['s:exchange', 'sec_exchange', '#/s/exchange'],
  ['s:materials', 'sec_materials', '#/s/materials'], ['s:sandgravel', 'sec_sandgravel', '#/s/sandgravel'], ['s:opp', 'sec_opp', '#/s/opp'], ['s:other', 'sec_other', '#/s/other']];
const navLabel = n => n[1].startsWith('sec_') ? L(sec(n[1].slice(4))) : t(n[1]);
const navIcon = n => n[0] === '' ? 'home' : n[0] === 'rent' ? 'clock' : n[0] === 'sale' ? 'tag' : sec(n[0].slice(2)).icon;
const langBtns = () => LANGS.map(l => `<button data-act="setlang" data-l="${l}" class="${S.lang===l?'on':''}" lang="${l}">${I18N[l].lang_name}</button>`).join('');
const brandChip = b => `<a class="brand-chip" href="#/search/${encodeURIComponent(b.q)}"><img src="assets/img/brands/${b.id}.png" alt="" onload="this.parentNode.classList.add('has-logo')" onerror="this.remove()"><span>${b.n}</span></a>`;
function shell(){
  const cityOpts = `<option value="">${t('all_uae')}</option>` + CITIES.map(c => `<option value="${c.id}"${S.city===c.id?' selected':''}>${L(c)}</option>`).join('');
  const u = S.user;
  const userBox = u
    ? `<div class="pop-wrap"><button class="avatar-btn" data-act="umenu"><span class="avatar">${esc(u.name.trim().charAt(0))}</span><span class="only-d">${esc(u.name.split(' ')[0])}</span>${vbadge(u)}</button>
        <div class="pop user-pop" id="userPop" hidden><a href="#/account/profile">${ic('user')} ${t('my_profile')}${u.verified?'':`<i class="dot-warn"></i>`}</a><a href="#/account/ads">${ic('box')} ${t('my_ads')}</a><a href="#/account/favs">${ic('heart')} ${t('favorites')}</a><a href="#/account/msgs">${ic('chat')} ${t('messages')}</a><a href="#/post">${ic('plus')} ${t('post_ad')}</a><button data-act="logout">${ic('logout')} ${t('logout')}</button></div></div>`
    : `<a href="#/login" class="btn btn-dark login-btn">${ic('user')}<span>${t('login')}</span></a>`;
  const drawerLink = (href, icon, label, nav) => `<a href="${href}" data-act="drawer-link"${nav?` data-nav="${nav}"`:''}>${ic(icon)}<span>${label}</span></a>`;
  return `
  <div class="brands" aria-label="${t('brands_h')}"><div class="wrap br-in"><span class="br-l">${ic('star')} ${t('brands_h')}</span>
    <div class="br-track"><div class="br-row">${BRANDS.map(brandChip).join('')}${BRANDS.map(brandChip).join('')}</div></div></div></div>
  <header class="hdr">
    <div class="wrap hdr-top">
      ${logo()}
      <form class="search" data-form="search" role="search">
        <select name="scope" aria-label="scope"><option value="">${t('all')}</option><option value="ads"${S.scope==='ads'?' selected':''}>${t('sc_ads')}</option><option value="accounts"${S.scope==='accounts'?' selected':''}>${t('sc_accounts')}</option></select>
        <input name="q" type="search" placeholder="${t('search_ph')}" value="${esc(S.q)}" aria-label="search">
        <button type="submit" aria-label="search">${ic('search')}</button>
      </form>
      <div class="hdr-actions"><div class="lang-seg" role="group" aria-label="language">${langBtns()}</div>${userBox}</div>
    </div>
    <nav class="mainnav"><div class="wrap navrow"><button class="menu-btn" data-act="drawer" aria-label="${t('menu_t')}">${ic('menu')}<span>${t('all_sections')}</span></button>
      ${NAV.map(n => `<a href="${n[2]}" data-nav="${n[0]}"><span>${navLabel(n)}</span></a>`).join('')}</div></nav>
  </header>
  <main id="view"></main>
  <footer class="ftr"><div class="wrap ftr-cols">
    <div><h4>${t('f_popular')}</h4>${NAV.slice(1).map(n => `<a href="${n[2]}">${navLabel(n)}</a>`).join('')}<a href="#/companies">${t('dir_h')}</a></div>
    <div><h4>${t('f_emirates')}</h4>${CITIES.map(c => `<a href="#/all?city=${c.id}">${L(c)}</a>`).join('')}</div>
    <div><h4>${t('f_company')}</h4><a href="#" data-act="demo">${t('about')}</a><a href="#" data-act="demo">${t('careers')}</a><a href="#" data-act="demo">${t('contact_us')}</a><a href="#" data-act="boost">${t('advertise')}</a><a href="#" data-act="demo">${t('terms')}</a><a href="#" data-act="demo">${t('privacy')}</a></div>
    <div><h4>${t('f_support')}</h4><a href="#" data-act="demo">${t('help_center')}</a><a href="#" data-act="demo">${t('safety_tips')}</a><a href="#" data-act="demo">${t('faq')}</a><a href="#" data-act="boost">${t('pricing')}</a>
      <p class="ltr">${ic('phone','sm')} +971 4 000 0000</p><p class="ltr">${ic('mail','sm')} hello@bulldozer.ae</p></div>
    <div><h4>${t('f_social')}</h4><div class="soc">${['Instagram','X','Facebook','YouTube','LinkedIn'].map(n => `<a href="#" data-act="demo" class="soc-i">${n}</a>`).join('')}</div>
      <h4 class="mt">${t('f_app')}</h4><div class="apps"><a href="#" data-act="demo" class="app-b">${ic('phone')}<span><small>${t('soon')}</small><b>iOS</b></span></a><a href="#" data-act="demo" class="app-b">${ic('phone')}<span><small>${t('soon')}</small><b>Android</b></span></a></div></div>
  </div>
  <div class="ftr-bot"><div class="wrap ftr-bot-in">${logo('sm')}<span>© 2026 Bulldozer — ${t('rights')}</span><span class="demo-note-f">${ic('info','sm')} ${t('demo_strip')}</span></div></div></footer>
  <nav class="tabbar">
    <a href="#/" data-tab="">${ic('home')}<span>${t('home')}</span></a>
    <a href="#" data-act="drawer" data-tab="menu">${ic('menu')}<span>${t('all_sections')}</span></a>
    <a href="#/post" class="tab-post" data-tab="post"><b>${ic('plus')}</b><span>${t('post_ad')}</span></a>
    <a href="#/companies" data-tab="companies">${ic('building')}<span>${t('dir_h')}</span></a>
    <a href="${u?'#/account/profile':'#/login'}" data-tab="account">${ic('user')}<span>${u?t('my_account'):t('login')}</span></a>
  </nav>
  <div class="drawer" id="drawer" hidden><div class="dr-bg" data-act="drawer"></div><aside class="dr-panel">
    <div class="dr-h">${logo()}<button class="icon-btn" data-act="drawer" aria-label="close">${ic('close')}</button></div>
    <div class="dr-langs">${langBtns()}</div>
    <div class="dr-acts"><a href="#/post" class="btn btn-y" data-act="drawer-link">${ic('plus')} ${t('post_ad')}</a><a href="#/post?mode=request" class="btn btn-line" data-act="drawer-link">${ic('search')} ${t('post_request')}</a></div>
    <h5>${t('menu_t')}</h5>
    ${NAV.map(n => drawerLink(n[2], navIcon(n), navLabel(n))).join('')}
    <h5>${t('all_sections')}</h5>
    ${['heavy','wanted','generators','cabins','contractor'].map(id => drawerLink('#/s/'+id, sec(id).icon, L(sec(id)))).join('')}
    ${drawerLink('#/companies', 'building', t('dir_h'))}${drawerLink('#/urgent', 'bolt', t('urgent_ads'))}${drawerLink('#/featured', 'star', t('featured'))}
    <h5>${t('my_account')}</h5>
    ${drawerLink(u?'#/account/profile':'#/login', 'user', u?t('my_account'):t('login'))}${drawerLink('#/fav', 'heart', t('favorites'))}
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
function navKey(p, parts, params){
  if (p === 's') return 's:' + parts[1];
  if (p === 'c') { const id = parts[1]; if (['sand','gravel'].includes(id)) return 's:sandgravel'; if (cat(id).g === 'materials') return 's:materials'; if (id === 'marine') return 's:marine_port'; return params.get('deal') || ''; }
  if (p === 'l') { const it = byId(LISTINGS, parts[1]); if (!it) return ''; return it.sec === 'heavy' ? it.deal : 's:' + it.sec; }
  if (p === 'p') return 's:opp';
  if (p === 'browse') return parts[1];
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
  if (S.lastPath !== path) { S.f = {deal:'', city:S.city, ymin:'', pmax:'', sort:'new', urg:false, kind:'', cat:''}; S.depth = (S.depth || 0) + 1; }
  if (params.get('deal')) S.f.deal = params.get('deal');
  if (params.get('city')) S.f.city = params.get('city');
  clearInterval(heroTimer);
  let html;
  switch (p) {
    case '': html = vHome(); break;
    case 's': html = vSection(parts[1]); break;
    case 'c': html = vCat(parts[1], params); break;
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
  const nk = navKey(p, parts, params);
  $$('[data-nav]').forEach(a => a.classList.toggle('on', a.dataset.nav === nk));
  $$('[data-tab]').forEach(a => a.classList.toggle('on', a.dataset.tab === p || (p==='login' && a.dataset.tab==='account')));
  const onNav = $('.navrow a.on'); $$('.dr-panel [data-nav]').forEach(x => x.classList.toggle('on', x.dataset.nav === nk)); if (onNav && onNav.scrollIntoView && S.lastPath !== path) { try { onNav.scrollIntoView({block:'nearest', inline:'center'}); } catch(e) {} }
  if (!S.keepScroll && S.lastPath !== path) window.scrollTo(0, 0);
  S.keepScroll = false; S.lastPath = path;
  if (p === '') heroTimer = setInterval(() => slide(1), 7000);
  if ($('#resGrid')) applyFilters();
}
