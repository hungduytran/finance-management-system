import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import LocalAtmOutlinedIcon from "@mui/icons-material/LocalAtmOutlined";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  OutlinedInput,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import AccountService from "../../services/AccountService";

interface AccountAddDialogProps {
  onSuccess: () => void;
}

const AccountAddDialog = ({ onSuccess }: AccountAddDialogProps) => {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [balance, setBalance] = useState<number>();

  const [errors, setErrors] = useState({
    name: false,
    balance: false,
  });

  const handleClickOpen = () => {
    setName("");
    setDescription("");
    setBalance(undefined);
    setErrors({
      name: false,
      balance: false,
    });
    setOpen(true);
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
      name: !name,
      balance: !balance,
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) {
      setScale(1.05);
      setTimeout(() => setScale(1), 350);
      return;
    }

    createAccountMutation.mutate({
      name,
      description,
      balance: balance || 0,
    });
  };

  const createAccountMutation = useMutation({
    mutationFn: ({
      name,
      description,
      balance,
    }: {
      name: string;
      description: string;
      balance: number;
    }) => {
      return AccountService.createAccount({
        name,
        description,
        balance,
      });
    },
    onMutate: () => {
      if (loading) return;
      setLoading(true);
    },
    onSuccess: () => {
      toast.success("Hoàn tất thêm tài khoản", {
        description: "Bạn đã thêm tài khoản thành công",
        duration: 3000,
      });
      onSuccess();
      handleClose(undefined as never, "");
    },
    onError: (error) => {
      toast.error("Thêm tài khoản thất bại", {
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
        className={cn(
          "flex size-[56px] items-center justify-center rounded-full bg-blue-500 shadow-md",
          "transition-colors duration-300 hover:cursor-pointer hover:bg-blue-600",
        )}
        onClick={handleClickOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="white"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
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
        <DialogTitle>Thêm tài khoản</DialogTitle>
        <DialogContent>
          <div className="mb-4 flex items-center gap-4">
            <div className="text-[3rem]">
              <AccountBalanceWalletOutlinedIcon fontSize="inherit" />
            </div>
            <div className="flex grow flex-col">
              <label htmlFor="input_name" className="text-[0.875rem]">
                Tên tài khoản
              </label>
              <TextField
                id="input_name"
                type="text"
                value={name}
                error={errors.name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4 flex items-center gap-4">
            <div className="text-[3rem]">
              <LocalAtmOutlinedIcon fontSize="inherit" />
            </div>
            <div className="flex grow flex-col">
              <label htmlFor="input_name" className="text-[0.875rem]">
                Số dư tài khoản
              </label>
              <OutlinedInput
                id="input_balance"
                error={errors.balance}
                type="number"
                placeholder="0"
                endAdornment={
                  <span className="text-[0.875rem] text-gray-500">VNĐ</span>
                }
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
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
              <EditNoteOutlinedIcon fontSize="inherit" />
            </div>
            <div className="flex grow flex-col">
              <label htmlFor="input_note" className="text-[0.875rem]">
                Ghi chú
              </label>
              <TextareaAutosize
                id="input_note"
                minRows={2}
                value={description}
                placeholder="Không bắt buộc"
                onChange={(e) => setDescription(e.target.value)}
                className={cn(
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
              color="info"
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

export default AccountAddDialog;
