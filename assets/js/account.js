/* Bulldozer — accounts: phone login (OTP), profile completion → verified badge, my account, modals. Demo only. */

/* ---------------- Profile fields per account kind ---------------- */
const PF = {
  common: [['name','text','full_name'], ['city','city','f_city'], ['email','email','f_email'], ['logo','file','f_logo']],
  individual: [['eid','text','f_eid'], ['eid_doc','file','f_eid_doc']],
  company: [['ctype','ctype','co_type'], ['trade','text','f_trade_lic'], ['lic_exp','date','f_lic_exp'], ['lic_doc','file','f_lic_doc']],
  contractor: [['grade','grade','f_grade'], ['clic','text','f_c_lic'], ['spec','text','f_spec'], ['lic_doc','file','f_lic_doc']]
};
const reqFields = u => PF.common.concat(PF[u.kind] || []);
const filledOf = u => reqFields(u).filter(f => String(u.p[f[0]] || '').trim()).length;
const pct = u => Math.round(filledOf(u) / reqFields(u).length * 100);
const initials = n => (n || '?').trim().split(/\s+/).slice(0, 2).map(w => w.charAt(0)).join('').toUpperCase();

/* The logged-in user appears as advertiser "me" (profile page, directory when a verified company) */
function syncMe(){
  const i = COMPANIES.findIndex(c => c.id === 'me'); if (i > -1) COMPANIES.splice(i, 1);
  const d = DIRECTORY.findIndex(c => c.id === 'me'); if (d > -1) DIRECTORY.splice(d, 1);
  const u = S.user; if (!u) return;
  const me = {id:'me', kind:u.kind, ctype:u.p.ctype || '', verified:u.verified, city:u.p.city || 'dxb', since:2026, color:'#F7B500', ab:initials(u.name),
    ar:u.name, en:u.name, ur:u.name, aar:u.p.about || '', aen:u.p.about || '', aur:u.p.about || '',
    grade:u.kind === 'contractor' ? u.p.grade : undefined, lic:u.p.clic, spec:u.p.spec ? {ar:u.p.spec, en:u.p.spec, ur:u.p.spec} : undefined};
  COMPANIES.push(me);
  if (u.kind === 'company' && u.verified && me.ctype) DIRECTORY.push(me);
}
function setVerified(){
  const u = S.user; const was = u.verified; u.verified = pct(u) === 100;
  if (u.kind === 'company' && u.p.name) u.name = u.p.name; else if (u.p.name) u.name = u.p.name;
  syncMe(); return !was && u.verified;
}
function doLogin(mode){
  const L1 = S.login;
  if (mode === 'register') {
    S.user = {name: L1.name || t('x_name'), phone: L1.phone, kind: L1.kind, verified:false, p:{name: L1.name || ''}};
    syncMe(); toast(t('logged_in')); renderShell();
    S.after = null; goHash('#/account/profile'); setTimeout(() => toast(t('complete_t'), 'info'), 600);
  } else {
    S.user = {name:t('x_name'), phone: L1.phone, kind:'individual', verified:true, p:{name:t('x_name'), city:'dxb', email:'demo@bulldozer.ae', logo:'photo.jpg', eid:'784-1990-1234567-1', eid_doc:'eid.pdf'}};
    syncMe(); toast(t('logged_in')); renderShell();
    const go = S.after || '#/account/profile'; S.after = null; goHash(go);
  }
  S.login = {mode:'login', step:'phone', phone:'', kind:'individual', name:''};
}

/* ---------------- Login / register with phone number ---------------- */
function vLogin(params){
  const L1 = S.login;
  if (params) {
    const tab = params.get('tab'), kind = params.get('kind');
    const m = tab === 'register' ? 'register' : 'login';
    if (L1.mode !== m) { L1.mode = m; L1.step = 'phone'; }
    if (kind && ['individual','company','contractor'].includes(kind)) L1.kind = kind;
  }
  if (S.user) return `<div class="wrap empty big">${ic('check')}<p>${t('logged_in')}</p><a class="btn btn-y" href="#/account/profile">${t('my_account')}</a></div>`;
  const reg = L1.mode === 'register';
  const kinds = ['individual','company','contractor'];
  const phoneStep = `
    ${reg ? `<div class="fld"><span>${t('acc_type_q')}</span><div class="kind-grid">${kinds.map(k => `<button type="button" class="kind-card${L1.kind===k?' on':''}" data-act="kind" data-k="${k}">${ic(k==='individual'?'user':k==='company'?'building':'helmet')}<b>${t('k_'+k)}</b></button>`).join('')}</div></div>
      <label class="fld"><span>${L1.kind==='company'?t('f_co_name'):t('full_name')}</span><input name="name" value="${esc(L1.name)}" placeholder="${L1.kind==='company'?'':t('x_name')}"></label>` : ''}
    <label class="fld"><span>${t('phone_no')}</span><div class="phone-in"><span class="cc">🇦🇪 +971</span><input name="phone" inputmode="tel" class="ltr-in" value="${esc(L1.phone)}" placeholder="5X XXX XXXX" autocomplete="tel"></div><em class="req">${t('phone_err')}</em></label>
    <button class="btn btn-y btn-lg full" type="submit">${ic('send')} ${t('send_code')}</button>`;
  const codeStep = `
    <div class="code-to">${ic('phone')} ${t('enter_code')} <b class="ltr">+971 ${esc(L1.phone)}</b> <button type="button" class="link" data-act="change-no">${t('change_no')}</button></div>
    <label class="fld"><input name="code" class="otp ltr-in" inputmode="numeric" maxlength="4" placeholder="• • • •" autocomplete="one-time-code"><em class="req">${t('code_err')}</em></label>
    <button class="btn btn-y btn-lg full" type="submit">${ic('check')} ${t('verify')}</button>
    <button type="button" class="link small center" data-act="resend">${t('resend')}</button>`;
  return `<div class="wrap auth"><div class="auth-card">
    <div class="auth-side"><div class="as-art">${ART('excavator', 0, true)}</div><h2>${t('who_t')}</h2><ul><li>${ic('check')} ${t('login_side1')}</li><li>${ic('check')} ${t('login_side2')}</li><li>${ic('check')} ${t('free_note')}</li></ul></div>
    <div class="auth-form"><h1>${t('welcome')}</h1><p class="muted">${t('phone_login_t')}</p>
      <div class="tabs"><a href="#/login" data-act="auth-tab" data-m="login" class="${reg?'':'on'}">${t('login_tab')}</a><a href="#/login?tab=register" data-act="auth-tab" data-m="register" class="${reg?'on':''}">${t('reg_tab')}</a></div>
      <form data-form="auth" novalidate>${L1.step === 'code' ? codeStep : phoneStep}
        <p class="demo-note">${ic('info')} ${L1.step === 'code' ? t('code_demo') : t('demo_login')}</p></form></div></div></div>`;
}

/* ---------------- My account ---------------- */
function profileForm(){
  const u = S.user, p = u.p, done = pct(u);
  const field = ([k, type, lbl]) => {
    const v = p[k] || '', miss = !String(v).trim();
    let ctl;
    if (type === 'city') ctl = `<select data-pp="${k}"><option value="">—</option>${CITIES.map(c => `<option value="${c.id}"${v===c.id?' selected':''}>${L(c)}</option>`).join('')}</select>`;
    else if (type === 'ctype') ctl = `<select data-pp="${k}"><option value="">—</option>${COMPANY_TYPES.map(c => `<option value="${c.id}"${v===c.id?' selected':''}>${L(c)}</option>`).join('')}</select>`;
    else if (type === 'grade') ctl = `<select data-pp="${k}"><option value="">—</option>${['g1','g2','g3','g4'].map(g => `<option value="${g}"${v===g?' selected':''}>${t(g)}</option>`).join('')}</select>`;
    else if (type === 'file') ctl = `<label class="up-btn${v?' done':''}"><input type="file" data-up="${k}" hidden>${ic(v?'check':'upload')} <span>${v ? esc(v) : t('upload')}</span></label>`;
    else ctl = `<input type="${type}" data-pp="${k}" value="${esc(v)}"${type==='email'?' class="ltr-in"':''}>`;
    const label = k === 'name' && u.kind === 'company' ? t('f_co_name') : t(lbl);
    return `<label class="fld${type==='file'?' file-fld':''}"><span>${label} <i>*</i>${miss?'':` ${ic('check','sm ok-c')}`}</span>${ctl}</label>`;
  };
  return `<div class="verify-card ${u.verified?'ok':''}">
      <div class="vc-top"><div class="vc-ic">${ic(u.verified?'check':'shield')}</div><div><h2>${u.verified?t('now_verified'):t('complete_t')}</h2><p>${t('complete_p')}</p></div></div>
      <div class="progress"><span style="width:${done}%"></span></div><div class="prog-l"><span>${t('completion')}</span><b>${done}%</b></div></div>
    <div class="box"><div class="ps-h"><h2>${t('my_profile')} — ${t('k_'+u.kind)}</h2><button class="btn btn-sm btn-line" data-act="pp-sample">${ic('edit')} ${t('profile_sample')}</button></div>
      <div class="phone-ok">${ic('check')} ${t('phone_verified')}: <b class="ltr">+971 ${esc(u.phone || '50 123 4567')}</b></div>
      <div class="form-grid two">${reqFields(u).map(field).join('')}
        <label class="fld full"><span>${t('f_about_me')}</span><textarea data-pp="about" rows="3">${esc(p.about || '')}</textarea></label></div>
      <div class="post-foot"><span class="muted small">${ic('info','sm')} ${t('sample')}</span><button class="btn btn-y btn-lg" data-act="pp-save">${ic('check')} ${t('save_profile')}</button></div></div>`;
}
const MY_ADS = [{id:'l9', left:21, st:'act'}, {id:'g2', left:3, st:'pend'}, {id:'c2', left:0, st:'exp'}];
function vAccount(tab){
  if (!S.user) { S.after = '#/account/' + tab; return vLogin(); }
  const u = S.user;
  const msgs = [['a2', {ar:'نعم المعدة متاحة من الأحد القادم، هل تحتاج مشغّل؟', en:'Yes, it is available from next Sunday. Do you need an operator?', ur:'جی ہاں، اگلے اتوار سے دستیاب ہے۔ کیا آپ کو آپریٹر چاہیے؟'}, '10:24'],
                ['a1', {ar:'تم إرسال عرض السعر المحدّث.', en:'The updated quotation has been sent.', ur:'تازہ کوٹیشن بھیج دی گئی ہے۔'}, t('ago_d').replace('{n}',1)],
                ['a4', {ar:'يمكننا البدء في المشروع الأسبوع القادم.', en:'We can start the project next week.', ur:'ہم اگلے ہفتے منصوبہ شروع کر سکتے ہیں۔'}, t('ago_d').replace('{n}',2)]];
  let body;
  if (tab === 'profile') body = profileForm();
  else if (tab === 'favs') body = favGrid();
  else if (tab === 'msgs') body = `<div class="msg-list">${msgs.map((m,i) => { const c = co(m[0]); return `<button class="msg${i===0?' unread':''}" data-act="demo">${avatar(c)}<div><b>${advName(c)}</b><p>${esc(L(m[1]))}</p></div><small>${m[2]}</small></button>`; }).join('')}</div>`;
  else body = `<div class="my-ads">${u.verified ? '' : `<div class="warn-bar">${ic('info')} ${t('unverified_note')} <a href="#/account/profile">${t('complete_now')}</a></div>`}
      ${MY_ADS.map(m => { const it = byId(LISTINGS, m.id); const stl = m.st === 'exp' ? `<span class="status exp">${t('expired')}</span>` : m.st === 'pend' ? `<span class="status pend">${t('pending')}</span>` : `<span class="status act">${t('active')}</span>`;
        return `<div class="my-ad${m.st==='exp'?' is-exp':''}"><a href="#/l/${it.id}" class="my-ad-art">${ART(artOf(it), vOf(it.id))}${photo(it.id)}</a><div class="my-ad-b"><a href="#/l/${it.id}"><b>${esc(title(it))}</b></a><span>${priceOf(it)}</span>
          <small>${ic('eye')} ${fmt(it.views)} · ${m.st==='exp' ? t('renew_free_ends') : t('expires_in').replace('{n}', m.left)}</small></div>${stl}
          ${m.st==='exp' ? `<button class="btn btn-sm btn-y" data-act="boost">${ic('bolt')} ${t('renew_boost')}</button>` : `<button class="btn btn-sm btn-line" data-act="demo">${ic('edit')} ${t('edit')}</button>`}</div>`; }).join('')}
      <div class="row-btns"><a class="btn btn-y" href="#/post">${ic('plus')} ${t('post_ad')}</a><a class="btn btn-line" href="#/post?mode=request">${ic('search')} ${t('post_request')}</a><span class="free-chip">${ic('tag')} ${t('free_note')}</span></div></div>`;
  const tabs = [['profile','my_profile','user'],['ads','my_ads','box'],['favs','favorites','heart'],['msgs','messages','chat']];
  return `<section class="page-head slim"><div class="wrap head-flex"><div><h1>${t('hello')}${S.lang==='en'?', ':'، '}${esc(u.name)} ${vbadge(u)}</h1><p>${t('acc_sub')} · ${t('k_'+u.kind)}</p></div><a class="btn btn-line" href="#/u/me">${ic('eye')} ${t('see_profile')}</a></div></section>
  <div class="wrap account"><aside class="acc-nav">${tabs.map(x => `<a href="#/account/${x[0]}" class="${tab===x[0]?'on':''}">${ic(x[2])} ${t(x[1])}${x[0]==='profile'&&!u.verified?'<i class="dot-warn"></i>':''}</a>`).join('')}<button data-act="logout">${ic('logout')} ${t('logout')}</button></aside>
  <div class="acc-body">${body}</div></div>`;
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
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2800);
}
const phoneOf = sid => { const n = (sid || '1').replace(/\D/g,'') || '1'; return `+971 5${n} 4${n}2 18${n}7`; };
function contactModal(sid, iid, svc){
  const s = co(sid), it = iid ? byId(LISTINGS, iid) : svc ? byId(SERVICES, svc) : null;
  const mini = it ? `<div class="m-item"><div class="m-art">${ART(artOf(it), vOf(it.id))}${it.sec ? photo(it.id) : pic('services', it.id)}</div><div><b>${esc(title(it))}</b>${it.sec ? priceOf(it) : priceHTML(it.price, it.unit)}</div></div>` : '';
  openModal(`<h2>${svc ? t('request_service') : t('contact_adv')}</h2>${mini}
    <a class="co-row" href="#/u/${s.id}" data-act="mclose-link">${avatar(s)}<div><b>${advName(s)}</b><small>${s.verified?t('verified_acc'):t('not_verified')} · ${esc(kindLabel(s))}</small></div></a>
    <div class="phone-row"><span class="ltr" id="mPhone">+971 5• ••• ••••</span><button class="btn btn-sm btn-dark" data-act="reveal-m" data-seller="${sid}">${ic('eye')} ${t('show_phone')}</button></div>
    <div class="two"><button class="btn btn-line" data-act="call">${ic('phone')} ${t('call')}</button><button class="btn btn-wa" data-act="wa">${ic('wa')} ${t('whatsapp')}</button></div>
    <form data-form="msg" class="m-form"><div class="two"><label class="fld"><span>${t('your_name')}</span><input value="${S.user ? esc(S.user.name) : ''}"></label><label class="fld"><span>${t('your_phone')}</span><input class="ltr-in" value="${S.user && S.user.phone ? '+971 ' + esc(S.user.phone) : ''}" placeholder="+971 5x xxx xxxx"></label></div>
    <label class="fld"><span>${t('send_message')}</span><textarea rows="3">${t('msg_ph')}</textarea></label><button class="btn btn-y btn-lg full" type="submit">${ic('send')} ${t('send_message')}</button></form>`);
}
function offerModal(pid){
  const p = byId(PROJECTS, pid);
  openModal(`<h2>${t('submit_offer')}</h2><div class="m-item"><div class="m-art">${ART('road', 0)}</div><div><b>${esc(L(p))}</b><span class="muted">${t('budget')}: ${fmt(p.b1)} – ${fmt(p.b2)} ${t('cur')}</span></div></div>
    <form data-form="offer" class="m-form"><div class="two"><label class="fld"><span>${t('offer_price')}</span><input type="number" value="${Math.round((p.b1+p.b2)/2)}"></label><label class="fld"><span>${t('offer_days')}</span><input type="number" value="${p.dur}"></label></div>
    <label class="fld"><span>${t('offer_note')}</span><textarea rows="3"></textarea></label><button class="btn btn-y btn-lg full" type="submit">${ic('send')} ${t('submit_offer')}</button></form>`);
}
function reportModal(){
  openModal(`<h2>${t('report')}</h2><form data-form="report" class="m-form">${t('x_reasons').map((r,i) => `<label class="check"><input type="radio" name="r"${i?'':' checked'}> ${r}</label>`).join('')}
    <button class="btn btn-dark btn-lg full" type="submit">${t('report')}</button></form>`, 'sm');
}
function boostModal(){
  openModal(`<h2>${ic('bolt')} ${t('boost_t')}</h2><p class="muted">${t('boost_p')}</p>
    <div class="pk-grid">${[['pk1','clock'],['pk2','star'],['pk3','search']].map(x => `<div class="pk">${ic(x[1])}<b>${t(x[0])}</b><small>${t(x[0]+'p')}</small><span class="soon-t">${t('soon')}</span></div>`).join('')}</div>
    <div class="warn-bar">${ic('info')} ${t('boost_soon')}</div>
    <button class="btn btn-dark btn-lg full" data-act="notify">${ic('bell')} ${t('notify_me')}</button>`);
}
