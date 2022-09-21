import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import has from 'lodash/has';

import { PaymentButton } from './components/PaymentButton';

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
  onPaymentChoose: (paymentProvider: PaymentProvider) => void;
  hasLowBalance?: boolean;
  paymentWalletPublicKey?: string;
  cartItems?: CartItemProps[];
  totalCartNativeAmount?: number;
  userWallets?: FioWalletDoublet[];
  checkoutApproving: PaymentProvider;
  disabled?: boolean;
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
    paymentOption,
    checkoutApproving,
    disabled,
    onPaymentChoose,
  }: PaymentOptionRenderProps) => ({
    buttonText: isFree ? 'Complete Transaction' : 'Pay with FIO',
    icon: <FontAwesomeIcon icon="wallet" />,
    disabled:
      paymentWalletPublicKey === '' || cartItems?.length === 0 || disabled,
    provider: PAYMENT_PROVIDER.FIO,
    loading: checkoutApproving === PAYMENT_PROVIDER.FIO,
    hideButton: hasLowBalance,
    onClick: () => onPaymentChoose(PAYMENT_PROVIDER.FIO),
  }),
  [PAYMENT_OPTIONS.CREDIT_CARD]: ({
    onPaymentChoose,
    paymentOption,
    cartItems,
    checkoutApproving,
    disabled,
  }: PaymentOptionRenderProps) => ({
    buttonText: 'Pay with Credit/Debit Card',
    icon: <FontAwesomeIcon icon="credit-card" />,
    disabled: cartItems?.length === 0 || disabled,
    provider: PAYMENT_PROVIDER.STRIPE,
    loading: checkoutApproving === PAYMENT_PROVIDER.STRIPE,
    onClick: () => onPaymentChoose(PAYMENT_PROVIDER.STRIPE),
  }),
  [PAYMENT_OPTIONS.CRYPTO]: ({
    checkoutApproving,
  }: PaymentOptionRenderProps) => ({
    buttonText: 'Pay Using Crypto',
    icon: <FontAwesomeIcon icon={{ prefix: 'fab', iconName: 'bitcoin' }} />,
    disabled: true,
    hideButton: true, // not implemented
    loading: checkoutApproving === PAYMENT_PROVIDER.CRYPTO,
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
