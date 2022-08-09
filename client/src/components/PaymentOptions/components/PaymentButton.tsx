import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import Loader from '../../Loader/Loader';

import classes from '../styles/PaymentOptions.module.scss';

export type PaymentButtonProps = {
  buttonText: string;
  icon?: React.ReactNode | null;
  hasRoyalBlueBackground?: boolean;
  disabled?: boolean;
  hideButton?: boolean;
  hidden?: boolean;
  afterTextIcon?: React.ReactNode | null;
  loading: boolean;
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
    loading,
    onClick,
  } = props;

  const [isButtonClicked, toggleIsButtonClicked] = useState(false);

  const handleClick = () => {
    toggleIsButtonClicked(true);
    onClick();
  };

  useEffect(() => {
    if (!loading) {
      toggleIsButtonClicked(false);
    }
  }, [loading]);

  if (hideButton) return null;

  return (
    <Button
      className={classnames(
        classes.button,
        hasRoyalBlueBackground && classes.hasRoyalBlueBackground,
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      {icon && <div className="mr-2">{icon}</div>}
      <p className={classes.buttonText}>{buttonText}</p>
      {afterTextIcon && <div className="ml-2">{afterTextIcon}</div>}
      {loading && isButtonClicked && (
        <Loader isWhite={true} hasInheritFontSize={true} hasAutoWidth={true} />
      )}
    </Button>
  );
};
