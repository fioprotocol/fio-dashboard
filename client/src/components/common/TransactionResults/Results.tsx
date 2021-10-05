import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';

import PseudoModalContainer from '../../PseudoModalContainer';
import { BADGE_TYPES } from '../../Badge/Badge';
import PriceBadge from '../../Badges/PriceBadge/PriceBadge';
import InfoBadge from '../../InfoBadge/InfoBadge';

import { ResultsProps } from './types';

import classes from './Results.module.scss';
import TransferResults from './components/TransferResults';
import RenewResults from './components/RenewResults';
import SetVisibilityResults from './components/SetVisibilityResults';
import SignResults from './components/SignResults';
import { TRANSFER_REQUEST, RENEW_REQUEST } from '../../../redux/fio/actions';
import { DEFAULT_FIO_TRX_ERR_MESSAGE } from '../../../constants/common';

const ErrorMessages: {
  [action: string]: { title?: string; message?: string };
} = {
  [TRANSFER_REQUEST]: {
    title: 'Transfer error',
    message: `${DEFAULT_FIO_TRX_ERR_MESSAGE}`
      .replace('purchase', 'transfer')
      .replace('registrations', 'transfer'),
  },
  [RENEW_REQUEST]: {
    title: 'Renew error',
    message: `${DEFAULT_FIO_TRX_ERR_MESSAGE}`
      .replace('purchase', 'renew')
      .replace('registrations', 'renewal'),
  },
};

const Results: React.FC<ResultsProps> = props => {
  const {
    results: {
      feeCollected: { costFio, costUsdc } = { costFio: 0, costUsdc: 0 },
      error,
    },
    title,
    actionName,
    resetTransactionResult,
    onClose,
    onRetry,
  } = props;

  useEffect(
    () => () => {
      resetTransactionResult(actionName);
    },
    [],
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const totalCost = () => {
    if (!costFio) return null;
    return (
      <>
        <p className={classes.label}>Payment Details</p>
        <PriceBadge
          costFio={costFio}
          costUsdc={costUsdc}
          title="Total Cost"
          type={BADGE_TYPES.BLACK}
        />
      </>
    );
  };

  const errorBadge = () => {
    if (!error) return null;
    const { title = 'Error', message = DEFAULT_FIO_TRX_ERR_MESSAGE } =
      ErrorMessages[actionName] != null ? ErrorMessages[actionName] : {};
    return (
      <InfoBadge
        show={true}
        type={BADGE_TYPES.ERROR}
        title={title}
        message={message}
      />
    );
  };

  return (
    <PseudoModalContainer
      title={title}
      onClose={onClose}
      hasAutoWidth={actionName !== RENEW_REQUEST}
    >
      <div className={classes.container}>
        {errorBadge()}
        <TransferResults {...props} />
        <RenewResults {...props} />
        <SetVisibilityResults {...props} />
        <SignResults {...props} />
        {!error && (
          <>
            {totalCost()}
            <Button className={classes.button} onClick={onClose}>
              Close
            </Button>
          </>
        )}
        {error && onRetry != null ? (
          <Button className={classes.button} onClick={onRetry}>
            Try Again
          </Button>
        ) : null}
      </div>
    </PseudoModalContainer>
  );
};

export default Results;
