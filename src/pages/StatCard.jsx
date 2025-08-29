import React from "react";

const StatCard = ({label, value}) => {
    return (
        <div
            style={{
            border: "1px solid #eb97ddff",
            borderRadius: "10px",
            padding: "20px",
            textAlign: "center",
            flex: 1,
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
        >
            <h3 style={{ marginBottom: "10px" }}>{label}</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>{value}</p>
        </div>
    );
};

export default StatCard;
