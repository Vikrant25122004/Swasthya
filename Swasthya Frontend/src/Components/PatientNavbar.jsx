import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function PatientNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("patienttoken");
    navigate("/patientauth");
  };

  const activeStyle = {
    fontWeight: "700",
    color: "#26c6da",
    borderBottom: "2px solid #26c6da",
    paddingBottom: 4,
  };

  return (
    <>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#008080",
          padding: "10px 30px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1.7rem",
              letterSpacing: "2px",
              fontFamily: "'Segoe UI',sans-serif",
            }}
          >
            Swasthya
          </span>
        </div>
        {/* Navigation */}
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            gap: "30px",
            margin: 0,
            padding: 0,
            alignItems: "center",
          }}
        >
          <li>
            <NavLink
              to="/patienthome/onlinedoctors"
              style={({ isActive }) =>
                isActive
                  ? activeStyle
                  : {
                      color: "#e0f7fa",
                      fontWeight: 600,
                      textDecoration: "none",
                      fontSize: "1.1rem",
                    }
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/patienthome/profile"
              style={({ isActive }) =>
                isActive
                  ? activeStyle
                  : {
                      color: "#e0f7fa",
                      fontWeight: 600,
                      textDecoration: "none",
                      fontSize: "1.1rem",
                    }
              }
            >
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/patienthome/prescriptions"
              style={({ isActive }) =>
                isActive
                  ? activeStyle
                  : {
                      color: "#e0f7fa",
                      fontWeight: 600,
                      textDecoration: "none",
                      fontSize: "1.1rem",
                    }
              }
            >
              Prescriptions
            </NavLink>
          </li>
          <li>
            <button
              onClick={handleLogout}
              style={{
                background: "#ffffff",
                color: "#008080",
                border: "none",
                borderRadius: "18px",
                padding: "8px 18px",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: "pointer",
                transition: "background .2s",
                marginLeft: 10,
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
      {/* Nested route renders here */}
      <Outlet />
    </>
  );
}
