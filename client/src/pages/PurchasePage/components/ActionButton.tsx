import React from 'react';
import { Button } from 'react-bootstrap';

import PurchaseNow from '../../../components/PurchaseNow';

import { RegistrationResult } from '../../../types';

import classes from '../styles/PurchasePage.module.scss';

type Props = {
  closeText: string;
  isRetry: boolean;
  onClose: () => void;
  onFinish: (results: RegistrationResult) => void;
};

export const ActionButton: React.FC<Props> = props => {
  const { closeText, isRetry, onFinish, onClose } = props;

  if (isRetry) return <PurchaseNow onFinish={onFinish} isRetry={isRetry} />;

  return (
    <Button onClick={onClose} className={classes.button}>
      {closeText}
    </Button>
  );
};
