/* Bulldozer — post / request wizard (demo only — nothing is saved or published). */
const PT = {
  offer:   [['heavy','excavator'],['exchange','crane'],['generators','generator'],['cabins','cabin'],['materials','gravel'],['contractor','service'],['other','service']],
  request: [['wanted','loader'],['opp','road']]
};
const PT_ALL = PT.offer.concat(PT.request);
const ptMode = ty => PT.request.some(p => p[0] === ty) ? 'request' : 'offer';
const REQ = { heavy:['title','cat','deal','price'], exchange:['title','cat','want'], generators:['title','deal','power','price'], cabins:['title','deal','price'],
  materials:['mtype','title','qty','price'], contractor:['title','spec','desc'], other:['title','price'], wanted:['title','need','budget'], opp:['title','ptype','b1','desc'] };
const canContract = () => S.user && S.user.kind === 'contractor' && S.user.verified;
const newPost = (type, mode) => {
  const ok = PT_ALL.some(p => p[0] === type) && !(type === 'contractor' && !canContract());
  return { step: ok ? 2 : 1, type: ok ? type : null, mode: ok ? ptMode(type) : (mode === 'request' ? 'request' : 'offer'),
    d:{cond:'used', deal:'', period:'day', unit:'ton', eq:[], op:false, delivery:true, urgent:false, nb:'buy'}, imgs:[], city:'', area:'', pin:null,
    phone: S.user && S.user.phone ? S.user.phone : '', wa:true, agree:false, done:false, err:[] };
};
function vPost(params){
  if (!S.user) {
    S.after = '#/post' + (params && params.toString() ? '?' + params.toString() : '');
    return `<section class="page-head slim"><div class="wrap">${crumbs([[t('post_ad')]])}<h1>${t('post_title')}</h1></div></section>
      <div class="wrap post"><div class="post-card gate">${ic('shield')}<h2>${t('login_first_t')}</h2><p>${t('login_first_p')}</p>
        <div class="row-btns center"><a class="btn btn-y btn-lg" href="#/login">${ic('phone')} ${t('login')}</a><a class="btn btn-line btn-lg" href="#/login?tab=register">${t('reg_tab')}</a></div>
        <span class="free-chip">${ic('tag')} ${t('free_note')}</span></div></div>`;
  }
  const ty = params.get('type'), mode = params.get('mode');
  if (!S.post || (S.post.done && !S.keepScroll) || (ty && ty !== S.post.type && !S.keepScroll) || (mode && !ty && mode !== S.post.mode && !S.keepScroll)) S.post = newPost(ty, mode);
  const Pp = S.post;
  return `<section class="page-head slim"><div class="wrap head-flex"><div>${crumbs([[t('post_ad')]])}<h1>${Pp.mode==='request'?t('buy_btn'):t('post_title')}</h1><p>${t('post_sub')}</p></div><span class="free-chip">${ic('tag')} ${t('free_note')}</span></div></section>
  <div class="wrap post">${Pp.done ? postDone() : `
    ${S.user.verified ? '' : `<div class="warn-bar">${ic('info')} ${t('unverified_note')} <a href="#/account/profile">${t('complete_now')}</a></div>`}
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
  else ctl = `<input type="${type}" data-pf="${k}" value="${esc(pv(k))}" placeholder="${o.ph||''}"${type==='number'?' min="0" inputmode="numeric"':''}${o.ro?' readonly':''}>`;
  return `<label class="fld${o.full?' full':''}${errc(k)}"><span>${t(lbl)}${req?' <i>*</i>':''}</span>${ctl}${req?`<em class="req">${t('required')}</em>`:''}</label>`;
}
const chipsF = (k, lbl, opts, multi, full) => `<div class="fld${full?' full':''}${errc(k)}"><span>${t(lbl)}${(REQ[S.post.type]||[]).includes(k)?' <i>*</i>':''}</span><div class="chips">${opts.map(o => { const on = multi ? (S.post.d[k]||[]).includes(o[0]) : pv(k) === o[0];
  return `<button type="button" class="chip${on?' on':''}" data-pchip="${k}" data-v="${o[0]}" data-multi="${multi?1:''}">${multi&&on?ic('check','sm'):''}${esc(o[1])}</button>`; }).join('')}</div><em class="req">${t('required')}</em></div>`;
const toggleF = (k, lbl, sub) => `<label class="toggle"><input type="checkbox" data-pf="${k}"${S.post.d[k]?' checked':''}><span class="tg"></span><span>${t(lbl)}${sub?`<small>${t(sub)}</small>`:''}</span></label>`;
const eqOpts = () => CATS.filter(c => c.g === 'equipment').map(c => [c.id, L(c)]);
const years = () => Array.from({length:22}, (_,i) => [2026-i, 2026-i]);
const saleRent = () => chipsF('deal','f_deal',[['sale',t('sale')],['rent',t('rent')]]);
function postFields(){
  const ty = S.post.type, d = S.post.d;
  const titleF = fld('title','f_title','text',{full:true});
  const descF = fld('desc','f_desc','textarea',{full:true, ph:t('f_desc_ph')});
  const urgentF = `<div class="fld full urgent-fld">${toggleF('urgent','f_urgent','f_urgent_p')}</div>`;
  let h;
  if (ty === 'heavy') h = `${titleF}${fld('cat','f_sub','select',{opts:eqOpts()})}${saleRent()}${fld('brand','f_brand','text',{ph:'CAT, Komatsu, Volvo…'})}
    ${fld('model','f_model')}${fld('year','f_year','select',{opts:years()})}${fld('hours','f_hours','number')}${chipsF('cond','f_cond',[['used',t('used')],['new',t('newc')]])}
    ${d.deal==='rent' ? chipsF('period','f_period',[['day',t('p_day')],['week',t('p_week')],['month',t('p_month')]]) + `<div class="fld">${toggleF('op','f_operator')}</div>` : ''}${fld('price','f_price','number')}${descF}`;
  else if (ty === 'exchange') h = `${titleF}${fld('cat','f_have','select',{opts:eqOpts()})}${fld('brand','f_brand')}${fld('year','f_year','select',{opts:years()})}${fld('want','f_want','text',{full:true})}${descF}`;
  else if (ty === 'generators') h = `${titleF}${saleRent()}${fld('brand','f_brand','text',{ph:'CAT, Perkins, Cummins…'})}${fld('power','f_power','number')}${fld('year','f_year','select',{opts:years()})}${fld('hours','f_hours','number')}${fld('price','f_price','number')}${descF}`;
  else if (ty === 'cabins') h = `${titleF}${saleRent()}${fld('size','f_size','text',{ph:'6 × 3 m'})}${fld('rooms','f_rooms','number')}${fld('price','f_price','number')}${descF}`;
  else if (ty === 'materials') h = `${fld('mtype','f_mat_type','select',{opts:CATS.filter(c => c.g==='materials').map(c => [c.id, L(c)])})}${fld('title','f_mat_name')}
    ${fld('qty','f_qty','number')}${fld('unit','f_unit','select',{opts:[['ton',t('x_ton')],['m3','م³ / m³'],['bag',t('x_bag')],['piece',t('x_piece')]]})}${fld('price','f_unit_price','number')}<div class="fld">${toggleF('delivery','f_delivery')}</div>${descF}`;
  else if (ty === 'contractor') { const u = S.user.p;
    h = `<div class="lic-box full">${ic('shield')}<div><b>${t('licensed_contractor')}</b><small>${t('grade')}: ${t(u.grade||'g1')} · ${t('license_no')}: <span class="ltr">${esc(u.clic||'')}</span></small></div></div>
    ${titleF}${fld('spec','f_spec')}${chipsF('cov','f_cov_em', CITIES.map(c => [c.id, L(c)]), true, true)}${descF}`; }
  else if (ty === 'other') h = `${titleF}${fld('price','f_price','number')}${descF}`;
  else if (ty === 'wanted') h = `${titleF}${chipsF('nb','f_buy_or_rent',[['buy',t('buy')],['rent',t('rent')]])}${fld('need','f_need','select',{opts:CATS.map(c => [c.id, L(c)])})}
    ${fld('budget','f_budget','number')}${fld('needby','f_need_by','date')}${descF}`;
  else h = `${titleF}${fld('ptype','f_proj_type','select',{opts:['pt_exc','pt_road','pt_build','pt_marine','pt_supply'].map(x => [x, t(x)])})}
    ${fld('start','f_start','date')}${fld('b1','f_budget_from','number')}${fld('b2','f_budget_to','number')}${fld('days','f_days','number')}
    ${chipsF('eq','f_req_eq', eqOpts(), true, true)}${fld('desc','f_desc','textarea',{full:true})}`;
  return h + urgentF;
}
const SAMPLES = {
  heavy:{d:{cat:'excavators', deal:'sale', brand:'Komatsu', model:'PC210-10', year:2020, hours:5200, cond:'used', price:245000},
    ar:{title:'حفارة كوماتسو PC210 بحالة ممتازة', desc:'موديل 2020، صيانة دورية، جنزير جديد، جاهزة للمعاينة.'}, en:{title:'Komatsu PC210 excavator — excellent condition', desc:'2020 model, regularly serviced, new undercarriage, ready for inspection.'}, ur:{title:'کوماتسو PC210 کھدائی مشین — بہترین حالت', desc:'2020 ماڈل، باقاعدہ سروس، نئی زنجیر، معائنے کے لیے تیار۔'}},
  exchange:{d:{cat:'loaders', brand:'CAT', year:2019},
    ar:{title:'تبادل شيول CAT 950 مقابل حفارة', want:'حفارة 20 طن بنفس القيمة', desc:'شيول بحالة ممتازة، أرغب بتبادله مع حفارة.'}, en:{title:'Swap: CAT 950 loader for an excavator', want:'A 20 t excavator of similar value', desc:'Loader in excellent condition; looking to swap for an excavator.'}, ur:{title:'تبادلہ: CAT 950 لوڈر بدلے کھدائی مشین', want:'اسی قیمت کی 20 ٹن کھدائی مشین', desc:'بہترین حالت میں لوڈر؛ کھدائی مشین سے تبادلہ چاہتے ہیں۔'}},
  generators:{d:{deal:'rent', brand:'Cummins', power:300, year:2022, hours:1500, price:550, period:'day'},
    ar:{title:'مولد كامينز 300 KVA للإيجار', desc:'مع التوصيل والتركيب في الموقع.'}, en:{title:'Cummins 300 kVA generator for rent', desc:'With on-site delivery and installation.'}, ur:{title:'کمنز 300 kVA جنریٹر کرائے پر', desc:'سائٹ پر ترسیل اور تنصیب کے ساتھ۔'}},
  cabins:{d:{deal:'sale', size:'6 × 3 m', rooms:2, price:26000},
    ar:{title:'كرفان مكتب موقع جديد', desc:'معزول بالكامل مع مكيف وإنارة.'}, en:{title:'New site office cabin', desc:'Fully insulated with AC and lighting.'}, ur:{title:'نیا سائٹ آفس کیبن', desc:'مکمل موصل، اے سی اور روشنی کے ساتھ۔'}},
  materials:{d:{mtype:'sand', qty:3000, unit:'ton', price:42, delivery:true},
    ar:{title:'رمل مغسول 0–5 مم', desc:'مطابق للمواصفات مع توريد سريع.'}, en:{title:'Washed sand 0–5 mm', desc:'Spec-compliant with fast delivery.'}, ur:{title:'دھلی ہوئی ریت 0–5 ملی میٹر', desc:'معیار کے مطابق، تیز ترسیل۔'}},
  contractor:{d:{cov:['auh','dxb']},
    ar:{title:'مقاول حفريات وردم متاح لمشاريع جديدة', spec:'حفريات وردم', desc:'أسطول معدات خاص وفريق فني ذو خبرة.'}, en:{title:'Excavation contractor available for new projects', spec:'Excavation & backfilling', desc:'Own equipment fleet and experienced crew.'}, ur:{title:'کھدائی ٹھیکیدار نئے منصوبوں کے لیے دستیاب', spec:'کھدائی اور بھرائی', desc:'اپنے آلات اور تجربہ کار ٹیم۔'}},
  other:{d:{price:2500},
    ar:{title:'قطع غيار شيولات مستعملة', desc:'إطارات وجرادل بحالة جيدة.'}, en:{title:'Used loader spare parts', desc:'Tyres and buckets in good condition.'}, ur:{title:'لوڈر کے استعمال شدہ پرزے', desc:'اچھی حالت میں ٹائر اور بالٹیاں۔'}},
  wanted:{d:{nb:'rent', need:'cranes', budget:20000, needby:'2026-11-30', urgent:true},
    ar:{title:'مطلوب كرين 50 طن للإيجار لمدة شهر', desc:'لمشروع في أبوظبي مع مشغّل معتمد.'}, en:{title:'Wanted: 50 t crane for one-month rental', desc:'For a project in Abu Dhabi, with certified operator.'}, ur:{title:'ایک ماہ کرائے کے لیے 50 ٹن کرین درکار', desc:'ابوظہبی کے منصوبے کے لیے، سند یافتہ آپریٹر کے ساتھ۔'}},
  opp:{d:{ptype:'pt_exc', b1:220000, b2:300000, days:30, start:'2026-11-20', eq:['excavators','trucks']},
    ar:{title:'حفر قبو بعمق طابقين لمبنى تجاري', desc:'مطلوب حفر وسند جوانب ونقل المخلفات لمبنى تجاري بمساحة 2,500 م².'}, en:{title:'Two-level basement excavation for a commercial building', desc:'Excavation, shoring and debris removal for a 2,500 m² commercial building.'}, ur:{title:'تجارتی عمارت کے لیے دو منزلہ تہہ خانے کی کھدائی', desc:'2,500 م² تجارتی عمارت کے لیے کھدائی، سپورٹ اور ملبے کی منتقلی۔'}}
};
function previewItem(){
  const Pp = S.post, d = Pp.d, ty = Pp.type;
  const it = {id:'preview', sec:ty, seller:'me', days:0, city:Pp.city, urgent:!!d.urgent, isNew:true, year:d.year ? +d.year : undefined, brand:d.brand, model:d.model};
  it[S.lang] = d.title || '—';
  if (ty === 'heavy') Object.assign(it, {cat:d.cat, deal:d.deal || 'sale', price:+d.price || 0, unit:d.deal === 'rent' ? d.period : 'total'});
  else if (ty === 'exchange') Object.assign(it, {cat:d.cat, deal:'exchange', price:null, art:cat(d.cat).art});
  else if (ty === 'generators') Object.assign(it, {deal:d.deal || 'sale', price:+d.price || 0, unit:d.deal === 'rent' ? d.period : 'total', art:'generator'});
  else if (ty === 'cabins') Object.assign(it, {deal:d.deal || 'sale', price:+d.price || 0, unit:d.deal === 'rent' ? 'month' : 'total', art:'cabin'});
  else if (ty === 'materials') Object.assign(it, {sec:'materials', cat:d.mtype, deal:'supply', price:+d.price || 0, unit:d.unit, qty:d.qty ? fmt(+d.qty) : ''});
  else if (ty === 'contractor') Object.assign(it, {deal:'contractor', price:null, art:'service'});
  else if (ty === 'other') Object.assign(it, {deal:'sale', price:+d.price || 0, unit:'total', art:'service'});
  else if (ty === 'wanted') Object.assign(it, {cat:d.need, deal:'wanted', price:+d.budget || 0, unit:'total', art:cat(d.need).art || 'loader'});
  return it;
}
function postStep(){
  const Pp = S.post, st = Pp.step;
  const foot = (next, nextLbl) => `<div class="post-foot">${st>1?`<button class="btn btn-line" data-act="pback">${ic('chevl','flip')} ${t('back')}</button>`:'<span></span>'}
    <button class="btn btn-y btn-lg" data-act="${next}"${st===1&&!Pp.type?' disabled':''}>${nextLbl||t('next')} ${st<5?ic('chev','flip'):ic('send')}</button></div>`;
  if (st === 1) return `<h2>${t('s1')}</h2>
    <div class="mode-grid">${['offer','request'].map(m => `<button class="mode-card${Pp.mode===m?' on':''}" data-act="pmode" data-m="${m}">${ic(m==='offer'?'tag':'search')}<div><b>${t('mode_'+m)}</b><small>${t('mode_'+m+'_d')}</small></div></button>`).join('')}</div>
    <div class="type-grid">${PT[Pp.mode].map(p => { const locked = p[0] === 'contractor' && !canContract();
      return `<button class="type-card${Pp.type===p[0]?' on':''}${locked?' locked':''}" data-act="ptype" data-k="${p[0]}"><div class="tc-art">${ART(p[1],0,true)}</div><b>${L(sec(p[0]))}</b><small>${locked?`${ic('lock','sm')} ${t('contractor_lock')}`:t('pd_'+p[0])}</small><i class="tc-check">${ic('check')}</i></button>`; }).join('')}</div>
    ${Pp.lockMsg ? `<div class="warn-bar">${ic('lock')} <span><b>${t('contractor_lock')}</b> — ${t('contractor_lock_p')}</span> <a href="#/account/profile">${t('complete_now')}</a></div>` : ''}${foot('pnext')}`;
  if (st === 2) return `<div class="ps-h"><h2>${t('s2')} — <span class="y-txt">${L(sec(Pp.type))}</span></h2><button class="btn btn-sm btn-line" data-act="psample">${ic('edit')} ${t('fill_sample')}</button></div><div class="form-grid">${postFields()}</div>${foot('pnext')}`;
  if (st === 3) return `<h2>${t('s3')}</h2>
    <label class="drop" id="drop"><input type="file" accept="image/*" multiple data-act="files" hidden>${ic('upload')}<b>${t('up_t')}</b><small>${t('up_p')}</small></label>
    <div class="ph-tools"><button class="btn btn-sm btn-line" data-act="psamples">${ic('image')} ${t('up_samples')}</button><span class="tip">${ic('info')} ${t('photos_tip')}</span></div>
    <div class="pthumbs">${Pp.imgs.map((im,i) => `<div class="pthumb">${im.url?`<img src="${im.url}" alt="">`:ART(im.art, im.v)}${i===0?`<span class="cover">${t('cover')}</span>`:`<button class="mk" data-act="pcover" data-i="${i}">${t('set_cover')}</button>`}<button class="rm" data-act="prm" data-i="${i}" aria-label="remove">${ic('close')}</button></div>`).join('')}</div>${foot('pnext')}`;
  if (st === 4) return `<h2>${t('s4')}</h2><div class="loc-grid"><div class="form-grid one">
      <label class="fld${errc('city')}"><span>${t('f_city')} <i>*</i></span><select data-pl="city"><option value="">—</option>${CITIES.map(c => `<option value="${c.id}"${Pp.city===c.id?' selected':''}>${L(c)}</option>`).join('')}</select><em class="req">${t('required')}</em></label>
      <label class="fld"><span>${t('f_area')}</span><input data-pl="area" value="${esc(Pp.area)}" placeholder="${t('f_area_ph')}"></label>
      <label class="fld"><span>${t('f_phone')} ${ic('check','sm ok-c')}</span><div class="phone-in"><span class="cc">+971</span><input data-pl="phone" class="ltr-in" value="${esc(Pp.phone)}" readonly></div></label>
      <label class="toggle"><input type="checkbox" data-pl="wa"${Pp.wa?' checked':''}><span class="tg"></span>${t('f_wa')}</label></div>
    <div class="map-box"><svg viewBox="0 0 400 260" class="uae-map" id="uaeMap"><rect width="400" height="260" fill="#d7e8f2"/>${UAE_PATH}
      <text x="95" y="100" class="sea">${t('gulf')}</text><text x="372" y="190" class="sea" transform="rotate(-72 372 190)">${t('oman_g')}</text>
      ${CITIES.map(c => `<g class="mcity${Pp.city===c.id?' on':''}" data-city="${c.id}"><circle cx="${c.x}" cy="${c.y}" r="6"/><text x="${c.x}" y="${c.y-10}" text-anchor="middle">${L(c)}</text></g>`).join('')}
      ${Pp.pin?`<g transform="translate(${Pp.pin.x} ${Pp.pin.y})" class="drop-pin">${PIN}</g>`:''}</svg>
      <p class="tip">${ic(Pp.pin?'check':'pin')} ${Pp.pin?t('pin_set'):t('map_hint')}</p></div></div>${foot('pnext')}`;
  /* step 5: preview + anti-fake declaration */
  const d = Pp.d, cov = Pp.imgs[0];
  const media = cov ? (cov.url ? `<img src="${cov.url}" alt="" class="ph ok">` : ART(cov.art, cov.v)) : null;
  let prev;
  if (Pp.type === 'opp') {
    const p = {id:'preview', type:d.ptype || 'pt_exc', b1:+d.b1 || 0, b2:+d.b2 || +d.b1 || 0, dur:d.days || '—', bids:0, days:0, city:Pp.city, owner:'me', urgent:!!d.urgent, dar:d.desc, den:d.desc, d_ur:d.desc};
    p[S.lang] = d.title || '—'; prev = projCard(p).replace('<a class="proj', '<div class="proj static').replace(/<\/a>$/, '</div>').replace(/ href="[^"]*"/, '');
  } else { const it = previewItem(); prev = card(it, {static:true, media: media || (ART(artOf(it), 0))}); }
  const sum = [[t('s1'), L(sec(Pp.type))], [t('location'), (L(city(Pp.city)) || '—') + (Pp.area ? ' · ' + Pp.area : '')], [t('s3'), Pp.imgs.length], [t('f_urgent'), d.urgent ? '✓' : '—']];
  return `<h2>${t('s5')}</h2><p class="muted">${t('preview_note')}</p><div class="prev-grid"><div class="prev-card">${prev}</div>
    <div><div class="box"><h3>${t('summary')}</h3><dl class="specs one">${sum.map(r => `<div><dt>${r[0]}</dt><dd>${esc(r[1])}</dd></div>`).join('')}</dl>${d.desc?`<p class="desc">${esc(d.desc)}</p>`:''}</div>
      <div class="review-note">${ic('eye')} ${t('review_note')}</div>
      <label class="check${Pp.err.includes('agree')?' err':''}"><input type="checkbox" data-pl="agree"${Pp.agree?' checked':''}> ${t('declare')}</label></div></div>${foot('publish', t('publish'))}`;
}
function postDone(){
  return `<div class="post-card done"><div class="done-ic">${ic('eye')}</div><h2>${t('sent_review_t')}</h2><p>${t('sent_review_p')}</p><p class="ref">${t('ad_ref')}: <b>${S.post.ref}</b></p>
    <div class="done-acts"><button class="btn btn-y" data-act="pnew">${ic('plus')} ${t('post_another')}</button><a class="btn btn-line" href="#/account/ads">${t('my_ads')}</a><a class="btn btn-dark" href="#/">${t('back_home')}</a></div></div>`;
}
function postValidate(){
  const Pp = S.post; Pp.err = [];
  if (Pp.step === 2) (REQ[Pp.type]||[]).forEach(k => { const v = pv(k); if (Array.isArray(v) ? !v.length : !String(v).trim()) Pp.err.push(k); });
  if (Pp.step === 4 && !Pp.city) Pp.err.push('city');
  if (Pp.step === 5 && !Pp.agree) Pp.err.push('agree');
  return !Pp.err.length;
}
function addFiles(files){
  Array.from(files || []).filter(f => /^image\//.test(f.type)).slice(0, Math.max(0, 10 - S.post.imgs.length)).forEach(f => S.post.imgs.push({url:URL.createObjectURL(f)}));
  rerenderPost();
}
