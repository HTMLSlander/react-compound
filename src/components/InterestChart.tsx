import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { ReactElement } from "react";
import type React from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface InterestChartProps {
  labels: Array<string | number>;
  arrYears?: Array<string | number>;
}

const InterestChart: React.FC<InterestChartProps> = ({
  labels,
  arrYears,
}): ReactElement => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
      title: {
        display: true,
      },
    },
  };
  const data = {
    labels,
    datasets: [
      {
        label: "Current interest gained",
        data: arrYears,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return <Line options={options} data={data} className="size-fit text-2xl" />;
};

export default InterestChart;
