import React from 'react';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import Loader from '../../Loader/Loader';

import classes from '../styles/PaymentOptions.module.scss';

export type PaymentButtonProps = {
  buttonText: React.ReactNode;
  icon?: React.ReactNode | null;
  isTextCentered?: boolean;
  hasCobaltBackground?: boolean;
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
    isTextCentered,
    hasCobaltBackground,
    disabled,
    hideButton,
    afterTextIcon,
    loading,
    onClick,
  } = props;

  if (hideButton) return null;

  return (
    <Button
      className={classnames(
        classes.button,
        hasCobaltBackground && classes.hasCobaltBackground,
        isTextCentered && classes.isTextCentered,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <div className="mr-2">{icon}</div>}
      <div className={classes.buttonText}>{buttonText}</div>
      {afterTextIcon && <div className="ml-2">{afterTextIcon}</div>}
      {loading && (
        <div>
          <Loader isWhite hasSmallSize />
        </div>
      )}
    </Button>
  );
};
