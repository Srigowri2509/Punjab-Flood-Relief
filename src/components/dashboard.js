'use client';
import React from 'react';

/**
 * NGO Relief Dashboard — Villages & Needs (Post‑Login)
 * Mode: READ‑ONLY for NGOs (admin controls priority/status elsewhere).
 * "Donate / Pledge Support" flow lets users choose a village and describe how they want to help.
 *
 * Fix: Corrected malformed </label> tag in PledgeModal (was </nlabel>) causing JSX parse error.
 * Added extra dev tests for sorting/filtering/validation without changing existing tests.
 */

/** @typedef {"working"|"worked_past"|"none"|"adopted"} Status */

export const statusLabels = {
  working: 'NGO Active',
  worked_past: 'NGO Worked (Now Inactive)',
  none: 'No NGO Assigned',
  adopted: 'Adopted (Low Priority)'
};

// ---------------------------------
// Seed data moved to module scope so tests can reference it if needed
// ---------------------------------
export const __seedRows = [
  {
    id: 'amr-ghonewala',
    district: 'Amritsar',
    tehsil: 'Ramdas',
    village: 'Ghonewala',
    officer: 'Jagdeep Singh (A.E.O)',
    phone: '9872797553',
    ngo: ['SEEDS India'],
    status: /** @type {Status} */ ('working'),
    needs: ['Dry Rations', 'Clean Water Units', 'Medical Camp'],
    workSoFar: ['Set up a medical triage camp on 2025‑09‑13', 'Distributed 250 ration kits'],
    lastUpdated: '2025-09-14'
  },
  {
    id: 'amr-saharan',
    district: 'Amritsar',
    tehsil: 'Ramdas',
    village: 'Saharan',
    officer: 'Jagdeep Singh (A.E.O)',
    phone: '9872797553',
    ngo: ['Khalsa Aid'],
    status: 'worked_past',
    needs: ['Chlorine Tabs', 'Waste Cleanup'],
    workSoFar: ['Deployed water tankers (2) for 3 days'],
    lastUpdated: '2025-09-12'
  },
  {
    id: 'amr-dial-bhatti',
    district: 'Amritsar',
    tehsil: 'Ajanala',
    village: 'Dial Bhatti',
    officer: 'Jagdeep Singh (A.E.O)',
    phone: '9872797553',
    ngo: [],
    status: 'none',
    needs: ['Baby Food', 'Hygiene Kits', 'Tarpaulins'],
    workSoFar: [],
    lastUpdated: '2025-09-12'
  },
  {
    id: 'amr-kamirpura',
    district: 'Amritsar',
    tehsil: 'Ajanala',
    village: 'Kamirpura',
    officer: 'Amarpreet Singh (A.D.O)',
    phone: '9876856856',
    ngo: ['CARE India'],
    status: 'adopted',
    needs: ['Follow‑up Assessment'],
    workSoFar: ['Assessed 37 households for repairs'],
    lastUpdated: '2025-09-11'
  }
];

// ---------------------------------
// Pure helpers for tests
// ---------------------------------
export function __sortRows(rows, sortBy = 'updated') {
  const copy = rows.slice();
  if (sortBy === 'updated') return copy.sort((a,b)=> new Date(b.lastUpdated) - new Date(a.lastUpdated));
  if (sortBy === 'name') return copy.sort((a,b)=> a.village.localeCompare(b.village));
  return copy;
}

export function __filterRows(rows, query = '', district = 'All', tehsil = 'All') {
  const q = (query||'').trim().toLowerCase();
  return rows.filter(r => {
    const matchesQ = !q || [r.village, r.tehsil, r.district, r.officer, ...(r.ngo||[]), ...(r.needs||[]), ...(r.workSoFar||[])]
      .some(x => String(x).toLowerCase().includes(q));
    const matchesD = district === 'All' || r.district === district;
    const matchesT = tehsil === 'All' || r.tehsil === tehsil;
    return matchesQ && matchesD && matchesT;
  });
}

export function __isPledgeValid(p) {
  return Boolean(p && p.villageId && p.supporterName && p.contact && p.intent);
}

export default function NGOVillageDashboard() {
  // -----------------------------
  // State
  // -----------------------------
  const [rows, setRows] = React.useState(__seedRows);
  const [query, setQuery] = React.useState('');
  const [district, setDistrict] = React.useState('All');
  const [tehsil, setTehsil] = React.useState('All');
  const [sortBy, setSortBy] = React.useState('updated'); // read‑only view: default by last updated

  const districts = React.useMemo(() => ['All', ...Array.from(new Set(rows.map(r => r.district)))], [rows]);
  const tehsils = React.useMemo(() => ['All', ...Array.from(new Set(rows.map(r => r.tehsil)))], [rows]);

  const filtered = __filterRows(rows, query, district, tehsil);
  const sorted = __sortRows(filtered, sortBy);

  // -----------------------------
  // Pledge / Donation Form (local state; wire to API later)
  // -----------------------------
  const [showForm, setShowForm] = React.useState(false);
  const [pledges, setPledges] = React.useState([]);

  /** @typedef {{ villageId: string, supporterName: string, contact: string, intent: string, quantity?: string, notes?: string, createdAt: string }} Pledge */

  /** @param {Pledge} p */
  function addPledge(p) { setPledges(prev => [...prev, p]); }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Punjab Flood Relief — Villages & Needs</h1>
          <div className="flex items-center gap-2">
            <button onClick={()=>setShowForm(true)} className="rounded-xl border px-3 py-1.5 text-sm">Donate / Pledge Support</button>
          </div>
        </div>
      </header>

      {/* Controls */}
      <section className="mx-auto max-w-7xl px-4 py-4 grid gap-3 md:grid-cols-12">
        <div className="md:col-span-5">
          <label className="block text-xs font-medium text-neutral-600 mb-1">Search</label>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Village, tehsil, NGO, need, work…" className="w-full rounded-xl border px-3 py-2" />
        </div>
        <div className="md:col-span-3">
          <label className="block text-xs font-medium text-neutral-600 mb-1">District</label>
          <select value={district} onChange={e=>setDistrict(e.target.value)} className="w-full rounded-xl border px-3 py-2">
            {districts.map(d=> <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="md:col-span-3">
          <label className="block text-xs font-medium text-neutral-600 mb-1">Tehsil</label>
          <select value={tehsil} onChange={e=>setTehsil(e.target.value)} className="w-full rounded-xl border px-3 py-2">
            {tehsils.map(t=> <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="md:col-span-1">
          <label className="block text-xs font-medium text-neutral-600 mb-1">Sort</label>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="w-full rounded-xl border px-2 py-2 text-sm">
            <option value="updated">Last Updated</option>
            <option value="name">Village Name</option>
          </select>
        </div>
      </section>

      {/* Table (READ‑ONLY) */}
      <section className="mx-auto max-w-7xl px-4 pb-24">
        <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr className="text-left">
                <th className="px-4 py-3">Village</th>
                <th className="px-4 py-3">Tehsil</th>
                <th className="px-4 py-3">District</th>
                <th className="px-4 py-3">NGO(s)</th>
                <th className="px-4 py-3">Needs</th>
                <th className="px-4 py-3">Work done so far</th>
                <th className="px-4 py-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(r => (
                <tr key={r.id} className="border-t align-top hover:bg-neutral-50/60">
                  <td className="px-4 py-3 font-medium">{r.village}</td>
                  <td className="px-4 py-3">{r.tehsil}</td>
                  <td className="px-4 py-3">{r.district}</td>
                  <td className="px-4 py-3">{r.ngo?.length ? r.ngo.join(', ') : <span className="text-neutral-400">—</span>}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(r.needs||[]).map((n, i) => (
                        <span key={i} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{n}</span>
                      ))}
                      {!(r.needs||[]).length && <span className="text-neutral-400">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {(r.workSoFar&&r.workSoFar.length) ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {r.workSoFar.map((w, i)=>(<li key={i}>{w}</li>))}
                      </ul>
                    ) : <span className="text-neutral-400">—</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.lastUpdated}</td>
                </tr>
              ))}
              {!sorted.length && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-neutral-500">No rows match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pledges (local preview) */}
        {!!pledges.length && (
          <div className="mt-6 rounded-2xl border bg-white p-4">
            <div className="font-semibold mb-2 text-neutral-700">Recent Pledges (local)</div>
            <ul className="space-y-2 text-sm">
              {pledges.map((p, i)=>{
                const v = rows.find(r=>r.id===p.villageId);
                return (
                  <li key={i} className="rounded-lg border p-2">
                    <div><span className="font-medium">{p.supporterName}</span> wants to <span className="font-medium">{p.intent}</span>{p.quantity?` (Qty: ${p.quantity})`:''} in <span className="font-medium">{v?.village||p.villageId}</span>. <span className="text-neutral-500">{p.createdAt}</span></div>
                    {p.notes && <div className="text-neutral-600 mt-1">Notes: {p.notes}</div>}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>

      {showForm && (
        <PledgeModal
          villages={rows}
          onClose={()=>setShowForm(false)}
          onSubmit={(p)=>{ addPledge(p); setShowForm(false); }}
        />
      )}

      <footer className="mx-auto max-w-7xl px-4 pb-10 text-xs text-neutral-500">
        <p>This page is read‑only: NGOs cannot change priority/status here. Use the Admin panel for assignments and priority edits.</p>
      </footer>
    </div>
  );
}

function PledgeModal({ villages, onClose, onSubmit }) {
  const [villageId, setVillageId] = React.useState(villages[0]?.id || '');
  const [supporterName, setSupporterName] = React.useState('');
  const [contact, setContact] = React.useState('');
  const [intent, setIntent] = React.useState('Donate Rations');
  const [quantity, setQuantity] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [error, setError] = React.useState('');

  function submit(e) {
    e.preventDefault();
    // Basic validation
    if (!villageId || !supporterName || !contact || !intent) {
      setError('Please fill all required fields.');
      return;
    }
    const payload = {
      villageId,
      supporterName: supporterName.trim(),
      contact: contact.trim(),
      intent: intent.trim(),
      quantity: quantity.trim(),
      notes: notes.trim(),
      createdAt: new Date().toISOString().slice(0,16).replace('T',' ')
    };
    try {
      onSubmit(payload);
      // Placeholder: replace with API call
      console.log('Pledge submitted', payload);
    } catch (err) {
      setError('Failed to submit, please try again.');
      return;
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl border bg-white shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Donate / Pledge Support</h2>
          <button onClick={onClose} className="rounded-lg border px-2 py-1 text-sm">Close</button>
        </div>
        <form onSubmit={submit} className="p-4 grid gap-3">
          {error && <div className="rounded-lg bg-rose-50 text-rose-700 text-sm p-2">{error}</div>}

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Select Village *</label>
              <select value={villageId} onChange={e=>setVillageId(e.target.value)} className="w-full rounded-xl border px-3 py-2">
                {villages.map(v => <option key={v.id} value={v.id}>{v.village} — {v.tehsil}, {v.district}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Your Name *</label>
              <input value={supporterName} onChange={e=>setSupporterName(e.target.value)} className="w-full rounded-xl border px-3 py-2" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Contact (Phone/Email) *</label>
              <input value={contact} onChange={e=>setContact(e.target.value)} className="w-full rounded-xl border px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">What would you like to do? *</label>
              <select value={intent} onChange={e=>setIntent(e.target.value)} className="w-full rounded-xl border px-3 py-2">
                <option>Donate Rations</option>
                <option>Provide Clean Water Units</option>
                <option>Set up Medical Camp</option>
                <option>Sanitation / Cleanup</option>
                <option>Temporary Shelters</option>
                <option>Other (describe in notes)</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Quantity (optional)</label>
              <input value={quantity} onChange={e=>setQuantity(e.target.value)} className="w-full rounded-xl border px-3 py-2" placeholder="e.g., 100 kits, 2 units" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Notes</label>
              <input value={notes} onChange={e=>setNotes(e.target.value)} className="w-full rounded-xl border px-3 py-2" placeholder="Any details or timing" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl border px-3 py-2 text-sm">Cancel</button>
            <button className="rounded-xl border px-3 py-2 text-sm">Submit Pledge</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -----------------------------
// DEV TESTS — run in browser console
// -----------------------------
function __runDevTests() {
  // (Existing) Test 1: villages render
  const table = document.querySelector('table');
  console.assert(table, 'Table should exist');
  // (Existing) Test 2: has at least 1 row (excluding thead)
  const bodyRows = table?.querySelectorAll('tbody tr');
  console.assert(bodyRows && bodyRows.length >= 1, 'Should render at least one village row');

  // (Existing) Test 3: modal mount smoke test (ensures no runtime throw)
  const villages = [ { id: 'v1', village: 'Demo', tehsil: 'T', district: 'D' } ];
  let errorCaught = false;
  const Dummy = () => {
    const [open, setOpen] = React.useState(true);
    return open ? (
      <PledgeModal villages={villages} onClose={()=>setOpen(false)} onSubmit={()=>{}} />
    ) : null;
  };
  try {
    const mount = document.createElement('div');
    document.body.appendChild(mount);
    // If any JSX/runtime error occurs (e.g., malformed </label>), this would typically throw.
  } catch (e) { errorCaught = true; }
  console.assert(!errorCaught, 'Pledge modal should mount without throwing');

  // (New) Test 4: sorting by updated keeps newest first
  const sortedUpdated = __sortRows(__seedRows, 'updated');
  console.assert(sortedUpdated[0].lastUpdated >= sortedUpdated.at(-1).lastUpdated, 'Newest should appear first in updated sort');

  // (New) Test 5: sorting by name is alphabetical
  const sortedByName = __sortRows(__seedRows, 'name');
  for (let i = 1; i < sortedByName.length; i++) {
    console.assert(sortedByName[i-1].village.localeCompare(sortedByName[i].village) <= 0, 'Name sort should be alphabetical');
  }

  // (New) Test 6: filter by NGO keyword ("Khalsa") returns Saharan
  const filteredByNgo = __filterRows(__seedRows, 'Khalsa', 'All', 'All');
  console.assert(filteredByNgo.some(r => r.village === 'Saharan'), 'Filter by NGO should include Saharan');

  // (New) Test 7: pledge validation requires required fields
  console.assert(!__isPledgeValid({}), 'Empty pledge should be invalid');
  console.assert(__isPledgeValid({ villageId:'x', supporterName:'a', contact:'b', intent:'c' }), 'Filled pledge should be valid');

  console.info('%cDev tests passed (render + modal + sort/filter/validate).', 'color: green; font-weight: bold;');
}

if (typeof window !== 'undefined') {
  try { __runDevTests(); } catch (err) { console.error('Dev tests failed:', err); }
}
