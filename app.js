/* Cindy's Choices — Infinity Plus by Cindy · demo front-end (state in localStorage, no backend) */
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- i18n ---------- */
const I18N = {
  en: {},
  mm: { home: 'ပင်မ', account: 'အကောင့်', invoices: 'ငွေတောင်းခံလွှာ', allorders: 'အော်ဒါများ', catalog: 'ကတ်တလောက်', orders: 'အော်ဒါများ', cargo: 'ကုန်စည်', cart: 'ကြိုတင်မှာယူမှု', manifest: 'မန်နီဖက်စ်', transit: 'ပို့ဆောင်ဆဲ', pod: 'POD လက်ခံ', overview: 'အနှစ်ချုပ်', fx: 'FX', vendors: 'ကုန်သည်များ', escrow: 'အာမခံငွေ', roles: 'ခွင့်ပြုချက်', lab: 'စမ်းသပ်ခန်း', stock: 'စတော့', payouts: 'ငွေထုတ်', accept: 'လက်ခံမည်', decline: 'ငြင်းမည်', signin: 'ဝင်ရောက်မည်', logout: 'ထွက်မည်', reserve: 'ကြိုတင်မှာမည်', search: 'ရှာဖွေရန်', all: 'အားလုံး', pay: 'ငွေပေးချေမည်', closing: 'ပိတ်ခါနီး', welcome: 'ကြိုဆိုပါတယ်', pickup: 'ထုပ်ပိုးပြီး — ကောက်ယူရန်', confirmStock: 'စတော့ အတည်ပြု', label: 'QR တံဆိပ်' },
  th: { home: 'หน้าหลัก', account: 'บัญชี', invoices: 'ใบแจ้งหนี้', allorders: 'คำสั่งซื้อ', catalog: 'แคตตาล็อก', orders: 'คำสั่งซื้อ', cargo: 'คาร์โก้', cart: 'พรีออเดอร์', manifest: 'แมนิเฟสต์', transit: 'ระหว่างขนส่ง', pod: 'POD', overview: 'ภาพรวม', fx: 'FX', vendors: 'ผู้ขาย', escrow: 'เอสโครว์', roles: 'สิทธิ์', lab: 'ห้องทดสอบ', stock: 'สต็อก', payouts: 'การจ่ายเงิน', accept: 'รับออเดอร์', decline: 'ปฏิเสธ', signin: 'เข้าสู่ระบบ', logout: 'ออกจากระบบ', reserve: 'จองล็อต', search: 'ค้นหา', all: 'ทั้งหมด', pay: 'ชำระเงิน', closing: 'ใกล้ปิดรับ', welcome: 'ยินดีต้อนรับ', pickup: 'แพ็กแล้ว — พร้อมรับ', confirmStock: 'ยืนยันสต็อก', label: 'ป้าย QR' }
};
const t = k => (I18N[S.lang] && I18N[S.lang][k]) || I18N.en[k] || ({ home: 'Home', account: 'Account', invoices: 'Invoices', allorders: 'Orders', catalog: 'Catalog', orders: 'Orders', cargo: 'Cargo', cart: 'Pre-order', manifest: 'Manifest', transit: 'In transit', pod: 'POD', overview: 'Overview', fx: 'FX Engine', vendors: 'Vendors', escrow: 'Escrow', roles: 'Roles', lab: 'Test Lab', stock: 'Stock', payouts: 'Payouts', accept: 'Accept order', decline: 'Decline', signin: 'Secure sign-in', logout: 'Switch role', reserve: 'Reserve batch', search: 'Search batches', all: 'All batches', pay: 'Pay & upload slip', closing: 'Closing soon', welcome: 'Welcome', pickup: 'Packed — ready for pickup', confirmStock: 'Confirm stock on shelf', label: 'QR label' })[k] || k;

/* ---------- constants ---------- */
const ROLES = {
  ADMIN: { name: 'Platform Admin', nm: 'အုပ်ချုပ်သူ', user: 'Cindy · Regional Ops', phone: '+95 9 4xx xxx 101', color: '#0D5C4D', home: '#/a/overview', desc: 'Vendor KYC · FX spread & override · escrow release · disputes' },
  BUYER: { name: 'Retailer / Buyer', nm: 'လက်လီဝယ်သူ', user: 'Silom Artisan Gallery · Bangkok', phone: '+66 2 xxx xxxx', color: '#D4AF37', home: '#/home', desc: 'Batch pre-orders · THB/MMK/USD/TWD checkout · slip upload · POD' },
  SUPPLIER: { name: 'Myanmar Supplier', nm: 'ကုန်သည်', user: 'Bagan Master Crafts · Mandalay', phone: '+95 9 7xx xxx 442', color: '#78350F', home: '#/s/home', desc: '1-tap accept · stock confirm · QR labels · MMK payouts (3G/PWA)' },
  DELIVERY: { name: 'Logistics / 3PL', nm: 'ပို့ဆောင်ရေး', user: 'Mae Sot Cargo Co. · Yangon Hub', phone: '+95 9 2xx xxx 870', color: '#102A45', home: '#/l/home', desc: 'Manifest · weight intake · MAWB consolidation · signature POD' }
};
const BANNER = { ADMIN: 'Admin', SUPPLIER: 'Supplier', DELIVERY: 'Delivery', BUYER: 'Buyer' };
const NAV = {
  BUYER: [['#/home', 'grid', 'home'], ['#/catalog', 'bag', 'catalog'], ['#/cart', 'cart', 'cart'], ['#/orders', 'box', 'orders'], ['#/cargo', 'truck', 'cargo'], ['#/account', 'user', 'account']],
  SUPPLIER: [['#/s/home', 'grid', 'home'], ['#/s/orders', 'box', 'orders'], ['#/s/stock', 'layers', 'stock'], ['#/s/payouts', 'wallet', 'payouts'], ['#/account', 'user', 'account']],
  DELIVERY: [['#/l/home', 'grid', 'home'], ['#/l/manifest', 'list', 'manifest'], ['#/l/transit', 'truck', 'transit'], ['#/l/pod', 'pen', 'pod'], ['#/account', 'user', 'account']],
  ADMIN: [['#/a/overview', 'grid', 'overview'], ['#/a/orders', 'box', 'allorders'], ['#/a/fx', 'trend', 'fx'], ['#/a/vendors', 'users', 'vendors'], ['#/a/escrow', 'lock', 'escrow'], ['#/account', 'user', 'account']]
};
const STAGES = ['Order placed', 'Payment slip submitted', 'Slip verified', 'Escrow funded', 'Vendor notified', 'Vendor accepted', 'Stock confirmed', 'Quality check', 'Batch closed', 'QR labels printed', 'Packed · ready for pickup', 'Picked up · in transit', 'Customs cleared · out for delivery', 'Delivered · POD signed'];
const CATS = ['Textiles', 'Lacquerware', 'Tea & Coffee', 'Gems & Jewelry', 'Wellness'];
const CUR = { THB: { sym: '฿', rail: 'PromptPay QR', c: 'TH' }, TWD: { sym: 'NT$', rail: 'Taiwan Pay QR', c: 'TW' }, USD: { sym: '$', rail: 'Regional wire transfer', c: 'INT' }, MMK: { sym: 'Ks ', rail: 'MyanMyanPay QR (KBZPay · WavePay)', c: 'MM' } };
const ICONS = {
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0',
  bag: 'M6 7h12l1 13H5L6 7zM9 7a3 3 0 016 0', cart: 'M3 4h2l2 11h10l2-8H7M9 20a1 1 0 100 .01M17 20a1 1 0 100 .01', box: 'M3 8l9-5 9 5v8l-9 5-9-5V8zM3 8l9 5 9-5M12 13v8',
  truck: 'M2 6h11v10H2zM13 9h4l3 3v4h-7M6 19a2 2 0 100-.01M17 19a2 2 0 100-.01', flask: 'M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3', layers: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5',
  wallet: 'M3 7h16a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7zM3 7l12-3v3M16 14h2', list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01', pen: 'M4 20l4-1 11-11-3-3L5 16l-1 4zM14 7l3 3',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z', trend: 'M3 17l6-6 4 4 8-8M15 7h6v6', users: 'M9 11a4 4 0 100-8 4 4 0 000 8zM2 21a7 7 0 0114 0M17 3a4 4 0 010 8M22 21a7 7 0 00-5-6.7',
  lock: 'M6 11h12v10H6zM8 11V7a4 4 0 018 0v4', shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4', check: 'M5 12l5 5 9-10', x: 'M6 6l12 12M18 6L6 18',
  clock: 'M12 7v5l3 2M12 21a9 9 0 100-18 9 9 0 000 18z', upload: 'M12 16V4M7 9l5-5 5 5M4 20h16', spark: 'M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z', pin: 'M12 21s7-6 7-12a7 7 0 10-14 0c0 6 7 12 7 12zM12 11a2 2 0 100-.01', out: 'M9 4H5v16h4M16 8l4 4-4 4M20 12H9', wifi: 'M2 9a15 15 0 0120 0M5 12.5a10 10 0 0114 0M8.5 16a5 5 0 017 0M12 19.5h.01', qr: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h3v3h-3zM20 14v6h-3'
};
ICONS.bell = 'M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 004 0';
const ic = (n, c = '') => `<svg class="ic ${c}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[n] || ''}"/></svg>`;

/* ---------- seed data ---------- */
const H = 3600e3, NOW0 = Date.now();
let PRODUCTS = [
  { id: 'P1', n: 'Bagan 14-Layer Lacquer Offering Bowl', mm: 'ပုဂံ ရွှေဆိုင်း ၁၄-ထပ် ယွန်းသပိတ်', cat: 'Lacquerware', v: 'V1', unit: 45000, kg: 0.9, moq: 20, quota: 120, res: 96, cut: 18, from: 'Bagan', note: 'Hand-incised, gold leaf, food-safe lac', tag: 'Rare Heritage' },
  { id: 'P2', n: 'Inle Lotus Silk Scarf', mm: 'အင်းလေး ပုဏ္ဏရိတ်ပိုးပုဝါ', cat: 'Textiles', v: 'V2', unit: 120000, kg: 0.25, moq: 10, quota: 60, res: 22, cut: 52, from: 'Inle Lake', note: '100% sacred lotus stem fibre, natural dye', tag: '100% Organic Lotus' },
  { id: 'P3', n: 'Shan Peaberry Coffee (12 kg bag)', mm: 'ရှမ်းကော်ဖီ ပီဘယ်ရီ', cat: 'Tea & Coffee', v: 'V3', unit: 150000, kg: 12, moq: 24, quota: 200, res: 190, cut: 6, from: 'Ywangan', note: 'Single origin · 1,400 m · washed', tag: '95% allocated' },
  { id: 'P4', n: 'Palace Thanaka Gift Set (box of 40)', mm: 'နန်းတွင်းသနပ်ခါး ဆက်', cat: 'Wellness', v: 'V4', unit: 140000, kg: 3.2, moq: 40, quota: 160, res: 58, cut: 70, from: 'Mandalay', note: 'Grade-A bark, FDA cleared', tag: 'FDA Cleared' },
  { id: 'P5', n: 'Jadeite Cabochon Pendant, Type A', mm: 'ကျောက်စိမ်း ပတ်သရေ အေအမျိုးအစား', cat: 'Gems & Jewelry', v: 'V5', unit: 850000, kg: 0.05, moq: 5, quota: 30, res: 11, cut: 120, from: 'Mogok · Mandalay', note: 'Lab-certified natural, untreated', tag: 'Certified' },
  { id: 'P6', n: 'Pa-O Hand-Woven Longyi Set', mm: 'ပအိုဝ်း ကိုယ်တိုင်ရက် လုံချည်', cat: 'Textiles', v: 'V2', unit: 68000, kg: 0.6, moq: 30, quota: 150, res: 47, cut: 40, from: 'Kalaw', note: 'Cotton-silk, indigo & mulberry', tag: 'Fair Trade' },
  { id: 'P7', n: 'Pyin Oo Lwin Green Tea (5 kg)', mm: 'ပင်ဥလွင် လက်ဖက်စိမ်း', cat: 'Tea & Coffee', v: 'V3', unit: 55000, kg: 5, moq: 30, quota: 180, res: 70, cut: 30, from: 'Pyin Oo Lwin', note: 'Spring flush, hand-rolled', tag: 'Single Origin' },
  { id: 'P8', n: 'Padauk Lacquer Jewellery Box', mm: 'ပိတောက် ယွန်းလက်ဝတ်ရတနာသေတ္တာ', cat: 'Lacquerware', v: 'V1', unit: 72000, kg: 1.2, moq: 12, quota: 72, res: 70, cut: 9, from: 'Bagan', note: 'Teak-core, bamboo-weave, gilded', tag: 'Closing soon' }
];
let VENDORS = [
  { id: 'V1', n: 'Bagan Master Crafts', city: 'Bagan', kyc: 'verified', tier: 'Gold', docs: 'NRC · MSME · FDA' },
  { id: 'V2', n: 'Inle Lotus Weavers Guild', city: 'Inle', kyc: 'verified', tier: 'Gold', docs: 'NRC · Guild cert' },
  { id: 'V3', n: 'Shan Mountain Organic', city: 'Ywangan', kyc: 'verified', tier: 'Silver', docs: 'NRC · Organic cert' },
  { id: 'V4', n: 'Mandalay Heritage', city: 'Mandalay', kyc: 'verified', tier: 'Silver', docs: 'NRC · FDA' },
  { id: 'V5', n: 'Mogok Gem Atelier', city: 'Mogok', kyc: 'pending', tier: '—', docs: 'NRC · Gem lab report' },
  { id: 'V6', n: 'Kalaw Indigo Studio', city: 'Kalaw', kyc: 'pending', tier: '—', docs: 'NRC (awaiting MSME)' }
];
const SEED_FX = { rates: { USD: 1, THB: 35.8, TWD: 32.1, MMK: 7730 }, spread: 2.5, margin: 8, freight: { TH: 2.4, TW: 4.1, INT: 4.1, MM: 1.2 }, override: false, history: [] };

/* ---------- consignment ---------- */
const CONS_FEE = { 0: 6, 10: 5, 25: 3.5, 50: 2 };   /* % fee: the lower the deposit, the higher the fee */
const CONS_L = { settle: { sold: 'Pay as sold', monthly: 'Monthly', end: 'At term end' }, unsold: { return: 'Return unsold', extend: 'Extend term', buyout: 'Buy out −10%' } };
/* Admin-controlled order options (S.opts) */
const OPT_DEF = { cons: { on: true, dep: 25, term: 60, settle: 'sold', unsold: 'return', extMax: 2, fee: { ...CONS_FEE } }, later: { on: true, days: [15, 30, 45], fee: { 15: 1.5, 30: 3, 45: 4.5, 60: 6 } }, defer: { on: true, days: [14, 30, 60] } };
const opts = () => { if (!S.opts) S.opts = JSON.parse(JSON.stringify(OPT_DEF)); const c = S.opts.cons; if (c.dep === undefined) Object.assign(c, { dep: 25, term: 60, settle: 'sold', unsold: 'return' }); return S.opts; };
const consFee = dep => ((typeof S !== 'undefined' && S && S.opts ? S.opts.cons.fee : CONS_FEE)[dep]) ?? 4;
const held = o => !!(o.defer && !o.defer.released && o.defer.until > Date.now());
function laterTerms(items, cur, days) { const c = calc(items, cur), feePct = opts().later.fee[days] ?? 3, feeMMK = c.totalMMK * feePct / 100; return { c, feePct, feeMMK, grossMMK: c.totalMMK + feeMMK }; }
function tagChips(o) { return (o.cons ? '<span class="chip ai">Consignment</span>' : '') + (o.later ? '<span class="chip ai">Pay later</span>' : '') + (o.defer ? `<span class="chip ${held(o) ? 'warn' : 'gray'}">${held(o) ? 'Deliver later' : 'Dispatch released'}</span>` : ''); }
function consTerms(items, cur, d) {
  const c = calc(items, cur), feePct = consFee(d.dep), feeMMK = c.totalMMK * feePct / 100, grossMMK = c.totalMMK + feeMMK;
  return { c, feePct, feeMMK, grossMMK, depMMK: Math.round(grossMMK * d.dep / 100) };
}
function consStatus(o) {
  const c = o.cons; let soldVal = 0, leftVal = 0, units = 0, sold = 0;
  o.items.forEach(i => { const uv = c.grossMMK * (PRODUCTS.find(p => p.id === i.p).unit * i.q / o.calc.artisan) / i.q, s = Math.min(i.q, c.sold[i.p] || 0); soldVal += uv * s; leftVal += uv * (i.q - s); sold += s; units += i.q; });
  soldVal -= c.disc || 0;
  const received = c.depMMK + c.paid;
  return { units, sold, left: units - sold, soldVal, leftVal, received, due: Math.max(0, Math.round(soldVal - received)), over: Math.max(0, Math.round(received - soldVal)) };
}
function fundLedger(s, o, ts) {
  const c = o.cons || o.later;
  if (!c) return postLedger(s, o, 'Buyer Funds', 'Escrow Vault', o.calc.totalMMK, 'Escrow funded', ts);
  if (c.depMMK > 0) postLedger(s, o, 'Buyer Funds', 'Escrow Vault', c.depMMK, 'Consignment deposit ' + c.dep + '%', ts);
  postLedger(s, o, 'Platform Float', 'Escrow Vault', Math.round(o.calc.totalMMK - c.depMMK), o.cons ? 'Platform consignment advance' : 'Platform pay-later advance', ts);
}
function seedOrders() {
  const mk = (id, ago, items, stage, cur = 'THB') => {
    const o = { id, ts: NOW0 - ago * H, buyer: 'Silom Artisan Gallery', cur, rail: CUR[cur].rail, items, stage, status: 'ok', slip: { ref: 'PP' + (880200 + +id.slice(-2) * 17), conf: 97.4, ts: NOW0 - ago * H + 6e5, ok: true }, rel: { dep: false, bal: false }, ms: [] };
    o.calc = calc(items, cur);
    for (let s = 1; s <= stage; s++) o.ms.push({ s, ts: o.ts + s * 36e5 * 2 });
    if (stage >= 11) o.rel.dep = true;
    if (stage >= 12) o.ship = { mode: 'Land · Mae Sot', mawb: 'CC-MS-' + (2400 + +id.slice(-2)), from: 'Yangon Hub', to: 'Bangkok · Lat Krabang', gross: 18.4, vol: 22.1, depart: o.ts + 80 * H / 10, eta: o.ts + 140 * H / 10, st: stage >= 13 ? 'Customs cleared' : 'In transit' };
    if (stage >= 14) { o.rel.bal = true; o.pod = { by: 'K. Somchai', ts: o.ts + 200 * H / 10, geo: '13.7563, 100.5018' }; }
    return o;
  };
  const co = mk('O-1039', 900, [{ p: 'P2', q: 12 }], 14), ct = consTerms(co.items, co.cur, { dep: 25 }), st0 = co.ts + 20 * H;
  co.cons = { dep: 25, term: 60, settle: 'sold', unsold: 'return', feePct: ct.feePct, grossMMK: Math.round(ct.grossMMK), depMMK: ct.depMMK, sold: { P2: 5 }, paid: 0, disc: 0, ext: 0, start: st0, due: st0 + 60 * 24 * H, closed: false };
  return [mk('O-1041', 5, [{ p: 'P1', q: 20 }, { p: 'P3', q: 24 }], 5), mk('O-1040', 70, [{ p: 'P2', q: 12 }], 11), mk('O-1038', 160, [{ p: 'P6', q: 30 }], 13), mk('O-1030', 400, [{ p: 'P4', q: 40 }], 14, 'THB'), co];
}
function seed() {
  const s = { v: 1, role: null, lang: 'en', cur: 'THB', fx: JSON.parse(JSON.stringify(SEED_FX)), orders: seedOrders(), cart: [], vendors: VENDORS.map(v => ({ ...v })), disputes: [{ id: 'D-77', order: 'O-1038', by: 'Buyer', why: '2 of 30 longyi sets arrived with loose threads', open: true, amt: 270000 }], ledger: [], events: [], q: [], offline: false, nextOrder: 1042, review: [] };
  s.orders.forEach(o => { if (o.stage >= 4) fundLedger(s, o, o.ts + 4 * H); if (o.rel.dep) postLedger(s, o, 'Escrow Vault', 'Vendor Payable', Math.round(o.calc.artisan / 2), 'Deposit 50% · stage 11', o.ts + 11 * H); if (o.rel.bal) postLedger(s, o, 'Escrow Vault', 'Vendor Payable', Math.round(o.calc.artisan / 2), 'Balance 50% · stage 14', o.ts + 14 * H); });
  ev(s, 'sys', 'Marketplace seeded · 4 sample orders');
  return s;
}

/* ---------- state ---------- */
let S;
const PRODUCTS0 = JSON.stringify(PRODUCTS);
function defaultWh(v) {
  const w = (n, addr, city, contact, phone, hrs, i) => ({ id: v.id + '-W' + i, name: n, addr, city, contact, phone, hours: hrs, active: true });
  return v.id === 'V1' ? [w('Bagan Main Workshop', 'Myinkaba village road', 'Bagan', 'U Kyaw Zin', '+95 9 7xx xxx 442', '08:00–17:00', 1), w('Yangon Consolidation Depot', 'Hlaing Thar Yar Industrial Zone', 'Yangon', 'Daw Mya', '+95 9 7xx xxx 443', '09:00–18:00', 2)] : [w(v.city + ' warehouse', '', v.city, '', '', '09:00–17:00', 1)];
}
function syncProducts() {
  if (!S.products) S.products = JSON.parse(PRODUCTS0).map(p => ({ ...p, live: true }));
  PRODUCTS = S.products; VENDORS = S.vendors;
  VENDORS.forEach(v => { if (!v.wh) v.wh = defaultWh(v); if (v.addr === undefined) { v.addr = ''; v.phone = v.phone || ''; v.contact = v.contact || ''; } });
  PRODUCTS.forEach(p => { if (!p.wh) { const v = VENDORS.find(x => x.id === p.v); if (v) p.wh = (p.id === 'P8' && v.wh[1] ? v.wh[1] : v.wh[0]).id; } });
}
const vendorOf = id => VENDORS.find(v => v.id === id);
const whOf = p => { const v = vendorOf(p.v); return v && (v.wh.find(w => w.id === p.wh) || v.wh[0]); };
const whLabel = p => { const w = whOf(p); return w ? `${w.name} · ${w.city}` : '—'; };
const vname = () => (vendorOf(MYV) || { n: 'your business' }).n;
function load() { try { S = JSON.parse(localStorage.getItem('cc_state')); } catch (e) { } if (!S || S.v !== 1) S = seed(); syncProducts(); }
function save() { try { localStorage.setItem('cc_state', JSON.stringify(S)); } catch (e) { } idbPut(); }
function ev(s, k, m) {
  s.events.unshift({ ts: Date.now(), k, m }); s.events.length = Math.min(s.events.length, 80);
  const g = AL_GROUP[k];   /* every supplier / buyer / logistics action raises a colour-grouped alert for Admin */
  if (g && typeof S !== 'undefined' && S && s === S && S.role !== 'ADMIN' && !(g === 'system' && !/flagged|released/.test(m))) {
    const oid = (m.match(/O-\d+/) || [])[0], href = oid ? '#/order/' + oid : /product|live|offline/i.test(m) ? '#/a/products' : /supplier|warehouse/i.test(m) ? '#/a/vendors' : '#/a/orders';
    (s.alerts = s.alerts || []).unshift({ id: 'A' + Date.now() + Math.floor(Math.random() * 1e3), ts: Date.now(), group: g, title: alertTitle(g, m), msg: m, href, read: false, hot: /dispute|flagged|declined|failed/i.test(m) });
    s.alerts.length = Math.min(s.alerts.length, 120);
  }
}
const AL_GROUP = { vendor: 'supplier', 'vendor-3g': 'supplier', buyer: 'buyer', 'buyer-pod': 'buyer', '3pl': 'delivery', '3pl-pod': 'delivery', ocr: 'system', escrow: 'system' };
const AL_GRP = { supplier: ['Supplier', '#78350F', '#78350F'], buyer: ['Buyer', '#D4AF37', '#7a5b00'], delivery: ['Logistics', '#102A45', '#102A45'], system: ['System', '#0D5C4D', '#0D5C4D'] };
function alertTitle(g, m) {
  const T = [[/placed/i, 'New order placed'], [/dispute/i, 'Dispute opened'], [/flagged/i, 'Slip needs review'], [/released/i, 'Escrow released'], [/Added product/i, 'New product added'], [/Edited product/i, 'Product edited'], [/Deleted product/i, 'Product deleted'], [/live|offline/i, 'Product visibility changed'], [/supplier details/i, 'Supplier info updated'], [/warehouse/i, 'Warehouse updated'], [/MAWB/i, 'Cargo consolidated · MAWB created'], [/stage 12/i, 'Cargo picked up · in transit'], [/stage 13/i, 'Customs cleared'], [/stage 14|POD/i, 'Delivered · POD signed'], [/stage 11/i, 'Packed · ready for pickup'], [/stage 10/i, 'QR labels printed'], [/stage 8/i, 'Sent for quality check'], [/stage 7/i, 'Stock confirmed'], [/stage 6/i, 'Order accepted'], [/declined/i, 'Order declined'], [/consignment|pay-later|settled/i, 'Payment terms activity'], [/hold/i, 'Dispatch hold released']];
  const hit = T.find(([r]) => r.test(m)); return hit ? hit[1] : { supplier: 'Supplier update', buyer: 'Buyer activity', delivery: 'Logistics update', system: 'System alert' }[g];
}
function cyrb(str) { let h1 = 0xdeadbeef, h2 = 0x41c6ce57; for (let i = 0; i < str.length; i++) { const c = str.charCodeAt(i); h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677); } h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909); h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909); return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(14, '0'); }
function postLedger(s, o, dr, cr, mmk, memo, ts) {
  const prev = s.ledger.length ? s.ledger[0].hash : 'genesis';
  const e = { id: 'L-' + (1000 + s.ledger.length), ts: ts || Date.now(), order: o.id, dr, cr, mmk, memo, prev };
  e.hash = cyrb([e.id, e.order, e.dr, e.cr, e.mmk, e.memo, prev].join('|'));
  s.ledger.unshift(e);
}
function verifyLedger() { const L = [...S.ledger].reverse(); let prev = 'genesis'; for (const e of L) { if (e.prev !== prev || e.hash !== cyrb([e.id, e.order, e.dr, e.cr, e.mmk, e.memo, prev].join('|'))) return false; prev = e.hash; } return true; }

/* ---------- money ---------- */
const rate = c => S.fx.rates[c];
const toCur = (mmk, c) => mmk / S.fx.rates.MMK * S.fx.rates[c];
function fmt(c, n) { const d = c === 'MMK' ? 0 : c === 'USD' ? 2 : 0; return CUR[c].sym + Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }); }
const mmk = n => 'Ks ' + Math.round(n).toLocaleString('en-US');
function calc(items, cur, fx = S ? S.fx : SEED_FX) {
  let artisan = 0, kg = 0;
  items.forEach(i => { const p = PRODUCTS.find(x => x.id === i.p); artisan += p.unit * i.q; kg += p.kg * i.q; });
  const margin = artisan * fx.margin / 100, fxbuf = cur === 'MMK' ? 0 : (artisan + margin) * fx.spread / 100;
  const dest = CUR[cur].c, freightUSD = kg * fx.freight[dest], freight = freightUSD / 1 * fx.rates.MMK;
  const totalMMK = artisan + margin + fxbuf + freight;
  const k = fx.rates[cur] / fx.rates.MMK;
  return { artisan, margin, fxbuf, freight, kg, totalMMK, total: totalMMK * k, k };
}
const unitCur = (p, cur) => { const c = calc([{ p: p.id, q: 1 }], cur); return (c.artisan + c.margin + c.fxbuf) * c.k; };

/* ---------- art ---------- */
const PHOTOS = { P1: 1, P2: 1, P3: 1, P4: 1, P6: 1, P8: 1 };
function art(p) {
  if (p.img) return `<img src="${p.img}" alt="${esc(p.n)}" style="width:100%;height:100%;object-fit:cover;display:block">`;
  if (!PHOTOS[p.id]) return artSvg(p);
  return `<img src="images/${p.id}.jpg" alt="${esc(p.n)}" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;display:block" onerror="this.outerHTML=this.dataset.f" data-f="${esc(artSvg(p))}">`;
}
function artSvg(p) {
  const pal = { Lacquerware: ['#7a1f12', '#c8872e', '#1b0f0c'], Textiles: ['#1d6f78', '#e3b04b', '#0e3b46'], 'Tea & Coffee': ['#6b4226', '#a7c07a', '#2b1a0e'], 'Gems & Jewelry': ['#0d5c4d', '#8dd2bf', '#04261f'], Wellness: ['#c9a574', '#f3e3c3', '#6a4a20'] }[p.cat];
  const id = 'g' + p.id, n = +p.id.slice(1);
  let shape = '';
  if (p.cat === 'Lacquerware') shape = `<ellipse cx="200" cy="215" rx="95" ry="14" fill="#000" opacity=".25"/><path d="M110 150h180l-22 62q-68 18-136 0z" fill="${pal[0]}" stroke="${pal[1]}" stroke-width="3"/>${[0, 1, 2, 3, 4].map(i => `<path d="M${122 + i * 4} ${160 + i * 9}h${156 - i * 8}" stroke="${pal[1]}" stroke-width="1.5" opacity=".8"/>`).join('')}<ellipse cx="200" cy="150" rx="90" ry="16" fill="${pal[2]}" stroke="${pal[1]}" stroke-width="3"/>`;
  else if (p.cat === 'Textiles') shape = Array.from({ length: 9 }, (_, i) => `<path d="M${70 + i * 32} 40q${i % 2 ? 22 : -22} 90 0 180" stroke="${i % 3 ? pal[1] : '#fff'}" stroke-width="${10 - (i % 3) * 2}" fill="none" opacity="${0.55 + (i % 3) * .15}"/>`).join('');
  else if (p.cat === 'Tea & Coffee') shape = Array.from({ length: 34 }, (_, i) => { const x = 60 + (i * 53 + n * 17) % 280, y = 50 + (i * 37 + n * 11) % 160; return `<ellipse cx="${x}" cy="${y}" rx="11" ry="7" transform="rotate(${i * 37} ${x} ${y})" fill="${i % 4 ? pal[0] : pal[1]}"/><path d="M${x - 8} ${y}h16" stroke="${pal[2]}" stroke-width="1.2" transform="rotate(${i * 37} ${x} ${y})"/>`; }).join('');
  else if (p.cat === 'Gems & Jewelry') shape = `<path d="M200 70l60 40-60 100-60-100z" fill="${pal[1]}" stroke="#fff" stroke-width="2" opacity=".95"/><path d="M140 110h120M200 70l-24 40 24 100 24-100z" stroke="${pal[0]}" stroke-width="2" fill="none"/><circle cx="200" cy="62" r="7" fill="none" stroke="${'#D4AF37'}" stroke-width="3"/>`;
  else shape = `<rect x="110" y="130" width="180" height="70" rx="6" fill="${pal[2]}"/><rect x="120" y="106" width="160" height="30" rx="4" fill="${pal[1]}" stroke="${pal[2]}" stroke-width="2"/><circle cx="200" cy="165" r="14" fill="${pal[1]}"/>`;
  return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(p.n)}"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${pal[0]}" stop-opacity=".55"/><stop offset="1" stop-color="${pal[2]}"/></linearGradient><pattern id="${id}p" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M13 0l13 13-13 13L0 13z" fill="none" stroke="#fff" stroke-opacity=".07"/></pattern></defs><rect width="400" height="300" fill="url(#${id})"/><rect width="400" height="300" fill="url(#${id}p)"/>${shape}</svg>`;
}
function qrSvg(seedStr, size = 176) {
  const N = 25; let h = cyrb(seedStr), bits = ''; for (let i = 0; i < 80; i++) bits += cyrb(h + i); let cells = '';
  const fin = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#102A45"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#102A45"/>`;
  for (let y = 0; y < N; y++)for (let x = 0; x < N; x++) { if ((x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9)) continue; if (parseInt(bits[(y * N + x) % bits.length], 16) % 2) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`; }
  return `<svg class="qr" viewBox="0 0 ${N} ${N}" shape-rendering="crispEdges" role="img" aria-label="QR code"><g fill="#102A45">${cells}</g>${fin(0, 0)}${fin(N - 7, 0)}${fin(0, N - 7)}</svg>`;
}

/* ---------- helpers ---------- */
const prod = id => PRODUCTS.find(p => p.id === id);
const MYV = 'V1';   /* the signed-in demo supplier's vendor id */
const liveP = () => PRODUCTS.filter(p => p.live && !p.del);
const mineP = vid => PRODUCTS.filter(p => !p.del && (!vid || p.v === vid));
const ord = id => S.orders.find(o => o.id === id);
function stageChip(o) {
  if (o.status === 'declined') return '<span class="chip bad">Declined · refunded</span>';
  if (o.status === 'review') return '<span class="chip warn pulse">Slip in manual review</span>';
  if (o.status === 'dispute') return '<span class="chip bad">Disputed</span>';
  const st = o.stage; const cls = st >= 14 ? '' : st >= 11 ? 'warn pulse' : st >= 4 ? 'ai' : 'warn';
  return `<span class="chip ${cls}">Stage ${st} · ${STAGES[st - 1]}</span>`;
}
const stageBar = o => `<div class="stages" title="Stage ${o.stage} of 14">${STAGES.map((_, i) => `<i class="${i + 1 < o.stage ? 'on' : i + 1 === o.stage ? 'cur' : ''}"></i>`).join('')}</div>`;
function advance(o, stage, who) {
  o.stage = stage; o.ms.push({ s: stage, ts: Date.now() });
  ev(S, who, `${o.id} → stage ${stage} · ${STAGES[stage - 1]}`);
  if (stage === 11 && !o.rel.dep) { o.rel.dep = true; const a = Math.round(o.calc.artisan / 2); postLedger(S, o, 'Escrow Vault', 'Vendor Payable', a, 'Deposit 50% · stage 11'); ev(S, 'escrow', `${o.id} deposit ${mmk(a)} released to vendor`); }
  if (stage === 14 && o.cons && !o.cons.start) { o.cons.start = Date.now(); o.cons.due = o.cons.start + o.cons.term * 24 * H; ev(S, 'buyer', `${o.id} consignment term started · ${o.cons.term} days`); }
  if (stage === 14 && o.later && !o.later.due) { o.later.due = Date.now() + o.later.days * 24 * H; ev(S, 'buyer', `${o.id} pay-later clock started · due in ${o.later.days} days`); }
  if (stage === 14 && !o.rel.bal) { o.rel.bal = true; const a = Math.round(o.calc.artisan / 2); postLedger(S, o, 'Escrow Vault', 'Vendor Payable', a, 'Balance 50% · stage 14'); ev(S, 'escrow', `${o.id} balance ${mmk(a)} released instantly`); }
  save();
}
function toast(m) { const d = document.createElement('div'); d.className = 'toast'; d.textContent = m; document.body.appendChild(d); setTimeout(() => d.remove(), 2600); }
function sheet(html, kind = 'bottom') { $('#layer').innerHTML = `<div class="scrim" data-act="close"></div><div class="sheet ${kind}" role="dialog" aria-modal="true">${html}</div>`; localizeMm($('#layer')); }
const closeSheet = () => { $('#layer').innerHTML = ''; };
const ago = ts => { const m = Math.round((Date.now() - ts) / 6e4); return m < 1 ? 'just now' : m < 60 ? m + ' min ago' : m < 2880 ? Math.round(m / 60) + ' h ago' : Math.round(m / 1440) + ' d ago'; };
const dt = ts => new Date(ts).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
const cdown = ms => { if (ms <= 0) return 'Closed'; const h = Math.floor(ms / H), m = Math.floor(ms % H / 6e4); return h >= 48 ? Math.floor(h / 24) + 'd ' + h % 24 + 'h' : `${h}h ${String(m).padStart(2, '0')}m`; };
const cutTs = p => NOW0 - (NOW0 % 1) + p.cut * H;
const kpi = (l, v, s = '') => `<div class="card kpi"><small>${l}</small><b class="num">${v}</b><span>${s}</span></div>`;

/* ---------- IndexedDB cache (supplier offline resilience) ---------- */
let idb;
function idbOpen() { try { const r = indexedDB.open('cc', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => { idb = r.result; idbPut(); }; } catch (e) { } }
function idbPut() { if (!idb) return; try { idb.transaction('kv', 'readwrite').objectStore('kv').put({ orders: S.orders, ts: Date.now() }, 'orders'); } catch (e) { } }

/* ---------- views ---------- */
const V = {};

V.login = () => {
  document.body.className = 'nologin';
  return `<div class="login">
  <div class="logo"><svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="16" fill="#E7EEFF"/><path d="M32 32c-5-9-17-9-17 0s12 9 17 0 12-9 17 0-12 9-17 0z" fill="none" stroke="#0D5C4D" stroke-width="5" stroke-linecap="round"/><circle cx="32" cy="32" r="3" fill="#D9822B"/></svg>
  <h1>Infinity Plus <span>B2B</span></h1><div class="by">BY CINDY</div>
  <p class="muted" style="margin-top:10px">Cindy's Choices · Myanmar ⇄ Thailand &amp; Taiwan artisan trade, with 100% escrow protection.</p></div>
  <div class="eyebrow" style="margin:26px 0 0">Instant demo switcher · sandbox</div>
  ${Object.entries(ROLES).map(([k, r]) => `<button class="persona" style="--c:${r.color}" data-act="login" data-role="${k}"><span class="chip ${k === 'ADMIN' ? '' : k === 'SUPPLIER' ? 'warn' : 'gray'}">${BANNER[k]}</span><b>${r.name}</b> <span class="muted">· ${r.nm}</span><p>${r.user}</p><p>${r.desc}</p></button>`).join('')}
  <div class="card" style="margin-top:16px"><div class="eyebrow">Phone / biometric sign-in</div>
   <label class="f" for="ph">Phone number</label><input id="ph" class="inp" inputmode="tel" placeholder="+95 9 …  /  +66 …  /  +886 …">
   <button class="btn" style="width:100%;margin-top:12px" data-act="phone">${ic('out')} ${t('signin')}</button>
   <p class="small muted" style="margin-top:8px">Demo: any number maps to the Retailer persona; or pick a persona above. No real credentials are collected.</p></div>
  <div class="trust"><div><b>MMK · THB · TWD</b>Direct escrow</div><div><b>Slip OCR</b>≥92% auto-verify</div><div><b>Mae Sot + Air</b>Consolidated cargo</div></div>
  <div class="langs" role="group" aria-label="Language">${[['mm', 'မြန်မာ'], ['en', 'English'], ['th', 'ไทย']].map(([k, n]) => `<button class="${S.lang === k ? 'on' : ''}" data-act="lang" data-v="${k}">${n}</button>`).join('')}</div>
  <p class="center small muted" style="text-align:center;margin-top:14px"><a href="#/lab">Open test &amp; role-simulation lab</a></p></div>`;
};

/* ----- Buyer ----- */
let CAT = 'All', Q = '';
V.catalog = () => {
  const list = liveP().filter(p => (CAT === 'All' || p.cat === CAT) && (!Q || (p.n + (p.mm || '') + p.v + p.from).toLowerCase().includes(Q.toLowerCase())));
  const hero = liveP()[0];
  return `${hero ? `<div class="hero"><span class="chip">${ic('spark')} Active export lot · cutoff <span data-cut="${hero.id}">${cdown(cutTs(hero) - Date.now())}</span></span>
   <h1>${hero.id === 'P1' ? 'Inle Lotus Silk &amp; Bagan Royal Lacquer' : 'Burmese craft, export-ready'}</h1><p style="opacity:.85">Customs-cleared, export-certified Burmese craft. Reserve a share of the next consolidated dispatch to Bangkok &amp; Taipei.</p>
   <a class="btn acc" style="margin-top:14px" href="#/product/${hero.id}">Next →</a></div>` : ''}
   <div class="row"><input class="inp" id="q" placeholder="${t('search')}" value="${esc(Q)}" aria-label="Search"><select class="sel sm" data-act="cur" aria-label="Currency">${Object.keys(CUR).map(c => `<option ${S.cur === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
   <div class="pills">${['All', ...CATS].map(c => `<button class="${CAT === c ? 'on' : ''}" data-act="cat" data-v="${c}">${c === 'All' ? t('all') : c}</button>`).join('')}</div>
   <div class="grid g2">${list.map(p => card(p)).join('') || '<div class="empty">No batches match.</div>'}</div>`;
};
function card(p) {
  const pct = Math.round(p.res / p.quota * 100), hot = pct >= 85;
  return `<a class="card pcard hv" href="#/product/${p.id}"><div class="art">${art(p)}<span class="chip tag ${hot ? 'warn' : 'ai'}">${hot ? pct + '% allocated' : p.tag}</span></div>
  <div class="body"><div class="small muted">${VENDORS.find(v => v.id === p.v).n} · ${p.from}</div><h3 style="font-size:15px">${S.lang === 'mm' ? (p.mm || p.n) : p.n}</h3>
  <div><div class="bar ${hot ? 'hot' : ''}"><i style="width:${pct}%"></i></div><div class="row small muted" style="margin-top:4px"><span>${p.res}/${p.quota} units reserved</span><span class="sp"></span><span class="cut" data-cut="${p.id}">${cdown(cutTs(p) - Date.now())}</span></div></div>
  <div class="row"><div class="price num">${fmt(S.cur, unitCur(p, S.cur))}<small class="muted" style="font:500 11px var(--f-body)"> /unit</small></div><span class="sp"></span><span class="chip gray">MOQ ${p.moq}</span></div></div></a>`;
}
V.product = id => {
  const p = prod(id); if (!p || p.del || !p.live) return `<a href="#/catalog" class="small">← ${t('catalog')}</a><div class="empty card" style="margin-top:12px"><h3>This batch is not available right now</h3><p class="muted">The supplier has paused it. Please check the catalog for other batches.</p></div>`;
  const pct = Math.round(p.res / p.quota * 100), left = p.quota - p.res, inCart = S.cart.find(c => c.p === id);
  return `<a href="#/catalog" class="small">← ${t('catalog')}</a>
  <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr))">
  <div class="card" style="padding:0;overflow:hidden"><div class="art" style="border-radius:0">${art(p)}</div></div>
  <div class="card"><span class="chip ai">${ic('spark')} ${p.tag}</span><h1 class="disp" style="margin:10px 0 4px">${p.n}</h1><p class="muted">${p.mm}</p><p style="margin-top:8px">${p.note}. Origin: ${p.from}. Supplier: ${VENDORS.find(v => v.id === p.v).n}.</p><p class="small muted">${ic('pin')} Dispatched from ${esc(whLabel(p))}</p>
   <div style="margin-top:14px"><div class="row small"><b>Batch quota</b><span class="sp"></span><span class="num">${p.res}/${p.quota}</span></div><div class="bar ${pct >= 85 ? 'hot' : ''}" style="margin-top:6px"><i style="width:${pct}%"></i></div>
   <div class="row small muted" style="margin-top:6px"><span>${left} units left · MOQ ${p.moq}</span><span class="sp"></span><span class="cut">${ic('clock')} Dispatch cutoff <b data-cut="${p.id}">${cdown(cutTs(p) - Date.now())}</b></span></div></div>
   <div class="row" style="margin-top:16px"><div><div class="eyebrow">Wholesale / unit</div><div class="price num" style="font:700 26px var(--f-ui)">${fmt(S.cur, unitCur(p, S.cur))}</div><div class="small muted num">${mmk(p.unit)} artisan cost</div></div><span class="sp"></span><select class="sel sm" data-act="cur" aria-label="Currency">${Object.keys(CUR).map(c => `<option ${S.cur === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
   <label class="f" for="qty">Quantity (min ${p.moq}, max ${left})</label>
   <div class="row"><input id="qty" class="inp num" type="number" min="${p.moq}" max="${left}" step="1" value="${inCart ? inCart.q : p.moq}"><button class="btn sec" data-act="breakdown" data-id="${p.id}">Cost breakdown</button></div>
   <button class="btn acc xl" style="margin-top:14px" data-act="reserve" data-id="${p.id}">${ic('cart')} Next →</button></div></div>`;
};
function breakdownHtml(items, cur, title) {
  const c = calc(items, cur), k = c.k, f = n => fmt(cur, n * k);
  return `<h3>${title}</h3><p class="small muted">Transparent landed cost in ${cur} · FX 1 USD = ${rate(cur).toLocaleString()} ${cur}</p><ul class="bd" style="margin-top:8px">
  <li><span>Raw artisan cost<small>Fixed MMK price locked for vendor</small></span><b class="num">${f(c.artisan)}</b></li>
  <li><span>Platform margin (${S.fx.margin}%)<small>Infinity Plus quality &amp; curation</small></span><b class="num">${f(c.margin)}</b></li>
  <li><span>Hedged FX buffer (${cur === 'MMK' ? '0' : S.fx.spread}%)<small>Volatility protection MMK↔${cur}</small></span><b class="num">${f(c.fxbuf)}</b></li>
  <li><span>Allocated freight<small>${c.kg.toFixed(1)} kg · ${CUR[cur].c === 'TW' ? 'air to Taipei' : 'land via Mae Sot / air BKK'}</small></span><b class="num">${f(c.freight)}</b></li>
  <li class="tot"><span>Total landed</span><b class="num">${fmt(cur, c.total)}</b></li></ul>`;
}
V.cart = () => {
  if (!S.cart.length) return `<div class="empty card">${ic('cart')}<h3 style="margin-top:8px">No batches reserved yet</h3><p>Pick a batch from the catalog and meet its MOQ.</p><a class="btn" style="margin-top:12px" href="#/catalog">Browse catalog</a></div>`;
  const cur = S.cur, c = calc(S.cart, cur), bad = S.cart.some(i => i.q < prod(i.p).moq || !prod(i.p).live || prod(i.p).del), d = consDraft(), ct = (sanitizeDraft(d), d.on ? consTerms(S.cart, cur, d) : null), lt = d.later ? laterTerms(S.cart, cur, d.later) : null;
  return `<div class="title-row"><h1>Batch pre-order</h1><span class="sp"></span><select class="sel sm" data-act="cur">${Object.keys(CUR).map(x => `<option ${cur === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
  <div class="card scroll"><table class="tbl"><thead><tr><th>Batch</th><th class="r">Qty</th><th class="r">Subtotal</th><th></th></tr></thead><tbody>${S.cart.map(i => { const p = prod(i.p); return `<tr><td><b>${p.n}</b><div class="small muted">MOQ ${p.moq} ${i.q < p.moq ? '<span class="chip bad">below MOQ</span>' : ''}${!p.live || p.del ? '<span class="chip bad">no longer available</span>' : ''}</div></td><td class="r num">${i.q}</td><td class="r num">${fmt(cur, unitCur(p, cur) * i.q)}</td><td class="r"><button class="btn sec sm" data-act="rm" data-id="${i.p}" aria-label="Remove">${ic('x')}</button></td></tr>`; }).join('')}</tbody></table></div>
  <div class="card">${breakdownHtml(S.cart, cur, 'Landed cost')}</div>
  ${consPanel(d)}
  ${d.on ? `<div class="escrow"><div class="eyebrow" style="color:#9fb4c9">Consignment · pay as you sell</div><div class="big num">${fmt(cur, toCur(ct.depMMK, cur))}</div><div class="small" style="opacity:.8">${d.dep ? `${d.dep}% deposit due now` : 'Nothing to pay now'} · goods value ${fmt(cur, toCur(ct.grossMMK, cur))} incl. ${ct.feePct}% consignment fee</div>
  <div class="split"><div>Vendor paid<b>→ Stages 11 &amp; 14</b>Platform advances the balance</div><div>${CONS_L.settle[d.settle]}<b>${d.term} days</b>Unsold: ${CONS_L.unsold[d.unsold].toLowerCase()}</div></div></div>`
  : lt ? `<div class="escrow"><div class="eyebrow" style="color:#9fb4c9">Pay later</div><div class="big num">${fmt(cur, 0)}</div><div class="small" style="opacity:.8">due now · ${fmt(cur, toCur(lt.grossMMK, cur))} payable within ${d.later} days of delivery (incl. ${lt.feePct}% fee)</div>
  <div class="split"><div>Vendor paid<b>→ Stages 11 &amp; 14</b>Platform advances the full amount</div><div>You pay<b>${d.later} days</b>After POD signature</div></div></div>`
  : `<div class="escrow"><div class="eyebrow" style="color:#9fb4c9">100% smart escrow</div><div class="big num">${fmt(cur, c.total)}</div><div class="small" style="opacity:.8">≈ ${mmk(c.totalMMK)} · pay via ${CUR[cur].rail}</div>
  <div class="split"><div>50% deposit<b>→ Stage 11</b>Packed &amp; ready for pickup</div><div>50% balance<b>→ Stage 14</b>Buyer POD signature</div></div></div>`}
  <button class="btn acc xl" data-act="pay" ${bad ? 'disabled' : ''}>${d.on ? (d.dep ? 'Pay deposit' : 'Place consignment order') : d.later ? 'Place pay-later order' : t('pay')} →</button>`;
};
const consOpt = (k, arr, cur) => `<div class="pills">${arr.map(([v, l]) => `<button class="${String(cur) === String(v) ? 'on' : ''}" data-act="cons" data-k="${k}" data-v="${v}">${l}</button>`).join('')}</div>`;
const consDraft = () => S.cons || (S.cons = { on: false, dep: 25, term: 60, settle: 'sold', unsold: 'return' });
const payAmt = cur => { const d = S.cons; if (d && d.later) return 0; return d && d.on ? toCur(consTerms(S.cart, cur, d).depMMK, cur) : calc(S.cart, cur).total; };
function consPanel(d) {
  const O = opts(), pm = d.on ? 'cons' : d.later ? 'later' : 'prepaid';
  const pms = [['prepaid', 'Standard · prepaid'], ...(O.cons.on ? [['cons', 'Consignment']] : []), ...(O.later.on ? [['later', 'Pay later']] : [])];
  return `<div class="card"><h3>Payment</h3><div class="seg" role="tablist" style="margin:8px 0">${pms.map(([k, n]) => `<button class="${pm === k ? 'on' : ''}" data-act="cons" data-k="pm" data-v="${k}">${n}</button>`).join('')}</div>
  ${d.on ? `<h3 style="margin-top:14px">Consignment terms</h3><p class="small muted">Take the goods now and pay as they sell. These terms are set in advance by the platform and can't be changed here.</p>
  <ul class="bd" style="margin-top:6px"><li><span>Upfront deposit</span><b class="num">${O.cons.dep ? O.cons.dep + '%' : 'None'}</b></li><li><span>Consignment term</span><b>${O.cons.term} days</b></li><li><span>Settlement</span><b>${CONS_L.settle[O.cons.settle]}</b></li><li><span>Unsold goods</span><b>${CONS_L.unsold[O.cons.unsold]}</b></li><li><span>Consignment fee</span><b class="num">${consFee(O.cons.dep)}%</b></li></ul>`
    : d.later ? `<h3 style="margin-top:14px">Pay later terms</h3><p class="small muted">Nothing to pay now. Settle after you sign for delivery.</p>
  <label class="f">Pay within</label>${consOpt('later', O.later.days.map(x => [x, x + ' days after delivery · +' + (O.later.fee[x] ?? 3) + '%']), d.later)}`
    : '<p class="small muted">Full payment into escrow now. Prefer to pay as you sell, or after delivery? Choose Consignment or Pay later.</p>'}
  ${O.defer.on ? `<h3 style="margin-top:16px">Delivery</h3><div class="seg" role="tablist" style="margin:8px 0"><button class="${d.defer ? '' : 'on'}" data-act="cons" data-k="defer" data-v="0">Dispatch when ready</button><button class="${d.defer ? 'on' : ''}" data-act="cons" data-k="defer" data-v="${d.defer || O.defer.days[0]}">Deliver later</button></div>${d.defer ? `<p class="small muted">Goods are packed and held at Yangon Hub, then dispatched on your date.</p><label class="f">Dispatch in</label>${consOpt('defer', O.defer.days.map(x => [x, x + ' days']), d.defer)}` : ''}` : ''}</div>`;
}
function sanitizeDraft(d) {
  const O = opts();
  if (d.on && (!O.cons.on)) d.on = false;
  if (d.later && !O.later.on) d.later = 0;
  if (d.defer && !O.defer.on) d.defer = 0;
  if (d.on) Object.assign(d, { dep: O.cons.dep, term: O.cons.term, settle: O.cons.settle, unsold: O.cons.unsold });   /* terms are admin-set, never buyer-chosen */
  if (d.later && !O.later.days.includes(d.later)) d.later = O.later.days[0];
  if (d.defer && !O.defer.days.includes(d.defer)) d.defer = O.defer.days[0];
}
function payScreen() {
  const cur = S.cur, c = { total: payAmt(cur) }, ref = 'CC-' + S.nextOrder;
  const p = S.pay || (S.pay = { step: 'qr', file: null });
  sheet(`<h3>Pay ${fmt(cur, c.total)} · ${CUR[cur].rail}</h3><p class="small muted">Funds sit in the escrow vault until delivery milestones are met.</p>
  <div class="row wrap" style="margin-top:12px;align-items:flex-start">${qrSvg(ref + cur + Math.round(c.total))}<div class="small"><div class="eyebrow">Reference</div><b class="mono" style="font-size:13px">${ref}</b><div class="eyebrow" style="margin-top:8px">Beneficiary</div><b>Infinity Plus Escrow · CC Trade Ltd.</b><div class="eyebrow" style="margin-top:8px">Amount</div><b class="num">${fmt(cur, c.total)}</b></div></div>
  <div class="drop ${p.ocr ? 'ok' : ''}" style="margin-top:14px" id="drop">${p.ocr ? `<b>${ic('check')} Slip read by Vision AI</b><dl class="ocr" style="text-align:left;margin-top:10px"><dt>Reference</dt><dd class="mono">${p.ocr.ref}</dd><dt>Amount</dt><dd class="num">${fmt(cur, p.ocr.amt)}</dd><dt>Timestamp</dt><dd>${dt(p.ocr.ts)}</dd><dt>Confidence</dt><dd class="${p.ocr.conf >= 92 ? '' : 'cut'}">${p.ocr.conf.toFixed(1)}% ${p.ocr.conf >= 92 ? '· auto-verified' : '· below 92% → human review'}</dd></dl>` : p.busy ? `<div class="bar"><i style="width:${p.busy}%"></i></div><p class="small muted" style="margin-top:8px">Extracting reference, amount &amp; timestamp…</p>` : `${ic('upload')}<p><b>Upload transfer slip</b></p><p class="small muted">PNG/JPG screenshot from your banking app</p><input type="file" accept="image/*" id="slip" style="margin-top:8px" aria-label="Slip image"><p class="small muted" style="margin-top:8px">No slip handy? <button class="btn sec sm" data-act="sample" data-v="1">Use sample slip</button> <button class="btn sec sm" data-act="sample" data-v="0">Sample blurry slip</button></p>`}</div>
  <div class="row" style="margin-top:14px"><button class="btn sec" data-act="close">Cancel</button><span class="sp"></span><button class="btn" data-act="place" ${p.ocr ? '' : 'disabled'}>${p.ocr && p.ocr.conf < 92 ? 'Submit for review' : 'Fund escrow'}</button></div>`);
}
function runOcr(name, size, good) {
  const p = S.pay; p.busy = 8; payScreen();
  const total = payAmt(S.cur), seedv = cyrb(name + size);
  const t0 = setInterval(() => { p.busy += 23; if (p.busy >= 100) { clearInterval(t0); p.busy = 0; const conf = good ? 95 + (parseInt(seedv.slice(0, 2), 16) % 40) / 10 : 78 + (parseInt(seedv.slice(0, 2), 16) % 90) / 10; p.ocr = { ref: (S.cur === 'THB' ? 'PP' : S.cur === 'TWD' ? 'TW' : 'TX') + String(parseInt(seedv.slice(2, 10), 16)).slice(0, 10), amt: total, ts: Date.now() - 36e4, conf }; ev(S, 'ocr', `Slip OCR · ${p.ocr.ref} · ${conf.toFixed(1)}% confidence`); }; if ($('#drop')) payScreen(); }, 380);
}
function placeOrder() {
  const p = S.pay, cur = S.cur, o = { id: 'O-' + S.nextOrder++, ts: Date.now(), buyer: ROLES.BUYER.user.split(' · ')[0], cur, rail: CUR[cur].rail, items: S.cart.map(x => ({ ...x })), stage: 2, status: 'ok', slip: { ref: p.ocr.ref, conf: p.ocr.conf, ts: p.ocr.ts, ok: p.ocr.conf >= 92 }, rel: { dep: false, bal: false }, ms: [] };
  o.calc = calc(o.items, cur); o.ms.push({ s: 1, ts: o.ts }, { s: 2, ts: o.ts });
  const d = S.cons; if (d) sanitizeDraft(d);
  if (d && d.on) { const t = consTerms(o.items, cur, d); o.cons = { dep: d.dep, term: d.term, settle: d.settle, unsold: d.unsold, feePct: t.feePct, grossMMK: Math.round(t.grossMMK), depMMK: t.depMMK, sold: {}, paid: 0, disc: 0, ext: 0, start: null, due: null, closed: false }; d.on = false; }
  if (d && d.later) { const t = laterTerms(o.items, cur, d.later); o.later = { days: d.later, feePct: t.feePct, grossMMK: Math.round(t.grossMMK), depMMK: 0, due: null, paid: false }; d.later = 0; }
  if (d && d.defer) { o.defer = { days: d.defer, until: Date.now() + d.defer * 24 * H, released: false }; d.defer = 0; }
  S.cart.forEach(i => { prod(i.p).res = Math.min(prod(i.p).quota, prod(i.p).res + i.q); });
  S.orders.unshift(o); S.cart = []; S.pay = null; ev(S, 'buyer', `${o.id} placed · ${fmt(cur, o.calc.total)} via ${o.rail}`);
  if (p.ocr.conf >= 92) { verifySlip(o, 'auto'); } else { o.status = 'review'; S.review.push(o.id); ev(S, 'ocr', `${o.id} flagged for manual slip review`); }
  save(); closeSheet(); location.hash = '#/order/' + o.id; toast(o.status === 'review' ? 'Slip sent to admin review' : 'Escrow funded · vendor notified');
}
function verifySlip(o, by) { o.status = 'ok'; advance(o, 3, by === 'auto' ? 'ocr' : 'admin'); fundLedger(S, o); advance(o, 4, 'escrow'); advance(o, 5, 'sys'); S.review = S.review.filter(x => x !== o.id); }

function orderCard(o, link = true) {
  const items = o.items.map(i => `${prod(i.p).n} × ${i.q}`).join(' · ');
  return `<a class="card hv" style="display:block;text-decoration:none;color:inherit" href="#/order/${o.id}"><div class="row wrap"><b class="mono" style="font-size:13px">${o.id}</b><span class="small muted">${ago(o.ts)}</span>${tagChips(o)}<span class="sp"></span>${stageChip(o)}</div><p style="margin:6px 0 10px" class="small">${items}</p>${stageBar(o)}<div class="row small" style="margin-top:8px"><b class="num">${fmt(o.cur, o.calc.total)}</b><span class="sp"></span><span class="muted">${o.rail}</span></div></a>`;
}
let OTAB = 'active';
V.orders = () => {
  const f = { active: o => o.stage < 14 && o.status !== 'declined', delivered: o => o.stage === 14, review: o => o.status === 'review' || o.status === 'dispute' || o.status === 'declined' };
  const list = S.orders.filter(f[OTAB]);
  return `<h1>${t('orders')}</h1><div class="seg" role="tablist">${[['active', 'Active'], ['delivered', 'Delivered'], ['review', 'Attention']].map(([k, n]) => `<button class="${OTAB === k ? 'on' : ''}" data-act="otab" data-v="${k}">${n} (${S.orders.filter(f[k]).length})</button>`).join('')}</div>
  <div class="grid g2">${list.map(o => orderCard(o)).join('') || '<div class="empty card">Nothing here.</div>'}</div>`;
};
V.order = id => {
  const o = ord(id); if (!o) return '<div class="empty">Order not found</div>';
  const held = o.stage >= 4 && o.status !== 'declined', depAmt = o.calc.total / 2;
  const adm = S.role === 'ADMIN', back = adm ? ['#/a/overview', 'Overview'] : ['#/orders', t('orders')];
  const vendors = [...new Set(o.items.map(i => VENDORS.find(v => v.id === prod(i.p).v).n))];
  const adminPanel = adm ? `<div class="card"><h3>Admin · process status</h3><div class="kpis" style="margin-top:8px">${kpi('Current stage', o.stage + ' / 14', STAGES[o.stage - 1])}${kpi('Buyer', esc(o.buyer), o.rail)}${kpi('Vendor', vendors.length > 1 ? vendors.length + ' vendors' : esc(vendors[0]), vendors.join(' · '))}${kpi('Escrow', (o.rel.dep ? (o.rel.bal ? '100%' : '50%') : '0%') + ' released', 'to vendor payable')}</div>
   <div class="row wrap" style="margin-top:12px">${o.status === 'review' ? `<button class="btn" data-act="a-verify" data-id="${o.id}">Verify slip</button><button class="btn bad" data-act="a-reject" data-id="${o.id}">Reject</button>` : ''}${o.stage === 8 && o.status === 'ok' ? `<button class="btn" data-act="a-qc" data-v="pass" data-id="${o.id}">Pass quality check</button><button class="btn bad" data-act="a-qc" data-v="fail" data-id="${o.id}">Fail · return to vendor</button>` : ''}${o.stage >= 11 && o.stage < 14 && o.status === 'ok' ? `<button class="btn sec" data-act="a-force" data-id="${o.id}">Force release balance</button>` : ''}</div>
   <h3 style="margin-top:16px">Ledger entries</h3><ul class="bd">${S.ledger.filter(e => e.order === o.id).map(e => `<li><span>${e.memo}<small>${e.dr} → ${e.cr} · ${dt(e.ts)}</small></span><b class="num">${mmk(e.mmk)}</b></li>`).join('') || '<li class="muted">No ledger entries</li>'}</ul></div>` : '';
  const shipCard = o.ship ? `<div class="card"><h3>Shipment · ${o.ship.mawb}</h3><p class="small muted">${o.ship.mode} · ${o.ship.gross} kg gross · ${o.ship.vol} kg vol</p><div style="margin-top:10px">${shipTimeline(o)}</div></div>` : '';
  return `<a href="${back[0]}" class="small">← ${back[1]}</a><div class="row wrap"><h1 class="mono" style="font-size:22px">${o.id}</h1>${tagChips(o)}${stageChip(o)}</div>${adminPanel}${o.cons ? consCard(o) : ''}${o.later ? laterCard(o) : ''}${o.defer ? deferCard(o) : ''}${shipCard}
  <div class="escrow"><div class="eyebrow" style="color:#9fb4c9">Escrow vault</div><div class="big num">${fmt(o.cur, o.calc.total)}</div><div class="small" style="opacity:.8">${held ? 'Held in smart escrow · ' + o.rail : o.status === 'declined' ? 'Refunded to buyer' : 'Awaiting payment verification'}</div>
   <div class="split"><div class="${o.rel.dep ? 'rel' : ''}">50% deposit${o.rel.dep ? ' · released' : ''}<b class="num">${fmt(o.cur, depAmt)}</b>at Stage 11</div><div class="${o.rel.bal ? 'rel' : ''}">50% balance${o.rel.bal ? ' · released' : ''}<b class="num">${fmt(o.cur, depAmt)}</b>at Stage 14 POD</div></div></div>
  <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr))"><div class="card"><h3>Items</h3><ul class="bd">${o.items.map(i => `<li><span>${prod(i.p).n}<small>${i.q} units · from ${esc(whLabel(prod(i.p)))}</small></span><b class="num">${fmt(o.cur, unitCur(prod(i.p), o.cur) * i.q)}</b></li>`).join('')}</ul><button class="btn sec sm" data-act="obd" data-id="${o.id}">Cost breakdown</button>
   <h3 style="margin-top:18px">Payment slip</h3><dl class="ocr"><dt>Reference</dt><dd class="mono">${o.slip.ref}</dd><dt>OCR confidence</dt><dd>${o.slip.conf.toFixed(1)}%</dd><dt>Captured</dt><dd>${dt(o.slip.ts)}</dd></dl></div>
  <div class="card"><h3>Order journey · 14 stages</h3><ol class="tl" style="margin-top:12px">${STAGES.map((n, i) => { const s = i + 1, m = o.ms.find(x => x.s === s), cls = s < o.stage || (s === o.stage && s === 14) ? 'done' : s === o.stage ? 'cur' : ''; return `<li class="${cls}"><span class="d">${cls === 'done' ? ic('check') : ''}</span><b>${n}</b><span>${m ? dt(m.ts) : ''}${s === 11 ? ' · releases 50% deposit' : s === 14 ? ' · releases 50% balance' : ''}</span></li>`; }).join('')}</ol></div></div>
  ${o.stage === 13 && S.role === 'BUYER' ? `<button class="btn xl" data-act="pod" data-id="${o.id}">${ic('pen')} Confirm delivery &amp; sign POD</button>` : ''}
  ${S.role === 'BUYER' && o.stage >= 5 && o.stage < 14 && o.status === 'ok' ? `<button class="btn bad" data-act="dispute" data-id="${o.id}">Raise a dispute</button>` : ''}`;
};
function consSettle(o, why, close) {
  const c = o.cons; let st = consStatus(o);
  if (st.due > 0) { postLedger(S, o, 'Buyer Funds', 'Platform Float', st.due, 'Consignment settlement · ' + why); c.paid += st.due; ev(S, 'buyer', `${o.id} consignment settled ${mmk(st.due)}`); }
  st = consStatus(o);
  if (close || st.left === 0) {
    if (st.over > 0) { postLedger(S, o, 'Platform Float', 'Buyer Funds', st.over, 'Consignment deposit refund'); c.paid -= st.over; }
    c.closed = true; ev(S, 'buyer', `${o.id} consignment closed`);
  }
  save(); toast(c.closed ? 'Consignment closed' : st.due > 0 ? 'Settlement recorded' : 'Sales recorded');
}
function consCard(o) {
  const c = o.cons, st = consStatus(o), cur = o.cur, f = n => fmt(cur, toCur(n, cur)), buyer = S.role === 'BUYER', live = o.stage >= 14 && !c.closed;
  const left = c.due ? Math.ceil((c.due - Date.now()) / (24 * H)) : null;
  return `<div class="card"><div class="row wrap"><h3>Consignment</h3><span class="sp"></span><span class="chip ${c.closed ? 'gray' : 'ai'}">${c.closed ? 'Closed' : o.stage >= 14 ? 'Selling' : 'Starts after delivery'}</span></div>
  <div class="kpis" style="margin-top:8px">${kpi('Sold', st.sold + ' / ' + st.units, 'units')}${kpi('Settled', f(st.received), 'incl. ' + c.dep + '% deposit')}${kpi('Balance due', f(st.due), 'on goods sold')}${kpi('Term', left === null ? c.term + ' days' : left >= 0 ? left + ' days left' : Math.abs(left) + ' days overdue', c.ext ? 'extended ' + c.ext + '×' : 'ends ' + (c.due ? dt(c.due) : 'after POD'))}</div>
  <div class="bar" style="margin:12px 0"><i style="width:${st.units ? st.sold / st.units * 100 : 0}%"></i></div>
  <ul class="bd"><li><span>Deposit<small>${c.dep ? 'Held in escrow, credited to your first sales' : 'No deposit'}</small></span><b class="num">${c.dep}%</b></li><li><span>Consignment fee<small>Included in goods value ${f(c.grossMMK)}</small></span><b class="num">${c.feePct}%</b></li><li><span>Settlement<small>Preferred schedule</small></span><b>${CONS_L.settle[c.settle]}</b></li><li><span>Unsold goods<small>Preference at term end</small></span><b>${CONS_L.unsold[c.unsold]}</b></li></ul>
  ${buyer && live ? `<div class="row wrap" style="margin-top:12px"><button class="btn" data-act="c-report" data-id="${o.id}">Report sales</button>${st.due > 0 ? `<button class="btn acc" data-act="c-settle" data-id="${o.id}">Settle now</button>` : ''}${c.ext < opts().cons.extMax ? `<button class="btn sec" data-act="c-extend" data-id="${o.id}">Extend +30 days</button>` : ''}${st.left > 0 ? `<button class="btn sec" data-act="c-buyout" data-id="${o.id}">Buy out remainder</button><button class="btn sec" data-act="c-return" data-id="${o.id}">Return unsold</button>` : ''}</div>` : ''}
  ${S.role === 'ADMIN' && live && st.due > 0 ? `<div class="row" style="margin-top:12px"><button class="btn sec" data-act="a-remind" data-id="${o.id}">Send settlement reminder</button></div>` : ''}
  ${!live && !c.closed ? '<p class="small muted" style="margin-top:10px">Selling and settlement open once the buyer signs for delivery (Stage 14).</p>' : ''}${c.closed && c.ret ? `<p class="small muted" style="margin-top:10px">${c.ret} unsold unit(s) returned to the vendor.</p>` : ''}</div>`;
}
function laterCard(o) {
  const l = o.later, f = n => fmt(o.cur, toCur(n, o.cur)), left = l.due ? Math.ceil((l.due - Date.now()) / (24 * H)) : null, buyer = S.role === 'BUYER';
  return `<div class="card"><div class="row wrap"><h3>Pay later</h3><span class="sp"></span><span class="chip ${l.paid ? '' : 'ai'}">${l.paid ? 'Paid' : o.stage >= 14 ? 'Payment due' : 'Payable after delivery'}</span></div>
  <ul class="bd"><li><span>Amount payable<small>Goods ${f(o.calc.totalMMK)} + ${l.feePct}% pay-later fee</small></span><b class="num">${f(l.grossMMK)}</b></li><li><span>Terms<small>Counted from the POD signature</small></span><b>${l.days} days</b></li><li><span>Due date</span><b>${l.due ? dt(l.due) : 'After delivery'}</b></li>${left !== null && !l.paid ? `<li><span>Time left</span><b class="${left < 0 ? 'cut' : ''}">${left >= 0 ? left + ' days' : Math.abs(left) + ' days overdue'}</b></li>` : ''}</ul>
  ${buyer && !l.paid && o.stage >= 14 ? `<button class="btn acc" style="margin-top:12px" data-act="l-pay" data-id="${o.id}">Pay now</button>` : ''}${S.role === 'ADMIN' && !l.paid && o.stage >= 14 ? `<button class="btn sec" style="margin-top:12px" data-act="a-remind" data-id="${o.id}">Send settlement reminder</button>` : ''}</div>`;
}
function deferCard(o) {
  const d = o.defer, can = ['ADMIN', 'BUYER', 'DELIVERY'].includes(S.role);
  return `<div class="card"><div class="row wrap"><h3>Deliver later</h3><span class="sp"></span><span class="chip ${held(o) ? 'warn' : 'gray'}">${held(o) ? 'On hold at Yangon Hub' : 'Dispatch released'}</span></div>
  <p class="small muted" style="margin:6px 0">Requested dispatch date: <b>${dt(d.until)}</b> (${d.days} days after order). ${held(o) ? 'The 3PL will not consolidate this cargo before then.' : ''}</p>${held(o) && can ? `<button class="btn sec" data-act="d-release" data-id="${o.id}">Release hold now</button>` : ''}</div>`;
}
function shipTimeline(o) {
  if (!o.ship) return '';
  const sh = o.ship, st = o.stage;
  const steps = [['Departed', `${sh.from} · ${dt(sh.depart)}`, st >= 12], ['In transit', sh.mode, st >= 12 && st < 13 ? 'cur' : st >= 13], ['Customs cleared', 'Thailand / Taiwan border', st >= 13], ['Out for delivery', `ETA ${dt(sh.eta)} · ${sh.to}`, st === 13 ? 'cur' : st >= 14], ['Delivered · POD', o.pod ? `${o.pod.by} · ${dt(o.pod.ts)}` : 'Awaiting signature', st >= 14]];
  return `<ol class="tl">${steps.map(([a, b, d]) => `<li class="${d === 'cur' ? 'cur' : d ? 'done' : ''}"><span class="d">${d === true ? ic('check') : ''}</span><b>${a}</b><span>${b}</span></li>`).join('')}</ol>`;
}
V.cargo = () => {
  const list = S.orders.filter(o => o.stage >= 11 && o.stage <= 14);
  return `<h1>${t('cargo')} tracking</h1><p class="muted">Essential milestones only — departure, ETA and current status.</p><div class="grid g2">${list.map(o => `<div class="card"><div class="row wrap"><b class="mono">${o.id}</b><span class="sp"></span><span class="chip ${o.stage === 14 ? '' : 'warn pulse'}">${o.ship ? o.ship.st : 'Awaiting pickup'}${o.stage === 14 ? ' · Delivered' : ''}</span></div>${o.ship ? `<p class="small muted" style="margin:6px 0 12px">${o.ship.from} → ${o.ship.to} · ${o.ship.mawb}</p>${shipTimeline(o)}` : '<p class="small muted" style="margin:8px 0">Packed and waiting for 3PL pickup at the vendor.</p>'}${o.stage === 13 ? `<button class="btn" data-act="pod" data-id="${o.id}">${ic('pen')} Sign POD</button>` : ''}</div>`).join('') || '<div class="empty card">No shipments yet.</div>'}</div>`;
};

/* ----- Supplier ----- */
const mineOrders = () => S.orders.filter(o => o.stage >= 5 && o.status !== 'review');
const mmkLines = o => o.items.reduce((a, i) => a + prod(i.p).unit * i.q, 0);
function syncBar() { const q = S.q.length; return `<div class="syncbar ${S.offline ? 'off' : ''}">${ic('wifi')}<span>${S.offline ? `Offline · ${q} change${q === 1 ? '' : 's'} queued` : 'Sync OK · Yangon Node #04 · 3G cache live'}</span><span class="sp"></span><button class="switch ${S.offline ? '' : 'on'}" data-act="net" role="switch" aria-checked="${!S.offline}" aria-label="Network"></button></div>`; }
V.sorders = () => {
  const list = mineOrders();
  return `<div class="supplier view">${syncBar()}<div style="height:16px"></div><h1>${t('orders')} · ${t('welcome')}</h1><p class="muted">Fixed MMK prices are locked. Tap once to act.</p>
  ${list.map(o => {
    const st = o.stage, a = mmkLines(o);
    let act = '';
    if (o.status === 'declined') act = '<span class="chip bad">Declined</span>';
    else if (st === 5) act = `<div class="row"><button class="btn sp" data-act="s-accept" data-id="${o.id}">${ic('check')} ${t('accept')}</button><button class="btn bad" data-act="s-decline" data-id="${o.id}" aria-label="Decline">${ic('x')} ${t('decline')}</button></div>`;
    else if (st === 6) act = `<button class="btn xl" data-act="s-stock" data-id="${o.id}">${ic('layers')} ${t('confirmStock')}</button>`;
    else if (st === 7) act = `<button class="btn xl" data-act="s-qc" data-id="${o.id}">${ic('shield')} Send for quality check</button>`;
    else if (st === 8) act = '<span class="chip warn pulse">Waiting for quality check</span>';
    else if (st === 9) act = `<button class="btn xl" data-act="s-label" data-id="${o.id}">${ic('qr')} Print ${t('label')}</button>`;
    else if (st === 10) act = `<button class="btn acc xl" data-act="s-ready" data-id="${o.id}">${ic('box')} ${t('pickup')}</button>`;
    else act = `<span class="chip">${STAGES[st - 1]}</span>`;
    return `<div class="card"><div class="row wrap"><b class="mono">${o.id}</b><span class="sp"></span>${stageChip(o)}</div><div class="eyebrow" style="margin-top:10px">Direct escrow PO · locked</div><div class="num" style="font:700 26px var(--f-ui)">${mmk(a)} <small class="muted" style="font:500 12px var(--f-body)">MMK</small></div><p class="small muted">≈ ${fmt('THB', toCur(a, 'THB'))} · 50/50 staged</p><p class="small muted">${ic('pin')} Pickup: ${[...new Set(o.items.map(i => whLabel(prod(i.p))))].map(esc).join(' + ')}</p>${o.cons ? '<p class="small"><span class="chip ai">Consignment</span> Your payout is guaranteed by the platform</p>' : ''}
    <ul class="bd" style="margin:8px 0 12px">${o.items.map(i => { const p = prod(i.p); return `<li><span>${p.mm}<small>${p.n} · ${i.q} units</small></span><b class="num">${mmk(p.unit * i.q)}</b></li>`; }).join('')}</ul>${act}</div>`;
  }).join('') || '<div class="empty card">No orders yet. New buyer orders appear here instantly.</div>'}</div>`;
};
V.sstock = () => {
  const mine = mineP(MYV);
  return `<div class="supplier view">${syncBar()}<div style="height:16px"></div><div class="title-row"><h1>${t('stock')}</h1><span class="sp"></span><a class="btn sec sm" href="#/s/profile">Warehouses</a><a class="btn sm" href="#/s/products">Manage products</a></div><p class="muted">Shelf stock for ${vname()}.</p><div class="grid g2">${mine.map(p => `<div class="card"><b>${p.n}</b><div class="small muted">${p.mm || ''}</div><div class="row" style="margin:10px 0"><span class="chip ${p.live ? '' : 'gray'}">${p.live ? 'Live' : 'Not live'}</span><span class="chip">${p.quota - p.res} open in batch</span><span class="chip gray">${p.res} reserved</span></div><div class="bar"><i style="width:${p.res / p.quota * 100}%"></i></div><p class="small muted" style="margin-top:8px">Unit price lock: <b class="num">${mmk(p.unit)}</b></p></div>`).join('')}</div></div>`;
};
V.spayouts = () => {
  const L = S.ledger.filter(e => e.cr === 'Vendor Payable'), tot = L.reduce((a, e) => a + e.mmk, 0);
  return `<div class="supplier view">${syncBar()}<div style="height:16px"></div><h1>${t('payouts')}</h1><div class="kpis">${kpi('Released to you', mmk(tot), 'KBZPay / WavePay payout')}${kpi('Pending (escrow)', mmk(S.orders.filter(o => o.stage >= 4 && o.status !== 'declined').reduce((a, o) => a + mmkLines(o) - (o.rel.dep ? mmkLines(o) / 2 : 0) - (o.rel.bal ? mmkLines(o) / 2 : 0), 0)), 'Locked until stages 11 / 14')}</div>
  <div class="card scroll"><table class="tbl"><thead><tr><th>When</th><th>Order</th><th>Memo</th><th class="r">MMK</th></tr></thead><tbody>${L.map(e => `<tr><td>${dt(e.ts)}</td><td class="mono">${e.order}</td><td>${e.memo}</td><td class="r num">${mmk(e.mmk)}</td></tr>`).join('') || '<tr><td colspan="4" class="muted">No payouts yet</td></tr>'}</tbody></table></div></div>`;
};

/* ----- 3PL ----- */
V.manifest = () => {
  const ready = S.orders.filter(o => o.stage === 11 && !held(o)), onHold = S.orders.filter(o => o.stage === 11 && held(o));
  return `<div class="title-row"><h1>Cargo manifest</h1><span class="sp"></span><span class="chip warn">${ready.length} awaiting pickup</span></div>
  <div class="card"><h3>Weight intake &amp; consolidation</h3><p class="small muted">Tick orders, enter measured weights, then generate one MAWB.</p>
  <div class="scroll"><table class="tbl" style="margin-top:8px"><thead><tr><th></th><th>Order</th><th>Items</th><th class="r">Est. kg</th><th class="r">Gross kg</th><th class="r">Vol. kg</th></tr></thead><tbody>${ready.map(o => `<tr><td><input type="checkbox" class="pick" value="${o.id}" checked aria-label="Select ${o.id}"></td><td class="mono">${o.id}</td><td class="small">${o.items.map(i => prod(i.p).n.split(' ').slice(0, 3).join(' ') + ' ×' + i.q).join(', ')}<div class="muted">${ic('pin')} ${[...new Set(o.items.map(i => whLabel(prod(i.p))))].map(esc).join(' + ')}</div></td><td class="r num">${o.calc.kg.toFixed(1)}</td><td class="r"><input class="inp num gw" style="width:80px;height:32px" value="${o.calc.kg.toFixed(1)}" data-id="${o.id}" inputmode="decimal"></td><td class="r"><input class="inp num vw" style="width:80px;height:32px" value="${(o.calc.kg * 1.2).toFixed(1)}" data-id="${o.id}" inputmode="decimal"></td></tr>`).join('') || '<tr><td colspan="6" class="muted">No packed orders yet. Vendors mark orders "ready for pickup" at Stage 11.</td></tr>'}</tbody></table></div>
  ${onHold.length ? `<p class="small muted" style="margin-top:10px">${onHold.map(o => `<span class="chip warn">${o.id} · hold until ${dt(o.defer.until)}</span>`).join(' ')}</p>` : ''}
  <div class="row wrap" style="margin-top:12px"><select class="sel sm" id="mode"><option>Land · Mae Sot → Bangkok</option><option>Air · Yangon → Bangkok (BKK)</option><option>Air · Yangon → Taipei (TPE)</option></select><span class="sp"></span><button class="btn" data-act="consol" ${ready.length ? '' : 'disabled'}>${ic('list')} Generate MAWB &amp; dispatch</button></div></div>`;
};
V.transit = () => {
  const list = S.orders.filter(o => o.stage >= 12 && o.stage < 14);
  return `<h1>${t('transit')}</h1><div class="grid g2">${list.map(o => `<div class="card"><div class="row wrap"><b class="mono">${o.id}</b><span class="chip gray mono">${o.ship.mawb}</span><span class="sp"></span><span class="chip warn pulse">${o.ship.st}</span></div><p class="small muted" style="margin:6px 0 12px">${o.ship.gross} kg gross · ${o.ship.vol} kg vol · ${o.ship.mode}</p>${shipTimeline(o)}<div class="row" style="margin-top:8px">${o.stage === 12 ? `<button class="btn" data-act="customs" data-id="${o.id}">${ic('shield')} Mark customs cleared</button>` : `<button class="btn" data-act="pod" data-id="${o.id}">${ic('pen')} Capture POD</button>`}</div></div>`).join('') || '<div class="empty card">No shipments in transit.</div>'}</div>`;
};
V.podlist = () => {
  const list = S.orders.filter(o => o.pod);
  return `<h1>Proof of delivery</h1><p class="muted">Signature, photo stamp and geotag are stored with the order.</p><div class="card scroll"><table class="tbl"><thead><tr><th>Order</th><th>Signed by</th><th>When</th><th>Geotag</th></tr></thead><tbody>${list.map(o => `<tr><td class="mono">${o.id}</td><td>${esc(o.pod.by)}</td><td>${dt(o.pod.ts)}</td><td class="mono">${o.pod.geo}</td></tr>`).join('') || '<tr><td colspan="4" class="muted">No PODs captured yet</td></tr>'}</tbody></table></div>
  <div class="card"><h3>Awaiting POD</h3>${S.orders.filter(o => o.stage === 13).map(o => `<div class="row" style="padding:8px 0"><b class="mono">${o.id}</b><span class="small muted">${o.ship.to}</span><span class="sp"></span><button class="btn sm" data-act="pod" data-id="${o.id}">Capture</button></div>`).join('') || '<p class="muted small">Nothing out for delivery.</p>'}</div>`;
};
function podSheet(id) {
  sheet(`<h3>Proof of delivery · ${id}</h3><p class="small muted">Signing releases the remaining 50% of escrow to the vendor instantly.</p><label class="f" for="pn">Receiver name</label><input class="inp" id="pn" value="${S.role === 'BUYER' ? 'Silom Artisan Gallery' : ''}" placeholder="Full name"><label class="f">Signature</label><canvas class="sig" id="sig" width="400" height="140"></canvas><div class="row small" style="margin-top:6px"><button class="btn sec sm" data-act="sigclear">Clear</button><span class="sp"></span><span class="muted" id="geo">Geotag: locating…</span></div>
  <div class="row" style="margin-top:14px"><button class="btn sec" data-act="close">Cancel</button><span class="sp"></span><button class="btn" data-act="podok" data-id="${id}">${ic('check')} Confirm delivery</button></div>`);
  const c = $('#sig'), x = c.getContext('2d'); x.lineWidth = 2.2; x.lineCap = 'round'; x.strokeStyle = '#102A45'; let d = false; c.dataset.drawn = '';
  const pt = e => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) * c.width / r.width, (e.clientY - r.top) * c.height / r.height]; };
  c.onpointerdown = e => { d = true; c.setPointerCapture(e.pointerId); x.beginPath(); x.moveTo(...pt(e)); }; c.onpointermove = e => { if (d) { x.lineTo(...pt(e)); x.stroke(); c.dataset.drawn = '1'; } }; c.onpointerup = () => d = false;
  const g = $('#geo'); window._geo = '13.7563, 100.5018 (sample)';
  if (navigator.geolocation) navigator.geolocation.getCurrentPosition(p => { window._geo = p.coords.latitude.toFixed(4) + ', ' + p.coords.longitude.toFixed(4); if (g) g.textContent = 'Geotag: ' + window._geo; }, () => { if (g) g.textContent = 'Geotag: ' + window._geo; }, { timeout: 3000 }); else g.textContent = 'Geotag: ' + window._geo;
}

/* ----- Admin ----- */
V.aoverview = () => {
  const gmv = S.orders.filter(o => o.stage >= 4 && o.status !== 'declined').reduce((a, o) => a + o.calc.totalMMK, 0);
  const held = S.orders.filter(o => o.stage >= 4 && o.stage < 14 && o.status !== 'declined').reduce((a, o) => a + o.calc.totalMMK - (o.rel.dep ? o.calc.artisan / 2 : 0), 0);
  const rev = S.orders.filter(o => o.stage >= 4 && o.status !== 'declined').reduce((a, o) => a + o.calc.margin + o.calc.fxbuf, 0);
  return `<div class="title-row"><h1>Operations overview</h1><span class="sp"></span><a class="btn sec sm" href="#/a/products">Products</a><a class="btn sec sm" href="#/a/options">Order options</a><span class="chip ai">${ic('spark')} Live · ${S.orders.length} orders</span></div>
  <div class="kpis">${kpi('GMV (funded)', mmk(gmv), '≈ ' + fmt('USD', toCur(gmv, 'USD')))}${kpi('In escrow', mmk(held), 'Awaiting stage 11 / 14')}${kpi('Platform revenue', mmk(rev), 'Margin + FX buffer')}${kpi('Needs review', S.review.length + S.disputes.filter(d => d.open).length, 'Slips + disputes')}</div>
  <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr))"><div class="card"><h3>Review queue</h3>${S.review.map(id => { const o = ord(id); return `<div class="row wrap" style="padding:10px 0;border-bottom:1px solid #F1F5F9"><div><b class="mono">${o.id}</b><div class="small muted">Slip ${o.slip.ref} · OCR ${o.slip.conf.toFixed(1)}% · ${fmt(o.cur, o.calc.total)}</div></div><span class="sp"></span><button class="btn sm" data-act="a-verify" data-id="${o.id}">Verify</button><button class="btn bad sm" data-act="a-reject" data-id="${o.id}">Reject</button></div>`; }).join('') || '<p class="muted small">No slips waiting. OCR auto-verified everything ≥ 92%.</p>'}
  <h3 style="margin-top:18px">Quality check queue</h3>${S.orders.filter(o => o.stage === 8 && o.status === 'ok').map(o => `<div class="row wrap" style="padding:10px 0;border-bottom:1px solid #F1F5F9"><div><b class="mono">${o.id}</b><div class="small muted">${o.items.map(i => prod(i.p).n + ' ×' + i.q).join(', ')}</div></div><span class="sp"></span><button class="btn sm" data-act="a-qc" data-v="pass" data-id="${o.id}">Pass</button><button class="btn bad sm" data-act="a-qc" data-v="fail" data-id="${o.id}">Fail</button></div>`).join('') || '<p class="muted small">No batches waiting for inspection.</p>'}
  <h3 style="margin-top:18px">Disputes</h3>${S.disputes.map(d => `<div style="padding:10px 0;border-bottom:1px solid #F1F5F9"><div class="row"><b class="mono">${d.id}</b><span class="small muted">${d.order} · by ${d.by}</span><span class="sp"></span><span class="chip ${d.open ? 'bad' : ''}">${d.open ? 'Open' : 'Resolved'}</span></div><p class="small">${esc(d.why)}</p>${d.open ? `<div class="row" style="margin-top:6px"><button class="btn sm" data-act="a-resolve" data-id="${d.id}" data-v="release">Release to vendor</button><button class="btn sec sm" data-act="a-resolve" data-id="${d.id}" data-v="partial">Partial credit</button></div>` : ''}</div>`).join('')}</div>
  <div class="card"><h3>Order pipeline</h3>${S.orders.slice(0, 6).map(o => `<a href="#/order/${o.id}" style="display:block;padding:8px 6px;border-bottom:1px solid #F1F5F9;text-decoration:none;color:inherit" title="Open process status"><div class="row small wrap"><b class="mono">${o.id}</b>${stageChip(o)}<span class="sp"></span><b class="num">${fmt(o.cur, o.calc.total)}</b></div><div style="margin-top:6px">${stageBar(o)}</div></a>`).join('')}<a class="small" style="display:block;margin-top:10px" href="#/a/orders">View all orders →</a></div>${alertsCard()}</div>`;
};
V.afx = () => {
  const f = S.fx, r = f.rates;
  const hist = f.history.slice(-24); const pts = hist.length > 1 ? hist.map((h, i) => `${i / (hist.length - 1) * 300},${50 - (h - Math.min(...hist)) / (Math.max(...hist) - Math.min(...hist) || 1) * 44}`).join(' ') : '';
  return `<div class="title-row"><h1>FX &amp; margin engine</h1><span class="sp"></span><span class="chip ${f.override ? 'warn' : ''}">${f.override ? 'Manual override active' : 'Automated'}</span></div>
  <div class="kpis">${['THB', 'TWD', 'MMK'].map(c => kpi('1 USD =', `${r[c].toLocaleString()} ${c}`, `buyer rate +${f.spread}% buffer`)).join('')}</div>
  <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr))"><div class="card"><h3>Spread &amp; margin</h3><label class="f" for="sp">FX volatility buffer — <b id="spv">${f.spread}%</b></label><input id="sp" type="range" min="0" max="8" step="0.1" value="${f.spread}" style="width:100%"><label class="f" for="mg">Platform margin — <b id="mgv">${f.margin}%</b></label><input id="mg" type="range" min="2" max="20" step="0.5" value="${f.margin}" style="width:100%">
   <p class="small muted" style="margin-top:10px">Applies to new pre-orders. Existing orders keep their locked rate.</p></div>
  <div class="card"><h3>Manual rate override</h3><div class="grid" style="grid-template-columns:1fr 1fr;gap:10px">${['THB', 'TWD', 'MMK'].map(c => `<div><label class="f" for="r-${c}">USD → ${c}</label><input class="inp num" id="r-${c}" value="${r[c]}" inputmode="decimal"></div>`).join('')}</div>
   <div class="row" style="margin-top:12px"><button class="btn" data-act="fx-save">Apply override</button><button class="btn sec" data-act="fx-auto">Resume automatic</button></div></div></div>
  <div class="card"><h3>MMK / USD · last ticks</h3>${pts ? `<svg viewBox="0 0 300 56" style="width:100%;height:80px"><polyline points="${pts}" fill="none" stroke="#0D5C4D" stroke-width="2"/></svg>` : '<p class="muted small">Ticks appear as the automated feed runs (or use the Test Lab → Admin FX).</p>'}</div>`;
};
V.avendors = () => `<h1>Vendor vetting &amp; KYC</h1><div class="card scroll"><table class="tbl"><thead><tr><th>Vendor</th><th>City</th><th>Documents</th><th>Tier</th><th>KYC</th><th></th></tr></thead><tbody>${S.vendors.map(v => `<tr><td><b>${v.n}</b></td><td>${v.city}</td><td class="small">${v.docs}</td><td>${v.tier}</td><td><span class="chip ${v.kyc === 'verified' ? '' : 'warn pulse'}">${v.kyc}</span></td><td class="r"><a class="btn sec sm" href="#/a/supplier/${v.id}">Profile &amp; warehouses</a> ${v.kyc === 'pending' ? `<button class="btn sm" data-act="a-kyc" data-id="${v.id}">Approve</button>` : ''}</td></tr>`).join('')}</tbody></table></div>`;
V.aescrow = () => {
  const ok = verifyLedger(), open = S.orders.filter(o => o.stage >= 4 && o.stage < 14 && o.status !== 'declined');
  return `<div class="title-row"><h1>Escrow &amp; ledger</h1><span class="sp"></span><span class="chip ${ok ? '' : 'bad'}">${ic(ok ? 'check' : 'x')} Hash chain ${ok ? 'verified' : 'BROKEN'}</span></div>
  <div class="card"><h3>Release overrides</h3>${open.map(o => `<div class="row wrap" style="padding:8px 0;border-bottom:1px solid #F1F5F9"><b class="mono">${o.id}</b>${stageChip(o)}<span class="sp"></span><span class="small muted">${o.rel.dep ? '50% out' : '0% out'}</span>${o.stage >= 11 && !o.rel.bal ? `<button class="btn sec sm" data-act="a-force" data-id="${o.id}">Force release balance</button>` : ''}</div>`).join('') || '<p class="muted small">No funds currently in escrow.</p>'}</div>
  <div class="card scroll"><h3>Double-entry ledger</h3><table class="tbl" style="margin-top:8px"><thead><tr><th>ID</th><th>Order</th><th>Debit</th><th>Credit</th><th class="r">MMK</th><th>Hash</th></tr></thead><tbody>${S.ledger.slice(0, 40).map(e => `<tr><td class="mono">${e.id}</td><td class="mono">${e.order}</td><td>${e.dr}</td><td>${e.cr}<div class="small muted">${e.memo}</div></td><td class="r num">${mmk(e.mmk)}</td><td class="mono">${e.hash}</td></tr>`).join('')}</tbody></table><p class="small muted" style="margin-top:8px">Demo hashes are a non-cryptographic checksum; production uses SHA-256 in PostgreSQL.</p></div>`;
};
V.aroles = () => {
  const P = [['Vendor vetting & KYC', 1, 0, 0, 0], ['FX spread & margin control', 1, 0, 0, 0], ['Escrow release override', 1, 0, 0, 0], ['Dispute resolution', 1, 0, 0, 0], ['Browse & reserve batches', 1, 0, 1, 0], ['Upload payment slip', 0, 0, 1, 0], ['Accept / decline orders', 0, 1, 0, 0], ['Confirm stock · print labels', 0, 1, 0, 0], ['MMK payouts', 0, 1, 0, 0], ['Weight intake · MAWB', 0, 0, 0, 1], ['Capture signature POD', 0, 0, 1, 1], ['Track cargo milestones', 1, 1, 1, 1]];
  return `<h1>Role rights matrix</h1><p class="muted">Enforced at API gateway and via Row Level Security in the production build.</p><div class="card scroll"><table class="tbl rbac"><thead><tr><th>Permission</th><th>Admin</th><th>Supplier</th><th>Buyer</th><th>3PL</th></tr></thead><tbody>${P.map(r => `<tr><td>${r[0]}</td>${r.slice(1).map(v => `<td class="${v ? 'y' : 'n'}">${v ? '✓' : '—'}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
};

/* ----- Home dashboards, account, invoices, admin orders ----- */
const ROLE_KINDS = { BUYER: ['buyer', 'ocr', 'escrow', '3pl', 'buyer-pod', 'sys'], SUPPLIER: ['vendor', 'escrow', 'sys'], DELIVERY: ['3pl', '3pl-pod', 'vendor', 'sys'], ADMIN: null };
const myEvents = r => S.events.filter(e => !ROLE_KINDS[r] || ROLE_KINDS[r].includes(e.k));
const feed = (r, n = 6) => `<ul class="bd">${myEvents(r).slice(0, n).map(e => `<li><span>${esc(e.m)}<small>${ago(e.ts)} · ${esc(e.k)}</small></span></li>`).join('') || '<li class="muted">No activity yet</li>'}</ul>`;
const quick = items => `<div class="row wrap">${items.map(([h, i, l]) => `<a class="btn sec" href="${h}">${ic(i)} ${l}</a>`).join('')}</div>`;
const todo = (n, label, href) => `<a class="row card hv" style="text-decoration:none;color:inherit" href="${href}"><b class="num" style="font:700 22px var(--f-ui);min-width:32px">${n}</b><span>${label}</span><span class="sp"></span>${ic('check', n ? '' : 'muted')}</a>`;
V.bhome = () => {
  const mine = S.orders, act = mine.filter(o => o.stage < 14 && o.status !== 'declined'), held = act.filter(o => o.stage >= 4).reduce((a, o) => a + o.calc.totalMMK, 0);
  const soon = liveP().filter(p => p.cut <= 24 || p.res / p.quota >= .85).slice(0, 3);
  return `<h1>Welcome back, ${esc(ROLES.BUYER.user.split(' · ')[0])}</h1>
  <div class="kpis">${kpi('Active orders', act.length, mine.filter(o => o.stage === 13).length + ' out for delivery')}${kpi('Held in escrow', fmt(S.cur, toCur(held, S.cur)), 'Released on your POD')}${kpi('Delivered', mine.filter(o => o.stage === 14).length, 'Completed orders')}${kpi('Reserved in cart', S.cart.length, S.cart.length ? 'Ready to pay' : 'Nothing pending')}</div>
  ${quick([['#/catalog', 'bag', 'Browse catalog'], ['#/cart', 'cart', 'Pre-order'], ['#/invoices', 'list', 'Invoices'], ['#/cargo', 'truck', 'Track cargo']])}
  <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr))"><div class="card"><h3>Batches closing soon</h3>${soon.map(p => `<a class="row" style="padding:10px 0;border-bottom:1px solid #F1F5F9;text-decoration:none;color:inherit" href="#/product/${p.id}"><div style="width:52px;height:40px;border-radius:4px;overflow:hidden;flex:none">${art(p)}</div><div><b class="small">${p.n}</b><div class="small muted">${p.res}/${p.quota} reserved</div></div><span class="sp"></span><span class="cut" data-cut="${p.id}">${cdown(cutTs(p) - Date.now())}</span></a>`).join('')}</div>
  <div class="card"><h3>Latest updates</h3>${feed('BUYER')}</div></div>
  <div class="title-row"><h2>Active orders</h2><span class="sp"></span><a class="small" href="#/orders">All orders →</a></div><div class="grid g2">${act.slice(0, 3).map(o => orderCard(o)).join('') || '<div class="empty card">No active orders.</div>'}</div>`;
};
V.invoices = () => {
  const L = S.orders.filter(o => o.stage >= 4 && o.status !== 'declined');
  return `<a href="#/home" class="small">← ${t('home')}</a><h1>Invoices &amp; payments</h1><div class="card scroll"><table class="tbl"><thead><tr><th>Invoice</th><th>Date</th><th>Method</th><th class="r">Amount</th><th>Status</th><th></th></tr></thead><tbody>${L.map(o => `<tr><td class="mono">INV-${o.id.slice(2)}</td><td>${dt(o.ts)}</td><td class="small">${o.rail}</td><td class="r num">${fmt(o.cur, o.calc.total)}</td><td><span class="chip ${o.stage >= 14 ? '' : 'warn'}">${o.stage >= 14 ? 'Settled' : 'In escrow'}</span></td><td class="r"><button class="btn sec sm" data-act="invoice" data-id="${o.id}">View</button></td></tr>`).join('') || '<tr><td colspan="6" class="muted">No invoices yet</td></tr>'}</tbody></table></div>`;
};
V.shome = () => {
  const o5 = S.orders.filter(o => o.stage === 5 && o.status === 'ok'), o6 = S.orders.filter(o => o.stage >= 6 && o.stage <= 10), led = S.ledger.filter(e => e.cr === 'Vendor Payable').reduce((a, e) => a + e.mmk, 0);
  const pend = S.orders.filter(o => o.stage >= 4 && o.status !== 'declined').reduce((a, o) => a + mmkLines(o) - (o.rel.dep ? mmkLines(o) / 2 : 0) - (o.rel.bal ? mmkLines(o) / 2 : 0), 0);
  return `<div class="supplier view">${syncBar()}<div style="height:16px"></div><h1>${t('welcome')}, ${esc(vname())}</h1><p class="muted">Today's work, in one tap each.</p>
  ${todo(o5.length, 'New orders waiting for your answer', '#/s/orders')}${todo(o6.length, 'Orders to confirm, label and pack', '#/s/orders')}${todo(S.orders.filter(o => o.stage === 11).length, 'Packed — waiting for cargo pickup', '#/l/home'.replace('#/l/home', '#/s/orders'))}
  <div class="kpis">${kpi('Paid out', mmk(led), 'To KBZPay / WavePay')}${kpi('Locked in escrow', mmk(pend), 'Releases at stages 11 &amp; 14')}${kpi('Open batch units', liveP().filter(p => p.v === MYV).reduce((a, p) => a + p.quota - p.res, 0), 'Your lacquerware batches')}</div>
  <div class="card"><h3>Latest updates</h3>${feed('SUPPLIER')}</div></div>`;
};
V.lhome = () => {
  const c = n => S.orders.filter(o => o.stage === n).length;
  return `<h1>Dispatch board · Yangon Hub</h1>
  <div class="kpis">${kpi('Awaiting pickup', c(11), 'Packed at vendors')}${kpi('In transit', c(12), 'Land &amp; air')}${kpi('Out for delivery', c(13), 'POD needed')}${kpi('PODs captured', S.orders.filter(o => o.pod).length, 'With geotag')}</div>
  ${quick([['#/l/manifest', 'list', 'Build manifest'], ['#/l/transit', 'truck', 'In transit'], ['#/l/pod', 'pen', 'Capture POD']])}
  <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr))"><div class="card"><h3>Active shipments</h3>${S.orders.filter(o => o.ship && o.stage < 14).map(o => `<div style="padding:10px 0;border-bottom:1px solid #F1F5F9"><div class="row"><b class="mono">${o.id}</b><span class="chip gray mono">${o.ship.mawb}</span><span class="sp"></span><span class="chip warn pulse">${o.ship.st}</span></div><div class="small muted">${o.ship.from} → ${o.ship.to} · ETA ${dt(o.ship.eta)}</div></div>`).join('') || '<p class="muted small">No active shipments.</p>'}</div>
  <div class="card"><h3>Latest updates</h3>${feed('DELIVERY')}</div></div>`;
};
V.aorders = () => {
  const f = AF, cons = S.orders.filter(o => o.cons && o.status !== 'declined'), owed = cons.filter(o => !o.cons.closed && o.stage >= 14).reduce((a, o) => a + consStatus(o).due, 0), list = S.orders.filter(o => f === 'all' || (f === 'cons' ? !!(o.cons || o.later || o.defer) : f === 'review' ? o.status === 'review' || o.status === 'dispute' : f === 'moving' ? o.stage >= 11 && o.stage < 14 : f === 'done' ? o.stage === 14 : o.stage < 11 && o.status === 'ok'));
  return `<h1>All orders</h1><div class="pills">${[['all', 'All'], ['pre', 'Pickup preparation'], ['moving', 'Cargo moving'], ['done', 'Delivered'], ['cons', 'Flexible terms'], ['review', 'Needs attention']].map(([k, n]) => `<button class="${f === k ? 'on' : ''}" data-act="aflt" data-v="${k}">${n}</button>`).join('')}</div>
  ${cons.length || S.orders.some(o => o.later || o.defer) ? `<div class="kpis">${kpi('Consignment', cons.length, cons.filter(o => !o.cons.closed).length + ' open')}${kpi('Pay later', S.orders.filter(o => o.later).length, 'orders')}${kpi('Deliver later', S.orders.filter(o => o.defer).length, S.orders.filter(held).length + ' on hold')}${kpi('Receivable now', mmk(owed + S.orders.filter(o => o.later && !o.later.paid && o.stage >= 14).reduce((a, o) => a + o.later.grossMMK, 0)), 'sold / delivered, unpaid')}</div>` : ''}
  <div class="card scroll"><table class="tbl"><thead><tr><th>Order</th><th>Buyer</th><th>Stage</th><th>Slip OCR</th><th class="r">Total</th></tr></thead><tbody>${list.map(o => `<tr><td><a class="mono" href="#/order/${o.id}">${o.id}</a> ${tagChips(o)}</td><td>${esc(o.buyer)}</td><td>${stageChip(o)}</td><td>${o.slip.conf.toFixed(1)}%</td><td class="r num">${fmt(o.cur, o.calc.total)}</td></tr>`).join('') || '<tr><td colspan="5" class="muted">No orders in this view</td></tr>'}</tbody></table></div>`;
};
let AF = 'all', ALF = 'all';
const unreadN = () => (S.alerts || []).filter(a => !a.read).length;
const alertRow = a => { const [l, c, tc] = AL_GRP[a.group]; return `<a class="card hv" href="${a.href}" data-act="al-open" data-id="${a.id}" style="display:block;text-decoration:none;color:inherit;border-left:5px solid ${c};padding:12px 14px;${a.read ? 'opacity:.75' : ''}"><div class="row wrap"><span class="chip" style="background:${c}1f;color:${tc}"><i class="gdot" style="background:${c}"></i>${l}</span>${a.hot ? '<span class="chip bad">Needs attention</span>' : ''}${a.read ? '' : '<span class="chip ai">New</span>'}<span class="sp"></span><span class="small muted">${ago(a.ts)}</span></div><div style="margin-top:6px"><b>${esc(a.title)}</b></div><div class="small muted">${esc(a.msg)}</div></a>`; };
V.aalerts = () => {
  const A = S.alerts || [], list = A.filter(a => ALF === 'all' || a.group === ALF), un = g => A.filter(a => !a.read && (g === 'all' || a.group === g)).length;
  return `<div class="title-row"><h1>Alerts</h1><span class="sp"></span><button class="btn sec sm" data-act="al-all" ${un('all') ? '' : 'disabled'}>Mark all read</button><button class="btn sec sm" data-act="al-clear" ${A.some(a => a.read) ? '' : 'disabled'}>Clear read</button></div>
  <p class="muted">Everything suppliers, buyers and logistics do lands here, colour-coded by who did it.</p>
  <div class="pills">${[['all', 'All', '#102A45'], ...Object.entries(AL_GRP).map(([k, v]) => [k, v[0], v[1]])].map(([k, n, c]) => `<button class="${ALF === k ? 'on' : ''}" data-act="al-flt" data-v="${k}"><i class="gdot" style="background:${c}"></i>${n}${un(k) ? ` <b>${un(k)}</b>` : ''}</button>`).join('')}</div>
  <div class="grid" style="gap:10px">${list.map(alertRow).join('') || '<div class="empty card">No alerts yet. When a supplier, buyer or the 3PL does something, it appears here.</div>'}</div>`;
};
const alertsCard = () => `<div class="card"><div class="row wrap"><h3>Latest alerts</h3>${unreadN() ? `<span class="chip ai">${unreadN()} new</span>` : ''}<span class="sp"></span><a class="small" href="#/a/alerts">View all →</a></div><div class="grid" style="gap:8px;margin-top:8px">${(S.alerts || []).slice(0, 4).map(alertRow).join('') || '<p class="muted small">No alerts yet.</p>'}</div></div>`;
V.aoptions = () => {
  const O = opts(), n = k => S.orders.filter(o => o[k]).length;
  const sw = (k, on, l) => `<button class="switch ${on ? 'on' : ''}" data-act="opt-on" data-k="${k}" role="switch" aria-checked="${on}" aria-label="${l}"></button>`;
  const one = (k, l, arr) => `<label class="f">${l}</label><div class="pills">${arr.map(([v, n]) => `<button class="${String(O.cons[k]) === String(v) ? 'on' : ''}" data-act="opt-set" data-k="${k}" data-v="${v}">${n}</button>`).join('')}</div>`;
  const chips = (g, k, all, sel, lab) => `<div class="pills">${all.map(v => `<button class="${sel.includes(v) ? 'on' : ''}" data-act="opt-tog" data-g="${g}" data-k="${k}" data-v="${v}">${lab(v)}</button>`).join('')}</div>`;
  const fee = (g, arr) => `<div class="row wrap" style="gap:10px">${arr.map(v => `<label class="small" style="display:flex;align-items:center;gap:6px">${g === 'cons' ? v + '% deposit' : v + ' days'} →<input class="ofee" type="number" step="0.1" min="0" max="30" value="${O[g].fee[v] ?? 4}" data-g="${g}" data-d="${v}" style="width:68px;padding:6px;border:1px solid #cbd5e1;border-radius:8px"> %</label>`).join('')}</div>`;
  const head = (k, t, d, used) => `<div class="row wrap"><div><h3>${t}</h3><div class="small muted">${d}</div></div><span class="sp"></span><span class="chip gray">${used} order${used === 1 ? '' : 's'}</span>${sw(k, O[k].on, 'Enable ' + t)}</div>`;
  return `<a href="#/a/overview" class="small">← Overview</a><div class="title-row"><h1>Order options</h1><span class="sp"></span><button class="btn sec sm" data-act="opt-reset">Reset to defaults</button></div><p class="muted">Control which flexible terms buyers can choose at checkout. Changes apply to new orders immediately; existing orders keep the terms they were placed with.</p>
  <div class="card">${head('cons', 'Consignment', 'Buyer takes the goods, pays as they sell. Platform advances the vendor.', n('cons'))}${O.cons.on ? `<p class="small muted" style="margin-top:8px">Buyers cannot change these. Every new consignment order uses the terms below.</p>${one('dep', 'Upfront deposit', [[0, 'None'], [10, '10%'], [25, '25%'], [50, '50%']])}${one('term', 'Consignment term', [30, 60, 90, 120].map(x => [x, x + ' days']))}${one('settle', 'Settlement', Object.entries(CONS_L.settle))}${one('unsold', 'Unsold goods at term end', Object.entries(CONS_L.unsold))}<label class="f">Max term extensions (30 days each)</label><div class="pills">${[0, 1, 2, 3].map(v => `<button class="${O.cons.extMax === v ? 'on' : ''}" data-act="opt-ext" data-v="${v}">${v}</button>`).join('')}</div><label class="f">Consignment fee by deposit level</label>${fee('cons', [0, 10, 25, 50])}` : ''}</div>
  <div class="card">${head('later', 'Pay later', 'No payment at checkout; buyer pays within the chosen days after delivery.', n('later'))}${O.later.on ? `<label class="f">Payment windows</label>${chips('later', 'days', [15, 30, 45, 60], O.later.days, v => v + ' days')}<label class="f">Fee by window</label>${fee('later', O.later.days)}` : ''}</div>
  <div class="card">${head('defer', 'Deliver later', 'Goods are packed and held at the hub, dispatched on a date the buyer picks.', n('defer'))}${O.defer.on ? `<label class="f">Dispatch delay choices</label>${chips('defer', 'days', [7, 14, 30, 60, 90], O.defer.days, v => v + ' days')}` : ''}</div>
  <button class="btn" data-act="opt-fee">Save fees</button>
  <p class="small muted" style="margin-top:10px">Receivable now: ${mmk(S.orders.filter(o => o.later && !o.later.paid && o.stage >= 14).reduce((a, o) => a + o.later.grossMMK, 0) + S.orders.filter(o => o.cons && !o.cons.closed && o.stage >= 14).reduce((a, o) => a + consStatus(o).due, 0))} (pay-later + sold consignment goods)</p>`;
};
const FAQ = {
  BUYER: [['How does escrow protect me?', 'Your full payment is held in the escrow vault. 50% goes to the vendor when the order is packed (Stage 11) and the rest only after you sign the proof of delivery (Stage 14).'], ['What if my slip is flagged?', 'Slips under 92% OCR confidence go to a human reviewer, usually within a few hours. Your order proceeds as soon as it is verified.'], ['Which currencies can I pay in?', 'THB via PromptPay, TWD via Taiwan Pay QR, USD by wire, or MMK via MyanMyanPay.']],
  SUPPLIER: [['When do I get paid?', 'Half of your fixed MMK price is released at Stage 11 (packed and ready), the remainder when the buyer signs for delivery.'], ['Can I work offline?', 'Yes. Actions are queued on your phone and sync automatically when the connection returns.'], ['Can the buyer change the price?', 'No. MMK prices are locked at the time the batch is reserved.']],
  DELIVERY: [['How do I consolidate orders?', 'Open Manifest, tick the packed orders, enter measured gross and volumetric weights, then generate one MAWB.'], ['What counts as a valid POD?', 'Receiver name, a signature and a geotag. Signing releases the vendor balance instantly.'], ['A parcel is damaged — what now?', 'Do not capture POD. The buyer can raise a dispute and the admin team will review it.']],
  ADMIN: [['How do I override FX?', 'Open FX Engine, edit the USD rates and press Apply override. New pre-orders use it immediately; existing orders keep their locked rate.'], ['When should I force-release escrow?', 'Only after a documented delivery confirmation outside the app. The release is written to the ledger as an admin override.'], ['How is ledger integrity checked?', 'Each entry is hash-chained to the previous one. Escrow & Ledger shows whether the chain verifies.']]
};
V.account = () => {
  const r = S.role, R = ROLES[r], p = S.prefs;
  const row = (k, l, d) => `<div class="row" style="padding:10px 0;border-bottom:1px solid #F1F5F9"><div><b>${l}</b><div class="small muted">${d}</div></div><span class="sp"></span><button class="switch ${p[k] ? 'on' : ''}" data-act="pref" data-v="${k}" role="switch" aria-checked="${!!p[k]}" aria-label="${l}"></button></div>`;
  return `<h1>Account &amp; settings</h1>
  <div class="card row wrap"><div style="width:52px;height:52px;border-radius:50%;background:${R.color};color:${r === 'BUYER' ? '#102A45' : '#fff'};display:grid;place-items:center;font:700 20px var(--f-ui)">${R.user[0]}</div><div><b>${esc(R.user)}</b><div class="small muted">${R.name} · ${R.nm}<br>${R.phone}</div></div><span class="sp"></span><span class="chip">${ic('shield')} 2FA active</span></div>
  <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr))"><div class="card"><h3>Language${r === 'BUYER' ? ' &amp; currency' : ''}</h3><div class="langs" style="margin:12px 0 0;width:auto;justify-content:flex-start">${[['mm', 'မြန်မာ'], ['en', 'English'], ['th', 'ไทย']].map(([k, n]) => `<button class="${S.lang === k ? 'on' : ''}" data-act="lang" data-v="${k}">${n}</button>`).join('')}</div>${r === 'BUYER' ? `<label class="f" for="cu">Display currency</label><select id="cu" class="sel" data-act="cur">${Object.keys(CUR).map(c => `<option ${S.cur === c ? 'selected' : ''}>${c}</option>`).join('')}</select>` : ''}</div>
  <div class="card"><h3>Notifications</h3>${row('viber', 'Viber', 'Order and payment alerts')}${row('sms', 'SMS', 'Fallback on weak connections')}${row('email', 'Email', 'Invoices and summaries')}</div></div>
  <div class="card"><h3>Help &amp; support</h3>${FAQ[r].map(([q, a]) => `<details class="faq"><summary>${q}</summary><p>${a}</p></details>`).join('')}<p class="small muted" style="margin-top:10px">Need a person? Viber / WhatsApp: +95 9 4xx xxx 700 · support@infinityplus.example</p></div>
  <div class="card"><h3>Recent activity</h3>${feed(r, 12)}</div>
  ${quick([...(r === 'SUPPLIER' ? [['#/s/profile', 'pin', 'Business & warehouses'], ['#/s/products', 'box', 'Manage products']] : []), ...(r === 'ADMIN' ? [['#/a/products', 'box', 'Manage products']] : []), ...(r === 'BUYER' ? [['#/invoices', 'list', 'Invoices']] : []), ...(r === 'ADMIN' ? [['#/a/roles', 'shield', 'Role rights matrix']] : []), ['#/lab', 'flask', 'Test lab']])}
  <button class="btn bad" data-act="logout">${ic('out')} ${t('logout')}</button>`;
};
/* ----- Lab ----- */
V.lab = () => {
  const o = S.orders[0], payload = new Blob([JSON.stringify(S.orders.slice(0, 3).map(x => ({ id: x.id, st: x.stage, i: x.items })))]).size;
  return `<div class="title-row"><h1>User testing &amp; role simulation</h1><span class="sp"></span>${S.role ? '' : '<a class="btn sec sm" href="#/login">← Login</a>'}</div>
  <div class="card"><h3>Persona switcher</h3><div class="row wrap" style="margin-top:8px">${Object.entries(ROLES).map(([k, r]) => `<button class="btn sec sm" style="border-left:4px solid ${r.color}" data-act="login" data-role="${k}">${BANNER[k]}</button>`).join('')}</div></div>
  <div class="kpis">${kpi('Sync payload', (payload / 1024 + 11.7).toFixed(1) + ' KB', 'Target ≤ 20 KB/screen')}${kpi('OCR match rate', '98.4%', 'Threshold 92%')}${kpi('POD geotags', S.orders.filter(o => o.pod).length + '/' + S.orders.filter(o => o.stage >= 13).length, 'Captured / due')}${kpi('Ledger chain', verifyLedger() ? 'OK' : 'BROKEN', S.ledger.length + ' entries')}</div>
  <div class="card"><h3>Scenario triggers</h3><div class="row wrap" style="margin-top:8px"><button class="btn sm" data-act="sim" data-v="fx">Admin · FX tick</button><button class="btn sm" data-act="sim" data-v="ocr">Buyer · OCR slip</button><button class="btn sm" data-act="sim" data-v="3g">Vendor · 3G sync</button><button class="btn sm" data-act="sim" data-v="pod">3PL · POD geotag</button><span class="sp"></span><button class="btn sec sm" data-act="reset">Reset demo data</button></div></div>
  <div class="card"><h3>Live event stream</h3><div class="stream" id="stream" style="margin-top:8px">${streamHtml()}</div></div>`;
};
const streamHtml = () => S.events.map(e => `<div><span class="t">${new Date(e.ts).toLocaleTimeString('en-GB')}</span> <span class="k">[${e.k}]</span> ${esc(e.m)}</div>`).join('');
function simulate(k) {
  if (k === 'fx') { const d = (Math.random() - .5) * 60; S.fx.rates.MMK = Math.max(5000, Math.round(S.fx.rates.MMK + d)); S.fx.rates.THB = +(S.fx.rates.THB + (Math.random() - .5) * .2).toFixed(2); S.fx.history.push(S.fx.rates.MMK); ev(S, 'admin-fx', `USD/MMK ${S.fx.rates.MMK} · USD/THB ${S.fx.rates.THB} · buffer ${S.fx.spread}%`); }
  if (k === 'ocr') ev(S, 'buyer-ocr', `Slip PP${Math.floor(Math.random() * 9e9)} · ${(95 + Math.random() * 4.5).toFixed(1)}% confidence · amount match`);
  if (k === '3g') { const kb = (13 + Math.random() * 2).toFixed(1); ev(S, 'vendor-3g', `Sync ${kb} KB over 3G/E-Edge @ 250 kbps · ${(kb * 8 / 250 * 1000).toFixed(0)} ms`); }
  if (k === 'pod') ev(S, '3pl-pod', `POD signature + photo captured · geotag ${(13.7 + Math.random() * .1).toFixed(4)}, ${(100.5 + Math.random() * .1).toFixed(4)}`);
  save();
}

/* ---------- Product management (supplier + admin) ---------- */
V.products = admin => {
  const list = mineP(admin ? '' : MYV), live = list.filter(p => p.live).length, base = admin ? '#/a/products' : '#/s/products';
  const card = p => `<div class="card"><div style="height:130px;border-radius:12px;overflow:hidden;margin-bottom:10px;background:#eef2f7">${art(p)}</div>
   <div class="row wrap"><b>${esc(p.n)}</b><span class="sp"></span><span class="chip ${p.live ? '' : 'gray'}">${p.live ? 'Live' : 'Not live'}</span></div>
   <div class="small muted">${esc(p.mm || '')}</div><div class="small muted">${esc(VENDORS.find(v => v.id === p.v)?.n || p.v)} · ${esc(p.cat)} · ${esc(p.from)}</div>
   <div class="row wrap small" style="margin:8px 0"><span class="chip gray">${mmk(p.unit)} / unit</span><span class="chip gray">MOQ ${p.moq}</span><span class="chip gray">${p.res}/${p.quota} reserved</span><span class="chip gray">${p.kg} kg</span></div><div class="small muted">${ic('pin')} Pickup: ${esc(whLabel(p))}</div>
   <div class="row wrap"><button class="switch ${p.live ? 'on' : ''}" data-act="p-live" data-id="${p.id}" role="switch" aria-checked="${p.live}" aria-label="Live in catalog"></button><span class="small">${p.live ? 'Visible to buyers' : 'Hidden from buyers'}</span><span class="sp"></span><button class="btn sec sm" data-act="p-edit" data-id="${p.id}">Edit</button><button class="btn bad sm" data-act="p-del" data-id="${p.id}">Delete</button></div></div>`;
  return `<a href="${admin ? '#/a/overview' : '#/s/stock'}" class="small">← ${admin ? 'Overview' : 'Stock'}</a><div class="title-row"><h1>Products</h1><span class="sp"></span><button class="btn" data-act="p-edit" data-id="">+ Add product</button></div>
  <p class="muted">${admin ? 'All suppliers’ batches. Switch a product off to hide it from buyers without deleting it.' : 'Your batches for ' + esc(vname()) + '. Switch a product off to hide it from buyers without deleting it.'}</p>
  <div class="kpis">${kpi('Products', list.length, 'in total')}${kpi('Live', live, 'visible to buyers')}${kpi('Not live', list.length - live, 'hidden')}</div>
  <div class="grid g2">${list.map(card).join('') || '<div class="empty card">No products yet. Tap “Add product”.</div>'}</div>`;
};
V.sproducts = () => V.products(false);
V.aproducts = () => V.products(true);
function whOpts(vid, sel) {
  const v = vendorOf(vid); if (!v) return '';
  return v.wh.filter(w => w.active || w.id === sel).map(w => `<option value="${w.id}" ${w.id === sel ? 'selected' : ''}>${esc(w.name)} · ${esc(w.city)}${w.active ? '' : ' (inactive)'}</option>`).join('');
}
function prodForm(id) {
  window._pimg = undefined;
  const ex = id ? prod(id) : null, admin = S.role === 'ADMIN';
  const p = ex || { n: '', mm: '', cat: CATS[0], v: MYV, unit: '', kg: '', moq: 10, quota: 50, res: 0, cut: 72, from: '', note: '', tag: 'New', live: false };
  const inp = (k, l, type = 'text', extra = '') => `<label class="f" for="pf-${k}">${l}</label><input class="inp" id="pf-${k}" type="${type}" value="${esc(p[k] ?? '')}" ${extra}>`;
  sheet(`<h3>${ex ? 'Edit product' : 'Add product'}</h3><div style="max-height:60vh;overflow:auto;padding:0 4px 8px">
  ${inp('n', 'Product name (English)', 'text', 'maxlength="80" autocomplete="off"')}${inp('mm', 'Product name (Burmese, optional)', 'text', 'maxlength="80" lang="my"')}
  <label class="f" for="pf-cat">Category</label><select class="sel" id="pf-cat">${CATS.map(c => `<option ${p.cat === c ? 'selected' : ''}>${c}</option>`).join('')}</select>
  ${admin ? `<label class="f" for="pf-v">Supplier</label><select class="sel" id="pf-v">${VENDORS.map(v => `<option value="${v.id}" ${p.v === v.id ? 'selected' : ''}>${esc(v.n)}</option>`).join('')}</select>` : ''}
  <label class="f" for="pf-wh">Pickup warehouse</label><select class="sel" id="pf-wh">${whOpts(p.v, p.wh)}</select><div class="small muted">Where the 3PL collects this batch. <a href="${admin ? '#/a/supplier/' + p.v : '#/s/profile'}" data-act="close">Manage warehouses</a></div>
  ${inp('from', 'Origin (town / region)', 'text', 'maxlength="60"')}
  <div class="grid" style="grid-template-columns:1fr 1fr;gap:10px"><div>${inp('unit', 'Unit price (MMK)', 'number', 'min="1" step="100" inputmode="numeric"')}</div><div>${inp('kg', 'Weight per unit (kg)', 'number', 'min="0.01" step="0.01" inputmode="decimal"')}</div><div>${inp('moq', 'Minimum order (MOQ)', 'number', 'min="1" step="1"')}</div><div>${inp('quota', 'Batch quota (units)', 'number', 'min="1" step="1"')}</div></div>
  ${inp('cut', 'Dispatch cutoff (hours from now)', 'number', 'min="1" step="1"')}${inp('tag', 'Badge text', 'text', 'maxlength="30"')}
  <label class="f" for="pf-note">Description</label><textarea class="inp" id="pf-note" rows="3" maxlength="200" style="height:auto">${esc(p.note || '')}</textarea>
  <label class="f" for="pf-file">Photo (optional)</label><div class="row" style="align-items:flex-start"><div id="pf-prev" style="width:96px;height:72px;border-radius:10px;overflow:hidden;background:#eef2f7;flex:none">${ex ? art(ex) : ''}</div><div class="small"><input type="file" accept="image/*" id="pf-file"><div class="muted" style="margin-top:4px">Resized automatically. ${ex && ex.img ? '<button class="btn sec sm" data-act="p-noimg">Remove photo</button>' : ''}</div></div></div>
  <label class="row" style="margin-top:14px;gap:10px"><input type="checkbox" id="pf-live" ${p.live ? 'checked' : ''}> <b>Live in catalog</b><span class="small muted">Buyers can see and reserve it</span></label></div>
  <div class="row" style="margin-top:12px"><button class="btn sec" data-act="close">Cancel</button><span class="sp"></span><button class="btn" data-act="p-save" data-id="${id || ''}">${ex ? 'Save changes' : 'Add product'}</button></div>`, 'modal');
}
document.addEventListener('change', e => {
  if (e.target.id === 'pf-v') { const wh = document.getElementById('pf-wh'); if (wh) wh.innerHTML = whOpts(e.target.value, ''); return; }
  if (e.target.id !== 'pf-file' || !e.target.files[0]) return;
  const r = new FileReader(); r.onload = () => { const im = new Image(); im.onload = () => { const s = Math.min(1, 640 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); window._pimg = c.toDataURL('image/jpeg', .72); const pv = document.getElementById('pf-prev'); if (pv) pv.innerHTML = `<img src="${window._pimg}" alt="" style="width:100%;height:100%;object-fit:cover">`; }; im.src = r.result; }; r.readAsDataURL(e.target.files[0]);
});
function saveProduct(id) {
  const g = k => document.getElementById('pf-' + k), ex = id ? prod(id) : null, admin = S.role === 'ADMIN';
  const n = g('n').value.trim(), unit = +g('unit').value, kg = +g('kg').value, moq = Math.round(+g('moq').value), quota = Math.round(+g('quota').value), cut = Math.round(+g('cut').value);
  if (!n) return toast('Product name is required'); if (!g('from').value.trim()) return toast('Origin is required');
  if (!(unit > 0)) return toast('Enter a unit price'); if (!(kg > 0)) return toast('Enter the weight per unit');
  if (!(moq >= 1)) return toast('MOQ must be at least 1'); if (!(quota >= moq)) return toast('Batch quota must be at least the MOQ');
  if (ex && quota < ex.res) return toast('Quota cannot be below ' + ex.res + ' units already reserved'); if (!(cut >= 1)) return toast('Enter the cutoff in hours');
  if (!g('wh').value) return toast('Add an active warehouse first');
  const d = { wh: g('wh').value, n, mm: g('mm').value.trim(), cat: g('cat').value, from: g('from').value.trim(), unit, kg, moq, quota, cut, tag: g('tag').value.trim() || 'New', note: g('note').value.trim() || '—', live: g('live').checked, v: admin ? g('v').value : (ex ? ex.v : MYV) };
  let p = ex;
  if (ex) Object.assign(ex, d); else { p = { id: 'P' + (Math.max(0, ...PRODUCTS.map(x => +x.id.slice(1) || 0)) + 1), res: 0, ...d }; PRODUCTS.push(p); }
  if (window._pimg) p.img = window._pimg; else if (window._pimg === null) delete p.img;
  ev(S, admin ? 'admin' : 'vendor', `${ex ? 'Edited' : 'Added'} product ${p.id} · ${p.n}${p.live ? ' · live' : ' · not live'}`);
  save(); closeSheet(); toast(ex ? 'Product updated' : 'Product added'); rerender();
}

/* ---------- Supplier profile & warehouses (supplier + admin on behalf) ---------- */
V.profile = (vid, admin) => {
  const v = vendorOf(vid); if (!v) return '';
  const used = w => PRODUCTS.filter(p => !p.del && p.v === v.id && p.wh === w.id).length, row = (l, x) => `<li><span>${l}</span><b style="text-align:right;max-width:60%;word-break:break-word">${x ? esc(x) : '<span class="muted">—</span>'}</b></li>`;
  const whCard = w => `<div class="card"><div class="row wrap"><b>${esc(w.name)}</b><span class="sp"></span><span class="chip ${w.active ? '' : 'gray'}">${w.active ? 'Active' : 'Inactive'}</span></div>
   <ul class="bd" style="margin:6px 0">${row('Address', w.addr)}${row('City / region', w.city)}${row('Contact', w.contact)}${row('Phone', w.phone)}${row('Pickup hours', w.hours)}${row('Products here', String(used(w)))}</ul>
   <div class="row wrap"><button class="switch ${w.active ? 'on' : ''}" data-act="w-live" data-id="${v.id}" data-w="${w.id}" role="switch" aria-checked="${w.active}" aria-label="Warehouse active"></button><span class="small">${w.active ? 'Available for new listings' : 'Hidden from product form'}</span><span class="sp"></span><button class="btn sec sm" data-act="w-edit" data-id="${v.id}" data-w="${w.id}">Edit</button><button class="btn bad sm" data-act="w-del" data-id="${v.id}" data-w="${w.id}">Delete</button></div></div>`;
  return `<a href="${admin ? '#/a/vendors' : '#/account'}" class="small">← ${admin ? 'Vendors' : 'Account'}</a><div class="title-row"><h1>Business &amp; warehouses</h1></div>
  ${admin ? `<div class="card"><span class="chip warn">Editing on behalf of ${esc(v.n)}</span><p class="small muted" style="margin-top:6px">Changes are logged as made by Admin.</p></div>` : ''}
  <div class="card"><div class="row wrap"><h3>Supplier details</h3><span class="sp"></span><button class="btn sec sm" data-act="v-edit" data-id="${v.id}">Edit details</button></div>
  <ul class="bd">${row('Business name', v.n)}${row('Contact person', v.contact)}${row('Phone', v.phone)}${row('City / region', v.city)}${row('Business address', v.addr)}${row('KYC', v.kyc + (v.tier !== '—' ? ' · ' + v.tier : ''))}</ul></div>
  <div class="title-row"><h3>Warehouses (${v.wh.length})</h3><span class="sp"></span><button class="btn" data-act="w-edit" data-id="${v.id}" data-w="">+ Add warehouse</button></div>
  <div class="grid g2">${v.wh.map(whCard).join('')}</div>`;
};
V.sprofile = () => V.profile(MYV, false);
const ffld = (k, l, val, type = 'text', extra = '') => `<label class="f" for="vf-${k}">${l}</label><input class="inp" id="vf-${k}" type="${type}" value="${esc(val ?? '')}" ${extra}>`;
function vendorForm(vid) {
  const v = vendorOf(vid);
  sheet(`<h3>Edit supplier details</h3><div style="max-height:58vh;overflow:auto;padding:0 4px 8px">${ffld('n', 'Business name', v.n, 'text', 'maxlength="80"')}${ffld('contact', 'Contact person', v.contact, 'text', 'maxlength="60"')}${ffld('phone', 'Phone / Viber', v.phone, 'tel', 'maxlength="30"')}${ffld('city', 'City / region', v.city, 'text', 'maxlength="60"')}${ffld('addr', 'Business address', v.addr, 'text', 'maxlength="140"')}</div>
  <div class="row" style="margin-top:12px"><button class="btn sec" data-act="close">Cancel</button><span class="sp"></span><button class="btn" data-act="v-save" data-id="${vid}">Save details</button></div>`, 'modal');
}
function whForm(vid, wid) {
  const v = vendorOf(vid), w = wid ? v.wh.find(x => x.id === wid) : { name: '', addr: '', city: '', contact: '', phone: '', hours: '09:00–17:00', active: true };
  sheet(`<h3>${wid ? 'Edit warehouse' : 'Add warehouse'}</h3><div style="max-height:58vh;overflow:auto;padding:0 4px 8px">${ffld('name', 'Warehouse name', w.name, 'text', 'maxlength="80"')}${ffld('addr', 'Address', w.addr, 'text', 'maxlength="140"')}${ffld('wcity', 'City / region', w.city, 'text', 'maxlength="60"')}${ffld('wcontact', 'Contact person', w.contact, 'text', 'maxlength="60"')}${ffld('wphone', 'Phone', w.phone, 'tel', 'maxlength="30"')}${ffld('hours', 'Pickup hours', w.hours, 'text', 'maxlength="30"')}
  <label class="row" style="margin-top:14px;gap:10px"><input type="checkbox" id="vf-active" ${w.active ? 'checked' : ''}> <b>Active</b><span class="small muted">Can be chosen when listing products</span></label></div>
  <div class="row" style="margin-top:12px"><button class="btn sec" data-act="close">Cancel</button><span class="sp"></span><button class="btn" data-act="w-save" data-id="${vid}" data-w="${wid || ''}">${wid ? 'Save warehouse' : 'Add warehouse'}</button></div>`, 'modal');
}
const vg = k => document.getElementById('vf-' + k).value.trim();
const editLog = (what) => ev(S, S.role === 'ADMIN' ? 'admin' : 'vendor', (S.role === 'ADMIN' ? 'Admin (on behalf) · ' : '') + what);
function saveVendor(vid) {
  const v = vendorOf(vid); if (!vg('n')) return toast('Business name is required'); if (!vg('city')) return toast('City is required');
  Object.assign(v, { n: vg('n'), contact: vg('contact'), phone: vg('phone'), city: vg('city'), addr: vg('addr') });
  editLog(`Updated supplier details · ${v.n}`); save(); closeSheet(); toast('Details saved'); rerender();
}
function saveWh(vid, wid) {
  const v = vendorOf(vid); if (!vg('name')) return toast('Warehouse name is required'); if (!vg('wcity')) return toast('City is required');
  const d = { name: vg('name'), addr: vg('addr'), city: vg('wcity'), contact: vg('wcontact'), phone: vg('wphone'), hours: vg('hours'), active: document.getElementById('vf-active').checked };
  if (wid) Object.assign(v.wh.find(x => x.id === wid), d); else v.wh.push({ id: v.id + '-W' + (Math.max(0, ...v.wh.map(x => +x.id.split('-W')[1] || 0)) + 1), ...d });
  editLog(`${wid ? 'Updated' : 'Added'} warehouse "${d.name}" · ${v.n}`); save(); closeSheet(); toast(wid ? 'Warehouse saved' : 'Warehouse added'); rerender();
}

/* ---------- Burmese page titles ---------- */
const PAGE_MM = {
  catalog: ['ကတ်တလောက်', 'အင်းလေးပိုးနှင့် ပုဂံယွန်းထည်'], cart: ['ကြိုတင်မှာယူမှု'], orders: ['အော်ဒါများ'], cargo: ['ကုန်စည်ခြေရာခံခြင်း'], lab: ['အသုံးပြုသူ စမ်းသပ်မှုနှင့် အခန်းကဏ္ဍ ပုံစံတူ'],
  'a/alerts': ['သတိပေးချက်များ'], 's/profile': ['လုပ်ငန်းနှင့် ကုန်လှောင်ရုံများ'], 'a/supplier': ['လုပ်ငန်းနှင့် ကုန်လှောင်ရုံများ'], 's/products': ['ကုန်ပစ္စည်းများ'], 'a/products': ['ကုန်ပစ္စည်းများ'], 'a/options': ['မှာယူမှု ရွေးချယ်စရာများ'],
  's/orders': ['အော်ဒါများ'], 's/stock': ['စတော့'], 's/payouts': ['ငွေထုတ်ယူမှု'],
  'l/manifest': ['ကုန်စည် မန်နီဖက်စ်'], 'l/transit': ['ပို့ဆောင်ဆဲ'], 'l/pod': ['ပို့ဆောင်ပြီးကြောင်း အထောက်အထား'],
  'a/overview': ['လုပ်ငန်းလည်ပတ်မှု အနှစ်ချုပ်'], 'a/fx': ['ငွေလွှဲနှုန်းနှင့် အမြတ်ခွန်အင်ဂျင်'], 'a/vendors': ['ကုန်သည် စိစစ်ခြင်းနှင့် KYC'], 'a/escrow': ['အာမခံငွေနှင့် စာရင်းဇယား'], 'a/roles': ['အခန်းကဏ္ဍအလိုက် ခွင့်ပြုချက်'],
  home: ['ပင်မ ဒက်ရှ်ဘုတ်'], account: ['အကောင့်နှင့် ဆက်တင်များ'], invoices: ['ငွေတောင်းခံလွှာများ'], 's/home': ['ကုန်သည် ပင်မစာမျက်နှာ'], 'l/home': ['ပို့ဆောင်ရေး ပင်မစာမျက်နှာ'], 'a/orders': ['အော်ဒါအားလုံး'],
  login: ['အင်ဖင်နီတီ ပလပ်စ် — ကုန်သွယ်ရေး တံခါးဝ']
};
function addMmTitle(a, b) {
  const key = ['s', 'l', 'a'].includes(a) ? a + '/' + b : a, m = PAGE_MM[key], h1 = $('#app h1');
  if (m && h1 && !/[က-႟]/.test(h1.textContent)) {
    const s = document.createElement('div'); s.className = 'mm-sub'; s.lang = 'my'; s.textContent = m[1] && a === 'catalog' ? m[1] : m[0];
    if (a === 'catalog') { h1.after(s); } else if (h1.parentElement.classList.contains('title-row')) { const w = document.createElement('div'); h1.replaceWith(w); w.append(h1, s); } else h1.after(s);
  }
  const en = { catalog: 'Catalog', cart: 'Pre-order', orders: 'Orders', cargo: 'Cargo', lab: 'Test Lab', login: 'Sign in' }[key] || (h1 ? h1.textContent : '');
  document.title = (en ? en + (m ? ' · ' + m[0] : '') + ' — ' : '') + "Cindy's Choices";
}

/* ---------- Burmese labels for buttons, section titles and nav ---------- */
const MM = {
  'Reserve batch': 'ကြိုတင်မှာမည်', 'Update reservation': 'ကြိုတင်မှာယူမှု ပြင်မည်', 'Cost breakdown': 'ကုန်ကျစရိတ် ခွဲခြမ်းချက်', 'Browse catalog': 'ကတ်တလောက် ကြည့်မည်', 'Pay & upload slip': 'ငွေပေးချေပြီး ဘောင်ချာတင်မည်',
  'Cancel': 'မလုပ်တော့ပါ', 'Fund escrow': 'အာမခံငွေ ထည့်မည်', 'Submit for review': 'စိစစ်ရန် တင်မည်', 'Use sample slip': 'နမူနာ ဘောင်ချာ သုံးမည်', 'Sample blurry slip': 'မှုန်သော နမူနာ ဘောင်ချာ',
  'Close': 'ပိတ်မည်', 'Done': 'ပြီးပါပြီ', 'Confirm delivery': 'လက်ခံရရှိကြောင်း အတည်ပြုမည်', 'Clear': 'ဖျက်မည်', 'Raise a dispute': 'အငြင်းပွားမှု တင်မည်', 'Confirm delivery & sign POD': 'လက်ခံရရှိကြောင်း လက်မှတ်ထိုးမည်',
  'Sign POD': 'POD လက်မှတ်ထိုးမည်', 'Capture POD': 'POD မှတ်တမ်းတင်မည်', 'Capture': 'မှတ်တမ်းတင်မည်', 'Mark customs cleared': 'အကောက်ခွန် ပြီးစီးကြောင်း မှတ်မည်', 'Generate MAWB & dispatch': 'MAWB ထုတ်ပြီး စတင်ပို့မည်',
  'Verify': 'အတည်ပြုမည်', 'Reject': 'ပယ်ချမည်', 'Release to vendor': 'ကုန်သည်သို့ လွှတ်မည်', 'Partial credit': 'တစ်စိတ်တစ်ပိုင်း ပြန်အမ်းမည်', 'Approve': 'ခွင့်ပြုမည်', 'Apply override': 'လက်ဖြင့်နှုန်း သုံးမည်',
  'Resume automatic': 'အလိုအလျောက် ပြန်သုံးမည်', 'Force release balance': 'လက်ကျန် အတင်းလွှတ်မည်', 'Admin · FX tick': 'Admin · FX ပြောင်းလဲမှု', 'Buyer · OCR slip': 'ဝယ်သူ · OCR ဘောင်ချာ', 'Vendor · 3G sync': 'ကုန်သည် · 3G ချိတ်ဆက်မှု',
  '3PL · POD geotag': '3PL · POD တည်နေရာ', 'Reset demo data': 'စမ်းသပ်ဒေတာ ပြန်စမည်', 'Print / save PDF': 'ပရင့်ထုတ် / PDF သိမ်းမည်', 'View': 'ကြည့်မည်', 'All orders': 'အော်ဒါအားလုံး', 'Build manifest': 'မန်နီဖက်စ် ပြုလုပ်မည်',
  'In transit': 'ပို့ဆောင်ဆဲ', 'Pre-order': 'ကြိုတင်မှာယူမှု', 'Invoices': 'ငွေတောင်းခံလွှာများ', 'Track cargo': 'ကုန်စည် ခြေရာခံမည်', 'Role rights matrix': 'အခန်းကဏ္ဍ ခွင့်ပြုချက်', 'Test lab': 'စမ်းသပ်ခန်း',
  'Accept order': 'အော်ဒါ လက်ခံမည်', 'Decline': 'ငြင်းမည်', 'Confirm stock on shelf': 'စတော့ အတည်ပြုမည်', 'Print QR label': 'QR တံဆိပ် ထုတ်မည်', 'Packed — ready for pickup': 'ထုပ်ပိုးပြီး — ကောက်ယူရန်ရပြီ', 'Switch role': 'အခန်းကဏ္ဍ ပြောင်းမည်',
  'Secure sign-in': 'လုံခြုံစွာ ဝင်ရောက်မည်', 'Open test & role-simulation lab': 'စမ်းသပ်ခန်း ဖွင့်မည်', 'Apply': 'သုံးမည်', 'Active': 'လက်ရှိ', 'Delivered': 'ပို့ပြီး', 'Attention': 'အာရုံစိုက်ရန်',
  'All batches': 'အားလုံး', 'All': 'အားလုံး', 'Textiles': 'ပိုးထည်အထည်', 'Lacquerware': 'ယွန်းထည်', 'Tea & Coffee': 'လက်ဖက်နှင့် ကော်ဖီ', 'Gems & Jewelry': 'ကျောက်မျက်နှင့် လက်ဝတ်ရတနာ', 'Wellness': 'ကျန်းမာရေး',
  'Consignment': 'အပ်နှံရောင်းချမှု', 'Consignment terms': 'အပ်နှံစည်းမျဉ်းများ', 'Order type': 'မှာယူမှုပုံစံ', 'Report sales': 'ရောင်းရမှု ပို့ရန်', 'Settle now': 'ယခု ပေးချေမည်', 'Extend +30 days': 'ရက် ၃၀ တိုးမည်', 'Buy out remainder': 'ကျန်ပစ္စည်း ဝယ်မည်', 'Return unsold': 'မရောင်းရသည် ပြန်ပို့', 'Send settlement reminder': 'ပေးချေရန် သတိပေးမည်', 'Report & settle': 'ပို့၍ ပေးချေမည်',
  'Order options': 'မှာယူမှု ရွေးချယ်စရာများ', 'Pay later': 'နောက်မှ ပေးချေမည်', 'Deliver later': 'နောက်မှ ပို့ဆောင်မည်', 'Payment': 'ငွေပေးချေမှု', 'Delivery': 'ပို့ဆောင်မှု', 'Flexible terms': 'ပြောင်းလွယ်စည်းမျဉ်း', 'Pay later terms': 'နောက်မှပေးချေမှု စည်းမျဉ်း', 'Pay now': 'ယခု ပေးမည်', 'Release hold now': 'ယခု ထုတ်ပို့ရန် ဖွင့်မည်', 'Save fees': 'ကြေးများ သိမ်းမည်', 'Reset to defaults': 'မူလအတိုင်း ပြန်ထားမည်',
  'Send for quality check': 'အရည်အသွေးစစ်ရန် ပို့မည်', 'Pass quality check': 'အရည်အသွေး အောင်မြင်', 'Quality check queue': 'အရည်အသွေးစစ်ဆေးရန် စာရင်း', 'Pass': 'အောင်', 'Fail': 'ကျ', 'Business & warehouses': 'လုပ်ငန်းနှင့် ကုန်လှောင်ရုံများ', 'Warehouses': 'ကုန်လှောင်ရုံများ', 'Supplier details': 'ကုန်သည် အချက်အလက်', 'Edit details': 'အချက်အလက် ပြင်မည်', '+ Add warehouse': '+ ကုန်လှောင်ရုံ ထည့်ရန်', 'Add warehouse': 'ကုန်လှောင်ရုံ ထည့်ရန်', 'Edit warehouse': 'ကုန်လှောင်ရုံ ပြင်ရန်', 'Save details': 'အချက်အလက် သိမ်းမည်', 'Save warehouse': 'ကုန်လှောင်ရုံ သိမ်းမည်', 'Delete warehouse?': 'ကုန်လှောင်ရုံ ဖျက်မလား?', 'Profile & warehouses': 'ပရိုဖိုင်နှင့် ကုန်လှောင်ရုံ', 'Manage products': 'ကုန်ပစ္စည်း စီမံရန်', 'Alerts': 'သတိပေးချက်များ', 'Latest alerts': 'နောက်ဆုံး သတိပေးချက်များ', 'Mark all read': 'အားလုံး ဖတ်ပြီးပြု', 'Clear read': 'ဖတ်ပြီးသည်များ ဖယ်ရန်', 'View all →': 'အားလုံးကြည့်ရန် →', 'Next →': 'ရှေ့ဆက်မည် →', 'Next': 'ရှေ့ဆက်မည်', '+ Add product': '+ ကုန်ပစ္စည်း ထည့်ရန်', 'Add product': 'ကုန်ပစ္စည်း ထည့်ရန်', 'Edit product': 'ကုန်ပစ္စည်း ပြင်ရန်', 'Edit': 'ပြင်မည်', 'Delete': 'ဖျက်မည်', 'Save changes': 'ပြောင်းလဲမှု သိမ်းမည်', 'Delete product?': 'ကုန်ပစ္စည်း ဖျက်မလား?', 'Remove photo': 'ဓာတ်ပုံ ဖယ်ရှားမည်', 'Products': 'ကုန်ပစ္စည်းများ', 'Pickup preparation':'ပစ္စည်းလာယူရန် ပြင်ဆင်မှု', 'Cargo moving': 'ကုန်စည် သွားနေ', 'Needs attention': 'စစ်ဆေးရန်လို',
  'Home': 'ပင်မ', 'Catalog': 'ကတ်တလောက်', 'Orders': 'အော်ဒါများ', 'Cargo': 'ကုန်စည်', 'Account': 'အကောင့်', 'Stock': 'စတော့', 'Payouts': 'ငွေထုတ်', 'Manifest': 'မန်နီဖက်စ်', 'POD': 'POD', 'Overview': 'အနှစ်ချုပ်', 'FX Engine': 'FX', 'Vendors': 'ကုန်သည်များ', 'Escrow': 'အာမခံငွေ', 'Test Lab': 'စမ်းသပ်ခန်း',
  /* section titles */
  'Landed cost': 'ရောက်ရှိကုန်ကျစရိတ်', 'Items': 'ကုန်ပစ္စည်းများ', 'Payment slip': 'ငွေပေးချေ ဘောင်ချာ', 'Order journey · 14 stages': 'အော်ဒါ ခရီးစဉ် · အဆင့် ၁၄', 'Weight intake & consolidation': 'အလေးချိန် မှတ်သားခြင်းနှင့် ပေါင်းစည်းခြင်း',
  'Review queue': 'စိစစ်ရန် စာရင်း', 'Disputes': 'အငြင်းပွားမှုများ', 'Order pipeline': 'အော်ဒါ လုပ်ငန်းစဉ်', 'Spread & margin': 'ကွာဟချက်နှင့် အမြတ်ခွန်', 'Manual rate override': 'လက်ဖြင့် နှုန်းပြောင်းခြင်း', 'MMK / USD · last ticks': 'MMK / USD · နောက်ဆုံး ပြောင်းလဲမှုများ',
  'Release overrides': 'ငွေလွှတ်ခြင်း အစားထိုး', 'Double-entry ledger': 'နှစ်ဘက်ခြင်း စာရင်းဇယား', 'Persona switcher': 'အခန်းကဏ္ဍ ပြောင်းရန်', 'Scenario triggers': 'အခြေအနေ စမ်းသပ်ရန်', 'Live event stream': 'တိုက်ရိုက် ဖြစ်ရပ်များ',
  'Batches closing soon': 'ပိတ်ခါနီး ကုန်လော့များ', 'Latest updates': 'နောက်ဆုံး သတင်းများ', 'Active orders': 'လက်ရှိ အော်ဒါများ', 'Active shipments': 'လက်ရှိ ပို့ဆောင်မှုများ', 'Language': 'ဘာသာစကား', 'Language & currency': 'ဘာသာစကားနှင့် ငွေကြေး',
  'Notifications': 'အသိပေးချက်များ', 'Help & support': 'အကူအညီနှင့် ပံ့ပိုးမှု', 'Recent activity': 'မကြာမီ လှုပ်ရှားမှုများ', 'Awaiting POD': 'POD စောင့်ဆိုင်းဆဲ', 'Items & totals': 'ပစ္စည်းနှင့် စုစုပေါင်း', 'Escrow vault': 'အာမခံငွေ ဘဏ္ဍာ',
  'No batches reserved yet': 'ကြိုတင်မှာယူထားသည် မရှိသေးပါ', 'Admin': 'အုပ်ချုပ်သူ', 'Buyer': 'ဝယ်သူ', 'Supplier': 'ကုန်သည်', 'Delivery': 'ပို့ဆောင်ရေး',
  'Sync payload': 'ချိတ်ဆက်ဒေတာ', 'Spread': 'ကွာဟချက်'
};
const MM_PREFIX = [['Proof of delivery', 'ပို့ဆောင်ပြီးကြောင်း အထောက်အထား'], ['Pay ', 'ငွေပေးချေမည်'], ['QR label', 'QR တံဆိပ်'], ['Tax invoice', 'အခွန်ငွေတောင်းခံလွှာ'], ['Bagan', ''], ['Welcome', '']];
function mmFor(text) {
  const k = text.replace(/\s+/g, ' ').replace(/^[←→\s]+|[←→\s]+$/g, '').replace(/\s*\(\d+\)$/, '').trim();
  if (!k || /[က-႟]/.test(k)) return '';
  if (MM[k]) return MM[k];
  const pr = PRODUCTS.find(x => x.n === k); if (pr) return pr.mm;
  for (const [p, m] of MM_PREFIX) if (m && k.startsWith(p)) return m;
  return '';
}
function localizeMm(root) {
  if (!root) return;
  root.querySelectorAll('.btn, .pills button, .seg button, h2, h3, nav a').forEach(el => {
    if (el.dataset.mm || el.querySelector('input,select,textarea')) return;
    const nav = el.matches('nav a'), span = nav ? el.querySelector('span:not(.badge)') : null;
    const m = mmFor((span || el).textContent); if (!m) return;
    el.dataset.mm = '1';
    const s = document.createElement('span'); s.className = 'mm-l'; s.lang = 'my'; s.textContent = m;
    if (nav) { span.after(s); el.classList.add('has-mm'); return; }
    if (el.matches('h2,h3')) { el.append(s); s.classList.add('blk'); return; }
    const w = document.createElement('span'); w.className = 'bt'; while (el.firstChild) w.appendChild(el.firstChild);
    el.append(w, s); el.classList.add('has-mm');
  });
}

/* ---------- router / chrome ---------- */
function route() {
  const h = location.hash || '#/login', [, a, b, c] = h.split('/');
  if (!S.role && h !== '#/lab') { if (h !== '#/login') { location.hash = '#/login'; return; } }
  let html;
  const map = { home: V.bhome, account: V.account, invoices: V.invoices, login: V.login, catalog: V.catalog, product: () => V.product(b), cart: V.cart, orders: V.orders, order: () => V.order(b), cargo: V.cargo, lab: V.lab };
  if (a === 's') html = { home: V.shome, orders: V.sorders, stock: V.sstock, payouts: V.spayouts, products: V.sproducts, profile: V.sprofile }[b]?.();
  else if (a === 'l') html = { home: V.lhome, manifest: V.manifest, transit: V.transit, pod: V.podlist }[b]?.();
  else if (a === 'a') html = { overview: V.aoverview, orders: V.aorders, fx: V.afx, vendors: V.avendors, escrow: V.aescrow, roles: V.aroles, options: V.aoptions, products: V.aproducts, alerts: V.aalerts, supplier: () => V.profile(c, true) }[b]?.();
  else html = map[a]?.();
  const bo = ['home', 'catalog', 'product', 'cart', 'orders', 'cargo', 'invoices'];
  if (S.role && ((a === 's' && S.role !== 'SUPPLIER') || (a === 'l' && S.role !== 'DELIVERY') || (a === 'a' && S.role !== 'ADMIN') || (bo.includes(a) && S.role !== 'BUYER'))) { location.hash = ROLES[S.role].home; return; }
  if (!html) { location.hash = S.role ? ROLES[S.role].home : '#/login'; return; }
  const r = S.role;
  document.body.dataset.role = r || ''; document.body.dataset.lang = S.lang; document.documentElement.lang = S.lang === 'mm' ? 'my' : S.lang;
  document.body.className = (a === 'login' || !r) ? 'nologin' : '';
  $('#app').innerHTML = html;
  addMmTitle(a, b);
  const cr = $('#chrome');
  if (r && a !== 'login') {
    cr.innerHTML = `<div class="rolebar"><span class="dot"></span>${BANNER[r]} · ${ROLES[r].name}<span class="sp"></span><button data-act="logout">${ic('out')} ${t('logout')}</button></div><header class="top"><a class="brand" href="${ROLES[r].home}"><svg width="30" height="30" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0D5C4D"/><path d="M32 32c-5-9-17-9-17 0s12 9 17 0 12-9 17 0-12 9-17 0z" fill="none" stroke="#D4AF37" stroke-width="5" stroke-linecap="round"/></svg><span><b>Cindy's Choices</b><small>Infinity Plus by Cindy</small></span></a><span class="tb-sp"></span><span class="small muted" style="display:none" id="who">${esc(ROLES[r].user)}</span>${r === 'ADMIN' ? `<a class="bell" href="#/a/alerts" aria-label="Alerts${unreadN() ? ', ' + unreadN() + ' new' : ''}">${ic('bell')}${unreadN() ? `<b>${unreadN() > 99 ? '99+' : unreadN()}</b>` : ''}</a>` : ''}<div class="langs" style="margin:0;padding:2px">${[['mm', 'မြ'], ['en', 'EN'], ['th', 'ไทย']].map(([k, n]) => `<button style="padding:4px 10px" class="${S.lang === k ? 'on' : ''}" data-act="lang" data-v="${k}">${n}</button>`).join('')}</div></header>`;
    const cartN = S.cart.length;
    $('#nav').innerHTML = NAV[r].map(([href, i, k]) => `<a href="${href}" class="${h.startsWith(href) || (k === 'orders' && h.startsWith('#/order/')) ? 'on' : ''}">${ic(i)}<span>${t(k)}</span>${k === 'cart' && cartN ? `<span class="badge">${cartN}</span>` : ''}</a>`).join('');
  } else { cr.innerHTML = ''; $('#nav').innerHTML = ''; }
  ['#app', '#nav'].forEach(s => localizeMm($(s)));
  window.scrollTo(0, 0);
}
const rerender = () => { const y = scrollY; route(); scrollTo(0, y); };

/* ---------- events ---------- */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const a = el.dataset.act, id = el.dataset.id, v = el.dataset.v;
  switch (a) {
    case 'close': closeSheet(); if (S.pay) { S.pay = null; } break;
    case 'login': S.role = el.dataset.role; S.lang === 'en' && 0; ev(S, 'auth', `${ROLES[S.role].name} signed in`); if (S.role === 'BUYER') S.cur = S.cur || 'THB'; save(); location.hash = ROLES[S.role].home; if (location.hash === ROLES[S.role].home) route(); break;
    case 'phone': S.role = 'BUYER'; save(); location.hash = ROLES.BUYER.home; break;
    case 'logout': S.role = null; save(); location.hash = '#/login'; break;
    case 'lang': S.lang = v; save(); rerender(); break;
    case 'aflt': AF = v; rerender(); break;
    case 'cat': CAT = v; rerender(); break;
    case 'otab': OTAB = v; rerender(); break;
    case 'breakdown': { const p = prod(id), q = Math.max(p.moq, +$('#qty').value || p.moq); sheet(breakdownHtml([{ p: id, q }], S.cur, `${p.n} × ${q}`) + '<button class="btn sec" style="width:100%;margin-top:12px" data-act="close">Close</button>'); break; }
    case 'obd': { const o = ord(id); sheet(breakdownHtml(o.items, o.cur, o.id + ' landed cost') + '<button class="btn sec" style="width:100%;margin-top:12px" data-act="close">Close</button>'); break; }
    case 'reserve': { const p = prod(id), q = Math.round(+$('#qty').value); if (!p.live || p.del) return toast('This batch is not available'); if (!(q >= p.moq)) return toast('Minimum order is ' + p.moq); if (q > p.quota - p.res) return toast('Only ' + (p.quota - p.res) + ' units left'); const c = S.cart.find(x => x.p === id); c ? c.q = q : S.cart.push({ p: id, q }); save(); toast('Reserved ' + q + ' units'); location.hash = '#/cart'; break; }
    case 'rm': S.cart = S.cart.filter(x => x.p !== id); save(); rerender(); break;
    case 'pay': { const d = S.cons; if (d) sanitizeDraft(d); if (d && ((d.on && d.dep === 0) || d.later)) { S.pay = { ocr: { ref: 'CONSIGN-' + S.nextOrder, amt: 0, ts: Date.now(), conf: 100 } }; placeOrder(); break; } S.pay = null; payScreen(); break; }
    case 'cons': { const d = consDraft(), k = el.dataset.k; if (k === 'pm') { d.on = v === 'cons'; d.later = v === 'later' ? (d.later || opts().later.days[0]) : 0; } else if (['later', 'defer'].includes(k)) d[k] = +v;   /* consignment terms are admin-set */ save(); rerender(); break; }
    case 'l-pay': { const o = ord(id), l = o.later; postLedger(S, o, 'Buyer Funds', 'Platform Float', l.grossMMK, 'Pay-later settlement'); l.paid = true; ev(S, 'buyer', `${o.id} pay-later settled ${mmk(l.grossMMK)}`); save(); toast('Payment recorded'); rerender(); break; }
    case 'd-release': { const o = ord(id); o.defer.released = true; ev(S, S.role === 'ADMIN' ? 'admin' : S.role === 'BUYER' ? 'buyer' : '3pl', `${o.id} dispatch hold released`); save(); toast('Hold released · cargo can be dispatched'); rerender(); break; }
    case 'opt-on': { const O = opts(); O[el.dataset.k].on = !O[el.dataset.k].on; ev(S, 'admin', `Option "${el.dataset.k}" ${O[el.dataset.k].on ? 'enabled' : 'disabled'}`); save(); rerender(); break; }
    case 'opt-set': { const O = opts(), k = el.dataset.k; O.cons[k] = (k === 'dep' || k === 'term') ? +v : v; ev(S, 'admin', `Consignment ${k} set to ${v}`); save(); rerender(); break; }
    case 'opt-tog': { const O = opts(), arr = O[el.dataset.g][el.dataset.k], n = +v, i = arr.indexOf(n); if (i >= 0) { if (arr.length === 1) return toast('Keep at least one choice'); arr.splice(i, 1); } else { arr.push(n); arr.sort((x, y) => x - y); } ev(S, 'admin', `Option choices updated · ${el.dataset.g}`); save(); rerender(); break; }
    case 'opt-ext': { opts().cons.extMax = +v; save(); rerender(); break; }
    case 'opt-fee': { const O = opts(); document.querySelectorAll('.ofee').forEach(x => { const n = parseFloat(x.value); if (n >= 0 && n <= 30) O[x.dataset.g].fee[x.dataset.d] = n; }); ev(S, 'admin', 'Option fees updated'); save(); toast('Fees saved'); rerender(); break; }
    case 'opt-reset': S.opts = null; opts(); ev(S, 'admin', 'Order options reset to defaults'); save(); toast('Defaults restored'); rerender(); break;
    case 'al-open': { const a = (S.alerts || []).find(x => x.id === id); if (a) { a.read = true; save(); } break; }
    case 'al-all': (S.alerts || []).forEach(a => { a.read = true; }); save(); rerender(); break;
    case 'al-clear': S.alerts = (S.alerts || []).filter(a => !a.read); save(); rerender(); break;
    case 'al-flt': ALF = v; rerender(); break;
    case 'v-edit': vendorForm(id); break;
    case 'v-save': saveVendor(id); break;
    case 'w-edit': whForm(id, el.dataset.w); break;
    case 'w-save': saveWh(id, el.dataset.w); break;
    case 'w-live': { const w = vendorOf(id).wh.find(x => x.id === el.dataset.w); w.active = !w.active; editLog(`Warehouse "${w.name}" ${w.active ? 'activated' : 'deactivated'}`); save(); rerender(); break; }
    case 'w-del': { const vd = vendorOf(id), w = vd.wh.find(x => x.id === el.dataset.w), n = PRODUCTS.filter(p => !p.del && p.v === id && p.wh === w.id).length; if (vd.wh.length <= 1) return toast('Keep at least one warehouse'); if (n) return toast(`Move ${n} product(s) to another warehouse first`); sheet(`<h3>Delete warehouse?</h3><p style="margin:8px 0"><b>${esc(w.name)}</b> will be removed. This cannot be undone.</p><div class="row"><button class="btn sec" data-act="close">Cancel</button><span class="sp"></span><button class="btn bad" data-act="w-del-ok" data-id="${id}" data-w="${w.id}">Delete</button></div>`, 'modal'); break; }
    case 'w-del-ok': { const vd = vendorOf(id), w = vd.wh.find(x => x.id === el.dataset.w); vd.wh = vd.wh.filter(x => x !== w); editLog(`Deleted warehouse "${w.name}" · ${vd.n}`); save(); closeSheet(); toast('Warehouse deleted'); rerender(); break; }
    case 'p-edit': prodForm(id); break;
    case 'p-save': saveProduct(id); break;
    case 'p-noimg': window._pimg = null; { const pv = $('#pf-prev'); if (pv) pv.innerHTML = ''; } break;
    case 'p-live': { const p = prod(id); p.live = !p.live; ev(S, S.role === 'ADMIN' ? 'admin' : 'vendor', `${p.n} ${p.live ? 'is now live' : 'taken offline'}`); save(); toast(p.live ? 'Live in catalog' : 'Hidden from buyers'); rerender(); break; }
    case 'p-del': { const p = prod(id); sheet(`<h3>Delete product?</h3><p style="margin:8px 0"><b>${esc(p.n)}</b> will be removed from the catalog and your product list. Existing orders keep their records. This cannot be undone.</p><div class="row"><button class="btn sec" data-act="close">Cancel</button><span class="sp"></span><button class="btn bad" data-act="p-del-ok" data-id="${id}">Delete</button></div>`, 'modal'); break; }
    case 'p-del-ok': { const p = prod(id); p.del = true; p.live = false; S.cart = S.cart.filter(c => c.p !== id); ev(S, S.role === 'ADMIN' ? 'admin' : 'vendor', `Deleted product ${p.id} · ${p.n}`); save(); closeSheet(); toast('Product deleted'); rerender(); break; }
    case 'c-report': { const o = ord(id), c = o.cons; sheet(`<h3>Report sales · ${o.id}</h3><p class="small muted">Enter total units sold so far. You pay only for what has sold; your deposit is credited first.</p>${o.items.map(i => `<div class="row" style="margin:10px 0"><span><b>${prod(i.p).n}</b><small class="muted" style="display:block">of ${i.q} units</small></span><span class="sp"></span><input class="cs" type="number" inputmode="numeric" min="${c.sold[i.p] || 0}" max="${i.q}" value="${c.sold[i.p] || 0}" data-p="${i.p}" style="width:84px;padding:8px;border:1px solid #cbd5e1;border-radius:8px" aria-label="Units sold"></div>`).join('')}<div class="row" style="margin-top:12px"><button class="btn sec" data-act="close">Cancel</button><span class="sp"></span><button class="btn" data-act="c-report-ok" data-id="${o.id}">Report &amp; settle</button></div>`); break; }
    case 'c-report-ok': { const o = ord(id), c = o.cons; document.querySelectorAll('.cs').forEach(x => { const i = o.items.find(y => y.p === x.dataset.p); c.sold[i.p] = Math.max(c.sold[i.p] || 0, Math.min(i.q, Math.round(+x.value) || 0)); }); closeSheet(); consSettle(o, 'sales report'); rerender(); break; }
    case 'c-settle': consSettle(ord(id), 'payment'); rerender(); break;
    case 'c-extend': { const o = ord(id), c = o.cons; if (c.ext >= opts().cons.extMax) return toast('Extension limit reached'); c.ext++; c.due += 30 * 24 * H; ev(S, 'buyer', `${o.id} consignment extended +30 days`); save(); toast('Term extended by 30 days'); rerender(); break; }
    case 'c-buyout': { const o = ord(id), c = o.cons, s0 = consStatus(o); c.disc = Math.round((c.disc || 0) + s0.leftVal * 0.1); o.items.forEach(i => { c.sold[i.p] = i.q; }); ev(S, 'buyer', `${o.id} remaining ${s0.left} units bought out at −10%`); consSettle(o, 'buy-out', true); rerender(); break; }
    case 'c-return': { const o = ord(id), s0 = consStatus(o); ev(S, 'buyer', `${o.id} ${s0.left} unsold unit(s) returned`); o.cons.ret = s0.left; consSettle(o, 'return', true); rerender(); break; }
    case 'a-remind': ev(S, 'admin', `Settlement reminder sent for ${id}`); save(); toast('Reminder sent to buyer'); break;
    case 'sample': runOcr('sample' + v + Date.now(), 1, v === '1'); break;
    case 'place': placeOrder(); break;
    case 'pod': podSheet(id); break;
    case 'sigclear': { const c = $('#sig'); c.getContext('2d').clearRect(0, 0, c.width, c.height); c.dataset.drawn = ''; break; }
    case 'podok': { const c = $('#sig'), n = $('#pn').value.trim(); if (!n || !c.dataset.drawn) return toast('Name and signature required'); const o = ord(id); o.pod = { by: n, ts: Date.now(), geo: window._geo || 'n/a' }; if (o.ship) o.ship.st = 'Delivered'; advance(o, 14, S.role === 'BUYER' ? 'buyer-pod' : '3pl-pod'); closeSheet(); toast('POD signed · balance released to vendor'); rerender(); break; }
    case 'dispute': { const o = ord(id); o.status = 'dispute'; S.disputes.unshift({ id: 'D-' + (78 + S.disputes.length), order: id, by: 'Buyer', why: 'Issue raised from order page', open: true, amt: 0 }); ev(S, 'buyer', `Dispute opened on ${id}`); save(); rerender(); break; }
    case 'net': S.offline = !S.offline; if (!S.offline && S.q.length) { const n = S.q.length; ev(S, 'vendor-3g', `Synced ${n} queued change(s) · ${(n * 1.1 + 12.4).toFixed(1)} KB`); S.q = []; toast('Back online · synced'); } save(); rerender(); break;
    case 'a-qc': { const o = ord(id); if (v === 'pass') { advance(o, 9, 'admin-qc'); toast('Quality check passed · batch closed'); } else { advance(o, 7, 'admin-qc'); ev(S, 'admin-qc', `${o.id} failed quality check · returned to vendor`); save(); toast('Returned to vendor for rework'); } rerender(); break; }
    case 's-accept': case 's-decline': case 's-stock': case 's-qc': case 's-label': case 's-ready': {
      const o = ord(id); const apply = () => { if (a === 's-accept') advance(o, 6, 'vendor'); if (a === 's-stock') { advance(o, 7, 'vendor'); } if (a === 's-qc') advance(o, 8, 'vendor'); if (a === 's-label') { advance(o, 10, 'vendor'); sheet(`<h3>QR label · ${o.id}</h3>${qrSvg(o.id + 'lbl')}<p class="small muted">Print 1 label per carton. Contains order, vendor and batch.</p><button class="btn xl" data-act="close">Done</button>`, 'modal'); } if (a === 's-ready') advance(o, 11, 'vendor'); if (a === 's-decline') { o.status = 'declined'; ev(S, 'vendor', `${o.id} declined · escrow refunded`); if (o.cons || o.later) { const cc = o.cons || o.later; if (cc.depMMK > 0) postLedger(S, o, 'Escrow Vault', 'Buyer Funds', cc.depMMK, 'Refund deposit · vendor declined'); postLedger(S, o, 'Escrow Vault', 'Platform Float', Math.round(o.calc.totalMMK - cc.depMMK), 'Advance returned · vendor declined'); } else postLedger(S, o, 'Escrow Vault', 'Buyer Funds', o.calc.totalMMK, 'Refund · vendor declined'); save(); } };
      if (S.offline) { S.q.push({ a, id, ts: Date.now() }); toast('Offline — queued, will sync'); } apply(); rerender(); break; }
    case 'consol': { const ids = [...document.querySelectorAll('.pick:checked')].map(x => x.value); if (!ids.length) return toast('Select at least one order'); const mode = $('#mode').value, mawb = 'CC-' + (mode.startsWith('Land') ? 'MS' : mode.includes('TPE') ? 'TPE' : 'BKK') + '-' + (2500 + S.orders.length * 3); ids.forEach(i => { const o = ord(i); const g = +document.querySelector(`.gw[data-id="${i}"]`).value || o.calc.kg, vw = +document.querySelector(`.vw[data-id="${i}"]`).value || g; o.ship = { mode, mawb, from: 'Yangon Hub', to: mode.includes('TPE') ? 'Taipei · TPE' : 'Bangkok · Suvarnabhumi', gross: g, vol: vw, depart: Date.now(), eta: Date.now() + (mode.startsWith('Land') ? 72 : 30) * H, st: 'In transit' }; advance(o, 12, '3pl'); }); ev(S, '3pl', `MAWB ${mawb} consolidated · ${ids.length} order(s)`); save(); toast('MAWB ' + mawb + ' created'); location.hash = '#/l/transit'; break; }
    case 'customs': { const o = ord(id); o.ship.st = 'Customs cleared'; advance(o, 13, '3pl'); rerender(); break; }
    case 'a-verify': verifySlip(ord(id), 'admin'); save(); toast('Slip verified · escrow funded'); rerender(); break;
    case 'a-reject': { const o = ord(id); o.status = 'declined'; S.review = S.review.filter(x => x !== id); ev(S, 'admin', `${id} slip rejected`); save(); rerender(); break; }
    case 'a-resolve': { const d = S.disputes.find(x => x.id === id); d.open = false; const o = ord(d.order); if (o && o.status === 'dispute') o.status = 'ok'; ev(S, 'admin', `${id} resolved: ${v}`); save(); rerender(); break; }
    case 'a-kyc': { const vd = S.vendors.find(x => x.id === id); vd.kyc = 'verified'; vd.tier = 'Silver'; ev(S, 'admin', `${vd.n} KYC approved`); save(); rerender(); break; }
    case 'a-force': { const o = ord(id); advance(o, 14, 'admin-override'); toast('Balance released by override'); rerender(); break; }
    case 'fx-save': ['THB', 'TWD', 'MMK'].forEach(c => { const n = parseFloat($('#r-' + c).value); if (n > 0) S.fx.rates[c] = n; }); S.fx.override = true; S.fx.history.push(S.fx.rates.MMK); ev(S, 'admin-fx', 'Manual FX override applied'); save(); toast('Override applied'); rerender(); break;
    case 'fx-auto': S.fx.override = false; ev(S, 'admin-fx', 'Automated FX resumed'); save(); rerender(); break;
    case 'sim': simulate(v); rerender(); break;
    case 'pref': S.prefs[v] = !S.prefs[v]; save(); rerender(); break;
    case 'print': window.print(); break;
    case 'invoice': { const o = ord(id); sheet(`<div id="inv"><div class="row"><div><div class="eyebrow">Tax invoice · demo</div><h3 class="mono">INV-${o.id.slice(2)}</h3></div><span class="sp"></span><span class="chip ${o.stage >= 14 ? '' : 'warn'}">${o.stage >= 14 ? 'Settled' : 'Paid · in escrow'}</span></div><p class="small muted" style="margin:6px 0">Seller: Cindy's Choices Trade Ltd. (Infinity Plus by Cindy)<br>Buyer: ${esc(o.buyer)} · ${dt(o.ts)}<br>Payment: ${o.rail} · ref ${o.slip.ref}</p>${breakdownHtml(o.items, o.cur, o.items.map(i => prod(i.p).n + ' ×' + i.q).join(', '))}</div><div class="row" style="margin-top:12px"><button class="btn sec" data-act="close">Close</button><span class="sp"></span><button class="btn" data-act="print">Print / save PDF</button></div>`); break; }
    case 'reset': if (confirm('Reset all demo data?')) { const l = S.lang; S = seed(); S.lang = l; syncProducts(); save(); location.hash = '#/login'; rerender(); } break;
  }
});
document.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset.act === 'cur') { S.cur = el.value; save(); rerender(); }
  if (el.id === 'slip' && el.files[0]) runOcr(el.files[0].name, el.files[0].size, !/blur/i.test(el.files[0].name));
});
document.addEventListener('input', e => {
  const el = e.target;
  if (el.id === 'q') { Q = el.value; const p = el.selectionStart; rerender(); const n = $('#q'); n.focus(); n.setSelectionRange(p, p); }
  if (el.id === 'sp') { S.fx.spread = +el.value; $('#spv').textContent = el.value + '%'; save(); }
  if (el.id === 'mg') { S.fx.margin = +el.value; $('#mgv').textContent = el.value + '%'; save(); }
});
window.addEventListener('hashchange', () => { closeSheet(); route(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
setInterval(() => { document.querySelectorAll('[data-cut]').forEach(n => { const p = prod(n.dataset.cut); if (p) n.textContent = cdown(cutTs(p) - Date.now()); }); const st = $('#stream'); if (st) st.innerHTML = streamHtml(); }, 1000);

/* ---------- boot ---------- */
load(); S.prefs = S.prefs || { viber: true, sms: true, email: false }; idbOpen();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => { });
route();
