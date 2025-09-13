import './App.css';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import HomePage from './pages/HomePage';
import Timer from './pages/Timer';
import Footer from './pages/Footer';
import Dashboard from './pages/Dashboard';
import Navigation from './pages/Navigation';
import Login from './pages/Login';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

function AppWrapper() {
  const location = useLocation();
  const navigate = useNavigate();

  // User state
  const [user, setUser] = useState(null);

  // On mount, check if session exists in backend
  useEffect(() => {
    fetch("http://localhost:5050/api/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        } else {
          localStorage.removeItem("user");
          setUser(null);
        }
      })
      .catch((err) => console.error("Failed to fetch /api/me", err));
  }, []);

  // Handle login (used only if you ever do frontend login)
  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    navigate("/"); // redirect after login
  };

  // Handle logout (with backend call)
  // Handle logout
const handleLogout = async () => {
  try {
    const res = await fetch("http://localhost:5050/auth/logout-api", {
      method: "POST",
      credentials: "include", // important to send cookies
    });

    if (res.ok) {
      const data = await res.json();
      if (data.ok) {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login"); // redirect after logout
      } else {
        console.error("Logout failed on server side");
      }
    } else {
      console.error("Logout endpoint returned non-OK status");
    }
  } catch (err) {
    console.error("Logout error:", err);
    // fallback: full redirect
    window.location.href = "http://localhost:5050/auth/logout";
  }
};

  // Hide navigation only on the login page
  const hideNav = location.pathname === "/login";

  return (
    <>
      {!hideNav && <Navigation user={user} onLogout={handleLogout} />}
      <div
        className="app-background"
        style={{
          backgroundColor: "#ceb0f2ff",
          fontFamily: "'Poppins', sans-serif",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="flex-grow-1 d-flex justify-content-center align-items-center"
          style={{ width: "100%" }}
        >
          <Routes>
            <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" replace />} />
            <Route path="/timer" element={user ? <Timer /> : <Navigate to="/login" replace />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
          </Routes>
        </div>

        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "60px",
          }}
        >
          <Footer />
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;