import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';

import PseudoModalContainer from '../../PseudoModalContainer';
import Badge, { BADGE_TYPES } from '../../Badge/Badge';
import PriceBadge from '../../Badges/PriceBadge/PriceBadge';
import InfoBadge from '../../InfoBadge/InfoBadge';

import { fioNameLabels } from '../../../constants/labels';
import { ROUTES } from '../../../constants/routes';

import { FioTransferResultsProps, HistoryLocationStateProps } from './types';

import classes from './FioNameTransferResults.module.scss';

const REDIRECT = {
  address: ROUTES.FIO_ADDRESSES,
  domain: ROUTES.FIO_DOMAINS,
};

const FioNameTransferResults: React.FC<FioTransferResultsProps &
  RouteComponentProps &
  HistoryLocationStateProps> = props => {
  const { history, location, pageName, resetTransactionResult } = props;
  const {
    state: {
      feeCollected: { costFio, costUsdc },
      name,
      publicKey = '-',
      error,
    },
  } = location;

  useEffect(
    () => () => {
      resetTransactionResult();
    },
    [],
  );

  const onCloseClick = () => {
    history.push(REDIRECT[pageName]);
  };

  const fioNameLabel = fioNameLabels[pageName];
  const title = !error ? 'Ownership Transfered!' : 'Ownership Transfer Failed!';

  return (
    <PseudoModalContainer
      title={title}
      onClose={onCloseClick}
      hasAutoWidth={true}
    >
      <div className={classes.container}>
        {error && (
          <InfoBadge
            show={true}
            type={BADGE_TYPES.ERROR}
            title="Error"
            message={error}
          />
        )}
        <p className={classes.label}>Transfer Information</p>
        <Badge show={true} type={BADGE_TYPES.WHITE}>
          <div className={classes.badgeContainer}>
            <p className={classes.title}>{fioNameLabel}</p>
            <p className={classes.item}>{name}</p>
          </div>
        </Badge>
        <Badge show={true} type={BADGE_TYPES.WHITE}>
          <div className={classes.badgeContainer}>
            <p className={classes.title}>Public Key</p>
            <p className={classes.item}>{publicKey}</p>
          </div>
        </Badge>
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
        <Button className={classes.button} onClick={onCloseClick}>
          Close
        </Button>
      </div>
    </PseudoModalContainer>
  );
};

export default FioNameTransferResults;
