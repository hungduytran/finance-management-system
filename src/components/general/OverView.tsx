import { Divider } from "@mui/material";
import { cn, formatPrice } from "../../lib/utils";
import type { AccountType } from "../../types/accounts";
import GeneralCard from "./GeneralCard";

interface OverViewProps {
  accounts: AccountType[];
}

const OverView = ({ accounts }: OverViewProps) => {
  const getBalance = () => {
    if (!accounts) return 0;
    return accounts?.reduce((acc: number, account: AccountType) => {
      if (account.balance >= 0) {
        return acc + account.balance;
      }
      return acc;
    }, 0);
  };

  const getCredit = () => {
    if (!accounts) return 0;
    return accounts?.reduce((acc: number, account: AccountType) => {
      if (account.balance < 0) {
        return acc + account.balance;
      }
      return acc;
    }, 0);
  };
  return (
    <GeneralCard className="space-y-2 text-[1.125rem]">
      <h3 className="mb-4 text-[0.875rem] font-bold">Sơ lược</h3>
      <div className="flex flex-row items-center justify-between">
        <p>Số dư:</p>
        <span className="text-[#4CAF50]">{formatPrice(getBalance())}</span>
      </div>
      <div className="flex flex-row items-center justify-between">
        <p>Thẻ tín dụng:</p>
        <span className="text-[#f44336]">{formatPrice(getCredit())}</span>
      </div>
      <div className="flex w-full justify-end">
        <Divider sx={{ width: "50%" }} orientation="horizontal" flexItem />
      </div>
      <div
        className={cn(
          "flex w-full justify-end",
          getBalance() + getCredit() >= 0 ? "text-[#4CAF50]" : "text-[#f44336]",
        )}
      >
        <span>{formatPrice(getBalance() + getCredit())}</span>
      </div>
    </GeneralCard>
  );
};

export default OverView;
