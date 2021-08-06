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

const Results: React.FC<ResultsProps> = props => {
  const {
    results: {
      feeCollected: { costFio, costUsdc },
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

  return (
    <PseudoModalContainer title={title} onClose={onClose} hasAutoWidth={true}>
      <div className={classes.container}>
        {error && (
          <InfoBadge
            show={true}
            type={BADGE_TYPES.ERROR}
            title="Error"
            message={error}
          />
        )}
        <TransferResults {...props} />
        <RenewResults {...props} />
        <SetVisibilityResults {...props} />
        {!error && (
          <>
            <p className={classes.label}>Payment Details</p>
            <PriceBadge
              costFio={costFio}
              costUsdc={costUsdc}
              title="Total Cost"
              type={BADGE_TYPES.BLACK}
            />
          </>
        )}
        <Button className={classes.button} onClick={error ? onRetry : onClose}>
          {error ? 'Try Again' : 'Close'}
        </Button>
      </div>
    </PseudoModalContainer>
  );
};

export default Results;
