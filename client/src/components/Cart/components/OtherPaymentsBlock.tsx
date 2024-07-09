import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

import { PaymentOptions } from '../../PaymentOptions';

import { PaymentOptionsProps, CartItem, PaymentProvider } from '../../../types';

import classes from '../styles/OtherPaymentsBlock.module.scss';

type Props = {
  isAffiliateEnabled: boolean;
  defaultShowState: boolean;
  optionsDisabled: boolean;
  disabled?: boolean;
  paymentOptionsList: PaymentOptionsProps[];
  cartItems?: CartItem[];
  selectedPaymentProvider: PaymentProvider;
  totalCartUsdcAmount: string;
  formsOfPayment: { [key: string]: boolean };
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
    totalCartUsdcAmount,
    formsOfPayment,
    isAffiliateEnabled,
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
        totalCartUsdcAmount={totalCartUsdcAmount}
        formsOfPayment={formsOfPayment}
        isAffiliateEnabled={isAffiliateEnabled}
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
