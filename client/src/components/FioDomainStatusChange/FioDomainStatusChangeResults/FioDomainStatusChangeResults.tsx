import React from 'react';
import { Button } from 'react-bootstrap';
import { ROUTES } from '../../../constants/routes';
import PseudoModalContainer from '../../PseudoModalContainer';
import InfoBadge from '../../InfoBadge/InfoBadge';
import Badge, { BADGE_TYPES } from '../../Badge/Badge';
import DomainStatusBadge from '../../Badges/DomainStatusBadge/DomainStatusBadge';
import PriceBadge from '../../Badges/PriceBadge/PriceBadge';

import { ComponentProps } from './types';
import classes from './FioDomainStatusChangeResults.module.scss';

const FioDomainStatusChangeResults: React.FC<ComponentProps> = props => {
  const { history, location } = props;

  const {
    state: {
      feeCollected: { costFio, costUsdc },
      name,
      changedStatus,
      error,
    },
  } = location;

  const onCloseClick = () => {
    history.push(ROUTES.FIO_DOMAINS);
  };

  const title = !error
    ? 'Domain Status Changed!'
    : 'Domain Status Change Failed!';
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
        <h5 className={classes.label}>Status Change Information</h5>
        <div className={classes.badges}>
          <div className={classes.nameBadge}>
            <Badge show={true} type={BADGE_TYPES.WHITE}>
              <div className={classes.badgeContainer}>
                <p className={classes.badgeItem}>Domain</p>
                <p className={classes.badgeItemNext}>{name}</p>
              </div>
            </Badge>
          </div>
          <div className={classes.statusBadge}>
            <Badge show={true} type={BADGE_TYPES.WHITE}>
              <div className={classes.badgeContainer}>
                <p className={classes.badgeItem}>New Status</p>
                <div className={classes.badgeItemNext}>
                  <DomainStatusBadge status={changedStatus} />
                </div>
              </div>
            </Badge>
          </div>
        </div>
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

export default FioDomainStatusChangeResults;
