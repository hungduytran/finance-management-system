import clsx from "clsx";
import { formatISODate, formatPrice } from "../../lib/utils";
import type { LoanType } from "../../types/loans";
import credit from "/src/assets/credit.svg";
import debt from "/src/assets/debt.svg";

interface DebtCreditCardProps {
  data: LoanType;
}

const DebtCreditCard = ({ data }: DebtCreditCardProps) => {
  const progress = Math.round((data.paidAmount / data.totalAmount) * 100);

  return (
    <div className="w-full">
      <h4 className="mb-1 text-[1.25rem]">
        {data.type === "DEBT"
          ? `Khoản vay: ${data.lenderName} ➜ Bạn`
          : `Cho vay: Bạn ➜ ${data.lenderName}`}
      </h4>
      <div className="flex flex-row gap-4">
        <img
          src={data.type === "DEBT" ? debt : credit}
          alt="Card image"
          className="size-12 rounded-[6.25rem]"
        />
        <div className="flex w-full flex-col items-center justify-center gap-1 text-[0.8rem]">
          <div className="flex w-full flex-row items-center justify-between">
            <p>{formatISODate(data.borrowedDate)}</p>
            <p>{`${progress}%`}</p>
            <p>{formatISODate(data.dueDate)}</p>
          </div>
          <div className="h-[9px] w-[97.5%] rounded-[0.25rem] bg-[#E9ECEF]">
            <div
              className={clsx(
                "h-full rounded-[0.25rem]",
                data.type === "DEBT" ? "bg-[#F44336]" : "bg-[#4CAF4F]",
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex w-full flex-row items-center justify-between">
            <p>{formatPrice(0)}</p>
            <p>{formatPrice(data.paidAmount)}</p>
            <p>{formatPrice(data.totalAmount)}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <p>
          Số dư:{" "}
          <span
            className={clsx(
              "text-[0.875rem]",
              data.type === "DEBT" ? "text-[#FF0000]" : "text-[#008000]",
            )}
          >
            {formatPrice(data.totalAmount - data.paidAmount)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default DebtCreditCard;
