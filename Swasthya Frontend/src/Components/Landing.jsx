import React from 'react';
import { Link } from 'react-router-dom';
import { Video, FileText, HeartPulse, ClipboardCheck, Users, MessageSquare } from 'lucide-react';
import './Landing.css';

// Added a descriptive icon property to each feature
const featuresList = [
  { title: 'Secure Video Consultations', desc: 'HIPAA‑compliant video chats with registered doctors.', icon: Video },
  { title: 'Digital Prescriptions', desc: 'Receive prescriptions instantly via secure document delivery.', icon: FileText },
  { title: '24×7 Emergency Access', desc: 'Immediate access to doctors for urgent cases.', icon: HeartPulse },
  { title: 'Health Risk Assessment Tool', desc: 'Self‑help quizzes to evaluate your health risk online.', icon: ClipboardCheck },
  
];

const Landing = () => (
  <div className="landing-container">
    <header className="navbar">
      <div className="logo-container">
        <HeartPulse size={24} className="logo-icon" />
        <h1 className="logo">Swasthya</h1>
      </div>
    </header>

    <main className="hero">
      <div className="hero-content">
        <h2>Your 24/7 Online Health Partner</h2>
        <p>Connecting Patients with Doctors Instantly</p>
        <div className="cta-buttons">
          <Link to="/doctorauth" className="btn-primary">Register as Doctor</Link>
          <Link to="/patientauth" className="btn-secondary">Emergency Patient Login</Link>
        </div>
      </div>
    </main>

    <section className="features">
      <h3>Key Features</h3>
      <div className="features-grid">
        {featuresList.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div key={idx} className="feature-card">
              <div className="icon-container">
                <Icon size={48} className="feature-icon" />
              </div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          );
        })}
      </div>
    </section>

    <footer className="footer">
      &copy; 2025 Swasthya – Powering Smarter, Safer Healthcare for Everyone
    </footer>
  </div>
);

export default Landing;
