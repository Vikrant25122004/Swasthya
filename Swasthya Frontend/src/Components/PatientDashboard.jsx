import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // For unique room ids
import { User, PhoneCall, FileText } from 'lucide-react';

import DoctorPrescription from './DoctorPescription';
import "./PatientDashboard.css"
const BASE_URL = 'http://localhost:8080';

function byteArrayToBase64(byteArray) {
  if (!byteArray) return null;
  if (typeof byteArray === 'string') {
    return byteArray;
  }
  const bytes = byteArray instanceof Uint8Array ? byteArray : new Uint8Array(byteArray);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const eventSourceRef = useRef(null);
  const navigate = useNavigate();

  // Patient info. Adjust how you get patientName and phonenumber, e.g., from login info or profile.
  const patientPhonenumber = localStorage.getItem('patientnumber');
  console.log(patientPhonenumber);

  useEffect(() => {
    const token = localStorage.getItem('patienttoken');
    if (!token) {
      setError('Authentication token not found, please login again.');
      return;
    }

    const url = new URL(`${BASE_URL}/public/subscribe`);
    url.searchParams.append('token', token);

    const eventSource = new EventSource(url.toString());
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('SSE connection opened for PatientDashboard');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setDoctors(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error('Failed to parse SSE message:', err);
      }
    };

    eventSource.addEventListener('doctorsList', (event) => {
      try {
        const data = JSON.parse(event.data);
        setDoctors(data);
      } catch (e) {
        console.error('Failed to parse doctors SSE event data:', e);
      }
    });

    eventSource.onerror = (err) => {
      setError('Connection error, please refresh the page.');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // --- Make every doctor clickable for starting a video call ---
  const handleCallDoctor = async (doctor) => {
    const roomId = uuidv4();

    const token = localStorage.getItem('patienttoken');
    // fallback if you don't have patient info stored
    const actualPatientPhonenumber = patientPhonenumber || "UnknownPatient";
    
    try {
      // Notify doctor via backend
     const response = await fetch(`${BASE_URL}/patient/notifyVideoCall`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorEmail: doctor.email,
          patientPhonenumber: actualPatientPhonenumber,
          roomId,
        }),
      });
      // Patient navigates to video call page
      console.log(response);
      if (response.ok) {
        // Only navigate if the backend call was successful
        console.log(patientPhonenumber);
        navigate(`/video-call/${roomId}`, {
          state: {
    role: 'patient',
  }
});
      }
      else if (response.status === 400) {
      // Show specific error message for Bad Request
      alert("Pay your previous prescriptions first");
    }else {
        alert('Failed to notify doctor. Please try again.');
      }
    } catch (e) {
      alert('Could not notify doctor. Please try again.');
    }
  };

  if (error) {
    return <div style={{ color: 'red', padding: 20 }}>{error}</div>;
  }

  if (!doctors.length) {
    return <div style={{ padding: 20 }}>No doctors available at the moment.</div>;
  }

  return (
    <div className="doctor-list-container">
      <h1 className="main-title">Available Doctors</h1>
      <div className="doctor-cards-grid">
        {doctors.map((doctor) => {
          // Fallback for profile picture, using a placeholder
          const profilePicBase64 = byteArrayToBase64(doctor.profilepicbyte);
          const profilePicSrc = profilePicBase64
            ? `data:${doctor.profilepictype};base64,${profilePicBase64}`
            : 'https://placehold.co/110x110/2D3748/A0AEC0?text=';

          const degreePdfBase64 = byteArrayToBase64(doctor.degreepdfbyte);
          const degreePdfSrc =
            degreePdfBase64 && doctor.degreepdftype
              ? `data:${doctor.degreepdftype};base64,${degreePdfBase64}`
              : null;

          return (
            <div
              key={doctor.email}
              onClick={() => handleCallDoctor(doctor)}
              className="doctor-card"
              title="Click to start a video call"
            >
              {/* Display profile picture or a placeholder */}
              <div className="profile-image-container">
                {profilePicBase64 ? (
                  <img
                    src={profilePicSrc}
                    alt={`${doctor.name} profile`}
                    className="profile-image"
                  />
                ) : (
                  <div className="profile-image-placeholder">
                    <User size={60} />
                  </div>
                )}
              </div>

              {/* Doctor's details */}
              <h3 className="doctor-name">{doctor.name}</h3>
              <div className="doctor-details">
                <p><strong>Speciality:</strong> {doctor.speciality}</p>
                <p><strong>Hospital/Clinic:</strong> {doctor.hospital_Clinic_name}</p>
                <p><strong>Experience:</strong> {doctor.experience} years</p>
                <p><strong>Fees:</strong> ${doctor.fees}</p>
                <p>
                  <strong>Ratings:</strong>{" "}
                  {typeof doctor.ratings === "number" ? doctor.ratings.toFixed(1) : (doctor.ratings || "N/A")}
                </p>
                <p><strong>Status:</strong> {doctor.status ?? 'Unknown'}</p>
              </div>

              {/* Link to degree document */}
              {degreePdfSrc ? (
                <a
                  href={degreePdfSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={doctor.degreepdfname}
                  onClick={e => e.stopPropagation()}
                  className="download-link"
                >
                  View Degree Document
                </a>
              ) : (
                <p className="no-document">No degree document available.</p>
              )}

              {/* Call to action */}
              <button className="call-button">
                <PhoneCall size={20} />
                Video Call
              </button>
            </div>
          );
        })}
      </div>
      <DoctorPrescription/>
    </div>
  );
};


export default PatientDashboard;
