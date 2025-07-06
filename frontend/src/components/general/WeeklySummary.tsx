import type { ChartData } from "chart.js";
import BarChart from "../chart/BarChart";
import GeneralCard from "./GeneralCard";

interface WeeklySummaryProps {
  weeklySummaryData: {
    labels: string[];
    income: number[];
    expense: number[];
  };
}

const WeeklySummary = ({ weeklySummaryData }: WeeklySummaryProps) => {
  const chartData: ChartData<"bar"> = {
    labels: weeklySummaryData?.labels as string[],
    datasets: [
      {
        data: weeklySummaryData?.income as number[],
        backgroundColor: "#4CAF50",
        borderRadius: 0,
        borderSkipped: false,
        datalabels: {
          display: false,
        },
      },
      {
        data: weeklySummaryData?.expense as number[],
        backgroundColor: "#F44336",
        borderRadius: 0,
        borderSkipped: false,
        datalabels: {
          display: false,
        },
      },
    ],
  };
  return (
    <GeneralCard>
      <h3 className="mb-4 text-[0.875rem] font-bold">7 ngày qua</h3>
      <BarChart data={chartData} />
    </GeneralCard>
  );
};

export default WeeklySummary;
