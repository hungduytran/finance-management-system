import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { icons } from "../../data/icons";
import BudgetService from "../../services/BudgetService";
import type { BudgetType } from "../../types/budget";
import type { CategoryType } from "../../types/category";

interface BudgetEditDialogProps {
  budget: BudgetType;
  categories: CategoryType[];
  onSuccess: () => void;
}

const BudgetEditDialog = ({
  budget,
  categories,
  onSuccess,
}: BudgetEditDialogProps) => {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState<number>(budget.category.id);
  const [amount, setAmount] = useState<number>(budget.amount);

  const [errors, setErrors] = useState({
    category: false,
    amount: false,
  });

  const handleClickOpen = () => {
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

  const handleCancel = () => {
    setCategory(budget.category.id);
    setAmount(budget.amount);
    setErrors({
      category: false,
      amount: false,
    });
    handleClose(undefined as never, "");
  };

  const handleSubmit = () => {
    const newErrors = {
      category: !category,
      amount: !amount || amount <= 0,
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) {
      setScale(1.05);
      setTimeout(() => setScale(1), 350);
      return;
    }

    updateBudgetMutation.mutate({
      id: budget.id,
      amount: amount || 0,
      sentAmount: budget.sentAmount,
      month: budget.month,
      year: budget.year,
      categoryId: category || 0,
    });
  };

  const updateBudgetMutation = useMutation({
    mutationFn: ({
      id,
      amount,
      sentAmount,
      month,
      year,
      categoryId,
    }: {
      id: number;
      amount: number;
      sentAmount: number;
      month: number;
      year: number;
      categoryId: number;
    }) => {
      return BudgetService.updateBudget({
        id,
        amount,
        sentAmount,
        month,
        year,
        categoryId,
      });
    },
    onMutate: () => {
      if (loading) return;
      setLoading(true);
    },
    onSuccess: () => {
      toast.success("Chỉnh sửa ngân sách hoàn tất", {
        description: "Bạn đã chỉnh sửa ngân sách thành công",
        duration: 3000,
      });
      onSuccess();
      handleClose(undefined as never, "");
    },
    onError: (error) => {
      toast.error("Chỉnh sửa ngân sách thất bại", {
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
        onClick={handleClickOpen}
        className="text-[1.5rem] hover:cursor-pointer"
      >
        <EditOutlinedIcon fontSize="inherit" />
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
        <DialogTitle>Chỉnh sửa ngân sách</DialogTitle>
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
          </div>

          <div className="flex flex-row gap-4">
            <div className="text-[3rem]">
              <AccountBalanceOutlinedIcon fontSize="inherit" />
            </div>
            <div className="flex grow flex-col">
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

          <div className="mt-4 flex justify-end gap-2">
            <Button onClick={handleCancel} color="inherit">
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

export default BudgetEditDialog;
