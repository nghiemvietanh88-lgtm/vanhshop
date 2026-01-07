// icons
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import { Icon } from '@iconify/react';
// form validation
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
// material
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// hooks
import { useSnackbar } from 'notistack';
import { useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocales } from '../../hooks';
// components
import CheckoutBillingInfo from './CheckoutBillingInfo';
import CheckoutPaymentMethods from './CheckoutPaymentMethods';
import CheckoutSummary from './CheckoutSummary';

import { backStepOrder, createOrder } from '../../redux/slices/orderSlice';

import * as typeUtils from '../../utils/typeUtils';

// ----------------------------------------------------------------------

export default function CheckoutPayment() {
  const { t } = useLocales();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { orderInfo, isLoading: isCreatingOrder, orderCreated, error } = useSelector((state) => state.order);

  // State for thank you dialog
  const [openThankYouDialog, setOpenThankYouDialog] = useState(false);

  const handleCloseThankYouDialog = () => {
    setOpenThankYouDialog(false);
    window.location.href = '/account?tab=order';
  };

  useLayoutEffect(() => {
    if (error) {
      console.log('orderError', error);
      enqueueSnackbar(error?.message || 'Có lỗi', { variant: 'error' });
      return;
    }

    if (orderCreated) {
      if (typeUtils.isNotEmptyStr(orderCreated._id)) {
        // Helper.clearAfterOrder();
        // if (isAuthenticated) {
        //   dispatch(cleanCart());
        // }
        localStorage.removeItem('orderLocalStorage');

        // Nếu có URL thanh toán online (VNPay, etc.), redirect tới đó
        // Ngược lại, hiển thị dialog cảm ơn
        if (orderCreated.paymentUrl) {
          window.open(orderCreated.paymentUrl, '_self');
        } else {
          setOpenThankYouDialog(true);
        }
      } else {
        enqueueSnackbar('Hệ thống bận, vui lòng thử lại !', { variant: 'error' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderCreated, error]);

  const paymentOpts = [
    {
      value: 'vnpay',
      title: t('cart.payment-method-vnpay'),
      description: t('cart.payment-method-vnpay-desc'),
      icons: ['/static/icons/ic_vnpay.svg']
    },
    {
      value: 'paypal',
      title: t('cart.payment-method-paypal'),
      description: t('cart.payment-method-paypal-desc'),
      icons: ['/static/icons/ic_paypal.svg'],
      isDevelop: true
    },
    {
      value: 'momo',
      title: t('cart.payment-method-momo'),
      description: t('cart.payment-method-momo-desc'),
      icons: ['/static/icons/ic_momo.svg'],
      isDevelop: true
    },
    {
      value: 'zalopay',
      title: t('cart.payment-method-zalopay'),
      description: t('cart.payment-method-zalopay-desc'),
      icons: ['/static/icons/ic_zalopay.svg'],
      isDevelop: true
    },
    {
      value: 'credit_card',
      title: 'Credit / Debit Card',
      description: 'We support Mastercard, Visa, Discover and Stripe.',
      icons: ['/static/icons/ic_mastercard.svg', '/static/icons/ic_visa.svg'],
      isDevelop: true
    }
  ];

  if (orderInfo.isReceiveAtStore) {
    paymentOpts.splice(0, 0, {
      value: 'cash',
      title: t('cart.payment-method-cash'),
      description: t('cart.payment-method-cash-desc'),
      icons: []
    });
  } else {
    paymentOpts.splice(0, 0, {
      value: 'cod',
      title: t('cart.payment-method-cod'),
      description: t('cart.payment-method-cod-desc'),
      icons: []
    });
  }

  const handleBackStep = () => {
    dispatch(backStepOrder());
  };

  const handlePayment = async (values) => {
    dispatch(createOrder(values));
  };

  const PaymentSchema = Yup.object().shape({
    paymentMethod: Yup.mixed().required(t('cart.payment-method-required'))
  });

  const formik = useFormik({
    initialValues: {
      paymentMethod: ''
    },
    validationSchema: PaymentSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        await handlePayment(values);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error.message);
      }
    }
  });

  const { handleSubmit } = formik;

  // if (isCreateOrdered) {
  //   return (
  //     <>
  //       <CheckoutSummary />
  //       <p>Sucesss</p>
  //       <p>{JSON.stringify(orderCreated)}</p>
  //     </>
  //   );
  // }

  return (
    <FormikProvider value={formik}>
      <Form
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
        onKeyPress={(e) => {
          if (e.which === 13) {
            e.preventDefault();
          }
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <CheckoutPaymentMethods formik={formik} paymentOptions={paymentOpts} />
          </Grid>

          <Grid item xs={12} md={4}>
            <CheckoutBillingInfo orderInfo={orderInfo} onBackStep={handleBackStep} />
            <CheckoutSummary showDetail />
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isCreatingOrder}>
              {t('cart.order.action')}
            </LoadingButton>
            <Button
              type="button"
              size="small"
              fullWidth
              color="inherit"
              onClick={handleBackStep}
              startIcon={<Icon icon={arrowIosBackFill} />}
              sx={{ mt: 3 }}
            >
              {t('common.back')}
            </Button>
          </Grid>
        </Grid>
      </Form>

      {/* Thank You Dialog */}
      <Dialog
        open={openThankYouDialog}
        onClose={handleCloseThankYouDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            textAlign: 'center',
            py: 3
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Icon icon="pepicons-print:checkmark-outlined" width="20" height="20" style={{ color: '#0cc512' }} />
          </Box>
          <Typography variant="h4" component="div" sx={{ color: 'success.main' }}>
            Đặt hàng thành công!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
            Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi.
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Đơn hàng của bạn đang được xử lý. Bạn có thể theo dõi trạng thái đơn hàng trong mục "Đơn hàng của tôi".
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', px: 3, pb: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleCloseThankYouDialog}
            sx={{
              minWidth: 200,
              bgcolor: 'success.main',
              '&:hover': {
                bgcolor: 'success.dark'
              }
            }}
          >
            Xem đơn hàng
          </Button>
        </DialogActions>
      </Dialog>
    </FormikProvider>
  );
}
