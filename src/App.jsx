import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import HomePage from './pages/HomePage';
import Timer from './pages/Timer';
import Footer from './pages/Footer';
import Dashboard from './pages/Dashboard';
import Navigation from './pages/Navigation';

function App() {
  return (
    <BrowserRouter>
    <Navigation />
  <div
    className="app-background"
    style={{
      backgroundColor: "#ceb0f2ff",
      fontFamily: "'Poppins', sans-serif",
      minHeight: "100vh", // make sure the container takes full height
      display: "flex",
      flexDirection: "column", // stack content vertically
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
</BrowserRouter>
  );
}

export default App;
