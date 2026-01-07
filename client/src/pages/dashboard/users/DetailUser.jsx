import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// material
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Typography
} from '@material-ui/core';
import { experimentalStyled as styled } from '@material-ui/core/styles';
// icons
import calendarFill from '@iconify/icons-eva/calendar-fill';
import emailFill from '@iconify/icons-eva/email-fill';
import personFill from '@iconify/icons-eva/person-fill';
import phoneFill from '@iconify/icons-eva/phone-fill';
import pinFill from '@iconify/icons-eva/pin-fill';
import { Icon } from '@iconify/react';
// hooks
import useLocales from '../../../hooks/useLocales';
// utils
import { fDate } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5)
}));

const InfoStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2)
}));

DetailUser.propTypes = {
  currentId: PropTypes.any,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired
};

export default function DetailUser({ currentId, open, setOpen }) {
  const { t } = useLocales();
  const { list: usersList } = useSelector((state) => state.user);

  // Find user from Redux store
  const user = usersList.find((u) => u._id === currentId);

  const handleClose = () => {
    setOpen(false);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2 }}>
        <Typography variant="h6">Chi tiết người dùng</Typography>
        <Chip
          label={user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
          color={user.status === 'active' ? 'success' : 'error'}
          size="small"
        />
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Header Info: Avatar + Name + Role */}
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={user.image}
                alt={user.fullName}
                sx={{ width: 120, height: 120, mb: 2, border: '4px solid #f0f0f0' }}
              />
              <Typography variant="h5" gutterBottom>
                {user.fullName}
              </Typography>
              <Chip
                label={user.role ? user.role.toUpperCase() : 'USER'}
                color={user.role === 'admin' ? 'error' : user.role === 'staff' ? 'warning' : 'info'}
                variant="filled"
              />
            </Box>
          </Grid>

          {/* Details */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Icon icon={emailFill} width={20} height={20} style={{ marginRight: 8, opacity: 0.7 }} />
                  <LabelStyle>Email</LabelStyle>
                </Box>
                <InfoStyle>{user.email}</InfoStyle>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Icon icon={phoneFill} width={20} height={20} style={{ marginRight: 8, opacity: 0.7 }} />
                  <LabelStyle>Số điện thoại</LabelStyle>
                </Box>
                <InfoStyle>{user.phone || 'Chưa cập nhật'}</InfoStyle>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Icon icon={personFill} width={20} height={20} style={{ marginRight: 8, opacity: 0.7 }} />
                  <LabelStyle>Giới tính</LabelStyle>
                </Box>
                <InfoStyle sx={{ textTransform: 'capitalize' }}>
                  {user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : 'Khác'}
                </InfoStyle>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Icon icon={calendarFill} width={20} height={20} style={{ marginRight: 8, opacity: 0.7 }} />
                  <LabelStyle>Ngày tham gia</LabelStyle>
                </Box>
                <InfoStyle>{fDate(user.createdAt)}</InfoStyle>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Icon icon={pinFill} width={20} height={20} style={{ marginRight: 8, opacity: 0.7 }} />
                  <LabelStyle>Hồ sơ Google / Facebook</LabelStyle>
                </Box>
                <Stack direction="row" spacing={1}>
                  {user.googleId && <Chip label="Google Linked" size="small" color="primary" variant="outlined" />}
                  {user.facebookId && <Chip label="Facebook Linked" size="small" color="primary" variant="outlined" />}
                  {!user.googleId && !user.facebookId && (
                    <Typography variant="body2" color="text.secondary">
                      Chưa liên kết
                    </Typography>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Grid>

          {/* Addresses */}
          {user.addresses && user.addresses.length > 0 && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  ĐỊA CHỈ GIAO HÀNG
                </Typography>
              </Divider>
              <Grid container spacing={2}>
                {user.addresses.map((addr, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1, height: '100%' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {addr.type === 'home' ? 'Nhà riêng' : 'Văn phòng'}{' '}
                        {addr.isDefault && (
                          <Chip
                            label="Mặc định"
                            size="small"
                            color="primary"
                            sx={{ height: 20, fontSize: '0.7rem', ml: 1 }}
                          />
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {addr.detail}, {addr.ward}, {addr.district}, {addr.province}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Người nhận: {addr.receiverName || user.fullName} - {addr.phone || user.phone}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit" variant="outlined">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
