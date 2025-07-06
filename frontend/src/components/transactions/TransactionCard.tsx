import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { Checkbox, Popover } from "@mui/material";
import { useState } from "react";
import { icons } from "../../data/icons";
import { cn, formatISODate, formatPrice } from "../../lib/utils";
import type { AccountType } from "../../types/accounts";
import type { CategoryType } from "../../types/category";
import type { TransactionType } from "../../types/transaction";
import TransactionDeleteDialog from "./TransactionDeleteDialog";
import TransactionEditDialog from "./TransactionEditDialog";

interface TransactionCardProps {
  data: TransactionType;
  accounts: AccountType[];
  categories: CategoryType[];
  onSelect?: () => void;
  isSelected?: boolean;
  onSuccess: () => void;
}

const TransactionCard = ({
  data,
  accounts,
  categories,
  onSelect,
  isSelected,
  onSuccess,
}: TransactionCardProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? `transaction-popover-${data.id}` : undefined;
  return (
    <div className="flex w-full flex-row gap-4 text-[0.875rem] leading-[1.375]">
      {onSelect && <Checkbox checked={isSelected} onChange={onSelect} />}
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
      <button
        aria-describedby={id}
        onClick={handleClick}
        className={cn(
          "my-auto aspect-square h-full rounded-[0.375rem] border border-solid border-[#ced4da]/0 p-1",
          "hover:cursor-pointer hover:border-[#ced4da] hover:bg-[#e9ecef] hover:text-[#495057]",
        )}
      >
        <MoreVertOutlinedIcon />
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div className="flex flex-col">
          <TransactionEditDialog
            accounts={accounts}
            categories={categories}
            data={data}
            onSuccess={onSuccess}
          />
          <TransactionDeleteDialog data={data} onSuccess={onSuccess} />
        </div>
      </Popover>
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
