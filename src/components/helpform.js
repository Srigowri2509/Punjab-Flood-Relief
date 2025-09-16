// src/components/HelpForm.js
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

/**
 * HelpForm — matches the warm dashboard aesthetic (no Tailwind)
 * - Reads :id from route (/ngo/help/:id)
 * - If props.villages is missing, uses SEED fallback
 * - Simple validation; confirms & navigates back to /ngo/dashboard
 */

const PALETTE = {
  page: "#f3eee6",
  card: "#ffffff",
  border: "#e7e3db",
  text: "#171717",
  textSoft: "#9ca3af",
  blue: "#1d4ed8",
  head: "#f6f4f0",
};

const S = {
  page: {
    minHeight: "100vh",
    background: PALETTE.page,
    color: PALETTE.text,
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    padding: 24,
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 840,
    background: PALETTE.card,
    border: `1px solid ${PALETTE.border}`,
    borderRadius: 16,
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
    overflow: "hidden",
  },
  header: {
    padding: "14px 16px",
    background: PALETTE.head,
    borderBottom: `1px solid ${PALETTE.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  h: { margin: 0, fontSize: 20, fontWeight: 800 },
  linkBtn: {
    fontSize: 14,
    color: PALETTE.blue,
    border: 0,
    background: "transparent",
    textDecoration: "underline",
    cursor: "pointer",
  },
  body: { padding: 16 },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 },
  full: { marginBottom: 12 },
  label: { display: "block", fontSize: 12, fontWeight: 600, color: "#4b5563", marginBottom: 6 },
  readBox: {
    width: "100%", padding: "10px 12px", borderRadius: 12,
    border: `1px solid ${PALETTE.border}`, background: "#fafafa",
  },
  input: {
    width: "100%", padding: "10px 12px", borderRadius: 12,
    border: `1px solid ${PALETTE.border}`, background: "#fff",
  },
  select: {
    width: "100%", padding: "10px 12px", borderRadius: 12,
    border: `1px solid ${PALETTE.border}`, background: "#fff",
  },
  btnRow: { marginTop: 8, display: "flex", gap: 10 },
  btn: {
    padding: "10px 14px", borderRadius: 12, border: `1px solid ${PALETTE.border}`,
    background: "#fff", cursor: "pointer",
  },
  success: {
    padding: 10, background: "#e7f6ec", color: "#256c2e",
    borderRadius: 10, border: "1px solid #c6f6d5", marginBottom: 12,
  },
  muted: { color: PALETTE.textSoft, fontSize: 13 },
};

// Fallback seed if no villages prop is provided
const SEED = [
  { id:"amr-ghonewala", district:"Punjab", tehsil:"Ramdas", village:"Ghonewala", officer:"Jagdeep Singh (A.E.O)", phone:"9872797553" },
  { id:"amr-saharan",   district:"Punjab", tehsil:"Ramdas", village:"Saharan",   officer:"Jagdeep Singh (A.E.O)", phone:"9872797553" },
  { id:"amr-dial-bhatti", district:"Punjab", tehsil:"Ajanala", village:"Dial Bhatti", officer:"Jagdeep Singh (A.E.O)", phone:"" },
  { id:"amr-kamirpura", district:"Punjab", tehsil:"Ajanala", village:"Kamirpura", officer:"Amarpreet Singh (A.D.O)", phone:"9876856856" },
];

export default function HelpForm({ villages }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const data = Array.isArray(villages) && villages.length ? villages : SEED;

  const selected = useMemo(
    () => data.find(v => v.id === id) || data[0],
    [data, id]
  );

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [intent, setIntent] = useState("Donate Rations");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;
    console.log("Pledge submitted", {
      villageId: selected.id,
      village: selected.village,
      tehsil: selected.tehsil,
      district: selected.district || "Punjab",
      name: name.trim(),
      contact: contact.trim(),
      intent,
      quantity: quantity.trim(),
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    });
    setSubmitted(true);
    // Go back to dashboard shortly
    setTimeout(() => navigate("/ngo/dashboard"), 700);
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.header}>
          <h2 style={S.h}>Help — {selected?.village || "Village"}</h2>
          <button style={S.linkBtn} onClick={() => navigate("/ngo/dashboard")}>Back to Dashboard</button>
        </div>

        <div style={S.body}>
          {submitted && (
            <div style={S.success}>Thank you! Your pledge has been recorded.</div>
          )}

          {/* Selected village context */}
          <div style={S.row}>
            <div>
              <label style={S.label}>Village</label>
              <div style={S.readBox}>{selected.village}</div>
            </div>
            <div>
              <label style={S.label}>Tehsil / District</label>
              <div style={S.readBox}>{selected.tehsil}, {selected.district || "Punjab"}</div>
            </div>
          </div>
          <div style={S.row}>
            <div>
              <label style={S.label}>Point of Contact</label>
              <div style={S.readBox}>{selected.officer || "—"}</div>
            </div>
            <div>
              <label style={S.label}>Phone</label>
              {selected.phone
                ? <a href={`tel:${selected.phone}`} style={{...S.readBox, color: PALETTE.blue, textDecoration:"underline", display:"inline-block"}}>{selected.phone}</a>
                : <div style={{...S.readBox, color: PALETTE.textSoft}}>No phone listed</div>}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submit} noValidate>
            <div style={S.row}>
              <div>
                <label style={S.label}>Your Name *</label>
                <input style={S.input} value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" required />
              </div>
              <div>
                <label style={S.label}>Contact (Phone/Email) *</label>
                <input style={S.input} value={contact} onChange={e=>setContact(e.target.value)} placeholder="Phone or email" required />
              </div>
            </div>

            <div style={S.row}>
              <div>
                <label style={S.label}>What would you like to do? *</label>
                <select style={S.select} value={intent} onChange={e=>setIntent(e.target.value)}>
                  {["Donate Rations","Provide Clean Water Units","Set up Medical Camp","Sanitation / Cleanup","Temporary Shelters","Other"]
                    .map(opt => <option key={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>Quantity (optional)</label>
                <input style={S.input} value={quantity} onChange={e=>setQuantity(e.target.value)} placeholder="e.g. 200 kits / 2 units" />
              </div>
            </div>

            <div style={S.full}>
              <label style={S.label}>Notes</label>
              <input style={S.input} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Any details, timelines, constraints…" />
            </div>

            <div style={S.btnRow}>
              <button type="submit" style={S.btn}>Submit Pledge</button>
              <button type="button" style={S.btn} onClick={() => navigate("/ngo/dashboard")}>Cancel</button>
            </div>

            <div style={{ marginTop: 8 }}>
              <span style={S.muted}>This form sends your pledge to coordinators. Admin decides priority/assignment.</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
