// src/components/dashboard.js
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const PALETTE = {
  page: "#f3eee6",
  card: "#ffffff",
  border: "#e7e3db",
  borderSoft: "#f1efe9",
  head: "#f6f4f0",
  text: "#171717",
  textSub: "#6b7280",
  textSoft: "#9ca3af",
  blue: "#1d4ed8",
  chipBg: "#eef2ff",
  chipText: "#3730a3",
};

const S = {
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    color: PALETTE.text,
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },

  kpis: {
    display: "grid",
    gap: 16,
    gridTemplateColumns: "repeat(4, minmax(0,1fr))",
    marginBottom: 12,
  },
  statCard: {
    background: PALETTE.card,
    border: `1px solid ${PALETTE.border}`,
    borderRadius: 16,
    padding: 16,
    textAlign: "center",
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
  },
  statValue: { fontSize: 24, fontWeight: 800 },
  statLabel: {
    marginTop: 6,
    fontSize: 11,
    textTransform: "uppercase",
    color: PALETTE.textSub,
  },

  controlsCard: {
    background: PALETTE.card,
    border: `1px solid ${PALETTE.border}`,
    borderRadius: 16,
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
    padding: 14,
    marginBottom: 12,
  },
  controlsGrid: {
    display: "grid",
    gap: 10,
    gridTemplateColumns: "3fr 2fr 2fr 2fr",
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#4b5563",
    marginBottom: 4,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: `1px solid ${PALETTE.border}`,
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: `1px solid ${PALETTE.border}`,
  },

  main: {
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  tableCard: {
    flex: 1,
    minHeight: 0,
    background: PALETTE.card,
    border: `1px solid ${PALETTE.border}`,
    borderRadius: 16,
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  tableScroll: { flex: 1, minHeight: 0, overflow: "auto" },

  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  thead: {
    position: "sticky",
    top: 0,
    zIndex: 1,
    background: PALETTE.head,
    color: "#475569",
    boxShadow: "0 1px 0 " + PALETTE.border,
  },
  th: { textAlign: "left", padding: "12px 14px" },
  td: {
    padding: "12px 14px",
    borderTop: `1px solid ${PALETTE.borderSoft}`,
    verticalAlign: "top",
  },

  pill: {
    display: "inline-block",
    fontSize: 12,
    background: PALETTE.chipBg,
    color: PALETTE.chipText,
    borderRadius: 999,
    padding: "3px 8px",
    marginRight: 6,
    marginBottom: 6,
    whiteSpace: "nowrap",
  },
  linkBtn: {
    fontSize: 12,
    color: PALETTE.blue,
    border: 0,
    background: "transparent",
    textDecoration: "underline",
    cursor: "pointer",
  },
};

// Sample seed
const SEED = [
  {
    id: "amr-ghonewala",
    village: "Ghonewala",
    tehsil: "Ramdas",
    ngo: ["SEEDS India"],
    needs: ["Dry Rations", "Clean Water"],
    workSoFar: ["Medical camp"],
    officer: "Jagdeep Singh (A.E.O)",
    phone: "9872797553",
    status: "working",
    lastUpdated: "2025-09-14",
  },
  {
    id: "amr-saharan",
    village: "Saharan",
    tehsil: "Ramdas",
    ngo: ["Khalsa Aid"],
    needs: ["Chlorine Tabs"],
    workSoFar: ["Water tankers"],
    officer: "Jagdeep Singh (A.E.O)",
    phone: "9872797553",
    status: "worked_past",
    lastUpdated: "2025-09-12",
  },
  {
    id: "amr-dial-bhatti",
    village: "Dial Bhatti",
    tehsil: "Ajanala",
    ngo: [],
    needs: ["Baby Food"],
    workSoFar: [],
    officer: "Jagdeep Singh (A.E.O)",
    phone: "",
    status: "none",
    lastUpdated: "2025-09-12",
  },
];

function sortRows(rows, sortBy) {
  const c = rows.slice();
  if (sortBy === "updated")
    return c.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
  if (sortBy === "name") return c.sort((a, b) => a.village.localeCompare(b.village));
  return c;
}

function filterRows(rows, query, tehsil, priority) {
  const q = (query || "").toLowerCase().trim();
  return rows.filter((r) => {
    const matchesQ =
      !q ||
      [r.village, r.tehsil, r.officer, r.phone, ...(r.ngo || []), ...(r.needs || []), ...(r.workSoFar || [])].some((x) =>
        String(x).toLowerCase().includes(q)
      );
    const matchesT = tehsil === "All" || r.tehsil === tehsil;
    const matchesP =
      priority === "All" ||
      (priority === "High" && r.status === "none") ||
      (priority === "Low" && r.status === "adopted") ||
      (priority === "Medium" && (r.status === "working" || r.status === "worked_past"));
    return matchesQ && matchesT && matchesP;
  });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [rows] = useState(SEED);
  const [query, setQuery] = useState("");
  const [tehsil, setTehsil] = useState("All");
  const [priority, setPriority] = useState("All");
  const [sortBy, setSortBy] = useState("updated");

  const tehsils = useMemo(() => ["All", ...new Set(rows.map((r) => r.tehsil))], [rows]);
  const filtered = useMemo(() => filterRows(rows, query, tehsil, priority), [rows, query, tehsil, priority]);
  const sorted = useMemo(() => sortRows(filtered, sortBy), [filtered, sortBy]);

  const stats = {
    villages: rows.length,
    ngosActive: new Set(rows.flatMap((r) => (r.status === "working" ? r.ngo || [] : []))).size,
    high: rows.filter((r) => r.status === "none").length,
    low: rows.filter((r) => r.status === "adopted").length,
  };

  return (
    <div style={S.root}>
      {/* KPI Row */}
      <div style={S.kpis}>
        <div style={S.statCard}>
          <div style={S.statValue}>{stats.villages}</div>
          <div style={S.statLabel}>Villages</div>
        </div>
        <div style={S.statCard}>
          <div style={S.statValue}>{stats.ngosActive}</div>
          <div style={S.statLabel}>NGOs Active</div>
        </div>
        <div style={S.statCard}>
          <div style={S.statValue}>{stats.high}</div>
          <div style={S.statLabel}>High Priority</div>
        </div>
        <div style={S.statCard}>
          <div style={S.statValue}>{stats.low}</div>
          <div style={S.statLabel}>Low Priority</div>
        </div>
      </div>

      {/* Filters */}
      <div style={S.controlsCard}>
        <div style={S.controlsGrid}>
          <div>
            <label style={S.label}>Search</label>
            <input
              style={S.input}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Village, tehsil, NGO, need, work…"
            />
          </div>
          <div>
            <label style={S.label}>Tehsil (Amritsar)</label>
            <select style={S.select} value={tehsil} onChange={(e) => setTehsil(e.target.value)}>
              {tehsils.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={S.label}>Priority</label>
            <select style={S.select} value={priority} onChange={(e) => setPriority(e.target.value)}>
              {["All", "High", "Medium", "Low"].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={S.label}>Sort</label>
            <select style={S.select} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="updated">Last Updated</option>
              <option value="name">Village Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={S.main}>
        <div style={S.tableCard}>
          <div style={S.tableScroll}>
            <table style={S.table}>
              <thead style={S.thead}>
                <tr>
                  <th style={S.th}>Sn No</th>
                  <th style={S.th}>Village</th>
                  <th style={S.th}>Tehsil</th>
                  <th style={S.th}>NGO(s)</th>
                  <th style={S.th}>Needs</th>
                  <th style={S.th}>Work done so far</th>
                  <th style={S.th}>Contact</th>
                  <th style={S.th}>Updated / Help</th>
                </tr>
              </thead>
              <tbody>
                {sorted.length ? (
                  sorted.map((r, idx) => (
                    <tr key={r.id}>
                      <td style={S.td}>{idx + 1}</td>
                      <td style={{ ...S.td, fontWeight: 700 }}>{r.village}</td>
                      <td style={S.td}>{r.tehsil}</td>
                      <td style={S.td}>{r.ngo?.length ? r.ngo.join(", ") : "—"}</td>
                      <td style={S.td}>
                        {r.needs?.length
                          ? r.needs.map((n, i) => (
                              <span key={i} style={S.pill}>
                                {n}
                              </span>
                            ))
                          : "—"}
                      </td>
                      <td style={S.td}>{r.workSoFar?.length ? r.workSoFar.join("; ") : "—"}</td>
                      <td style={S.td}>
                        <div>
                          {r.officer && <div>{r.officer}</div>}
                          {r.phone ? (
                            <a
                              href={`tel:${r.phone}`}
                              style={{ color: PALETTE.blue, textDecoration: "underline" }}
                            >
                              {r.phone}
                            </a>
                          ) : (
                            <span style={{ color: PALETTE.textSoft }}>No phone listed</span>
                          )}
                        </div>
                      </td>
                      <td style={S.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span>{r.lastUpdated}</span>
                          <button
                            type="button"
                            style={S.linkBtn}
                            onClick={() => navigate(`/ngo/help/${r.id}`)}
                          >
                            Help
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      style={{ ...S.td, color: PALETTE.textSub, textAlign: "center" }}
                      colSpan={8}
                    >
                      No rows match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
