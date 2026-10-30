/* Bulldozer — event handling + boot. */
function toggleFav(id){
  const on = !S.favs.has(id); on ? S.favs.add(id) : S.favs.delete(id);
  $$(`[data-fav="${id}"]`).forEach(b => { b.classList.toggle('on', on); const sp = b.querySelector('span'); if (sp) sp.textContent = on ? t('in_fav') : t('add_fav'); });
  toast(on ? t('fav_added') : t('fav_removed'), 'heart');
  if (/^(fav|account\/favs)/.test(S.lastPath || '') && !on) { S.keepScroll = true; route(); }
}
function goHash(h){ if (location.hash === h) { S.keepScroll = false; S.lastPath = null; route(); } else location.hash = h; }
function rerender(){ S.keepScroll = true; const y = window.scrollY; route(); window.scrollTo(0, y); }
function setMapPin(x, y, cid){
  const Pp = S.post; if (!Pp) return;
  if (!cid) { let best = null, bd = 1e9; CITIES.forEach(c => { const d = (c.x-x)**2 + (c.y-y)**2; if (d < bd) { bd = d; best = c; } }); cid = best.id; }
  Pp.city = cid; Pp.pin = {x:Math.round(x), y:Math.round(y)}; Pp.err = Pp.err.filter(e => e !== 'city'); rerenderPost();
}
const PP_SAMPLE = {
  common: {city:'dxb', email:'info@demo-company.ae', logo:'logo.png', about:''},
  individual: {eid:'784-1990-1234567-1', eid_doc:'emirates-id.pdf'},
  company: {ctype:'heavy_dig', trade:'CN-1234567', lic_exp:'2027-06-30', lic_doc:'trade-license.pdf'},
  contractor: {grade:'g1', clic:'CL-2026-0912', spec:'', lic_doc:'contracting-license.pdf'}
};

document.addEventListener('click', e => {
  const T = e.target;
  if (!T.closest('.pop-wrap')) $$('.pop').forEach(p => p.hidden = true);
  const favB = T.closest('[data-fav]');
  if (favB) { e.preventDefault(); e.stopPropagation(); toggleFav(favB.dataset.fav); return; }
  const pc = T.closest('[data-pchip]');
  if (pc) { const k = pc.dataset.pchip, v = pc.dataset.v, d = S.post.d;
    if (pc.dataset.multi) { const a = d[k] || []; d[k] = a.includes(v) ? a.filter(x => x !== v) : a.concat(v); } else d[k] = v;
    S.post.err = S.post.err.filter(x => x !== k); rerenderPost(); return; }
  const fd = T.closest('button[data-flt="deal"]');
  if (fd) { S.f.deal = fd.dataset.v; $$('button[data-flt="deal"]').forEach(b => b.classList.toggle('on', b === fd)); applyFilters(); return; }
  const map = T.closest('#uaeMap');
  if (map) { const mc = T.closest('[data-city]'); if (mc) { const c = city(mc.dataset.city); setMapPin(c.x, c.y, c.id); }
    else { const r = map.getBoundingClientRect(); setMapPin((e.clientX - r.left) / r.width * 400, (e.clientY - r.top) / r.height * 260); } return; }
  const a = T.closest('[data-act]'); if (!a) return;
  const act = a.dataset.act;
  if (act === 'city' || act === 'files') return;
  const Pp = S.post, L1 = S.login;
  switch (act) {
    case 'back': e.preventDefault(); if ((S.depth || 0) > 1 && history.length > 1) history.back(); else goHash('#/'); break;
    case 'home-deal': S.homeDeal = a.dataset.d; { const el = $('#catSec'); if (el) el.innerHTML = catSection(); } break;
    case 'hide-strip': S.hideStrip = true; $('#demoStrip').hidden = true; break;
    case 'drawer': { const d = $('#drawer'); d.hidden = !d.hidden; document.body.classList.toggle('noscroll', !d.hidden); break; }
    case 'drawer-link': $('#drawer').hidden = true; document.body.classList.remove('noscroll'); break;
    case 'langmenu': { const p = $('#langPop'); p.hidden = !p.hidden; $$('.pop').forEach(x => { if (x !== p) x.hidden = true; }); break; }
    case 'setlang': if (a.dataset.l === S.lang) { $$('.pop').forEach(x => x.hidden = true); break; } S.lang = a.dataset.l;
      try { localStorage.setItem('utbot_lang', S.lang); } catch(_) {} document.body.classList.remove('noscroll'); S.keepScroll = true; renderShell(); route(); break;
    case 'notif': { const p = $('#notifPop'); p.hidden = !p.hidden; const u = $('#userPop'); if (u) u.hidden = true; break; }
    case 'notif-read': S.notifRead = true; $$('.notif').forEach(n => n.classList.remove('unread')); { const d = $('.bell .dot'); if (d) d.remove(); } break;
    case 'umenu': { const p = $('#userPop'); p.hidden = !p.hidden; $('#notifPop').hidden = true; break; }
    case 'logout': S.user = null; S.post = null; syncMe(); toast(t('logged_out'), 'logout'); renderShell(); goHash('#/'); break;
    case 'slide': slide(+a.dataset.d); clearInterval(heroTimer); heroTimer = setInterval(() => slide(1), 7000); break;
    case 'slide-to': slide(0, +a.dataset.i); break;
    case 'contact': contactModal(a.dataset.seller, a.dataset.item, a.dataset.svc); break;
    case 'reveal': { const sp = a.querySelector('span'); if (sp) { sp.textContent = phoneOf(a.dataset.seller); sp.classList.add('ltr'); } toast(t('phone_revealed'), 'phone'); break; }
    case 'reveal-m': $('#mPhone').textContent = phoneOf(a.dataset.seller); a.remove(); break;
    case 'call': toast(t('calling'), 'phone'); break;
    case 'wa': toast(t('whatsapp') + ' — ' + t('demo_only'), 'wa'); break;
    case 'share': try { navigator.clipboard && navigator.clipboard.writeText(location.href); } catch(_) {} toast(t('link_copied'), 'share'); break;
    case 'report': reportModal(); break;
    case 'offer': offerModal(a.dataset.p); break;
    case 'boost': e.preventDefault(); boostModal(); break;
    case 'notify': closeModal(); toast(t('notify_ok'), 'bell'); break;
    case 'mclose': closeModal(); break;
    case 'mclose-link': closeModal(); break;
    case 'demo': e.preventDefault(); toast(t('demo_only'), 'info'); break;
    case 'toggle-filters': $('#filters').classList.toggle('open'); break;
    case 'flt-reset': S.f = {deal: (S.lastPath||'').startsWith('browse') ? S.f.deal : '', city:'', ymin:'', pmax:'', sort:'new', urg:false, ver:false, kind:''}; { const lp = S.lastPath; S.keepScroll = true; route(); S.lastPath = lp; } break;
    case 'dir-reset': S.dir = {q:'', city:'', ver:false}; rerender(); break;
    /* login */
    case 'auth-tab': L1.mode = a.dataset.m; L1.step = 'phone'; break;
    case 'kind': { const n = $('input[name="name"]'), ph = $('input[name="phone"]'); if (n) L1.name = n.value; if (ph) L1.phone = ph.value; L1.kind = a.dataset.k; rerender(); break; }
    case 'change-no': L1.step = 'phone'; rerender(); break;
    case 'resend': toast(t('code_sent'), 'send'); break;
    /* profile */
    case 'pp-sample': { const u = S.user; Object.assign(u.p, PP_SAMPLE.common, PP_SAMPLE[u.kind] || {});
      if (!u.p.name) u.p.name = u.name; if (u.kind === 'contractor') u.p.spec = S.lang === 'en' ? 'Excavation & roads' : S.lang === 'ur' ? 'کھدائی اور سڑکیں' : 'حفريات وطرق';
      u.p.about = S.lang === 'en' ? 'Demo profile description.' : S.lang === 'ur' ? 'نمونہ تعارف۔' : 'وصف تجريبي للحساب.'; rerender(); break; }
    case 'pp-save': { const became = setVerified(); renderShell(); rerender();
      toast(S.user.verified ? (became ? t('now_verified') : t('profile_saved')) : t('still_missing'), S.user.verified ? 'check' : 'info'); break; }
    /* post wizard */
    case 'pmode': Pp.mode = a.dataset.m; Pp.type = null; Pp.lockMsg = false; rerenderPost(); break;
    case 'ptype': if (a.dataset.k === 'contractor' && !canContract()) { Pp.lockMsg = true; Pp.type = null; } else { Pp.type = a.dataset.k; Pp.lockMsg = false; } Pp.err = []; rerenderPost(); break;
    case 'pnext': if (!Pp.type) return; if (!postValidate()) { toast(t('req_msg'), 'info'); rerenderPost(); return; } Pp.step = Math.min(5, Pp.step + 1); Pp.err = []; rerenderPost(); break;
    case 'pback': Pp.step = Math.max(1, Pp.step - 1); Pp.err = []; rerenderPost(); break;
    case 'psample': { const s = SAMPLES[Pp.type]; Object.assign(Pp.d, JSON.parse(JSON.stringify(s.d)), s[S.lang] || s.en); Pp.err = [];
      if (!Pp.city) { Pp.city = 'auh'; Pp.area = t('x_area'); Pp.pin = {x:city('auh').x + 8, y:city('auh').y - 4}; } rerenderPost(); break; }
    case 'psamples': { const d = Pp.d; const art = (Pp.type === 'materials' || Pp.type === 'sandgravel') ? (cat(d.mtype).art || 'sand') : (cat(d.cat || d.need).art || sec(Pp.type).art || 'excavator');
      for (let i = 0; i < 4 && Pp.imgs.length < 10; i++) Pp.imgs.push({art, v:i}); rerenderPost(); break; }
    case 'pcover': { const i = +a.dataset.i; Pp.imgs.unshift(Pp.imgs.splice(i, 1)[0]); rerenderPost(); break; }
    case 'prm': { const [im] = Pp.imgs.splice(+a.dataset.i, 1); if (im && im.url) URL.revokeObjectURL(im.url); rerenderPost(); break; }
    case 'publish': if (!postValidate()) { toast(t('declare'), 'info'); rerenderPost(); return; }
      Pp.done = true; Pp.ref = 'BD-R' + Math.floor(100000 + Math.random() * 900000); rerenderPost(); window.scrollTo(0, 0); break;
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
  if (el.dataset.pp && S.user) S.user.p[el.dataset.pp] = el.value;
  if (el.dataset.flt && el.tagName !== 'BUTTON') { S.f[el.dataset.flt] = el.type === 'checkbox' ? el.checked : el.value; applyFilters(); }
  if (el.dataset.dir) { const k = el.dataset.dir; S.dir[k] = el.type === 'checkbox' ? el.checked : el.value; rerender();
    if (k === 'q') { const q = $('[data-dir="q"]'); if (q) { q.focus(); try { q.setSelectionRange(q.value.length, q.value.length); } catch(_) {} } } }
});
document.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset.act === 'city') { S.city = el.value; S.f.city = el.value; $$('select[data-act="city"]').forEach(s => s.value = el.value);
    const fs = $('select[data-flt="city"]'); if (fs) { fs.value = el.value; applyFilters(); }
    toast((el.value ? L(city(el.value)) : t('all_uae')), 'pin'); }
  if (el.dataset.act === 'files') addFiles(el.files);
  if (el.dataset.up && S.user) { const f = el.files && el.files[0]; S.user.p[el.dataset.up] = f ? f.name : 'file.pdf'; rerender(); }
});
document.addEventListener('submit', e => {
  const f = e.target, k = f.dataset.form; if (!k) return; e.preventDefault();
  if (k === 'search') { const q = f.elements.namedItem('q').value.trim(); S.scope = f.elements.namedItem('scope').value; goHash('#/search/' + encodeURIComponent(q)); }
  if (k === 'auth') {
    const L1 = S.login;
    if (L1.step === 'phone') {
      const ph = f.elements.namedItem('phone'), nm = f.elements.namedItem('name');
      const digits = (ph.value || '').replace(/\D/g, '');
      if (nm) L1.name = nm.value.trim();
      if (digits.length < 8) { ph.closest('.fld').classList.add('err'); return; }
      L1.phone = ph.value.trim(); L1.step = 'code'; rerender(); toast(t('code_sent'), 'send');
      const c = $('input[name="code"]'); if (c) c.focus();
    } else {
      const c = f.elements.namedItem('code');
      if (!/^\d{4}$/.test((c.value || '').trim())) { c.closest('.fld').classList.add('err'); return; }
      doLogin(L1.mode);
    }
  }
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
