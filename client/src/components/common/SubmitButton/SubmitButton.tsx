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
  withBottomMargin?: boolean;
  withTopMargin?: boolean;
  text?: string;
};

const SubmitButton: React.FC<Props> = props => {
  const {
    onClick,
    disabled,
    loading,
    isGreen,
    withTopMargin,
    withBottomMargin,
    text,
  } = props;

  return (
    <Button
      type={onClick != null ? 'button' : 'submit'}
      disabled={disabled}
      onClick={onClick}
      className={classnames(
        classes.button,
        isGreen && classes.isGreen,
        disabled && classes.disabled,
        loading && classes.loading,
        withTopMargin && classes.topMargin,
        withBottomMargin && classes.bottomMargin,
      )}
    >
      <div />
      <div>{text || 'Confirm'}</div>
      <div>{loading && <FontAwesomeIcon icon="spinner" spin />}</div>
    </Button>
  );
};

export default SubmitButton;
