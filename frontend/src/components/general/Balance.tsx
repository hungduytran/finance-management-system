import LineChart from "../chart/LineChart";
import GeneralCard from "./GeneralCard";

interface BalanceProps {
  data: {
    labels: string[];
    balances: number[];
  };
}

const Balance = ({ data }: BalanceProps) => {
  const chartData = {
    labels: data ? data.labels : [],
    datasets: [
      {
        label: "Số dư",
        data: data ? data.balances : [],
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        pointBackgroundColor: "#2196f3",
        fill: true,
        tension: 0.1,
      },
    ],
  };
  return (
    <GeneralCard className="text-[1.25rem]">
      <h3 className="mb-4 text-[0.875rem] font-bold">Số dư</h3>
      <div className="h-[15rem]">
        <LineChart key={`line-${JSON.stringify(chartData)}`} data={chartData} />
      </div>
    </GeneralCard>
  );
};

export default Balance;
