import React from 'react';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import Loader from '../../Loader/Loader';

import { ClickEventTypes } from '../../../types';

import classes from './SubmitButton.module.scss';

type Props = {
  className?: string;
  disabled?: boolean;
  hasAutoHeight?: boolean;
  hasAutoWidth?: boolean;
  hasBoldText?: boolean;
  hasHoveredBlackTextColor?: boolean;
  hasLowHeight?: boolean;
  hasNoSidePaddings?: boolean;
  hasSmallText?: boolean;
  hasWhiteHoverBackground?: boolean;
  isBlack?: boolean;
  isButtonType?: boolean;
  isCobalt?: boolean;
  isGreen?: boolean;
  isGreenTeal?: boolean;
  isLightBlack?: boolean;
  isRed?: boolean;
  isTransparent?: boolean;
  isWhite?: boolean;
  isWhiteBordered?: boolean;
  isWhiteViolet?: boolean;
  loading?: boolean;
  text?: string | React.ReactNode;
  title?: string;
  variant?: string;
  withBottomMargin?: boolean;
  withoutMargin?: boolean;
  withTopMargin?: boolean;
  onClick?: (() => void) | ((event: ClickEventTypes) => void);
};

export const SubmitButton: React.FC<Props> = props => {
  const {
    className = '',
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
    isLightBlack,
    isRed,
    isTransparent,
    isWhite,
    isWhiteBordered,
    isWhiteViolet,
    loading,
    text,
    title,
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
      title={title}
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
        isLightBlack && classes.isLightBlack,
        isRed && classes.isRed,
        isTransparent && classes.isTransparent,
        isWhite && classes.isWhite,
        isWhiteBordered && classes.isWhiteBordered,
        isWhiteViolet && classes.isWhiteViolet,
        loading && classes.loading,
        withBottomMargin && classes.bottomMargin,
        withoutMargin && classes.withoutMargin,
        withTopMargin && classes.topMargin,
        className,
      )}
    >
      <div />
      <div>{text || 'Confirm'}</div>
      <div>{loading && <Loader className={classes.loader} />}</div>
    </Button>
  );
};

export default SubmitButton;
