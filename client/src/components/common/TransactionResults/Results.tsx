import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';

import PseudoModalContainer from '../../PseudoModalContainer';
import { BADGE_TYPES } from '../../Badge/Badge';
import PriceBadge from '../../Badges/PriceBadge/PriceBadge';
import InfoBadge from '../../InfoBadge/InfoBadge';

import { DEFAULT_FIO_TRX_ERR_MESSAGE } from '../../../constants/common';

import { ResultsContainerProps } from './types';

import classes from './Results.module.scss';

export const ERROR_TYPES = {
  TRANSFER_ERROR: 'TRANSFER_ERROR',
  RENEW_ERROR: 'RENEW_ERROR',
};

const ErrorMessages: {
  [action: string]: { title?: string; message?: string };
} = {
  [ERROR_TYPES.TRANSFER_ERROR]: {
    title: 'Transfer error',
    message: `${DEFAULT_FIO_TRX_ERR_MESSAGE}`
      .replace('purchase', 'transfer')
      .replace('registrations', 'transfer'),
  },
  [ERROR_TYPES.RENEW_ERROR]: {
    title: 'Renew error',
    message: `${DEFAULT_FIO_TRX_ERR_MESSAGE}`
      .replace('purchase', 'renew')
      .replace('registrations', 'renewal'),
  },
};

const Results: React.FC<ResultsContainerProps> = props => {
  const {
    results: {
      feeCollected: { costFio, costUsdc } = { costFio: 0, costUsdc: 0 },
      error,
    },
    title,
    hasAutoWidth,
    errorType,
    resetTransactionResult,
    onClose,
    onRetry,
    children,
  } = props;

  useEffect(
    () => () => {
      resetTransactionResult();
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
      errorType && ErrorMessages[errorType] != null
        ? ErrorMessages[errorType]
        : {};
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
      hasAutoWidth={hasAutoWidth}
    >
      <div className={classes.container}>
        {errorBadge()}
        {children}
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
