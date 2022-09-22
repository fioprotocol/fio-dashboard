import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

import { PaymentOptions } from '../../PaymentOptions';

import { PaymentOptionsProps, CartItem, PaymentProvider } from '../../../types';

import classes from '../styles/OtherPaymentsBlock.module.scss';

type Props = {
  defaultShowState: boolean;
  optionsDisabled: boolean;
  disabled?: boolean;
  paymentOptionsList: PaymentOptionsProps[];
  cartItems?: CartItem[];
  selectedPaymentProvider: PaymentProvider;
  onPaymentChoose: (paymentProvider: PaymentProvider) => void;
};

const OtherPaymentsBlock: React.FC<Props> = props => {
  const {
    defaultShowState,
    paymentOptionsList,
    optionsDisabled,
    disabled,
    cartItems,
    selectedPaymentProvider,
    onPaymentChoose,
  } = props;

  const [showOtherPayments, toggleOtherPayments] = useState<boolean>(
    defaultShowState,
  );

  useEffect(() => {
    toggleOtherPayments(defaultShowState);
  }, [defaultShowState]);

  const onOtherPaymentsClick = () => {
    toggleOtherPayments(true);
  };

  if (showOtherPayments)
    return (
      <PaymentOptions
        paymentOptionsList={paymentOptionsList}
        onPaymentChoose={onPaymentChoose}
        cartItems={cartItems}
        selectedPaymentProvider={selectedPaymentProvider}
        disabled={disabled}
      />
    );

  return (
    <Button
      className={classes.button}
      onClick={onOtherPaymentsClick}
      variant="link"
      disabled={optionsDisabled}
    >
      Other Payment Options
    </Button>
  );
};

export default OtherPaymentsBlock;
