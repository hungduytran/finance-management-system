import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import TransactionService from "../../services/TransactionService";
import type { TransactionType } from "../../types/transaction";

interface TransactionDeleteDialogProps {
  data: TransactionType;
  onSuccess: () => void;
}

const TransactionDeleteDialog = ({
  data,
  onSuccess,
}: TransactionDeleteDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteTransactionMutation = useMutation({
    mutationFn: (id: number) => {
      const res = TransactionService.deleteTransaction(id);
      return res;
    },
    onMutate: () => {
      if (loading) return;
      setLoading(true);
    },
    onSuccess: () => {
      toast.success("Xóa giao dịch thành công", {
        duration: 3000,
      });
      handleClose();
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(`Xóa giao dịch thất bại`, {
        description: error.message || "Lỗi không xác định",
        duration: 3000,
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleDelete = () => {
    deleteTransactionMutation.mutate(data.id);
  };
  return (
    <Fragment>
      <button
        onClick={handleClickOpen}
        className={cn(
          "w-full bg-white px-6 py-3",
          "hover:cursor-pointer hover:bg-gray-100",
        )}
      >
        Xóa giao dịch
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Bạn có chắc chắn muốn xóa giao dịch này?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Tài khoản sẽ được khôi phục mà không có giao dịch này.`}
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

export default TransactionDeleteDialog;
