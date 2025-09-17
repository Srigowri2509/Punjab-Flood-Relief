// src/components/PortalShell.jsx
import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const PALETTE = {
  page: "#ede6db",
  surface: "#ffffff",
  border: "#e7e3db",
  dark: "#0f172a",
  darkSoft: "#111827",
  chip: "#f6f4f0",
};

const S = {
  root: {
    height: "100vh",
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    gridTemplateRows: "56px 1fr",
    gridTemplateAreas: `
      "top top"
      "side main"
    `,
    background: PALETTE.page,
  },

  /* Top bar */
  top: {
    gridArea: "top",
    background: PALETTE.dark,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    padding: "0 14px",
    gap: 10,
    borderBottom: `1px solid rgba(255,255,255,.08)`,
  },
  brand: { fontWeight: 800, letterSpacing: .2 },
  sub: { color: "rgba(255,255,255,.7)", fontSize: 12 },

  /* Sidebar */
  side: {
    gridArea: "side",
    background: PALETTE.surface,
    borderRight: `1px solid ${PALETTE.border}`,
    padding: 12,
    overflow: "auto",
  },
  section: {
    background: PALETTE.chip,
    border: `1px solid ${PALETTE.border}`,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    fontWeight: 700,
  },
  item: {
    background: "#fff",
    border: `1px solid ${PALETTE.border}`,
    borderRadius: 12,
    padding: "12px 14px",
    marginTop: 10,
    display: "block",
    color: "#111",
    textDecoration: "none",
  },
  itemActive: {
    outline: "2px solid #111",
  },

  /* Main */
  main: {
    gridArea: "main",
    padding: 16,
    overflow: "auto",
  },
  card: {
    background: "#fff",
    border: `1px solid ${PALETTE.border}`,
    borderRadius: 16,
    padding: 12,
    minHeight: "calc(100vh - 56px - 32px)",
  },
};

export default function PortalShell() {
  const loc = useLocation();
  const navigate = useNavigate();

  return (
    <div style={S.root}>
      {/* Top bar */}
      <header style={S.top}>
        <img src="/logo punjab.png" alt="" style={{ width: 26, height: 26, borderRadius: 6 }} />
        <div>
          <div style={S.brand}>Amritsar Flood Relief</div>
          <div style={S.sub}>Saanjha Uprala — Joint initiative by District Administration, Amritsar and Organisations</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <button
            onClick={() => navigate("/#cta")}
            style={{ background: "#fff", color: PALETTE.darkSoft, border: 0, borderRadius: 999, padding: "6px 12px", fontWeight: 700, cursor: "pointer" }}
          >
            See what you can do
          </button>
          <div style={{
            width: 28, height: 28, borderRadius: "999px", background: "#fff",
            display: "grid", placeItems: "center", color: PALETTE.darkSoft, fontWeight: 800
          }}>
            P
          </div>
        </div>
      </header>

      {/* Sidebar — only rendered on routes that use this shell */}
      <aside style={S.side}>
        <div style={S.section}>Villages</div>
        <NavLink
          to="/ngo/dashboard"
          style={({ isActive }) => ({ ...S.item, ...(isActive ? S.itemActive : null) })}
          end
        >
          All villages
        </NavLink>

        <div style={S.section}>School Requirements</div>
        <NavLink
          to="/ngo/dashboard/schools"
          style={({ isActive }) => ({ ...S.item, ...(isActive ? S.itemActive : null) })}
        >
          School status
        </NavLink>

        <div style={S.section}>Veterinary Support</div>
        <NavLink
          to="/ngo/dashboard/animal"
          style={({ isActive }) => ({ ...S.item, ...(isActive ? S.itemActive : null) })}
        >
          Veterinary support
        </NavLink>
      </aside>

      {/* Main */}
      <main style={S.main}>
        <div style={S.card}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
