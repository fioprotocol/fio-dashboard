import React, { useEffect } from 'react';

import PseudoModalContainer from '../../PseudoModalContainer';
import { BADGE_TYPES } from '../../Badge/Badge';
import PriceBadge from '../../Badges/PriceBadge/PriceBadge';
import InfoBadge from '../../InfoBadge/InfoBadge';
import SubmitButton from '../SubmitButton/SubmitButton';

import { ERROR_MESSAGES } from './constants';

import { DEFAULT_FIO_TRX_ERR_MESSAGE } from '../../../constants/errors';

import { ResultsContainerProps } from './types';

import classes from './styles/Results.module.scss';

const Results: React.FC<ResultsContainerProps> = props => {
  const {
    results: {
      feeCollected: { costFio, costUsdc } = { costFio: 0, costUsdc: 0 },
      error,
    },
    title,
    hasAutoWidth,
    fullWidth,
    middleWidth,
    bottomElement,
    errorType,
    onClose,
    onRetry,
    children,
  } = props;

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
      onClose={onClose}
      hasAutoWidth={hasAutoWidth}
      fullWidth={fullWidth}
      middleWidth={middleWidth}
    >
      <div className={classes.container}>
        {errorBadge()}
        {children}
        {!error && (
          <>
            {totalCost()}
            <SubmitButton onClick={onClose} text="Close" withTopMargin={true} />
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
