import clsx from "clsx";
import { formatISODate, formatPrice } from "../../lib/utils";
import type { LoanType } from "../../types/loans";
import LoanDeleteButton from "./LoanDeleteButton";
import LoanEditDialog from "./LoanEditDialog";
import credit from "/src/assets/credit.svg";
import debt from "/src/assets/debt.svg";

interface LoanCardProps {
  loan: LoanType;
  onSuccess: () => void;
}

const LoanCard = ({ loan, onSuccess }: LoanCardProps) => {
  const progress = Math.round((loan.paidAmount / loan.totalAmount) * 100);

  return (
    <div className="w-full">
      <h4 className="mb-1 text-[1.25rem]">
        {loan.type === "DEBT"
          ? `Khoản vay: ${loan.lenderName} ➜ Bạn`
          : `Cho vay: Bạn ➜ ${loan.lenderName}`}
      </h4>
      <div className="flex flex-row gap-4">
        <img
          src={loan.type === "DEBT" ? debt : credit}
          alt="Card image"
          className="size-12 rounded-[6.25rem]"
        />
        <div className="flex w-full flex-col items-center justify-center gap-1 text-[0.8rem]">
          <div className="flex w-full flex-row items-center justify-between">
            <p>{formatISODate(loan.borrowedDate)}</p>
            <p>{`${progress}%`}</p>
            <p>{formatISODate(loan.dueDate)}</p>
          </div>
          <div className="h-[9px] w-[97.5%] rounded-[0.25rem] bg-[#E9ECEF]">
            <div
              className={clsx(
                "h-full rounded-[0.25rem]",
                loan.type === "DEBT" ? "bg-[#F44336]" : "bg-[#4CAF4F]",
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex w-full flex-row items-center justify-between">
            <p>{formatPrice(0)}</p>
            <p>{formatPrice(loan.paidAmount)}</p>
            <p>{formatPrice(loan.totalAmount)}</p>
          </div>
        </div>
      </div>
      <p>
        Số dư:{" "}
        <span
          className={clsx(
            "text-[0.875rem]",
            loan.type === "DEBT" ? "text-[#FF0000]" : "text-[#008000]",
          )}
        >
          {formatPrice(loan.totalAmount - loan.paidAmount)}
        </span>
      </p>
      <div className="flex flex-row items-center justify-end gap-2">
        <LoanEditDialog loan={loan} onSuccess={onSuccess} />
        <LoanDeleteButton loan={loan} onSuccess={onSuccess} />
      </div>
    </div>
  );
};

export default LoanCard;
