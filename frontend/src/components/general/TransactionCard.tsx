import { icons } from "../../data/icons";
import { cn, formatISODate, formatPrice } from "../../lib/utils";
import type { TransactionType } from "../../types/transaction";

interface TransactionCardProps {
  data: TransactionType;
}

const TransactionCard = ({ data }: TransactionCardProps) => {
  return (
    <div className="flex w-full flex-row gap-4 text-[0.875rem] leading-[1.375]">
      <img
        src={icons[data.category.image]}
        alt="category icon"
        className="size-12 rounded-[6.25rem]"
      />
      <div className="my-auto">
        <p>{data.category.name}</p>
        <p>{data.accountTransaction.name}</p>
      </div>
      <div className="my-auto ml-auto text-right">
        <p>
          {data.type === "EXPENSE" && "-"}
          {formatPrice(data.amount)}
        </p>
        <p>{formatISODate(data.transactionDate)}</p>
      </div>
      <div
        className={cn(
          "max-w-[5px] grow-1",
          data.type === "INCOME" ? "bg-[#4CAF50]" : "bg-[#F44336]",
        )}
      />
    </div>
  );
};

export default TransactionCard;
