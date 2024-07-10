import React from 'react';
import has from 'lodash/has';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';

import { PaymentButton } from './components/PaymentButton';
import { BitPayButtonText, BITPAY_LOGO_WIDTH } from '../BitPayButton';

import MathOp from '../../util/math';

import { PAYMENT_OPTIONS, PAYMENT_PROVIDER } from '../../constants/purchase';

import {
  CartItem as CartItemProps,
  FioWalletDoublet,
  PaymentOptionsProps,
  PaymentProvider,
} from '../../types';

import classes from './styles/PaymentOptions.module.scss';

type Props = {
  paymentOptionsList: PaymentOptionsProps[];
} & DefaultPaymentOptionProps;

type DefaultPaymentOptionProps = {
  isFree?: boolean;
  isAffiliateEnabled?: boolean;
  onPaymentChoose: (paymentProvider: PaymentProvider) => void;
  hasLowBalance?: boolean;
  paymentWalletPublicKey?: string;
  cartItems?: CartItemProps[];
  totalCartNativeAmount?: number;
  totalCartUsdcAmount?: string;
  userWallets?: FioWalletDoublet[];
  selectedPaymentProvider: PaymentProvider;
  disabled?: boolean;
  formsOfPayment?: { [key: string]: boolean };
};

type PaymentOptionRenderProps = {
  paymentOption: PaymentOptionsProps;
} & DefaultPaymentOptionProps;

const PAYMENT_OPTIONS_PROPS = {
  [PAYMENT_OPTIONS.FIO]: ({
    hasLowBalance,
    cartItems,
    isFree,
    selectedPaymentProvider,
    disabled,
    onPaymentChoose,
  }: PaymentOptionRenderProps) => ({
    buttonText: isFree ? 'Complete Transaction' : 'Pay with FIO',
    icon: <AccountBalanceWalletIcon className={classes.icon} />,
    disabled: cartItems?.length === 0 || disabled,
    provider: PAYMENT_PROVIDER.FIO,
    loading: selectedPaymentProvider === PAYMENT_PROVIDER.FIO,
    hideButton: hasLowBalance && !isFree,
    onClick: () => onPaymentChoose(PAYMENT_PROVIDER.FIO),
  }),
  [PAYMENT_OPTIONS.CREDIT_CARD]: ({
    onPaymentChoose,
    cartItems,
    selectedPaymentProvider,
    disabled,
    totalCartUsdcAmount,
    formsOfPayment,
    isAffiliateEnabled,
  }: PaymentOptionRenderProps) => ({
    buttonText: 'Pay with Credit/Debit Card',
    icon: <CreditCardIcon className={classes.icon} />,
    disabled: cartItems?.length === 0 || disabled,
    hideButton:
      (formsOfPayment &&
        (!formsOfPayment.stripe ||
          (formsOfPayment.stripe &&
            isAffiliateEnabled &&
            !formsOfPayment.stripeAffiliate))) ||
      new MathOp(totalCartUsdcAmount).lt(0.5),
    provider: PAYMENT_PROVIDER.STRIPE,
    loading: selectedPaymentProvider === PAYMENT_PROVIDER.STRIPE,
    onClick: () => onPaymentChoose(PAYMENT_PROVIDER.STRIPE),
  }),
  [PAYMENT_OPTIONS.CRYPTO]: ({
    cartItems,
    disabled,
    selectedPaymentProvider,
    totalCartUsdcAmount,
    formsOfPayment,
    onPaymentChoose,
  }: PaymentOptionRenderProps) => ({
    buttonText: <BitPayButtonText width={BITPAY_LOGO_WIDTH.hasLowHeight} />,
    loading: selectedPaymentProvider === PAYMENT_PROVIDER.BITPAY,
    hasCobaltBackground: true,
    isTextCentered: true,
    disabled: cartItems?.length === 0 || disabled,
    hideButton:
      (formsOfPayment && !formsOfPayment.bitpay) ||
      new MathOp(totalCartUsdcAmount).lte(1),
    onClick: () => onPaymentChoose(PAYMENT_PROVIDER.BITPAY),
  }),
};

export const PaymentOptions: React.FC<Props> = props => {
  const { paymentOptionsList } = props;

  return (
    <div className={classes.container}>
      {paymentOptionsList.map(paymentOption => {
        if (!has(PAYMENT_OPTIONS_PROPS, paymentOption)) return null;
        return (
          <PaymentButton
            key={paymentOption}
            {...PAYMENT_OPTIONS_PROPS[paymentOption]({
              ...props,
              paymentOption,
            })}
          />
        );
      })}
    </div>
  );
};
