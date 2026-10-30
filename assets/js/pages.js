/* Bulldozer — pages: home, sections, browse, listing, opportunities, directory, profiles, search. */

/* ---------------- Home ---------------- */
const SLIDES = [
  {img:'assets/img/hero-1.jpg', k:'hero1', b1:['#/s/heavy','explore_eq'], b2:['#/post','post_ad']},
  {img:'assets/img/hero-2.jpg', k:'hero2', b1:['#/browse/rent','browse_rent'], b2:['#/post?type=heavy','promo_btn']}
];
function slide(d, to){
  const n = SLIDES.length; S.slide = to !== undefined ? to : (S.slide + d + n) % n;
  $$('.slide').forEach((s,i) => s.classList.toggle('on', i === S.slide));
  $$('.dots button').forEach((s,i) => s.classList.toggle('on', i === S.slide));
}
function quickBar(){
  return `<div class="quickbar"><div class="wrap qb-row"><span class="qb-l">${ic('bolt')} ${t('quick_label')}</span>
    ${QUICK.map(id => `<a href="#/s/${id}" class="qb-i">${ic(sec(id).icon)}<span>${id==='heavy'?t('quick_heavy'):L(sec(id))}</span></a>`).join('')}</div></div>`;
}
function catSection(){
  const d = S.homeDeal || 'rent', eq = CATS.filter(c => c.g === 'equipment');
  const n = id => LISTINGS.filter(l => l.cat === id && l.deal === d && EQ_SECS.includes(l.sec)).length;
  return `<div class="sec-h"><h2>${t('browse_cat_h')}</h2><div class="seg">${['rent','sale'].map(x => `<button class="${d===x?'on':''}" data-act="home-deal" data-d="${x}">${t(x)}</button>`).join('')}</div></div>
    <div class="cat-strip">${eq.map(c => `<a class="cat-tile" href="#/c/${c.id}?deal=${d}"><div class="ct-art">${ART(c.art,0,true)}${pic('categories', c.id)}</div><span>${L(c)}</span><small>${t('n_ads').replace('{n}', n(c.id))}</small></a>`).join('')}
      <a class="cat-tile more-tile" href="#/browse/${d}">${ic('grid')}<span>${t('view_all')}</span><small>${t('nav_'+d)}</small></a></div>`;
}
function vHome(){
  const eqCats = CATS.filter(c => c.g === 'equipment'), matCats = CATS.filter(c => c.g === 'materials');
  const featured = LISTINGS.filter(l => l.featured).slice(0, 8);
  const urgent = LISTINGS.filter(l => l.urgent);
  const latest = LISTINGS.slice().sort((a,b) => a.days - b.days).slice(0, 10);
  const minP = id => Math.min(...LISTINGS.filter(l => l.cat === id && ['materials','sandgravel'].includes(l.sec)).map(l => l.price));
  const unitOf = id => (LISTINGS.find(l => l.cat === id && ['materials','sandgravel'].includes(l.sec)) || {}).unit;
  return `${quickBar()}
  <section class="hero">
    ${SLIDES.map((s,i) => `<div class="slide${i===S.slide?' on':''}"><div class="hero-grid">
      <div class="hero-txt-col"><div class="hero-txt">
        <span class="free-chip">${ic('tag')} ${t('free_ads')}</span>
        <h1><span>${t(s.k+'_a')}</span><span>${t(s.k+'_b')}</span><span class="y">${t(s.k+'_c')}</span></h1>
        <p class="lead">${t(s.k+'_p')}</p><p>${t(s.k === 'hero1' ? 'hero1_p2' : s.k+'_p2')}</p>
        <div class="hero-btns"><a class="btn btn-dark btn-lg" href="${s.b1[0]}">${t(s.b1[1])}</a><a class="btn btn-white btn-lg" href="${s.b2[0]}">${ic('plus')} ${t(s.b2[1])}</a></div>
      </div></div>
      <div class="hero-img" style="background-image:url('${s.img}')"></div>
    </div></div>`).join('')}
    <div class="hero-ctrl"><button class="hnav" data-act="slide" data-d="-1" aria-label="previous">${ic('chevl','flip')}</button>
      <div class="dots">${SLIDES.map((s,i) => `<button class="${i===S.slide?'on':''}" data-act="slide-to" data-i="${i}" aria-label="slide ${i+1}"></button>`).join('')}</div>
      <button class="hnav" data-act="slide" data-d="1" aria-label="next">${ic('chev','flip')}</button></div>
  </section>

  <section class="wrap intents">
    <div class="intent i-buy"><div class="i-txt"><h2>${t('buy_title')}</h2><p>${t('buy_desc')}</p>
      <div class="i-btns"><a class="btn btn-y" href="#/post?mode=request">${ic('search')} ${t('buy_btn')}</a><a class="btn btn-line" href="#/s/wanted">${L(sec('wanted'))}</a></div></div></div>
    <div class="intent i-sell"><div class="i-txt"><h2>${t('sell_title')}</h2><p>${t('sell_desc')}</p>
      <div class="i-btns"><a class="btn btn-y" href="#/post?mode=offer">${ic('plus')} ${t('sell_btn')}</a></div></div></div>
    <div class="stats">
      <div>${ic('crane')}<b>+15,000</b><span>${t('st_eq')}</span></div><div>${ic('building')}<b>+3,200</b><span>${t('st_co')}</span></div>
      <div>${ic('road')}<b>+8,000</b><span>${t('st_pr')}</span></div><div>${ic('users')}<b>+25,000</b><span>${t('st_us')}</span></div>
    </div>
  </section>

  <section class="wrap sec">${secHead(t('sec_h'))}<div class="sec-grid">${SECTIONS.map(secTile).join('')}</div></section>

  ${urgent.length ? `<section class="wrap sec">${secHead(`<span class="urg-h">${ic('bolt')}</span> ${t('urgent_ads')}`, '#/urgent')}<div class="hscroll">${urgent.map(card).join('')}</div></section>` : ''}

  <section class="wrap sec" id="catSec">${catSection()}</section>

  <section class="wrap sec">${secHead(t('featured'), '#/featured')}<div class="grid">${featured.map(c => card(c)).join('')}</div></section>

  <section class="wrap sec">${secHead(L(sec('opp')), '#/s/opp')}<div class="proj-grid">${PROJECTS.slice(0,3).map(projCard).join('')}</div></section>

  <section class="wrap sec">${secHead(t('sec_mat'), '#/s/materials')}
    <div class="mat-grid">${matCats.map(c => `<a class="mat" href="#/c/${c.id}"><div class="mat-art">${ART(c.art, 0)}${pic('categories', c.id)}</div><div class="mat-b"><b>${L(c)}</b><small>${t('from')} ${fmt(minP(c.id))} ${t('cur')} ${t('u_'+unitOf(c.id))}</small></div></a>`).join('')}</div></section>

  <section class="wrap"><div class="promo"><div class="promo-txt"><h2>${t('promo_t')}</h2><p>${t('promo_p')}</p><a class="btn btn-y btn-lg" href="#/post?type=heavy">${ic('plus')} ${t('promo_btn')}</a></div></div></section>

  <section class="wrap sec">${secHead(t('latest'), '#/all')}<div class="hscroll">${latest.map(c => card(c)).join('')}</div></section>

  <section class="wrap sec">${secHead(t('dir_h'), '#/companies', t('all_types'))}<div class="type-tiles">${COMPANY_TYPES.slice(0,8).map(typeTile).join('')}</div></section>

  <section class="wrap sec trust"><h2>${ic('shield')} ${t('trust_h')}</h2><div class="trust-grid">
    ${[['phone','trust1'],['check','trust2'],['eye','trust3'],['flag','trust4']].map(x => `<div class="trust-i"><span class="tr-ic">${ic(x[0])}</span><h3>${t(x[1])}</h3><p>${t(x[1]+'p')}</p></div>`).join('')}
  </div></section>`;
}

/* ---------------- Generic browse with filters ---------------- */
let BASE = [], BASE_CARD = listCard;
function browse(o){
  BASE = o.items; BASE_CARD = o.cardFn || listCard;
  const deals = o.deals || [];
  const chip = (v, lbl) => `<button class="chip${S.f.deal===v?' on':''}" data-flt="deal" data-v="${v}">${lbl}</button>`;
  const years = [2024,2022,2020,2018,2015];
  const tog = (k, lbl) => `<label class="toggle sm"><input type="checkbox" data-flt="${k}"${S.f[k]?' checked':''}><span class="tg"></span>${lbl}</label>`;
  return `<section class="page-head"><div class="wrap head-flex"><div>${crumbs(o.crumbs)}<h1>${o.icon?`<span class="h-ic">${ic(o.icon)}</span>`:''}${esc(o.title)}</h1>${o.sub?`<p>${o.sub}</p>`:''}</div>${o.cta||''}</div>${o.tiles?`<div class="wrap">${o.tiles}</div>`:''}</section>
  ${o.before||''}
  <div class="wrap browse">
    <aside class="filters" id="filters"><div class="flt-h"><b>${ic('filter')} ${t('filters')}</b><button class="link" data-act="flt-reset">${t('reset')}</button></div>
      ${deals.length && !o.fixedDeal ? `<div class="flt-g"><label>${t('deal_type')}</label><div class="chips">${chip('', t('any'))}${deals.map(d => chip(d, t(d))).join('')}</div></div>` : ''}
      <div class="flt-g"><label>${t('city')}</label><select data-flt="city"><option value="">${t('all_uae')}</option>${CITIES.map(c => `<option value="${c.id}"${S.f.city===c.id?' selected':''}>${L(c)}</option>`).join('')}</select></div>
      ${o.cats ? `<div class="flt-g"><label>${t('category')}</label><select data-flt="cat"><option value="">${t('all_cats')}</option>${o.cats.map(c => `<option value="${c.id}"${S.f.cat===c.id?' selected':''}>${L(c)}</option>`).join('')}</select></div>` : ''}
      ${o.year ? `<div class="flt-g"><label>${t('year_from')}</label><select data-flt="ymin"><option value="">${t('any')}</option>${years.map(y => `<option${String(S.f.ymin)===String(y)?' selected':''}>${y}</option>`).join('')}</select></div>` : ''}
      ${o.noPrice ? '' : `<div class="flt-g"><label>${t('max_price')} (${t('cur')})</label><input type="number" min="0" inputmode="numeric" data-flt="pmax" value="${esc(S.f.pmax)}" placeholder="—"></div>`}
      ${o.noKind ? '' : `<div class="flt-g"><label>${t('adv_type')}</label><select data-flt="kind"><option value="">${t('any')}</option>${['individual','company','contractor'].map(k => `<option value="${k}"${S.f.kind===k?' selected':''}>${t('k_'+k)}</option>`).join('')}</select></div>`}
      <div class="flt-g tg-g">${tog('urg', t('urgent_only'))}</div>
      <button class="btn btn-dark full only-m" data-act="toggle-filters">${t('apply')}</button>
    </aside>
    <div class="results"><div class="res-bar"><button class="btn btn-line only-m" data-act="toggle-filters">${ic('filter')} ${t('show_filters')}</button><span id="resCount" class="muted"></span>
      <label class="sort">${t('sort')}<select data-flt="sort"><option value="new"${S.f.sort==='new'?' selected':''}>${t('newest')}</option><option value="asc"${S.f.sort==='asc'?' selected':''}>${t('price_low')}</option><option value="desc"${S.f.sort==='desc'?' selected':''}>${t('price_high')}</option></select></label></div>
      <div class="${o.gridClass || 'lgrid'}" id="resGrid"></div></div>
  </div>${o.after||''}`;
}
function applyFilters(){
  const f = S.f;
  let a = BASE.filter(it => { const ad = advOf(it);
    return (!f.deal || it.deal === f.deal) && (!f.city || it.city === f.city) && (!f.ymin || !it.year || it.year >= +f.ymin) && (!f.pmax || it.price == null || it.price <= +f.pmax)
      && (!f.urg || it.urgent) && (!f.kind || ad.kind === f.kind) && (!f.cat || it.cat === f.cat); });
  const pv = x => x.price == null ? Infinity : x.price;
  if (f.sort === 'asc') a.sort((x,y) => pv(x) - pv(y)); else if (f.sort === 'desc') a.sort((x,y) => (y.price||0) - (x.price||0)); else a.sort((x,y) => (y.urgent?1:0) - (x.urgent?1:0) || x.days - y.days);
  $('#resGrid').innerHTML = a.length ? a.map(x => BASE_CARD(x)).join('') : `<div class="empty">${ic('search')}<p>${t('no_results')}</p><button class="btn btn-line" data-act="flt-reset">${t('reset')}</button></div>`;
  $('#resCount').textContent = `${a.length} ${t('results')}`;
}
const postCta = (type, lbl) => `<a class="btn btn-y" href="#/post?type=${type}">${ic('plus')} ${lbl || t('post_ad')}</a>`;
function vSection(id){
  const s = sec(id); if (!s.id) return vNF();
  const base = {title:L(s), icon:s.icon, crumbs:[[L(s)]], cta:postCta(id)};
  if (id === 'opp') return browse(Object.assign(base, {items:PROJECTS, cardFn:projCard, gridClass:'proj-grid two-col', sub:t('proj_intro'), cta:postCta('opp', t('request_project'))}));
  const items = LISTINGS.filter(l => l.sec === id);
  if (id === 'heavy') return browse(Object.assign(base, {items, deals:['sale','rent'], year:true, tiles:`<div class="cat-strip compact">${CATS.filter(c => c.g==='equipment').map(c => catTile(c)).join('')}</div>`}));
  if (id === 'materials') return browse(Object.assign(base, {items, tiles:`<div class="cat-strip compact">${CATS.filter(c => c.g==='materials' && !['sand','gravel'].includes(c.id)).map(c => catTile(c)).join('')}</div>`}));
  if (id === 'sandgravel') return browse(Object.assign(base, {items, sub:t('pd_sandgravel'), tiles:`<div class="cat-strip compact">${CATS.filter(c => ['sand','gravel'].includes(c.id)).map(c => catTile(c)).join('')}</div>`}));
  if (id === 'marine_leisure' || id === 'marine_port') return browse(Object.assign(base, {items, deals:['sale','rent'], year:true, sub:t('pd_'+id)}));
  if (id === 'generators' || id === 'cabins') return browse(Object.assign(base, {items, deals:['sale','rent'], year:id==='generators'}));
  if (id === 'wanted') return browse(Object.assign(base, {items, sub:t('pd_wanted'), cta:postCta('wanted', t('buy_btn'))}));
  if (id === 'exchange') return browse(Object.assign(base, {items, year:true, noPrice:true, sub:t('pd_exchange')}));
  if (id === 'contractor') return browse(Object.assign(base, {items, noPrice:true, noKind:true, sub:`${ic('shield','sm')} ${t('licensed_contractor')}`}));
  return browse(Object.assign(base, {items, after:`<div class="wrap sec">${secHead(t('sec_services'))}<div class="serv-grid">${SERVICES.map(servCard).join('')}</div></div>`}));
}
const EQ_SECS = ['heavy','marine_port','marine_leisure','generators','cabins'];
function vCat(id, params){
  const c = cat(id); if (!c.id) return vNF();
  const g = ['sand','gravel'].includes(id) ? 'sandgravel' : c.g === 'materials' ? 'materials' : id === 'marine' ? 'marine_port' : 'heavy';
  const isEq = c.g === 'equipment', d = params && params.get('deal');
  const sib = CATS.filter(x => x.g === c.g && (g !== 'materials' || !['sand','gravel'].includes(x.id)) && (g !== 'sandgravel' || ['sand','gravel'].includes(x.id)));
  const back = isEq && d ? [t('nav_'+d), '#/browse/'+d] : [L(sec(g)), '#/s/'+g];
  return browse({ title:L(c) + (isEq && d ? ` — ${t(d)}` : ''), crumbs:[back,[L(c)]], items:LISTINGS.filter(l => l.cat === id && (EQ_SECS.includes(l.sec) || l.sec === g)), year:isEq, deals:isEq?['sale','rent']:[], cta:postCta(g),
    tiles:`<div class="chips scroll">${sib.map(x => `<a class="chip${x.id===id?' on':''}" href="#/c/${x.id}${isEq && d ? '?deal='+d : ''}">${L(x)}</a>`).join('')}</div>` });
}
function vDeal(d){
  if (!['sale','rent'].includes(d)) return vNF();
  S.f.deal = d;
  const eq = CATS.filter(c => c.g === 'equipment');
  return browse({ title:t('nav_'+d), icon:d === 'rent' ? 'clock' : 'tag', crumbs:[[t('nav_'+d)]], items:LISTINGS.filter(l => l.deal === d && EQ_SECS.includes(l.sec)), fixedDeal:true, year:true, cats:eq, cta:postCta('heavy'),
    tiles:`<div class="cat-strip compact">${eq.map(c => catTile(c, d)).join('')}</div>` });
}
function vList(kind){
  const items = kind === 'featured' ? LISTINGS.filter(l => l.featured) : kind === 'urgent' ? LISTINGS.filter(l => l.urgent) : LISTINGS.slice();
  const ttl = kind === 'featured' ? t('featured') : kind === 'urgent' ? t('urgent_ads') : t('x_all');
  if (kind === 'urgent') S.f.urg = false;
  return browse({ title:ttl, crumbs:[[ttl]], items, deals:['sale','rent','supply','wanted','exchange','contractor'],
    tiles:`<div class="chips scroll">${SECTIONS.map(s => `<a class="chip" href="#/s/${s.id}">${ic(s.icon,'sm')} ${L(s)}</a>`).join('')}</div>` });
}
function vSearch(q){
  S.q = q; const s = q.trim().toLowerCase();
  const hit = it => [it.ar, it.en, it.ur, it.brand, it.model, cat(it.cat).ar, cat(it.cat).en, cat(it.cat).ur, L(sec(it.sec)), L(city(it.city))].join(' ').toLowerCase().includes(s);
  const accHit = a => [a.ar, a.en, a.ur, L(ctypeOf(a.ctype)), t('k_'+a.kind)].join(' ').toLowerCase().includes(s);
  const accs = s ? COMPANIES.filter(accHit) : COMPANIES.slice();
  const accHTML = accs.length ? `<div class="wrap sec">${secHead(`${t('accounts_found')} (${accs.length})`)}<div class="co-grid">${accs.map(advCard).join('')}</div></div>` : '';
  if (S.scope === 'accounts') return `<section class="page-head"><div class="wrap">${crumbs([[t('search_for')]])}<h1>${t('search_for')} “${esc(q)}”</h1></div></section>${accHTML || `<div class="wrap empty big">${ic('search')}<p>${t('no_results')}</p></div>`}`;
  const items = LISTINGS.filter(it => !s || hit(it));
  return browse({ title:`${t('search_for')} “${q}”`, crumbs:[[t('search_for')]], items, deals:['sale','rent','supply','wanted','exchange','contractor'], before: S.scope === 'ads' ? '' : accHTML });
}

/* ---------------- Listing detail ---------------- */
function vListing(id){
  const it = byId(LISTINGS, id); if (!it) return vNF();
  const c = cat(it.cat), s = sec(it.sec), a = advOf(it), fav = S.favs.has(id);
  const rows = [[t('category'), catLabel(it)], [t('deal'), t(it.deal)]];
  if (it.brand && it.brand !== '—') rows.push([t('brand'), it.brand]);
  if (it.model) rows.push([t('model'), it.model]);
  if (it.year) rows.push([t('year'), it.year]);
  if (it.hours) rows.push([t('hours'), fmt(it.hours) + ' ' + t('hrs')]);
  if (it.km) rows.push([L(SPEC_LABELS.km), fmt(it.km) + ' km']);
  if (it.cond) rows.push([t('condition'), t(it.cond === 'new' ? 'newc' : 'used')]);
  if (it.qty) rows.push([t('qty'), L(it.qty)]);
  if (it.delivery) rows.push([t('delivery'), t('available')]);
  if (it.op) rows.push([t('operator'), t('with_op')]);
  if (it.swap) rows.push([t('swap_for'), L(it.swap)]);
  if (it.sec === 'contractor' && a.grade) { rows.push([t('grade'), t(a.grade)]); rows.push([t('license_no'), a.lic]); }
  (it.specs || []).forEach(sp => { if (sp[0] !== 'km') rows.push([L(SPEC_LABELS[sp[0]]) || sp[0], sp[1]]); });
  rows.push([t('ad_no'), 'BD-' + (10240 + vOf(id) * 7 + id.length * 13)]);
  const similar = LISTINGS.filter(l => l.id !== id && l.sec === it.sec).sort((x,y) => (y.cat===it.cat) - (x.cat===it.cat)).slice(0, 4);
  const back = it.sec === 'heavy' && it.cat ? [[t('nav_'+(it.deal==='rent'?'rent':'sale')), '#/browse/'+(it.deal==='rent'?'rent':'sale')],[L(c), '#/c/'+c.id+'?deal='+(it.deal==='rent'?'rent':'sale')]]
    : ['materials','sandgravel'].includes(it.sec) && it.cat ? [[L(s), '#/s/'+it.sec],[L(c), '#/c/'+c.id]] : [[L(s), '#/s/'+it.sec]];
  const nAds = LISTINGS.filter(l => l.seller === a.id).length;
  return `<div class="wrap detail-wrap">${crumbs(back.concat([[title(it)]]))}
  <div class="detail">
    <div class="d-main">
      <div class="gal"><div class="gal-main">${ART(artOf(it), vOf(id))}${photo(it.id)}
        <div class="badges">${it.urgent?urgentB():''}${it.featured?`<span class="b b-y">${t('featured_b')}</span>`:''}${it.isNew?`<span class="b b-g">${t('new_b')}</span>`:''}<span class="b b-k">${t(it.deal)}</span></div></div></div>
      ${it.swap ? `<div class="box swap-box">${ic('swap')}<div><small>${t('swap_for')}</small><b>${esc(L(it.swap))}</b></div></div>` : ''}
      <div class="box"><h2>${t('specs')}</h2><dl class="specs">${rows.map(r => `<div><dt>${r[0]}</dt><dd>${esc(r[1])}</dd></div>`).join('')}</dl></div>
      <div class="box"><h2>${t('description')}</h2><p class="desc">${esc(desc(it))}</p></div>
      <div class="box"><h2>${t('location')}</h2><div class="loc-row"><div>${miniMap(it.city)}</div><p>${ic('pin')} <b>${L(city(it.city))}</b> — ${esc(L(it.area))}</p></div></div>
    </div>
    <aside class="d-side">
      <div class="box buy-box"><div class="tags-row"><span class="deal-tag deal-${it.deal}">${t(it.deal)}</span>${it.urgent?urgentB():''}</div><h1>${esc(title(it))}</h1>
        <p class="muted">${ic('pin')} ${L(city(it.city))} · ${esc(L(it.area))} · ${ic('eye')} ${fmt(it.views)}</p>
        <div class="big-price">${priceOf(it)}</div>
        <div class="facts">${it.year?`<span>${ic('cal')} ${it.year}</span>`:''}${it.hours?`<span>${ic('gauge')} ${fmt(it.hours)} ${t('hrs')}</span>`:''}${it.km?`<span>${ic('gauge')} ${fmt(it.km)} km</span>`:''}${it.qty?`<span>${ic('box')} ${esc(L(it.qty))}</span>`:''}${it.op?`<span>${ic('user')} ${t('with_op')}</span>`:''}</div>
        <button class="btn btn-y btn-lg full" data-act="contact" data-seller="${a.id}" data-item="${id}">${ic('chat')} ${t('contact_adv')}</button>
        <div class="two"><button class="btn btn-dark" data-act="reveal" data-seller="${a.id}">${ic('phone')} <span>${t('show_phone')}</span></button><button class="btn btn-wa" data-act="wa">${ic('wa')} ${t('whatsapp')}</button></div>
        <div class="row-acts"><button class="act fav-wide${fav?' on':''}" data-fav="${id}">${ic('heart')} <span>${fav?t('in_fav'):t('add_fav')}</span></button><button class="act" data-act="share">${ic('share')} ${t('share')}</button><button class="act" data-act="report">${ic('flag')} ${t('report')}</button></div>
      </div>
      ${advBox(a, nAds)}
      <div class="box tips"><h3>${ic('shield')} ${t('safety')}</h3><ul><li>${t('safety1')}</li><li>${t('safety2')}</li><li>${t('safety3')}</li></ul></div>
    </aside>
  </div>
  <section class="sec">${secHead(t('similar'), '#/s/'+it.sec)}<div class="grid">${similar.map(x => card(x)).join('')}</div></section></div>`;
}
function advBox(a, n, label){
  return `<div class="box seller"><h3>${label || t('advertiser')}</h3><a class="co-row" href="#/u/${a.id}">${avatar(a)}<div><b>${advName(a)}</b><small>${esc(kindLabel(a))}</small></div></a>
    ${a.kind==='contractor' && a.grade ? `<div class="lic-line">${ic('shield')} ${t('licensed_contractor')} · ${t(a.grade)}</div>` : ''}
    <div class="seller-stats"><div><b>${n}</b><small>${t('listings_n')}</small></div><div><b>${L(city(a.city))}</b><small>${t('city')}</small></div><div><b>${a.since}</b><small>${t('member_since')}</small></div></div>
    <a class="btn btn-line full" href="#/u/${a.id}">${t('view_catalog')}</a>${a.id !== 'me' ? `<p class="demo-tag">${ic('info','sm')} ${t('demo_acc')}</p>` : ''}</div>`;
}
function vProject(id){
  const p = byId(PROJECTS, id); if (!p) return vNF();
  const o = advOf(p);
  return `<div class="wrap detail-wrap">${crumbs([[L(sec('opp')),'#/s/opp'],[L(p)]])}
  <div class="detail"><div class="d-main">
    <div class="proj-hero">${ART(p.type==='pt_marine'?'marine':p.type==='pt_road'?'road':p.type==='pt_supply'?'mixer':'excavator', vOf(id))}${pic('projects', id)}<span class="tag">${t(p.type)}</span></div>
    <div class="box"><h1 class="h1-sm">${esc(L(p))}</h1><p class="desc">${esc(desc(p))}</p></div>
    <div class="box"><h2>${t('req_eq')}</h2><div class="eq-chips">${p.eq.map(e => `<a class="eq-chip" href="#/c/${e}"><span>${ART(cat(e).art,0,true)}</span>${L(cat(e))}</a>`).join('')}</div></div>
    <div class="box"><h2>${t('location')}</h2><div class="loc-row"><div>${miniMap(p.city)}</div><p>${ic('pin')} <b>${L(city(p.city))}</b></p></div></div>
  </div><aside class="d-side"><div class="box buy-box">${p.urgent?`<div class="tags-row">${urgentB()}</div>`:''}<small class="muted">${t('budget')}</small><div class="big-price"><span class="price">${fmt(p.b1)} – ${fmt(p.b2)} <small>${t('cur')}</small></span></div>
    <div class="facts"><span>${ic('clock')} ${p.dur} ${t('days')}</span><span>${ic('cal')} ${p.start}</span><span>${ic('users')} ${p.bids} ${t('bids')}</span></div>
    <button class="btn btn-y btn-lg full" data-act="offer" data-p="${id}">${ic('send')} ${t('submit_offer')}</button>
    <div class="row-acts"><button class="act" data-act="share">${ic('share')} ${t('share')}</button><button class="act" data-act="report">${ic('flag')} ${t('report')}</button><a class="act" href="#/u/${o.id}">${ic('user')} ${t('see_profile')}</a></div></div>
    ${advBox(o, LISTINGS.filter(l => l.seller === o.id).length, t('proj_owner_lbl'))}
  </aside></div>
  <section class="sec">${secHead(L(sec('opp')), '#/s/opp')}<div class="proj-grid">${PROJECTS.filter(x => x.id !== id).slice(0,3).map(projCard).join('')}</div></section></div>`;
}
function vServices(){
  return `<section class="page-head"><div class="wrap">${crumbs([[t('services')]])}<h1>${t('services')}</h1><p>${t('serv_intro')}</p></div></section>
  <div class="wrap sec"><div class="serv-grid">${SERVICES.map(servCard).join('')}</div></div>`;
}

/* ---------------- Company directory (19 types) ---------------- */
const dirCount = id => DIRECTORY.filter(c => c.ctype === id).length;
const typeTile = c => `<a class="type-tile" href="#/companies/${c.id}"><span class="tt-ic">${ic(c.icon)}</span><b>${L(c)}</b><small>${t('co_count').replace('{n}', dirCount(c.id))}</small></a>`;
function vCompanies(type){
  const ty = type ? ctypeOf(type) : null; if (type && !ty.id) return vNF();
  const D = S.dir;
  const list = DIRECTORY.filter(c => (!type || c.ctype === type) && (!D.city || c.city === D.city) && (!D.q || (c.ar + c.en + c.ur).toLowerCase().includes(D.q.toLowerCase())));
  const side = `<aside class="filters dir-side" id="filters"><div class="flt-h"><b>${ic('filter')} ${t('filters')}</b><button class="link" data-act="dir-reset">${t('reset')}</button></div>
    <div class="flt-g"><label>${t('search_co')}</label><input data-dir="q" value="${esc(D.q)}" placeholder="${t('search_co')}"></div>
    <div class="flt-g"><label>${t('city')}</label><select data-dir="city"><option value="">${t('all_uae')}</option>${CITIES.map(c => `<option value="${c.id}"${D.city===c.id?' selected':''}>${L(c)}</option>`).join('')}</select></div>
    <div class="flt-g"><label>${t('co_type')}</label><div class="type-list"><a href="#/companies" class="${!type?'on':''}">${t('all_types')}</a>${COMPANY_TYPES.map(c => `<a href="#/companies/${c.id}" class="${type===c.id?'on':''}">${ic(c.icon,'sm')}<span>${L(c)}</span><em>${dirCount(c.id)}</em></a>`).join('')}</div></div>
    <button class="btn btn-dark full only-m" data-act="toggle-filters">${t('apply')}</button></aside>`;
  const empty = `<div class="empty dir-empty">${ic('building')}<h3>${t('no_cos')}</h3><p>${t('no_cos_p')}</p><a class="btn btn-y" href="#/login?tab=register&kind=company">${ic('plus')} ${t('register_co')}</a></div>`;
  const main = type
    ? `<div class="dir-head"><span class="tt-ic big">${ic(ty.icon)}</span><div><h2>${L(ty)}</h2><p class="muted">${t('co_count').replace('{n}', list.length)}</p></div></div>${list.length ? `<div class="co-grid two">${list.map(advCard).join('')}</div>` : empty}`
    : `<div class="type-tiles in-dir">${COMPANY_TYPES.map(typeTile).join('')}</div>${list.length && (D.q || D.city) ? `<div class="sec">${secHead(t('accounts_found'))}<div class="co-grid two">${list.map(advCard).join('')}</div></div>` : ''}`;
  return `<section class="page-head"><div class="wrap head-flex"><div>${crumbs(type ? [[t('dir_h'),'#/companies'],[L(ty)]] : [[t('dir_h')]])}<h1><span class="h-ic">${ic('building')}</span>${t('dir_h')}</h1><p>${t('dir_intro')}</p></div>
    <a class="btn btn-y" href="#/login?tab=register&kind=company">${ic('plus')} ${t('register_co')}</a></div></section>
  <div class="wrap browse">${side}<div class="results"><div class="res-bar only-m-flex"><button class="btn btn-line only-m" data-act="toggle-filters">${ic('filter')} ${t('show_filters')}</button></div>${main}</div></div>`;
}

/* ---------------- Advertiser / company profile with catalog ---------------- */
function vProfile(id, tab){
  const a = co(id); if (!a.id) return vNF();
  const items = LISTINGS.filter(l => l.seller === id), projs = PROJECTS.filter(p => p.owner === id);
  const n = items.length + projs.length;
  const tabs = [['ads','ads_tab'],['catalog','catalog'],['about','about_tab']];
  let body;
  if (tab === 'catalog') {
    const groups = SECTIONS.map(s => [s, items.filter(i => i.sec === s.id)]).filter(g => g[1].length);
    body = groups.length ? groups.map(([s, arr]) => `<div class="cat-group"><h3>${ic(s.icon)} ${L(s)} <em>${arr.length}</em></h3><div class="cat-rows">${arr.map(i => `<a class="cat-row" href="#/l/${i.id}"><span class="cr-art">${ART(artOf(i), vOf(i.id))}${photo(i.id)}</span><span class="cr-t"><b>${esc(title(i))}</b><small>${esc(catLabel(i))} · ${L(city(i.city))}</small></span><span class="cr-p">${priceOf(i)}</span></a>`).join('')}</div></div>`).join('')
      : `<div class="empty">${ic('box')}<p>${t('no_results')}</p></div>`;
  } else if (tab === 'about') {
    const rows = [[t('member_type'), kindLabel(a)], [t('city'), L(city(a.city))], [t('member_since'), a.since]];
    if (a.grade) { rows.push([t('grade'), t(a.grade)]); rows.push([t('license_no'), a.lic]); if (a.spec) rows.push([t('f_spec'), L(a.spec)]); }
    body = `<div class="box"><p class="desc">${esc(a['a'+S.lang] || a.aen || '')}</p><dl class="specs one">${rows.map(r => `<div><dt>${r[0]}</dt><dd>${esc(r[1])}</dd></div>`).join('')}</dl></div>`;
  } else {
    body = n ? `<div class="grid g3">${items.map(x => card(x)).join('')}</div>${projs.length ? `<div class="proj-grid two-col sp">${projs.map(projCard).join('')}</div>` : ''}` : `<div class="empty">${ic('box')}<p>${t('no_results')}</p></div>`;
  }
  return `<section class="co-cover"><div class="co-cover-art">${ART('company', vOf(id))}${pic('companies', id)}</div><div class="wrap co-head">
    ${avatar(a, 'xl')}<div class="co-h-txt"><h1>${esc(L(a))} ${vbadge(a)}</h1>
    <p>${esc(kindLabel(a))} · ${ic('pin')} ${L(city(a.city))} · ${t('member_since')} ${a.since}</p>
    <div class="co-meta">${a.grade?`<span class="lic-t">${ic('shield','sm')} ${t('licensed_contractor')} · ${t(a.grade)}</span>`:''}<span>${t('ads_count').replace('{n}', n)}</span>${a.id!=='me'?`<span class="demo-t">${t('demo_acc')}</span>`:''}</div></div>
    <div class="co-h-acts"><button class="btn btn-y" data-act="contact" data-seller="${id}">${ic('chat')} ${t('contact_adv')}</button><button class="btn btn-line" data-act="share">${ic('share')} ${t('share')}</button></div></div></section>
  <div class="wrap sec">${crumbs([[t('dir_h'),'#/companies'],[L(a)]])}<div class="ptabs">${tabs.map(x => `<a href="#/u/${id}/${x[0]}" class="${tab===x[0]?'on':''}">${t(x[1])}${x[0]==='ads'?` <em>${n}</em>`:''}</a>`).join('')}</div>${body}</div>`;
}

/* ---------------- Favorites / 404 ---------------- */
function favGrid(){
  const items = LISTINGS.filter(l => S.favs.has(l.id));
  return items.length ? `<div class="grid g3">${items.map(x => card(x)).join('')}</div>` : `<div class="empty">${ic('heart')}<p>${t('no_favs')}</p><a class="btn btn-y" href="#/s/heavy">${t('browse_now')}</a></div>`;
}
function vFavPage(){ return `<section class="page-head slim"><div class="wrap">${crumbs([[t('favorites')]])}<h1>${t('favorites')}</h1></div></section><div class="wrap sec">${favGrid()}</div>`; }
function vNF(){ return `<div class="wrap empty big">${ic('search')}<h1>404</h1><p>${t('not_found')}</p><a class="btn btn-y" href="#/">${t('back_home')}</a></div>`; }
