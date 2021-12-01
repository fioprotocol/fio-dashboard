import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import classes from './SubmitButton.module.scss';

type Props = {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  isGreen?: boolean;
  withBottomMargin?: boolean;
  text?: string;
};

const SubmitButton: React.FC<Props> = props => {
  const { onClick, disabled, loading, isGreen, withBottomMargin, text } = props;

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
        withBottomMargin && classes.bottomMargin,
      )}
    >
      {text || 'Confirm'}{' '}
      {loading && (
        <FontAwesomeIcon icon="spinner" spin className={classes.loader} />
      )}
    </Button>
  );
};

export default SubmitButton;
