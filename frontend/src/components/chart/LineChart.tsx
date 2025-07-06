import { useColorScheme } from "@mui/material";
import {
  Chart as ChartJS,
  registerables,
  type ChartData,
  type ChartOptions,
  type TooltipItem,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Line } from "react-chartjs-2";
import {
  formatISODate,
  formatLargeNumber,
  formatPrice,
  isISODateString,
} from "../../lib/utils";

ChartJS.register(...registerables, ChartDataLabels);

interface LineChartProps {
  data: ChartData<"line">;
}

const LineChart = ({ data }: LineChartProps) => {
  const { mode } = useColorScheme();
  if (!mode) {
    return null;
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            const label = context[0]?.label ?? "";
            if (typeof label === "string" && isISODateString(label)) {
              return formatISODate(label);
            }
            return label;
          },
          label: (context: TooltipItem<"line">) => {
            return `${context.dataset.label}: ${formatPrice(context.raw as number)}`;
          },
        },
      },
      datalabels: {
        display: false,
        color: mode === "dark" ? "#F2F2F2" : "#333",
        align: "top",
        formatter: (value: number) => formatLargeNumber(value),
      },
    },
    scales: {
      x: {
        type: "category",
        ticks: {
          color: mode === "dark" ? "#F2F2F2" : "#333",
          callback: function (
            value: string | number,
            index: number,
          ): string | number | null | undefined {
            const label = this.getLabelForValue
              ? this.getLabelForValue(value as number)
              : (data.labels?.[index] ?? "");
            if (typeof label === "string" && isISODateString(label)) {
              return formatISODate(label);
            }
            return label as string | number;
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        type: "linear",
        beginAtZero: false,
        ticks: {
          color: mode === "dark" ? "#F2F2F2" : "#333",
          callback: (tickValue: string | number) => {
            if (typeof tickValue === "number") {
              return `${formatLargeNumber(tickValue)} ₫`;
            }
            return tickValue;
          },
        },
        grid: {
          color: "#eee",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
