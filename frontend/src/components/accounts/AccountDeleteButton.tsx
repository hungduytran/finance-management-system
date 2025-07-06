import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
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
import AccountService from "../../services/AccountService";
import type { AccountType } from "../../types/accounts";

interface AccountDeleteButtonProps {
  account: AccountType;
  onSuccess: () => void;
}

const AccountDeleteButton = ({
  account,
  onSuccess,
}: AccountDeleteButtonProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    deleteAccountMutation.mutate(account.id);
  };

  const deleteAccountMutation = useMutation({
    mutationFn: (id: number) => {
      const res = AccountService.deleteAccount(id);
      return res;
    },
    onMutate: () => {
      if (loading) return;
      setLoading(true);
    },
    onSuccess: () => {
      toast.success("Xóa tài khoản thành công", {
        duration: 3000,
      });
      handleClose();
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(`Xóa tài khoản thất bại`, {
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
          Bạn có chắc chắn muốn xóa tài khoản này?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Tất cả thu nhập và chi phí liên kết tới tài khoản ${account.name} sẽ bị xóa.`}
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

export default AccountDeleteButton;
