import React, { useState } from "react";

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    ngoName: "",
    headName: "",
    mobile: "",
    email: "",
    district: "",
    address: "",
    serviceType: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      alert("NGO Registered ✅\n\n" + JSON.stringify(formData, null, 2));
    } else {
      alert("Logged In ✅\n\nEmail: " + formData.email);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          {isRegister ? "NGO Registration" : "Government Portal Login"}
        </h2>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <input
                type="text"
                name="ngoName"
                placeholder="Name of NGO"
                value={formData.ngoName}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="text"
                name="headName"
                placeholder="Name of Head of NGO"
                value={formData.headName}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="text"
                name="mobile"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="text"
                name="district"
                placeholder="District"
                value={formData.district}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <textarea
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                style={{ ...styles.input, height: "70px" }}
              />
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                required
                style={styles.input}
              >
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

          {/* Common fields for both login/register */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            {isRegister ? "Register NGO" : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "15px" }}>
          {isRegister ? "Already registered?" : "New NGO?"}{" "}
          <span
            onClick={() => setIsRegister(!isRegister)}
            style={{ color: "#007bff", cursor: "pointer" }}
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#f4f6f9",
  },
  card: {
    width: "420px",
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#222",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "6px",
    border: "none",
    background: "#007bff",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },
};