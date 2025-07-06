import { Divider } from "@mui/material";
import type { ChartData } from "chart.js";
import clsx from "clsx";
import { cn, formatPrice } from "../../lib/utils";
import { DownArrow, UpArrow } from "../../routes/General";
import type { TransactionType } from "../../types/transaction";
import DoughnutChart from "../chart/DoughnutChart";
import GeneralCard from "./GeneralCard";

interface ThisMonthProps {
  data: TransactionType[];
}

const ThisMonth = ({ data }: ThisMonthProps) => {
  const totalIncome = data
    ? data.reduce(
        (acc, transaction) =>
          transaction.type === "INCOME" ? acc + transaction.amount : acc,
        0,
      )
    : 0;

  const totalExpense = data
    ? data.reduce(
        (acc, transaction) =>
          transaction.type === "EXPENSE" ? acc + transaction.amount : acc,
        0,
      )
    : 0;

  const chartData: ChartData<"doughnut"> = {
    datasets: [
      {
        data: [
          totalIncome === 0 && totalExpense === 0 ? 1 : totalIncome,
          totalExpense,
        ],
        backgroundColor: ["rgba(76, 175, 80, 1)", "rgba(244, 67, 54, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <GeneralCard className="flex h-full w-full flex-row gap-4 text-[1.125rem]">
      <div
        className={clsx(
          "aspect-square h-full",
          "max-w-[10rem] xl:max-w-[7.5rem] 2xl:max-w-[9rem]",
        )}
      >
        <DoughnutChart
          key={`doughnut-${JSON.stringify(data)}`}
          data={chartData}
        />
      </div>
      <div className="w-full space-y-2">
        <h3 className="mb-4 text-[0.875rem] font-bold">Tháng này</h3>
        <div className="flex flex-row items-center justify-between text-[#4CAF50]">
          <UpArrow />
          <span>{formatPrice(totalIncome)}</span>
        </div>
        <div className="flex flex-row items-center justify-between text-[#f44336]">
          <DownArrow />
          <span>{formatPrice(totalExpense)}</span>
        </div>
        <div className="flex w-full justify-end">
          <Divider sx={{ width: "50%" }} orientation="horizontal" flexItem />
        </div>
        <div
          className={cn(
            "flex w-full justify-end",
            totalIncome - totalExpense >= 0
              ? "text-[#4CAF50]"
              : "text-[#f44336]",
          )}
        >
          <span>{formatPrice(totalIncome - totalExpense)}</span>
        </div>
      </div>
    </GeneralCard>
  );
};

export default ThisMonth;
