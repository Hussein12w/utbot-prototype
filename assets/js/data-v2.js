/* Bulldozer — v2 data: ad sections, company directory types, demo advertisers, new sample ads.
   Loaded after data.js and data-ur.js. All content is sample/demo data. */

/* ---------- Ad sections (classifications) ---------- */
const SECTIONS = [
  {id:'heavy',      icon:'crane',    art:'excavator', ar:'معدات ثقيلة',        en:'Heavy equipment',          ur:'بھاری آلات'},
  {id:'wanted',     icon:'search',   art:'loader',    ar:'مطلوب للشراء',       en:'Wanted to buy',            ur:'خریداری مطلوب'},
  {id:'marine_leisure', icon:'boat', art:'boat',    ar:'معدات البحر الترفيهية', en:'Leisure marine equipment', ur:'تفریحی بحری سامان'},
  {id:'marine_port', icon:'anchor',  art:'marine',    ar:'معدات البحر والموانئ', en:'Marine & port equipment', ur:'بحری اور بندرگاہی آلات'},
  {id:'opp',        icon:'road',     art:'road',      ar:'فرص مشاريع للمقاولين', en:'Project opportunities for contractors', ur:'ٹھیکیداروں کے لیے منصوبوں کے مواقع'},
  {id:'exchange',   icon:'swap',     art:'crane',     ar:'تبادل معدات',        en:'Equipment exchange',       ur:'آلات کا تبادلہ'},
  {id:'generators', icon:'bolt',     art:'generator', ar:'مولدات',             en:'Generators',               ur:'جنریٹرز'},
  {id:'cabins',     icon:'cabin',    art:'cabin',     ar:'كرفانات وبيوت متنقلة', en:'Caravans & portable cabins', ur:'کارواں اور پورٹیبل کیبن'},
  {id:'contractor', icon:'helmet',   art:'service',   ar:'مقاول متاح',         en:'Available contractors',    ur:'دستیاب ٹھیکیدار'},
  {id:'materials',  icon:'box',      art:'cement',    ar:'مواد بناء',          en:'Building materials',       ur:'تعمیراتی سامان'},
  {id:'sandgravel', icon:'layers',   art:'gravel',    ar:'مواد رمل وحصى',      en:'Sand & gravel',            ur:'ریت اور بجری'},
  {id:'other',      icon:'grid',     art:'service',   ar:'أخرى',               en:'Other',                    ur:'دیگر'}
];
/* Quick-access bar above the hero */
const QUICK = ['heavy','wanted','opp','exchange','other'];

/* ---------- Company directory types (19) ---------- */
const COMPANY_TYPES = [
  {id:'heavy_dig',     icon:'crane',  ar:'شركات معدات الحفر الضخمة', en:'Heavy excavation equipment companies', ur:'بھاری کھدائی آلات کی کمپنیاں'},
  {id:'soil_test',     icon:'flask',  ar:'شركات فحص التربة', en:'Soil testing companies', ur:'مٹی کی جانچ کی کمپنیاں'},
  {id:'marine_drill',  icon:'anchor', ar:'شركات بحرية والحفر وأجهزة الحفر', en:'Marine, drilling & drilling-rig companies', ur:'بحری، کھدائی اور ڈرلنگ رگ کمپنیاں'},
  {id:'special_eq',    icon:'wrench', ar:'شركات معدات خاصة للشركات', en:'Specialised equipment for companies', ur:'کمپنیوں کے لیے خصوصی آلات'},
  {id:'marine_cranes', icon:'crane',  ar:'كرينات بحرية والحفر وأجهزة الحفر وتصنيف الموانئ', en:'Marine cranes, drilling rigs & port classification', ur:'بحری کرینیں، ڈرلنگ رگز اور بندرگاہوں کی درجہ بندی'},
  {id:'marine_build',  icon:'anchor', ar:'البنايات البحرية – قوارب العوامات البحرية', en:'Marine structures – boats & floating pontoons', ur:'بحری تعمیرات – کشتیاں اور تیرتے پلیٹ فارم'},
  {id:'marine_cement', icon:'box',    ar:'إسمنت الخدمات البحرية', en:'Marine cement services', ur:'بحری سیمنٹ خدمات'},
  {id:'power_cranes',  icon:'bolt',   ar:'كرينات الطاقة', en:'Power-sector cranes', ur:'توانائی کے شعبے کی کرینیں'},
  {id:'offshore_drill',icon:'drill',  ar:'شركات معدات الحفر البحري', en:'Offshore drilling equipment companies', ur:'سمندری کھدائی کے آلات کی کمپنیاں'},
  {id:'dredging',      icon:'anchor', ar:'شركات معدات تجريف الموانئ', en:'Port dredging equipment companies', ur:'بندرگاہوں کی ڈریجنگ کے آلات کی کمپنیاں'},
  {id:'hdd',           icon:'road',   ar:'الحفر الأفقي – الحفر تحت الشوارع ومد الكابلات بدون تكسير', en:'Horizontal drilling – trenchless cabling under roads', ur:'افقی ڈرلنگ – سڑکوں کے نیچے بغیر توڑ پھوڑ کیبل بچھانا'},
  {id:'dewatering',    icon:'drop',   ar:'شركات معدات سحب المياه والخزانات', en:'Dewatering & tank equipment companies', ur:'پانی نکالنے اور ٹینکوں کے آلات کی کمپنیاں'},
  {id:'soil_remed',    icon:'flask',  ar:'شركات معدات تنقية التربة ومعالجة التصفية', en:'Soil remediation & filtration equipment', ur:'مٹی کی صفائی اور فلٹریشن کے آلات'},
  {id:'tiller_maint',  icon:'wrench', ar:'شركات معدات صيانة الحراثات', en:'Tiller maintenance equipment companies', ur:'ہل چلانے والی مشینوں کی مرمت کے آلات'},
  {id:'tunneling',     icon:'tunnel', ar:'شركات معدات إنشاء الأنفاق تحت الأرض', en:'Underground tunnelling equipment companies', ur:'زیرِ زمین سرنگ سازی کے آلات کی کمپنیاں'},
  {id:'pipeline_maint',icon:'pipe',   ar:'شركات معدات صيانة خطوط الأنابيب', en:'Pipeline maintenance equipment companies', ur:'پائپ لائن کی مرمت کے آلات کی کمپنیاں'},
  {id:'city_water',    icon:'drop',   ar:'شركات معدات متخصصة بأنابيب المياه في المدن', en:'Urban water-pipe equipment specialists', ur:'شہری پانی کی پائپ لائنوں کے خصوصی آلات'},
  {id:'cctv_pipe',     icon:'camera', ar:'فحص الأنابيب بالكاميرات', en:'CCTV pipe inspection', ur:'کیمروں کے ذریعے پائپوں کا معائنہ'},
  {id:'pumps',         icon:'drop',   ar:'فحص وتركيب مضخات المياه', en:'Water pump inspection & installation', ur:'پانی کے پمپوں کا معائنہ اور تنصیب'}
];

/* ---------- Demo advertiser accounts (the old sample companies were removed) ---------- */
const ADVERTISERS = [
  {id:'a1', kind:'company',    ctype:'heavy_dig',  verified:true,  city:'dxb', since:2025, color:'#F7B500', ab:'DE',
   ar:'شركة تجريبية للمعدات', en:'Demo Equipment Co.', ur:'ڈیمو ایکوپمنٹ کمپنی',
   aar:'حساب تجريبي لشركة تبيع وتؤجّر المعدات الثقيلة.', aen:'Demo account of a company selling and renting heavy equipment.', aur:'بھاری آلات فروخت اور کرایہ پر دینے والی کمپنی کا ڈیمو اکاؤنٹ۔'},
  {id:'a2', kind:'company',    ctype:'special_eq', verified:false, city:'auh', since:2026, color:'#1E1F22', ab:'DR',
   ar:'مؤسسة تجريبية للتأجير', en:'Demo Rentals Est.', ur:'ڈیمو رینٹلز',
   aar:'حساب تجريبي لم يُكمل بياناته بعد — لذلك لا تظهر علامة التوثيق.', aen:'Demo account that has not completed its details yet — so no verified badge.', aur:'ڈیمو اکاؤنٹ جس نے ابھی تفصیلات مکمل نہیں کیں — اس لیے تصدیقی نشان نہیں۔'},
  {id:'a3', kind:'individual', verified:true,  city:'shj', since:2025, color:'#6b7280', ab:'DI',
   ar:'معلن فرد تجريبي', en:'Demo Individual Seller', ur:'ڈیمو انفرادی فروخت کنندہ',
   aar:'حساب تجريبي لمعلن فرد موثّق.', aen:'Demo account of a verified individual advertiser.', aur:'تصدیق شدہ انفرادی اشتہار دہندہ کا ڈیمو اکاؤنٹ۔'},
  {id:'a4', kind:'contractor', verified:true,  grade:'g1', lic:'CL-2025-0418', spec:{ar:'حفريات وطرق',en:'Excavation & roads',ur:'کھدائی اور سڑکیں'}, city:'auh', since:2024, color:'#4b5563', ab:'DC',
   ar:'مقاول تجريبي مصنّف', en:'Demo Classified Contractor', ur:'ڈیمو درجہ بند ٹھیکیدار',
   aar:'حساب تجريبي لمقاول مصنّف ومرخّص — يحق له نشر إعلانات «مقاول متاح».', aen:'Demo account of a classified, licensed contractor — allowed to post “Available contractor” ads.', aur:'درجہ بند اور لائسنس یافتہ ٹھیکیدار کا ڈیمو اکاؤنٹ۔'},
  {id:'a5', kind:'company',    ctype:'marine_build', verified:false, city:'ajm', since:2026, color:'#9a3412', ab:'DS',
   ar:'مورد تجريبي', en:'Demo Supplier', ur:'ڈیمو سپلائر',
   aar:'حساب تجريبي لمورد مواد لم يُكمل بياناته بعد.', aen:'Demo supplier account that has not completed its details yet.', aur:'ڈیمو سپلائر اکاؤنٹ جس نے تفصیلات مکمل نہیں کیں۔'}
];
/* Companies registered in the directory: empty for now (filled only by companies registered in the demo session) */
const DIRECTORY = [];

/* ---------- Re-map existing sample data to the new structure ---------- */
(function(){
  const map = {co1:'a1', co2:'a2', co3:'a5', co4:'a5', co5:'a1', co6:'a5', co7:'a1', co8:'a4'};
  LISTINGS.forEach(l => { l.seller = map[l.seller] || 'a1';
    const g = (CATS.find(c => c.id === l.cat) || {}).g;
    l.sec = g === 'materials' ? (['sand','gravel'].includes(l.cat) ? 'sandgravel' : 'materials') : l.cat === 'marine' ? 'marine_port' : 'heavy'; });
  ['l8','m5','l9'].forEach(id => { const l = LISTINGS.find(x => x.id === id); if (l) l.urgent = true; });
  SERVICES.forEach(s => s.seller = map[s.seller] || 'a1');
  PROJECTS.forEach(p => { p.owner = map[p.owner] || 'a4'; p.sec = 'opp'; p.price = p.b1; });
  PROJECTS.find(p => p.id === 'p3').urgent = true;
  COMPANIES.length = 0; ADVERTISERS.forEach(a => COMPANIES.push(a));
})();

/* ---------- New sample ads in the new sections ---------- */
LISTINGS.push(
  {id:'w1', sec:'wanted', deal:'wanted', art:'excavator', cat:'excavators', price:250000, unit:'total', city:'dxb', area:{ar:'دبي',en:'Dubai',ur:'دبئی'}, seller:'a3', urgent:true, featured:true, days:0, views:96,
   ar:'مطلوب حفارة 20–30 طن للشراء', en:'Wanted: 20–30 t excavator to buy', ur:'20–30 ٹن کھدائی مشین خریدنی ہے',
   dar:'أبحث عن حفارة مستعملة بوزن 20 إلى 30 طن، موديل 2018 أو أحدث، بحالة جيدة وسجل صيانة واضح. الدفع فوري عند المعاينة.', den:'Looking for a used 20–30 t excavator, 2018 or newer, in good condition with clear service history. Immediate payment on inspection.', d_ur:'2018 یا اس کے بعد کی، اچھی حالت والی 20 سے 30 ٹن کی استعمال شدہ کھدائی مشین درکار ہے۔ معائنے پر فوری ادائیگی۔'},
  {id:'w2', sec:'wanted', deal:'wanted', art:'loader', cat:'loaders', price:30000, unit:'month', city:'auh', area:{ar:'المصفح',en:'Mussafah',ur:'مصفح'}, seller:'a4', days:1, views:74,
   ar:'مطلوب شيول للإيجار لمدة 6 أشهر', en:'Wanted: wheel loader for 6-month rental', ur:'6 ماہ کرائے کے لیے وہیل لوڈر درکار',
   dar:'مطلوب شيول مع مشغّل لمشروع في المصفح لمدة 6 أشهر، يبدأ الشهر القادم.', den:'Wheel loader with operator needed for a 6-month project in Mussafah, starting next month.', d_ur:'مصفح میں 6 ماہ کے منصوبے کے لیے آپریٹر کے ساتھ وہیل لوڈر درکار، اگلے ماہ سے۔'},
  {id:'w3', sec:'wanted', deal:'wanted', art:'sand', cat:'sand', price:60000, unit:'total', city:'shj', area:{ar:'الصجعة',en:'Al Saja’a',ur:'الصجعہ'}, seller:'a1', days:2, views:51,
   ar:'مطلوب 2,000 م³ رمل ردم', en:'Wanted: 2,000 m³ of backfill sand', ur:'2,000 م³ بھرائی کی ریت درکار',
   dar:'مطلوب توريد رمل ردم نظيف إلى موقع في الصجعة على دفعات خلال أسبوعين.', den:'Clean backfill sand needed, delivered in batches to a site in Al Saja’a within two weeks.', d_ur:'الصجعہ کی سائٹ پر دو ہفتوں میں قسطوں میں صاف بھرائی کی ریت درکار ہے۔'},
  {id:'x1', sec:'exchange', deal:'exchange', art:'excavator', cat:'excavators', brand:'Komatsu', model:'PC200-8', year:2018, hours:9100, cond:'used', price:null, city:'ain', area:{ar:'العين الصناعية',en:'Al Ain Industrial',ur:'العین صنعتی علاقہ'}, seller:'a2', featured:true, days:1, views:133,
   swap:{ar:'شيول (وهيل لودر) بنفس القيمة', en:'A wheel loader of similar value', ur:'اسی قیمت کا وہیل لوڈر'},
   ar:'تبادل حفارة كوماتسو PC200 مقابل شيول', en:'Swap: Komatsu PC200 excavator for a wheel loader', ur:'تبادلہ: کوماتسو PC200 کھدائی مشین بدلے وہیل لوڈر',
   dar:'حفارة كوماتسو PC200-8 موديل 2018 بحالة ممتازة، أرغب بتبادلها مع شيول بنفس القيمة تقريباً.', den:'2018 Komatsu PC200-8 in excellent condition; looking to swap for a wheel loader of similar value.', d_ur:'2018 کوماتسو PC200-8 بہترین حالت میں؛ اسی قیمت کے وہیل لوڈر سے تبادلہ چاہتے ہیں۔'},
  {id:'x2', sec:'exchange', deal:'exchange', art:'crane', cat:'cranes', brand:'XCMG', model:'QY50K', year:2017, hours:7800, cond:'used', price:null, city:'rak', area:{ar:'الحمرا',en:'Al Hamra',ur:'الحمرا'}, seller:'a1', days:4, views:88,
   swap:{ar:'كرين 25 طن + الفرق', en:'A 25 t crane + cash difference', ur:'25 ٹن کرین + فرق'},
   ar:'تبادل كرين 50 طن بكرين 25 طن مع الفرق', en:'Swap: 50 t crane for a 25 t crane + difference', ur:'تبادلہ: 50 ٹن کرین بدلے 25 ٹن کرین + فرق',
   dar:'كرين متحرك 50 طن بحالة جيدة، أرغب بتبادله مع كرين 25 طن ودفع الفرق.', den:'50 t mobile crane in good condition; want to swap for a 25 t crane plus the difference.', d_ur:'اچھی حالت میں 50 ٹن موبائل کرین؛ 25 ٹن کرین اور فرق کے بدلے تبادلہ چاہتے ہیں۔'},
  {id:'g1', sec:'generators', deal:'sale', art:'generator', brand:'CAT', model:'C15 500 kVA', year:2021, hours:3200, cond:'used', price:145000, unit:'total', city:'dxb', area:{ar:'جبل علي',en:'Jebel Ali',ur:'جبل علی'}, seller:'a1', urgent:true, featured:true, days:0, views:142,
   specs:[['capacity','500 kVA'],['engine','CAT C15']],
   ar:'مولد كهرباء كاتربيلر 500 KVA للبيع', en:'CAT 500 kVA generator for sale', ur:'CAT 500 kVA جنریٹر برائے فروخت',
   dar:'مولد ديزل 500 KVA مع كاتم صوت وخزان وقود يكفي 12 ساعة، صيانة دورية.', den:'500 kVA diesel generator with soundproof canopy and a 12-hour fuel tank, regularly serviced.', d_ur:'ساؤنڈ پروف کینوپی اور 12 گھنٹے کے فیول ٹینک کے ساتھ 500 kVA ڈیزل جنریٹر، باقاعدہ سروس۔'},
  {id:'g2', sec:'generators', deal:'rent', art:'generator', brand:'Perkins', model:'250 kVA', year:2022, hours:1800, cond:'used', price:450, unit:'day', city:'auh', area:{ar:'المصفح',en:'Mussafah',ur:'مصفح'}, seller:'a2', days:2, views:77,
   specs:[['capacity','250 kVA']],
   ar:'مولد 250 KVA للإيجار اليومي', en:'250 kVA generator for daily rent', ur:'250 kVA جنریٹر روزانہ کرائے پر',
   dar:'مولد 250 KVA للإيجار اليومي أو الشهري مع التوصيل والتركيب في الموقع.', den:'250 kVA generator for daily or monthly rent, with on-site delivery and installation.', d_ur:'سائٹ پر ترسیل اور تنصیب کے ساتھ روزانہ یا ماہانہ کرائے پر 250 kVA جنریٹر۔'},
  {id:'g3', sec:'generators', deal:'sale', art:'generator', brand:'Perkins', model:'100 kVA', year:2019, hours:6400, cond:'used', price:42000, unit:'total', city:'shj', area:{ar:'الصناعية 4',en:'Industrial 4',ur:'صنعتی علاقہ 4'}, seller:'a3', days:5, views:64,
   specs:[['capacity','100 kVA']],
   ar:'مولد ديزل 100 KVA بيركنز', en:'Perkins 100 kVA diesel generator', ur:'پرکنز 100 kVA ڈیزل جنریٹر',
   dar:'مولد 100 KVA بحالة تشغيلية ممتازة، مناسب للمواقع الصغيرة والفلل.', den:'100 kVA generator in excellent working order, suitable for small sites and villas.', d_ur:'بہترین حالت میں 100 kVA جنریٹر، چھوٹی سائٹس اور ولاز کے لیے موزوں۔'},
  {id:'c1', sec:'cabins', deal:'sale', art:'cabin', price:28000, unit:'total', city:'ajm', area:{ar:'الجرف',en:'Al Jurf',ur:'الجرف'}, seller:'a5', featured:true, days:1, views:110,
   specs:[['size','6 × 3 m']],
   ar:'كرفان مكتب موقع 6×3 م للبيع', en:'Site office cabin 6×3 m for sale', ur:'6×3 میٹر سائٹ آفس کیبن برائے فروخت',
   dar:'كرفان مكتب معزول مع مكيف وإنارة ومقبس كهرباء، جاهز للنقل إلى الموقع.', den:'Insulated office cabin with AC, lighting and power sockets, ready to move to site.', d_ur:'اے سی، روشنی اور بجلی کے ساکٹ کے ساتھ موصل آفس کیبن، سائٹ پر منتقلی کے لیے تیار۔'},
  {id:'c2', sec:'cabins', deal:'rent', art:'cabin', price:9500, unit:'month', city:'ain', area:{ar:'العين',en:'Al Ain',ur:'العین'}, seller:'a2', days:3, views:69,
   specs:[['rooms','12']],
   ar:'سكن عمال متنقل 12 غرفة للإيجار', en:'Portable labour accommodation (12 rooms) for rent', ur:'12 کمروں کی پورٹیبل لیبر رہائش کرائے پر',
   dar:'وحدات سكن عمال متنقلة مع حمامات ومطبخ، للإيجار الشهري للمشاريع.', den:'Portable labour housing units with bathrooms and kitchen, monthly rental for projects.', d_ur:'باتھ روم اور کچن کے ساتھ پورٹیبل لیبر رہائش، منصوبوں کے لیے ماہانہ کرایہ۔'},
  {id:'c3', sec:'cabins', deal:'sale', art:'cabin', price:12500, unit:'total', city:'dxb', area:{ar:'القوز',en:'Al Quoz',ur:'القوز'}, seller:'a5', urgent:true, days:0, views:58,
   ar:'كرفان حمامات متنقل', en:'Portable toilet cabin', ur:'پورٹیبل ٹوائلٹ کیبن',
   dar:'كرفان حمامات بأربع وحدات مع خزان مياه، مستعمل بحالة ممتازة.', den:'Four-unit toilet cabin with water tank, used, in excellent condition.', d_ur:'پانی کے ٹینک کے ساتھ چار یونٹ ٹوائلٹ کیبن، استعمال شدہ، بہترین حالت۔'},
  {id:'k1', sec:'contractor', deal:'contractor', art:'service', price:null, city:'auh', area:{ar:'كل الإمارات',en:'All UAE',ur:'پورا امارات'}, seller:'a4', featured:true, days:1, views:121,
   ar:'مقاول حفريات وردم مصنّف — الدرجة الأولى', en:'Classified excavation & backfilling contractor — Grade 1', ur:'درجہ بند کھدائی اور بھرائی ٹھیکیدار — پہلا درجہ',
   dar:'مقاول مصنّف ومرخّص لأعمال الحفر والردم والتسوية، أسطول معدات خاص وفريق فني. متاح لمشاريع جديدة فوراً.', den:'Classified, licensed contractor for excavation, backfilling and levelling, with own equipment fleet and crew. Available for new projects now.', d_ur:'کھدائی، بھرائی اور ہمواری کے لیے درجہ بند اور لائسنس یافتہ ٹھیکیدار، اپنے آلات اور ٹیم کے ساتھ۔ نئے منصوبوں کے لیے فوراً دستیاب۔'},
  {id:'k2', sec:'contractor', deal:'contractor', art:'road', price:null, city:'dxb', area:{ar:'دبي والشارقة',en:'Dubai & Sharjah',ur:'دبئی اور شارجہ'}, seller:'a4', urgent:true, days:2, views:84,
   ar:'مقاول طرق وأسفلت متاح فوراً', en:'Roads & asphalt contractor available now', ur:'سڑکوں اور اسفالٹ کا ٹھیکیدار فوراً دستیاب',
   dar:'تنفيذ طبقات الأساس والأسفلت والأرصفة للطرق الداخلية والمجمعات.', den:'Base layers, asphalt and kerbs for internal roads and compounds.', d_ur:'اندرونی سڑکوں اور کمپاؤنڈز کے لیے بنیادی تہیں، اسفالٹ اور کرب۔'},
  {id:'o1', sec:'other', deal:'sale', art:'service', price:3500, unit:'total', city:'shj', area:{ar:'الصجعة',en:'Al Saja’a',ur:'الصجعہ'}, seller:'a3', days:3, views:47,
   ar:'قطع غيار حفارات مستعملة', en:'Used excavator spare parts', ur:'کھدائی مشین کے استعمال شدہ پرزے',
   dar:'جرادل وأسنان ومضخات هيدروليكية مستعملة لحفارات 20 طن، بحالة جيدة.', den:'Used buckets, teeth and hydraulic pumps for 20 t excavators, in good condition.', d_ur:'20 ٹن کھدائی مشینوں کے استعمال شدہ بالٹیاں، دانت اور ہائیڈرولک پمپ۔'},
  {id:'o2', sec:'other', deal:'sale', art:'service', price:1200, unit:'total', city:'dxb', area:{ar:'ديرة',en:'Deira',ur:'دیرہ'}, seller:'a5', days:6, views:39,
   ar:'معدات سلامة للمواقع بالجملة', en:'Site safety equipment (wholesale)', ur:'سائٹ کے حفاظتی سامان (ہول سیل)',
   dar:'خوذ وسترات عاكسة وأحذية سلامة وحواجز مرورية بأسعار الجملة.', den:'Helmets, reflective vests, safety boots and traffic barriers at wholesale prices.', d_ur:'ہیلمٹ، ریفلیکٹو جیکٹس، حفاظتی جوتے اور ٹریفک بیریئر ہول سیل قیمت پر۔'}
);
/* ---------- v3: leisure marine + marine & port sample ads ---------- */
LISTINGS.push(
  {id:'y1', sec:'marine_leisure', deal:'sale', art:'jetski', brand:'Yamaha', model:'VX Cruiser', year:2022, hours:120, cond:'used', price:38000, unit:'total', city:'dxb', area:{ar:'دبي مارينا',en:'Dubai Marina',ur:'دبئی مرینا'}, seller:'a3', featured:true, days:1, views:211,
   ar:'دراجة مائية (جت سكي) ياماها 2022', en:'Yamaha jet ski 2022', ur:'یاماہا جیٹ اسکی 2022',
   dar:'جت سكي بحالة ممتازة، 120 ساعة تشغيل فقط، مع مقطورة وغطاء. صيانة لدى الوكيل.', den:'Jet ski in excellent condition, only 120 hours, with trailer and cover. Dealer serviced.', d_ur:'بہترین حالت میں جیٹ اسکی، صرف 120 گھنٹے، ٹریلر اور کور کے ساتھ۔'},
  {id:'y2', sec:'marine_leisure', deal:'rent', art:'boat', brand:'—', model:'Speedboat 26 ft', year:2021, cond:'used', price:1500, unit:'day', city:'dxb', area:{ar:'جميرا',en:'Jumeirah',ur:'جمیرا'}, seller:'a1', urgent:true, days:0, views:164, op:true,
   ar:'قارب سريع 26 قدم للإيجار اليومي مع قبطان', en:'26 ft speedboat for daily rent with captain', ur:'26 فٹ اسپیڈ بوٹ کپتان کے ساتھ روزانہ کرائے پر',
   dar:'قارب سريع يتسع لـ 8 أشخاص مع قبطان مرخّص ووقود، للرحلات والصيد.', den:'Speedboat for 8 people with licensed captain and fuel, for trips and fishing.', d_ur:'8 افراد کے لیے اسپیڈ بوٹ، لائسنس یافتہ کپتان اور ایندھن کے ساتھ۔'},
  {id:'y3', sec:'marine_leisure', deal:'sale', art:'boat', brand:'—', model:'Fishing boat 32 ft', year:2019, cond:'used', price:120000, unit:'total', city:'ajm', area:{ar:'ميناء عجمان',en:'Ajman Port',ur:'عجمان بندرگاہ'}, seller:'a5', days:3, views:97,
   ar:'قارب صيد 32 قدم بمحركين للبيع', en:'32 ft twin-engine fishing boat for sale', ur:'32 فٹ دو انجن والی مچھلی پکڑنے کی کشتی برائے فروخت',
   dar:'قارب صيد بمحركين خارجيين 250 حصان، مجهّز بجهاز GPS وسونار.', den:'Fishing boat with two 250 hp outboards, equipped with GPS and sonar.', d_ur:'دو 250 ہارس پاور انجن، GPS اور سونار کے ساتھ۔'},
  {id:'y4', sec:'marine_leisure', deal:'rent', art:'jetski', brand:'—', model:'Kayak & SUP', cond:'used', price:150, unit:'day', city:'rak', area:{ar:'الحمرا',en:'Al Hamra',ur:'الحمرا'}, seller:'a2', days:2, views:58,
   ar:'قوارب كاياك وألواح تجديف للإيجار', en:'Kayaks & paddle boards for rent', ur:'کایاک اور پیڈل بورڈ کرائے پر',
   dar:'كاياك فردي وزوجي وألواح تجديف مع سترات نجاة، للإيجار بالساعة أو اليوم.', den:'Single and double kayaks and paddle boards with life jackets, hourly or daily.', d_ur:'لائف جیکٹ کے ساتھ کایاک اور پیڈل بورڈ، گھنٹہ وار یا روزانہ۔'},
  {id:'q1', sec:'marine_port', deal:'rent', art:'crane', cat:'marine', brand:'Liebherr', model:'LHM 280', year:2017, hours:14000, cond:'used', price:9000, unit:'day', city:'auh', area:{ar:'ميناء خليفة',en:'Khalifa Port',ur:'خلیفہ بندرگاہ'}, seller:'a1', featured:true, days:1, views:143, op:true,
   ar:'رافعة موانئ متحركة 84 طن للإيجار', en:'84 t mobile harbour crane for rent', ur:'84 ٹن موبائل ہاربر کرین کرائے پر',
   dar:'رافعة موانئ متحركة لمناولة الحاويات والبضائع السائبة مع مشغّل معتمد.', den:'Mobile harbour crane for containers and bulk cargo, with certified operator.', d_ur:'کنٹینرز اور بلک کارگو کے لیے موبائل ہاربر کرین، سند یافتہ آپریٹر کے ساتھ۔'},
  {id:'q2', sec:'marine_port', deal:'sale', art:'marine', cat:'marine', brand:'—', model:'Cutter suction dredger', year:2014, cond:'used', price:2400000, unit:'total', city:'fuj', area:{ar:'ميناء الفجيرة',en:'Fujairah Port',ur:'فجیرہ بندرگاہ'}, seller:'a1', days:6, views:71,
   ar:'حفارة تجريف بحرية (Dredger) للبيع', en:'Cutter suction dredger for sale', ur:'کٹر سکشن ڈریجر برائے فروخت',
   dar:'حفارة تجريف بقطر أنبوب 450 مم، مناسبة لتعميق الموانئ والقنوات.', den:'Dredger with 450 mm discharge pipe, suited to deepening ports and channels.', d_ur:'450 ملی میٹر پائپ والا ڈریجر، بندرگاہوں اور نہروں کو گہرا کرنے کے لیے۔'}
);
LISTINGS.forEach(l => { if (l.qty && !l.qty.ur) l.qty.ur = l.qty.en; if (l.area && !l.area.ur) l.area.ur = l.area.ar; });

/* ---------- Spec labels added for the new ads ---------- */
Object.assign(SPEC_LABELS, {
  rooms:{ar:'عدد الغرف',en:'Rooms',ur:'کمرے'}
});
SPEC_LABELS.size.ur = SPEC_LABELS.size.ur || 'سائز';

/* ---------- Interface texts (AR / EN / UR) ---------- */
const V2 = {
  ar:{
    hero1_p2:'منصة مجانية للأفراد والشركات والمقاولين لنشر إعلانات المعدات والمواد والمشاريع في الإمارات',
    brand_sub:'إعلانات مجانية للأفراد والشركات',
    quick_label:'وصول سريع', quick_heavy:'صفقات معدات ثقيلة', sec_h:'تصفّح حسب نوع الإعلان',
    urgent:'مستعجل', urgent_ads:'إعلانات مستعجلة', urgent_only:'المستعجل فقط', verified_only:'معلنون موثّقون فقط',
    adv_type:'نوع المعلن', k_individual:'فرد', k_company:'شركة', k_contractor:'مقاول',
    wanted:'مطلوب', exchange:'للتبادل', contractor:'متاح', buy:'شراء', price_ask:'السعر عند التواصل', budget_upto:'الميزانية حتى', swap_for:'مقابل',
    not_verified:'غير موثّق', verified_acc:'حساب موثّق', demo_acc:'حساب تجريبي', advertiser:'المعلن', posted_by:'بواسطة', ads_count:'{n} إعلان',
    catalog:'الكتالوج', ads_tab:'الإعلانات', about_tab:'نبذة', licensed_contractor:'مقاول مصنّف ومرخّص', grade:'التصنيف',
    g1:'الدرجة الأولى', g2:'الدرجة الثانية', g3:'الدرجة الثالثة', g4:'الدرجة الرابعة', license_no:'رقم الرخصة',
    dir_h:'دليل الشركات', dir_intro:'تصفّح الشركات حسب التخصص — اختر تصنيفاً لعرض الشركات المسجّلة فيه', co_types:'تصنيفات الشركات', co_count:'{n} شركة',
    no_cos:'لا توجد شركات مسجّلة في هذا التصنيف حالياً', no_cos_p:'كن أول شركة في هذا التصنيف — التسجيل ونشر الإعلانات مجاني', register_co:'سجّل شركتك',
    search_co:'ابحث باسم الشركة', co_type:'تصنيف الشركة', accounts_found:'معلنون وشركات مطابقة', all_types:'كل التصنيفات', sc_ads:'الإعلانات', sc_accounts:'الشركات والمعلنون',
    free_ads:'الإعلانات مجانية', free_note:'نشر الإعلانات مجاني لمدة 30 يوماً', post_request:'اطلب',
    mode_offer:'أعرض', mode_request:'أطلب', mode_offer_d:'بيع، تأجير، تبادل أو اعرض خدماتك', mode_request_d:'اطلب معدات أو مواد أو مقاولاً لمشروعك',
    pd_heavy:'بيع أو تأجير حفارات، شيولات، كرينات…', pd_exchange:'بادل معدتك بمعدة أخرى', pd_generators:'بيع أو تأجير مولدات كهرباء', pd_cabins:'كرفانات، مكاتب مواقع، سكن عمال متنقل',
    pd_materials:'رمل، حصى، إسمنت، طوب، خرسانة جاهزة…', pd_contractor:'اعرض خدماتك كمقاول مصنّف ومرخّص', pd_other:'قطع غيار، أدوات، خدمات وغيرها', pd_wanted:'اطلب شراء أو استئجار معدات أو مواد', pd_opp:'انشر مشروعك واستقبل عروض المقاولين',
    phone_login_t:'الدخول برقم الهاتف', phone_no:'رقم الهاتف', send_code:'إرسال رمز التحقق', enter_code:'أدخل رمز التحقق المرسل إلى', code_demo:'نسخة تجريبية — أي رمز من 4 أرقام يعمل (مثال: 1234)',
    verify:'تأكيد', resend:'إعادة إرسال الرمز', change_no:'تغيير الرقم', phone_err:'أدخل رقم هاتف صحيح', code_err:'أدخل رمزاً من 4 أرقام', code_sent:'تم إرسال الرمز (تجريبي)',
    acc_type_q:'نوع الحساب', who_t:'منصة للأفراد والشركات والمقاولين', login_side2:'علامة توثيق خضراء للحسابات المكتملة',
    my_profile:'ملفي', complete_t:'أكمل ملفك للحصول على علامة التوثيق', complete_p:'تظهر العلامة الخضراء ✓ بجانب اسمك فقط بعد إكمال جميع البيانات المطلوبة — هذا يمنحك ثقة المشترين ويحمي المنصة من الإعلانات الوهمية.',
    completion:'اكتمال الملف', save_profile:'حفظ البيانات', profile_saved:'تم حفظ البيانات (تجريبي)', now_verified:'تهانينا! اكتمل ملفك وظهرت علامة ✓ بجانب اسمك', still_missing:'ما زالت بعض البيانات المطلوبة ناقصة',
    f_email:'البريد الإلكتروني', f_about_me:'نبذة عنك / عن الشركة', f_eid:'رقم الهوية الإماراتية', f_eid_doc:'صورة الهوية', f_co_name:'اسم الشركة', f_trade_lic:'رقم الرخصة التجارية', f_lic_exp:'تاريخ انتهاء الرخصة',
    f_lic_doc:'صورة الرخصة', f_logo:'الشعار / الصورة الشخصية', f_grade:'تصنيف المقاول', f_c_lic:'رقم رخصة المقاولات', f_spec:'التخصص', upload:'رفع ملف', uploaded:'تم الرفع', phone_verified:'رقم الهاتف مؤكَّد', profile_sample:'تعبئة بيانات تجريبية',
    trust_h:'إعلانات حقيقية وموثوقة', trust1:'تسجيل برقم الهاتف', trust1p:'كل معلن يسجّل برقم هاتف ويؤكّده برمز تحقق', trust2:'علامة التوثيق الخضراء', trust2p:'تظهر فقط للمعلنين الذين أكملوا بياناتهم ورخصهم',
    trust3:'مراجعة قبل النشر', trust3p:'يراجع فريقنا كل إعلان قبل ظهوره للتأكد من صحته', trust4:'الإبلاغ والحظر', trust4p:'يمكن لأي مستخدم الإبلاغ عن إعلان مشبوه ويُحظر المخالفون',
    login_first_t:'سجّل دخولك برقم الهاتف لنشر إعلان', login_first_p:'لحماية المنصة من الإعلانات الوهمية، يتطلب نشر أي إعلان أو طلب حساباً مؤكّداً برقم الهاتف.',
    unverified_note:'حسابك غير موثّق بعد — سيظهر إعلانك بدون علامة التوثيق.', complete_now:'أكمل ملفك الآن',
    contractor_lock:'متاح فقط للمقاولين المصنّفين والمرخّصين', contractor_lock_p:'سجّل كمقاول وأكمل بيانات التصنيف والرخصة في ملفك لتتمكن من نشر هذا النوع.',
    declare:'أقرّ بأن هذا الإعلان حقيقي وأن المعلومات صحيحة، وأتحمّل المسؤولية عن أي إعلان وهمي', review_note:'سيراجع فريق Bulldozer إعلانك قبل النشر (عادةً خلال دقائق) للتأكد من أنه حقيقي.',
    sent_review_t:'تم إرسال إعلانك للمراجعة!', sent_review_p:'نسخة عرض — لم يُحفظ أو يُنشر شيء فعلياً. في النسخة النهائية يُراجع الإعلان ثم يُنشر.',
    f_urgent:'إعلان مستعجل', f_urgent_p:'يظهر بشارة «مستعجل» حمراء وفي قسم الإعلانات المستعجلة', f_deal:'نوع العرض', f_sub:'نوع المعدة', f_have:'المعدة التي لديك', f_want:'ما تريده مقابلها',
    f_power:'القدرة (KVA)', f_size:'المقاس', f_rooms:'عدد الغرف', f_need:'ما الذي تحتاجه؟', f_budget:'الميزانية (درهم)', f_need_by:'مطلوب قبل تاريخ', f_buy_or_rent:'شراء أو استئجار', f_cov_em:'الإمارات التي تغطيها',
    expires_in:'ينتهي خلال {n} يوم', expired:'منتهي', renew_boost:'تجديد وتمييز', boost_t:'تجديد الإعلان وتمييزه',
    boost_p:'بعد انتهاء مدة الإعلان يمكنك تجديد إعلانك وإظهاره في الصفحات الأولى وأعلى نتائج البحث مقابل رسوم.', boost_soon:'الأسعار وطريقة الدفع سيتم تحديدها لاحقاً',
    pk1:'تجديد الإعلان', pk1p:'إعادة نشر الإعلان لمدة إضافية', pk2:'الظهور في الصفحة الأولى', pk2p:'يظهر إعلانك ضمن الإعلانات المميزة في الرئيسية', pk3:'أعلى نتائج البحث', pk3p:'يظهر إعلانك أولاً عند البحث في فئته',
    soon:'قريباً', notify_me:'أبلغني عند التفعيل', notify_ok:'سنبلغك عند تفعيل الخدمة (تجريبي)', renew_free_ends:'انتهت فترة النشر المجانية لهذا الإعلان',
    opp_title:'فرص للمقاولين', company_ads:'إعلانات المعلن', contact_adv:'تواصل مع المعلن', view_catalog:'عرض الكتالوج', member_type:'نوع الحساب',
    req_short:'طلب', see_profile:'الملف الشخصي', verified_badge:'موثّق', proj_owner_lbl:'صاحب الطلب', more_sec:'المزيد'
  },
  en:{
    hero1_p2:'A free platform for individuals, companies and contractors to post equipment, materials and project ads across the UAE',
    brand_sub:'Free ads for individuals & companies',
    quick_label:'Quick access', quick_heavy:'Heavy equipment deals', sec_h:'Browse by ad type',
    urgent:'Urgent', urgent_ads:'Urgent ads', urgent_only:'Urgent only', verified_only:'Verified advertisers only',
    adv_type:'Advertiser type', k_individual:'Individual', k_company:'Company', k_contractor:'Contractor',
    wanted:'Wanted', exchange:'For exchange', contractor:'Available', buy:'Buy', price_ask:'Price on request', budget_upto:'Budget up to', swap_for:'In exchange for',
    not_verified:'Not verified', verified_acc:'Verified account', demo_acc:'Demo account', advertiser:'Advertiser', posted_by:'By', ads_count:'{n} ads',
    catalog:'Catalog', ads_tab:'Ads', about_tab:'About', licensed_contractor:'Classified & licensed contractor', grade:'Classification',
    g1:'Grade 1', g2:'Grade 2', g3:'Grade 3', g4:'Grade 4', license_no:'License no.',
    dir_h:'Company directory', dir_intro:'Browse companies by specialty — pick a category to see the companies registered in it', co_types:'Company categories', co_count:'{n} companies',
    no_cos:'No companies registered in this category yet', no_cos_p:'Be the first company in this category — registration and ads are free', register_co:'Register your company',
    search_co:'Search by company name', co_type:'Company category', accounts_found:'Matching advertisers & companies', all_types:'All categories', sc_ads:'Ads', sc_accounts:'Companies & advertisers',
    free_ads:'Ads are free', free_note:'Posting is free for 30 days', post_request:'Request',
    mode_offer:'I offer', mode_request:'I request', mode_offer_d:'Sell, rent, exchange or offer your services', mode_request_d:'Request equipment, materials or a contractor for your project',
    pd_heavy:'Sell or rent excavators, loaders, cranes…', pd_exchange:'Swap your machine for another', pd_generators:'Sell or rent power generators', pd_cabins:'Caravans, site offices, portable housing',
    pd_materials:'Sand, gravel, cement, blocks, ready-mix…', pd_contractor:'Offer your services as a classified, licensed contractor', pd_other:'Spare parts, tools, services and more', pd_wanted:'Ask to buy or rent equipment or materials', pd_opp:'Post your project and receive contractor offers',
    phone_login_t:'Log in with your phone', phone_no:'Phone number', send_code:'Send verification code', enter_code:'Enter the code sent to', code_demo:'Demo — any 4-digit code works (e.g. 1234)',
    verify:'Verify', resend:'Resend code', change_no:'Change number', phone_err:'Enter a valid phone number', code_err:'Enter a 4-digit code', code_sent:'Code sent (demo)',
    acc_type_q:'Account type', who_t:'For individuals, companies and contractors', login_side2:'Green verified badge for complete accounts',
    my_profile:'My profile', complete_t:'Complete your profile to get the verified badge', complete_p:'The green ✓ appears next to your name only after all required details are complete — it builds buyer trust and protects the platform from fake ads.',
    completion:'Profile completion', save_profile:'Save details', profile_saved:'Details saved (demo)', now_verified:'Congratulations! Your profile is complete — the ✓ now shows next to your name', still_missing:'Some required details are still missing',
    f_email:'Email', f_about_me:'About you / your company', f_eid:'Emirates ID number', f_eid_doc:'Emirates ID copy', f_co_name:'Company name', f_trade_lic:'Trade license number', f_lic_exp:'License expiry date',
    f_lic_doc:'License copy', f_logo:'Logo / profile photo', f_grade:'Contractor classification', f_c_lic:'Contracting license number', f_spec:'Specialization', upload:'Upload file', uploaded:'Uploaded', phone_verified:'Phone confirmed', profile_sample:'Fill sample details',
    trust_h:'Real, trustworthy ads', trust1:'Phone-verified sign-up', trust1p:'Every advertiser signs up with a phone number confirmed by a code', trust2:'Green verified badge', trust2p:'Shown only for advertisers who completed their details and licenses',
    trust3:'Reviewed before publishing', trust3p:'Our team reviews every ad before it goes live', trust4:'Report & block', trust4p:'Anyone can report a suspicious ad; violators are banned',
    login_first_t:'Log in with your phone to post an ad', login_first_p:'To protect the platform from fake ads, posting an ad or request requires a phone-verified account.',
    unverified_note:'Your account is not verified yet — your ad will show without the verified badge.', complete_now:'Complete your profile now',
    contractor_lock:'Only for classified, licensed contractors', contractor_lock_p:'Register as a contractor and complete your classification and license details to post this type.',
    declare:'I confirm this ad is real and the information is accurate; I am responsible for any fake listing', review_note:'The Bulldozer team reviews your ad before publishing (usually within minutes) to make sure it is genuine.',
    sent_review_t:'Your ad was sent for review!', sent_review_p:'Prototype — nothing was saved or published. In the final version the ad is reviewed, then published.',
    f_urgent:'Urgent ad', f_urgent_p:'Shows a red “Urgent” badge and appears in the urgent ads section', f_deal:'Offer type', f_sub:'Equipment type', f_have:'Machine you have', f_want:'What you want in exchange',
    f_power:'Power (kVA)', f_size:'Size', f_rooms:'Number of rooms', f_need:'What do you need?', f_budget:'Budget (AED)', f_need_by:'Needed by', f_buy_or_rent:'Buy or rent', f_cov_em:'Emirates you cover',
    expires_in:'Expires in {n} days', expired:'Expired', renew_boost:'Renew & boost', boost_t:'Renew & boost your ad',
    boost_p:'When an ad expires, you can renew your ad and show it on the first pages and at the top of search results for a fee.', boost_soon:'Prices and payment method will be decided later',
    pk1:'Renew ad', pk1p:'Republish your ad for another period', pk2:'Front-page placement', pk2p:'Your ad appears among featured ads on the home page', pk3:'Top of search', pk3p:'Your ad shows first in its category searches',
    soon:'Soon', notify_me:'Notify me when available', notify_ok:'We will notify you when it launches (demo)', renew_free_ends:'The free posting period for this ad has ended',
    opp_title:'Contractor opportunities', company_ads:'Advertiser’s ads', contact_adv:'Contact advertiser', view_catalog:'View catalog', member_type:'Account type',
    req_short:'Request', see_profile:'Profile', verified_badge:'Verified', proj_owner_lbl:'Requested by', more_sec:'More'
  },
  ur:{
    hero1_p2:'افراد، کمپنیوں اور ٹھیکیداروں کے لیے امارات بھر میں آلات، سامان اور منصوبوں کے اشتہارات کا مفت پلیٹ فارم',
    brand_sub:'افراد اور کمپنیوں کے لیے مفت اشتہارات',
    quick_label:'فوری رسائی', quick_heavy:'بھاری آلات کے سودے', sec_h:'اشتہار کی قسم کے مطابق دیکھیں',
    urgent:'فوری', urgent_ads:'فوری اشتہارات', urgent_only:'صرف فوری', verified_only:'صرف تصدیق شدہ اشتہار دہندگان',
    adv_type:'اشتہار دہندہ کی قسم', k_individual:'انفرادی', k_company:'کمپنی', k_contractor:'ٹھیکیدار',
    wanted:'مطلوب', exchange:'تبادلے کے لیے', contractor:'دستیاب', buy:'خریداری', price_ask:'قیمت رابطے پر', budget_upto:'بجٹ زیادہ سے زیادہ', swap_for:'بدلے میں',
    not_verified:'غیر تصدیق شدہ', verified_acc:'تصدیق شدہ اکاؤنٹ', demo_acc:'ڈیمو اکاؤنٹ', advertiser:'اشتہار دہندہ', posted_by:'از', ads_count:'{n} اشتہارات',
    catalog:'کیٹلاگ', ads_tab:'اشتہارات', about_tab:'تعارف', licensed_contractor:'درجہ بند اور لائسنس یافتہ ٹھیکیدار', grade:'درجہ بندی',
    g1:'پہلا درجہ', g2:'دوسرا درجہ', g3:'تیسرا درجہ', g4:'چوتھا درجہ', license_no:'لائسنس نمبر',
    dir_h:'کمپنیوں کی ڈائریکٹری', dir_intro:'مہارت کے مطابق کمپنیاں دیکھیں — رجسٹرڈ کمپنیاں دیکھنے کے لیے زمرہ منتخب کریں', co_types:'کمپنیوں کے زمرے', co_count:'{n} کمپنیاں',
    no_cos:'اس زمرے میں ابھی کوئی کمپنی رجسٹر نہیں', no_cos_p:'اس زمرے کی پہلی کمپنی بنیں — رجسٹریشن اور اشتہارات مفت ہیں', register_co:'اپنی کمپنی رجسٹر کریں',
    search_co:'کمپنی کے نام سے تلاش', co_type:'کمپنی کا زمرہ', accounts_found:'مماثل اشتہار دہندگان اور کمپنیاں', all_types:'تمام زمرے', sc_ads:'اشتہارات', sc_accounts:'کمپنیاں اور اشتہار دہندگان',
    free_ads:'اشتہارات مفت ہیں', free_note:'30 دن کے لیے اشتہار لگانا مفت ہے', post_request:'طلب کریں',
    mode_offer:'میں پیش کرتا ہوں', mode_request:'مجھے چاہیے', mode_offer_d:'فروخت، کرایہ، تبادلہ یا اپنی خدمات پیش کریں', mode_request_d:'اپنے منصوبے کے لیے آلات، سامان یا ٹھیکیدار طلب کریں',
    pd_heavy:'کھدائی مشین، لوڈر، کرین فروخت یا کرایہ پر دیں…', pd_exchange:'اپنی مشین دوسری مشین سے بدلیں', pd_generators:'جنریٹر فروخت یا کرایہ پر دیں', pd_cabins:'کارواں، سائٹ آفس، پورٹیبل رہائش',
    pd_materials:'ریت، بجری، سیمنٹ، بلاک، ریڈی مکس…', pd_contractor:'درجہ بند لائسنس یافتہ ٹھیکیدار کے طور پر خدمات پیش کریں', pd_other:'پرزے، اوزار، خدمات وغیرہ', pd_wanted:'آلات یا سامان خریدنے یا کرایہ پر لینے کی درخواست', pd_opp:'اپنا منصوبہ شائع کریں اور ٹھیکیداروں کی پیشکشیں لیں',
    phone_login_t:'فون نمبر سے لاگ اِن', phone_no:'فون نمبر', send_code:'تصدیقی کوڈ بھیجیں', enter_code:'بھیجا گیا کوڈ درج کریں برائے', code_demo:'نمائشی ورژن — کوئی بھی 4 ہندسوں کا کوڈ چلے گا (مثال: 1234)',
    verify:'تصدیق کریں', resend:'کوڈ دوبارہ بھیجیں', change_no:'نمبر تبدیل کریں', phone_err:'درست فون نمبر درج کریں', code_err:'4 ہندسوں کا کوڈ درج کریں', code_sent:'کوڈ بھیج دیا گیا (نمائشی)',
    acc_type_q:'اکاؤنٹ کی قسم', who_t:'افراد، کمپنیوں اور ٹھیکیداروں کے لیے', login_side2:'مکمل اکاؤنٹس کے لیے سبز تصدیقی نشان',
    my_profile:'میری پروفائل', complete_t:'تصدیقی نشان کے لیے اپنی پروفائل مکمل کریں', complete_p:'سبز ✓ آپ کے نام کے ساتھ صرف تمام لازمی تفصیلات مکمل ہونے کے بعد ظاہر ہوتا ہے — اس سے خریداروں کا اعتماد بڑھتا ہے اور جعلی اشتہارات سے حفاظت ہوتی ہے۔',
    completion:'پروفائل کی تکمیل', save_profile:'تفصیلات محفوظ کریں', profile_saved:'تفصیلات محفوظ ہو گئیں (نمائشی)', now_verified:'مبارک ہو! پروفائل مکمل — آپ کے نام کے ساتھ ✓ ظاہر ہو گیا', still_missing:'کچھ لازمی تفصیلات ابھی باقی ہیں',
    f_email:'ای میل', f_about_me:'آپ / آپ کی کمپنی کا تعارف', f_eid:'اماراتی شناختی نمبر', f_eid_doc:'شناختی کارڈ کی کاپی', f_co_name:'کمپنی کا نام', f_trade_lic:'تجارتی لائسنس نمبر', f_lic_exp:'لائسنس کی میعاد',
    f_lic_doc:'لائسنس کی کاپی', f_logo:'لوگو / تصویر', f_grade:'ٹھیکیدار کی درجہ بندی', f_c_lic:'ٹھیکیداری لائسنس نمبر', f_spec:'مہارت', upload:'فائل اپ لوڈ کریں', uploaded:'اپ لوڈ ہو گئی', phone_verified:'فون نمبر کی تصدیق ہو گئی', profile_sample:'نمونہ تفصیلات بھریں',
    trust_h:'حقیقی اور قابلِ اعتماد اشتہارات', trust1:'فون نمبر سے رجسٹریشن', trust1p:'ہر اشتہار دہندہ تصدیقی کوڈ کے ساتھ فون نمبر سے رجسٹر ہوتا ہے', trust2:'سبز تصدیقی نشان', trust2p:'صرف ان اشتہار دہندگان کے لیے جنہوں نے تفصیلات اور لائسنس مکمل کیے',
    trust3:'اشاعت سے پہلے جائزہ', trust3p:'ہماری ٹیم ہر اشتہار کا شائع ہونے سے پہلے جائزہ لیتی ہے', trust4:'رپورٹ اور پابندی', trust4p:'کوئی بھی مشکوک اشتہار رپورٹ کر سکتا ہے؛ خلاف ورزی کرنے والوں پر پابندی',
    login_first_t:'اشتہار لگانے کے لیے فون نمبر سے لاگ اِن کریں', login_first_p:'جعلی اشتہارات سے بچاؤ کے لیے اشتہار یا درخواست شائع کرنے کے لیے تصدیق شدہ فون نمبر والا اکاؤنٹ ضروری ہے۔',
    unverified_note:'آپ کا اکاؤنٹ ابھی تصدیق شدہ نہیں — آپ کا اشتہار تصدیقی نشان کے بغیر دکھائی دے گا۔', complete_now:'ابھی پروفائل مکمل کریں',
    contractor_lock:'صرف درجہ بند اور لائسنس یافتہ ٹھیکیداروں کے لیے', contractor_lock_p:'یہ قسم شائع کرنے کے لیے بطور ٹھیکیدار رجسٹر ہوں اور پروفائل میں درجہ بندی اور لائسنس کی تفصیلات مکمل کریں۔',
    declare:'میں تصدیق کرتا ہوں کہ یہ اشتہار حقیقی ہے اور معلومات درست ہیں؛ کسی جعلی اشتہار کی ذمہ داری میری ہے', review_note:'Bulldozer ٹیم اشاعت سے پہلے آپ کے اشتہار کا جائزہ لیتی ہے (عموماً چند منٹ میں) تاکہ یقینی بنایا جا سکے کہ یہ حقیقی ہے۔',
    sent_review_t:'آپ کا اشتہار جائزے کے لیے بھیج دیا گیا!', sent_review_p:'نمائشی ورژن — کچھ بھی محفوظ یا شائع نہیں ہوا۔ حتمی ورژن میں جائزے کے بعد اشتہار شائع ہوگا۔',
    f_urgent:'فوری اشتہار', f_urgent_p:'سرخ «فوری» نشان کے ساتھ اور فوری اشتہارات کے حصے میں دکھائی دیتا ہے', f_deal:'پیشکش کی قسم', f_sub:'آلے کی قسم', f_have:'آپ کے پاس موجود مشین', f_want:'بدلے میں آپ کیا چاہتے ہیں',
    f_power:'طاقت (kVA)', f_size:'سائز', f_rooms:'کمروں کی تعداد', f_need:'آپ کو کیا چاہیے؟', f_budget:'بجٹ (درہم)', f_need_by:'کب تک درکار', f_buy_or_rent:'خرید یا کرایہ', f_cov_em:'آپ کن امارات میں کام کرتے ہیں',
    expires_in:'{n} دن میں ختم', expired:'ختم شدہ', renew_boost:'تجدید اور نمایاں', boost_t:'اشتہار کی تجدید اور نمایاں کریں',
    boost_p:'اشتہار کی مدت ختم ہونے پر آپ فیس ادا کر کے اپنے اشتہار کی تجدید کر سکتے ہیں اور اسے پہلے صفحات اور تلاش کے نتائج میں سب سے اوپر دکھا سکتے ہیں۔', boost_soon:'قیمتیں اور ادائیگی کا طریقہ بعد میں طے کیا جائے گا',
    pk1:'اشتہار کی تجدید', pk1p:'اشتہار مزید مدت کے لیے دوبارہ شائع کریں', pk2:'پہلے صفحے پر نمایاں', pk2p:'آپ کا اشتہار ہوم پیج کے نمایاں اشتہارات میں دکھائی دے گا', pk3:'تلاش میں سب سے اوپر', pk3p:'آپ کا اشتہار اپنے زمرے کی تلاش میں پہلے دکھائی دے گا',
    soon:'جلد', notify_me:'دستیاب ہونے پر مطلع کریں', notify_ok:'سروس شروع ہونے پر ہم آپ کو مطلع کریں گے (نمائشی)', renew_free_ends:'اس اشتہار کی مفت مدت ختم ہو گئی ہے',
    opp_title:'ٹھیکیداروں کے لیے مواقع', company_ads:'اشتہار دہندہ کے اشتہارات', contact_adv:'اشتہار دہندہ سے رابطہ', view_catalog:'کیٹلاگ دیکھیں', member_type:'اکاؤنٹ کی قسم',
    req_short:'درخواست', see_profile:'پروفائل', verified_badge:'تصدیق شدہ', proj_owner_lbl:'درخواست دہندہ', more_sec:'مزید'
  }
};
['ar','en','ur'].forEach(l => Object.assign(I18N[l], V2[l]));

/* ---------- v3: global brands strip (names shown as text; drop a logo file in assets/img/brands/<id>.png to show it) ---------- */
const BRANDS = [
  {id:'caterpillar', n:'Caterpillar', q:'CAT'}, {id:'komatsu', n:'Komatsu', q:'Komatsu'}, {id:'volvo', n:'Volvo CE', q:'Volvo'},
  {id:'liebherr', n:'Liebherr', q:'Liebherr'}, {id:'hitachi', n:'Hitachi', q:'Hitachi'}, {id:'jcb', n:'JCB', q:'JCB'},
  {id:'xcmg', n:'XCMG', q:'XCMG'}, {id:'sany', n:'SANY', q:'SANY'}, {id:'hyundai', n:'Hyundai CE', q:'Hyundai'},
  {id:'develon', n:'Develon', q:'Develon'}, {id:'tadano', n:'Tadano', q:'Tadano'}, {id:'bomag', n:'BOMAG', q:'BOMAG'},
  {id:'dynapac', n:'Dynapac', q:'Dynapac'}, {id:'putzmeister', n:'Putzmeister', q:'Putzmeister'}, {id:'perkins', n:'Perkins', q:'Perkins'},
  {id:'mercedes', n:'Mercedes-Benz Trucks', q:'Mercedes'}, {id:'yamaha', n:'Yamaha Marine', q:'Yamaha'}, {id:'damen', n:'Damen', q:'Damen'}
];

/* ---------- v3 texts ---------- */
const V3 = {
  ar:{ nav_rent:'تأجير معدات', nav_sale:'بيع معدات', all_sections:'كل الأقسام', menu_t:'القائمة', brands_h:'شركات عالمية', back:'رجوع',
    browse_cat_h:'تصفّح المعدات حسب الفئة', n_ads:'{n} إعلان', chat:'دردشة', all_cats:'كل الفئات',
    f_popular:'الأقسام الشائعة', f_emirates:'تصفّح حسب الإمارة', f_company:'الشركة', f_support:'الدعم', f_social:'تابعنا', f_app:'حمّل التطبيق قريباً',
    contact_us:'اتصل بنا', advertise:'أعلن معنا', help_center:'مركز المساعدة', careers:'الوظائف', safety_tips:'نصائح الأمان', in_city:'في {c}',
    unverified_note:'أكمل بيانات ملفك لتظهر علامة ✓ الخضراء بجانب اسمك.', pd_marine_leisure:'جت سكي، قوارب، يخوت، كاياك…', pd_marine_port:'رافعات موانئ، بارجات، قاطرات، حفارات تجريف…', pd_sandgravel:'رمل، حصى، ركام، رمل ردم…' },
  en:{ nav_rent:'Equipment rental', nav_sale:'Equipment sale', all_sections:'All sections', menu_t:'Menu', brands_h:'Global brands', back:'Back',
    browse_cat_h:'Browse equipment by category', n_ads:'{n} ads', chat:'Chat', all_cats:'All categories',
    f_popular:'Popular sections', f_emirates:'Browse by emirate', f_company:'Company', f_support:'Support', f_social:'Follow us', f_app:'App coming soon',
    contact_us:'Contact us', advertise:'Advertise with us', help_center:'Help center', careers:'Careers', safety_tips:'Safety tips', in_city:'in {c}',
    unverified_note:'Complete your profile details to show the green ✓ next to your name.', pd_marine_leisure:'Jet skis, boats, yachts, kayaks…', pd_marine_port:'Harbour cranes, barges, tugs, dredgers…', pd_sandgravel:'Sand, gravel, aggregates, backfill…' },
  ur:{ nav_rent:'آلات کرائے پر', nav_sale:'آلات برائے فروخت', all_sections:'تمام حصے', menu_t:'مینو', brands_h:'عالمی برانڈز', back:'واپس',
    browse_cat_h:'زمرہ کے مطابق آلات دیکھیں', n_ads:'{n} اشتہارات', chat:'چیٹ', all_cats:'تمام زمرے',
    f_popular:'مقبول حصے', f_emirates:'امارت کے مطابق دیکھیں', f_company:'کمپنی', f_support:'مدد', f_social:'ہمیں فالو کریں', f_app:'ایپ جلد آ رہی ہے',
    contact_us:'رابطہ کریں', advertise:'ہمارے ساتھ اشتہار دیں', help_center:'مدد مرکز', careers:'ملازمتیں', safety_tips:'حفاظتی مشورے', in_city:'{c} میں',
    unverified_note:'اپنے نام کے ساتھ سبز ✓ دکھانے کے لیے پروفائل کی تفصیلات مکمل کریں۔', pd_marine_leisure:'جیٹ اسکی، کشتیاں، یاٹ، کایاک…', pd_marine_port:'ہاربر کرینیں، بارجز، ٹگ، ڈریجرز…', pd_sandgravel:'ریت، بجری، روڑی، بھرائی کی ریت…' }
};
['ar','en','ur'].forEach(l => Object.assign(I18N[l], V3[l]));
