import fiosdkLib from '@fioprotocol/fiosdk';

import { Payment } from '../models/Payment.mjs';
import { Wallet } from '../models/Wallet.mjs';

import MathOp from '../services/math.mjs';

import { ERROR_CODES, CART_ITEM_TYPES_WITH_PERIOD } from '../config/constants';

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
  paymentProcessor,
  publicKey,
  userId,
  payment,
  isCanceledStatus,
}) => {
  if (isCanceledStatus) return 'Not Paid';

  if (paymentProcessor === Payment.PROCESSOR.STRIPE) {
    const { data: paymentData } = payment;

    const { webhookData: { charges: { data: creditCardData = [] } = {} } = {} } =
      paymentData || {};

    return getCreditCardName(creditCardData[0]);
  }

  if (paymentProcessor === Payment.PROCESSOR.BITPAY) {
    const { data: paymentData } = payment;
    const { webhookData: { transactionCurrency } = {} } = paymentData || {};

    if (!transactionCurrency) return `${paymentProcessor} N/A`;

    return `${paymentProcessor} ${transactionCurrency}`;
  }

  return await getFioWalletName(publicKey, userId);
};

export const countTotalPriceAmount = orderItems =>
  orderItems.reduce(
    ({ fioNativeTotal, usdcTotal }, orderItem) => {
      const fioNativeAmount =
        (orderItem.errorData && orderItem.errorData.credited) ||
        orderItem.fee_collected ||
        orderItem.nativeFio ||
        0;
      const usdcAmount = orderItem.costUsdc || orderItem.price || 0;

      const orderNativeFio = new MathOp(fioNativeAmount).toNumber();
      const orderPrice = new MathOp(usdcAmount).toNumber();

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
      fioTotalPrice: transformCostToPriceString({
        fioNativeAmount: fioNativeTotal,
      }),
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

export const generateErrBadgeItem = ({ errItems = [], paymentCurrency }) => {
  return errItems.reduce((acc, errItem) => {
    const { errorType, errorData } = errItem;
    let badgeKey = '';
    let totalCurrency;
    let customItemAmount = null;

    if (errorData && errorData.code === ERROR_CODES.SINGED_TX_XTOKENS_REFUND_SKIP) {
      badgeKey = `${errorData.code}`;
      totalCurrency = Payment.CURRENCY.FIO;
      customItemAmount = errorData.credited
        ? new MathOp(errorData.credited).toNumber()
        : null;
    } else {
      badgeKey = `${errorType}`;
      totalCurrency = paymentCurrency;
    }

    if (!acc[badgeKey])
      acc[badgeKey] = {
        errorType: badgeKey,
        items: [],
        total: '',
        totalCurrency: '',
      };

    acc[badgeKey].errorType = badgeKey;
    acc[badgeKey].items.push(
      customItemAmount ? { ...errItem, costNativeFio: customItemAmount } : errItem,
    );

    const totalCostObj = countTotalPriceAmount(acc[badgeKey].items);

    acc[badgeKey].total = transformOrderTotalCostToPriceObj({
      totalCostObj,
      paymentCurrency,
    });
    acc[badgeKey].totalCurrency = totalCurrency;

    return acc;
  }, {});
};

export const combineOrderItems = ({ orderItems = [], paymentCurrency }) => {
  return orderItems
    .reduce((items, item) => {
      const existsItem = items.find(orderItem => orderItem.id === item.id);
      if (CART_ITEM_TYPES_WITH_PERIOD.includes(item.type) && existsItem) {
        existsItem.period++;
        existsItem.transaction_ids = [
          ...(existsItem.transaction_ids || []),
          item.transaction_id,
        ];
        existsItem.fee_collected = new MathOp(existsItem.fee_collected)
          .add(item.fee_collected)
          .toNumber();
        existsItem.costUsdc = new MathOp(existsItem.costUsdc)
          .add(item.costUsdc)
          .toNumber();
        existsItem.priceString = transformOrderItemCostToPriceString({
          orderItemCostObj: {
            fioNativeAmount: existsItem.fee_collected,
            usdcAmount: existsItem.costUsdc,
            isFree: existsItem.isFree,
          },
          paymentCurrency,
        });
      } else {
        if (CART_ITEM_TYPES_WITH_PERIOD.includes(item.type)) {
          item.period = 1;
        }
        items.push(item);
      }

      return items;
    }, [])
    .map(item => ({
      ...item,
      action: item.period
        ? `${item.action} - ${item.period} year${item.period > 1 ? 's' : ''}`
        : item.action,
    }));
};
