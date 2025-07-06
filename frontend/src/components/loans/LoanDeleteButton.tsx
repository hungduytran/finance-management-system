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
import LoanService from "../../services/LoanService";
import type { LoanType } from "../../types/loans";

interface LoanDeleteButtonProps {
  loan: LoanType;
  onSuccess: () => void;
}
const LoanDeleteButton = ({ loan, onSuccess }: LoanDeleteButtonProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    deleteLoanMutation.mutate({ id: loan.id });
  };

  const deleteLoanMutation = useMutation({
    mutationFn: ({ id }: { id: number }) => {
      return LoanService.deleteLoan(id);
    },
    onMutate: () => {
      if (loading) return;
      setLoading(true);
    },
    onSuccess: () => {
      toast.success("Xóa khoản vay thành công", {
        duration: 3000,
      });
      handleClose();
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(`Xóa khoản vay thất bại`, {
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
        <DeleteOutlinedIcon fontSize="small" />
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Bạn có chắc chắn muốn xóa khoản vay này?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography>{`Từ: ${loan.lenderName}`}</Typography>
            <Typography>{`Số tiền: ${loan.totalAmount}`}</Typography>
            <Typography>
              Hành động này sẽ không làm thủ tiêu các giao dịch liên kết với nó.
            </Typography>
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

export default LoanDeleteButton;
