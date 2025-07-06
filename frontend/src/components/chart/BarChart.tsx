import { useColorScheme } from "@mui/material";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  type ChartData,
  type TooltipItem,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import {
  formatISODate,
  formatLargeNumber,
  formatPrice,
  isISODateString,
} from "../../lib/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

interface BarChartProps {
  data: ChartData<"bar">;
}

const BarChart = ({ data }: BarChartProps) => {
  const { mode } = useColorScheme();
  if (!mode) {
    return null;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      datalabels: {
        display: true,
      },
      tooltip: {
        callbacks: {
          title: (context: { label: string }[]) => {
            const label = context[0]?.label ?? "";
            if (typeof label === "string" && isISODateString(label)) {
              return formatISODate(label);
            }
            return label;
          },
          label: (context: TooltipItem<"bar">) => {
            return `${formatPrice(context.raw as number)}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "category" as const,
        ticks: {
          color: mode === "dark" ? "#F2F2F2" : "#333",
          callback: function (
            value: string | number,
          ): string | number | null | undefined {
            const label =
              typeof value === "number" && data.labels
                ? data.labels[value]
                : value;
            if (typeof label === "string" && isISODateString(label)) {
              return formatISODate(label);
            }
            return label as string | number;
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: mode === "dark" ? "#F2F2F2" : "#333",
          callback: function (tickValue: string | number) {
            return formatLargeNumber(Number(tickValue)) + " đ";
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} plugins={[ChartDataLabels]} />;
};

export default BarChart;
