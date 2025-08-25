import { Link } from "react-router-dom";
import React from "react";

function Navigation() {
  return (
    <nav
      className="d-flex justify-content-between align-items-center p-3"
      style={{
        backgroundColor: "transparent", // transparent navbar
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000, // make sure it stays on top
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
        <Link to="/login" className="btn btn-outline-light me-2">
          Login
        </Link>  
      </div>
    </nav>
  );
}

export default Navigation;