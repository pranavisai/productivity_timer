import React, {useRef, useEffect, useState} from "react";
import Lottie from "lottie-react";
import loginAnimation from "../assets/animations/login_animation.json";

const LoginPage = () => {
    const textRef = useRef(null);
    const [textHeight, setTextHeight] = useState(0);

    useEffect(() => {
        if (textRef.current) {
        setTextHeight(textRef.current.offsetHeight);
        }
        const handleResize = () => {
        if (textRef.current) setTextHeight(textRef.current.offsetHeight);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow-lg p-4 rounded-4 text-center"
        style={{ maxWidth: "500px", width: "100%", borderColor: "#9b5de5" }}
      >
        {/* Title */}
        <h2 className="mb-4" style={{ color: "#9b5de5", fontWeight: "600" }}>
          Welcome to Focus Timer 💜
        </h2>

        <div className="d-flex mb-3" style={{ gap: "2px", alignItems: "flex-start" }}>
          {/* Rules text */}
          <div ref={textRef} className="text-start" style={{ color: "#555", flex: 1 }}>
            <h5 style={{ color: "#9b5de5", marginBottom: "12px" }}>Before you start:</h5>
            <ul style={{ paddingLeft: "20px" }}>
              <li>Provide your focus and break times accurately for better predictions.</li>
              <li>Login with Google is used only to save your progress.</li>
              <li>I hope you have as much fun using it as I did making it.</li>
            </ul>
          </div>

          {/* Lottie Animation */}
          <div style={{ width: "200px", height: textHeight }}>
            <Lottie animationData={loginAnimation} loop style={{ height: "90%" }} />
          </div>
        </div>

        {/* Google Login Button */}
        <a href="http://localhost:5050/auth/google">
          <button
            className="btn w-100"
            style={{
              backgroundColor: "#9b5de5",
              color: "white",
              padding: "10px 0",
              fontSize: "1.1rem",
              fontWeight: "500",
            }}
          >
            Login with Google
          </button>
        </a>

        {/* Optional: small note */}
        <p className="mt-3 mb-0" style={{ fontSize: "0.9rem", color: "#777" }}>
          We will never share your data publicly.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;