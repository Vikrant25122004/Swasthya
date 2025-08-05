import React from 'react'
import { useState, useEffect } from 'react';
import { Download, Check, X, Star, UserCheck } from 'lucide-react';
import "./PastPatient.css"

const PastPatient = () => {
  const [pastPatients, setPastPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("doctortoken");

  useEffect(() => {
    if (!token) {
      setError("Doctor not authenticated. Please login.");
      setLoading(false);
      return;
    }

    const fetchPastPatients = async () => {
      try {
        const response = await fetch("http://localhost:8080/doctors/pastpatient", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}), // Assuming no request body parameters required
        });

        if (!response.ok) {
          const message = await response.text();
          setError(message || "Failed to fetch past patients.");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setPastPatients(data);
      } catch (err) {
        setError("Network error while fetching past patients.");
      }
      setLoading(false);
    };

    fetchPastPatients();
  }, [token]);

  // Utility function to convert byte array to base64 URL for prescription display
  const getPrescriptionUrl = (prescripbyte, prescriptype) => {
    if (!prescripbyte) return null;
    let base64;
    if (typeof prescripbyte === "string") {
      base64 = prescripbyte;
    } else if (Array.isArray(prescripbyte) || prescripbyte instanceof Uint8Array) {
      const byteArray = new Uint8Array(prescripbyte);
      let binary = "";
      byteArray.forEach((b) => (binary += String.fromCharCode(b)));
      base64 = window.btoa(binary);
    } else {
      return null;
    }
    return `data:${prescriptype || "application/pdf"};base64,${base64}`;
  };

  if (loading) return <p>Loading past patients...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!pastPatients.length) return <p>No past patients found.</p>;

  return (
    <div className="past-patients-container">
      <h2 className="past-patients-title">
        <UserCheck size={32} className="title-icon" />
        Past Patients
      </h2>
      <div className="table-responsive">
        <table className="past-patients-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Patient Email</th>
              <th>Problem</th>
              <th>Prescription</th>
              <th>Paid</th>
              <th>Ratings</th>
            </tr>
          </thead>
          <tbody>
            {pastPatients.map((patient) => {
              const pdfUrl = getPrescriptionUrl(patient.prescripbyte, patient.prescriptype);
              return (
                <tr key={patient.id}>
                  <td>{patient.patientname}</td>
                  <td>{patient.patientemail}</td>
                  <td>{patient.problem}</td>
                  <td>
                    {pdfUrl ? (
                      <a href={pdfUrl} target="_blank" rel="noopener noreferrer" download={patient.prescripname || "prescription.pdf"}>
                        <Download size={16} /> View
                      </a>
                    ) : (
                      <span className="no-document">No Prescription</span>
                    )}
                  </td>
                  <td>
                    {patient.paid ? <Check size={20} className="paid-icon" /> : <X size={20} className="unpaid-icon" />}
                  </td>
                  <td>
                    <div className="rating-cell">
                      {patient.ratings > 0 ? (
                        <>
                          <Star size={16} className="star-icon filled" />
                          {patient.ratings.toFixed(1)}
                        </>
                      ) : (
                        'N/A'
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default PastPatient