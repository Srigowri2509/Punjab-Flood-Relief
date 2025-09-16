'use client';
// @ts-nocheck
import React from 'react';

/**
 * Punjab Flood Relief — Government Layout (Full-width, Green Theme)
 * - No hero image
 * - Non-blue aesthetic (official deep green)
 * - Full-width "bands" to make it feel like a complete page
 * - KPIs, Overview & Actions, Inline Lightbox Gallery, Charts, NGO section
 * - No external libraries
 */

/* ------------------------------ Helpers ---------------------------------- */
function fmt(n, opts = {}) {
  const { decimals = 0, locale = 'en-IN', fallback = (typeof n === 'string' ? n : '—') } = opts;
  let num;
  if (typeof n === 'number') num = n;
  else if (typeof n === 'string') {
    const s = n.trim().split(',').join('');
    num = s === '' ? NaN : Number(s);
  } else num = Number(n);
  if (!Number.isFinite(num)) return fallback;
  return new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(num);
}
function percent(part, total) { if (!Number.isFinite(part) || !Number.isFinite(total) || total <= 0) return 0; return Math.round((part / total) * 100); }
function statusFromPercent(p) { if (p >= 90) return { label: 'Stable', tone: 'good' }; if (p >= 60) return { label: 'Attention', tone: 'warn' }; return { label: 'Critical', tone: 'bad' }; }

/* ------------------------------- Data ------------------------------------- */
const HEADLINES = [
  { label: 'Villages Affected', value: 196, icon: 'droplet' },
  { label: 'Population Affected', value: 136105, icon: 'users' },
  { label: 'Human Lives Lost', value: 8, icon: 'skull' },
  { label: 'Breaches (Ravi+Sakki)', value: 34, icon: 'pin' },
];

const PSPCL = [
  { d: 'Sep 05', restored: 25 }, { d: 'Sep 06', restored: 53 }, { d: 'Sep 07', restored: 56 },
  { d: 'Sep 08', restored: 74 }, { d: 'Sep 09', restored: 74 }, { d: 'Sep 10', restored: 75 },
  { d: 'Sep 11', restored: 75 }, { d: 'Sep 12', restored: 75 }, { d: 'Sep 13', restored: 75 },
];

const PATIENTS = [
  { d: 'Sep 05', patients: 959 }, { d: 'Sep 06', patients: 915 }, { d: 'Sep 07', patients: 540 },
  { d: 'Sep 08', patients: 632 }, { d: 'Sep 09', patients: 211 },
];

const WATER = {
  dates: ['Sep 5','Sep 6','Sep 7','Sep 8','Sep 9','Sep 10','Sep 11','Sep 12','Sep 13','Sep 14'],
  affected: [72,68,66,65,64,62,60,60,59,58],
  restored: [20,22,25,28,30,32,34,36,38,40],
};

/* ------------------------------ UI bits ----------------------------------- */
function Icon({ name }) {
  const common = { width: 20, height: 20, fill: 'none', stroke: 'currentColor', strokeWidth: 2 };
  switch (name) {
    case 'droplet': return <svg {...common} viewBox="0 0 24 24"><path d="M12 2s7 8.14 7 12a7 7 0 1 1-14 0c0-3.86 7-12 7-12"/></svg>;
    case 'users':   return <svg {...common} viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case 'skull':   return <svg {...common} viewBox="0 0 24 24"><path d="M12 2a9 9 0 0 0-9 9c0 3.09 1.64 5.79 4.09 7.28L7 22h10l-.09-3.72A8.99 8.99 0 0 0 21 11a9 9 0 0 0-9-9Z"/><circle cx="8.5" cy="11.5" r="1.5"/><circle cx="15.5" cy="11.5" r="1.5"/><path d="M8 17h8"/></svg>;
    case 'pin':     return <svg {...common} viewBox="0 0 24 24"><path d="M12 22s7-4.5 7-11a7 7 0 0 0-14 0c0 6.5 7 11 7 11Z"/><circle cx="12" cy="11" r="3"/></svg>;
    case 'chart':   return <svg {...common} viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M7 16l4-4 3 3 4-6"/></svg>;
    default:        return null;
  }
}

function KPI({ item }) {
  return (
    <div className="kpi">
      <div className="kpi-icon"><Icon name={item.icon} /></div>
      <div className="kpi-value">{fmt(item.value)}</div>
      <div className="kpi-label">{item.label}</div>
    </div>
  );
}

function StatusPill({ tone, children }) { return <span className={`pill ${tone}`}>{children}</span>; }

function StatCard({ title, primary, facts }) {
  const p = percent(primary.part, primary.total);
  const { label, tone } = statusFromPercent(p);
  return (
    <div className="stat-card">
      <div className="stat-head">
        <div className="stat-title">{title}</div>
        <StatusPill tone={tone}>{label}</StatusPill>
      </div>
      <div className="stat-main">
        <div className="stat-big">{fmt(primary.part)}<span className="stat-small">/{fmt(primary.total)}</span></div>
        <div className="stat-sub">{primary.label}</div>
        <div className="stat-bar"><div className="stat-fill" style={{ width: `${p}%` }} /></div>
      </div>
      <ul className="stat-facts">{facts.map((f, i) => <li key={i}>{f}</li>)}</ul>
    </div>
  );
}

/* --------------------------- Charts (pure SVG) ----------------------------- */
function YScale(domainMax, h, top = 10, bottom = 24) { const innerH = h - top - bottom; return v => top + (1 - (v / (domainMax || 1))) * innerH; }
function XScale(n, w, left = 36, right = 12) { const innerW = w - left - right; return i => left + (i * (innerW / Math.max(1, n - 1))); }

function ChartCard({ title, subtitle, children, legend }) {
  return (
    <div className="chart-card">
      <div className="chart-head">
        <div className="chart-title">{title}</div>
        {subtitle ? <div className="chart-sub">{subtitle}</div> : null}
      </div>
      <div className="chart-body">{children}</div>
      {legend?.length ? (
        <div className="chart-legend">
          {legend.map((l, i) => <div key={i} className="legend-row"><span className={`swatch ${l.className || ''}`} />{l.label}</div>)}
        </div>
      ) : null}
    </div>
  );
}

function LineChartPower() {
  const data = PSPCL; const target = 56; const W = 460, H = 190;
  const x = XScale(data.length, W); const y = YScale(Math.max(target, ...data.map(d => d.restored)), H);
  const pts = data.map((d, i) => `${x(i)},${y(d.restored)}`).join(' ');
  const ticks = [0, target / 3, (2 * target) / 3, target];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="svgChart" role="img" aria-label="Power restoration line chart">
      {ticks.map((t, i) => { const yy = y(t); return <g key={i}><line x1="36" x2={W-12} y1={yy} y2={yy} className="gridline" /><text x="30" y={yy+3} className="tick">{Math.round(t)}</text></g>; })}
      {data.map((d, i) => <text key={i} x={x(i)} y={H-2} className="xtick" transform={`rotate(-35 ${x(i)} ${H-2})`}>{d.d}</text>)}
      <line x1="36" x2={W-12} y1={y(target)} y2={y(target)} className="ref" />
      <polyline points={pts} className="line" />
      {data.map((d, i) => <circle key={i} cx={x(i)} cy={y(d.restored)} r="3" className="marker" />)}
    </svg>
  );
}

function BarChartPatients() {
  const data = PATIENTS; const W = 460, H = 190;
  const left = 36, right = 12, top = 10, bottom = 24; const innerW = W - left - right; const bw = innerW / data.length - 8;
  const y = YScale(Math.max(...data.map(d => d.patients)), H, top, bottom);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="svgChart" role="img" aria-label="Patients attended bar chart">
      {[0, 0.33, 0.66, 1].map((f, i) => { const val = f * Math.max(...data.map(d => d.patients)); const yy = y(val); return <g key={i}><line x1="36" x2={W-12} y1={yy} y2={yy} className="gridline" /><text x="30" y={yy+3} className="tick">{Math.round(val)}</text></g>; })}
      {data.map((d, i) => { const x = left + i * (innerW / data.length) + 4; return (
        <g key={i}>
          <rect x={x} width={bw} y={y(d.patients)} height={H - 24 - y(d.patients)} className="barA" />
          <text x={x + bw / 2} y={H - 2} className="xtick" transform={`rotate(-35 ${x + bw / 2} ${H - 2})`}>{d.d}</text>
        </g>
      ); })}
    </svg>
  );
}

function ComboChartWater() {
  const { dates, affected, restored } = WATER;
  const W = 460, H = 190; const left = 36, right = 12, top = 10, bottom = 24; const innerW = W - left - right; const step = innerW / dates.length; const bw = (step - 8) / 2;
  const maxVal = Math.max(...affected, ...restored); const y = YScale(maxVal, H, top, bottom);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="svgChart" role="img" aria-label="Water schemes affected vs villages restored">
      {[0, 0.33, 0.66, 1].map((f, i) => { const val = Math.round(f * maxVal); const yy = y(val); return <g key={i}><line x1="36" x2={W-12} y1={yy} y2={yy} className="gridline" /><text x="30" y={yy+3} className="tick">{val}</text></g>; })}
      {dates.map((d, i) => { const x0 = left + i * step + 3; return (
        <g key={i}>
          <rect x={x0} y={y(affected[i])} width={bw} height={H - 24 - y(affected[i])} className="barA" />
          <rect x={x0 + bw + 6} y={y(restored[i])} width={bw} height={H - 24 - y(restored[i])} className="barB" />
          <text x={x0 + step / 2} y={H - 2} className="xtick" transform={`rotate(-35 ${x0 + step / 2} ${H - 2})`}>{d}</text>
        </g>
      ); })}
    </svg>
  );
}

function Dashboard() {
  return (
    <div className="charts-grid">
      <ChartCard title="Power Supply Restoration (Villages)" legend={[{ label: 'Villages with Power Restored', className: 'lgA' }, { label: 'Target', className: 'lgRef' }]}><LineChartPower /></ChartCard>
      <ChartCard title="Medical Relief — Patients Attended" legend={[{ label: 'Patients (per day)', className: 'lgB' }]}><BarChartPatients /></ChartCard>
      <ChartCard title="Water Supply — Schemes Affected vs Villages Restored" legend={[{ label: 'Schemes Affected', className: 'lgA' }, { label: 'Villages Restored', className: 'lgB' }]}><ComboChartWater /></ChartCard>
      <div className="chart-note">Figures are operational and subject to validation.</div>
    </div>
  );
}

/* ------------------------- Images & Lightbox ------------------------------- */
function SafeImg({ src, alt, ...rest }) {
  const [s, setS] = React.useState(src);
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => { setS(src); setFailed(false); }, [src]);
  if (failed) {
    return (
      <div className="ph">
        <div className="ph-cap">{alt || 'Image unavailable'}</div>
      </div>
    );
  }
  return (
    <img
      src={s}
      alt={alt}
      onError={() => {
        if (s.includes('%20')) setS(s.replace(/%20/g, ' '));
        else if (s.includes(' ')) setS(s.replace(/ /g, '%20'));
        else setFailed(true);
      }}
      {...rest}
    />
  );
}

function FloodGallery({ images }) {
  const [open, setOpen] = React.useState(false); const [idx, setIdx] = React.useState(0);
  const openAt = (i) => { setIdx(i); setOpen(true); };
  const close = (e) => { e?.stopPropagation?.(); setOpen(false); };
  const prev = (e) => { e?.stopPropagation?.(); setIdx(i => (i + images.length - 1) % images.length); };
  const next = (e) => { e?.stopPropagation?.(); setIdx(i => (i + 1) % images.length); };
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  return (
    <div className="card" id="flood-gallery">
      <div className="card-title"><Icon name="pin" /> Flood Situation Gallery</div>
      <div className="muted">Click a tile to expand. Use ←/→, Esc to close.</div>
      <div className="gallery">
        {images.map((img, i) => (
          <figure key={i} className="thumb" style={{ cursor: 'zoom-in' }} onClick={() => openAt(i)}>
            <SafeImg src={img.src} alt={img.caption} />
            <figcaption>{img.caption}</figcaption>
          </figure>
        ))}
      </div>
      <div className={`lightbox ${open ? 'open' : ''}`} role="dialog" aria-modal="true" onClick={close}>
        <button type="button" className="lb-close" aria-label="Close" onClick={close}>×</button>
        <button type="button" className="lb-nav prev" aria-label="Previous" onClick={prev}>‹</button>
        <div className="lb-stage" onClick={(e) => e.stopPropagation()}>
          <SafeImg src={images[idx].src} alt={images[idx].caption} />
          <div className="lb-cap">{images[idx].caption}</div>
        </div>
        <button type="button" className="lb-nav next" aria-label="Next" onClick={next}>›</button>
      </div>
    </div>
  );
}

/* -------------------------------- Page ------------------------------------ */
export default function PunjabFloodReliefPage() {
  return (
    <div className="page">
      <style>{`
        :root{
          /* Official green palette (non-blue) */
          --gov-900:#0f3d27;  /* deep header/brand */
          --gov-800:#155b2a;
          --gov-700:#1a7f49;
          --gov-600:#23995a;
          --gov-50:#eef7f0;
          --ink:#0a0f1a;
          --muted:#5a665f;
          --ring:#d7eadc;
          --card:#ffffff;
          --shadow:0 6px 20px rgba(10, 61, 39, .12);
          --good:var(--gov-600); --warn:#b58900; --bad:#8b1a1a;
        }
        *{box-sizing:border-box}
        html,body,#__next,.page{height:100%}
        body{margin:0}
        .page{font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Inter, Arial; color:var(--ink); background:#fff;}

        /* Full-width bands to feel like a complete page */
        .band{width:100%; padding:24px 0}
        .band.alt{background:var(--gov-50); border-top:1px solid var(--ring); border-bottom:1px solid var(--ring)}
        .content{max-width:1400px; margin:0 auto; padding:0 24px}

        /* Header (no image) */
        .hero{padding:28px 0 8px; text-align:center}
        .title{font-weight:900; letter-spacing:.2px; color:var(--gov-900); font-size:40px}
        .lede{max-width:1000px; margin:12px auto 0; padding:14px 16px; border-radius:14px; background:#fff; color:#183c2b; border:1px solid var(--ring); box-shadow:var(--shadow)}

        .ctas{display:flex; justify-content:center; gap:12px; margin:16px 0 6px}
        .btn{display:inline-flex; align-items:center; gap:8px; border-radius:999px; padding:10px 18px; font-weight:700; border:1px solid var(--ring); background:#fff; color:var(--gov-900)}
        .btn.primary{background:var(--gov-900); color:#fff; border-color:transparent; box-shadow:var(--shadow)}
        .sub-link{font-size:14px; color:var(--gov-900); text-decoration:underline}
        .divider{height:1px;background:#e1efe5;margin:18px 0}

        /* Cards / layout */
        .card{background:var(--card); border:1px solid var(--ring); border-radius:18px; padding:16px; box-shadow:var(--shadow); margin-top:14px}
        .card-title{font-weight:800;color:var(--gov-900);display:flex;align-items:center;gap:8px}
        .muted{color:var(--muted); margin-top:4px}

        /* KPIs */
        .grid{display:grid; gap:16px}
        .grid.kpi{grid-template-columns:repeat(4, minmax(0,1fr))}
        @media (max-width:1000px){.grid.kpi{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media (max-width:520px){.grid.kpi{grid-template-columns:1fr}}
        .kpi{background:#fff;border:1px solid var(--ring);border-radius:14px;padding:16px;text-align:center;box-shadow:var(--shadow);position:relative;border-top:4px solid transparent}
        .grid.kpi > .kpi:nth-child(1){border-top-color:var(--gov-900)}
        .grid.kpi > .kpi:nth-child(2){border-top-color:var(--gov-800)}
        .grid.kpi > .kpi:nth-child(3){border-top-color:var(--gov-700)}
        .grid.kpi > .kpi:nth-child(4){border-top-color:var(--gov-600)}
        .kpi-icon{width:40px;height:40px;border-radius:20px;background:var(--gov-50);color:var(--gov-900);display:grid;place-items:center;margin:0 auto}
        .kpi-value{font-size:28px;font-weight:900;color:var(--gov-900);margin-top:8px}
        .kpi-label{text-transform:uppercase;letter-spacing:.6px;color:var(--muted);font-size:12px;margin-top:2px}

        /* Two-column info after overview to fill space */
        .info-grid{display:grid; gap:16px; grid-template-columns:2fr 1fr}
        @media (max-width:1000px){.info-grid{grid-template-columns:1fr}}
        .list{margin:10px 0 0 18px;color:#1f2d24}
        .list li{margin:6px 0}

        /* Stats cards (optional, for future) */
        .stat-card{background:#fff;border:1px solid var(--ring);border-radius:16px;padding:14px;box-shadow:var(--shadow)}
        .stat-head{display:flex;justify-content:space-between;align-items:center}
        .stat-title{font-weight:800;color:#1d2d24}
        .pill{padding:4px 10px;border-radius:999px;font-size:12px;color:#fff}
        .pill.good{background:var(--good)} .pill.warn{background:var(--warn)} .pill.bad{background:var(--bad)}
        .stat-big{font-size:26px;font-weight:900;color:var(--gov-900)} .stat-small{font-size:12px;color:var(--muted);margin-left:6px}
        .stat-sub{font-size:12px;color:#405448;margin-top:2px}
        .stat-bar{height:8px;background:#edf6ef;border-radius:6px;overflow:hidden;border:1px solid var(--ring);margin-top:8px}
        .stat-fill{height:8px;background:linear-gradient(90deg,var(--gov-700), var(--gov-900))}
        .stat-facts{margin:8px 0 0 18px;color:#1f2d24}
        .stat-facts li{margin:4px 0}

        /* Charts */
        .charts-grid{display:grid;gap:16px;grid-template-columns:repeat(3,minmax(0,1fr))}
        @media (max-width:1300px){.charts-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media (max-width:820px){.charts-grid{grid-template-columns:1fr}}
        .chart-card{background:#fff;border:1px solid var(--ring);border-radius:16px;box-shadow:var(--shadow);padding:12px;display:flex;flex-direction:column}
        .chart-head{padding:4px 6px 8px}
        .chart-title{font-weight:800;color:#1d2d24}
        .chart-sub{font-size:12px;color:var(--muted)}
        .chart-body{padding:0 4px}
        .chart-legend{display:flex;gap:16px;flex-wrap:wrap;padding:8px 6px 4px;color:#1f2d24}
        .legend-row{display:flex;align-items:center;gap:6px;font-size:12px}
        .swatch{width:12px;height:12px;border-radius:3px;display:inline-block;background:var(--gov-600)}
        .swatch.lgRef{background:transparent;border:2px dashed var(--gov-700);width:18px;height:10px;border-radius:6px}
        .swatch.lgA{background:rgba(26,127,73,.65)}
        .swatch.lgB{background:rgba(26,127,73,.25);border:1px solid rgba(26,127,73,.35)}
        .chart-note{grid-column:1/-1;font-size:12px;color:var(--muted);margin-top:-4px}
        .svgChart{width:100%;height:auto}
        .gridline{stroke:#e5efe8;stroke-width:1}
        .tick,.xtick{font-size:10px;fill:#5a665f;text-anchor:end}
        .ref{stroke:var(--gov-700);stroke-dasharray:4 4;opacity:.7}
        .line{fill:none;stroke:var(--gov-800);stroke-width:2}
        .marker{fill:#fff;stroke:var(--gov-800);stroke-width:2}
        .barA{fill:rgba(26,127,73,.65)}
        .barB{fill:rgba(26,127,73,.25);stroke:rgba(26,127,73,.35);stroke-width:1}

        /* Gallery */
        .gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:10px}
        @media (min-width:900px){.gallery{grid-template-columns:repeat(4,minmax(0,1fr))}}
        .thumb{display:block;border:1px solid var(--ring);border-radius:12px;overflow:hidden;background:#fff;color:inherit;text-decoration:none;box-shadow:var(--shadow)}
        .thumb img{display:block;width:100%;height:160px;object-fit:cover}
        .thumb figcaption{font-size:12px;padding:8px 10px;color:var(--gov-900)}
        .lightbox{position:fixed;inset:0;background:rgba(12,25,18,.6);display:none;align-items:center;justify-content:center;z-index:60}
        .lightbox.open{display:flex}
        .lb-stage{max-width:90vw;max-height:85vh;display:flex;flex-direction:column;align-items:center;gap:10px}
        .lb-stage img{max-width:90vw;max-height:75vh;object-fit:contain;border-radius:12px;border:1px solid var(--ring);background:#fff;box-shadow:var(--shadow)}
        .lb-cap{color:#e9f5ec;background:rgba(255,255,255,.06);backdrop-filter:saturate(1.1) blur(2px);padding:6px 10px;border-radius:8px;border:1px solid rgba(215,234,220,.3)}
        .lb-close,.lb-nav{background:#fff;border:1px solid var(--ring);border-radius:999px;box-shadow:var(--shadow);color:var(--gov-900);cursor:pointer}
        .lb-close{position:absolute;top:14px;right:16px;width:36px;height:36px;font-size:22px;line-height:1}
        .lb-nav{position:absolute;top:50%;transform:translateY(-50%);width:40px;height:40px;font-size:22px;line-height:1}
        .lb-nav.prev{left:18px} .lb-nav.next{right:18px}
        .lb-nav:hover,.lb-close:hover{opacity:.9}
        /* Placeholder when image missing */
        .ph{display:grid;place-items:center;width:100%;height:160px;background:linear-gradient(135deg,#edf6ef,#e2f1e6);border:1px dashed var(--ring)}
        .ph-cap{font-size:12px;color:#2e4a3b}

        /* Footer */
        .footer{background:var(--gov-900);color:#d8e9de;text-align:center;padding:16px;margin-top:22px;border-top:4px solid var(--gov-800)}
      `}</style>

      {/* ===== BAND: Header ===== */}
      <section className="band">
        <div className="content hero">
          <div className="title">PUNJAB FLOOD RELIEF</div>
          <p className="lede">
            Heavy monsoon rains caused localised flooding in riverine belts. This portal provides verified updates,
            response metrics, and secure channels for NGOs to collaborate with district authorities.
          </p>
          <div className="ctas">
            <a className="btn primary" href="#cta" aria-label="See what you can do">SEE WHAT YOU CAN DO →</a>
            <a className="sub-link" href="#dashboard" aria-label="View dashboard">View dashboard</a>
          </div>
        </div>
      </section>

      {/* ===== BAND: KPIs ===== */}
      <section className="band alt">
        <div className="content">
          <div className="grid kpi">
            {HEADLINES.map((h, i) => <KPI key={i} item={h} />)}
          </div>
        </div>
      </section>

      {/* ===== BAND: Overview & Actions (fills page, no map) ===== */}
      <section className="band">
        <div className="content">
          <div className="info-grid">
            <div className="card">
              <div className="card-title">Overview</div>
              <ul className="list">
                <li>Standing water reported in low-lying villages; crop damage and intermittent road closures.</li>
                <li>Core priorities: power restoration, potable water, temporary shelter, medical & veterinary outreach.</li>
                <li>Data compiled from district situation reports and NRSC/ISRO references (Aug 27–28, 2025).</li>
              </ul>
            </div>
            <div className="card">
              <div className="card-title">Helplines & Coordination</div>
              <ul className="list">
                <li><strong>State Control Room:</strong> 1070 (24×7)</li>
                <li><strong>District Helpline:</strong> 112 (Emergency)</li>
                <li><strong>Relief & Shelter:</strong> Contact BDPO / Tehsildar, nearest SDO (PWD/Water Supply).</li>
                <li><strong>Health:</strong> Mobile medical units; ambulance 108; preventive kits at sub-centres.</li>
              </ul>
            </div>
          </div>

          <div className="info-grid" style={{ marginTop: 16 }}>
            <div className="card">
              <div className="card-title"><Icon name="chart" /> Key Government Actions (Recent)</div>
              <ul className="list">
                <li>Electricity restored in all urban pockets; remaining rural habitations through phased backfeed.</li>
                <li>Bleaching powder & chlorine tablets issued to panchayats; de-watering pumps deployed.</li>
                <li>Veterinary relief camps conducted; fodder stock placement with BDPOs.</li>
                <li>Damage assessment ongoing for crops, link roads and public assets.</li>
              </ul>
            </div>
            <div className="card">
              <div className="card-title">How You Can Help</div>
              <ul className="list">
                <li>Support kits: dry ration, hygiene, ORS, tarpaulins, sleeping mats, blankets.</li>
                <li>Medical & WASH: water purification units, portable toilets, cleaning tools.</li>
                <li>Logistics: last-mile distribution to cut-off pockets in consultation with DC office.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BAND: Gallery ===== */}
      <section className="band alt">
        <div className="content">
          <div className="card" id="gallery">
            <div className="card-title"><Icon name="pin" /> Flood Situation Gallery</div>
            <div className="muted">Click a tile to expand. Use ←/→, Esc to close.</div>
            <FloodGallery images={[
              { src: "/floods/flood%20images_page-0001.jpg", caption: "Flood situation image 1" },
              { src: "/floods/flood%20images_page-0002.jpg", caption: "Flood situation image 2" },
              { src: "/floods/flood%20images_page-0003.jpg", caption: "Flood situation image 3" },
              { src: "/floods/flood%20images_page-0004.jpg", caption: "Flood situation image 4" },
            ]} />
          </div>
        </div>
      </section>

      {/* ===== BAND: Dashboard ===== */}
      <section className="band">
        <div className="content">
          <div id="dashboard" className="card" style={{ paddingTop: 12 }}>
            <div className="card-title">Operational Dashboard</div>
            <div className="muted">Daily progress indicators (illustrative; align with official time-series).</div>
            <Dashboard />
          </div>
        </div>
      </section>

      {/* ===== BAND: NGO CTA ===== */}
      <section className="band alt" id="cta">
        <div className="content">
          <div className="card">
            <div className="card-title">For Interested NGOs (Official Coordination)</div>
            <div className="muted">Register support for water & sanitation, shelter, health, animal care and logistics. Coordinate with the District Control Room before deployment.</div>
            <div className="ctas" style={{ marginTop: 12 }}>
              <a className="btn primary" href="/ngo/login">Sign In / Register</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">© {new Date().getFullYear()} Punjab Flood Relief — Official</footer>
    </div>
  );
}
