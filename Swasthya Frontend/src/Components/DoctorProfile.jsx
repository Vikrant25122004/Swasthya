import React, { useEffect, useState } from 'react'
import "./DoctorProfile.css"
import Notification from './Notification';
const DoctorProfile = () => {
 const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('doctortoken');
        if (!token) {
          setError('Not authenticated. Please login.');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:8080/doctors/getDoctor', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Adjust if your backend expects a different auth header format
          },
          method: 'GET',
        });

        if (!response.ok) {
          setError('Failed to fetch profile information.');
          setLoading(false);
          return;
        }

        const data = await response.json();
        setDoctor(data);
      } catch (err) {
        setError('An error occurred while fetching profile.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!doctor) return null;

  // Helper to create base64 image URL from byte array and mime type
  const getBase64ImageSrc = (byteArray, mimeType) => {
  if (!byteArray || !mimeType) return null;

  // Check if byteArray is a string (base64) - if yes, return directly
  if (typeof byteArray === 'string') {
    return `data:${mimeType};base64,${byteArray}`;
  }

  // Convert number array to Uint8Array (if not already)
  const bytes = byteArray instanceof Uint8Array ? byteArray : new Uint8Array(byteArray);

  // Convert Uint8Array to binary string
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  // Convert binary to base64
  const base64String = window.btoa(binary);
  return `data:${mimeType};base64,${base64String}`;
};

  const profileImgSrc = getBase64ImageSrc(doctor.profilepicbyte, doctor.profilepictype);
  // Function to download the PDF
  const handleDownload = (pdfData, pdfType, pdfName) => {
    const link = document.createElement('a');
    link.href = `data:${pdfType};base64,${btoa(
      String.fromCharCode(...new Uint8Array(pdfData))
    )}`;
    link.download = pdfName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Doctor Profile</h2>
        {profileImgSrc && (
          <img
            src={profileImgSrc}
            alt="Profile"
            className="profile-image"
          />
        )}
        <table className="profile-table">
          <tbody>
            <tr className="table-row">
              <td className="table-header">Name</td>
              <td className="table-data">{doctor.name}</td>
            </tr>
            <tr className="table-row">
              <td className="table-header">Email</td>
              <td className="table-data">{doctor.email}</td>
            </tr>
            <tr className="table-row">
              <td className="table-header">Address</td>
              <td className="table-data">{doctor.address}</td>
            </tr>
            <tr className="table-row">
              <td className="table-header">Phone Number</td>
              <td className="table-data">{doctor.phonenumber}</td>
            </tr>
            <tr className="table-row">
              <td className="table-header">Speciality</td>
              <td className="table-data">{doctor.speciality}</td>
            </tr>
            <tr className="table-row">
              <td className="table-header">Hospital / Clinic Name</td>
              <td className="table-data">{doctor.hospital_Clinic_name}</td>
            </tr>
            <tr className="table-row">
              <td className="table-header">Experience (years)</td>
              <td className="table-data">{doctor.experience}</td>
            </tr>
            <tr className="table-row">
              <td className="table-header">Fees</td>
              <td className="table-data">{doctor.fees}</td>
            </tr>
            <tr className="table-row">
              <td className="table-header">Ratings</td>
              <td className="table-data">{doctor.ratings || 0}</td>
            </tr>
            <tr className="table-row">
              <td className="table-header">Degree Document</td>
              <td className="table-data">
                {doctor.degreepdfname ? (
                  <button 
                    onClick={() => handleDownload(doctor.degreepdfbyte, doctor.degreepdftype, doctor.degreepdfname)}
                    className="download-link"
                  >
                    {doctor.degreepdfname}
                  </button>
                ) : (
                  'Not available'
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Notification doctorEmail={doctor.email} />
    </div>
  );
};
export default DoctorProfile;