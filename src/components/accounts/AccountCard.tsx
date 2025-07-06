import { Card } from "@mui/material";
import { cn, formatPrice } from "../../lib/utils";
import type { AccountType } from "../../types/accounts";
import AccountDeleteButton from "./AccountDeleteButton";
import { AccountEditDialog } from "./AccountEditDialog";

interface AccountCardProps {
  account: AccountType;
  onSuccess: () => void;
}

const AccountCard = ({ account, onSuccess }: AccountCardProps) => {
  return (
    <Card className="bg-card text-card-foreground flex w-full flex-row items-start justify-between rounded-lg border p-6 shadow-sm">
      <div className="max-w-[60%]">
        <h3 className="text-lg font-semibold">{account.name}</h3>
        <p className="text-muted-foreground text-sm">{account.description}</p>
      </div>
      <div className="text-right">
        <p
          className={cn(
            "text-[1.25rem] font-medium",
            account.balance >= 0 ? "text-[#4CAF50]" : "text-[#F44336]",
          )}
        >
          {formatPrice(account.balance)}
        </p>
        <div className="flex flex-row items-center justify-end gap-2">
          <AccountEditDialog account={account} onSuccess={onSuccess} />
          <AccountDeleteButton account={account} onSuccess={onSuccess} />
        </div>
      </div>
    </Card>
  );
};

export default AccountCard;
