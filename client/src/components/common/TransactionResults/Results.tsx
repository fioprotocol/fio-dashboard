import React, { useEffect } from 'react';

import PseudoModalContainer from '../../PseudoModalContainer';
import { BADGE_TYPES } from '../../Badge/Badge';
import PriceBadge from '../../Badges/PriceBadge/PriceBadge';
import InfoBadge from '../../InfoBadge/InfoBadge';
import SubmitButton from '../SubmitButton/SubmitButton';
import CancelButton from '../CancelButton/CancelButton';
import BundledTransactionBadge from '../../Badges/BundledTransactionBadge/BundledTransactionBadge';

import { ERROR_MESSAGES } from './constants';

import { DEFAULT_FIO_TRX_ERR_MESSAGE } from '../../../constants/errors';

import { ResultsContainerProps } from './types';

import classes from './styles/Results.module.scss';

const Results: React.FC<ResultsContainerProps> = props => {
  const {
    results: {
      feeCollected: { nativeFio, fio, usdc } = {
        nativeFio: 0,
        fio: '0',
        usdc: '0',
      },
      bundlesCollected = 0,
      error,
    },
    title,
    hasAutoWidth,
    fullWidth,
    middleWidth,
    bottomElement,
    errorType,
    isPaymentDetailsVisible = true,
    onClose,
    onRetry,
    onCancel,
    onTxResultsClose,
    children,
  } = props;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleClose = () => {
    onTxResultsClose();
    onClose();
  };

  const paymentDetailsTitle = () => {
    if (!nativeFio && !bundlesCollected) return null;

    return <p className={classes.label}>Payment Details</p>;
  };
  const totalCost = () => {
    if (!nativeFio) return null;
    return (
      <PriceBadge
        costFio={fio}
        costUsdc={usdc}
        title="Total Cost"
        type={BADGE_TYPES.BLACK}
      />
    );
  };

  const totalBundlesCost = () => {
    if (!bundlesCollected) return null;
    return (
      <>
        <BundledTransactionBadge
          bundles={bundlesCollected}
          remaining={0}
          hideRemaining
        />
      </>
    );
  };

  const errorBadge = () => {
    if (!error) return null;
    const {
      title: errorTitle = 'Error',
      message = DEFAULT_FIO_TRX_ERR_MESSAGE,
    } =
      errorType && ERROR_MESSAGES[errorType] != null
        ? ERROR_MESSAGES[errorType]
        : {};
    return (
      <InfoBadge
        show={true}
        type={BADGE_TYPES.ERROR}
        title={errorTitle}
        message={message}
      />
    );
  };

  return (
    <PseudoModalContainer
      title={title}
      onClose={handleClose}
      hasAutoWidth={hasAutoWidth}
      fullWidth={fullWidth}
      middleWidth={middleWidth}
    >
      <div className={classes.container}>
        {errorBadge()}
        {children}
        {!error && (
          <>
            {isPaymentDetailsVisible && (
              <>
                {paymentDetailsTitle()}
                {totalCost()}
                {totalBundlesCost()}
              </>
            )}
            <SubmitButton onClick={handleClose} text="Close" withTopMargin />
            {onCancel && (
              <CancelButton
                text="Cancel Request"
                onClick={onCancel}
                isIndigo
                withTopMargin
              />
            )}
          </>
        )}
        {error && onRetry != null ? (
          <SubmitButton
            onClick={onRetry}
            text="Try Again"
            withTopMargin={true}
          />
        ) : null}
        {bottomElement}
      </div>
    </PseudoModalContainer>
  );
};

export default Results;
