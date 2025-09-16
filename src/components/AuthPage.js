import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  page: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f3eee6", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" },
  card: { width: 420, background: "#fff", padding: 30, borderRadius: 14, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" },
  title: { textAlign: "center", marginBottom: 20, fontSize: 20, color: "#222" },
  input: { width: "100%", padding: 10, margin: "8px 0", borderRadius: 8, border: "1px solid #ddd", fontSize: 14 },
  button: { width: "100%", padding: 12, marginTop: 10, borderRadius: 8, border: "none", background: "#1d4ed8", color: "#fff", fontSize: 15, cursor: "pointer" },
  link: { textAlign: "center", marginTop: 15, fontSize: 13 },
  linkBtn: { color: "#1d4ed8", cursor: "pointer", textDecoration: "underline" },
};

export default function AuthPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    ngoName: "", headName: "", mobile: "", email: "", district: "",
    address: "", serviceType: "", password: ""
  });

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("auth", "true"); // simulate success
    navigate("/ngo/dashboard", { replace: true });
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isRegister ? "NGO Registration" : "Government Portal Login"}</h2>

        <form onSubmit={onSubmit}>
          {isRegister && (
            <>
              <input style={styles.input} name="ngoName" placeholder="Name of NGO" value={formData.ngoName} onChange={onChange} required />
              <input style={styles.input} name="headName" placeholder="Name of Head of NGO" value={formData.headName} onChange={onChange} required />
              <input style={styles.input} name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={onChange} required />
              <input style={styles.input} name="district" placeholder="District" value={formData.district} onChange={onChange} required />
              <textarea style={{ ...styles.input, height: 70 }} name="address" placeholder="Address" value={formData.address} onChange={onChange} required />
              <select style={styles.input} name="serviceType" value={formData.serviceType} onChange={onChange} required>
                <option value="">Select Type of Service</option>
                <option value="Shelter">Shelter</option>
                <option value="Food">Food</option>
                <option value="Health">Health</option>
                <option value="Rescue">Rescue</option>
                <option value="Animal Care">Animal Care</option>
                <option value="Transport">Transport</option>
                <option value="Other">Other</option>
              </select>
            </>
          )}

          <input style={styles.input} type="email" name="email" placeholder="Email Address" value={formData.email} onChange={onChange} required />
          <input style={styles.input} type="password" name="password" placeholder="Password" value={formData.password} onChange={onChange} required />
          <button type="submit" style={styles.button}>{isRegister ? "Register NGO" : "Login"}</button>
        </form>

        <p style={styles.link}>
          {isRegister ? "Already registered?" : "New NGO?"}{" "}
          <span onClick={() => setIsRegister(!isRegister)} style={styles.linkBtn}>
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
}
