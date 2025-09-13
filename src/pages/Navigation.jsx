import { Link, useNavigate, useLocation } from "react-router-dom";
import React from "react";

function Navigation({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  // Hide navbar when in login page
  if (location.pathname === "/login") {
    return null;
  }

  return (
    <nav
      className="d-flex justify-content-between align-items-center p-3"
      style={{
        backgroundColor: "transparent",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      <Link to="/" className="d-flex align-items-center text-decoration-none text-light">
        <img
          src="/time-management.png"
          alt="Home"
          style={{ width: "30px", height: "30px", marginRight: "8px" }}
        />
        <span className="home-text">ProTimer</span>
      </Link>
      <div>
        <Link to="/dashboard" className="btn btn-outline-light me-2">
          Dashboard
        </Link>
        {user && (
          <button onClick={handleLogout} className="btn btn-outline-light me-2">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navigation;