// src/components/AuthPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ----- Aesthetic: same palette as landing page -----
const PALETTE = {
  page: "#f3eee6",
  card: "#ffffff",
  border: "#e7e3db",
  dark: "#252323",
  text: "#171717",
  textSub: "#6b7280",
  warm: "#a99985",
};

const S = {
  page: {
    minHeight: "100vh",
    background: PALETTE.page,
    color: PALETTE.text,
    fontFamily:
      'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
    display: "flex",
    flexDirection: "column",
  },
  // top mini-header with logo (optional, matches landing)
  headerBand: {
    padding: "8px 0",
    borderBottom: `1px solid ${PALETTE.border}`,
    background: "#fff",
  },
  headerRow: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    overflow: "hidden",
    border: `1px solid ${PALETTE.border}`,
    background: "#fff",
    display: "grid",
    placeItems: "center",
  },
  logoImg: { width: "100%", height: "100%", objectFit: "cover" },

  // center card
  centerWrap: {
    flex: 1,
    display: "grid",
    placeItems: "center",
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: 520,
    background: PALETTE.card,
    border: `1px solid ${PALETTE.border}`,
    borderRadius: 16,
    boxShadow: "0 6px 20px rgba(0,0,0,.08)",
    padding: 20,
  },
  title: {
    textAlign: "center",
    margin: "6px 0 2px",
    fontSize: 22,
    fontWeight: 900,
    color: PALETTE.dark,
  },
  sub: {
    textAlign: "center",
    margin: 0,
    fontSize: 13,
    color: PALETTE.textSub,
  },
  tabs: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    marginTop: 14,
  },
  tabBtn(active) {
    return {
      padding: "10px 12px",
      borderRadius: 12,
      border: `1px solid ${PALETTE.border}`,
      background: active ? PALETTE.dark : "#fff",
      color: active ? "#fff" : PALETTE.dark,
      cursor: "pointer",
      fontWeight: 700,
    };
  },
  form: { marginTop: 14, display: "grid", gap: 10 },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "#4b5563",
    marginBottom: 4,
    display: "block",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: `1px solid ${PALETTE.border}`,
    background: "#fff",
    fontSize: 14,
  },
  submit: {
    marginTop: 6,
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "none",
    background: PALETTE.dark,
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
  },
  switchRow: { textAlign: "center", marginTop: 12, color: PALETTE.textSub },
  link: {
    color: PALETTE.dark,
    textDecoration: "underline",
    cursor: "pointer",
    fontWeight: 700,
  },
  note: {
    marginTop: 8,
    fontSize: 12,
    color: PALETTE.textSub,
    textAlign: "center",
  },
};

function toPublicUrl(input) {
  if (!input) return input;
  let s = String(input).replace(/\\/g, "/").trim();
  if (/^(https?:)?\/\//i.test(s) || s.startsWith("data:")) return s;
  if (s.startsWith("/")) return encodeURI(s);
  s = s.replace(/^public\//, "");
  return encodeURI("/" + s);
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);

  const [formData, setFormData] = useState({
    // Register fields (your requested ones)
    personName: "",
    orgName: "",
    contact: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegister) {
      // Minimal client-side validation
      if (
        !formData.personName.trim() ||
        !formData.orgName.trim() ||
        !formData.contact.trim() ||
        !formData.email.trim() ||
        !formData.password.trim()
      ) {
        alert("Please fill all required fields.");
        return;
      }
      alert(
        "NGO Registered ✅\n\n" +
          JSON.stringify(
            {
              personName: formData.personName,
              orgName: formData.orgName,
              contact: formData.contact,
              email: formData.email,
            },
            null,
            2
          )
      );
      // Switch to login tab after register
      setIsRegister(false);
      return;
    }

    // Login
    if (!formData.email.trim() || !formData.password.trim()) {
      alert("Please enter email and password.");
      return;
    }
    alert("Logged In ✅\n\nEmail: " + formData.email);
    navigate("/ngo/dashboard");
  };

  return (
    <div style={S.page}>
      {/* Mini header (logo on left to match landing) */}
      <section style={S.headerBand}>
        <div style={S.headerRow}>
          <div style={S.logoBox}>
            <img
              src={toPublicUrl("/logo punjab.png")}
              alt="Amritsar Flood Relief"
              style={S.logoImg}
            />
          </div>
          <div style={{ fontWeight: 700, color: PALETTE.textSub }}>
            Official Portal
          </div>
        </div>
      </section>

      {/* Centered auth card */}
      <div style={S.centerWrap}>
        <div style={S.card}>
          <h2 style={S.title}>
            {isRegister ? "Register NGO / Organisation" : "Government Portal Login"}
          </h2>
          <p style={S.sub}>
            {isRegister
              ? "Create an account to coordinate relief work in Amritsar."
              : "Sign in to access the NGO dashboard."}
          </p>

          {/* Tabs */}
          <div style={S.tabs}>
            <button
              type="button"
              style={S.tabBtn(!isRegister)}
              onClick={() => setIsRegister(false)}
            >
              Login
            </button>
            <button
              type="button"
              style={S.tabBtn(isRegister)}
              onClick={() => setIsRegister(true)}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form style={S.form} onSubmit={handleSubmit} noValidate>
            {isRegister ? (
              <>
                <div>
                  <label style={S.label}>Name of the person *</label>
                  <input
                    style={S.input}
                    name="personName"
                    value={formData.personName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div>
                  <label style={S.label}>Name of organisation *</label>
                  <input
                    style={S.input}
                    name="orgName"
                    value={formData.orgName}
                    onChange={handleChange}
                    placeholder="Organisation Name"
                    required
                  />
                </div>
                <div>
                  <label style={S.label}>Contact no *</label>
                  <input
                    style={S.input}
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    required
                  />
                </div>
                <div>
                  <label style={S.label}>Email *</label>
                  <input
                    type="email"
                    style={S.input}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label style={S.label}>Password *</label>
                  <input
                    type="password"
                    style={S.input}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label style={S.label}>Email *</label>
                  <input
                    type="email"
                    style={S.input}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label style={S.label}>Password *</label>
                  <input
                    type="password"
                    style={S.input}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </>
            )}

            <button type="submit" style={S.submit}>
              {isRegister ? "Register" : "Login"}
            </button>
          </form>

          <div style={S.switchRow}>
            {isRegister ? "Already registered? " : "New NGO? "}
            <span
              onClick={() => setIsRegister(!isRegister)}
              style={S.link}
              role="button"
              tabIndex={0}
            >
              {isRegister ? "Login" : "Register"}
            </span>
          </div>

          {!isRegister && (
            <div style={S.note}>
              Tip: Use the landing page CTA if you need help with registration.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
