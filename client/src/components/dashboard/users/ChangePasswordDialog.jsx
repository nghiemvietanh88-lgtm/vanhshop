import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';

// ----------------------------------------------------------------------

ChangePasswordDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  user: PropTypes.object
};

export default function ChangePasswordDialog({ open, onClose, onSubmit, user }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      password: ''
    }
  });

  const handleFormSubmit = (data) => {
    onSubmit({ ...user, password: data.password }); // Merge with user data but only update password
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Đổi mật khẩu cho {user?.fullName}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Nhập mật khẩu mới cho người dùng <strong>{user?.email}</strong>.
          </Typography>
          <Controller
            name="password"
            control={control}
            rules={{
              required: 'Vui lòng nhập mật khẩu mới',
              minLength: { value: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Mật khẩu mới"
                type="password"
                error={!!errors.password}
                helperText={errors.password?.message}
                autoFocus
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Hủy
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Cập nhật
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
