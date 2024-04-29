import React, { useEffect } from 'react';

import PseudoModalContainer from '../../PseudoModalContainer';
import { TransactionDetails } from '../../TransactionDetails/TransactionDetails';
import { BADGE_TYPES } from '../../Badge/Badge';
import InfoBadge from '../../InfoBadge/InfoBadge';
import SubmitButton from '../SubmitButton/SubmitButton';
import CancelButton from '../CancelButton/CancelButton';

import { ERROR_MESSAGES } from './constants';

import { DEFAULT_FIO_TRX_ERR_MESSAGE } from '../../../constants/errors';

import { ResultsContainerProps } from './types';

import classes from './styles/Results.module.scss';

const Results: React.FC<ResultsContainerProps> = props => {
  const {
    results: {
      feeCollected: { nativeFio } = {
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

    return <p className={classes.label}>Transactions Details</p>;
  };
  const totalCost = () => {
    if (!nativeFio) return null;
    return <TransactionDetails feeInFio={nativeFio} />;
  };

  const totalBundlesCost = () => {
    if (!bundlesCollected) return null;
    return (
      <>
        <TransactionDetails
          bundles={{
            fee: bundlesCollected,
          }}
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
