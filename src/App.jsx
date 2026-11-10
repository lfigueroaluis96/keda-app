import React, { useState, useEffect, useRef } from 'react';
import * as Lucide from 'lucide-react';
// Safe icon lookup: if an icon is renamed in a newer lucide version, fall back instead of crashing.
const Missing = () => null;
const pick = (...ns) => { for (const n of ns) if (Lucide[n]) return Lucide[n]; return Missing; };
const Building = pick('Building');
const Calendar = pick('Calendar');
const DollarSign = pick('DollarSign');
const MessageSquare = pick('MessageSquare');
const ShieldCheck = pick('ShieldCheck');
const UserCheck = pick('UserCheck', 'UserRoundCheck');
const Settings = pick('Settings');
const LogOut = pick('LogOut');
const Sun = pick('Sun');
const Moon = pick('Moon');
const Lock = pick('Lock');
const Unlock = pick('Unlock');
const Plus = pick('Plus');
const Trash = pick('Trash', 'Trash2');
const CheckCircle = pick('CheckCircle', 'CircleCheckBig', 'CircleCheck');
const AlertTriangle = pick('AlertTriangle', 'TriangleAlert');
const Sparkles = pick('Sparkles');
const Filter = pick('Filter', 'Funnel');
const Search = pick('Search');
const ChevronRight = pick('ChevronRight');
const Download = pick('Download');
const Eye = pick('Eye');
const FileText = pick('FileText');
const Home = pick('Home', 'House');
const ArrowRight = pick('ArrowRight');
const X = pick('X');
const Minus = pick('Minus');
const HelpCircle = pick('HelpCircle', 'CircleHelp');
const MapPin = pick('MapPin');
const Bed = pick('Bed');
const Bath = pick('Bath');
const Car = pick('Car');
const Utensils = pick('Utensils');
const Info = pick('Info');
const Camera = pick('Camera');
const Tag = pick('Tag');
const TrendingUp = pick('TrendingUp');
const AlertCircle = pick('AlertCircle', 'CircleAlert');
const Percent = pick('Percent');
const Users = pick('Users');
const Heart = pick('Heart');
const Star = pick('Star');


// Mock Initial Data
const INITIAL_PROPERTIES = [
  {
    id: 'prop-1',
    title: 'Luxury Furnished Penthouse w/ Ocean Views',
    district: 'Miraflores',
    city: 'Lima',
    pricePerNight: 75,
    minPriceFloor: 55,
    maxGuests: 4,
    bedroomsCount: 2,
    bathroomsCount: 2,
    garageSpaces: 1,
    kitchenType: 'Full Chef Kitchen with Granite Countertop',
    bedDetails: [
      { room: 1, type: 'King Size Mattress', count: 1 },
      { room: 2, type: 'Queen Size Mattress', count: 1 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
    description: 'Modern 2-bedroom luxury penthouse steps away from Malecón de Miraflores. Fully furnished with high-speed fiber internet, private balcony, and round-the-clock doorman security.',
    amenities: ['Wi-Fi 300Mbps', 'Air Conditioning', 'Ocean View', 'Balcony', 'Smart TV', 'Washing Machine'],
    icalExportUrl: 'https://keda.pe/api/ical/export/prop-1.ics',
    icalImportUrls: [
      { id: '1', provider: 'Airbnb', url: 'https://www.airbnb.com/calendar/ical/12345678.ics?s=abcdef' },
      { id: '2', provider: 'Booking.com', url: 'https://admin.booking.com/ical/export/987654.ics' }
    ],
    blockedDates: ['2026-11-22', '2026-11-23', '2026-11-24', '2026-11-25'],
    customPrices: { '2026-11-15': 95, '2026-11-16': 95 },
    discounts: { '2026-11-10': 15 },
    externalBookings: {
      '2026-11-22': 'Airbnb',
      '2026-11-23': 'Airbnb',
      '2026-11-24': 'Airbnb',
      '2026-11-25': 'Airbnb'
    }
  },
  {
    id: 'prop-2',
    title: 'Cozy Modern Studio near Kennedy Park',
    district: 'Surquillo',
    city: 'Lima',
    pricePerNight: 45,
    minPriceFloor: 35,
    maxGuests: 2,
    bedroomsCount: 1,
    bathroomsCount: 1,
    garageSpaces: 0,
    kitchenType: 'Kitchenette w/ Electric Stove',
    bedDetails: [
      { room: 1, type: 'Queen Size Mattress', count: 1 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
    description: 'Minimalist studio right on the edge of Surquillo & Miraflores. Perfect for digital nomads and travelers seeking local gastropub spots.',
    amenities: ['Wi-Fi 200Mbps', 'Air Conditioning', 'Kitchenette', 'Building Gym'],
    icalExportUrl: 'https://keda.pe/api/ical/export/prop-2.ics',
    icalImportUrls: [
      { id: '3', provider: 'Airbnb', url: 'https://www.airbnb.com/calendar/ical/87654321.ics?s=112233' }
    ],
    blockedDates: ['2026-11-18', '2026-11-19'],
    customPrices: {},
    discounts: {},
    externalBookings: {
      '2026-11-18': 'Booking.com',
      '2026-11-19': 'Booking.com'
    }
  }
];


const pad2 = (n) => String(n).padStart(2, '0');
const toYMD = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const parseYMD = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const daysUntil = (s) => Math.round((parseYMD(s) - parseYMD(toYMD(new Date()))) / 86400000);
const dueText = (n) => n < 0 ? `Overdue by ${-n} day(s)` : n === 0 ? 'Due today' : n === 1 ? 'Due tomorrow' : `Due in ${n} days`;
const nextDue = (r) => { const d = parseYMD(r.dueDate); if (r.frequency === 'weekly') d.setDate(d.getDate() + 7); else if (r.frequency === 'custom') d.setDate(d.getDate() + (Number(r.everyDays) || 30)); else d.setMonth(d.getMonth() + 1); return toYMD(d); };
const freqLabel = (r) => r.frequency === 'weekly' ? 'Weekly' : r.frequency === 'custom' ? `Every ${r.everyDays} days` : 'Monthly';
const calcAge = (dob) => { const b = new Date(dob), t = new Date(); let a = t.getFullYear() - b.getFullYear(); if (t < new Date(t.getFullYear(), b.getMonth(), b.getDate())) a--; return a; };
const NOTIF_ICON = { bookings: Calendar, messages: MessageSquare, bills: AlertTriangle, income: DollarSign, contracts: FileText };
const NOTIF_TONE = { bookings: 'bg-keda-100 text-keda-700', messages: 'bg-sky-100 text-sky-700', bills: 'bg-amber-100 text-amber-700', income: 'bg-emerald-100 text-emerald-700', contracts: 'bg-violet-100 text-violet-700' };
const CAL_STATUS = { external: 'bg-blue-100 border-blue-300 text-blue-900', busy: 'bg-red-100 border-red-300 text-red-900', free: 'bg-emerald-50 border-emerald-200 text-emerald-900' };

// Official SUNAT 2026 monthly schedule (Anexo I, R.S. 281-2022/SUNAT). Per tax period: month of payment and the day for RUC last digit 0, 1, 2-3, 4-5, 6-7, 8-9.
const SUNAT_2026 = {
  '2026-01': ['2026-02', [16, 17, 18, 19, 20, 23]], '2026-02': ['2026-03', [16, 17, 18, 19, 20, 23]],
  '2026-03': ['2026-04', [17, 20, 21, 22, 23, 24]], '2026-04': ['2026-05', [18, 19, 20, 21, 22, 25]],
  '2026-05': ['2026-06', [15, 16, 17, 18, 19, 22]], '2026-06': ['2026-07', [15, 16, 17, 20, 21, 22]],
  '2026-07': ['2026-08', [18, 19, 20, 21, 24, 25]], '2026-08': ['2026-09', [15, 16, 17, 18, 21, 22]],
  '2026-09': ['2026-10', [16, 19, 20, 21, 22, 23]], '2026-10': ['2026-11', [16, 17, 18, 19, 20, 23]],
  '2026-11': ['2026-12', [17, 18, 21, 22, 23, 24]], '2026-12': ['2027-01', [18, 19, 20, 21, 22, 25]]
};
const SUNAT_GROUPS = ['0', '1', '2 y 3', '4 y 5', '6 y 7', '8 y 9'];
const sunatCol = (digit) => [0, 1, 2, 2, 3, 3, 4, 4, 5, 5][digit];
const sunatDue = (period, digit) => { const r = SUNAT_2026[period]; if (!r || digit == null || isNaN(digit)) return null; return `${r[0]}-${pad2(r[1][sunatCol(digit)])}`; };
const rucFromDni = (dni) => {
  if (!/^\d{8}$/.test(dni)) return null;
  const base = '10' + dni, w = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let r = 11 - (base.split('').reduce((a, c, i) => a + Number(c) * w[i], 0) % 11);
  if (r === 10) r = 0; else if (r === 11) r = 1;
  return base + r;
};
const DOC_LABEL = { DNI: 'DNI', Passport: 'Passport', CE: 'Carnet de extranjería' };
const parseICS = (text) => {
  const out = [];
  text.split('BEGIN:VEVENT').slice(1).forEach(b => {
    const g = (k) => { const m = b.match(new RegExp(k + '[^:\\r\\n]*:(\\d{8})')); return m ? m[1] : null; };
    const st = g('DTSTART'), en = g('DTEND') || st;
    if (st) out.push([`${st.slice(0, 4)}-${st.slice(4, 6)}-${st.slice(6, 8)}`, `${en.slice(0, 4)}-${en.slice(4, 6)}-${en.slice(6, 8)}`]);
  });
  return out;
};

const EXTRA_CSS = `
.max-h-\\[92vh\\]{max-height:92vh}.max-h-\\[45vh\\]{max-height:45vh}.max-h-\\[420px\\]{max-height:420px}
.min-h-\\[110px\\]{min-height:110px}.min-h-\\[64px\\]{min-height:64px}.min-h-0{min-height:0}.shrink-0{flex-shrink:0}
.min-w-\\[160px\\]{min-width:160px}.min-w-\\[200px\\]{min-width:200px}.min-w-\\[220px\\]{min-width:220px}.min-w-\\[420px\\]{min-width:420px}.min-w-\\[640px\\]{min-width:640px}.min-w-\\[70px\\]{min-width:70px}
.max-w-\\[85\\%\\]{max-width:85%}
.text-\\[8px\\]{font-size:8px}.text-\\[9px\\]{font-size:9px}.text-\\[10px\\]{font-size:10px}.text-\\[11px\\]{font-size:11px}
`;

const KEDA = { 50: '#E6FAF4', 100: '#C8F4E6', 200: '#96EBD2', 300: '#5CDDB9', 400: '#26D0A5', 500: '#00C897', 600: '#00A67C', 700: '#008566', 800: '#1E293B', 900: '#0F172A' };
const KEDA_FONT = "'Nunito','Quicksand','Varela Round',ui-rounded,'SF Pro Rounded',system-ui,sans-serif";
const FONT_IMPORT = "@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');";
const KEDA_CSS = Object.entries(KEDA).map(([k, v]) =>
  `.bg-keda-${k}{background-color:${v}}.text-keda-${k}{color:${v}}.border-keda-${k}{border-color:${v}}.ring-keda-${k}{--tw-ring-color:${v}}.outline-keda-${k}{outline-color:${v}}` +
  `.hover\\:bg-keda-${k}:hover{background-color:${v}}.hover\\:text-keda-${k}:hover{color:${v}}.hover\\:border-keda-${k}:hover{border-color:${v}}`).join('') +
  `.bg-kamber{background-color:#FF7A00}.hover\\:bg-kamber-d:hover{background-color:#E26A00}.text-kamber{color:#E26A00}input,select,textarea,button{font-family:inherit}`;
const SAMPLE_ADDR = { 'prop-1': 'Calle Alcanfores 456, Piso 12', 'prop-2': 'Av. Angamos Este 1200, Dpto 304' };

function KedaLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label="KEDA">
      <rect width="40" height="40" rx="11" fill="#00C897" />
      <path d="M7 17 L20 6.5 L33 17" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 20.5 V33.5" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M13.5 27.5 L19 33 L29 21" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const CANCEL_POLICIES = {
  flexible: { label: 'Flexible', short: 'Free cancellation until 24 hours before check-in', free: true, clause: 'Full refund if cancelled at least 24 hours before check-in; 50% refund if cancelled within the last 24 hours; no refund after check-in.' },
  moderate: { label: 'Moderate', short: 'Free cancellation until 5 days before check-in', free: true, clause: 'Full refund if cancelled at least 5 days before check-in; 50% refund between 5 days and 24 hours before; no refund within the last 24 hours.' },
  strict: { label: 'Strict', short: '50% refund until 14 days before check-in', free: false, clause: '50% refund if cancelled at least 14 days before check-in; no refund afterwards.' }
};
// Sample reviews for the demo only. Real reviews come from guests after a confirmed stay.
const SAMPLE_REVIEWS = {
  'prop-1': [
    { id: 'r1', author: 'Camila R.', rating: 5, date: '2026-09-18', text: 'Incredible ocean view and very clean. Check-in was easy.', demo: true, verified: true },
    { id: 'r2', author: 'Jorge P.', rating: 5, date: '2026-09-02', text: 'Great location in Miraflores, the host answered all my questions fast.', demo: true, verified: true },
    { id: 'r3', author: 'Hannah W.', rating: 5, date: '2026-08-21', text: 'Perfect for a work trip. Fast Wi-Fi and a comfortable bed.', demo: true, verified: true },
    { id: 'r4', author: 'Diego S.', rating: 4, date: '2026-08-07', text: 'Beautiful apartment. The street can be noisy at night.', demo: true, verified: true },
    { id: 'r5', author: 'Lucia M.', rating: 5, date: '2026-07-25', text: 'Felt like home. Would book again.', demo: true, verified: true }
  ],
  'prop-2': [
    { id: 'r6', author: 'Mateo F.', rating: 5, date: '2026-09-10', text: 'Cozy and well equipped, next to the park.', demo: true, verified: true },
    { id: 'r7', author: 'Sofia T.', rating: 4, date: '2026-08-15', text: 'Good value. Small but very comfortable.', demo: true, verified: true }
  ]
};
const ratingOf = (p) => { const r = p.reviews || []; return r.length ? r.reduce((a, x) => a + x.rating, 0) / r.length : null; };
const isFavorite = (p) => (p.reviews || []).length >= 5 && ratingOf(p) >= 4.8;
const bedsOf = (p) => p.rooms ? p.rooms.filter(r => (r.kind || 'bedroom') === 'bedroom').length : (p.bedroomsCount || 0);

const BED_TYPES = ['Single', 'Twin', 'Double', 'Queen', 'King', 'Sofa bed', 'Bunk bed'];
const AMENITY_PRESETS = ['Wi-Fi', 'Air Conditioning', 'Heating', 'Ocean View', 'Balcony', 'Smart TV', 'Washing Machine', 'Pool', 'Gym', 'Elevator', 'Workspace', 'Pet friendly'];
const KITCHEN_TYPES = ['No kitchen', 'Kitchenette', 'Fully Equipped Kitchen', 'Full Chef Kitchen'];
const normalizeProp = (p) => {
  const m = {};
  (p.bedDetails || []).forEach(b => {
    (m[b.room] = m[b.room] || { id: `r${b.room}`, beds: [] }).beds.push({ type: BED_TYPES.find(t => b.type.includes(t)) || 'Double', count: b.count });
  });
  return { ...p, reviews: p.reviews || SAMPLE_REVIEWS[p.id] || [], cancellation: p.cancellation || 'moderate', minNights: p.minNights ?? 1, weeklyDiscount: p.weeklyDiscount ?? 10, earlyBirdDiscount: p.earlyBirdDiscount ?? 5, returningDiscount: p.returningDiscount ?? 5, address: p.address ?? (SAMPLE_ADDR[p.id] || ''), images: p.images || [{ id: `img-${p.id}`, src: p.imageUrl, filter: '' }], rooms: p.rooms || Object.values(m) };
};
const bedSummary = (p) => {
  const t = {};
  (p.rooms || []).forEach(r => r.beds.forEach(b => { t[b.type] = (t[b.type] || 0) + Number(b.count); }));
  return Object.entries(t).map(([k, v]) => `${v} ${k}`).join(', ');
};
function PropertyFacts({ prop }) {
  const items = [
    [Users, `${prop.maxGuests} guests`],
    [Home, `${prop.rooms ? prop.rooms.filter(r => (r.kind || 'bedroom') === 'bedroom').length : prop.bedroomsCount} bedroom(s)`],
    prop.rooms?.some(r => r.kind === 'living') ? [Home, `Living room${prop.rooms.some(r => r.kind === 'living' && r.beds.some(b => b.type === 'Sofa bed')) ? ' with sofa bed' : ''}`] : null,
    [Bed, bedSummary(prop)],
    [Bath, `${prop.bathroomsCount} bathroom(s)`],
    [Car, prop.garageSpaces ? `${prop.garageSpaces} garage space(s)` : 'No garage'],
    [Utensils, prop.kitchenType]
  ].filter(i => i && i[1]);
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-600">
        {items.map(([Icon, t], i) => (<span key={i} className="flex items-center gap-1"><Icon className="w-3.5 h-3.5 text-keda-500" />{t}</span>))}
      </div>
      {prop.amenities?.length > 0 && (
        <div className="flex flex-wrap gap-1">{prop.amenities.map(a => (<span key={a} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full">{a}</span>))}</div>
      )}
    </div>
  );
}

const fmtDate = (ds) => new Date(ds + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const usd = (n) => `US$ ${Number(n).toFixed(2)} (S/ ${(Number(n) * 3.75).toFixed(2)})`;
const buildContract = (b, prop, host) => {
  const nightly = b.nights ? b.totalPrice / b.nights : 0;
  const deposit = Math.max(100, Math.round(b.totalPrice * 0.3));
  const overstay = Math.round(nightly * 3 * 100) / 100;
  const place = prop?.address && b.status === 'Confirmed'
    ? `${prop.title}, ${prop.address}, ${prop.district}, ${prop.city}, Peru`
    : `${prop?.title || b.propertyTitle}, ${prop?.district || ''} district zone (exact address released once the booking is confirmed), ${prop?.city || ''}, Peru`;
  const maxG = prop?.maxGuests || 2;
  const policy = CANCEL_POLICIES[prop?.cancellation || 'moderate'];
  return [
    ['Parties', [`LESSOR / HOST (Arrendador): ${host.name}, ${host.idDocumentType} / RUC No. ${host.dniRuc}.`, `LESSEE / GUEST (Arrendatario): ${b.guestName}, ${DOC_LABEL[b.guestDocType] || 'ID'} No. ${b.guestDniPassport}.`, `Contract No. ${b.id}. Both parties act in their own name and declare full legal capacity to contract.`]],
    ['Property and purpose', [`The Host leases to the Guest, on a temporary basis, the furnished property "${place}" (the "Property"), together with its furniture, appliances and inventory listed in the advertisement.`, 'The lease is exclusively for temporary tourist or short-stay lodging. It is not a residential lease. The Guest declares to have a permanent residence elsewhere and that the Property will never become the Guest\'s home.', 'This agreement is governed by the Peruvian Civil Code (Legislative Decree 295, lease contracts) and by the clauses below.']],
    ['Term (booking dates)', [`Check-in: ${fmtDate(b.checkIn)} from 15:00. Check-out: ${fmtDate(b.checkOut)} no later than 11:00. Total: ${b.nights} night(s).`, 'The lease ends automatically on the check-out date and time, without need of notice. There is no tacit renewal; the parties expressly exclude Article 1700 of the Civil Code. Any extension requires the Host\'s prior written confirmation through the platform and payment of the extra nights.']],
    ['Price and payment', [`Total rent: ${usd(b.totalPrice)} for the full stay (average ${usd(nightly)} per night), payment method: ${b.paymentMethod}.`, 'The Guest pays the Host directly; no intermediary commission is charged. If a payment is rejected, reversed or not received, the Host may cancel the booking without liability and keep the dates released.']],
    ['Security deposit', [`Before check-in the Guest will provide a security deposit of ${usd(deposit)} by the means indicated by the Host (card pre-authorization, transfer, Yape or Plin).`, 'The deposit secures every obligation of the Guest (damages, losses, cleaning, penalties, unpaid amounts). In case of damage to the Property or its inventory, the deposit is forfeited in favor of the Host, in whole or up to the amount of the damage, without waiting for a court ruling. It does not limit the Guest\'s liability: if the loss exceeds the deposit, the Guest pays the difference within 5 days of the Host\'s written claim. The balance is returned within 7 days after check-out inspection if there are no claims.']],
    ['Condition and inventory', ['The Property is delivered clean and in good working order as shown in the listing and photos. The Guest must report any defect or missing item in writing within 24 hours of check-in; otherwise it is presumed that everything was received in good condition.', 'The Host may document the condition of the Property with photos and video at check-in and check-out. These records are valid evidence between the parties.']],
    ['Rules of use', [`(a) Maximum ${maxG} guests and only those registered; (b) no parties, events or gatherings; (c) no smoking inside; (d) quiet hours 22:00 to 07:00; (e) no pets unless authorized in writing; (f) no drugs, weapons, illegal or dangerous activity; (g) no subletting, assignment, resale of the stay, or commercial use or filming; (h) comply with building/condominium rules; (i) do not change or copy locks and keys. A lost key or access card is charged at replacement and lock-change cost.`]],
    ['Guest registration and data', ['The Guest provides a valid DNI or passport and identifies all occupants before check-in, so the Host can comply with guest-registration rules. Every additional unregistered person is charged US$ 20 per night and is grounds for termination under clause 12.', 'Personal data is processed only for the booking, legal compliance and security, in accordance with Law 29733 (Personal Data Protection).']],
    ['Damage to the Property', ['Under the Civil Code, the lessee answers for loss or deterioration of the leased property unless proving it was not caused by the lessee (Art. 1683). The Guest is liable for any damage to the Property, its furniture, appliances, fixtures, linens or common areas caused by the Guest, occupants or visitors, except normal wear and tear.', `Liability covers: (i) repair or replacement at market cost, proven by receipts or quotes; (ii) lost rental income for every night the Property cannot be rented because of repairs, calculated at ${usd(nightly)} per night; (iii) extraordinary cleaning (minimum US$ 30); (iv) reasonable administrative costs.`, 'The Host will apply the security deposit first and may charge the remaining amount to the payment method used; the Guest authorizes this. The Host will notify the claim with evidence within 7 days after check-out.']],
    ['Theft and missing items', ['The Guest is liable for any item of the inventory that is missing, removed or damaged during the stay, at replacement value. The Host may inspect the Property at check-out together with the Guest.', 'In case of theft or removal of the Host\'s property, the Host may file a police report and criminal complaint (Penal Code, theft, Arts. 185 and following) in addition to recovering the loss. The Host is not responsible for the Guest\'s belongings; valuables are kept at the Guest\'s own risk.']],
    ['Failure to vacate / overstay', [`At check-out time the lease ends and the Guest must leave immediately and return keys. After the term, under Art. 1704 of the Civil Code the Host may demand return of the Property and collect the agreed penalty.`, `Penalty (cláusula penal, Arts. 1341 and following): ${usd(overstay)} for each day or fraction of delay (3 times the nightly rate, per day), plus all losses caused (including cancelled or refunded bookings of next guests, relocation of the next guests and legal costs). Late departure is also charged at 10% of the nightly rate per hour up to 3 hours; after that a full night.`, 'The Guest acknowledges that after the term he or she has no right to remain, waives any claim of tenancy, continuity of lease or possessory rights, and accepts that the Host may request the Peruvian National Police to assist, start judicial eviction proceedings, and report the unlawful occupation where it applies (Penal Code, usurpation). The Guest pays court, notary and lawyer fees. The Host will use only lawful measures to recover possession.']],
    ['Early termination by the Host', ['Express termination clause (Civil Code Art. 1430): the Host may end the lease immediately by written notice (platform chat or email) for non-payment, exceeding the guest limit, parties or nuisance, illegal activity, serious damage, or breach of clauses 7 or 8.', 'The Guest must vacate within 2 hours of the notice. No refund is due and the deposit remains applicable to losses.']],
    ['Cancellation by the Guest', [`${policy.label} policy: ${policy.clause} A no-show is treated as a cancellation within the last 24 hours. If the Host cancels, the Guest receives a full refund.`]],
    ['Liability and entry', ['The Guest answers for the acts and omissions of occupants and visitors. The Host is not liable for accidents or injuries except in case of willful misconduct or inexcusable fault. The Guest should have personal travel insurance.', 'The Host may enter in emergencies or, with notice, for repairs or inspection.']],
    ['Electronic signature and notices', ['The parties agree that acceptance and electronic signature through this platform are a valid expression of consent (Law 27269, Digital Signatures and Certificates). The platform records name, date and time of signature as evidence.', 'Notices are valid when sent through the platform chat or to the email registered in the booking.']],
    ['Governing law and jurisdiction', [`Peruvian law applies. For any dispute the parties submit to the judges and courts of ${prop?.city || 'Lima'}, Peru, after extrajudicial conciliation when required (Law 26872). Nothing in this contract limits the rights that consumer law (Law 29571) does not allow to be waived.`]],
    ['Entire agreement', ['This contract and the booking are the entire agreement. If a clause is declared void, the others remain valid. A copy is available to both parties.']]
  ];
};

const INITIAL_BOOKINGS = [
  {
    id: 'bk-101',
    propertyId: 'prop-1',
    propertyTitle: 'Luxury Furnished Penthouse w/ Ocean Views',
    guestName: 'Sophia Chen',
    guestDniPassport: 'AB-8749201',
    guestDocType: 'Passport',
    guestAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    checkIn: '2026-11-15',
    checkOut: '2026-11-20',
    nights: 5,
    totalPrice: 375,
    savedFees: 62,
    status: 'Confirmed',
    source: 'KEDA',
    paymentMethod: 'Credit Card (Paid)',
    contractSigned: true,
    contractSignedAt: '2026-11-01 14:32'
  },
  {
    id: 'bk-102',
    propertyId: 'prop-1',
    propertyTitle: 'Luxury Furnished Penthouse w/ Ocean Views',
    guestName: 'Airbnb Guest (External iCal)',
    guestDniPassport: 'External-Airbnb',
    guestAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    checkIn: '2026-11-22',
    checkOut: '2026-11-25',
    nights: 3,
    totalPrice: 270,
    savedFees: 0,
    status: 'Blocked via iCal',
    source: 'Airbnb Sync',
    paymentMethod: 'External Airbnb',
    contractSigned: false,
    contractSignedAt: null
  },
  {
    id: 'bk-103', propertyId: 'prop-1', propertyTitle: 'Luxury Furnished Penthouse w/ Ocean Views',
    guestName: 'Marta Quispe', guestDniPassport: '45871236', guestDocType: 'DNI', guestAvatar: '',
    checkIn: '2026-10-10', checkOut: '2026-10-14', nights: 4, totalPrice: 300, savedFees: 50, status: 'Confirmed',
    source: 'KEDA', paymentMethod: 'Yape (Paid)', contractSigned: true, contractSignedAt: '2026-10-02 09:15', contractSignature: 'Marta Quispe'
  },
  {
    id: 'bk-104', propertyId: 'prop-2', propertyTitle: 'Cozy Modern Studio near Kennedy Park',
    guestName: 'Liam Becker', guestDniPassport: 'C4K92M7L1', guestDocType: 'Passport', guestAvatar: '',
    checkIn: '2026-12-05', checkOut: '2026-12-09', nights: 4, totalPrice: 240, savedFees: 40, status: 'Confirmed',
    source: 'KEDA', paymentMethod: 'Credit/Debit Card (Paid)', contractSigned: false, contractSignedAt: null
  }
];

const INITIAL_EXPENSES = [
  { id: 'exp-1', propertyId: 'prop-1', category: 'Electricity (Luz del Sur)', amount: 65.00, month: '2026-11', date: '2026-11-03' },
  { id: 'exp-2', propertyId: 'prop-1', category: 'Water (SEDAPAL)', amount: 28.50, month: '2026-11', date: '2026-11-04' },
  { id: 'exp-3', propertyId: 'prop-1', category: 'Building Maintenance & Security', amount: 110.00, month: '2026-11', date: '2026-11-01' },
  { id: 'exp-4', propertyId: 'prop-1', category: 'Internet Fiber 300Mbps', amount: 38.00, month: '2026-11', date: '2026-11-02' },
  { id: 'exp-5', propertyId: 'prop-2', category: 'Electricity (Luz del Sur)', amount: 32.00, month: '2026-11', date: '2026-11-02' }
];

const INITIAL_CHATS = [
  {
    id: 'msg-1',
    propertyId: 'prop-1',
    sender: 'Carlos Mendoza (Host)',
    senderRole: 'host',
    text: 'Hello Sophia! Welcome to Miraflores. Please make sure to review and sign the electronic rental contract required under Peruvian Law.',
    timestamp: '10:15 AM'
  },
  {
    id: 'msg-2',
    propertyId: 'prop-1',
    sender: 'Sophia Chen (Guest)',
    senderRole: 'guest',
    text: 'Thanks Carlos! I signed the electronic contract. What is the Wi-Fi speed and check-in code?',
    timestamp: '10:18 AM'
  }
];

const INITIAL_USER = {
  id: 'usr-1',
  name: 'Carlos Mendoza',
  email: 'carlos@keda.pe',
  dniRuc: '10472910482',
  idDocumentType: 'DNI',
  idDocumentNumber: '10472910482',
  idDocumentImage: null,
  dateOfBirth: '',
  sworn: false,
  idVerified: false,
  role: 'host',
  hasHostProfile: true,
  hasGuestProfile: true,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  phone: '+51 987 654 321',
  verificationStatus: 'Verified Host (DNI Verified)',
  payoutMethod: 'Bank Transfer (BCP Peru)',
  memberSince: '2024',
  preferredCurrency: 'USD',
  preferredLanguage: 'ES'
};

const INITIAL_SERVICE_REMINDERS = [
  { id: 'rem-1', name: 'Luz del Sur Electricity', amount: 65.00, dueDate: '2026-11-18', category: 'Utility', propertyId: 'prop-1', frequency: 'monthly', everyDays: 30 },
  { id: 'rem-2', name: 'SEDAPAL Water Service', amount: 28.50, dueDate: '2026-11-22', category: 'Utility', propertyId: 'prop-1', frequency: 'monthly', everyDays: 30 },
  { id: 'rem-3', name: 'Building Security & Admin', amount: 110.00, dueDate: '2026-11-28', category: 'Maintenance', propertyId: 'prop-1', frequency: 'monthly', everyDays: 30 },
  { id: 'rem-4', name: 'Internet & Cable', amount: 45.00, dueDate: '2026-11-25', category: 'Utility', propertyId: 'prop-1', frequency: 'monthly', everyDays: 30 }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeRoleMode, setActiveRoleMode] = useState('guest');

  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('ES');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [idDocTypeInput, setIdDocTypeInput] = useState(currentUser?.idDocumentType || 'DNI');
  const [idDocNumInput, setIdDocNumInput] = useState(currentUser?.idDocumentNumber || '10472910482');
  const [uploadedIdPreview, setUploadedIdPreview] = useState(currentUser?.idDocumentImage || null);

  const currencySymbols = { USD: '$', PEN: 'S/', EUR: '€' };
  const currencyRates = { USD: 1, PEN: 3.75, EUR: 0.92 };
  
  const formatMoney = (amountInUsd) => {
    const symbol = currencySymbols[currency] || '$';
    const rate = currencyRates[currency] || 1;
    const converted = (amountInUsd * rate).toFixed(2);
    return `${symbol} ${converted}`;
  };

  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [selectedContractBooking, setSelectedContractBooking] = useState(null);
  const [eSignatureText, setESignatureText] = useState('');
  const [hasAcceptedTermsCheck, setHasAcceptedTermsCheck] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [properties, setProperties] = useState(INITIAL_PROPERTIES.map(normalizeProp));
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [messages, setMessages] = useState(INITIAL_CHATS);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [guestCount, setGuestCount] = useState(1);

  // Calendar State & Controls
  const [selectedCalendarPropId, setSelectedCalendarPropId] = useState('prop-1');
  const selectedCalendarProp = properties.find(p => p.id === selectedCalendarPropId) || properties[0];
  const [selectedDates, setSelectedDates] = useState([]);
  const [bulkPriceInput, setBulkPriceInput] = useState('');
  const [bulkDiscountInput, setBulkDiscountInput] = useState('');

  // Finance State
  const [financeTimeframe, setFinanceTimeframe] = useState('monthly');
  const [serviceReminders, setServiceReminders] = useState(INITIAL_SERVICE_REMINDERS);
  const [newReminder, setNewReminder] = useState({ name: '', amount: '', dueDate: '', frequency: 'monthly', everyDays: 30, propertyId: 'prop-1' });

  // Chat Popover Controls
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [chatWarningModal, setChatWarningModal] = useState(false);
  const [activeChatProperty, setActiveChatProperty] = useState(INITIAL_PROPERTIES[0]);
  const [chatInputText, setChatInputText] = useState('');

  // Property Edit & AI Enhancer State
  const [editingProperty, setEditingProperty] = useState(null);
  const [aiAdviceText, setAiAdviceText] = useState('');

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [accounts, setAccounts] = useState([{ ...INITIAL_USER, id: 'user-demo', email: 'demo@keda.pe', password: 'Demo1234!', provider: 'email', dateOfBirth: '1988-05-14', idDocumentType: 'DNI', idDocumentNumber: '47291048', idDocumentImage: 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'240\' height=\'150\'><rect width=\'240\' height=\'150\' fill=\'%23E6FAF4\'/><text x=\'120\' y=\'80\' font-size=\'18\' text-anchor=\'middle\' fill=\'%230F172A\'>DEMO ID</text></svg>', sworn: true, swornAt: 'demo', idVerified: true }]);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [authError, setAuthError] = useState('');
  const [authNotice, setAuthNotice] = useState('');
  const [authSocial, setAuthSocial] = useState(null);
  const [socialForm, setSocialForm] = useState({ name: '', email: '' });
  const [selectedAuthRole, setSelectedAuthRole] = useState('host');
  const [authFormData, setAuthFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    dniRuc: '10472910482',
    payoutMethod: 'Bank Transfer (BCP)',
    emergencyContact: ''
  });

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingDates, setBookingDates] = useState({ checkIn: '2026-11-20', checkOut: '2026-11-25' });
  const [guestDocumentInput, setGuestDocumentInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [isAiPricingModalOpen, setIsAiPricingModalOpen] = useState(false);
  const [aiPricingData, setAiPricingData] = useState(null);
  const [isCalculatingAi, setIsCalculatingAi] = useState(false);
  const [hostDniRucInput, setHostDniRucInput] = useState('10472910482');
  const [selectedFinancePropId, setSelectedFinancePropId] = useState('all');
  const [newExpense, setNewExpense] = useState({ propertyId: 'prop-1', category: 'Electricity (Luz del Sur)', amount: '', date: '' });

  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [newProp, setNewProp] = useState({
    title: '',
    district: 'Miraflores',
    city: 'Lima',
    pricePerNight: 80,
    minPriceFloor: 50,
    maxGuests: 2,
    bedroomsCount: 1,
    bathroomsCount: 1,
    garageSpaces: 0,
    kitchenType: 'Fully Equipped Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
    description: ''
  });
  const [newIcalUrl, setNewIcalUrl] = useState('');
  const [newIcalProvider, setNewIcalProvider] = useState('Airbnb');
  const [syncNotice, setSyncNotice] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [editDraft, setEditDraft] = useState(null);
  const [photoAdvice, setPhotoAdvice] = useState('');
  const [amenityInput, setAmenityInput] = useState('');
  const [dashProp, setDashProp] = useState('all');
  const [locFilter, setLocFilter] = useState('all');
  const [wishlist, setWishlist] = useState([]);
  const [sortBy, setSortBy] = useState('recommended');
  const [minBeds, setMinBeds] = useState(0);
  const [maxPrice, setMaxPrice] = useState('');
  const [freeCancelOnly, setFreeCancelOnly] = useState(false);
  const [favOnly, setFavOnly] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [detailPropId, setDetailPropId] = useState(null);
  const [detailPhoto, setDetailPhoto] = useState(0);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '' });
  const [editOriginal, setEditOriginal] = useState('');
  const [confirmExitEdit, setConfirmExitEdit] = useState(false);
  const [pasteIcs, setPasteIcs] = useState('');
  const [guestDocType, setGuestDocType] = useState('DNI');
  const [rucOverride, setRucOverride] = useState('');
  const [taxMonth, setTaxMonth] = useState(toYMD(new Date()).slice(0, 7));
  const [contractFilter, setContractFilter] = useState('all');
  const [contractProp, setContractProp] = useState('all');
  const [notifFilter, setNotifFilter] = useState('all');
  const [dismissedNotifs, setDismissedNotifs] = useState([]);
  const [readMsgIds, setReadMsgIds] = useState([]);
  const [calView, setCalView] = useState('month');
  const [calDate, setCalDate] = useState(new Date());
  const [profileForm, setProfileForm] = useState({ name: '', dob: '', docType: 'DNI', docNumber: '', docImage: null, avatar: '', sworn: false });
  const [profileNotice, setProfileNotice] = useState('');
  const [profileError, setProfileError] = useState('');
  const [lastAddedReminder, setLastAddedReminder] = useState(null);
  const [reminderError, setReminderError] = useState('');
  const [finSelectedPeriod, setFinSelectedPeriod] = useState(null);

  const editRef = useRef({ draft: null, orig: '' });
  editRef.current = { draft: editDraft, orig: editOriginal };
  useEffect(() => {
    const h = (e) => {
      if (e.key !== 'Escape') return;
      const { draft, orig } = editRef.current;
      if (draft) { if (JSON.stringify(draft) !== orig) setConfirmExitEdit(true); else setEditDraft(null); return; }
      setIsContractModalOpen(false); setIsProfileModalOpen(false); setIsSettingsOpen(false); setIsAddPropertyOpen(false); setIsAuthModalOpen(false);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);
  useEffect(() => {
    if (currentUser) setAccounts(prev => prev.map(a => a.id === currentUser.id ? { ...a, ...currentUser } : a));
  }, [currentUser]);
  useEffect(() => {
    if (!isChatOpen || isChatMinimized || !activeChatProperty) return;
    const ids = messages.filter(m => m.propertyId === activeChatProperty.id && m.senderRole === 'guest').map(m => m.id);
    setReadMsgIds(prev => ids.every(i => prev.includes(i)) ? prev : [...new Set([...prev, ...ids])]);
  }, [isChatOpen, isChatMinimized, activeChatProperty, messages]);

  // Helper functions
  const handleSelectDate = (dateStr) => {
    if (selectedDates.includes(dateStr)) {
      setSelectedDates(selectedDates.filter(d => d !== dateStr));
    } else {
      setSelectedDates([...selectedDates, dateStr]);
    }
  };

  const applyBulkPrice = () => {
    if (!selectedCalendarProp || selectedDates.length === 0 || !bulkPriceInput) return;
    const priceNum = parseFloat(bulkPriceInput);
    if (isNaN(priceNum) || priceNum <= 0) return;

    setProperties(prevProps => prevProps.map(p => {
      if (p.id === selectedCalendarProp.id) {
        const updatedCustomPrices = { ...p.customPrices };
        selectedDates.forEach(d => {
          updatedCustomPrices[d] = Math.max(priceNum, p.minPriceFloor || 0);
        });
        return { ...p, customPrices: updatedCustomPrices };
      }
      return p;
    }));
    setBulkPriceInput('');
  };

  const applyBulkDiscount = () => {
    if (!selectedCalendarProp || selectedDates.length === 0 || !bulkDiscountInput) return;
    const discountNum = parseFloat(bulkDiscountInput);
    if (isNaN(discountNum) || discountNum < 0 || discountNum > 100) return;

    setProperties(prevProps => prevProps.map(p => {
      if (p.id === selectedCalendarProp.id) {
        const updatedDiscounts = { ...p.discounts };
        selectedDates.forEach(d => {
          updatedDiscounts[d] = discountNum;
        });
        return { ...p, discounts: updatedDiscounts };
      }
      return p;
    }));
    setBulkDiscountInput('');
  };

  const bulkBlockDates = () => {
    if (!selectedCalendarProp || selectedDates.length === 0) return;
    setProperties(prevProps => prevProps.map(p => {
      if (p.id === selectedCalendarProp.id) {
        const currentBlocked = p.blockedDates || [];
        const combined = Array.from(new Set([...currentBlocked, ...selectedDates]));
        return { ...p, blockedDates: combined };
      }
      return p;
    }));
    setSelectedDates([]);
  };

  const bulkUnblockDates = () => {
    if (!selectedCalendarProp || selectedDates.length === 0) return;
    setProperties(prevProps => prevProps.map(p => {
      if (p.id === selectedCalendarProp.id) {
        const currentBlocked = p.blockedDates || [];
        const filtered = currentBlocked.filter(d => !selectedDates.includes(d) || p.externalBookings?.[d]);
        return { ...p, blockedDates: filtered };
      }
      return p;
    }));
    setSelectedDates([]);
  };

  const applyAiSmartPriceToSelected = () => {
    if (!selectedCalendarProp || selectedDates.length === 0) return;
    const base = selectedCalendarProp.pricePerNight;
    const floor = Number(selectedCalendarProp.minPriceFloor) || 0;
    setProperties(prev => prev.map(p => {
      if (p.id !== selectedCalendarProp.id) return p;
      const custom = { ...p.customPrices };
      selectedDates.forEach(d => {
        if (p.externalBookings?.[d]) return;
        const dow = new Date(d + 'T00:00:00').getDay();
        const lead = Math.round((new Date(d + 'T00:00:00') - new Date()) / 86400000);
        let mult = dow === 5 || dow === 6 ? 1.2 : 1;   // weekend demand
        if (lead >= 0 && lead <= 3) mult *= 0.9;        // last-minute fill
        custom[d] = Math.max(floor, Math.round(base * mult));
      });
      return { ...p, customPrices: custom };
    }));
  };
  const resetSelectedPricing = () => setProperties(prev => prev.map(p => {
    if (p.id !== selectedCalendarProp.id) return p;
    const cp = { ...p.customPrices }, di = { ...p.discounts };
    selectedDates.forEach(d => { delete cp[d]; delete di[d]; });
    return { ...p, customPrices: cp, discounts: di };
  }));

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;
    if (!currentUser) { openAuth('Log in or sign up to message the host.'); return; }

    const cleaned = chatInputText.replace(/\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}(\/\d{2,4})?/g, '');
    const leakPattern = /((\d[\s().-]*){7,}|[\w.+-]+\s*(@|\(at\)|\[at\])\s*[\w-]+|https?:\/\/|www\.|\b[\w-]+\.(com|pe|net|org|io|app|me|co)\b|whats\s?app|telegram|instagram|facebook|wa\.me)/i;
    const hasConfirmedBooking = bookings.some(b => b.source === 'KEDA' && b.status === 'Confirmed' && b.propertyId === activeChatProperty?.id && b.guestName === currentUser?.name);

    if (activeRoleMode === 'guest' && !hasConfirmedBooking && leakPattern.test(cleaned)) {
      setChatWarningModal(true);
      return;
    }

    const newMsg = {
      id: `msg-${Date.now()}`,
      propertyId: activeChatProperty?.id || 'prop-1',
      sender: activeRoleMode === 'host' ? `${currentUser.name} (Host)` : `${currentUser.name} (Guest)`,
      senderRole: activeRoleMode,
      text: chatInputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setChatInputText('');
  };

  const addServiceReminder = (e) => {
    e.preventDefault();
    const amt = parseFloat(newReminder.amount);
    if (!newReminder.name.trim() || !(amt > 0) || !newReminder.dueDate) { setReminderError('Enter a service name, an amount and the next due date.'); return; }
    if (newReminder.frequency === 'custom' && !(Number(newReminder.everyDays) >= 1)) { setReminderError('Custom period must be at least 1 day.'); return; }
    const created = { id: `rem-${Date.now()}`, name: newReminder.name.trim(), amount: amt, dueDate: newReminder.dueDate, category: 'Service',
      propertyId: newReminder.propertyId, frequency: newReminder.frequency, everyDays: Number(newReminder.everyDays) || 30 };
    setServiceReminders(prev => [...prev, created]);
    setLastAddedReminder(created.id); setTimeout(() => setLastAddedReminder(null), 3500);
    setNewReminder({ ...newReminder, name: '', amount: '', dueDate: '' }); setReminderError('');
  };
  const markReminderPaid = (r) => {
    setExpenses(prev => [...prev, { id: `exp-${Date.now()}`, propertyId: r.propertyId === 'all' ? properties[0].id : r.propertyId, category: r.name, amount: r.amount, month: toYMD(new Date()).slice(0, 7), date: toYMD(new Date()) }]);
    setServiceReminders(prev => prev.map(x => x.id === r.id ? { ...x, dueDate: nextDue(x) } : x));
  };

  const removeServiceReminder = (id) => {
    setServiceReminders(serviceReminders.filter(r => r.id !== id));
  };

  const addExpense = (e) => {
    e.preventDefault();
    if (!newExpense.amount || !newExpense.date) return;
    const created = {
      id: `exp-${Date.now()}`,
      propertyId: newExpense.propertyId,
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      month: newExpense.date.substring(0, 7),
      date: newExpense.date
    };
    setExpenses([...expenses, created]);
    setNewExpense({ propertyId: 'prop-1', category: 'Electricity (Luz del Sur)', amount: '', date: '' });
  };

  const triggerAiPhotoAdvice = (prop) => {
    setEditingProperty(prop);
    setAiAdviceText('Analyzing image lighting, framing, and interior composition...');
    setTimeout(() => {
      setAiAdviceText(
        `AI Recommendations for "${prop.title}":\n` +
        `• Brightness: Increase exposure by +12% to highlight natural daylight.\n` +
        `• Staging: Place fresh yellow flowers or coastal decor on the coffee table.\n` +
        `• Angle: Shoot from waist-height at the corner to give a 15% wider spatial perspective.\n` +
        `• Cleanliness score: 98% (High quality visual appealing for Airbnb / KEDA benchmark)`
      );
    }, 800);
  };


  const nightsBetween = (a, b) => Math.max(0, Math.round((new Date(b) - new Date(a)) / 86400000));
  const nightlyPrice = (prop, dateStr) => {
    const base = prop.customPrices?.[dateStr] ?? prop.pricePerNight;
    return base * (1 - (prop.discounts?.[dateStr] || 0) / 100);
  };
  const quoteFor = (prop) => {
    if (!prop) return { nights: 0, total: 0, subtotal: 0, conflict: false, tooShort: false, promo: null };
    const nights = nightsBetween(bookingDates.checkIn, bookingDates.checkOut);
    let subtotal = 0, conflict = false;
    for (let i = 0; i < nights; i++) {
      const d = new Date(bookingDates.checkIn); d.setDate(d.getDate() + i);
      const ds = d.toISOString().slice(0, 10);
      if (prop.blockedDates?.includes(ds) || prop.externalBookings?.[ds] ||
          bookings.some(b => b.propertyId === prop.id && b.status !== 'Cancelled' && ds >= b.checkIn && ds < b.checkOut)) conflict = true;
      subtotal += nightlyPrice(prop, ds);
    }
    const lead = daysUntil(bookingDates.checkIn);
    const returning = !!currentUser && bookings.some(b => b.guestName === currentUser.name && b.source === 'KEDA' && b.status === 'Confirmed' && b.checkOut < toYMD(new Date()));
    const cands = [];
    if (nights >= 7 && prop.weeklyDiscount) cands.push({ label: 'Weekly stay discount', pct: prop.weeklyDiscount });
    if (lead >= 30 && prop.earlyBirdDiscount) cands.push({ label: 'Early-bird discount', pct: prop.earlyBirdDiscount });
    if (returning && prop.returningDiscount) cands.push({ label: 'Welcome-back discount', pct: prop.returningDiscount });
    const promo = cands.sort((a, b) => b.pct - a.pct)[0] || null;
    const total = Math.round(subtotal * (1 - (promo?.pct || 0) / 100));
    return { nights, subtotal: Math.round(subtotal), total, conflict, tooShort: nights > 0 && nights < (prop.minNights || 1), promo };
  };
  const bookingQuote = () => quoteFor(selectedProperty);
  const submitBooking = (e) => {
    e.preventDefault();
    const q = bookingQuote();
    if (!selectedProperty || q.nights < 1 || q.conflict || q.tooShort || !guestDocumentInput.trim() || guestCount > selectedProperty.maxGuests) return;
    const dates = [];
    for (let i = 0; i < q.nights; i++) {
      const d = new Date(bookingDates.checkIn); d.setDate(d.getDate() + i);
      dates.push(d.toISOString().slice(0, 10));
    }
    setBookings(prev => [...prev, {
      id: `bk-${Date.now()}`, propertyId: selectedProperty.id, propertyTitle: selectedProperty.title,
      guestName: currentUser?.name || 'Guest', guestDniPassport: guestDocumentInput.trim(), guestDocType,
      guestAvatar: currentUser?.avatar || '', checkIn: bookingDates.checkIn, checkOut: bookingDates.checkOut,
      nights: q.nights, totalPrice: q.total, savedFees: Math.round(q.total * 0.14), status: paymentMethod === 'transfer' ? 'Awaiting transfer' : 'Confirmed',
      source: 'KEDA', paymentMethod: { card: 'Credit/Debit Card (Paid)', transfer: 'Bank Transfer (pending)', yape: 'Yape (Paid)', plin: 'Plin (Paid)' }[paymentMethod],
      contractSigned: false, contractSignedAt: null
    }]);
    setProperties(prev => prev.map(p => p.id === selectedProperty.id
      ? { ...p, blockedDates: Array.from(new Set([...(p.blockedDates || []), ...dates])) } : p));
    setBookingSuccess(true);
  };
  const closeBooking = () => { setIsBookingModalOpen(false); setBookingSuccess(false); setGuestDocumentInput(''); };

  const submitNewProperty = (e) => {
    e.preventDefault();
    if (!newProp.title.trim()) return;
    const id = `prop-${Date.now()}`;
    setProperties(prev => [...prev, {
      ...newProp, id, pricePerNight: Number(newProp.pricePerNight), minPriceFloor: Number(newProp.minPriceFloor),
      maxGuests: Number(newProp.maxGuests), bedroomsCount: Number(newProp.bedroomsCount),
      bathroomsCount: Number(newProp.bathroomsCount), garageSpaces: Number(newProp.garageSpaces),
      rooms: Array.from({ length: Number(newProp.bedroomsCount) || 1 }, (_, i) => ({ id: `r${i}`, beds: [{ type: 'Double', count: 1 }] })), images: [{ id: `img-${id}`, src: newProp.imageUrl, filter: '' }], amenities: [], icalExportUrl: `https://keda.pe/api/ical/export/${id}.ics`,
      icalImportUrls: [], blockedDates: [], customPrices: {}, discounts: {}, externalBookings: {}
    }]);
    setNewProp({ ...newProp, title: '', description: '' });
    setIsAddPropertyOpen(false);
  };

  const addIcalImport = (propId) => {
    if (!/^https?:\/\/.+/i.test(newIcalUrl.trim())) { setSyncNotice('Enter a valid iCal URL (https://...)'); return; }
    setProperties(prev => prev.map(p => p.id === propId
      ? { ...p, icalImportUrls: [...p.icalImportUrls, { id: `ical-${Date.now()}`, provider: newIcalProvider, url: newIcalUrl.trim() }] } : p));
    setNewIcalUrl(''); setSyncNotice('Calendar link added. Press "Sync now" to import it.');
  };
  const removeIcalImport = (propId, icalId) => setProperties(prev => prev.map(p => {
    if (p.id !== propId) return p;
    const ext = { ...p.externalBookings }, src = { ...(p.externalSrc || {}) }; let blocked = [...(p.blockedDates || [])];
    Object.keys(src).forEach(d => { if (src[d] === icalId) { delete ext[d]; delete src[d]; blocked = blocked.filter(x => x !== d); } });
    return { ...p, icalImportUrls: p.icalImportUrls.filter(i => i.id !== icalId), externalBookings: ext, externalSrc: src, blockedDates: blocked };
  }));
  const applyFeedEvents = (propId, feed, events) => setProperties(prev => prev.map(p => {
    if (p.id !== propId) return p;
    const ext = { ...p.externalBookings }, src = { ...(p.externalSrc || {}) }; let blocked = [...(p.blockedDates || [])];
    Object.keys(src).forEach(d => { if (src[d] === feed.id) { delete ext[d]; delete src[d]; blocked = blocked.filter(x => x !== d); } });
    events.forEach(([st, en]) => {
      const d = parseYMD(st), end = parseYMD(en);
      do { const ds = toYMD(d); ext[ds] = feed.provider; src[ds] = feed.id; if (!blocked.includes(ds)) blocked.push(ds); d.setDate(d.getDate() + 1); } while (d < end);
    });
    return { ...p, externalBookings: ext, externalSrc: src, blockedDates: blocked };
  }));
  const importPastedIcs = (prop) => {
    const ev = parseICS(pasteIcs);
    if (!ev.length) { setSyncNotice('No reservations found in that text. Paste the full .ics content.'); return; }
    applyFeedEvents(prop.id, { id: `paste-${newIcalProvider}`, provider: newIcalProvider }, ev);
    setSyncNotice(`${newIcalProvider}: ${ev.length} reservation(s) imported from pasted calendar.`); setPasteIcs('');
  };
  const downloadICS = (prop) => {
    const live = bookings.filter(b => b.propertyId === prop.id && b.source === 'KEDA' && b.status !== 'Cancelled');
    const ev = live.map(b => [b.checkIn, b.checkOut, `Booked via KEDA (${b.id})`]);
    const covered = new Set();
    live.forEach(b => { for (const d = parseYMD(b.checkIn); d < parseYMD(b.checkOut); d.setDate(d.getDate() + 1)) covered.add(toYMD(d)); });
    const mine = (prop.blockedDates || []).filter(d => !prop.externalBookings?.[d] && !covered.has(d)).sort();
    for (let i = 0; i < mine.length;) {
      let j = i;
      const nextOf = (x) => { const n = parseYMD(x); n.setDate(n.getDate() + 1); return toYMD(n); };
      while (j + 1 < mine.length && nextOf(mine[j]) === mine[j + 1]) j++;
      ev.push([mine[i], nextOf(mine[j]), 'Blocked by host']); i = j + 1;
    }
    const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//KEDA//Calendar//EN', ...ev.flatMap(([a, b, t], i) => ['BEGIN:VEVENT', `UID:${prop.id}-${i}@keda.pe`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${a.replace(/-/g, '')}`, `DTEND;VALUE=DATE:${b.replace(/-/g, '')}`, `SUMMARY:${t}`, 'END:VEVENT']), 'END:VCALENDAR'];
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar' })); a.download = `${prop.id}.ics`; a.click();
  };
  const syncNow = async (prop) => {
    const target = prop || selectedCalendarProp;
    if (!target?.icalImportUrls?.length) { setSyncNotice('Add a calendar link first.'); return; }
    setIsSyncing(true); setSyncNotice('');
    const msgs = [];
    for (const feed of target.icalImportUrls) {
      try {
        const res = await fetch(feed.url);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const text = await res.text();
        if (!text.includes('BEGIN:VCALENDAR')) throw new Error('not an iCal feed');
        const ev = parseICS(text); applyFeedEvents(target.id, feed, ev);
        msgs.push(`${feed.provider}: ${ev.length} reservation(s) imported`);
      } catch (err) {
        msgs.push(`${feed.provider}: the browser could not read the link (${err.message}). Open it, copy the .ics text and paste it below.`);
      }
    }
    setIsSyncing(false); setSyncNotice(msgs.join(' | '));
  };
  const copyText = (t) => { try { navigator.clipboard?.writeText(t); setSyncNotice('Export link copied.'); } catch { setSyncNotice('Copy failed, select the link manually.'); } };


  const openEdit = (p) => { const c = JSON.parse(JSON.stringify(p)); setEditDraft(c); setEditOriginal(JSON.stringify(c)); setConfirmExitEdit(false); setPhotoAdvice(''); };
  const editDirty = !!editDraft && JSON.stringify(editDraft) !== editOriginal;
  const closeEdit = () => { setEditDraft(null); setConfirmExitEdit(false); };
  const requestExitEdit = () => editDirty ? setConfirmExitEdit(true) : closeEdit();
  const patchDraft = (patch) => setEditDraft(d => ({ ...d, ...patch }));
  const saveEdit = () => {
    if (!editDraft.title.trim()) return;
    const d = { ...editDraft, bedroomsCount: editDraft.rooms.filter(r => (r.kind || 'bedroom') === 'bedroom').length, imageUrl: editDraft.images[0]?.src };
    setProperties(prev => prev.map(p => p.id === d.id ? d : p));
    closeEdit();
  };
  const uploadPhotos = (files) => Array.from(files).forEach(f => {
    const r = new FileReader();
    r.onload = () => setEditDraft(d => ({ ...d, images: [...d.images, { id: `img-${Date.now()}-${Math.random()}`, src: r.result, filter: '' }] }));
    r.readAsDataURL(f);
  });
  const analyzePhoto = (img) => new Promise(res => {
    const el = new Image(); el.crossOrigin = 'anonymous';
    el.onload = () => { try {
      const c = document.createElement('canvas'); c.width = c.height = 40; const x = c.getContext('2d'); x.drawImage(el, 0, 0, 40, 40);
      const px = x.getImageData(0, 0, 40, 40).data; let sum = 0;
      for (let i = 0; i < px.length; i += 4) sum += 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
      res(sum / (px.length / 4));
    } catch { res(null); } };
    el.onerror = () => res(null); el.src = img.src;
  });
  const enhancePhoto = async (img) => {
    setPhotoAdvice('Analyzing photo...');
    const b = await analyzePhoto(img);
    const gain = b == null ? 1.08 : b < 90 ? 1.25 : b < 120 ? 1.12 : b > 190 ? 0.92 : 1.04;
    const tips = [];
    if (b != null) tips.push(b < 90 ? 'Photo is too dark: open curtains, switch on every light, shoot in daytime.' : b > 190 ? 'Photo is overexposed: keep bright windows out of frame.' : 'Lighting looks balanced.');
    tips.push('Shoot landscape from a corner at chest height to show the whole room.', 'Make beds with fresh linen, clear surfaces, add one accent (plant or flowers).', 'Cover every bedroom, bathroom, kitchen, view and entrance. Put your best photo first.');
    setEditDraft(d => ({ ...d, images: d.images.map(i => i.id === img.id ? { ...i, filter: `brightness(${gain}) contrast(1.08) saturate(1.12)` } : i) }));
    setPhotoAdvice(tips.map(t => '• ' + t).join('\n'));
  };
  const setRoom = (ri, fn) => setEditDraft(d => ({ ...d, rooms: d.rooms.map((r, i) => i === ri ? fn(r) : r) }));


  const openContract = (b) => { setSelectedContractBooking(b); setESignatureText(''); setHasAcceptedTermsCheck(false); setIsContractModalOpen(true); };
  const signContract = (name) => {
    const sig = (name || eSignatureText).trim();
    if (!hasAcceptedTermsCheck || sig.length < 3 || !selectedContractBooking) return;
    const at = new Date().toLocaleString();
    setBookings(prev => prev.map(b => b.id === selectedContractBooking.id ? { ...b, contractSigned: true, contractSignedAt: at, contractSignature: sig } : b));
  };
  const downloadContract = (b) => {
    const clauses = buildContract(b, properties.find(p => p.id === b.propertyId), INITIAL_USER);
    const text = `CONTRATO DE ARRENDAMIENTO DE VIVIENDA TEMPORAL AMOBLADA (SHORT-TERM LODGING LEASE AGREEMENT)\nBooking: ${fmtDate(b.checkIn)} to ${fmtDate(b.checkOut)}\n\n` +
      clauses.map(([t, ps], i) => `${i + 1}. ${t.toUpperCase()}\n${ps.join('\n')}`).join('\n\n') +
      (b.contractSigned ? `\n\nSigned electronically by ${b.contractSignature || b.guestName} on ${b.contractSignedAt}.` : '\n\nNot signed yet.');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' })); a.download = `contract-${b.id}.txt`; a.click();
  };
  const renderBookingList = (list, title) => (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><FileText className="w-4 h-4 text-keda-500" /> {title}</h3>
      {list.length === 0 && <p className="text-xs text-slate-500">No bookings yet.</p>}
      {list.map(b => (
        <div key={b.id} className="flex flex-wrap justify-between items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
          <div>
            <p className="font-bold text-slate-800">{b.propertyTitle}</p>
            <p className="text-slate-500">{b.guestName} · {b.checkIn} to {b.checkOut} · {formatMoney(b.totalPrice)} · {b.status}</p>
            {(activeRoleMode === 'host' || b.status === 'Confirmed') && properties.find(p => p.id === b.propertyId)?.address && <p className="text-slate-600">📍 {properties.find(p => p.id === b.propertyId).address}</p>}
          </div>
          {b.source === 'KEDA' ? (
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full font-semibold ${b.contractSigned ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{b.contractSigned ? 'Contract signed' : 'Awaiting signature'}</span>
              <button onClick={() => openContract(b)} className="bg-keda-600 text-white px-3 py-1.5 rounded-lg font-semibold">{b.contractSigned || activeRoleMode === 'host' ? 'View contract' : 'Review & sign'}</button>
              {activeRoleMode === 'guest' && b.status === 'Confirmed' && b.checkOut < todayStr && !b.reviewed && <button onClick={() => setReviewTarget(b)} className="bg-kamber hover:bg-kamber-d text-white px-3 py-1.5 rounded-lg font-semibold">Leave a review</button>}
            </div>
          ) : <span className="text-slate-500">{b.source}: no contract needed</span>}
        </div>
      ))}
    </div>
  );

  const openChatFor = (prop) => { setActiveChatProperty(prop); setIsChatOpen(true); setIsChatMinimized(false); };
  const profileComplete = !!(currentUser?.name?.trim() && currentUser.dateOfBirth && currentUser.idDocumentImage && currentUser.idDocumentNumber && currentUser.sworn);
  const openProfile = (notice = '', u = currentUser) => {
    setProfileForm({ name: u?.name || '', dob: u?.dateOfBirth || '', docType: u?.idDocumentType || 'DNI', docNumber: u?.idDocumentNumber || '', docImage: u?.idDocumentImage || null, avatar: u?.avatar || '', sworn: !!u?.sworn });
    setProfileError(''); setProfileNotice(notice); setIsProfileModalOpen(true);
  };
  const requireProfile = (fn) => !currentUser ? openAuth('Log in or sign up to book or host on KEDA.') : profileComplete ? fn() : openProfile('Complete your profile to continue. We need your full name, date of birth and a sworn declaration for your ID, to keep hosts and guests safe.');
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const openAuth = (notice = '', mode = 'login') => { setAuthMode(mode); setAuthNotice(notice); setAuthError(''); setAuthSocial(null); setAuthForm({ name: '', email: '', password: '', confirm: '' }); setIsAuthModalOpen(true); };
  const finishLogin = (acc) => {
    const { password, ...user } = acc;
    setCurrentUser(user); setIsAuthModalOpen(false); setAuthSocial(null);
    const complete = !!(user.name?.trim() && user.dateOfBirth && user.idDocumentImage && user.idDocumentNumber && user.sworn);
    if (!complete) openProfile('Welcome to KEDA! To book or host we need to identify you: full name, date of birth, a photo of your DNI, passport or carnet de extranjería, and a sworn declaration.', user);
  };
  const submitAuth = (e) => {
    e.preventDefault();
    const f = authForm, email = f.email.trim().toLowerCase();
    if (!EMAIL_RE.test(email)) return setAuthError('Enter a valid email address.');
    if (authMode === 'signup') {
      if (f.name.trim().split(/\s+/).length < 2) return setAuthError('Enter your full name (first name and last name).');
      if (f.password.length < 8) return setAuthError('Password must have at least 8 characters.');
      if (f.password !== f.confirm) return setAuthError('Passwords do not match.');
      if (accounts.some(a => a.email === email)) return setAuthError('An account with this email already exists. Log in instead.');
      const acc = { id: `user-${Date.now()}`, name: f.name.trim(), email, password: f.password, provider: 'email', avatar: '', dateOfBirth: '', idDocumentType: 'DNI', idDocumentNumber: '', idDocumentImage: null, sworn: false, idVerified: false };
      setAccounts(prev => [...prev, acc]); finishLogin(acc);
    } else {
      const acc = accounts.find(a => a.email === email && a.provider === 'email' && a.password === f.password);
      if (!acc) { const other = accounts.find(a => a.email === email && a.provider !== 'email'); return setAuthError(other ? `This email uses ${other.provider === 'google' ? 'Google' : 'Facebook'} sign-in. Use that button.` : 'Incorrect email or password.'); }
      finishLogin(acc);
    }
  };
  const submitSocial = (e) => {
    e.preventDefault();
    const email = socialForm.email.trim().toLowerCase();
    if (!EMAIL_RE.test(email)) return setAuthError('Enter a valid email address.');
    let acc = accounts.find(a => a.email === email);
    if (acc && acc.provider !== authSocial) return setAuthError(`This email is registered with ${acc.provider === 'email' ? 'a password' : acc.provider === 'google' ? 'Google' : 'Facebook'}. Use that method.`);
    if (!acc) {
      if (socialForm.name.trim().split(/\s+/).length < 2) return setAuthError('Enter your full name (first name and last name).');
      acc = { id: `user-${Date.now()}`, name: socialForm.name.trim(), email, provider: authSocial, avatar: '', dateOfBirth: '', idDocumentType: 'DNI', idDocumentNumber: '', idDocumentImage: null, sworn: false, idVerified: false };
      setAccounts(prev => [...prev, acc]);
    }
    finishLogin(acc);
  };
  const toggleWish = (id) => { if (!currentUser) { openAuth('Log in or sign up to save places.'); return; } setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]); };
  const submitReview = (e) => {
    e.preventDefault();
    if (!reviewTarget || reviewForm.text.trim().length < 10) return;
    const parts = currentUser.name.split(' ');
    setProperties(prev => prev.map(p => p.id === reviewTarget.propertyId ? { ...p, reviews: [...(p.reviews || []), { id: `rv-${Date.now()}`, author: `${parts[0]} ${(parts[1] || '').charAt(0)}.`, rating: reviewForm.rating, date: toYMD(new Date()), text: reviewForm.text.trim(), verified: true }] } : p));
    setBookings(prev => prev.map(b => b.id === reviewTarget.id ? { ...b, reviewed: true } : b));
    setReviewTarget(null); setReviewForm({ rating: 5, text: '' });
  };
  const demoLogin = () => finishLogin(accounts.find(a => a.id === 'user-demo'));
  const signOut = () => { setWishlist([]); setDetailPropId(null); setCurrentUser(null); setActiveRoleMode('guest'); setActiveTab('dashboard'); setIsProfileModalOpen(false); setIsContractModalOpen(false); setEditDraft(null); setIsBookingModalOpen(false); setIsChatOpen(false); };
  const switchRole = (mode) => {
    if (mode === 'host' && !profileComplete) { openProfile('To host on KEDA we need to identify you first: full name, date of birth, a photo of your ID and a sworn declaration.'); return; }
    setActiveRoleMode(mode);
  };
  const readFile = (file, cb) => { const r = new FileReader(); r.onload = () => cb(r.result); r.readAsDataURL(file); };
  const saveProfile = (e) => {
    e.preventDefault();
    const f = profileForm;
    if (f.name.trim().split(/\s+/).length < 2) return setProfileError('Enter your full name (first name and last name).');
    if (!f.dob || isNaN(new Date(f.dob)) || calcAge(f.dob) < 18) return setProfileError('Enter a valid date of birth. You must be 18 or older.');
    if (f.docNumber.trim().length < 6) return setProfileError('Enter your document number.');
    if (!f.docImage) return setProfileError('Upload a photo of your DNI, passport or carnet de extranjería.');
    if (!f.sworn) return setProfileError('You must accept the sworn declaration.');
    setCurrentUser(u => ({ ...u, name: f.name.trim(), dateOfBirth: f.dob, idDocumentType: f.docType, idDocumentNumber: f.docNumber.trim(), idDocumentImage: f.docImage, avatar: f.avatar || u.avatar, sworn: true, swornAt: new Date().toLocaleString(), idVerified: true }));
    setIsProfileModalOpen(false);
  };

  // SUNAT monthly tax: 5% of the month's gross income, due date by last digit of the RUC
  const hostRuc = [rucOverride, currentUser?.idDocumentNumber, currentUser?.dniRuc].map(v => (v || '').replace(/\D/g, '')).map(v => v.length === 11 ? v : rucFromDni(v)).find(Boolean) || null;
  const rucLast = hostRuc ? Number(hostRuc.slice(-1)) : null;
  const taxBookings = bookings.filter(b => b.status !== 'Cancelled' && b.checkIn.slice(0, 7) === taxMonth && (selectedFinancePropId === 'all' || b.propertyId === selectedFinancePropId));
  const taxGrossUsd = taxBookings.reduce((a, b) => a + b.totalPrice, 0);
  const taxData = { grossIncomeUsd: taxGrossUsd, grossIncomePen: taxGrossUsd * 3.75, sunatTaxUsd: taxGrossUsd * 0.05, sunatTaxPen: taxGrossUsd * 3.75 * 0.05 };
  const taxDueDate = rucLast != null ? sunatDue(taxMonth, rucLast) : null;
  const sunatDueDate = taxDueDate ? fmtDate(taxDueDate) : 'not available';

  const financeBookings = bookings.filter(b => b.status !== 'Cancelled' && (selectedFinancePropId === 'all' || b.propertyId === selectedFinancePropId));
  const periodKey = (ds) => {
    if (financeTimeframe === 'yearly') return ds.slice(0, 4);
    if (financeTimeframe === 'monthly') return ds.slice(0, 7);
    const d = new Date(ds + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
    return 'Week of ' + d.toISOString().slice(0, 10);
  };
  const byPeriod = {};
  financeBookings.forEach(b => {
    const g = byPeriod[periodKey(b.checkIn)] || (byPeriod[periodKey(b.checkIn)] = { income: 0, direct: 0, external: 0, count: 0, nights: 0 });
    g.income += b.totalPrice; g[b.source === 'KEDA' ? 'direct' : 'external'] += b.totalPrice; g.count++; g.nights += b.nights;
  });
  const periodRows = Object.entries(byPeriod).sort(([a], [b]) => a.localeCompare(b));
  const totalIncome = financeBookings.reduce((a, b) => a + b.totalPrice, 0);
  const totalNights = financeBookings.reduce((a, b) => a + b.nights, 0);
  const totalSaved = financeBookings.reduce((a, b) => a + (b.savedFees || 0), 0);
  const totalExpenses = expenses.filter(x => selectedFinancePropId === 'all' || x.propertyId === selectedFinancePropId).reduce((a, x) => a + x.amount, 0);
  const bestPeriod = [...periodRows].sort(([, a], [, b]) => b.income - a.income)[0];
  const financePropName = selectedFinancePropId === 'all' ? 'all properties' : properties.find(p => p.id === selectedFinancePropId)?.title;


  const addressUnlocked = (p) => bookings.some(b => b.propertyId === p.id && b.status === 'Confirmed' && b.source === 'KEDA' && b.guestName === currentUser?.name);
  const visibleListings = properties
    .filter(p => (locFilter === 'all' || p.district === locFilter) && bedsOf(p) >= minBeds && (!maxPrice || p.pricePerNight <= Number(maxPrice)) &&
      (!freeCancelOnly || CANCEL_POLICIES[p.cancellation || 'moderate'].free) && (!favOnly || isFavorite(p)) && (!savedOnly || wishlist.includes(p.id)))
    .sort((a, b) => sortBy === 'price-asc' ? a.pricePerNight - b.pricePerNight : sortBy === 'price-desc' ? b.pricePerNight - a.pricePerNight : sortBy === 'rating' ? (ratingOf(b) || 0) - (ratingOf(a) || 0) : 0);
  const detailProp = properties.find(p => p.id === detailPropId) || null;
  const todayStr = toYMD(new Date());
  const thisMonth = todayStr.slice(0, 7);
  const dashBookings = bookings.filter(b => b.status !== 'Cancelled' && (dashProp === 'all' || b.propertyId === dashProp));
  const dashProps = properties.filter(p => dashProp === 'all' || p.id === dashProp);
  const dashReminders = serviceReminders.filter(r => dashProp === 'all' || r.propertyId === 'all' || r.propertyId === dashProp).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const unreadGuestMsgs = messages.filter(m => m.senderRole === 'guest' && !readMsgIds.includes(m.id));
  const isBusyOn = (p, ds) => !!(p.blockedDates?.includes(ds) || p.externalBookings?.[ds] || bookings.some(b => b.propertyId === p.id && b.status !== 'Cancelled' && ds >= b.checkIn && ds < b.checkOut));
  const occ30 = (p) => { let n = 0; for (let i = 0; i < 30; i++) { const d = new Date(); d.setDate(d.getDate() + i); if (isBusyOn(p, toYMD(d))) n++; } return Math.round(n / 30 * 100); };
  const dashOcc = dashProps.length ? Math.round(dashProps.reduce((a, p) => a + occ30(p), 0) / dashProps.length) : 0;
  const monthRevenue = dashBookings.filter(b => b.checkIn.slice(0, 7) === thisMonth).reduce((a, b) => a + b.totalPrice, 0);
  const monthExpenses = expenses.filter(x => x.month === thisMonth && (dashProp === 'all' || x.propertyId === dashProp)).reduce((a, x) => a + x.amount, 0);
  const upcomingStays = dashBookings.filter(b => b.checkOut >= todayStr).sort((a, b) => a.checkIn.localeCompare(b.checkIn)).slice(0, 4);
  const checkins30 = dashBookings.filter(b => { const d = daysUntil(b.checkIn); return d >= 0 && d <= 30; }).length;
  const allNotifs = [];
  dashBookings.forEach(b => {
    const d = daysUntil(b.checkIn);
    const when = d === 0 ? 'today' : d === 1 ? 'tomorrow' : `in ${d} days`;
    if (d >= 0 && d <= 30) allNotifs.push({ id: `bk-${b.id}`, type: 'bookings', sort: d, title: `${b.source === 'KEDA' ? b.guestName : b.source + ' guest'} checks in ${when}`, sub: `${b.propertyTitle} · ${b.checkIn} to ${b.checkOut}`, go: () => { setSelectedCalendarPropId(b.propertyId); setActiveTab('calendar'); } });
    if (b.source === 'KEDA' && d >= 0 && d <= 30) allNotifs.push({ id: `in-${b.id}`, type: 'income', sort: d + 0.5, title: `Next income: ${formatMoney(b.totalPrice)} (${b.guestName})`, sub: b.status === 'Awaiting transfer' ? 'Waiting for bank transfer' : `Paid via ${b.paymentMethod}`, go: () => setActiveTab('finance') });
    if (b.source === 'KEDA' && b.contractSigned) allNotifs.push({ id: `cs-${b.id}`, type: 'contracts', signed: true, sort: 20 + Math.max(d, 0), title: `Contract signed by ${b.guestName}`, sub: `${b.contractSignedAt} · ${b.checkIn} to ${b.checkOut}`, go: () => openContract(b) });
    const bp = properties.find(p => p.id === b.propertyId);
    if (b.source === 'KEDA' && bp) { let clash = false; for (const x = parseYMD(b.checkIn); x < parseYMD(b.checkOut); x.setDate(x.getDate() + 1)) if (bp.externalBookings?.[toYMD(x)]) clash = true; if (clash) allNotifs.push({ id: `ob-${b.id}`, type: 'bookings', sort: -2, overdue: true, title: `Overbooking risk: ${b.guestName}`, sub: 'Overlaps a reservation imported from another app', go: () => { setSelectedCalendarPropId(b.propertyId); setActiveTab('calendar'); } }); }
    if (b.source === 'KEDA' && !b.contractSigned) allNotifs.push({ id: `ct-${b.id}`, type: 'contracts', sort: Math.max(d, 0) + 0.2, title: `Contract awaiting signature: ${b.guestName}`, sub: `Not signed yet · ${b.checkIn} to ${b.checkOut}`, go: () => openContract(b) });
  });
  const lastMonth = toYMD(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)).slice(0, 7);
  const lastMonthGross = dashBookings.filter(b => b.checkIn.slice(0, 7) === lastMonth).reduce((a, b) => a + b.totalPrice, 0);
  const lastTaxDue = rucLast != null ? sunatDue(lastMonth, rucLast) : null;
  if (lastTaxDue && lastMonthGross > 0 && daysUntil(lastTaxDue) <= 14 && daysUntil(lastTaxDue) >= -30) allNotifs.push({ id: `tax-${lastMonth}`, type: 'bills', sort: daysUntil(lastTaxDue) - 0.2, overdue: daysUntil(lastTaxDue) < 0, title: `SUNAT tax for ${lastMonth}: S/ ${(lastMonthGross * 3.75 * 0.05).toFixed(2)}`, sub: `${dueText(daysUntil(lastTaxDue))} (${lastTaxDue})`, go: () => setActiveTab('finance') });
  dashReminders.forEach(r => { const d = daysUntil(r.dueDate); if (d <= 14) allNotifs.push({ id: `bill-${r.id}-${r.dueDate}`, type: 'bills', sort: d - 0.1, overdue: d < 0, title: `${r.name}: ${formatMoney(r.amount)}`, sub: dueText(d), go: () => setActiveTab('finance') }); });
  messages.filter(m => m.senderRole === 'guest' && !readMsgIds.includes(m.id) && (dashProp === 'all' || m.propertyId === dashProp)).forEach(m => {
    allNotifs.push({ id: `msg-${m.id}`, type: 'messages', sort: -1, title: `New message from ${m.sender}`, sub: m.text.length > 80 ? m.text.slice(0, 80) + '…' : m.text, go: () => openChatFor(properties.find(p => p.id === m.propertyId) || properties[0]) });
  });
  const visibleNotifs = allNotifs.filter(n => !dismissedNotifs.includes(n.id)).sort((a, b) => a.sort - b.sort);
  const dashUnreadLabel = (l) => { const m = l.filter(x => x.type === 'messages').length, c = l.filter(x => x.type === 'contracts').length, b = l.filter(x => x.type === 'bills').length; return `${m} message(s) · ${c} contract(s) · ${b} bill(s)`; };
  const notifList = visibleNotifs.filter(n => notifFilter === 'all' || n.type === notifFilter);

  // calendar helpers
  const calProp = selectedCalendarProp;
  const calY = calDate.getFullYear(), calM = calDate.getMonth();
  const dayInfo = (ds) => {
    const ext = calProp?.externalBookings?.[ds];
    const direct = bookings.some(b => b.propertyId === calProp?.id && b.source === 'KEDA' && b.status !== 'Cancelled' && ds >= b.checkIn && ds < b.checkOut);
    const blocked = calProp?.blockedDates?.includes(ds);
    return { ext, direct, status: ext ? 'external' : (blocked || direct) ? 'busy' : 'free', price: Math.round(nightlyPrice(calProp, ds)), discount: calProp?.discounts?.[ds] };
  };
  const monthCells = (y, m) => [...Array(new Date(y, m, 1).getDay()).fill(null), ...Array.from({ length: new Date(y, m + 1, 0).getDate() }, (_, i) => toYMD(new Date(y, m, i + 1)))];
  const weekCells = Array.from({ length: 7 }, (_, i) => toYMD(new Date(calY, calM, calDate.getDate() - calDate.getDay() + i)));
  const visibleDates = calView === 'week' ? weekCells : calView === 'month' ? monthCells(calY, calM).filter(Boolean) : [];
  const selectAllCal = () => { if (calView === 'year') { const out = []; for (let m = 0; m < 12; m++) out.push(...monthCells(calY, m).filter(Boolean)); setSelectedDates(out); } else setSelectedDates(visibleDates); };
  const calTitle = calView === 'year' ? String(calY) : calView === 'month' ? calDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : `${parseYMD(weekCells[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} to ${parseYMD(weekCells[6]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  const shiftCal = (dir) => setCalDate(d => calView === 'month' ? new Date(d.getFullYear(), d.getMonth() + dir, 1) : calView === 'week' ? new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7 * dir) : new Date(d.getFullYear() + dir, d.getMonth(), 1));
  const dayCell = (ds, tall) => {
    const info = dayInfo(ds);
    return (
      <div key={ds} onClick={() => handleSelectDate(ds)}
        className={`p-2 ${tall ? 'min-h-[110px]' : 'min-h-[64px]'} border rounded-xl text-left cursor-pointer transition relative ${CAL_STATUS[info.status]} ${selectedDates.includes(ds) ? 'ring-2 ring-keda-600 shadow' : 'hover:shadow'} ${ds === todayStr ? 'outline outline-2 outline-keda-400' : ''}`}>
        {tall && <span className="block text-[10px] uppercase opacity-70">{parseYMD(ds).toLocaleDateString('en-US', { weekday: 'short' })}</span>}
        <span className="text-xs font-extrabold">{Number(ds.slice(8))}</span>
        {info.ext && <span className="block text-[9px] font-bold text-blue-700 truncate">{info.ext}</span>}
        {info.status === 'busy' && <span className="block text-[9px] font-bold text-red-700">{info.direct ? 'Booked' : 'Blocked'}</span>}
        {info.status === 'free' && (<div className="mt-1"><span className="block text-[10px] font-bold text-slate-800">{formatMoney(info.price)}</span>{info.discount ? <span className="block text-[9px] text-kamber font-bold">-{info.discount}% OFF</span> : null}</div>)}
      </div>
    );
  };

  // finance helpers
  const finExpenses = expenses.filter(x => selectedFinancePropId === 'all' || x.propertyId === selectedFinancePropId);
  const expByPeriod = {};
  finExpenses.forEach(x => { const k = periodKey(x.date); expByPeriod[k] = (expByPeriod[k] || 0) + x.amount; });
  const allKeys = [...new Set([...Object.keys(byPeriod), ...Object.keys(expByPeriod)])].sort();
  const chartMax = Math.max(1, ...allKeys.map(k => Math.max(byPeriod[k]?.income || 0, expByPeriod[k] || 0)));
  const shortKey = (k) => k.startsWith('Week of ') ? 'Wk ' + k.slice(8) : k.length === 7 ? new Date(Number(k.slice(0, 4)), Number(k.slice(5, 7)) - 1, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) : k;
  const catTotals = {};
  finExpenses.forEach(x => { catTotals[x.category] = (catTotals[x.category] || 0) + x.amount; });
  const catRows = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  const propStats = properties.map(p => {
    const inc = bookings.filter(b => b.propertyId === p.id && b.status !== 'Cancelled').reduce((a, b) => a + b.totalPrice, 0);
    const exp = expenses.filter(x => x.propertyId === p.id).reduce((a, x) => a + x.amount, 0);
    return { p, inc, exp, net: inc - exp };
  });
  const netBalance = totalIncome - totalExpenses;
  const margin = totalIncome ? Math.round(netBalance / totalIncome * 100) : 0;

  return (
    <div className="min-h-screen text-slate-800 flex flex-col" style={{ background: '#F8FAFC', fontFamily: KEDA_FONT }}>
      <style>{FONT_IMPORT + EXTRA_CSS + KEDA_CSS}</style>
      {/* Top Navbar Header */}
      <header className="bg-keda-900 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <KedaLogo size={40} />
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-white leading-none">KEDA</span>
              <p className="text-xs text-keda-400 font-semibold">Alquila directo. Paga lo justo.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Currency & Language Settings button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs transition border border-slate-700"
            >
              <Settings className="w-3.5 h-3.5 text-keda-400" />
              <span>{currency} | {language}</span>
            </button>

            {/* Role Switcher Pill */}
            {currentUser ? (
              <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex items-center space-x-1">
                <button
                  onClick={() => switchRole('host')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                    activeRoleMode === 'host' ? 'bg-keda-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" /> Host Mode
                </button>
                <button
                  onClick={() => setActiveRoleMode('guest')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                    activeRoleMode === 'guest' ? 'bg-keda-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" /> Guest Mode
                </button>
              </div>
            ) : null}

            {/* User Profile Avatar / Login Button */}
            {currentUser ? (
              <div 
                onClick={() => openProfile()}
                className="flex items-center space-x-2 bg-keda-800 hover:bg-keda-700 cursor-pointer p-1.5 rounded-xl border border-keda-700 transition"
              >
                {currentUser.avatar ? <img src={currentUser.avatar} alt="Avatar" className="w-7 h-7 rounded-full object-cover border border-keda-400" /> : <span className="w-7 h-7 rounded-full bg-keda-500 text-white text-xs font-bold flex items-center justify-center">{currentUser.name.charAt(0).toUpperCase()}</span>}
                <div className="hidden sm:block text-left pr-1">
                  <p className="text-xs font-semibold text-white leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" /> {profileComplete ? 'ID declared' : 'Complete profile'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => openAuth('', 'login')} className="text-slate-200 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition">Log in</button>
                <button onClick={() => openAuth('', 'signup')} className="bg-keda-600 hover:bg-keda-500 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition">Sign up</button>
              </div>
            )}
            {currentUser && (
              <button onClick={signOut} className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition">
                <LogOut className="w-3.5 h-3.5" /> Sign out
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex-grow">
        {/* Guest View Tab */}
        {activeRoleMode === 'guest' ? (
          <div className="space-y-6">
            <div className="rounded-2xl p-6 text-white shadow-xl relative overflow-hidden" style={{ background: 'linear-gradient(120deg,#0F172A 0%,#0F3D3E 55%,#00A67C 135%)' }}>
              <div className="relative z-10 max-w-2xl">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Alquila directo. Paga lo justo.</h1>
                <p className="text-keda-200 text-sm mb-4">
                  Rent direct. Pay what's fair. Book straight with local hosts in Peru: no guest service fees (Airbnb's is around 14%), a digital lease contract, and your exact address once the booking is confirmed.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Yape / Plin Supported
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> ID-declared hosts & digital contract
                  </span>
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" /> No guest service fees
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-3 items-end text-xs">
              <label className="font-semibold">Check-in<input type="date" value={bookingDates.checkIn} onChange={(e) => setBookingDates({ ...bookingDates, checkIn: e.target.value })} className="mt-1 block border border-slate-300 rounded-lg px-2 py-1.5" /></label>
              <label className="font-semibold">Check-out<input type="date" value={bookingDates.checkOut} onChange={(e) => setBookingDates({ ...bookingDates, checkOut: e.target.value })} className="mt-1 block border border-slate-300 rounded-lg px-2 py-1.5" /></label>
              <label className="font-semibold">Guests<input type="number" min="1" value={guestCount} onChange={(e) => setGuestCount(Math.max(1, Number(e.target.value) || 1))} className="mt-1 block w-20 border border-slate-300 rounded-lg px-2 py-1.5" /></label>
              <label className="font-semibold">Zone<select value={locFilter} onChange={(e) => setLocFilter(e.target.value)} className="mt-1 block border border-slate-300 rounded-lg px-2 py-1.5 font-normal"><option value="all">All zones</option>{[...new Set(properties.map(p => p.district))].map(d => <option key={d} value={d}>{d}</option>)}</select></label>
              <p className="text-slate-500">{nightsBetween(bookingDates.checkIn, bookingDates.checkOut)} night(s) · Pay by card, bank transfer, Yape or Plin</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-slate-300 rounded-lg px-2 py-1.5 bg-white">
                <option value="recommended">Sort: Recommended</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="rating">Best rated</option></select>
              <select value={minBeds} onChange={(e) => setMinBeds(Number(e.target.value))} className="border border-slate-300 rounded-lg px-2 py-1.5 bg-white">
                <option value={0}>Any bedrooms</option><option value={1}>1+ bedrooms</option><option value={2}>2+ bedrooms</option><option value={3}>3+ bedrooms</option></select>
              <label className="flex items-center gap-1 font-semibold">Max price <input type="number" min="0" placeholder="Any" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-20 border border-slate-300 rounded-lg px-2 py-1.5 font-normal bg-white" /></label>
              {[['Free cancellation', freeCancelOnly, setFreeCancelOnly], ['KEDA Favorites', favOnly, setFavOnly], [`Saved (${wishlist.length})`, savedOnly, setSavedOnly]].map(([label, on, set]) => (
                <button key={label} onClick={() => set(!on)} className={`px-3 py-1.5 rounded-full font-semibold border transition ${on ? 'bg-keda-600 text-white border-keda-600' : 'bg-white text-slate-600 border-slate-300 hover:border-keda-300'}`}>{label}</button>
              ))}
              <span className="text-slate-500">{visibleListings.length} place(s)</span>
            </div>
            {visibleListings.length === 0 && <p className="text-xs text-slate-500 text-center py-6">No places match these filters. Try removing one.</p>}
            {/* Properties List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleListings.map(prop => (
                <div key={prop.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="relative cursor-pointer" onClick={() => { setDetailPropId(prop.id); setDetailPhoto(0); }}>
                    <img src={prop.images[0].src} style={{ filter: prop.images[0].filter }} alt={prop.title} className="w-full h-48 object-cover" />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {isFavorite(prop) && <span className="bg-white text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1"><Star className="w-3 h-3 text-kamber" /> KEDA Favorite</span>}
                      {CANCEL_POLICIES[prop.cancellation || 'moderate'].free && <span className="bg-keda-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">Free cancellation</span>}
                    </div>
                    <button aria-label="Save" onClick={(e) => { e.stopPropagation(); toggleWish(prop.id); }} className="absolute top-2 right-2 bg-white hover:bg-slate-100 p-1.5 rounded-full shadow"><Heart className={`w-4 h-4 ${wishlist.includes(prop.id) ? 'text-rose-500 fill-current' : 'text-slate-600'}`} /></button>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-keda-600 uppercase tracking-wider">{addressUnlocked(prop) && prop.address ? `📍 ${prop.address}, ` : ""}{prop.district}{addressUnlocked(prop) ? "" : " district zone"}, {prop.city}</span>
                        <h3 onClick={() => { setDetailPropId(prop.id); setDetailPhoto(0); }} className="font-semibold text-slate-900 line-clamp-1 cursor-pointer hover:underline">{prop.title}</h3>
                        {ratingOf(prop) != null ? <p className="text-xs text-slate-600 flex items-center gap-1"><Star className="w-3 h-3 text-kamber" />{ratingOf(prop).toFixed(1)} · {prop.reviews.length} review(s)</p> : <p className="text-xs text-slate-400">New listing</p>}
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-slate-900">{formatMoney(prop.pricePerNight)}</span>
                        <span className="text-xs text-slate-500">/night</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{prop.description}</p>
                    {(() => { const q = quoteFor(prop); const busy = Math.round(occ30(prop) * 30 / 100); return (<>
                      {q.nights < 1 || q.conflict
                        ? <p className="text-xs font-semibold text-red-600">Not available for these dates</p>
                        : q.tooShort ? <p className="text-xs font-semibold text-red-600">Minimum stay: {prop.minNights} nights</p>
                        : <p className="text-xs text-emerald-700 font-semibold">{q.nights} night(s): {formatMoney(q.total)} total, no service fees{q.promo ? ` · ${q.promo.pct}% ${q.promo.label.toLowerCase()}` : ''} · save ≈ {formatMoney(Math.round(q.total * 0.14))} vs Airbnb</p>}
                      {busy >= 18 && <p className="text-[11px] text-kamber font-semibold">Popular: only {30 - busy} free nights in the next 30 days</p>}
                    </>); })()}
                    
                    <PropertyFacts prop={prop} />

                    <div className="flex space-x-2 pt-1">
                      <button
                        onClick={() => requireProfile(() => { setSelectedProperty(prop); setGuestDocumentInput(currentUser?.idDocumentNumber || ''); setGuestDocType(currentUser?.idDocumentType || 'DNI'); setIsBookingModalOpen(true); })}
                        disabled={quoteFor(prop).conflict || quoteFor(prop).tooShort || quoteFor(prop).nights < 1 || guestCount > prop.maxGuests}
                        className="flex-1 bg-keda-600 hover:bg-keda-700 disabled:opacity-40 text-white py-2 rounded-xl text-xs font-semibold transition"
                      >
                        Book Direct
                      </button>
                      <button onClick={() => { setDetailPropId(prop.id); setDetailPhoto(0); }} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold transition">Details</button>
                      <button
                        onClick={() => { setActiveChatProperty(prop); setIsChatOpen(true); }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Direct Inquiry
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {bookings.some(b => b.source === 'KEDA' && b.guestName === currentUser?.name) && renderBookingList(bookings.filter(b => b.source === 'KEDA' && b.guestName === currentUser?.name), 'My Bookings & Contracts')}
          </div>
        ) : (
          /* Host View Mode */
          <div className="space-y-6">
            {/* Host Dashboard Header Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-4 gap-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'dashboard' ? 'bg-keda-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('listings')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'listings' ? 'bg-keda-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
                >
                  My Listings
                </button>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'calendar' ? 'bg-keda-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
                >
                  Calendar
                </button>
                <button
                  onClick={() => setActiveTab('finance')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'finance' ? 'bg-keda-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
                >
                  Finance
                </button>
                <button
                  onClick={() => setActiveTab('contracts')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'contracts' ? 'bg-keda-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
                >
                  Contracts
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => requireProfile(() => setIsAddPropertyOpen(true))}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Property
                </button>
              </div>
            </div>

            {/* Dashboard View */}
            {activeTab === 'dashboard' && (() => {
              const dc = dashBookings.filter(b => b.source === 'KEDA');
              const signed = dc.filter(b => b.contractSigned), pend = dc.filter(b => !b.contractSigned);
              const billsSoon = dashReminders.filter(r => daysUntil(r.dueDate) <= 14);
              const unread = unreadGuestMsgs.filter(m => dashProp === 'all' || m.propertyId === dashProp);
              const net = monthRevenue - monthExpenses;
              const stats = [
                { label: 'Revenue this month', value: formatMoney(monthRevenue), sub: `Net ${formatMoney(net)}`, tone: net >= 0 ? 'text-emerald-600' : 'text-rose-600', go: () => setActiveTab('finance') },
                { label: 'Occupancy, 30 days', value: `${dashOcc}%`, bar: dashOcc, go: () => setActiveTab('calendar') },
                { label: 'Check-ins, 30 days', value: checkins30, sub: upcomingStays[0] ? `Next: ${upcomingStays[0].checkIn}` : 'None planned', tone: 'text-slate-500', go: () => setActiveTab('calendar') },
                { label: 'Contracts signed', value: `${signed.length}/${dc.length}`, sub: pend.length ? `${pend.length} missing signature` : 'All signed', tone: pend.length ? 'text-amber-600' : 'text-emerald-600', go: () => setActiveTab('contracts') },
                { label: 'Bills due (14 days)', value: billsSoon.length, sub: formatMoney(billsSoon.reduce((a, r) => a + r.amount, 0)), tone: billsSoon.some(r => daysUntil(r.dueDate) < 0) ? 'text-rose-600' : 'text-slate-500', go: () => setActiveTab('finance') },
                { label: 'Unread messages', value: unread.length, sub: unread.length ? 'Tap to open chat' : 'All read', tone: unread.length ? 'text-sky-600' : 'text-slate-500', go: () => openChatFor(properties.find(p => p.id === unread[0]?.propertyId) || dashProps[0] || properties[0]) }
              ];
              const card = 'bg-white rounded-2xl border border-slate-200 shadow-sm p-4';
              return (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900">Hello{currentUser?.name ? `, ${currentUser.name.split(' ')[0]}` : ''} 👋</h2>
                      <p className="text-xs text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · {dashProp === 'all' ? `All ${properties.length} properties` : dashProps[0]?.title}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[{ id: 'all', title: 'All properties' }, ...properties].map(p => (
                        <button key={p.id} onClick={() => setDashProp(p.id)} className={`px-3 py-1 rounded-full text-xs font-semibold transition ${dashProp === p.id ? 'bg-keda-600 text-white shadow' : 'bg-white text-slate-600 border border-slate-200 hover:border-keda-300'}`}>
                          {p.title.length > 24 ? p.title.slice(0, 22) + '…' : p.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {!profileComplete && (
                    <button onClick={() => openProfile()} className="w-full text-left bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-3 py-2 text-xs font-semibold hover:bg-amber-100 transition">
                      Complete your profile (full name, date of birth, ID declaration) to unlock bookings and new listings →
                    </button>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {stats.map(st => (
                      <button key={st.label} onClick={st.go} className="text-left bg-white p-3 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
                        <p className="text-[10px] text-slate-500 font-semibold uppercase">{st.label}</p>
                        <p className="text-xl font-extrabold text-slate-900">{st.value}</p>
                        {st.bar != null ? <div className="h-1.5 bg-slate-100 rounded-full mt-1"><div className="h-1.5 bg-keda-500 rounded-full" style={{ width: `${st.bar}%` }} /></div> : <p className={`text-[11px] font-semibold truncate ${st.tone}`}>{st.sub}</p>}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className={`lg:col-span-5 ${card} space-y-2`}>
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                        <div className="flex flex-wrap gap-1">
                          {['all', 'bookings', 'messages', 'bills', 'income', 'contracts'].map(t => {
                            const n = t === 'all' ? visibleNotifs.length : visibleNotifs.filter(x => x.type === t).length;
                            return <button key={t} onClick={() => setNotifFilter(t)} className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize transition ${notifFilter === t ? 'bg-keda-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{t}{n > 0 ? ` ${n}` : ''}</button>;
                          })}
                        </div>
                      </div>
                      {notifList.length === 0 && <p className="text-xs text-slate-500 py-6 text-center">You're all caught up ✨</p>}
                      <div className="space-y-1.5 pr-1" style={{ maxHeight: 'calc(100vh - 400px)', minHeight: 200, overflowY: 'auto' }}>
                        {notifList.map(n => {
                          const Icon = NOTIF_ICON[n.type];
                          return (
                            <div key={n.id} onClick={n.go} className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:border-keda-300 hover:bg-keda-50 transition cursor-pointer">
                              <span className={`p-1.5 rounded-lg ${n.signed ? 'bg-emerald-100 text-emerald-700' : NOTIF_TONE[n.type]}`}><Icon className="w-3.5 h-3.5" /></span>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate">{n.title}</p>
                                <p className={`text-[11px] truncate ${n.overdue ? 'text-rose-600 font-semibold' : 'text-slate-500'}`}>{n.sub}</p>
                              </div>
                              <button aria-label="Dismiss" onClick={(e) => { e.stopPropagation(); setDismissedNotifs(p => [...p, n.id]); }} className="text-slate-300 hover:text-slate-600"><X className="w-3.5 h-3.5" /></button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="lg:col-span-4 space-y-4">
                      <div className={`${card} space-y-1.5`}>
                        <h3 className="text-sm font-bold text-slate-900">Upcoming stays & incomes</h3>
                        {upcomingStays.length === 0 && <p className="text-xs text-slate-500">No upcoming stays.</p>}
                        {upcomingStays.map(b => (
                          <div key={b.id} className="flex justify-between gap-2 text-xs px-2 py-1.5 bg-slate-50 rounded-lg">
                            <div className="min-w-0"><p className="font-semibold truncate">{b.source === 'KEDA' ? b.guestName : b.source}</p><p className="text-[11px] text-slate-500">{b.checkIn} to {b.checkOut}</p></div>
                            <span className="font-bold text-emerald-700 whitespace-nowrap">{formatMoney(b.totalPrice)}</span>
                          </div>
                        ))}
                      </div>
                      <div className={`${card} space-y-1.5`}>
                        <div className="flex justify-between items-center"><h3 className="text-sm font-bold text-slate-900">Contracts</h3><button onClick={() => setActiveTab('contracts')} className="text-[11px] text-keda-700 font-semibold">View all →</button></div>
                        <div className="flex gap-2 text-xs"><span className="flex-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg py-1.5 text-center">{signed.length} signed</span><span className="flex-1 bg-amber-50 text-amber-700 font-bold rounded-lg py-1.5 text-center">{pend.length} missing</span></div>
                        {pend.slice(0, 3).map(b => <button key={b.id} onClick={() => openContract(b)} className="w-full text-left text-[11px] px-2 py-1.5 bg-slate-50 hover:bg-amber-50 rounded-lg transition truncate">{b.guestName} · {b.checkIn} · awaiting signature</button>)}
                        {signed.slice(-2).reverse().map(b => <button key={b.id} onClick={() => openContract(b)} className="w-full text-left text-[11px] px-2 py-1.5 bg-slate-50 hover:bg-emerald-50 rounded-lg transition truncate">✓ {b.guestName} signed {b.contractSignedAt}</button>)}
                      </div>
                    </div>

                    <div className="lg:col-span-3 space-y-4">
                      <div className={`${card} space-y-1.5`}>
                        <h3 className="text-sm font-bold text-slate-900">Service payments</h3>
                        {dashReminders.slice(0, 4).map(r => (
                          <div key={r.id} className="flex items-center justify-between gap-2 text-xs px-2 py-1.5 bg-slate-50 rounded-lg">
                            <div className="min-w-0"><p className="font-semibold truncate">{r.name}</p><p className={`text-[11px] ${daysUntil(r.dueDate) < 0 ? 'text-rose-600 font-semibold' : 'text-slate-500'}`}>{dueText(daysUntil(r.dueDate))} · {formatMoney(r.amount)}</p></div>
                            <button onClick={() => markReminderPaid(r)} className="bg-keda-600 hover:bg-keda-700 text-white px-2 py-1 rounded-lg font-semibold">Paid</button>
                          </div>
                        ))}
                        {dashReminders.length === 0 && <p className="text-xs text-slate-500">No reminders set.</p>}
                      </div>
                      <div className={`${card} space-y-1.5`}>
                        <h3 className="text-sm font-bold text-slate-900">Properties</h3>
                        {properties.map(p => (
                          <button key={p.id} onClick={() => setDashProp(dashProp === p.id ? 'all' : p.id)} className={`w-full text-left text-xs px-2 py-1.5 rounded-lg transition ${dashProp === p.id ? 'bg-keda-50 ring-1 ring-keda-300' : 'hover:bg-slate-50'}`}>
                            <div className="flex justify-between"><span className="font-semibold truncate">{p.title}</span><span>{ratingOf(p) != null ? `★ ${ratingOf(p).toFixed(1)} · ` : ''}{occ30(p)}%</span></div>
                            <div className="h-1.5 bg-slate-100 rounded-full mt-1"><div className="h-1.5 bg-keda-500 rounded-full" style={{ width: `${occ30(p)}%` }} /></div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Calendar Tab */}
            {activeTab === 'calendar' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <h2 className="text-base font-bold text-slate-900">Calendar</h2>
                  <select value={selectedCalendarProp?.id} onChange={(e) => { setSelectedCalendarPropId(e.target.value); setSelectedDates([]); }} className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700">
                    {properties.map(p => (<option key={p.id} value={p.id}>{p.title}</option>))}
                  </select>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button onClick={() => shiftCal(-1)} aria-label="Previous" className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200"><ChevronRight className="w-4 h-4 rotate-180" /></button>
                    <button onClick={() => setCalDate(new Date())} className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold">Today</button>
                    <button onClick={() => shiftCal(1)} aria-label="Next" className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200"><ChevronRight className="w-4 h-4" /></button>
                    <span className="font-bold text-sm ml-2 text-slate-800">{calTitle}</span>
                  </div>
                  <div className="flex bg-slate-100 rounded-xl p-1">
                    {['week', 'month', 'year'].map(v => (
                      <button key={v} onClick={() => setCalView(v)} className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${calView === v ? 'bg-white text-keda-700 shadow' : 'text-slate-500'}`}>{v}</button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-700">Selected: <span className="text-keda-700 font-bold">{selectedDates.length} day(s)</span></span>
                    <button onClick={() => setSelectedDates([])} className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-semibold">Clear selection</button>
                    <button onClick={selectAllCal} className="bg-keda-50 border border-keda-300 hover:bg-keda-100 text-keda-800 px-3 py-1 rounded-lg font-semibold">{calView === 'week' ? 'Select all week' : calView === 'month' ? 'Select all month' : 'Select all year'}</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={bulkBlockDates} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">Block Dates</button>
                    <button onClick={bulkUnblockDates} className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">Unblock Dates</button>
                    <div className="flex items-center space-x-1">
                      <input type="number" placeholder="Price ($)" value={bulkPriceInput} onChange={(e) => setBulkPriceInput(e.target.value)} className="w-20 px-2 py-1.5 border border-slate-300 rounded-lg text-xs" />
                      <button onClick={applyBulkPrice} className="bg-keda-600 hover:bg-keda-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">Set Price</button>
                    </div>
                    <div className="flex items-center space-x-1">
                      <input type="number" placeholder="Discount (%)" value={bulkDiscountInput} onChange={(e) => setBulkDiscountInput(e.target.value)} className="w-24 px-2 py-1.5 border border-slate-300 rounded-lg text-xs" />
                      <button onClick={applyBulkDiscount} className="bg-kamber hover:bg-kamber-d text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">Deal (%)</button>
                    </div>
                    <label className="flex items-center gap-1 text-xs font-semibold text-slate-700">Min price
                      <input type="number" min="0" value={selectedCalendarProp?.minPriceFloor ?? 0}
                        onChange={(e) => setProperties(prev => prev.map(p => p.id === selectedCalendarProp.id ? { ...p, minPriceFloor: Number(e.target.value) || 0 } : p))}
                        className="w-20 px-2 py-1.5 border border-slate-300 rounded-lg text-xs font-normal" />
                    </label>
                    <button onClick={resetSelectedPricing} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold">Reset prices</button>
                    <button onClick={applyAiSmartPriceToSelected} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> AI Smart Rate</button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-[11px] font-semibold">
                  <span className="flex items-center gap-1"><i className="w-3 h-3 rounded bg-emerald-200 border border-emerald-400" /> Available</span>
                  <span className="flex items-center gap-1"><i className="w-3 h-3 rounded bg-red-200 border border-red-400" /> Blocked / booked</span>
                  <span className="flex items-center gap-1"><i className="w-3 h-3 rounded bg-blue-200 border border-blue-400" /> Booked on another app</span>
                </div>

                {calView === 'year' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 12 }, (_, m) => (
                      <div key={m} className="border border-slate-200 rounded-xl p-2">
                        <button onClick={() => { setCalDate(new Date(calY, m, 1)); setCalView('month'); }} className="text-xs font-bold text-keda-700 hover:underline mb-1">{new Date(calY, m, 1).toLocaleDateString('en-US', { month: 'long' })}</button>
                        <div className="grid grid-cols-7 gap-0.5">
                          {monthCells(calY, m).map((ds, i) => ds ? (
                            <div key={ds} onClick={() => handleSelectDate(ds)} title={`${ds}: ${dayInfo(ds).status === 'external' ? dayInfo(ds).ext : dayInfo(ds).status}`}
                              className={`h-4 rounded-sm border text-[8px] text-center leading-4 cursor-pointer ${CAL_STATUS[dayInfo(ds).status]} ${selectedDates.includes(ds) ? 'ring-1 ring-keda-600 font-bold' : ''}`}>{Number(ds.slice(8))}</div>
                          ) : <div key={`e${i}`} />)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 overflow-x-auto">
                    {calView === 'month' && (
                      <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-500 py-1">
                        <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                      </div>
                    )}
                    <div className={`grid grid-cols-7 ${calView === 'week' ? 'gap-2 min-w-[640px]' : 'gap-1'}`}>
                      {calView === 'month'
                        ? monthCells(calY, calM).map((ds, i) => ds ? dayCell(ds, false) : <div key={`e${i}`} />)
                        : weekCells.map(ds => dayCell(ds, true))}
                    </div>
                  </div>
                )}
                <div className="border-t pt-4 space-y-3">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Calendar className="w-4 h-4 text-keda-600" /> Sync with Airbnb, Booking.com & other calendars</h3>
                    <button onClick={() => syncNow(selectedCalendarProp)} disabled={isSyncing} className="bg-keda-600 hover:bg-keda-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">{isSyncing ? 'Syncing...' : 'Sync now'}</button>
                  </div>
                  <p className="text-xs text-slate-500">Import their iCal links so reservations made there are blocked here, and share your export calendar so direct bookings are blocked there. Both directions prevent double bookings.</p>
                  {syncNotice && <div className="bg-keda-50 border border-keda-200 text-keda-800 text-xs rounded-xl px-3 py-2">{syncNotice}</div>}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold">Your export link</span>
                    <input readOnly value={selectedCalendarProp?.icalExportUrl} className="flex-1 min-w-[200px] border border-slate-300 rounded-lg px-2 py-1 bg-slate-50" />
                    <button onClick={() => copyText(selectedCalendarProp.icalExportUrl)} className="bg-slate-800 text-white px-3 py-1 rounded-lg">Copy</button>
                    <button onClick={() => downloadICS(selectedCalendarProp)} className="bg-white border border-slate-300 px-3 py-1 rounded-lg font-semibold">Download .ics</button>
                  </div>
                  {selectedCalendarProp?.icalImportUrls.map(i => (
                    <div key={i.id} className="flex items-center justify-between gap-2 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                      <span className="truncate"><b>{i.provider}</b> · {i.url}</span>
                      <button onClick={() => removeIcalImport(selectedCalendarProp.id, i.id)} className="text-red-600 flex items-center gap-1"><Trash className="w-3 h-3" /> Remove</button>
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <select value={newIcalProvider} onChange={(e) => setNewIcalProvider(e.target.value)} className="border border-slate-300 rounded-lg px-2 py-1.5"><option>Airbnb</option><option>Booking.com</option><option>Vrbo</option><option>Other</option></select>
                    <input value={newIcalUrl} onChange={(e) => setNewIcalUrl(e.target.value)} placeholder="Paste the calendar (.ics) link" className="flex-1 min-w-[220px] border border-slate-300 rounded-lg px-2 py-1.5" />
                    <button onClick={() => addIcalImport(selectedCalendarProp.id)} className="bg-keda-600 hover:bg-keda-700 text-white px-3 py-1.5 rounded-lg font-semibold">Add calendar</button>
                  </div>
                  <details className="text-xs">
                    <summary className="cursor-pointer font-semibold text-slate-700">Link blocked by the browser? Paste the .ics text instead</summary>
                    <textarea value={pasteIcs} onChange={(e) => setPasteIcs(e.target.value)} rows={4} placeholder="BEGIN:VCALENDAR ..." className="mt-2 w-full border border-slate-300 rounded-lg px-2 py-1.5 font-mono" />
                    <button onClick={() => importPastedIcs(selectedCalendarProp)} className="mt-1 bg-slate-800 text-white px-3 py-1.5 rounded-lg font-semibold">Import pasted calendar ({newIcalProvider})</button>
                  </details>
                  <p className="text-[11px] text-slate-500">Browsers usually block reading other sites' calendar links, so a live link may need a small server to refresh automatically. Imported dates show in blue with the app name.</p>
                </div>
              </div>
            )}

            {/* Finance Tab */}
            {activeTab === 'finance' && (
              <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="flex flex-wrap justify-between items-center gap-3">
                    <h2 className="text-base font-bold text-slate-900">Finance</h2>
                    <div className="flex flex-wrap items-center gap-2">
                      <select value={selectedFinancePropId} onChange={(e) => { setSelectedFinancePropId(e.target.value); setFinSelectedPeriod(null); }} className="border border-slate-300 rounded-lg px-2 py-1.5 text-xs">
                        <option value="all">All properties</option>
                        {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                      </select>
                      <div className="flex bg-slate-100 rounded-xl p-1">
                        {['weekly', 'monthly', 'yearly'].map(t => (
                          <button key={t} onClick={() => { setFinanceTimeframe(t); setFinSelectedPeriod(null); }} className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${financeTimeframe === t ? 'bg-white text-keda-700 shadow' : 'text-slate-500'}`}>{t}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl"><p className="text-emerald-700 font-semibold uppercase">Incomes</p><p className="text-xl font-extrabold text-emerald-900">{formatMoney(totalIncome)}</p><p className="text-emerald-700">{financeBookings.length} booking(s) · {totalNights} nights</p></div>
                    <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl"><p className="text-rose-700 font-semibold uppercase">Outcomes</p><p className="text-xl font-extrabold text-rose-900">{formatMoney(totalExpenses)}</p><p className="text-rose-700">{finExpenses.length} expense(s)</p></div>
                    <div className={`p-3 rounded-xl border ${netBalance >= 0 ? 'bg-keda-50 border-keda-200' : 'bg-amber-50 border-amber-200'}`}><p className="font-semibold uppercase text-slate-700">Balance</p><p className={`text-xl font-extrabold ${netBalance >= 0 ? 'text-keda-800' : 'text-amber-800'}`}>{formatMoney(netBalance)}</p><p className="text-slate-600">{netBalance >= 0 ? 'You are in profit' : 'Expenses exceed income'}</p></div>
                    <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl"><p className="text-sky-700 font-semibold uppercase">Margin</p><p className="text-xl font-extrabold text-sky-900">{margin}%</p><p className="text-sky-700">Fees saved {formatMoney(totalSaved)}</p></div>
                  </div>
                  <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3">
                    {financePropName}: {formatMoney(totalIncome)} in, {formatMoney(totalExpenses)} out, so {netBalance >= 0 ? 'you keep' : 'you are short by'} {formatMoney(Math.abs(netBalance))}.
                    {bestPeriod ? ` Best ${financeTimeframe.replace('ly', '')} period: ${bestPeriod[0]} (${formatMoney(bestPeriod[1].income)}).` : ''} SUNAT tax for {taxMonth}: S/ {taxData.sunatTaxPen.toFixed(2)} (due {sunatDueDate}).
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-sm space-y-3">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">SUNAT monthly tax: 5% of gross income</h3>
                    <label className="text-xs font-semibold">Period <input type="month" value={taxMonth} onChange={(e) => e.target.value && setTaxMonth(e.target.value)} className="ml-1 border border-slate-300 rounded-lg px-2 py-1 font-normal" /></label>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl"><p className="text-slate-500 font-semibold uppercase">Gross income</p><p className="text-lg font-extrabold">{formatMoney(taxData.grossIncomeUsd)}</p><p className="text-slate-500">S/ {taxData.grossIncomePen.toFixed(2)} · {taxBookings.length} booking(s)</p></div>
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl"><p className="text-amber-700 font-semibold uppercase">Tax to pay (5%)</p><p className="text-lg font-extrabold text-amber-900">S/ {taxData.sunatTaxPen.toFixed(2)}</p><p className="text-amber-700">{formatMoney(taxData.sunatTaxUsd)}</p></div>
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl"><p className="text-slate-500 font-semibold uppercase">Your RUC</p><p className="text-lg font-extrabold">{hostRuc || 'Not set'}</p><p className="text-slate-500">Last digit: {rucLast ?? '-'}</p></div>
                    <div className="bg-keda-50 border border-keda-200 p-3 rounded-xl"><p className="text-keda-700 font-semibold uppercase">Pay day</p><p className="text-lg font-extrabold text-keda-900">{taxDueDate ? fmtDate(taxDueDate) : 'n/a'}</p><p className={taxDueDate && daysUntil(taxDueDate) < 0 ? 'text-rose-600 font-semibold' : 'text-keda-700'}>{taxDueDate ? dueText(daysUntil(taxDueDate)) : 'Period not in the 2026 table'}</p></div>
                  </div>
                  {SUNAT_2026[taxMonth] && (
                    <div className="overflow-x-auto"><div className="grid grid-cols-6 gap-1 text-center text-[11px] min-w-[420px]">
                      {SUNAT_GROUPS.map((g, i) => (
                        <div key={g} className={`rounded-lg border p-1.5 ${rucLast != null && sunatCol(rucLast) === i ? 'bg-keda-600 text-white border-keda-600 font-bold' : 'bg-slate-50 border-slate-200'}`}>
                          <p className="opacity-70">RUC ends {g}</p><p>{pad2(SUNAT_2026[taxMonth][1][i])}/{SUNAT_2026[taxMonth][0].slice(5)}</p>
                        </div>
                      ))}
                    </div></div>
                  )}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <label className="font-semibold">RUC or DNI <input value={rucOverride} maxLength={11} onChange={(e) => setRucOverride(e.target.value.replace(/\D/g, ''))} placeholder="11-digit RUC or 8-digit DNI" className="ml-1 w-32 border border-slate-300 rounded-lg px-2 py-1 font-normal" /></label>
                    <a href="https://www.sunat.gob.pe/orientacion/cronogramas/2026/cObligacionMensual2026.html" target="_blank" rel="noreferrer" className="text-keda-700 font-semibold underline">Official SUNAT table</a>
                  </div>
                  <p className="text-[11px] text-slate-500">SUNAT's schedule uses the last digit of the <b>RUC</b>, not of the DNI. For an individual the RUC is 10 + DNI + a check digit, which is calculated for you. The table above is SUNAT's 2026 calendar for monthly obligations (the tax is paid the month after the period). Exchange rate fixed at S/ 3.75 per US$. Confirm the rate and your tax category with an accountant.</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">Incomes vs outcomes</h3>
                    <div className="flex gap-3 text-[11px] font-semibold"><span className="flex items-center gap-1"><i className="w-3 h-3 rounded bg-emerald-500" /> Income</span><span className="flex items-center gap-1"><i className="w-3 h-3 rounded bg-rose-400" /> Expenses</span></div>
                  </div>
                  {allKeys.length === 0 && <p className="text-xs text-slate-500">No data yet.</p>}
                  <div className="flex items-end gap-2 overflow-x-auto pb-1">
                    {allKeys.map(k => {
                      const inc = byPeriod[k]?.income || 0, exp = expByPeriod[k] || 0;
                      return (
                        <button key={k} onClick={() => setFinSelectedPeriod(finSelectedPeriod === k ? null : k)} title={`${k}: income ${formatMoney(inc)}, expenses ${formatMoney(exp)}`}
                          className={`flex flex-col items-center gap-1 min-w-[70px] p-1.5 rounded-xl transition ${finSelectedPeriod === k ? 'bg-keda-50 ring-1 ring-keda-300' : 'hover:bg-slate-50'}`}>
                          <div className="flex items-end gap-1 h-32"><div className="w-5 bg-emerald-500 rounded-t" style={{ height: `${inc / chartMax * 100}%` }} /><div className="w-5 bg-rose-400 rounded-t" style={{ height: `${exp / chartMax * 100}%` }} /></div>
                          <span className="text-[10px] text-slate-600">{shortKey(k)}</span>
                          <span className={`text-[10px] font-bold ${inc - exp >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>{formatMoney(inc - exp)}</span>
                        </button>
                      );
                    })}
                  </div>
                  {finSelectedPeriod && (
                    <div className="border-t pt-3 space-y-1 text-xs">
                      <p className="font-bold text-slate-800">{finSelectedPeriod}</p>
                      {financeBookings.filter(b => periodKey(b.checkIn) === finSelectedPeriod).map(b => <div key={b.id} className="flex justify-between bg-emerald-50 rounded-lg px-2 py-1"><span>{b.checkIn} · {b.guestName} · {b.source}</span><b className="text-emerald-700">+{formatMoney(b.totalPrice)}</b></div>)}
                      {finExpenses.filter(x => periodKey(x.date) === finSelectedPeriod).map(x => <div key={x.id} className="flex justify-between bg-rose-50 rounded-lg px-2 py-1"><span>{x.date} · {x.category}</span><b className="text-rose-700">-{formatMoney(x.amount)}</b></div>)}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
                    <h3 className="text-sm font-bold text-slate-900">Balance per property <span className="font-normal text-slate-400">(tap to filter)</span></h3>
                    {propStats.map(({ p, inc, exp, net }) => (
                      <button key={p.id} onClick={() => { setSelectedFinancePropId(selectedFinancePropId === p.id ? 'all' : p.id); setFinSelectedPeriod(null); }}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition ${selectedFinancePropId === p.id ? 'border-keda-400 bg-keda-50' : 'border-slate-200 hover:border-keda-300'}`}>
                        <p className="font-bold truncate">{p.title}</p>
                        <div className="flex justify-between mt-1"><span className="text-emerald-700">In {formatMoney(inc)}</span><span className="text-rose-600">Out {formatMoney(exp)}</span><span className={`font-bold ${net >= 0 ? 'text-keda-700' : 'text-amber-700'}`}>Net {formatMoney(net)}</span></div>
                        <div className="h-1.5 bg-rose-200 rounded-full mt-2"><div className="h-1.5 bg-emerald-500 rounded-full" style={{ width: `${inc + exp ? inc / (inc + exp) * 100 : 0}%` }} /></div>
                      </button>
                    ))}
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
                    <h3 className="text-sm font-bold text-slate-900">Where your money goes</h3>
                    {catRows.length === 0 && <p className="text-xs text-slate-500">No expenses yet.</p>}
                    {catRows.map(([c, v]) => (
                      <div key={c} className="text-xs"><div className="flex justify-between"><span className="truncate">{c}</span><b>{formatMoney(v)} · {totalExpenses ? Math.round(v / totalExpenses * 100) : 0}%</b></div>
                        <div className="h-1.5 bg-slate-100 rounded-full mt-1"><div className="h-1.5 bg-rose-400 rounded-full" style={{ width: `${totalExpenses ? v / totalExpenses * 100 : 0}%` }} /></div></div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                  <h3 className="text-sm font-bold text-slate-900">Add an expense</h3>
                  <form onSubmit={addExpense} className="flex flex-wrap gap-2">
                    <select value={newExpense.propertyId} onChange={(e) => setNewExpense({ ...newExpense, propertyId: e.target.value })} className="px-2 py-1.5 border border-slate-300 rounded-lg text-xs">
                      {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                    <input value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })} className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs flex-1" />
                    <input type="number" step="0.01" placeholder="Amount ($)" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} className="w-24 px-3 py-1.5 border border-slate-300 rounded-lg text-xs" />
                    <input type="date" value={newExpense.date} onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs" />
                    <button type="submit" className="bg-keda-600 hover:bg-keda-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">Add Expense</button>
                  </form>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {[...finExpenses].sort((a, b) => b.date.localeCompare(a.date)).map(x => (
                      <div key={x.id} className="flex justify-between items-center text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg">
                        <span>{x.date} · {x.category}</span>
                        <span className="flex items-center gap-2"><b>{formatMoney(x.amount)}</b><button onClick={() => setExpenses(prev => prev.filter(e => e.id !== x.id))} className="text-red-500"><Trash className="w-3.5 h-3.5" /></button></span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                  <h3 className="text-sm font-bold text-slate-900">Service payment reminders</h3>
                  <form onSubmit={addServiceReminder} className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs">
                    <input placeholder="Service name (e.g. Luz del Sur)" value={newReminder.name} onChange={(e) => setNewReminder({ ...newReminder, name: e.target.value })} className="col-span-2 px-3 py-1.5 border border-slate-300 rounded-lg" />
                    <input type="number" step="0.01" placeholder="Amount ($)" value={newReminder.amount} onChange={(e) => setNewReminder({ ...newReminder, amount: e.target.value })} className="px-3 py-1.5 border border-slate-300 rounded-lg" />
                    <input type="date" title="Next due date" value={newReminder.dueDate} onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })} className="px-3 py-1.5 border border-slate-300 rounded-lg" />
                    <select value={newReminder.propertyId} onChange={(e) => setNewReminder({ ...newReminder, propertyId: e.target.value })} className="px-2 py-1.5 border border-slate-300 rounded-lg">
                      {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                    <select value={newReminder.frequency} onChange={(e) => setNewReminder({ ...newReminder, frequency: e.target.value })} className="px-2 py-1.5 border border-slate-300 rounded-lg">
                      <option value="monthly">Monthly</option><option value="weekly">Weekly</option><option value="custom">Custom period</option>
                    </select>
                    {newReminder.frequency === 'custom' && <input type="number" min="1" placeholder="Every N days" value={newReminder.everyDays} onChange={(e) => setNewReminder({ ...newReminder, everyDays: e.target.value })} className="px-3 py-1.5 border border-slate-300 rounded-lg" />}
                    <button type="submit" className="bg-keda-600 hover:bg-keda-700 text-white px-3 py-1.5 rounded-lg font-semibold">Add Reminder</button>
                  </form>
                  {reminderError && <p className="text-xs text-rose-600 font-semibold">{reminderError}</p>}
                  <div className="space-y-2">
                    {[...serviceReminders].sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map(rem => {
                      const d = daysUntil(rem.dueDate);
                      return (
                        <div key={rem.id} className={`flex flex-wrap justify-between items-center gap-2 p-3 border rounded-xl text-xs transition ${lastAddedReminder === rem.id ? 'bg-keda-50 border-keda-400 ring-2 ring-keda-300' : 'bg-slate-50 border-slate-200'}`}>
                          <div>
                            <span className="font-bold text-slate-800">{rem.name}</span>
                            {lastAddedReminder === rem.id && <span className="ml-2 text-keda-700 font-bold">Added ✓</span>}
                            <p className="text-slate-500">{properties.find(p => p.id === rem.propertyId)?.title || 'All properties'} · {freqLabel(rem)} · next {rem.dueDate} · <span className={d < 0 ? 'text-rose-600 font-semibold' : ''}>{dueText(d)}</span></p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{formatMoney(rem.amount)}</span>
                            <button onClick={() => markReminderPaid(rem)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg font-semibold">Mark paid</button>
                            <button onClick={() => removeServiceReminder(rem.id)} className="text-red-600 hover:text-red-800" aria-label="Delete"><Trash className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      );
                    })}
                    {serviceReminders.length === 0 && <p className="text-xs text-slate-500">No reminders yet. Add your first one above.</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Contracts Tab */}
            {activeTab === 'contracts' && (() => {
              const all = bookings.filter(b => b.source === 'KEDA' && b.status !== 'Cancelled' && (contractProp === 'all' || b.propertyId === contractProp));
              const isUp = (b) => b.checkOut >= todayStr;
              const list = all.filter(b => contractFilter === 'all' || (contractFilter === 'upcoming' && isUp(b)) || (contractFilter === 'past' && !isUp(b)) || (contractFilter === 'signed' && b.contractSigned) || (contractFilter === 'pending' && !b.contractSigned))
                .sort((a, b) => (isUp(a) === isUp(b)) ? (isUp(a) ? a.checkIn.localeCompare(b.checkIn) : b.checkIn.localeCompare(a.checkIn)) : (isUp(a) ? -1 : 1));
              const downloadAll = () => list.forEach(downloadContract);
              return (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <div className="flex flex-wrap justify-between items-center gap-3">
                      <div><h2 className="text-base font-bold text-slate-900">Contracts</h2><p className="text-xs text-slate-500">Generated automatically for every direct booking, with the guest's name, ID, dates and total price.</p></div>
                      <select value={contractProp} onChange={(e) => setContractProp(e.target.value)} className="border border-slate-300 rounded-lg px-2 py-1.5 text-xs">
                        <option value="all">All properties</option>{properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs text-center">
                      <div className="bg-keda-50 border border-keda-200 rounded-xl p-3"><p className="text-xl font-extrabold text-keda-800">{all.filter(isUp).length}</p><p className="text-keda-700 font-semibold">Upcoming</p></div>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3"><p className="text-xl font-extrabold text-emerald-800">{all.filter(b => b.contractSigned).length}</p><p className="text-emerald-700 font-semibold">Signed</p></div>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3"><p className="text-xl font-extrabold text-amber-800">{all.filter(b => !b.contractSigned).length}</p><p className="text-amber-700 font-semibold">Missing signature</p></div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1">
                        {['all', 'upcoming', 'past', 'signed', 'pending'].map(f => <button key={f} onClick={() => setContractFilter(f)} className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition ${contractFilter === f ? 'bg-keda-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{f}</button>)}
                      </div>
                      <button onClick={downloadAll} disabled={list.length === 0} className="text-xs font-semibold text-keda-700 flex items-center gap-1 disabled:opacity-40"><Download className="w-3.5 h-3.5" /> Download shown ({list.length})</button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {list.length === 0 && <p className="text-xs text-slate-500 text-center py-8">No contracts match this filter.</p>}
                    {list.map(b => (
                      <div key={b.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition">
                        <div className="flex flex-wrap justify-between items-start gap-3">
                          <div className="space-y-1 text-xs">
                            <p className="text-sm font-bold text-slate-900">{b.guestName}</p>
                            <p className="text-slate-600">{DOC_LABEL[b.guestDocType] || 'ID'} No. {b.guestDniPassport}</p>
                            <p className="text-slate-600">{b.propertyTitle}</p>
                            <p className="text-slate-600">{fmtDate(b.checkIn)} to {fmtDate(b.checkOut)} · {b.nights} night(s)</p>
                            <p className="font-bold text-slate-900">Total for the full booking: {formatMoney(b.totalPrice)} <span className="font-normal text-slate-500">· {b.paymentMethod}</span></p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${isUp(b) ? 'bg-keda-100 text-keda-700' : 'bg-slate-100 text-slate-600'}`}>{isUp(b) ? 'Upcoming' : 'Past stay'}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${b.contractSigned ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{b.contractSigned ? `Signed ${b.contractSignedAt}` : 'Awaiting guest signature'}</span>
                            <div className="flex gap-2">
                              <button onClick={() => openContract(b)} className="bg-keda-600 hover:bg-keda-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">View contract</button>
                              <button onClick={() => downloadContract(b)} className="bg-white border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold">Download</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Listings Tab */}
            {activeTab === 'listings' && (
              <div className="space-y-6">
                {syncNotice && <div className="bg-keda-50 border border-keda-200 text-keda-800 text-xs rounded-xl px-3 py-2">{syncNotice}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {properties.map(prop => (
                    <div key={prop.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
                      <img src={prop.images[0].src} style={{ filter: prop.images[0].filter }} alt={prop.title} className="w-full h-40 object-cover rounded-xl" />
                      {prop.images.length > 1 && <div className="flex gap-1">{prop.images.slice(1, 5).map(i => <img key={i.id} src={i.src} style={{ filter: i.filter }} alt="" className="w-12 h-12 object-cover rounded-lg" />)}</div>}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{prop.title}</h3>
                          <p className="text-xs text-slate-500">{prop.address ? `${prop.address}, ` : ''}{prop.district}, {prop.city}</p>
                        </div>
                        <span className="text-sm font-bold text-slate-900">{formatMoney(prop.pricePerNight)}/night</span>
                      </div>
                      
                      <p className="text-xs text-slate-600">{prop.description}</p>
                      <PropertyFacts prop={prop} />
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 space-y-1.5 text-[11px]">
                        <p className="font-bold text-slate-700">iCal Sync</p>
                        <div className="flex items-center gap-1">
                          <input readOnly value={prop.icalExportUrl} className="flex-1 border border-slate-300 rounded px-2 py-1 bg-white truncate" />
                          <button onClick={() => copyText(prop.icalExportUrl)} className="bg-slate-800 text-white px-2 py-1 rounded">Copy</button>
                        </div>
                        {prop.icalImportUrls.map(i => (
                          <div key={i.id} className="flex items-center justify-between gap-2">
                            <span className="truncate"><b>{i.provider}</b> {i.url}</span>
                            <button onClick={() => removeIcalImport(prop.id, i.id)} className="text-red-600"><Trash className="w-3 h-3" /></button>
                          </div>
                        ))}
                        <div className="flex gap-1">
                          <select value={newIcalProvider} onChange={(e) => setNewIcalProvider(e.target.value)} className="border border-slate-300 rounded px-1 py-1">
                            <option>Airbnb</option><option>Booking.com</option><option>Other</option>
                          </select>
                          <input value={newIcalUrl} onChange={(e) => setNewIcalUrl(e.target.value)} placeholder="Import .ics URL" className="flex-1 border border-slate-300 rounded px-2 py-1" />
                          <button onClick={() => addIcalImport(prop.id)} className="bg-keda-600 text-white px-2 py-1 rounded">Add</button>
                        </div>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <button onClick={() => syncNow(prop)} disabled={isSyncing} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50">
                          {isSyncing ? 'Syncing...' : 'Sync now'}
                        </button>
                        <button onClick={() => openEdit(prop)} className="flex-1 bg-purple-50 text-kamber hover:bg-purple-100 border border-purple-200 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> Edit listing, photos & AI tips
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Messenger Launcher Button */}
      <div className="fixed bottom-5 right-5 z-50">
        <button
          aria-label="Messages"
          onClick={() => { if (isChatOpen && !isChatMinimized) setIsChatOpen(false); else { setIsChatOpen(true); setIsChatMinimized(false); } }}
          className="relative bg-keda-600 hover:bg-keda-700 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transition"
        >
          <MessageSquare className="w-6 h-6" />
          {activeRoleMode === 'host' && unreadGuestMsgs.length > 0 && <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{unreadGuestMsgs.length}</span>}
        </button>
      </div>

      {/* Floating Chat Window Modal */}
      {isChatOpen && (
        <div className={`fixed bottom-20 right-5 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col transition-all ${isChatMinimized ? 'h-14 overflow-hidden' : 'h-96'}`}>
          <div className="bg-keda-900 text-white px-4 py-3 rounded-t-2xl flex justify-between items-center cursor-pointer">
            <span className="text-xs font-bold flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-keda-400" /> KEDA Chat ({activeChatProperty?.title || 'Property Inquiry'})
            </span>
            <div className="flex items-center space-x-2">
              <button onClick={() => setIsChatMinimized(!isChatMinimized)} className="text-slate-400 hover:text-white">
                <Minus className="w-4 h-4" />
              </button>
              <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isChatMinimized && (
            <div className="flex-1 flex flex-col p-3 overflow-hidden">
              <select value={activeChatProperty?.id} onChange={(e) => setActiveChatProperty(properties.find(p => p.id === e.target.value))} className="mb-2 border border-slate-300 rounded-lg px-2 py-1 text-[11px]">
                {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {messages.filter(m => m.propertyId === activeChatProperty?.id).map(msg => (
                  <div key={msg.id} className={`p-2 rounded-xl text-xs max-w-[85%] ${msg.senderRole === activeRoleMode ? 'bg-keda-600 text-white ml-auto' : 'bg-slate-100 text-slate-800'}`}>
                    <p className="font-semibold text-[10px] opacity-80">{msg.sender}</p>
                    <p className="mt-0.5">{msg.text}</p>
                    <p className="text-[9px] opacity-60 text-right mt-1">{msg.timestamp}</p>
                  </div>
                ))}
              </div>

              {activeRoleMode === 'host' && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {['Hello! Yes, those dates are available.', 'Check-in is from 15:00 and check-out by 11:00.', 'Thank you for your interest! Happy to help.'].map(t => <button key={t} type="button" onClick={() => setChatInputText(t)} className="text-[10px] bg-slate-100 hover:bg-keda-50 text-slate-600 px-2 py-1 rounded-full">{t.length > 28 ? t.slice(0, 26) + '…' : t}</button>)}
                </div>
              )}
              <form onSubmit={handleSendMessage} className="mt-2 flex space-x-2">
                <input
                  type="text"
                  placeholder="Type message..."
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  className="flex-1 border border-slate-300 rounded-xl px-3 py-1.5 text-xs"
                />
                <button type="submit" className="bg-keda-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold">
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Listing Details Modal */}
      {detailProp && (() => {
        const p = detailProp, q = quoteFor(p), pol = CANCEL_POLICIES[p.cancellation || 'moderate'], rt = ratingOf(p);
        const photo = p.images[Math.min(detailPhoto, p.images.length - 1)];
        const monthOf = (off) => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth() + off, 1); };
        return (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4" onClick={() => setDetailPropId(null)}>
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl max-w-3xl w-full text-xs" style={{ maxHeight: '94vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div className="flex justify-between items-center p-4 border-b" style={{ flexShrink: 0 }}>
                <h3 className="font-bold text-sm truncate">{p.title}</h3>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleWish(p.id)} className="flex items-center gap-1 font-semibold text-slate-600"><Heart className={`w-4 h-4 ${wishlist.includes(p.id) ? 'text-rose-500 fill-current' : ''}`} /> {wishlist.includes(p.id) ? 'Saved' : 'Save'}</button>
                  <button onClick={() => setDetailPropId(null)} aria-label="Close"><X className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="p-4 space-y-4" style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto' }}>
                <img src={photo.src} alt={p.title} className="w-full object-cover rounded-xl" style={{ height: 260, filter: photo.filter }} />
                {p.images.length > 1 && <div className="flex gap-2 overflow-x-auto">{p.images.map((im, i) => <img key={im.id} src={im.src} onClick={() => setDetailPhoto(i)} alt="" className={`w-20 h-14 object-cover rounded-lg cursor-pointer ${i === detailPhoto ? 'ring-2 ring-keda-500' : 'opacity-70'}`} />)}</div>}
                <div className="flex flex-wrap items-center gap-2">
                  {rt != null && <span className="flex items-center gap-1 font-bold"><Star className="w-4 h-4 text-kamber" /> {rt.toFixed(1)} · {p.reviews.length} review(s)</span>}
                  {isFavorite(p) && <span className="bg-amber-50 text-kamber border border-amber-200 font-bold px-2 py-0.5 rounded-full">KEDA Favorite</span>}
                  <span className="text-slate-500">{addressUnlocked(p) && p.address ? `📍 ${p.address}, ` : ''}{p.district}{addressUnlocked(p) ? '' : ' district zone'}, {p.city}</span>
                </div>
                <PropertyFacts prop={p} />
                <p className="text-slate-700 leading-relaxed">{p.description}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1"><p className="font-bold text-sm">House rules</p>
                    {['Check-in from 15:00, check-out by 11:00', `Up to ${p.maxGuests} registered guests`, 'No parties or events', 'No smoking indoors', 'Quiet hours 22:00 to 07:00', 'No pets unless approved by the host'].map(r => <p key={r} className="text-slate-600">• {r}</p>)}
                    {p.minNights > 1 && <p className="text-slate-600">• Minimum stay {p.minNights} nights</p>}</div>
                  <div className="space-y-1"><p className="font-bold text-sm">Cancellation: {pol.label}</p><p className="text-slate-600">{pol.short}.</p>
                    <p className="font-bold text-sm pt-2">Your host</p><p className="text-slate-600">{INITIAL_USER.name}. Identity declared under oath, and a digital contract for every booking.</p>
                    {(p.weeklyDiscount > 0 || p.earlyBirdDiscount > 0) && <p className="text-keda-700 font-semibold pt-1">Offers: {p.weeklyDiscount > 0 ? `${p.weeklyDiscount}% off 7+ nights` : ''}{p.weeklyDiscount > 0 && p.earlyBirdDiscount > 0 ? ' · ' : ''}{p.earlyBirdDiscount > 0 ? `${p.earlyBirdDiscount}% off booking 30+ days ahead` : ''}</p>}</div>
                </div>
                <div className="space-y-2"><p className="font-bold text-sm">Availability</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[0, 1].map(off => { const m = monthOf(off); return (
                      <div key={off}><p className="font-semibold mb-1">{m.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                        <div className="grid grid-cols-7 gap-0.5 text-center">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i} className="text-[9px] text-slate-400">{d}</span>)}
                          {monthCells(m.getFullYear(), m.getMonth()).map((ds, i) => ds ? <span key={ds} className={`h-5 leading-5 rounded text-[10px] ${isBusyOn(p, ds) ? 'bg-red-100 text-red-700' : 'bg-emerald-50 text-emerald-800'}`}>{Number(ds.slice(8))}</span> : <span key={`e${i}`} />)}</div></div>); })}
                  </div></div>
                <div className="space-y-2"><p className="font-bold text-sm">Reviews {(p.reviews || []).some(r => r.demo) && <span className="font-normal text-[10px] text-slate-400">(sample reviews for the demo)</span>}</p>
                  {(p.reviews || []).length === 0 && <p className="text-slate-500">No reviews yet. Only guests with a confirmed stay can review.</p>}
                  {[...(p.reviews || [])].reverse().map(r => (
                    <div key={r.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3"><div className="flex justify-between"><span className="font-semibold">{r.author} <span className="text-kamber">{'★'.repeat(r.rating)}</span></span><span className="text-slate-400">{r.date}</span></div><p className="text-slate-600 mt-1">{r.text}</p>{r.verified && <p className="text-[10px] text-keda-700 font-semibold mt-1">Verified stay</p>}</div>))}
                </div>
              </div>
              <div className="p-4 border-t flex flex-wrap items-center gap-2" style={{ flexShrink: 0 }}>
                <input type="date" value={bookingDates.checkIn} onChange={(e) => setBookingDates({ ...bookingDates, checkIn: e.target.value })} className="border border-slate-300 rounded-lg px-2 py-1.5" />
                <input type="date" value={bookingDates.checkOut} onChange={(e) => setBookingDates({ ...bookingDates, checkOut: e.target.value })} className="border border-slate-300 rounded-lg px-2 py-1.5" />
                <span className="flex-1 font-bold">{q.nights < 1 ? 'Pick your dates' : q.conflict ? 'Not available for these dates' : q.tooShort ? `Minimum ${p.minNights} nights` : `${formatMoney(q.total)} total · no service fees`}</span>
                <button onClick={() => { setActiveChatProperty(p); setIsChatOpen(true); setIsChatMinimized(false); }} className="border border-keda-300 text-keda-700 px-3 py-2 rounded-xl font-semibold">Ask host</button>
                <button disabled={q.nights < 1 || q.conflict || q.tooShort || guestCount > p.maxGuests} onClick={() => requireProfile(() => { setDetailPropId(null); setSelectedProperty(p); setGuestDocumentInput(currentUser?.idDocumentNumber || ''); setGuestDocType(currentUser?.idDocumentType || 'DNI'); setIsBookingModalOpen(true); })} className="bg-keda-600 hover:bg-keda-700 disabled:opacity-40 text-white px-5 py-2 rounded-xl font-bold">Reserve</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Review Modal */}
      {reviewTarget && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4" onClick={() => setReviewTarget(null)}>
          <form onSubmit={submitReview} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-3 text-xs">
            <p className="font-bold text-sm">How was your stay at {reviewTarget.propertyTitle}?</p>
            <div className="flex gap-1">{[1, 2, 3, 4, 5].map(n => <button type="button" key={n} onClick={() => setReviewForm({ ...reviewForm, rating: n })} className={`text-2xl ${n <= reviewForm.rating ? 'text-kamber' : 'text-slate-300'}`} aria-label={`${n} stars`}>★</button>)}</div>
            <textarea rows={4} value={reviewForm.text} onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })} placeholder="Tell future guests about your stay (10+ characters)" className="w-full border border-slate-300 rounded-lg px-2 py-1.5" />
            <div className="flex gap-2"><button type="button" onClick={() => setReviewTarget(null)} className="flex-1 border border-slate-300 py-2 rounded-xl font-bold">Cancel</button><button type="submit" disabled={reviewForm.text.trim().length < 10} className="flex-1 bg-keda-600 disabled:opacity-40 text-white py-2 rounded-xl font-bold">Publish review</button></div>
          </form>
        </div>
      )}

      {/* Sign up / Log in Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4" onClick={() => setIsAuthModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl max-w-sm w-full text-xs" style={{ maxHeight: '92vh', overflowY: 'auto' }}>
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <KedaLogo size={34} />
                  <div>
                    <p className="font-extrabold text-sm text-slate-900">{authSocial ? `Continue with ${authSocial === 'google' ? 'Google' : 'Facebook'}` : authMode === 'signup' ? 'Create your KEDA account' : 'Welcome back'}</p>
                    <p className="text-slate-500">Alquila directo. Paga lo justo.</p>
                  </div>
                </div>
                <button onClick={() => setIsAuthModalOpen(false)} aria-label="Close"><X className="w-4 h-4" /></button>
              </div>
              {authNotice && <p className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-2 font-semibold">{authNotice}</p>}

              {authSocial ? (
                <form onSubmit={submitSocial} className="space-y-2">
                  <p className="text-slate-600">Demo: in the live version you pick your {authSocial === 'google' ? 'Google' : 'Facebook'} account here. For now, type the email and name of that account.</p>
                  <input type="email" autoComplete="email" placeholder="Email" value={socialForm.email} onChange={(e) => setSocialForm({ ...socialForm, email: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                  <input placeholder="Full name (only needed the first time)" value={socialForm.name} onChange={(e) => setSocialForm({ ...socialForm, name: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                  <button type="submit" className="w-full text-white py-2 rounded-xl font-bold" style={{ background: authSocial === 'facebook' ? '#1877F2' : '#0F172A' }}>Continue</button>
                  <button type="button" onClick={() => { setAuthSocial(null); setAuthError(''); }} className="w-full border border-slate-300 py-2 rounded-xl font-semibold">Back</button>
                </form>
              ) : (
                <>
                  <div className="space-y-2">
                    <button onClick={() => { setAuthSocial('google'); setAuthError(''); setSocialForm({ name: '', email: '' }); }} className="w-full flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 py-2 rounded-xl font-semibold transition">
                      <span className="font-extrabold"><span style={{ color: '#4285F4' }}>G</span><span style={{ color: '#EA4335' }}>o</span><span style={{ color: '#FBBC05' }}>o</span><span style={{ color: '#34A853' }}>g</span></span> Continue with Google
                    </button>
                    <button onClick={() => { setAuthSocial('facebook'); setAuthError(''); setSocialForm({ name: '', email: '' }); }} className="w-full flex items-center justify-center gap-2 text-white py-2 rounded-xl font-semibold transition" style={{ background: '#1877F2' }}>
                      <span className="font-extrabold text-sm">f</span> Continue with Facebook
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400"><span className="flex-1 h-px bg-slate-200" /> or with your email <span className="flex-1 h-px bg-slate-200" /></div>
                  <form onSubmit={submitAuth} className="space-y-2">
                    {authMode === 'signup' && <input autoComplete="name" placeholder="Full name" value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2" />}
                    <input type="email" autoComplete="email" placeholder="Email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                    <input type="password" autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'} placeholder={authMode === 'signup' ? 'Password (8+ characters)' : 'Password'} value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                    {authMode === 'signup' && <input type="password" autoComplete="new-password" placeholder="Repeat password" value={authForm.confirm} onChange={(e) => setAuthForm({ ...authForm, confirm: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2" />}
                    <button type="submit" className="w-full bg-keda-600 hover:bg-keda-700 text-white py-2 rounded-xl font-bold transition">{authMode === 'signup' ? 'Create account' : 'Log in'}</button>
                  </form>
                  <p className="text-center text-slate-600">
                    {authMode === 'signup' ? 'Already have an account? ' : 'New to KEDA? '}
                    <button onClick={() => { setAuthMode(authMode === 'signup' ? 'login' : 'signup'); setAuthError(''); }} className="text-keda-700 font-bold underline">{authMode === 'signup' ? 'Log in' : 'Create an account'}</button>
                  </p>
                  {authMode === 'signup' && <p className="text-[11px] text-slate-500">To keep hosts and guests safe, everyone is identified (ID photo and sworn declaration) before booking or hosting.</p>}
                  <button onClick={demoLogin} className="w-full border border-dashed border-slate-300 text-slate-600 hover:bg-slate-50 py-1.5 rounded-xl font-semibold">Try the demo account (sample host data)</button>
                </>
              )}
              {authError && <p className="text-rose-600 font-semibold">{authError}</p>}
              <p className="text-[10px] text-slate-400">Demo mode: Google, Facebook and email accounts are simulated and only live in this browser tab. Real sign-in needs a server.</p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4" onClick={() => setIsProfileModalOpen(false)}>
          <form onSubmit={saveProfile} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl max-w-md w-full text-xs" style={{ maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="flex justify-between items-center p-4 border-b shrink-0" style={{ flexShrink: 0 }}>
              <h3 className="font-bold text-sm">{profileComplete ? 'My profile' : 'Complete your profile'}</h3>
              <button type="button" onClick={() => setIsProfileModalOpen(false)} aria-label="Close"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 space-y-3" style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto' }}>
              {profileNotice && <p className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-2 font-semibold">{profileNotice}</p>}
              <div className="flex items-center gap-3">
                {profileForm.avatar ? <img src={profileForm.avatar} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-keda-400" /> : <div className="w-16 h-16 rounded-full bg-keda-100 text-keda-700 flex items-center justify-center text-xl font-bold">{(profileForm.name || '?').charAt(0)}</div>}
                <label className="bg-keda-600 hover:bg-keda-700 text-white px-3 py-1.5 rounded-lg font-semibold cursor-pointer">Change photo
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) readFile(f, src => { setProfileForm(p => ({ ...p, avatar: src })); setCurrentUser(u => ({ ...u, avatar: src })); }); e.target.value = ''; }} /></label>
              </div>
              <label className="block font-semibold">Full name<input required value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} placeholder="As shown on your ID" className="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1.5 font-normal" /></label>
              <label className="block font-semibold">Date of birth<input type="date" required max={todayStr} value={profileForm.dob} onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1.5 font-normal" /></label>
              <div className="flex gap-2">
                <label className="font-semibold">Document
                  <select value={profileForm.docType} onChange={(e) => setProfileForm({ ...profileForm, docType: e.target.value })} className="mt-1 block border border-slate-300 rounded-lg px-2 py-1.5 font-normal">
                    <option value="DNI">DNI</option><option value="Passport">Passport</option><option value="CE">Carnet de extranjería</option></select></label>
                <label className="flex-1 font-semibold">Number<input value={profileForm.docNumber} onChange={(e) => setProfileForm({ ...profileForm, docNumber: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1.5 font-normal" /></label>
              </div>
              <div className="space-y-1">
                <p className="font-semibold">Photo of your document</p>
                {profileForm.docImage && <img src={profileForm.docImage} alt="Document" className="w-full h-32 object-cover rounded-lg border border-slate-200" />}
                <label className="inline-block bg-slate-800 text-white px-3 py-1.5 rounded-lg cursor-pointer font-semibold">{profileForm.docImage ? 'Replace photo' : 'Upload photo'}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) readFile(f, src => setProfileForm(p => ({ ...p, docImage: src }))); e.target.value = ''; }} /></label>
              </div>
              <label className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2">
                <input type="checkbox" checked={profileForm.sworn} onChange={(e) => setProfileForm({ ...profileForm, sworn: e.target.checked })} className="mt-0.5" />
                <span><b>Sworn declaration (declaración jurada):</b> I declare under oath that the document I am uploading is genuine and belongs to me, and that the information I provide is true. I understand that a false declaration may have legal consequences.</span>
              </label>
              {profileError && <p className="text-rose-600 font-semibold">{profileError}</p>}
            </div>
            <div className="p-4 border-t flex gap-2" style={{ flexShrink: 0 }}>
              <button type="button" onClick={() => setIsProfileModalOpen(false)} className="flex-1 border border-slate-300 py-2 rounded-xl font-bold">Close</button>
              <button type="submit" className="flex-1 bg-keda-600 hover:bg-keda-700 text-white py-2 rounded-xl font-bold">Save profile</button>
            </div>
          </form>
        </div>
      )}

      {/* Rental Contract Modal */}
      {isContractModalOpen && selectedContractBooking && (() => {
        const cb = bookings.find(b => b.id === selectedContractBooking.id) || selectedContractBooking;
        const clauses = buildContract(cb, properties.find(p => p.id === cb.propertyId), INITIAL_USER);
        const canSign = activeRoleMode === 'guest' && !cb.contractSigned;
        return (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4" onClick={() => setIsContractModalOpen(false)}>
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl max-w-2xl w-full text-xs" style={{ maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div className="flex justify-between items-start p-4 border-b shrink-0" style={{ flexShrink: 0 }}>
                <div><h3 className="font-bold text-sm">Contrato de Arrendamiento de Vivienda Temporal Amoblada</h3>
                  <p className="text-slate-500">Contract {cb.id} · {fmtDate(cb.checkIn)} to {fmtDate(cb.checkOut)}</p></div>
                <button onClick={() => setIsContractModalOpen(false)}><X className="w-4 h-4" /></button>
              </div>
              <div className="p-4 space-y-3 text-slate-700" style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto' }}>
                {clauses.map(([t, ps], i) => (
                  <div key={t}><p className="font-bold text-slate-900">{i + 1}. {t}</p>{ps.map((p, j) => <p key={j} className="mt-1 leading-relaxed">{p}</p>)}</div>
                ))}
                <p className="text-[10px] text-slate-400 border-t pt-2">Template for guidance. Have it reviewed by a Peruvian lawyer before relying on it.</p>
              </div>
              <div className="p-4 border-t space-y-2" style={{ flexShrink: 0, maxHeight: '45vh', overflowY: 'auto' }}>
                {cb.contractSigned ? (
                  <p className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-2 font-semibold flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Signed by {cb.contractSignature || cb.guestName} on {cb.contractSignedAt}</p>
                ) : canSign ? (
                  <>
                    <label className="flex items-start gap-2"><input type="checkbox" checked={hasAcceptedTermsCheck} onChange={(e) => setHasAcceptedTermsCheck(e.target.checked)} className="mt-0.5" />
                      <span>I have read and accept all clauses, including the damage, theft and overstay terms.</span></label>
                    <div className="flex flex-wrap gap-2">
                      <input value={eSignatureText} onChange={(e) => setESignatureText(e.target.value)} placeholder="Type your full name to sign" className="flex-1 min-w-[160px] border border-slate-300 rounded-lg px-2 py-1.5 italic" />
                      <button disabled={!hasAcceptedTermsCheck || eSignatureText.trim().length < 3} onClick={() => signContract()} className="bg-keda-600 disabled:opacity-40 text-white px-4 py-1.5 rounded-lg font-bold">Accept & Sign</button>
                      <button disabled={!hasAcceptedTermsCheck} onClick={() => signContract(cb.guestName)} className="bg-slate-800 disabled:opacity-40 text-white px-3 py-1.5 rounded-lg font-semibold">Quick sign as {cb.guestName}</button>
                    </div>
                  </>
                ) : <p className="text-amber-700 font-semibold">Waiting for the guest to accept and sign.</p>}
                <div className="flex justify-between items-center"><button onClick={() => downloadContract(cb)} className="text-keda-600 font-semibold flex items-center gap-1"><Download className="w-3.5 h-3.5" /> Download copy (.txt)</button><button onClick={() => setIsContractModalOpen(false)} className="bg-slate-800 text-white px-4 py-1.5 rounded-lg font-semibold">Close</button></div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Edit Listing Modal */}
      {editDraft && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-2xl w-full text-xs" style={{ maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="flex justify-between items-center p-4 border-b shrink-0" style={{ flexShrink: 0 }}>
              <h3 className="font-bold text-sm">Edit listing {editDirty && <span className="ml-2 text-amber-600 font-semibold">• unsaved changes</span>}</h3>
              <button onClick={requestExitEdit} aria-label="Close"><X className="w-4 h-4" /></button></div>
            <div className="p-5 space-y-4" style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'scroll' }}>

            <div className="space-y-2">
              <p className="font-bold">Photos (first one is the cover)</p>
              <div className="grid grid-cols-3 gap-2">
                {editDraft.images.map((img, i) => (
                  <div key={img.id} className="space-y-1">
                    <img src={img.src} style={{ filter: img.filter }} alt="" className="w-full h-20 object-cover rounded-lg" />
                    <div className="flex flex-wrap gap-1">
                      <button onClick={() => enhancePhoto(img)} className="bg-purple-100 text-kamber px-1.5 py-0.5 rounded">AI enhance</button>
                      {i > 0 && <button onClick={() => patchDraft({ images: [img, ...editDraft.images.filter(x => x.id !== img.id)] })} className="bg-slate-100 px-1.5 py-0.5 rounded">Cover</button>}
                      {editDraft.images.length > 1 && <button onClick={() => patchDraft({ images: editDraft.images.filter(x => x.id !== img.id) })} className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Remove</button>}
                    </div>
                  </div>
                ))}
              </div>
              <label className="inline-block bg-slate-800 text-white px-3 py-1.5 rounded-lg cursor-pointer">Upload photos
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { uploadPhotos(e.target.files); e.target.value = ''; }} /></label>
              {photoAdvice && <pre className="whitespace-pre-wrap bg-slate-50 border border-slate-200 rounded-xl p-2 font-sans">{photoAdvice}</pre>}
            </div>

            <input value={editDraft.title} onChange={(e) => patchDraft({ title: e.target.value })} placeholder="Title" className="w-full border border-slate-300 rounded-lg px-2 py-1.5 font-semibold" />
            <input value={editDraft.address || ''} onChange={(e) => patchDraft({ address: e.target.value })} placeholder="Exact address (private: guests only see it after their booking is confirmed)" className="w-full border border-slate-300 rounded-lg px-2 py-1.5" />
            <textarea value={editDraft.description} onChange={(e) => patchDraft({ description: e.target.value })} rows={3} placeholder="Description" className="w-full border border-slate-300 rounded-lg px-2 py-1.5" />
            <div className="grid grid-cols-3 gap-2">
              {[['pricePerNight', 'Price/night ($)'], ['maxGuests', 'Max guests'], ['bathroomsCount', 'Bathrooms'], ['garageSpaces', 'Garage spaces']].map(([k, l]) => (
                <label key={k} className="font-semibold">{l}<input type="number" min="0" value={editDraft[k]} onChange={(e) => patchDraft({ [k]: Number(e.target.value) || 0 })} className="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1.5 font-normal" /></label>
              ))}
              <label className="font-semibold">Kitchen
                <select value={editDraft.kitchenType} onChange={(e) => patchDraft({ kitchenType: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1.5 font-normal">
                  {[...new Set([...KITCHEN_TYPES, editDraft.kitchenType])].map(k => <option key={k}>{k}</option>)}</select></label>
            </div>

            <div className="space-y-2">
              <p className="font-bold">Rules & promotions</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[['minNights', 'Minimum nights'], ['weeklyDiscount', 'Weekly stay % (7+ nights)'], ['earlyBirdDiscount', 'Early-bird % (30+ days)'], ['returningDiscount', 'Returning guests %']].map(([k, l]) => (
                  <label key={k} className="font-semibold">{l}<input type="number" min="0" value={editDraft[k] ?? 0} onChange={(e) => patchDraft({ [k]: Math.max(0, Number(e.target.value) || 0) })} className="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1.5 font-normal" /></label>
                ))}
              </div>
              <label className="block font-semibold">Cancellation policy
                <select value={editDraft.cancellation || 'moderate'} onChange={(e) => patchDraft({ cancellation: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1.5 font-normal">
                  {Object.entries(CANCEL_POLICIES).map(([k, v]) => <option key={k} value={k}>{v.label}: {v.short}</option>)}</select></label>
              <p className="text-slate-500">Only the largest discount that applies is used. Guests see your policy on the listing and in their contract.</p>
            </div>
            <div className="space-y-2">
              <p className="font-bold">Rooms & beds <span className="font-normal text-slate-500">(add a sofa bed to the living room)</span></p>
              {editDraft.rooms.map((r, ri) => (
                <div key={r.id} className="border border-slate-200 rounded-xl p-2 space-y-1">
                  <div className="flex justify-between items-center"><span className="flex items-center gap-2 font-semibold"><select value={r.kind || 'bedroom'} onChange={(e) => setRoom(ri, rm => ({ ...rm, kind: e.target.value }))} className="border border-slate-300 rounded-lg px-1 py-0.5 font-semibold"><option value="bedroom">Bedroom</option><option value="living">Living room</option><option value="other">Other area</option></select>{(r.kind || 'bedroom') === 'bedroom' && `#${editDraft.rooms.slice(0, ri + 1).filter(x => (x.kind || 'bedroom') === 'bedroom').length}`}</span>
                    {editDraft.rooms.length > 1 && <button onClick={() => patchDraft({ rooms: editDraft.rooms.filter((_, i) => i !== ri) })} className="text-red-600">Remove room</button>}</div>
                  {r.beds.map((b, bi) => (
                    <div key={bi} className="flex gap-2 items-center">
                      <select value={b.type} onChange={(e) => setRoom(ri, rm => ({ ...rm, beds: rm.beds.map((x, i) => i === bi ? { ...x, type: e.target.value } : x) }))} className="border border-slate-300 rounded-lg px-2 py-1">
                        {BED_TYPES.map(t => <option key={t}>{t}</option>)}</select>
                      <input type="number" min="1" value={b.count} onChange={(e) => setRoom(ri, rm => ({ ...rm, beds: rm.beds.map((x, i) => i === bi ? { ...x, count: Math.max(1, Number(e.target.value) || 1) } : x) }))} className="w-14 border border-slate-300 rounded-lg px-2 py-1" />
                      {r.beds.length > 1 && <button onClick={() => setRoom(ri, rm => ({ ...rm, beds: rm.beds.filter((_, i) => i !== bi) }))} className="text-red-600"><Trash className="w-3 h-3" /></button>}
                    </div>
                  ))}
                  <button onClick={() => setRoom(ri, rm => ({ ...rm, beds: [...rm.beds, { type: 'Single', count: 1 }] }))} className="text-keda-600 font-semibold">+ Add bed</button>
                </div>
              ))}
              <div className="flex gap-4"><button onClick={() => patchDraft({ rooms: [...editDraft.rooms, { id: `r${Date.now()}`, kind: 'bedroom', beds: [{ type: 'Double', count: 1 }] }] })} className="text-keda-600 font-semibold">+ Add bedroom</button><button onClick={() => patchDraft({ rooms: [...editDraft.rooms, { id: `r${Date.now()}`, kind: 'living', beds: [{ type: 'Sofa bed', count: 1 }] }] })} className="text-keda-600 font-semibold">+ Add living room (sofa bed)</button></div>
            </div>

            <div className="space-y-2">
              <p className="font-bold">Amenities</p>
              <div className="flex flex-wrap gap-1">
                {[...new Set([...AMENITY_PRESETS, ...editDraft.amenities])].map(a => {
                  const on = editDraft.amenities.includes(a);
                  return <button key={a} onClick={() => patchDraft({ amenities: on ? editDraft.amenities.filter(x => x !== a) : [...editDraft.amenities, a] })} className={`px-2 py-0.5 rounded-full border ${on ? 'bg-keda-600 text-white border-keda-600' : 'bg-white text-slate-600 border-slate-300'}`}>{a}</button>;
                })}
              </div>
              <div className="flex gap-1">
                <input value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)} placeholder="Custom amenity" className="flex-1 border border-slate-300 rounded-lg px-2 py-1" />
                <button onClick={() => { const v = amenityInput.trim(); if (v && !editDraft.amenities.includes(v)) patchDraft({ amenities: [...editDraft.amenities, v] }); setAmenityInput(''); }} className="bg-slate-800 text-white px-3 rounded-lg">Add</button>
              </div>
            </div>

            <div className="border-t pt-3 space-y-1"><p className="font-bold">Preview</p><PropertyFacts prop={{ ...editDraft, bedroomsCount: editDraft.rooms.length }} /></div>
            </div>
            <div className="p-4 border-t flex gap-2" style={{ flexShrink: 0 }}>
              <button onClick={requestExitEdit} className="flex-1 border border-slate-300 hover:bg-slate-50 py-2 rounded-xl font-bold">Exit</button>
              <button onClick={saveEdit} disabled={!editDraft.title.trim()} className="flex-1 bg-keda-600 hover:bg-keda-700 disabled:opacity-40 text-white py-2 rounded-xl font-bold">Save changes & exit</button>
            </div>
            {confirmExitEdit && (
              <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-3 shadow-2xl">
                  <p className="font-bold text-sm">Save your changes before leaving?</p>
                  <p className="text-slate-600">You have unsaved changes to this listing.</p>
                  <div className="flex flex-col gap-2">
                    <button onClick={saveEdit} className="bg-keda-600 hover:bg-keda-700 text-white py-2 rounded-xl font-bold">Save & exit</button>
                    <button onClick={closeEdit} className="border border-rose-300 text-rose-600 py-2 rounded-xl font-bold">Discard changes & exit</button>
                    <button onClick={() => setConfirmExitEdit(false)} className="border border-slate-300 py-2 rounded-xl font-bold">Keep editing</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-3">
            <div className="flex justify-between items-center"><h3 className="font-bold text-sm">Currency & Language</h3>
              <button onClick={() => setIsSettingsOpen(false)}><X className="w-4 h-4" /></button></div>
            <label className="block text-xs font-semibold">Currency
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1.5">
                <option value="USD">USD ($)</option><option value="PEN">PEN (S/)</option><option value="EUR">EUR (€)</option></select></label>
            <label className="block text-xs font-semibold">Language
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1.5">
                <option value="ES">Español</option><option value="EN">English</option></select></label>
            <button onClick={() => setIsSettingsOpen(false)} className="w-full bg-keda-600 text-white py-2 rounded-xl text-xs font-bold">Done</button>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isBookingModalOpen && selectedProperty && (() => {
        const q = bookingQuote();
        return (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-3" style={{ maxHeight: '92vh', overflowY: 'auto' }}>
              <div className="flex justify-between items-center"><h3 className="font-bold text-sm">Book: {selectedProperty.title}</h3>
                <button onClick={closeBooking}><X className="w-4 h-4" /></button></div>
              {bookingSuccess ? (
                <div className="text-center space-y-3 py-4">
                  <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                  <p className="text-sm font-bold">Booking confirmed!</p>
                  {selectedProperty?.address && paymentMethod !== 'transfer' && <p className="text-xs text-slate-600">📍 {selectedProperty.address}, {selectedProperty.district}</p>}
                  {paymentMethod === 'transfer' && <p className="text-xs text-slate-600">The exact address is released once your transfer is confirmed.</p>}
                  <button onClick={() => { const nb = bookings[bookings.length - 1]; closeBooking(); openContract(nb); }} className="w-full bg-keda-600 text-white py-2 rounded-xl text-xs font-bold">Review & sign rental contract</button>
                  <button onClick={closeBooking} className="w-full bg-keda-900 text-white py-2 rounded-xl text-xs font-bold">Close</button>
                </div>
              ) : (
                <form onSubmit={submitBooking} className="space-y-3 text-xs">
                  <div className="flex gap-2">
                    <label className="flex-1 font-semibold">Check-in<input type="date" value={bookingDates.checkIn} onChange={(e) => setBookingDates({ ...bookingDates, checkIn: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1.5" /></label>
                    <label className="flex-1 font-semibold">Check-out<input type="date" value={bookingDates.checkOut} onChange={(e) => setBookingDates({ ...bookingDates, checkOut: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1.5" /></label>
                  </div>
                  <label className="block font-semibold">Guests (max {selectedProperty.maxGuests})
                    <input type="number" min="1" max={selectedProperty.maxGuests} value={guestCount} onChange={(e) => setGuestCount(Math.min(selectedProperty.maxGuests, Math.max(1, Number(e.target.value) || 1)))} className="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1.5" /></label>
                  <div className="flex gap-2">
                    <label className="font-semibold">ID type
                      <select value={guestDocType} onChange={(e) => setGuestDocType(e.target.value)} className="mt-1 block border border-slate-300 rounded-lg px-2 py-1.5 font-normal"><option value="DNI">DNI</option><option value="Passport">Passport</option><option value="CE">Carnet de extranjería</option></select></label>
                    <label className="block font-semibold flex-1">ID number
                      <input value={guestDocumentInput} onChange={(e) => setGuestDocumentInput(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1.5 font-normal" /></label>
                  </div>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full border border-slate-300 rounded-lg px-2 py-1.5">
                    <option value="card">Credit / Debit Card</option><option value="transfer">Bank Transfer</option><option value="yape">Yape</option><option value="plin">Plin</option></select>
                  {q.conflict && <p className="text-red-600 font-semibold">Some of these dates are unavailable.</p>}
                  {q.nights < 1 && <p className="text-red-600 font-semibold">Check-out must be after check-in.</p>}
                  <div className="space-y-1 border-t pt-2">
                    <div className="flex justify-between"><span>{formatMoney(Math.round(q.subtotal / Math.max(q.nights, 1)))} x {q.nights} night(s)</span><span>{formatMoney(q.subtotal)}</span></div>
                    {q.promo && <div className="flex justify-between text-keda-700 font-semibold"><span>{q.promo.label} (-{q.promo.pct}%)</span><span>-{formatMoney(q.subtotal - q.total)}</span></div>}
                    <div className="flex justify-between"><span>KEDA service fee</span><span>{formatMoney(0)}</span></div>
                    <div className="flex justify-between font-extrabold text-sm border-t pt-1"><span>Total, all included</span><span>{formatMoney(q.total)}</span></div>
                    <p className="text-slate-500">{CANCEL_POLICIES[selectedProperty.cancellation || 'moderate'].short}</p>
                  </div>
                  {q.tooShort && <p className="text-red-600 font-semibold">Minimum stay is {selectedProperty.minNights} nights.</p>}
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-3 space-y-1">
                    <div className="flex justify-between"><span>Same stay on Airbnb (est. +14% guest fee)</span><span className="line-through text-slate-500">{formatMoney(Math.round(q.total * 1.14))}</span></div>
                    <div className="flex justify-between font-bold"><span>On KEDA</span><span>{formatMoney(q.total)}</span></div>
                    <div className="flex justify-between font-extrabold text-keda-700"><span>You save (estimate)</span><span>{formatMoney(Math.round(q.total * 0.14))}</span></div>
                  </div>
                  {guestCount > selectedProperty.maxGuests && <p className="text-red-600 font-semibold">Too many guests for this property.</p>}
                  <button type="button" onClick={() => { setActiveChatProperty(selectedProperty); setIsChatOpen(true); setIsChatMinimized(false); }} className="w-full border border-keda-300 text-keda-700 py-1.5 rounded-xl font-semibold">Ask the host a question first</button>
                  <button type="submit" disabled={q.conflict || q.tooShort || q.nights < 1 || !guestDocumentInput.trim() || guestCount > selectedProperty.maxGuests} className="w-full bg-keda-600 disabled:opacity-40 text-white py-2 rounded-xl font-bold">Confirm & Pay</button>
                </form>
              )}
            </div>
          </div>
        );
      })()}

      {/* Add Property Modal */}
      {isAddPropertyOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <form onSubmit={submitNewProperty} className="bg-white rounded-2xl max-w-md w-full p-5 space-y-2 text-xs" style={{ maxHeight: '92vh', overflowY: 'auto' }}>
            <div className="flex justify-between items-center"><h3 className="font-bold text-sm">Add Property</h3>
              <button type="button" onClick={() => setIsAddPropertyOpen(false)}><X className="w-4 h-4" /></button></div>
            <input required placeholder="Title" value={newProp.title} onChange={(e) => setNewProp({ ...newProp, title: e.target.value })} className="w-full border border-slate-300 rounded-lg px-2 py-1.5" />
            <div className="flex gap-2">
              <input placeholder="District" value={newProp.district} onChange={(e) => setNewProp({ ...newProp, district: e.target.value })} className="flex-1 border border-slate-300 rounded-lg px-2 py-1.5" />
              <input placeholder="City" value={newProp.city} onChange={(e) => setNewProp({ ...newProp, city: e.target.value })} className="flex-1 border border-slate-300 rounded-lg px-2 py-1.5" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[['pricePerNight', 'Price/night'], ['minPriceFloor', 'Min price'], ['maxGuests', 'Max guests'], ['bedroomsCount', 'Bedrooms'], ['bathroomsCount', 'Bathrooms'], ['garageSpaces', 'Garage']].map(([k, label]) => (
                <label key={k} className="font-semibold">{label}<input type="number" min="0" value={newProp[k]} onChange={(e) => setNewProp({ ...newProp, [k]: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-2 py-1.5" /></label>
              ))}
            </div>
            <textarea placeholder="Description" value={newProp.description} onChange={(e) => setNewProp({ ...newProp, description: e.target.value })} className="w-full border border-slate-300 rounded-lg px-2 py-1.5" rows={3} />
            <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-xl font-bold">Create Listing</button>
          </form>
        </div>
      )}

      {/* Chat Leak Protection Warning Modal */}
      {chatWarningModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 text-center">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="font-bold text-slate-900 text-sm">Message Blocked: Privacy Policy</h3>
            <p className="text-xs text-slate-600">
              Your message was not sent. Under the KEDA privacy policy, phone numbers, emails, websites and social handles can't be shared until a booking is confirmed. You can keep asking about the property here; contact details unlock after you book.
            </p>
            <button
              onClick={() => setChatWarningModal(false)}
              className="w-full bg-keda-900 text-white py-2 rounded-xl text-xs font-bold"
            >
              Understand & Continue
            </button>
          </div>
        </div>
      )}

      {/* AI Photo Enhancer Advice Modal */}
      {editingProperty && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" /> AI Photo Staging Advice
              </h3>
              <button onClick={() => setEditingProperty(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <img src={editingProperty.imageUrl} alt="Property" className="w-full h-40 object-cover rounded-xl" />
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-line font-mono">
              {aiAdviceText}
            </div>
            <button
              onClick={() => setEditingProperty(null)}
              className="w-full bg-keda-600 text-white py-2 rounded-xl text-xs font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}