import fiosdkLib from '@fioprotocol/fiosdk';

import { Payment } from '../models/Payment.mjs';
import { Wallet } from '../models/Wallet.mjs';

import MathOp from '../services/math.mjs';

const FREE_PRICE = 'FREE';

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
      const orderNativeFio = orderItem.fee_collected
        ? new MathOp(orderItem.fee_collected).toNumber()
        : 0;
      const orderPrice = orderItem.costUsdc
        ? new MathOp(orderItem.costUsdc).toNumber()
        : 0;

      fioNativeTotal = new MathOp(fioNativeTotal).add(orderNativeFio).toNumber();
      usdcTotal = new MathOp(usdcTotal).add(orderPrice).toNumber();

      return { fioNativeTotal, usdcTotal };
    },
    { fioNativeTotal: 0, usdcTotal: 0 },
  );

export const transformCostToPriceString = ({
  fioNativeAmount,
  usdcAmount,
  hasDollarSign,
}) => {
  if (fioNativeAmount)
    return `${fiosdkLib.FIOSDK.SUFToAmount(fioNativeAmount).toFixed(2)} FIO`;
  if (usdcAmount) {
    if (hasDollarSign) return `$${usdcAmount.toFixed(2)}`;
    return `${usdcAmount} USDC`;
  }
};

export const transformOrderTotalCostToPriceObj = ({ totalCostObj, paymentCurrency }) => {
  const { fioNativeTotal, usdcTotal } = totalCostObj || {};

  if (!fioNativeTotal && fioNativeTotal !== 0 && !usdcTotal && usdcTotal !== 0)
    return null;

  if (fioNativeTotal === 0 && usdcTotal === 0)
    return {
      freeTotalPrice: FREE_PRICE,
    };

  if (paymentCurrency === Payment.CURRENCY.FIO)
    return {
      fioTotalPrice: transformCostToPriceString({ fioNativeAmount: fioNativeTotal }),
      usdcTotalPrice: transformCostToPriceString({ usdcAmount: usdcTotal }),
    };

  if (paymentCurrency.toUpperCase() === Payment.CURRENCY.USD)
    return {
      usdcTotalPrice: transformCostToPriceString({
        usdcAmount: usdcTotal,
        hasDollarSign: true,
      }),
    };

  return { usdcTotalPrice: `${usdcTotal} USDC` };
};

export const transformOrderItemCostToPriceString = ({
  orderItemCostObj,
  paymentCurrency,
}) => {
  const { usdcAmount, fioNativeAmount, isFree } = orderItemCostObj;

  if (isFree) return FREE_PRICE;

  const fioPrice = transformCostToPriceString({ fioNativeAmount });

  const usdcPrice = transformCostToPriceString({ usdcAmount });

  if (paymentCurrency === Payment.CURRENCY.FIO) {
    return `${fioPrice} (${usdcPrice})`;
  }

  return `${usdcPrice} (${fioPrice})`;
};
