import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

import { PaymentOptions } from '../../PaymentOptions';

import { PaymentOptionsProps, CartItem } from '../../../types';

import classes from '../styles/OtherPaymentsBlock.module.scss';

type Props = {
  defaultShowState: boolean;
  disabled: boolean;
  paymentOptionsList: PaymentOptionsProps[];
  cartItems?: CartItem[];
  onPaymentChoose: (paymentOption: PaymentOptionsProps) => void;
};

const OtherPaymentsBlock: React.FC<Props> = props => {
  const {
    defaultShowState,
    paymentOptionsList,
    disabled,
    cartItems,
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
      />
    );

  return (
    <Button
      className={classes.button}
      onClick={onOtherPaymentsClick}
      variant="link"
      disabled={disabled}
    >
      Other Payment Options
    </Button>
  );
};

export default OtherPaymentsBlock;
