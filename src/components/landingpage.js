// src/components/landingpage.js
// Plain React + inline styles, no Tailwind
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ===================== Palette & shared styles ===================== */
const PALETTE = {
  page: "#f3eee6",
  band: "#e6decf",
  card: "#ffffff",
  border: "#e7e3db",
  text: "#171717",
  textSub: "#6b7280",
  dark: "#252323",
  warm: "#a99985",
};

const S = {
  page: {
    minHeight: "100vh",
    background: PALETTE.page,
    color: PALETTE.text,
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
    display: "flex",
    flexDirection: "column",
  },

  /* header with logo on the left */
  headerBand: { padding: "8px 0", borderBottom: `1px solid ${PALETTE.border}`, background: "#fff" },
  headerRow: { maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 12 },
  logoBox: { width: 44, height: 44, borderRadius: 12, overflow: "hidden", border: `1px solid ${PALETTE.border}`, background: "#fff", display: "grid", placeItems: "center" },
  logoImg: { width: "100%", height: "100%", objectFit: "cover" },

  /* hero */
  band: { padding: "16px 0" },
  bandAlt: { padding: "16px 0", background: PALETTE.band, borderTop: `1px solid ${PALETTE.border}`, borderBottom: `1px solid ${PALETTE.border}` },
  content: { maxWidth: 1200, margin: "0 auto", padding: "0 24px" },
  heroWrap: { textAlign: "center", padding: "18px 0 8px" },
  title: { fontSize: 34, margin: 0, fontWeight: 900, color: PALETTE.dark },
  sub1: { margin: "6px 0 2px", fontSize: 18, fontWeight: 800, color: PALETTE.dark },
  sub2: { margin: 0, fontSize: 13, color: PALETTE.textSub },
  lede: {
    maxWidth: 900,
    margin: "14px auto 0",
    padding: "14px 16px",
    borderRadius: 14,
    background: "#fff",
    color: PALETTE.dark,
    border: `1px solid ${PALETTE.border}`,
    boxShadow: "0 6px 20px rgba(0,0,0,.06)",
  },
  ctas: { display: "flex", justifyContent: "center", gap: 12, marginTop: 12 },
  primary: { padding: "10px 14px", borderRadius: 12, border: "none", background: PALETTE.dark, color: "#fff", cursor: "pointer", fontWeight: 700 },
  secondary: { padding: "10px 14px", borderRadius: 12, border: `1px solid ${PALETTE.border}`, background: "#fff", cursor: "pointer", fontWeight: 700 },

  /* cards, gallery */
  card: { background: "#fff", border: `1px solid ${PALETTE.border}`, borderRadius: 16, padding: 16, boxShadow: "0 1px 6px rgba(0,0,0,.06)" },
  cardTitle: { fontWeight: 800, color: PALETTE.dark, marginBottom: 6 },
  muted: { color: PALETTE.textSub },

  galleryGrid: { display: "grid", gap: 12, gridTemplateColumns: "repeat(2,minmax(0,1fr))" },
  thumb: { display: "block", border: `1px solid ${PALETTE.border}`, borderRadius: 12, overflow: "hidden", background: "#fff", textDecoration: "none", color: "inherit", boxShadow: "0 1px 6px rgba(0,0,0,.06)" },
  thumbImg: { display: "block", width: "100%", height: 160, objectFit: "cover" },
  thumbCap: { fontSize: 12, padding: "8px 10px", color: PALETTE.dark },

  /* map + list */
  svgBoard: { width: "100%", height: 420, borderRadius: 12, border: `1px solid ${PALETTE.border}`, background: "#fff", boxShadow: "0 1px 6px rgba(0,0,0,.06)" },
  tooltip: { position: "absolute", padding: "6px 8px", background: "rgba(255,255,255,.95)", border: `1px solid ${PALETTE.border}`, borderRadius: 8, boxShadow: "0 4px 14px rgba(0,0,0,.08)", pointerEvents: "none", fontSize: 12, color: PALETTE.dark },
  filters: { display: "grid", gap: 10, gridTemplateColumns: "2fr 1fr", marginTop: 12 },
  input: { width: "100%", padding: "10px 12px", borderRadius: 12, border: `1px solid ${PALETTE.border}` },
  select: { width: "100%", padding: "10px 12px", borderRadius: 12, border: `1px solid ${PALETTE.border}` },
  tableCard: { background: "#fff", border: `1px solid ${PALETTE.border}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,.06)" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  thead: { background: "#f6f4f0", color: "#475569" },
  th: { textAlign: "left", padding: "10px 12px" },
  td: { padding: "10px 12px", borderTop: `1px solid #f1efe9`, verticalAlign: "top" },

  footer: { background: PALETTE.dark, color: "#f0ede9", textAlign: "center", padding: 16, borderTop: `4px solid ${PALETTE.warm}`, marginTop: 24 },

  /* small list styling so your ULs look tidy */
  list: { margin: "10px 0 0 18px", color: PALETTE.dark },
};

/* ======================= Image helpers (gallery) ===================== */
function toPublicUrl(input) {
  if (!input) return input;
  let s = String(input).replace(/\\/g, "/").trim();
  if (/^(https?:)?\/\//i.test(s) || s.startsWith("data:")) return s;
  if (s.startsWith("/")) return encodeURI(s);
  s = s.replace(/^public\//, "");
  return encodeURI("/" + s);
}

function SafeImg({ src, alt, style }) {
  const [url, setUrl] = useState(toPublicUrl(src));
  const [failed, setFailed] = useState(false);
  useEffect(() => { setUrl(toPublicUrl(src)); setFailed(false); }, [src]);
  if (failed) {
    return (
      <div style={{ ...S.thumbImg, display: "grid", placeItems: "center", background: "linear-gradient(135deg,#f5f1ed,#ebe5dc)", color: "#444", border: `1px dashed ${PALETTE.border}` }}>
        <span style={{ fontSize: 12 }}>{alt || "Image unavailable"}</span>
      </div>
    );
  }
  return (
    <img
      src={url}
      alt={alt}
      style={{ ...S.thumbImg, ...style }}
      onError={() => {
        const m = url.match(/\.(jpg|jpeg|png|webp)$/i);
        if (m) {
          const ext = m[0];
          const flipped = ext === ext.toLowerCase() ? ext.toUpperCase() : ext.toLowerCase();
          const altUrl = url.slice(0, -ext.length) + flipped;
          if (altUrl !== url) { setUrl(altUrl); return; }
        }
        setFailed(true);
      }}
    />
  );
}

/* ==================== Villages loader + layout (JSON) ==================== */
/** slug helper for stable ids */
function slug(tehsil, name) {
  return `amr-${String(tehsil).toLowerCase().replace(/\s+/g, "-")}-${String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

/** Lay out villages into vertical “lanes” per tehsil across the SVG. */
function layoutVillages(rawByTehsil) {
  const keys = Object.keys(rawByTehsil || {});
  if (!keys.length) return [];

  // Preferred order if present, otherwise append any others
  const pref = ["Ajnala", "Ramdas", "Rajasansi", "Lopoke", "Baba Bakala Sahib"];
  const columns = [
    ...pref.filter((k) => keys.includes(k)),
    ...keys.filter((k) => !pref.includes(k)),
  ];

  // Compute X per column (evenly spaced)
  const W = 700, left = 90, right = 90;
  const innerW = Math.max(0, W - left - right);
  const n = columns.length;
  const xAt = (i) => (n === 1 ? left + innerW / 2 : left + (innerW * i) / (n - 1));

  // Vertical placement
  const yStart = 60, yStep = 16, yMax = 360, laneOffset = 24;

  const out = [];
  columns.forEach((t, i) => {
    const names = (rawByTehsil[t] || []).filter(Boolean);
    let x = xAt(i);
    let y = yStart;
    names.forEach((name) => {
      out.push({ id: slug(t, name), village: name, tehsil: t, x, y });
      y += yStep;
      if (y > yMax) { // start a new lane to the right for this tehsil
        y = yStart;
        x += laneOffset;
      }
    });
  });

  return out;
}

/** Fetch villages JSON from /public/data/amritsar_villages.json (robust for gh-pages) */
function useVillages() {
  const [raw, setRaw] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isAlive = true;

    const pub = (process.env.PUBLIC_URL || "").replace(/\/+$/, "");
    const baseFromTag = (document.querySelector("base")?.getAttribute("href") || "").replace(/\/+$/, "");

    const candidates = [
      "data/amritsar_villages.json",
      `${pub}/data/amritsar_villages.json`,
      baseFromTag ? `${baseFromTag}/data/amritsar_villages.json` : null,
      `${window.location.origin}${pub}/data/amritsar_villages.json`,
    ].filter(Boolean).map(u => u.replace(/([^:]\/)\/+/g, "$1"));

    (async () => {
      let lastErr = null;
      for (const url of candidates) {
        try {
          const res = await fetch(url, { cache: "no-cache" });
          if (!res.ok) throw new Error(`HTTP ${res.status} at ${url}`);
          const json = await res.json();
          if (isAlive) { setRaw(json); setError(null); }
          return;
        } catch (e) { lastErr = e; }
      }
      if (isAlive) setError(lastErr || new Error("Failed to load villages JSON"));
    })();

    return () => { isAlive = false; };
  }, []);

  const villages = useMemo(() => layoutVillages(raw || {}), [raw]);
  const tehsils = useMemo(() => Object.keys(raw || {}), [raw]);

  return { villages, tehsils, error, isReady: !!raw };
}

/* =============================== Component =============================== */
export default function LandingPage() {
  const navigate = useNavigate();

  // logo on the left
  const logoSrc = "/logo punjab.png";

  // Load villages from JSON
  const { villages: VILLAGES, tehsils: TEHSIL_LIST, error, isReady } = useVillages();

  // Map/List state
  const [hoverPt, setHoverPt] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const [tehsil, setTehsil] = useState("All");

  // Tehsil options depend on loaded data
  const tehsils = useMemo(
    () => ["All", ...TEHSIL_LIST],
    [TEHSIL_LIST]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VILLAGES.filter((v) => {
      const matchesQ = !q || v.village.toLowerCase().includes(q) || v.tehsil.toLowerCase().includes(q);
      const matchesT = tehsil === "All" || v.tehsil === tehsil;
      return matchesQ && matchesT;
    });
  }, [VILLAGES, query, tehsil]);

  useEffect(() => {
    if (!selectedId) return;
    const el = document.getElementById(`row-${selectedId}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selectedId]);

  return (
    <div style={S.page}>
      {/* top bar with logo */}
      <section style={S.headerBand}>
        <div style={S.headerRow}>
          <div style={S.logoBox}>
            <img src={toPublicUrl(logoSrc)} alt="Amritsar Flood Relief" style={S.logoImg} />
          </div>
          <div style={{ fontWeight: 700, color: PALETTE.textSub }}>Official Portal</div>
        </div>
      </section>

      {/* hero */}
      <section style={S.band}>
        <div style={{ ...S.content, ...S.heroWrap }}>
          <h1 style={S.title}>AMRITSAR FLOOD RELIEF</h1>
          <div style={S.sub1}>Saanjha Uprala</div>
          <p style={S.sub2}>A Joint Initiative by District Administration, Amritsar and Organisations</p>

          <p style={S.lede}>
            Heavy monsoon rains caused localised flooding in riverine belts. This portal provides
            verified updates, response metrics, and secure channels for NGOs to collaborate with
            district authorities.
          </p>

          <div style={S.ctas}>
            {/* scroll to CTA at the end */}
            <a href="#cta" style={S.primary}>SEE WHAT YOU CAN DO →</a>
          </div>
        </div>
      </section>

      {/* single gallery */}
      <section style={S.band}>
        <div style={S.content}>
          <div style={S.card}>
            <div style={S.cardTitle}>Flood Situation Gallery</div>
            <div style={S.muted}>Images read from <code>/public/floods/</code>.</div>
            <div style={S.galleryGrid}>
              <figure style={S.thumb}>
                <SafeImg src="public/floods/flood images_page-0001.jpg" alt="Flood situation image 1" />
                <figcaption style={S.thumbCap}>Flood situation image 1</figcaption>
              </figure>
              <figure style={S.thumb}>
                <SafeImg src="public/floods/flood images_page-0002.jpg" alt="Flood situation image 2" />
                <figcaption style={S.thumbCap}>Flood situation image 2</figcaption>
              </figure>
              <figure style={S.thumb}>
                <SafeImg src="public/floods/flood images_page-0003.jpg" alt="Flood situation image 3" />
                <figcaption style={S.thumbCap}>Flood situation image 3</figcaption>
              </figure>
              <figure style={S.thumb}>
                <SafeImg src="public/floods/flood images_page-0004.jpg" alt="Flood situation image 4" />
                <figcaption style={S.thumbCap}>Flood situation image 4</figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BAND: Overview, Actions, Helplines, What You Can Do ===== */}
      <section style={S.band}>
        <div style={S.content}>
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "2fr 1fr" }}>
            {/* Overview */}
            <div style={S.card}>
              <div style={S.cardTitle}>Overview</div>
              <p>
                Heavy and sustained rainfall, along with overflows from the Ravi River and Sakki
                Nallah, caused significant flooding across the border districts of Amritsar. The
                disaster affected 196 villages, impacting over 136,000 people. The report confirms
                8 human lives were lost and multiple breaches in the river and nullah embankments.
                The primary focus of the government's response has been on restoring essential
                services and providing immediate relief to the most vulnerable areas.
              </p>
            </div>

            {/* Helplines */}
            <div style={S.card}>
              <div style={S.cardTitle}>Flood Control Helplines</div>
              <ul style={S.list}>
                <li><strong>Amritsar District Control Room:</strong> 0183-2229125</li>
                <li><strong>Ajnala Tehsil Helpline:</strong> 01858-245510</li>
                <li><strong>NDRF HQ:</strong> 011-24363260</li>
                <li><strong>All-India Emergency Helpline:</strong> 112</li>
              </ul>
            </div>
          </div>

          {/* Key Actions + How You Can Help */}
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "2fr 1fr", marginTop: 16 }}>
            {/* Government Actions */}
            <div style={S.card}>
              <div style={S.cardTitle}>Key Government Actions (Recent)</div>
              <ul style={S.list}>
                <li><b>Power & Water:</b> PSPCL restored electricity to all 75 affected villages; chlorination in water supplies ongoing.</li>
                <li><b>Medical Relief:</b> Health Dept set up medical camps, distributed medicines, fogging & spraying, outbreak monitoring.</li>
                <li><b>Animal Husbandry:</b> Veterinary teams treated livestock, distributed fodder; 40 dead animals buried to prevent disease.</li>
                <li><b>Shelter & Relief:</b> Relief centers opened, ration kits, ready-to-eat meals, blankets, mats distributed.</li>
              </ul>
            </div>

            {/* NGO Help */}
            <div style={S.card}>
              <div style={S.cardTitle}>How You Can Help</div>
              <ul style={S.list}>
                <li><b>Register:</b> NGOs should register their support (water, sanitation, shelter, health, animal care, logistics).</li>
                <li><b>Coordinate:</b> All activities must be routed via the District Control Room to target urgent needs.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* map + villages list (tehsil filter only) */}
      <section style={S.bandAlt}>
        <div style={S.content}>
          <div style={{ ...S.card, position: "relative" }}>
            <div style={S.cardTitle}>Affected Villages — Amritsar</div>

            {/* Loading / error states (non-intrusive, layout unchanged) */}
            {!isReady && !error && <div className="muted" style={{ marginBottom: 8, color: PALETTE.textSub }}>Loading villages…</div>}
            {error && <div style={{ color: "#b91c1c", marginBottom: 8 }}>Could not load villages (check <code>/public/data/amritsar_villages.json</code>).</div>}

            <div style={{ position: "relative" }}>
              <svg viewBox="0 0 700 420" style={S.svgBoard}>
                <rect x="0" y="0" width="700" height="420" fill="#f9f7f3" />
                <rect x="60" y="40" width="580" height="340" fill="#fff" stroke={PALETTE.border} />
                {VILLAGES.map((v) => {
                  const active = v.id === selectedId;
                  const fill = active ? "#1d4ed8" : PALETTE.warm;
                  const r = active ? 8 : 6;
                  return (
                    <g key={v.id}
                       onMouseEnter={(e) => setHoverPt({ x: e.clientX, y: e.clientY, name: v.village })}
                       onMouseLeave={() => setHoverPt(null)}
                       onClick={() => setSelectedId(v.id)}
                       style={{ cursor: "pointer" }}>
                      <circle cx={v.x} cy={v.y} r={r} fill={fill} />
                      <circle cx={v.x} cy={v.y} r={r + 3} fill="none" stroke="rgba(0,0,0,.08)" />
                    </g>
                  );
                })}
              </svg>
              {hoverPt && (
                <div style={{ ...S.tooltip, left: hoverPt.x + 10, top: hoverPt.y + 10 }}>
                  {hoverPt.name}
                </div>
              )}
            </div>

            <div style={S.filters}>
              <input
                style={S.input}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search village or tehsil…"
              />
              <select
                style={S.select}
                value={tehsil}
                onChange={(e) => setTehsil(e.target.value)}
              >
                {["All", ...TEHSIL_LIST].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={S.tableCard}>
                <table style={S.table}>
                  <thead style={S.thead}>
                    <tr>
                      <th style={S.th}>Sn No</th>
                      <th style={S.th}>Village</th>
                      <th style={S.th}>Tehsil</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length ? (
                      filtered.map((v, i) => (
                        <tr key={v.id} id={`row-${v.id}`} style={{ background: v.id === selectedId ? "#fff8ea" : "transparent" }}>
                          <td style={S.td}>{i + 1}</td>
                          <td style={{ ...S.td, fontWeight: 700 }}>{v.village}</td>
                          <td style={S.td}>{v.tehsil}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td style={{ ...S.td, color: PALETTE.textSub, textAlign: "center" }} colSpan={3}>
                          No villages match filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA target for SEE WHAT YOU CAN DO */}
      <section id="cta" style={S.band}>
        <div style={S.content}>
          <div style={S.card}>
            <div style={S.cardTitle}>For Interested NGOs (Official Coordination)</div>
            <div style={S.muted}>
              Register support for water & sanitation, shelter, health, animal care and logistics.
              Coordinate with the District Control Room before deployment.
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button style={S.primary} onClick={() => navigate("/ngo/login")}>Sign In / Register</button>
            </div>
          </div>
        </div>
      </section>

      <footer style={S.footer}>© {new Date().getFullYear()} Amritsar Flood Relief — Saanjha Uprala</footer>
    </div>
  );
}
