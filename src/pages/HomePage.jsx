import { useNavigate } from "react-router-dom";
import { useState } from "react";
import names from "../random_names.json";
import Lottie from "lottie-react";
import catAnimation from "../assets/animations/blue_cat.json";

const HomePage = () => {
  const [name, setName] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);

  const navigate = useNavigate();

  // function to pick random names
  const giveRandomName = () => {
    const randomName = Math.floor(Math.random() * names.length);
    setName(names[randomName]);
  };

  // navigate to timer
  const handleStart = () => {
    navigate("/timer", {
      state: {
        name,
        hours,
        minutes,
      },
    });
  };

  return (
      <div
        className="card shadow-lg p-4 rounded-4 text-center"
        style={{
          maxWidth: "520px",
          width: "100%",
          borderColor: "#9b5de5",
          borderWidth: "2px",
        }}
      >
        {/* Focus Timer Title */}
        <h2 className="mb-3" style={{ color: "#9b5de5", fontWeight: "600" }}>
          Welcome to Focus Timer 💜
        </h2>

        {/* Name input */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Provide your name! 🙂"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control text-center"
          />
        </div>

        {/* Button for providing random name */}
        <div className="d-flex justify-content-center mb-4">
          <button
            className="btn"
            style={{ backgroundColor: "#9b5de5", color: "white" }}
            onClick={giveRandomName}
          >
            Set a Random Name
          </button>
        </div>

        {/* Hours & Minutes input */}
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Hours</label>
            <input
              type="number"
              min="0"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="form-control text-center"
            />
          </div>
          <div className="col">
            <label className="form-label">Minutes</label>
            <input
              type="number"
              min="0"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="form-control text-center"
            />
          </div>
        </div>

        {/* Display chosen time */}
        <p className="mb-4" style={{ color: "#555" }}>
          You set: <strong>{hours}</strong> hours and{" "}
          <strong>{minutes}</strong> minutes
        </p>

        {/* Start Timer Button */}
        <button
          onClick={handleStart}
          className="btn w-100 mb-4"
          style={{ backgroundColor: "#9b5de5", color: "white" }}
        >
          Start Timer
        </button>

        {/* Cat Animation */}
        <div className="text-center">
          <Lottie
            animationData={catAnimation}
            loop
            style={{ width: 150, margin: "0 auto" }}
          />
        </div>
      </div>
  );
};

export default HomePage;