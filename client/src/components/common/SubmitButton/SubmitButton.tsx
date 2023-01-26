import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import { ClickEventTypes } from '../../../types';

import classes from './SubmitButton.module.scss';

type Props = {
  onClick?: (() => void) | ((event: ClickEventTypes) => void);
  disabled?: boolean;
  loading?: boolean;
  isWhiteBordered?: boolean;
  isGreen?: boolean;
  isGreenTeal?: boolean;
  isBlack?: boolean;
  isCobalt?: boolean;
  withBottomMargin?: boolean;
  withTopMargin?: boolean;
  withoutMargin?: boolean;
  text?: string | React.ReactNode;
  hasLowHeight?: boolean;
  hasBoldText?: boolean;
  isButtonType?: boolean;
  hasSmallText?: boolean;
  hasAutoWidth?: boolean;
  variant?: string;
};

export const SubmitButton: React.FC<Props> = props => {
  const {
    onClick,
    disabled,
    loading,
    isWhiteBordered,
    isGreen,
    isGreenTeal,
    isBlack,
    isCobalt,
    withTopMargin,
    withBottomMargin,
    withoutMargin,
    text,
    hasLowHeight,
    hasBoldText,
    hasSmallText,
    hasAutoWidth,
    variant,
    isButtonType,
  } = props;

  return (
    <Button
      type={onClick != null || isButtonType ? 'button' : 'submit'}
      variant={variant}
      disabled={disabled}
      onClick={onClick}
      className={classnames(
        classes.button,
        !variant && classes.defaultColor,
        isWhiteBordered && classes.isWhiteBordered,
        isGreen && classes.isGreen,
        isGreenTeal && classes.isGreenTeal,
        isBlack && classes.isBlack,
        isCobalt && classes.isCobalt,
        disabled && classes.disabled,
        loading && classes.loading,
        withTopMargin && classes.topMargin,
        withBottomMargin && classes.bottomMargin,
        withoutMargin && classes.withoutMargin,
        hasLowHeight && classes.hasLowHeight,
        hasBoldText && classes.hasBoldText,
        hasSmallText && classes.hasSmallText,
        hasAutoWidth && classes.hasAutoWidth,
      )}
    >
      <div />
      <div>{text || 'Confirm'}</div>
      <div>{loading && <FontAwesomeIcon icon="spinner" spin />}</div>
    </Button>
  );
};

export default SubmitButton;
