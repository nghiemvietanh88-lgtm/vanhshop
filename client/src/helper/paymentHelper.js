import { paymentCallback, redirectVnPay } from '../api';

export async function paymentVnPay() {
  const info = {
    amount: 10000,
    bankCode: '',
    orderDescription: 'Thanh toan don hang thoi gian:',
    orderType: 'topup',
    language: 'vn'
  };
  const data = await redirectVnPay(info)
    .then((content) => content)
    .catch(() => {
      // log
    });
  return data.data;
}

export async function checkPayment() {
  const data = await paymentCallback()
    .then((content) => content)
    .catch(() => {
      // log
    });
  return data;
}
