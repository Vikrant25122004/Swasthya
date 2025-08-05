import React, { useEffect, useState } from "react";
import { User } from 'lucide-react';

export default function PatientProfile() {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("patienttoken");
      if (!token) {
        setError("Not authenticated. Please login.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/patient/getpatient", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setError("Failed to fetch patient data.");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setPatient(data);
      } catch (err) {
        console.error("Error fetching patient data:", err);
        setError("An error occurred while fetching patient data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, []);

  if (loading) return <p>Loading patient profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!patient) return null;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">
          <User className="title-icon" size={28} />
          Patient Profile
        </h2>

        {patient.profilepic && (
          <img
            src={patient.profilepic}
            alt="Patient Profile"
            className="profile-image"
          />
        )}

        <table className="profile-table">
          <tbody>
            <tr className="table-row">
              <td className="table-header">Name</td>
              <td className="table-data">{patient.name}</td>
            </tr>
            <tr className="table-row">
              <td className="table-header">Email</td>
              <td className="table-data">{patient.email}</td>
            </tr>
            <tr className="table-row">
              <td className="table-header">Address</td>
              <td className="table-data">{patient.address}</td>
            </tr>
            <tr className="table-row">
              <td className="table-header">Phone Number</td>
              <td className="table-data">{patient.phonenumber}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

