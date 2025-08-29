import React from "react";
import StatCard from "./StatCard";
import PieChart from "./PieChart";
import Advice from "./Advice";
import Predictions from "./Predictions";

const Dashboard = () => {

    const stats = {
    totalFocusTime: 120, // in minutes
    totalBreakTime: 40,
    sessionsCompleted: 5,
    averageFocusTime: 24,
    };
  return (
    <div
        className="card shadow-lg p-4 rounded-4 text-center"
        style={{
          maxWidth: "1520px",
          width: "100%",
          borderColor: "#9b5de5",
          borderWidth: "2px",
          padding: "20px",
        }}
      >

    {/* Stat Cards */}  
    <h2>Welcome to your productivity dashboard! 🎯</h2>
    <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
    <StatCard label="Focus Time" value={`${stats.totalFocusTime} min`} />
    <StatCard label="Break Time" value={`${stats.totalBreakTime} min`} />
    <StatCard label="Sessions Completed" value={stats.sessionsCompleted} />
    <StatCard label="Avg. Focus" value={`${stats.averageFocusTime} min`} />
    </div>

    {/* Pie Chart */}
    <div style={{ display: "flex", gap: "40px", marginTop: "40px" }}>
    <div style={{ width: "400px" }}>
        <h2>Focus vs Break</h2>
        <PieChart
        focus={stats.totalFocusTime}
        breakTime={stats.totalBreakTime}
        />
    </div>

    {/* Advice Section */}
    <div style={{ flex: 1 }}>
    <Advice
      focus={stats.totalFocusTime}
      breakTime={stats.totalBreakTime}
      avgFocus={stats.averageFocusTime}
      sessions={stats.sessionsCompleted}
    />

    {/* Predictions Section */}
    <Predictions
      focus={stats.totalFocusTime}
      breakTime={stats.totalBreakTime}
      sessions={stats.sessionsCompleted}
    />
  </div>
</div>
</div>
  );
};

export default Dashboard;