import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { formatPrice } from "../../lib/utils";
import BudgetService from "../../services/BudgetService";
import type { BudgetType } from "../../types/budget";

interface BudgetDeleteButtonProps {
  budget: BudgetType;
  onSuccess: () => void;
}

const BudgetDeleteButton = ({ budget, onSuccess }: BudgetDeleteButtonProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    deleteBudgetMutation.mutate(budget.id);
  };

  const deleteBudgetMutation = useMutation({
    mutationFn: (id: number) => {
      const res = BudgetService.deleteBudget(id);
      return res;
    },
    onMutate: () => {
      if (loading) return;
      setLoading(true);
    },
    onSuccess: () => {
      toast.success("Xóa ngân sách thành công", {
        duration: 3000,
      });
      handleClose();
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(`Xóa ngân sách thất bại`, {
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
        <DeleteOutlinedIcon fontSize="inherit" />
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Bạn có chắc chắn muốn xóa ngân sách này?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography>{`Ngân sách: ${budget.category.name}`}</Typography>
            <Typography>{`Còn lại: ${formatPrice(budget.amount - budget.sentAmount)}`}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="info" variant="contained" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            color="error"
            variant="contained"
            loading={loading}
            onClick={handleDelete}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default BudgetDeleteButton;
