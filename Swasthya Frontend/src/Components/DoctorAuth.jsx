import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import "./DoctorAuth.css"
import { LogIn, UserPlus } from 'lucide-react'; // Using Lucide icons for visual cues

import { connectWebSocket, disconnectWebSocket } from "./WebsocketClient";

const initialSignupData = {
  name: '',
  email: '',
  address: '',
  phonenumber: '',
  speciality: '',
  password: '',
  hospital_Clinic_name: '',
  experience: '',
  fees: '',
  degreepdf: null,
  profilepic: null,
};
const BASE_URL = 'http://localhost:8080';

const initialLoginData = {
  email: '',
  password: '',
};

export default function DoctorAuth() {
  const [isSignup, setIsSignup] = useState(true);
  const [signupData, setSignupData] = useState(initialSignupData);
  const [loginData, setLoginData] = useState(initialLoginData);
  const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();


  // Handle change for text inputs
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file inputs
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setSignupData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };
   const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!signupData.degreepdf) {
      setErrorMsg("Please upload the degree PDF.");
      return;
    }

    try {
      const base64Degree = await fileToBase64(signupData.degreepdf);

      // Validate degree pdf first on backend
      const analyseRes = await fetch(`${BASE_URL}/public/analysedegree`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: base64Degree,
      });

      if (!analyseRes.ok) {
        setErrorMsg("Kindly provide a valid degree pdf.");
        return;
      }

      // Proceed with registration if degree valid
      const formData = new FormData();
      const doctorsData = {
        name: signupData.name,
        email: signupData.email,
        address: signupData.address,
        phonenumber: signupData.phonenumber,
        speciality: signupData.speciality,
        password: signupData.password,
        hospital_Clinic_name: signupData.hospital_Clinic_name,
        experience: signupData.experience,
        fees: signupData.fees,
      };

      formData.append("doctors", new Blob([JSON.stringify(doctorsData)], { type: "application/json" }));
      formData.append("pdfFile", signupData.degreepdf);
      formData.append("profilepic", signupData.profilepic);

      const response = await fetch(`${BASE_URL}/public/registerDoctor`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Registration successful! Please login.");
        setIsSignup(false);
      } else {
        setErrorMsg("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMsg("An error occurred during registration.");
    }
  };


  // Handle login change
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await fetch(`http://localhost:8080/public/login-doctor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      if (response.ok) {
        // Assuming backend returns token or success info here; adjust as needed
        const data = await response.text();
         localStorage.setItem('doctortoken', data);
         localStorage.setItem('doctoremail',loginData.email);
        alert('Login successful!');

        // Connect to WebSocket and subscribe to /topic/{email}
        connectWebSocket(
          loginData.email,
          (message) => {
            console.log('WebSocket message received:', message);
            // You can integrate message handling here, e.g., update state or notifications
          },
          () => {
            // On connect success, navigate to DoctorDashboard
            navigate('/doctor/profile');
          },
          (error) => {
            console.error('WebSocket error:', error);
          }
        );
      } else {
        setErrorMsg('Login failed. Check your email and password.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMsg('An error occurred during login.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {isSignup ? (
          <>
            <h2 className="auth-title">
              <UserPlus className="title-icon" size={28} />
              Doctor Registration
            </h2>
            {errorMsg && <p className="error-msg">{errorMsg}</p>}
            <form className="auth-form" onSubmit={handleSignupSubmit} encType="multipart/form-data">
              <label className="form-label">
                Full Name:
                <input type="text" name="name" value={signupData.name} onChange={handleSignupChange} required />
              </label>
              <label className="form-label">
                Email:
                <input type="email" name="email" value={signupData.email} onChange={handleSignupChange} required />
              </label>
              <label className="form-label">
                Address:
                <input type="text" name="address" value={signupData.address} onChange={handleSignupChange} required />
              </label>
              <label className="form-label">
                Phone Number:
                <input type="text" name="phonenumber" value={signupData.phonenumber} onChange={handleSignupChange} required />
              </label>
              <label className="form-label">
                Speciality:
                <input type="text" name="speciality" value={signupData.speciality} onChange={handleSignupChange} required />
              </label>
              <label className="form-label">
                Password:
                <input type="password" name="password" value={signupData.password} onChange={handleSignupChange} required />
              </label>
              <label className="form-label">
                Hospital / Clinic Name:
                <input type="text" name="hospital_Clinic_name" value={signupData.hospital_Clinic_name} onChange={handleSignupChange} required />
              </label>
              <label className="form-label">
                Experience (years):
                <input type="text" name="experience" value={signupData.experience} onChange={handleSignupChange} required />
              </label>
              <label className="form-label">
                Fees:
                <input type="text" name="fees" value={signupData.fees} onChange={handleSignupChange} required />
              </label>
              <label className="form-label file-input-label">
                Upload Degree PDF:
                <input type="file" name="degreepdf" accept="application/pdf" onChange={handleFileChange} required />
                <span className="file-name">{signupData.degreepdf ? signupData.degreepdf.name : 'Choose file...'}</span>
              </label>
              <label className="form-label file-input-label">
                Upload Profile Picture:
                <input type="file" name="profilepic" accept="image/*" onChange={handleFileChange} required />
                <span className="file-name">{signupData.profilepic ? signupData.profilepic.name : 'Choose file...'}</span>
              </label>
              <button type="submit" className="btn-primary">Register</button>
            </form>
            <p className="auth-switch-text">
              Already registered?{' '}
              <button type="button" onClick={() => setIsSignup(false)} className="btn-link">
                Login here
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="auth-title">
              <LogIn className="title-icon" size={28} />
              Doctor Login
            </h2>
            {errorMsg && <p className="error-msg">{errorMsg}</p>}
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <label className="form-label">
                Email:
                <input type="email" name="email" value={loginData.email} onChange={handleLoginChange} required />
              </label>
              <label className="form-label">
                Password:
                <input type="password" name="password" value={loginData.password} onChange={handleLoginChange} required />
              </label>
              <button type="submit" className="btn-primary">Login</button>
            </form>
            <p className="auth-switch-text">
              New doctor?{' '}
              <button type="button" onClick={() => setIsSignup(true)} className="btn-link">
                Register here
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};


