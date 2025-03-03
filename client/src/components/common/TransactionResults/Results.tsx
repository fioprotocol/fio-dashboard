import React, { useEffect } from 'react';

import PseudoModalContainer from '../../PseudoModalContainer';
import { TransactionDetails } from '../../TransactionDetails/TransactionDetails';
import { BADGE_TYPES } from '../../Badge/Badge';
import InfoBadge from '../../InfoBadge/InfoBadge';
import SubmitButton from '../SubmitButton/SubmitButton';
import CancelButton from '../CancelButton/CancelButton';

import MathOp from '../../../util/math';

import { ERROR_MESSAGES } from './constants';

import { DEFAULT_FIO_TRX_ERR_MESSAGE } from '../../../constants/errors';

import { ResultsContainerProps } from './types';

import classes from './styles/Results.module.scss';

const Results: React.FC<ResultsContainerProps> = props => {
  const {
    results: {
      payWith,
      feeCollected: { nativeFio } = {
        nativeFio: '0',
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
            {isPaymentDetailsVisible &&
              ((nativeFio && new MathOp(nativeFio).gt(0)) ||
                !!bundlesCollected) && (
                <>
                  <p className={classes.label}>Transaction Details</p>
                  <TransactionDetails
                    feeInFio={nativeFio ? nativeFio : null}
                    bundles={
                      bundlesCollected
                        ? {
                            fee: bundlesCollected,
                          }
                        : null
                    }
                    payWith={payWith}
                  />
                </>
              )}
            <SubmitButton
              className={classes.submitButton}
              onClick={handleClose}
              text="Close"
              withTopMargin
            />
            {onCancel && (
              <div className={classes.cancelButton}>
                <CancelButton
                  text="Cancel Request"
                  onClick={onCancel}
                  isIndigo
                  withTopMargin
                />
              </div>
            )}
          </>
        )}
        {error && onRetry != null ? (
          <SubmitButton
            className={classes.submitButton}
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
