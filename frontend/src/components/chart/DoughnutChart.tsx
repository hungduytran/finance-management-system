import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
  type ChartData,
  type TooltipItem,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  ChartDataLabels,
  CategoryScale,
  LinearScale,
);

interface DoughnutChartProps {
  data: ChartData<"doughnut">;
}

const DoughnutChart = ({ data }: DoughnutChartProps) => {
  const options = {
    plugins: {
      datalabels: {
        color: "#fff",
        formatter: (value: number, context: { chart: ChartJS }) => {
          const data = context.chart.data.datasets[0].data as number[];
          const total = data.reduce((acc: number, val: number) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"doughnut">) {
            const value = context.raw as number;
            const data = context.chart.data.datasets[0].data as number[];
            const total = data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${percentage}%`;
          },
        },
      },
    },
  };
  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;
