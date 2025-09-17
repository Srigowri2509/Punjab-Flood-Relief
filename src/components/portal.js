// src/components/Portal.js
import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

/**
 * Post-login shell (no submenus):
 * Left panel has 3 items: Villages, School Requirements, Veterinary Support.
 * Main area scrolls; sidebar stretches to bottom; compact spacing.
 */

export default function Portal({ children }) {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const onDash = pathname.startsWith("/ngo/dashboard");

  return (
    <div style={S.root}>
      {/* TOP BAR */}
      <header style={S.header}>
        <div style={S.headerRow}>
          <div style={S.brandRow}>
            <img src="/logo punjab.png" alt="Punjab" style={S.logo} />
            <div>
              <div style={S.title}>Amritsar Flood Relief</div>
              <div style={S.sub}>
                Saanjha Uprala — A Joint Initiative by District Administration, Amritsar and
                Organisations
              </div>
            </div>
          </div>

          <div style={S.headerRight}>
            <button
              type="button"
              style={S.topBtn}
              onClick={() => navigate("/ngo/login")}
              title="See what you can do"
            >
              See what you can do
            </button>
            <div style={S.avatar}>P</div>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div style={S.body}>
        {/* LEFT: three simple items, no sub parts */}
        <aside style={S.sidebarCard}>
          <SimpleItem
            to="/ngo/dashboard#villages"
            label="Villages"
            active={onDash && (!hash || hash === "#villages")}
          />
          <SimpleItem
            to="/ngo/dashboard#schools"
            label="School Requirements"
            active={onDash && hash === "#schools"}
          />
          <SimpleItem
            to="/ngo/dashboard#animal"
            label="Veterinary Support"
            active={onDash && hash === "#animal"}
          />
        </aside>

        <main style={S.main}>{children}</main>
      </div>
    </div>
  );
}

/* --------- Sidebar item (no submenu) --------- */
function SimpleItem({ to, label, active }) {
  return (
    <NavLink to={to} style={{ textDecoration: "none" }}>
      <div style={{ ...A.item, ...(active ? A.itemActive : null) }}>{label}</div>
    </NavLink>
  );
}

/* ----------------------------- Styles ---------------------------- */
const C = {
  dark: "#101723",
  darkEdge: "#0b1220",
  subText: "#aab2c2",
  page: "#efe9dd",        // warm page bg
  card: "#ffffff",
  border: "#e6dfd2",
  ring: "0 1px 6px rgba(0,0,0,.06)",
};

const HEADER_H = 60;

const S = {
  root: {
    height: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    background: C.page,
    color: "#171717",
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Inter, Arial, sans-serif',
  },

  /* TOP NAV */
  header: {
    background: C.dark,
    color: "#fff",
    borderBottom: `1px solid ${C.darkEdge}`,
  },
  headerRow: {
    height: HEADER_H,
    padding: "10px 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  brandRow: { display: "flex", alignItems: "center", gap: 10 },
  logo: { width: 34, height: 34, objectFit: "contain" },
  title: { fontWeight: 800, fontSize: 18, letterSpacing: ".2px" },
  sub: { fontSize: 12, color: C.subText },
  headerRight: { display: "flex", alignItems: "center", gap: 10 },
  topBtn: {
    border: "1px solid rgba(255,255,255,.18)",
    color: "#fff",
    background: "transparent",
    padding: "8px 12px",
    borderRadius: 10,
    cursor: "pointer",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "#fff",
    color: C.dark,
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
  },

  /* BODY GRID */
  body: {
    height: `calc(100vh - ${HEADER_H}px)`,
    width: "100%",
    padding: 12,
    display: "grid",
    gridTemplateColumns: "240px 1fr", // compact sidebar
    gap: 12,
  },

  /* SIDEBAR full height */
  sidebarCard: {
    height: "100%",
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 14,
    boxShadow: C.ring,
    padding: 8,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  /* MAIN scrolls */
  main: {
    height: "100%",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
  },
};

const A = {
  item: {
    padding: "12px 12px",
    borderRadius: 10,
    cursor: "pointer",
    color: "#333",
    background: "#f9f5ee",
    border: `1px solid ${C.border}`,
    boxShadow: C.ring,
    fontWeight: 700,
  },
  itemActive: {
    background: "#efe6d6",
    borderColor: "#decfb6",
  },
};
