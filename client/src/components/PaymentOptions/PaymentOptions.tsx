import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import has from 'lodash/has';

import { PaymentButton } from './components/PaymentButton';

import MathOp from '../../util/math';

import { PAYMENT_OPTIONS } from '../../constants/purchase';

import {
  CartItem as CartItemProps,
  FioWalletDoublet,
  PaymentOptionsProps,
} from '../../types';

import classes from './styles/PaymentOptions.module.scss';

type Props = {
  paymentOptionsList: PaymentOptionsProps[];
} & DefaultPaymentOptionProps;

type DefaultPaymentOptionProps = {
  isFree?: boolean;
  onPaymentChoose: (paymentOption: PaymentOptionsProps) => void;
  hasLowBalance?: boolean;
  paymentWalletPublicKey?: string;
  cartItems?: CartItemProps[];
  totalCartNativeAmount?: number;
  userWallets?: FioWalletDoublet[];
};

type PaymentOptionRenderProps = {
  paymentOption: PaymentOptionsProps;
} & DefaultPaymentOptionProps;

const PAYMENT_OPTIONS_PROPS = {
  [PAYMENT_OPTIONS.FIO]: ({
    hasLowBalance,
    paymentWalletPublicKey,
    cartItems,
    isFree,
    userWallets,
    totalCartNativeAmount,
    paymentOption,
    onPaymentChoose,
  }: PaymentOptionRenderProps) => ({
    buttonText: isFree ? 'Complete Transaction' : 'Pay with FIO',
    icon: <FontAwesomeIcon icon="wallet" />,
    disabled:
      hasLowBalance || paymentWalletPublicKey === '' || cartItems?.length === 0,
    hideButton: userWallets?.every(
      wallet =>
        wallet.available &&
        new MathOp(wallet.available).lte(totalCartNativeAmount),
    ),
    onClick: () => onPaymentChoose(paymentOption),
  }),
  [PAYMENT_OPTIONS.CREDIT_CARD]: ({
    onPaymentChoose,
    paymentOption,
    cartItems,
  }: PaymentOptionRenderProps) => ({
    buttonText: 'Pay with Credit/Debit Card',
    icon: <FontAwesomeIcon icon="credit-card" />,
    disabled: cartItems?.length === 0,
    onClick: () => onPaymentChoose(paymentOption),
  }),
  [PAYMENT_OPTIONS.CRYPTO]: (props: PaymentOptionRenderProps) => ({
    buttonText: 'Pay Using Crypto',
    icon: <FontAwesomeIcon icon={{ prefix: 'fab', iconName: 'bitcoin' }} />,
    disabled: true, // todo: hardcoded to disabled until any crypto provider will be connnected
    hasRoyalBlueBackground: true,
    onClick: (): null => null,
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
