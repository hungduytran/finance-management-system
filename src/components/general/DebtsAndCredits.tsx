import { useQuery } from "@tanstack/react-query";
import { cn } from "../../lib/utils";
import LoanService from "../../services/LoanService";
import type { LoanType } from "../../types/loans";
import DebtCreditCard from "./DebtCreditCard";
import GeneralCard from "./GeneralCard";

const getLoans = async () => {
  const res = await LoanService.getLoans();
  return res.data.data;
};

const DebtsAndCredits = () => {
  const { data: loans } = useQuery({
    queryKey: ["loans"],
    queryFn: () => getLoans(),
  });
  return (
    <GeneralCard>
      <h3 className="mb-4 text-[0.875rem] font-bold">
        Các khoản vay / Cho vay
      </h3>
      <div className="space-y-4">
        {loans &&
          loans
            ?.slice(0, 3)
            .map((loan: LoanType) => (
              <DebtCreditCard key={loan.id} data={loan} />
            ))}
        <p
          className={cn(
            "flex justify-center",
            loans?.length > 0 ? "hidden" : "flex",
          )}
        >
          Không tìm thấy khoản vay
        </p>
      </div>
    </GeneralCard>
  );
};

export default DebtsAndCredits;
