import React from 'react'
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import './Landing.css';

const DoctorNavbar = () => {
  
    const navigate = useNavigate();
 const handleLogout = async () => {
  const doctorEmail = localStorage.getItem('doctoremail'); // your key for doctor email

  if (doctorEmail) {
    try {
      const token = localStorage.getItem('doctortoken');
      const response = await fetch('http://localhost:8080/public/offline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/plaintext',
          Authorization: `Bearer ${token}`, // include token if backend expects auth
        },
        body: doctorEmail,
      });

      if (!response.ok) {
        console.error('Failed to notify offline status.');
        // optionally inform user here or just continue logout
      }
    } catch (error) {
      console.error('Error sending offline status:', error);
    }
  }

  localStorage.removeItem('doctortoken');
  localStorage.removeItem('doctoremail'); // clear email as well if stored
  navigate('/');
};


  const handleToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const activeStyle = {
    fontWeight: 'bold',
    textDecoration: 'underline',
  };
    const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="logo-container">
          <Stethoscope size={32} className="logo-icon" />
          <h1 className="logo">Swasthya</h1>
        </div>

        <button className="menu-button" onClick={handleToggle} aria-label="Toggle navigation menu">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <ul className={`nav-links ${isMenuOpen ? 'nav-links-open' : ''}`}>
          <li>
            <NavLink to="dashboard" className="nav-link" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
              <Home size={20} /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="profile" className="nav-link" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
              <User size={20} /> Profile
            </NavLink>
          </li>
          <li>
            <NavLink to="pastpatient" className="nav-link" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
              <Users size={20} /> Past Patients
            </NavLink>
          </li>
          <li>
            <button onClick={handleLogout} className="logout-button">
              <LogOut size={20} /> Logout
            </button>
          </li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
};



export default DoctorNavbar;