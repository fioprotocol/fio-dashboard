import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import PseudoModalContainer from '../../PseudoModalContainer';
import PriceBadge from '../../Badges/PriceBadge/PriceBadge';
import { BADGE_TYPES } from '../../Badge/Badge';

import { HistoryLocationStateProps } from './types';
import classes from './FioNameRenewResults.module.scss';
import InfoBadge from '../../InfoBadge/InfoBadge';

const FioNameRenewResults: React.FC<{
  resetTransactionResult: () => void;
} & HistoryLocationStateProps &
  RouteComponentProps> = props => {
  const { history, location, resetTransactionResult } = props;
  const {
    state: { link, name, feeCollected, error },
  } = location;
  const { costFio, costUsdc } = feeCollected;

  useEffect(
    () => () => {
      resetTransactionResult();
    },
    [],
  );

  const onCloseClick = () => {
    history.push(link);
  };

  const title = error ? 'Renewed Failed!' : 'Renewed!';
  return (
    <PseudoModalContainer title={title} onClose={onCloseClick}>
      <div className={classes.container}>
        {error && (
          <InfoBadge
            show={true}
            type={BADGE_TYPES.ERROR}
            title="Error"
            message={error}
          />
        )}
        <h5 className={classes.label}>Renew Details</h5>
        <PriceBadge
          costFio={costFio}
          costUsdc={costUsdc}
          title={name}
          type={BADGE_TYPES.WHITE}
        />
        {!error && (
          <>
            <h5 className={classes.label}>Payment Details</h5>
            <PriceBadge
              costFio={costFio}
              costUsdc={costUsdc}
              title="Total Cost"
              type={BADGE_TYPES.BLACK}
            />
          </>
        )}
        <Button onClick={onCloseClick} className={classes.button}>
          Close
        </Button>
      </div>
    </PseudoModalContainer>
  );
};

export default FioNameRenewResults;
