import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import LoanService from "../../services/LoanService";
import type { LoanType } from "../../types/loans";

interface LoanEditDialogProps {
  loan: LoanType;
  onSuccess: () => void;
}

const LoanEditDialog = ({ loan, onSuccess }: LoanEditDialogProps) => {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(false);

  const [lenderName, setLenderName] = useState(loan.lenderName);
  const [borrowedDate, setBorrowedDate] = useState(loan.borrowedDate);
  const [dueDate, setDueDate] = useState(loan.dueDate);
  const [totalAmount, setTotalAmount] = useState(loan.totalAmount);
  const [paidAmount, setPaidAmount] = useState(loan.paidAmount);

  const [errors, setErrors] = useState({
    lenderName: false,
    totalAmount: false,
    paidAmount: false,
    dueDate: false,
  });

  const handleClickOpen = () => {
    setLenderName(loan.lenderName);
    setBorrowedDate(loan.borrowedDate);
    setDueDate(loan.dueDate);
    setTotalAmount(loan.totalAmount);
    setPaidAmount(loan.paidAmount);
    setErrors({
      lenderName: false,
      totalAmount: false,
      paidAmount: false,
      dueDate: false,
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
      lenderName: !lenderName,
      totalAmount: !totalAmount || totalAmount <= 0,
      paidAmount:
        !paidAmount ||
        paidAmount < 0 ||
        (typeof totalAmount === "number" ? paidAmount > totalAmount : false),
      dueDate: new Date(dueDate) < new Date(borrowedDate),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) {
      setScale(1.05);
      setTimeout(() => setScale(1), 350);
      return;
    }

    updateLoanMutation.mutate({
      id: loan.id,
      lenderName,
      totalAmount: totalAmount || 0,
      paidAmount: paidAmount || 0,
      borrowedDate,
      dueDate,
      type: loan.type,
    });
  };

  const updateLoanMutation = useMutation({
    mutationFn: ({
      id,
      lenderName,
      totalAmount,
      paidAmount,
      borrowedDate,
      dueDate,
      type,
    }: {
      id: number;
      lenderName: string;
      totalAmount: number;
      paidAmount: number;
      borrowedDate: string;
      dueDate: string;
      type: "DEBT" | "CREDIT";
    }) => {
      return LoanService.updateLoan(
        id,
        lenderName,
        totalAmount,
        paidAmount,
        borrowedDate,
        dueDate,
        type,
      );
    },
    onMutate: () => {
      if (loading) return;
      setLoading(true);
    },
    onSuccess: () => {
      toast.success("Chỉnh sửa khoản vay hoàn tất", {
        duration: 3000,
      });
      onSuccess();
      handleClose(undefined as never, "");
    },
    onError: (error) => {
      toast.error("Chỉnh sửa khoản vay thất bại", {
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
      <button onClick={handleClickOpen} className="hover:cursor-pointer">
        <EditOutlinedIcon fontSize="small" />
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
        <DialogTitle>Chỉnh sửa khoản vay</DialogTitle>
        <DialogContent>
          <div className="flex flex-row gap-4">
            <div className="mb-4 flex grow items-center gap-4">
              <div className="flex grow flex-col">
                <label htmlFor="input_name" className="text-[0.875rem]">
                  Giá trị
                </label>
                <OutlinedInput
                  id="input_total_mount"
                  error={errors.totalAmount}
                  type="number"
                  placeholder="0"
                  endAdornment={
                    <span className="text-[0.875rem] text-gray-500">VNĐ</span>
                  }
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(Number(e.target.value))}
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
              <div className="flex grow flex-col">
                <label htmlFor="input_name" className="text-[0.875rem]">
                  Đã thanh toán
                </label>
                <OutlinedInput
                  id="input_paid_mount"
                  error={errors.paidAmount}
                  type="number"
                  placeholder="0"
                  endAdornment={
                    <span className="text-[0.875rem] text-gray-500">VNĐ</span>
                  }
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
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
          </div>

          <div className="flex flex-row gap-4">
            <div className="mb-4 flex grow items-center gap-4">
              <div className="flex grow flex-col">
                <label htmlFor="input_name" className="text-[0.875rem]">
                  Ngày mượn
                </label>
                <TextField
                  id="input_borrowed_date"
                  type="date"
                  value={new Date(borrowedDate).toISOString().split("T")[0]}
                  onChange={(e) =>
                    setBorrowedDate(new Date(e.target.value).toISOString())
                  }
                />
              </div>
            </div>
            <div className="mb-4 flex grow items-center gap-4">
              <div className="flex grow flex-col">
                <label htmlFor="input_name" className="text-[0.875rem]">
                  Ngày trả nợ
                </label>
                <TextField
                  id="input_due_date"
                  type="date"
                  error={errors.dueDate}
                  value={new Date(dueDate).toISOString().split("T")[0]}
                  onChange={(e) =>
                    setDueDate(new Date(e.target.value).toISOString())
                  }
                />
              </div>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-4">
            <span className="text-[3rem]">
              <PersonOutlineOutlinedIcon fontSize="inherit" />
            </span>
            <div className="flex grow flex-col">
              <label htmlFor="input_from" className="text-[0.875rem]">
                Từ
              </label>
              <TextField
                id="input_lender_name"
                type="text"
                error={errors.lenderName}
                value={lenderName}
                onChange={(e) => setLenderName(e.target.value)}
                className="rounded-md border border-solid border-[#CED4DA] px-2 py-1 focus:outline-none"
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
              onClick={handleSubmit}
              variant="contained"
              color={loan.type === "DEBT" ? "error" : "success"}
            >
              LƯU LẠI
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default LoanEditDialog;
