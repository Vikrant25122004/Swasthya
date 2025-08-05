import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Prescription() {
  const navigate = useNavigate();
  const location = useLocation();

  // Patient name from navigation state (pass it when navigating here)
  const patientName = location.state?.patientName || "Unnamed Patient";
  const patientnumber = location.state?.patientphone || "Unnamed Patient";
  console.log(patientnumber);
  // Local state for controlled inputs
  const [problem, setProblem] = useState("");
  const [prescription, setPrescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  const doctoremail = localStorage.getItem("doctoremail");
  if (!doctoremail) {
    setError("Doctor not authenticated. Please login again.");
    return;
  }

 ;

  try {
    const formData = new FormData();
    formData.append("prescription", prescription);      // String field
    formData.append("doctoremail", doctoremail);        // String field
    formData.append("patientnumber", patientnumber);    // String field
    formData.append("problem", problem);                // String field
    const token = localStorage.getItem("doctortoken");

    const response = await fetch("http://localhost:8080/doctors/prescriptions", {
      method: "POST",
        headers: {
                Authorization: `Bearer ${token}`,
              },
      body: formData,
      // IMPORTANT: Do NOT set 'Content-Type' header; let browser set 'multipart/form-data' including boundary
    });

    if (!response.ok) {
      const msg = await response.text();
      setError(msg || "Failed to save prescription");
      return;
    }

    navigate("/doctor/profile");
  } catch (err) {
    console.error("Error submitting prescription:", err);
    setError("Error submitting prescription. Please try again.");
  }
};

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "32px auto",
        background: "#f9f9f9",
        borderRadius: 10,
        boxShadow: "0 4px 20px rgba(0,150,136,.10)",
        padding: "2rem",
      }}
    >
      {/* Swasthya Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "2rem",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "#008080",
            fontWeight: "bold",
            fontSize: "2rem",
            letterSpacing: "2px",
          }}
        >
          Swasthya
        </span>
      </div>

      {/* Patient Name */}
      <h3 style={{ textAlign: "center", marginBottom: "1.2rem" }}>
        Patient: <span style={{ color: "#00796b" }}>{patientName}</span>
      </h3>

      {error && (
        <p style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}>
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <label style={{ fontWeight: "bold", marginBottom: 4 }}>Problem:</label>
        <input
          type="text"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          required
          placeholder="Enter patient's problem"
          style={{
            fontSize: "1rem",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #bbb",
            outline: "none",
          }}
        />

        <label style={{ fontWeight: "bold", marginBottom: 4 }}>
          Prescription:
        </label>
        <textarea
          value={prescription}
          onChange={(e) => setPrescription(e.target.value)}
          required
          rows={7}
          placeholder="Write your prescription here..."
          style={{
            fontSize: "1rem",
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #bbb",
            outline: "none",
            resize: "vertical",
          }}
        />

        <button
          type="submit"
          style={{
            marginTop: "1rem",
            background: "#00796b",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            minHeight: 40,
            fontWeight: 700,
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Submit Prescription
        </button>
      </form>
    </div>
  );
}
