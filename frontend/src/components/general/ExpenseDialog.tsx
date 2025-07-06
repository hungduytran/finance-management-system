import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import InsertInvitationOutlinedIcon from "@mui/icons-material/InsertInvitationOutlined";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  OutlinedInput,
  Select,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { icons } from "../../data/icons";
import { formatPrice } from "../../lib/utils";
import TransactionService from "../../services/TransactionService";
import type { AccountType } from "../../types/accounts";
import type { CategoryType } from "../../types/category";

interface ExpenseDialogProps {
  accounts: AccountType[];
  categories: CategoryType[];
  onSuccess: () => void;
}

const ExpenseDialog = ({
  accounts,
  categories,
  onSuccess,
}: ExpenseDialogProps) => {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(false);

  const [amount, setAmount] = useState<number>();
  const [note, setNote] = useState<string>("");
  const [category, setCategory] = useState<number>();
  const [transactionDate, setTransactionDate] = useState<string>(
    new Date(new Date().getTime() + 7 * 60 * 60 * 1000).toISOString(),
  );
  const [account, setAccount] = useState<number>();

  const [errors, setErrors] = useState({
    category: false,
    amount: false,
    account: false,
  });

  const handleClickOpen = () => {
    clearFields();
    setOpen(true);
  };

  const clearFields = () => {
    setCategory(undefined);
    setAmount(undefined);
    setAccount(undefined);
    setTransactionDate(
      new Date(new Date().getTime() + 7 * 60 * 60 * 1000).toISOString(),
    );
    setNote("");
    setErrors({
      category: false,
      amount: false,
      account: false,
    });
  };

  const handleClose = (_event: never, reason: string) => {
    if (reason && reason === "backdropClick") {
      setScale(1.05);
      setTimeout(() => setScale(1), 350);
      return;
    }
    setOpen(false);
  };

  const handleSubmit = () => {
    const newErrors = {
      category: !category,
      amount: !amount || amount <= 0,
      account: !account,
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) {
      setScale(1.05);
      setTimeout(() => setScale(1), 350);
      return;
    }

    createTransactionMutation.mutate({
      accountId: account || 0,
      categoryId: category || 0,
      amount: amount || 0,
      note,
      transactionDate,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setTransactionDate(
      newDate + (transactionDate ? transactionDate.slice(10) : "T12:30:00"),
    );
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTransactionDate(
      (transactionDate ? transactionDate.slice(0, 10) : "2025-06-15") +
        "T" +
        newTime +
        ":00",
    );
  };

  const createTransactionMutation = useMutation({
    mutationFn: ({
      accountId,
      categoryId,
      amount,
      note,
      transactionDate,
    }: {
      accountId: number;
      categoryId: number;
      amount: number;
      note: string;
      transactionDate: string;
    }) => {
      return TransactionService.createTransaction({
        account: { id: accountId },
        category: { id: categoryId },
        type: "EXPENSE",
        amount,
        description: note,
        transactionDate,
      });
    },
    onMutate: () => {
      if (loading) return;
      setLoading(true);
    },
    onSuccess: () => {
      toast.success("Hoàn tất thêm giao dịch", {
        description: "Bạn đã thêm giao dịch thành công",
        duration: 3000,
      });
      handleClose(undefined as never, "");
      onSuccess();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error("Thêm giao dịch thất bại", {
        description: error.message || "Lỗi không xác định",
        duration: 3000,
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  return (
    <Fragment>
      <button
        className={clsx(
          "flex size-[56px] items-center justify-center rounded-full bg-[#F44336] shadow-md",
          "transition-colors duration-300 hover:cursor-pointer hover:bg-[#DB3B3B]",
        )}
        onClick={handleClickOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          stroke="white"
          className="size-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
        </svg>
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              transform: `scale(${scale})`,
              transition: "transform 350ms",
              width: "min(100vw, 40rem)",
            },
          },
        }}
        disableEscapeKeyDown
      >
        <DialogTitle>Thêm chi phí</DialogTitle>
        <DialogContent>
          <div className="mb-4 flex flex-row items-center gap-4">
            <img
              src={
                icons[
                  categories?.find((item) => item.id === Number(category))
                    ?.image || 11
                ]
              }
              alt="category image"
              className="size-[48px] rounded-full select-none"
            />
            <div className="flex grow flex-col">
              <label htmlFor="input_category" className="text-[0.875rem]">
                Hạng mục
              </label>
              <Select
                id="input_category"
                displayEmpty
                error={errors.category}
                value={category}
                renderValue={(selected) =>
                  selected
                    ? categories?.find(
                        (category) => category.id === Number(selected),
                      )?.name || "Chọn hạng mục"
                    : "Chọn hạng mục"
                }
                onChange={(e) => setCategory(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: "calc(50vh)",
                      overflowY: "auto",
                    },
                  },
                }}
              >
                {categories?.map((category) => (
                  <MenuItem
                    key={category.id}
                    value={category.id}
                    sx={{
                      padding: "8px 16px",
                      display: "flex",
                      gap: "16px",
                      flexGrow: 1,
                    }}
                  >
                    <img
                      src={icons[category.image]}
                      alt="blank icon"
                      className="size-[40px] rounded-full select-none"
                    />
                    <span>{category.name}</span>
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="flex max-w-[12.5rem] flex-col">
              <label htmlFor="input_amount" className="text-[0.875rem]">
                Giá trị
              </label>
              <OutlinedInput
                id="input_amount"
                error={errors.amount}
                type="number"
                placeholder="0"
                endAdornment={
                  <span className="text-[0.875rem] text-gray-500">VNĐ</span>
                }
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                sx={{
                  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                    {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  "& input[type=number]": {
                    MozAppearance: "textfield",
                  },
                }}
              />
            </div>
          </div>

          <div className="mb-4 flex items-center gap-4">
            <div className="text-[3rem]">
              <AccountBalanceOutlinedIcon fontSize="inherit" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="input_account" className="text-[0.875rem]">
                Tài khoản
              </label>
              <Select
                id="input_account"
                displayEmpty
                error={errors.account}
                value={account}
                renderValue={(selected) =>
                  selected
                    ? accounts?.find((acc) => acc.id === Number(selected))
                        ?.name || "Chọn tài khoản"
                    : "Chọn tài khoản"
                }
                onChange={(e) => setAccount(e.target.value)}
                className="lg:min-w-[17.5rem]"
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: "calc(50vh)",
                      overflowY: "auto",
                    },
                  },
                }}
              >
                {accounts?.map((acc) => (
                  <MenuItem
                    key={acc.id}
                    value={acc.id}
                    sx={{
                      padding: "16px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{acc.name}</span>
                    <span>{formatPrice(acc.balance)}</span>
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-4">
            <div className="text-[3rem]">
              <InsertInvitationOutlinedIcon fontSize="inherit" />
            </div>
            <div className="flex grow flex-col">
              <label htmlFor="input_date" className="text-[0.875rem]">
                Ngày
              </label>
              <TextField
                id="input_date"
                type="date"
                value={transactionDate ? transactionDate.slice(0, 10) : ""}
                onChange={handleDateChange}
              />
            </div>
            <div className="flex grow flex-col">
              <label htmlFor="input_time" className="ml-4 text-[0.875rem]">
                Thời gian
              </label>
              <TextField
                id="input_time"
                type="time"
                value={transactionDate ? transactionDate.slice(11, 16) : ""}
                onChange={handleTimeChange}
              />
            </div>
          </div>

          <div className="mb-4 flex items-center gap-4">
            <div className="text-[3rem]">
              <EditNoteOutlinedIcon fontSize="inherit" />
            </div>
            <div className="flex grow flex-col">
              <label htmlFor="input_note" className="text-[0.875rem]">
                Ghi chú (Không bắt buộc)
              </label>
              <TextareaAutosize
                id="input_note"
                minRows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={clsx(
                  "flex-1 rounded-md border border-solid border-[#CED4DA] px-[14px] py-[16.5px]",
                  "hover:border-[#333] focus:outline-[#0076cd]",
                )}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              onClick={() => handleClose(undefined as never, "")}
              color="inherit"
            >
              HỦY
            </Button>
            <Button
              color="error"
              variant="contained"
              loading={loading}
              onClick={handleSubmit}
            >
              LƯU LẠI
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default ExpenseDialog;
