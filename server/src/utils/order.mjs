import { Wallet } from '../models/Wallet.mjs';

import MathOp from '../services/math.mjs';

const getFioWalletName = async (publicKey, userId) => {
  const wallet = await Wallet.findOne({
    where: { publicKey, userId },
  });
  if (wallet) return wallet.name;
  return 'N/A';
};

const getCreditCardName = creditCardData => {
  const { payment_method_details: { card: { brand, last4 } = {} } = {} } =
    creditCardData || {};
  return brand && last4 ? `${brand.toUpperCase()} ending in ${last4}` : 'N/A';
};

export const getPaidWith = async ({
  isCreditCardProcessor,
  publicKey,
  userId,
  payment,
}) => {
  if (isCreditCardProcessor) {
    const { data: paymentData = {} } = payment;

    const {
      webhookData: { charges: { data: creditCardData = [] } = {} } = {},
    } = paymentData;

    return getCreditCardName(creditCardData[0]);
  }

  return await getFioWalletName(publicKey, userId);
};

export const countTotalPriceAmount = orderItems =>
  orderItems.reduce(
    ({ fioNativeTotal, usdcTotal }, orderItem) => {
      const orderNativeFio = new MathOp(orderItem.fee_collected).toNumber();
      const orderPrice = new MathOp(orderItem.costUsdc).toNumber();

      fioNativeTotal = new MathOp(fioNativeTotal).add(orderNativeFio).toNumber();
      usdcTotal = new MathOp(usdcTotal).add(orderPrice).toNumber();

      return { fioNativeTotal, usdcTotal };
    },
    { fioNativeTotal: 0, usdcTotal: 0 },
  );
