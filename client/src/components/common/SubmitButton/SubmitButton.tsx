import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import { ClickEventTypes } from '../../../types';

import classes from './SubmitButton.module.scss';

type Props = {
  disabled?: boolean;
  loading?: boolean;
  isWhiteBordered?: boolean;
  isTransparent?: boolean;
  isWhite?: boolean;
  isGreen?: boolean;
  isGreenTeal?: boolean;
  isBlack?: boolean;
  isCobalt?: boolean;
  hasHoveredBlackTextColor?: boolean;
  withBottomMargin?: boolean;
  withTopMargin?: boolean;
  withoutMargin?: boolean;
  text?: string | React.ReactNode;
  hasAutoHeight?: boolean;
  hasLowHeight?: boolean;
  hasBoldText?: boolean;
  hasWhiteHoverBackground?: boolean;
  isButtonType?: boolean;
  hasSmallText?: boolean;
  hasAutoWidth?: boolean;
  variant?: string;
  hasNoSidePaddings?: boolean;
  onClick?: (() => void) | ((event: ClickEventTypes) => void);
};

export const SubmitButton: React.FC<Props> = props => {
  const {
    disabled,
    hasAutoHeight,
    hasAutoWidth,
    hasBoldText,
    hasHoveredBlackTextColor,
    hasLowHeight,
    hasNoSidePaddings,
    hasSmallText,
    hasWhiteHoverBackground,
    isBlack,
    isButtonType,
    isCobalt,
    isGreen,
    isGreenTeal,
    isTransparent,
    isWhite,
    isWhiteBordered,
    loading,
    text,
    variant,
    withBottomMargin,
    withoutMargin,
    withTopMargin,
    onClick,
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
        disabled && classes.disabled,
        hasAutoHeight && classes.hasAutoHeight,
        hasAutoWidth && classes.hasAutoWidth,
        hasBoldText && classes.hasBoldText,
        hasHoveredBlackTextColor && classes.hasHoveredBlackTextColor,
        hasLowHeight && classes.hasLowHeight,
        hasNoSidePaddings && classes.hasNoSidePaddings,
        hasSmallText && classes.hasSmallText,
        hasWhiteHoverBackground && classes.hasWhiteHoverBackground,
        isBlack && classes.isBlack,
        isCobalt && classes.isCobalt,
        isGreen && classes.isGreen,
        isGreenTeal && classes.isGreenTeal,
        isTransparent && classes.isTransparent,
        isWhite && classes.isWhite,
        isWhiteBordered && classes.isWhiteBordered,
        loading && classes.loading,
        withBottomMargin && classes.bottomMargin,
        withoutMargin && classes.withoutMargin,
        withTopMargin && classes.topMargin,
      )}
    >
      <div />
      <div>{text || 'Confirm'}</div>
      <div>{loading && <FontAwesomeIcon icon="spinner" spin />}</div>
    </Button>
  );
};

export default SubmitButton;
