import React, { useEffect, useState } from "react";

const Advice = ({ focus, breakTime, avgFocus, sessions }) => {
  const [advice, setAdvice] = useState("Loading advice...");

  useEffect(() => {
    let didCancel = false;
    let errorTimer;

    const fetchAdvice = async () => {
      try {
        const response = await fetch("/api/getAdvice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ focus, breakTime, avgFocus, sessions }),
        });
        const data = await response.json();
        if (!didCancel) {
          setAdvice(data.advice);
          clearTimeout(errorTimer);
        }
      } catch (err) {
        if (!didCancel) {
          // wait 5 seconds before showing error
          errorTimer = setTimeout(() => {
            setAdvice("Could not fetch advice. Please try again later.");
          }, 5000);
        }
      }
    };

    fetchAdvice();

    return () => {
      didCancel = true;
      clearTimeout(errorTimer);
    };
  }, [focus, breakTime, avgFocus, sessions]);

  return (
    <div style={{ marginTop: "40px", padding: "20px", border: "1px solid #e893e1ff", borderRadius: "10px" }}>
      <h2>Advice 💡</h2>
      <p>{advice}</p>
    </div>
  );
};

export default Advice;