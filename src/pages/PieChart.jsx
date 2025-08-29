import React from "react";
import {Pie} from "react-chartjs-2";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ focus, breakTime }) => {
  const data = {
    labels: ["Focus Time", "Break Time"],
    datasets: [
      {
        data: [focus, breakTime],
        backgroundColor: ["#8e44ad", "#27ae60"],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={data} />;
};

export default PieChart;