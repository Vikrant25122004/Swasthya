import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

import { connectWebSocket, disconnectWebSocket } from './websocketClient';
// or adjust path as needed

const BASE_URL = 'http://localhost:8080';


const initialSignupData = {
  name: '',
  email: '',
  address: '',
  phonenumber: '',
  password: '',
};

const initialLoginData = {
  phonenumber: '',
  password: '',
};

export default function Patientauth() {
  const [isSignup, setIsSignup] = useState(true);
  const [signupData, setSignupData] = useState(initialSignupData);
  const [loginData, setLoginData] = useState(initialLoginData);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // Use useRef to hold the EventSource instance for SSE
  const eventSourceRef = useRef(null);

  // Signup form input handler
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  // Login form input handler
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  // Cleanup SSE connection on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  // Subscribe to SSE updates
  const subscribeToUpdates = (token) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Build SSE URL with the token as a query param
    const url = new URL(`${BASE_URL}/public/subscribe`);
    url.searchParams.append('token', token);

    const eventSource = new EventSource(url.toString());
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('SSE connection opened');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('New SSE message:', data);
        // TODO: Implement notification or state update logic as needed
      } catch (err) {
        console.error('Error parsing SSE message:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE connection error:', err);
      eventSource.close();
    };
  };

  // Handle signup form submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await fetch(`${BASE_URL}/public/registerPatient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      if (response.ok) {
        alert('Signup successful! Please login.');
        setIsSignup(false);
        setSignupData(initialSignupData);
      } else {
        const errorText = await response.text();
        setErrorMsg(errorText || 'Signup failed. Please check your details.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setErrorMsg('An error occurred during signup.');
    }
  };

  // Handle login form submission
  const handleLoginSubmit = async (e) => {
     e.preventDefault();
    setErrorMsg('');

    try {
      const response = await fetch(`${BASE_URL}/public/login-patient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem('patienttoken', token);
        localStorage.setItem('patientnumber', loginData.phonenumber);
        alert('Login successful!');
        connectWebSocket(
          loginData.phonenumber,
          message => {
            console.log('WebSocket message for patient:', message);
            // Handle incoming events for the patient here (e.g., call invitation)
          },
          () => {
            // On WebSocket connect success
            navigate('/patienthome/onlinedoctors'); // or /PatientDashboard
          },
          error => {
            console.error('WebSocket error:', error);
          }
        );



        subscribeToUpdates(token);

        // Clear login form and navigate to PatientDashboard
      
        setLoginData(initialLoginData);
      } else {
        const errorText = await response.text();
        setErrorMsg(errorText || 'Login failed. Please check phone and password.');
      }
    } catch (err) {
      console.error('Login error:', err);
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
              Patient Registration
            </h2>
            {errorMsg && <p className="error-msg">{errorMsg}</p>}
            <form className="auth-form" onSubmit={handleSignupSubmit}>
              <label className="form-label">
                Name:
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
                Password:
                <input type="password" name="password" value={signupData.password} onChange={handleSignupChange} required />
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
              Patient Login
            </h2>
            {errorMsg && <p className="error-msg">{errorMsg}</p>}
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <label className="form-label">
                Phone Number:
                <input type="text" name="phonenumber" value={loginData.phonenumber} onChange={handleLoginChange} required />
              </label>
              <label className="form-label">
                Password:
                <input type="password" name="password" value={loginData.password} onChange={handleLoginChange} required />
              </label>
              <button type="submit" className="btn-primary">Login</button>
            </form>
            <p className="auth-switch-text">
              New patient?{' '}
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