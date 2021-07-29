import React from 'react';
import { Button } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';

import PseudoModalContainer from '../../PseudoModalContainer';
import Badge, { BADGE_TYPES } from '../../Badge/Badge';
import PriceBadge from '../../Badges/PriceBadge/PriceBadge';

import { fioNameLabels } from '../../../constants/labels';
import { ROUTES } from '../../../constants/routes';

import { FioTransferSuccessProps, HistoryLocationStateProps } from './types';

import classes from './FioNameTransferSuccess.module.scss';

const REDIRECT = {
  address: ROUTES.FIO_ADDRESSES,
  domain: ROUTES.FIO_DOMAINS,
};

const FioNameTransferSuccess: React.FC<FioTransferSuccessProps &
  RouteComponentProps &
  HistoryLocationStateProps> = props => {
  const { history, location, pageName } = props;
  const {
    state: {
      feeCollected: { costFio, costUsdc },
      name,
      publicKey,
    },
  } = location;

  const onCloseClick = () => {
    history.push(REDIRECT[pageName]);
  };

  const fioNameLabel = fioNameLabels[pageName];

  return (
    <PseudoModalContainer
      title="Ownership Transfered!"
      onClose={onCloseClick}
      hasAutoWidth={true}
    >
      <div className={classes.container}>
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
        <p className={classes.label}>Payment Details</p>
        <PriceBadge
          costFio={costFio}
          costUsdc={costUsdc}
          title="Total Cost"
          type={BADGE_TYPES.BLACK}
        />
        <Button className={classes.button} onClick={onCloseClick}>
          Close
        </Button>
      </div>
    </PseudoModalContainer>
  );
};

export default FioNameTransferSuccess;
