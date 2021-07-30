import React from 'react';
import { Button } from 'react-bootstrap';

import { ROUTES } from '../../../constants/routes';
import PseudoModalContainer from '../../PseudoModalContainer';
import DomainStatusBadge from '../../Badges/DomainStatusBadge/DomainStatusBadge';
import PriceBadge from '../../Badges/PriceBadge/PriceBadge';
import PayWithBadge from '../../Badges/PayWithBadge/PayWithBadge';
import LowBalanceBadge from '../../Badges/LowBalanceBadge/LowBalanceBadge';

import { BADGE_TYPES } from '../../Badge/Badge';

import { ContainerProps } from './types';
import { DOMAIN_STATUS } from '../../../constants/common';

import classes from './FioDomainStatusChangeContainer.module.scss';

const LOW_BALANCE_TEXT = {
  buttonText: 'Where to Buy',
  messageText:
    'Unfortunately there is not enough FIO available to complete your purchase. Please purchase or deposit additional FIO',
};

const FioDomainStatusChangeContainer: React.FC<ContainerProps> = props => {
  const { currentWallet, feePrice, history, name, domainStatus } = props;
  const { costFio, costUsdc } = feePrice;

  const hasLowBalance =
    currentWallet && feePrice && currentWallet.balance < feePrice.costFio;

  const handleStatusChange = () => {
    // todo: set status change action method and real returned feeCollected and changedStatus data;
    const results = {
      feeCollected: {
        costFio: feePrice.costFio,
        costUsdc: feePrice.costUsdc,
      },
      name,
      changedStatus:
        domainStatus === DOMAIN_STATUS.PRIVATE
          ? DOMAIN_STATUS.PUBLIC
          : DOMAIN_STATUS.PRIVATE,
    };
    history.push({
      pathname: ROUTES.FIO_DOMAIN_STATUS_FINISH,
      state: results,
    });
  };

  return (
    <PseudoModalContainer
      link={ROUTES.FIO_DOMAINS}
      title="Change Domain Status"
    >
      <div className={classes.container}>
        <div className={classes.nameContainer}>
          Domain: <span className={classes.name}>{name}</span>
        </div>
        <div className={classes.statusContainer}>
          <h5 className={classes.label}>Change Status to:</h5>
          <div className={classes.statusBadge}>
            <DomainStatusBadge status={domainStatus} />
          </div>
        </div>
        <h5 className={classes.label}>Change Change Cost</h5>
        <div className={classes.badge}>
          <PriceBadge
            costFio={costFio}
            costUsdc={costUsdc}
            type={BADGE_TYPES.BLACK}
            title="Status Change Fee"
          />
        </div>

        <PayWithBadge
          costFio={costFio}
          costUsdc={costUsdc}
          currentWallet={currentWallet}
        />
        <LowBalanceBadge hasLowBalance={hasLowBalance} {...LOW_BALANCE_TEXT} />
        <Button className={classes.button} onClick={handleStatusChange}>
          Change Status
        </Button>
      </div>
    </PseudoModalContainer>
  );
};

export default FioDomainStatusChangeContainer;
