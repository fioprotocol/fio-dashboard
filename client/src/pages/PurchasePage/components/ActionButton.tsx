import React from 'react';
import { Button } from 'react-bootstrap';

import classes from '../styles/PurchasePage.module.scss';

type Props = {
  closeText: string;
  isRetry: boolean;
  onClose: () => void;
  onRetry: () => void;
};

export const ActionButton: React.FC<Props> = props => {
  const { closeText, isRetry, onClose, onRetry } = props;

  if (isRetry) {
    return (
      <Button onClick={onRetry} className={classes.button}>
        Try Again
      </Button>
    );
  }

  return (
    <Button onClick={onClose} className={classes.button}>
      {closeText}
    </Button>
  );
};
