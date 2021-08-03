import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import PseudoModalContainer from '../../PseudoModalContainer';
import PriceBadge from '../../Badges/PriceBadge/PriceBadge';
import { BADGE_TYPES } from '../../Badge/Badge';

import { HistoryLocationStateProps } from './types';
import classes from './FioNameRenewResults.module.scss';

const FioNameRenewResults: React.FC<HistoryLocationStateProps &
  RouteComponentProps> = props => {
  const { history, location } = props;
  const {
    state: { link, name, feeCollected },
  } = location;
  const { costFio, costUsdc } = feeCollected;
  const onCloseClick = () => {
    history.push(link);
  };
  return (
    <PseudoModalContainer title="Renewed!" onClose={onCloseClick}>
      <div className={classes.container}>
        <h5 className={classes.label}>Renew Details</h5>
        <PriceBadge
          costFio={costFio}
          costUsdc={costUsdc}
          title={name}
          type={BADGE_TYPES.WHITE}
        />
        <h5 className={classes.label}>Payment Details</h5>
        <PriceBadge
          costFio={costFio}
          costUsdc={costUsdc}
          title="Total Cost"
          type={BADGE_TYPES.BLACK}
        />
        <Button onClick={onCloseClick} className={classes.button}>
          Close
        </Button>
      </div>
    </PseudoModalContainer>
  );
};

export default FioNameRenewResults;
