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
} & PaymentOptionRenderProps;

export type PaymentOptionRenderProps = {
  isFree?: boolean;
  recalculateBalance?: () => void;
  hasLowBalance?: boolean;
  paymentWalletPublicKey?: string;
  cartItems?: CartItemProps[];
  totalCartNativeAmount?: number;
  userWallets?: FioWalletDoublet[];
};

const PAYMENT_OPTIONS_PROPS = {
  [PAYMENT_OPTIONS.FIO]: ({
    hasLowBalance,
    paymentWalletPublicKey,
    cartItems,
    isFree,
    userWallets,
    totalCartNativeAmount,
    recalculateBalance,
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
    onClick: () => recalculateBalance(),
  }),
  [PAYMENT_OPTIONS.CREDIT_CARD]: (props: PaymentOptionRenderProps) => ({
    buttonText: 'Pay with Credit/Debit Card',
    icon: <FontAwesomeIcon icon="credit-card" />,
    onClick: (): null => null,
  }),
  [PAYMENT_OPTIONS.CRYPTO]: (props: PaymentOptionRenderProps) => ({
    buttonText: 'Pay Using Crypto',
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
            {...PAYMENT_OPTIONS_PROPS[paymentOption](props)}
          />
        );
      })}
    </div>
  );
};
