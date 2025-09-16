import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PALETTE = { page:"#f3eee6", card:"#ffffff", border:"#e7e3db", blue:"#1d4ed8", text:"#171717", textSoft:"#9ca3af" };

const S = {
  page: { minHeight: "100vh", background: PALETTE.page, color: PALETTE.text, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif", padding: 20 },
  card: { maxWidth: 720, margin: "0 auto", background: PALETTE.card, border: `1px solid ${PALETTE.border}`, borderRadius: 16, padding: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" },
  h: { margin: 0, fontSize: 20, fontWeight: 700, marginBottom: 6 },
  readbox: { width: "100%", padding: "10px 12px", borderRadius: 12, border: `1px solid ${PALETTE.border}`, background: "#fafafa", marginBottom: 10 },
  input: { width: "100%", padding: "10px 12px", borderRadius: 12, border: `1px solid ${PALETTE.border}`, background: "#fff", marginBottom: 10 },
  select: { width: "100%", padding: "10px 12px", borderRadius: 12, border: `1px solid ${PALETTE.border}`, background: "#fff", marginBottom: 10 },
  btn: { padding: "10px 14px", borderRadius: 12, border: `1px solid ${PALETTE.border}`, background: "#fff", cursor: "pointer" },
  success: { padding: 10, background: "#e7f6ec", color: "#256c2e", borderRadius: 10, border: "1px solid #c6f6d5", marginBottom: 8 },
};

export default function HelpForm({ villages }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const selected = useMemo(
    () => villages.find(v => v.id === id) || villages[0],
    [villages, id]
  );

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [intent, setIntent] = useState("Donate Rations");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (!name || !contact) return;
    console.log("Pledge submitted", {
      villageId: selected.id,
      name: name.trim(),
      contact: contact.trim(),
      intent,
      quantity: quantity.trim(),
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    });
    setSubmitted(true);
    setTimeout(() => navigate("/ngo/dashboard"), 700);
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h2 style={S.h}>Help — {selected?.village || "Village"}</h2>
          <button onClick={()=>navigate("/ngo/dashboard")} style={{...S.btn, textDecoration:"underline", border:"none"}}>Back</button>
        </div>

        <div style={S.readbox}>{selected.village} — {selected.tehsil}, {selected.district || "Punjab"}</div>
        <div style={S.readbox}>
          <div>{selected.officer || "—"}</div>
          {selected.phone
            ? <a href={`tel:${selected.phone}`} style={{ color: PALETTE.blue, textDecoration: "underline" }}>{selected.phone}</a>
            : <div style={{ color: PALETTE.textSoft }}>No phone listed</div>}
        </div>

        {submitted && <div style={S.success}>Thank you! Your pledge has been recorded.</div>}

        <form onSubmit={submit}>
          <input style={S.input} placeholder="Your Name *" value={name} onChange={e=>setName(e.target.value)} />
          <input style={S.input} placeholder="Contact (Phone/Email) *" value={contact} onChange={e=>setContact(e.target.value)} />
          <select style={S.select} value={intent} onChange={e=>setIntent(e.target.value)}>
            {["Donate Rations","Provide Clean Water Units","Set up Medical Camp","Sanitation / Cleanup","Temporary Shelters","Other"].map(o=> <option key={o}>{o}</option>)}
          </select>
          <input style={S.input} placeholder="Quantity (optional)" value={quantity} onChange={e=>setQuantity(e.target.value)} />
          <input style={S.input} placeholder="Notes" value={notes} onChange={e=>setNotes(e.target.value)} />
          <button type="submit" style={S.btn}>Submit Pledge</button>
        </form>
      </div>
    </div>
  );
}
