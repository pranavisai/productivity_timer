import React, { useEffect, useState } from "react";

const Predictions = ({ focus, breakTime, sessions }) => {
  const [prediction, setPrediction] = useState("Loading prediction...");
  const [errorShown, setErrorShown] = useState(false);

  useEffect(() => {
    let setCancel = false;
    let errorTimer;

    const fetchPrediction = async () => {
      try {
        const response = await fetch("/api/getPrediction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ focus, breakTime, sessions }),
        });
        const data = await response.json();

        if (!setCancel) {
          setPrediction(data.prediction);
          clearTimeout(errorTimer);
        }
      } catch (err) {
        if (!setCancel) {
          // wait 5s before showing error
          errorTimer = setTimeout(() => {
            setPrediction("Could not fetch prediction. Please try again later.");
            setErrorShown(true);
          }, 5000);
      }
    }
    };

    fetchPrediction();
     return () => {
      setCancel = true;
      clearTimeout(errorTimer);
    };
  }, [focus, breakTime, sessions]);

  return (
    <div style={{ marginTop: "40px", padding: "20px", border: "1px solid #e893e1ff", borderRadius: "10px" }}>
      <h2>Prediction for coming week 📈</h2>
      <p>{prediction}</p>
    </div>
  );
};

export default Predictions;
