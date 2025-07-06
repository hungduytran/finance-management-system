import { icons } from "../../data/icons";
import { cn, formatPrice, getDaysInMonth } from "../../lib/utils";
import type { BudgetType } from "../../types/budget";

interface BudgetCardProps {
  data: BudgetType;
}

const BudgetCard = ({ data }: BudgetCardProps) => {
  const progress = Math.round((data.sentAmount / data.amount) * 100);
  const remaining = data.amount - data.sentAmount;
  return (
    <div className="w-full">
      <h4 className="text-[1.25rem]">{data.category.name}</h4>
      <div className="flex flex-row gap-4">
        <img
          src={icons[data.category.image]}
          alt=""
          className="size-12 rounded-[6.25rem]"
        />
        <div className="flex w-full flex-col items-center justify-center gap-1 text-[0.8rem]">
          <div className="flex w-full flex-row items-center justify-between">
            <p>{`1/${data.month}/${data.year}`}</p>
            <p>{`${progress}%`}</p>
            <p>{`${getDaysInMonth(data.month, data.year)}/${data.month}/${data.year}`}</p>
          </div>
          <div className="h-[9px] w-[97.5%] rounded-[0.25rem] bg-[#E9ECEF]">
            <div
              className="h-full rounded-[0.25rem] bg-[#4CAF4F]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex w-full flex-row items-center justify-between">
            <p>{formatPrice(0)}</p>
            <p>{formatPrice(data.sentAmount)}</p>
            <p>{formatPrice(data.amount)}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <p>
          Số dư:{" "}
          <span
            className={cn(
              "text-[0.875rem]",
              remaining < 0 ? "text-[#FF0000]" : "text-[#008000]",
            )}
          >
            {formatPrice(remaining)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default BudgetCard;
