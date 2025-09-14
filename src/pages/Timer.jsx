import Lottie from "lottie-react";
import working from "../assets/animations/working.json";
import motivation from "../assets/animations/motivation.json";
import chai from "../assets/animations/chai.json";
import meditation from "../assets/animations/meditation.json";
import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import quotes from "../motivation_quotes.json";

const BREAKS = {
  "break-meditation": 0.1 * 60, // 5 min
  "break-chai": 0.1 * 60,      // 15 min
};

const Timer = () => {
  const location = useLocation();
  const { name, hours, minutes } = location.state || {};
  const totalSeconds = hours * 3600 + minutes * 60;

  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [timeRun, setTimeRun] = useState(true);
  const [mode, setMode] = useState("work");
  const [quote, setQuote] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [sessionStopped, setSessionStopped] = useState(false);
  const [remainingWorkTime, setRemainingWorkTime] = useState(totalSeconds);
  const intervalRef = useRef(null);

  // Start session on mount
  useEffect(() => {
    const startSession = async () => {
      try {
        const res = await fetch("/api/session/start", { method: "POST", credentials: "include" });
        const data = await res.json();
        setSessionId(data.id);
      } catch (err) {
        console.error(err);
      }
    };
    startSession();
  }, []);

  // Countdown
  useEffect(() => {
    if (!timeRun) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;

        if (mode === "work" && newTime > 0 && newTime % 900 === 0) {
          const randomQuote = Math.floor(Math.random() * quotes.length);
          setQuote(quotes[randomQuote]);
          setTimeout(() => setQuote(""), 10000);
        }

        // Break finished -> resume work
        if (mode !== "work" && newTime <= 0) {
          setMode("work");
          setTimeLeft(remainingWorkTime);
        }

        // Work finished
        if (mode === "work" && newTime <= 0) {
          handleStop(true);
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [timeRun, mode, remainingWorkTime]);

  const handleStop = async (autoStop = false) => {
    setTimeRun(false);
    setSessionStopped(true);
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (sessionId) {
      try {
        await fetch("/api/session/stop", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, autoStop }),
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const startBreak = async (breakType) => {
    setRemainingWorkTime(timeLeft);
    setMode(breakType);
    setTimeLeft(BREAKS[breakType]);
    setTimeRun(true);

    // Record break counter
    try {
      await fetch("/api/session/break", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: breakType === "break-meditation" ? "meditation" : "chai" }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4 rounded-4 text-center" style={{ maxWidth: "500px", width: "100%", borderColor: "#9b5de5" }}>
        <h1 className="mb-4" style={{ color: "#9b5de5" }}>Hi {name}! Let's start! 💜</h1>

        <p className="fs-3 fw-bold" style={{ color: "#333" }}>
          ⏳ Time Left: <span style={{ color: "#9b5de5" }}>{formatTime(timeLeft)}</span>
        </p>

        {/* Work controls */}
        {mode === "work" && (
          <>
            <div className="d-flex justify-content-center gap-2 mb-3">
              {timeRun && <button className="btn" style={{ backgroundColor:"#e63946", color:"white", minWidth:"120px"}} onClick={() => handleStop(false)}>Stop</button>}
              {!timeRun && !sessionStopped && <button className="btn" style={{ backgroundColor:"#9b5de5", color:"white", minWidth:"120px"}} onClick={() => setTimeRun(true)}>Resume</button>}
              <button className="btn btn-outline-secondary" style={{ minWidth:"120px"}} disabled={timeLeft>0 && !sessionStopped} onClick={() => { setTimeLeft(totalSeconds); setMode("work"); setTimeRun(false); setSessionStopped(false); }}>Reset</button>
            </div>

            <div className="d-flex justify-content-center gap-2">
              <button className="btn" style={{ backgroundColor:"#6bcb77", color:"white", minWidth:"120px"}} onClick={() => startBreak("break-meditation")}>🧘 Meditate</button>
              <button className="btn" style={{ backgroundColor:"#f77f00", color:"white", minWidth:"120px"}} onClick={() => startBreak("break-chai")}>🍵 Have Chai</button>
            </div>
          </>
        )}

        {/* Animation / Quote */}
        <div className="mt-4 d-flex justify-content-center align-items-center" style={{ minHeight:"280px" }}>
          {quote && mode === "work" ? (
            <div className="d-flex align-items-center justify-content-center">
              <Lottie animationData={motivation} loop style={{ width:120, marginRight:"15px" }} />
              <div className="p-3 rounded-4 shadow-sm" style={{ backgroundColor:"#fff", border:"2px solid #9b5de5", maxWidth:"300px", fontStyle:"italic" }}>
                <p className="mb-0" style={{ color:"#333" }}>{quote}</p>
              </div>
            </div>
          ) : (
            <div style={{ width:"250px", height:"250px" }}>
              <Lottie animationData={mode === "work" ? working : mode === "break-meditation" ? meditation : chai} loop style={{ width:250, margin:"0 auto"}} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timer;