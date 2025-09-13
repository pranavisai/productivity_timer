import React, {useState, useEffect} from "react";
import StatCard from "./StatCard";
import PieChart from "./PieChart";
import Advice from "./Advice";
import Predictions from "./Predictions";

const Dashboard = () => {

    
    const [stats, setStats] = useState({
    totalFocusTime: 0,
    totalBreakTime: 0,
    sessionsCompleted: 0,
    averageFocusTime: 0,
        });

    useEffect(() => {
    const fetchStats = async () => {
    try {
       // Get logged-in user
        const userRes = await fetch("http://localhost:5050/api/me", {
          credentials: "include",
        });
        if (!userRes.ok) throw new Error("Not logged in");
        const user = await userRes.json();

        // Get stats for this user
        const statsRes = await fetch(
          `http://localhost:5050/api/stats/${user.googleId}`,
          { credentials: "include" }
        );
      const data = await statsRes.json();

      setStats({
        totalFocusTime: Math.round(data.total_focus_seconds / 60),
        totalBreakTime: Math.round(data.total_break_seconds / 60),
        sessionsCompleted: data.sessions_completed,
        averageFocusTime: Math.round(data.avg_focus_seconds / 60),
        });
        } catch (err) {
        console.error("Failed to fetch stats:", err);
        }
    };

    fetchStats();
    }, []);

    const hasStats = stats.sessionsCompleted > 0; // to check in case the user stats are zero

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

    <div style={{ flex: 1 }}>
    {/* Advice Section */}
    {hasStats ? (
        <Advice
        focus={stats.totalFocusTime}
        breakTime={stats.totalBreakTime}
        avgFocus={stats.averageFocusTime}
        sessions={stats.sessionsCompleted}
        />
    ) : (
        <div style={{ marginTop: "40px", padding: "20px", border: "1px solid #e893e1ff", borderRadius: "10px" }}>
            <h2>Advice 💡</h2>
            <p>No focus sessions yet. Start your first session to get some advice!</p>
        </div>
    )}

    {/* Predictions Section */}
    {hasStats ? (
        <Predictions
        focus={stats.totalFocusTime}
        breakTime={stats.totalBreakTime}
        sessions={stats.sessionsCompleted}
        />
    ) : (
        <div style={{ marginTop: "40px", padding: "20px", border: "1px solid #e893e1ff", borderRadius: "10px" }}>
            <h2>Prediction for coming week 📈</h2>
            <p>No focus sessions yet. Start your first session to see your predictions!</p>
        </div>
    )}
    </div>
</div>
</div>
  );
};

export default Dashboard;