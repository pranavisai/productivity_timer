import './App.css';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import HomePage from './pages/HomePage';
import Timer from './pages/Timer';
import Footer from './pages/Footer';
import Dashboard from './pages/Dashboard';
import Navigation from './pages/Navigation';
import Login from './pages/Login';
import { useState, useEffect } from 'react';

function AppWrapper() {
  const location = useLocation();
  const navigate = useNavigate();

  // User state
  const [user, setUser] = useState(null);

  // On mount, check localStorage for logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Handle login
  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    navigate("/"); // redirect after login
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login"); // redirect after logout
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
            <Route path="/" element={<HomePage />} />
            <Route path="/timer" element={<Timer />} />
            <Route path="/dashboard" element={<Dashboard />} />
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