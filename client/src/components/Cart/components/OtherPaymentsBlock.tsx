import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

import { PaymentOptions } from '../../PaymentOptions';

import { PaymentOptionsProps } from '../../../types';

import classes from '../styles/OtherPaymentsBlock.module.scss';

type Props = {
  defaultShowState: boolean;
  disabled: boolean;
  paymentOptionsList: PaymentOptionsProps[];
};

const OtherPaymentsBlock: React.FC<Props> = props => {
  const { defaultShowState, paymentOptionsList, disabled } = props;

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
    return <PaymentOptions paymentOptionsList={paymentOptionsList} />;

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
