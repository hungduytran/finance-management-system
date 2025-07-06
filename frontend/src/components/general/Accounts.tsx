import { Divider } from "@mui/material";
import { cn, formatPrice } from "../../lib/utils";
import type { AccountType } from "../../types/accounts";
import GeneralCard from "./GeneralCard";

interface AccountsProps {
  accounts: AccountType[];
}

const Accounts = ({ accounts }: AccountsProps) => {
  return (
    <GeneralCard className="text-[1.25rem]">
      <h3 className="mb-4 text-[0.875rem] font-bold">Các tài khoản</h3>
      {accounts &&
        accounts?.map((account: AccountType, index) => (
          <div key={account.id}>
            <AccountCard {...account} />
            <Divider
              sx={{
                margin: "0.5rem 0",
                display: index === accounts.length - 1 ? "none" : "block",
              }}
              orientation="horizontal"
              flexItem
            />
          </div>
        ))}
      <p
        className={cn(
          "flex justify-center text-base",
          accounts?.length > 0 ? "hidden" : "flex",
        )}
      >
        Không tìm thấy tài khoản
      </p>
    </GeneralCard>
  );
};

export default Accounts;

const AccountCard = (account: AccountType) => {
  return (
    <div className="flex flex-row items-start justify-between">
      <p>{account.name}</p>
      <div className="flex flex-col items-end text-[0.875rem]">
        <span
          className={account.balance < 0 ? "text-[#F44336]" : "text-[#4CAF50]"}
        >
          {formatPrice(account.balance)}
        </span>
        <p>VND - ₫</p>
      </div>
    </div>
  );
};
