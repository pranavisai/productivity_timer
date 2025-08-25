import Lottie from "lottie-react";
import working from "../assets/animations/working.json";
import motivation from "../assets/animations/motivation.json";
import chai from "../assets/animations/chai.json";
import meditation from "../assets/animations/meditation.json";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import quotes from "../motivation_quotes.json"

const Timer = () => {
    const location = useLocation();
    const { name, hours, minutes } = location.state || {};
    const totalSeconds = (hours * 3600) + (minutes * 60);
    const [timeLeft, setTimeLeft] = useState(totalSeconds);
    const [quote, setQuote] = useState("");
    const [timeRun, setTimerRun] = useState(true);
    const [mode, setMode] = useState("work");

    // to decrease the timer in seconds
    useEffect (() => {
        if (!timeRun || timeLeft <= 0)
            return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                const newTime = prev - 1;

                if (newTime > 0 && newTime % 900 == 0 && mode === "work") {
                    const randomQuote = Math.floor(Math.random() * quotes.length);
                    setQuote(quotes[randomQuote]);

                setTimeout(() => {
                    setQuote("");
                }, 10000);
            }
                return newTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, timeRun, mode]);

    // to convert to hours, minutes and seconds for display
    const formatTime = (seconds) => {
        const hour = Math.floor(seconds / 3600);
        const minute = Math.floor((seconds % 3600) / 60);
        const second = seconds % 60;
            
        // to give as 0 before the number when the count drops below 10
        const hh = hour.toString().padStart(2, "0");
        const mm = minute.toString().padStart(2, "0");
        const ss = second.toString().padStart(2, "0");

        return `${hh}:${mm}:${ss}`;
    }



return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow-lg p-4 rounded-4 text-center"
        style={{ maxWidth: "500px", width: "100%", borderColor: "#9b5de5" }}
      >
        {/* Greeting */}
        <h1 className="mb-4" style={{ color: "#9b5de5" }}>
          Hi {name}! Let's start! 💜
        </h1>

        {/* Timer */}
        <p className="fs-3 fw-bold" style={{ color: "#333" }}>
          ⏳ Time Left:{" "}
          <span style={{ color: "#9b5de5" }}>{formatTime(timeLeft)}</span>
        </p>

        {/* Control Buttons */}
        <div className="d-flex justify-content-center gap-2 mb-3">
          {/* Pause / Resume */}
          <button
            className="btn"
            style={{
              backgroundColor: "#9b5de5",
              color: "white",
              minWidth: "120px",
            }}
            onClick={() => {
              if (!timeRun) setMode("work");
              setTimerRun(!timeRun);
            }}
          >
            {timeRun ? "Pause" : "Resume"}
          </button>

          {/* Reset */}
          <button
            className="btn btn-outline-secondary"
            style={{ minWidth: "120px" }}
            onClick={() => {
              setTimeLeft(totalSeconds);
              setTimerRun(false);
              setQuote("");
              setMode("work");
            }}
          >
            Reset
          </button>
        </div>

        {/* Break Buttons */}
        <div className="d-flex justify-content-center gap-2">
          <button
            className="btn"
            style={{
              backgroundColor: "#6bcb77",
              color: "white",
              minWidth: "120px",
            }}
            onClick={() => {
              setMode("break-meditation");
              setTimerRun(false);
            }}
          >
            🧘 Meditate
          </button>

          <button
            className="btn"
            style={{
              backgroundColor: "#f77f00",
              color: "white",
              minWidth: "120px",
            }}
            onClick={() => {
              setMode("break-chai");
              setTimerRun(false);
            }}
          >
            🍵 Have Chai
          </button>
        </div>

        {/* Fixed-height Animation / Quote Section */}
<div
  className="mt-4 d-flex justify-content-center align-items-center"
  style={{ minHeight: "280px" }} // reserve height so layout doesn’t shift
>
  {quote && mode === "work" ? (
    <div className="d-flex align-items-center justify-content-center">
      {/* Animated Character */}
      <Lottie
        animationData={motivation}
        loop
        style={{ width: 120, marginRight: "15px" }}
      />

      {/* Speech Bubble */}
      <div
        className="p-3 rounded-4 shadow-sm"
        style={{
          backgroundColor: "#fff",
          border: "2px solid #9b5de5",
          maxWidth: "300px",
          fontStyle: "italic",
          position: "relative",
        }}
      >
        <p className="mb-0" style={{ color: "#333" }}>
          {quote}
        </p>
      </div>
    </div>
  ) : (
    <div style={{ width: "250px", height: "250px" }}>
      <Lottie
        animationData={
          mode === "work"
            ? working
            : mode === "break-meditation"
            ? meditation
            : mode === "break-chai"
            ? chai
            : working
        }
        loop
        style={{ width: 250, margin: "0 auto" }}
      />
    </div>
  )}
</div>
</div>
    </div>
);
};

export default Timer;