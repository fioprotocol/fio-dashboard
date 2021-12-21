import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import { ClickEventTypes } from '../../../pages/SettingsPage/components/ChangePin/types';

import classes from './SubmitButton.module.scss';

type Props = {
  onClick?: (() => void) | ((event: ClickEventTypes) => void);
  disabled?: boolean;
  loading?: boolean;
  isGreen?: boolean;
  isGreenTeal?: boolean;
  isBlack?: boolean;
  withBottomMargin?: boolean;
  withTopMargin?: boolean;
  text?: string;
  hasLowHeight?: boolean;
  hasBoldText?: boolean;
  isButtonType?: boolean;
};

const SubmitButton: React.FC<Props> = props => {
  const {
    onClick,
    disabled,
    loading,
    isGreen,
    isGreenTeal,
    isBlack,
    withTopMargin,
    withBottomMargin,
    text,
    hasLowHeight,
    hasBoldText,
  } = props;

  return (
    <Button
      type={onClick != null ? 'button' : 'submit'}
      disabled={disabled}
      onClick={onClick}
      className={classnames(
        classes.button,
        isGreen && classes.isGreen,
        isGreenTeal && classes.isGreenTeal,
        isBlack && classes.isBlack,
        disabled && classes.disabled,
        loading && classes.loading,
        withTopMargin && classes.topMargin,
        withBottomMargin && classes.bottomMargin,
        hasLowHeight && classes.hasLowHeight,
        hasBoldText && classes.hasBoldText,
      )}
    >
      <div />
      <div>{text || 'Confirm'}</div>
      <div>{loading && <FontAwesomeIcon icon="spinner" spin />}</div>
    </Button>
  );
};

export default SubmitButton;
