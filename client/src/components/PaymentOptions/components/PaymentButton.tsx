import React from 'react';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import classes from '../styles/PaymentOptions.module.scss';

export type PaymentButtonProps = {
  buttonText: string;
  icon?: React.ReactNode | null;
  hasRoyalBlueBackground?: boolean;
  disabled?: boolean;
  hideButton?: boolean;
  afterTextIcon?: React.ReactNode | null;
  onClick: () => void;
};

export const PaymentButton: React.FC<PaymentButtonProps> = props => {
  const {
    buttonText,
    icon,
    hasRoyalBlueBackground,
    disabled,
    hideButton,
    afterTextIcon,
    onClick,
  } = props;

  if (hideButton) return null;

  return (
    <Button
      className={classnames(
        classes.button,
        hasRoyalBlueBackground && classes.hasRoyalBlueBackground,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <div className="mr-2">{icon}</div>}
      <p>{buttonText}</p>
      {afterTextIcon && <div className="ml-2">{afterTextIcon}</div>}
    </Button>
  );
};
