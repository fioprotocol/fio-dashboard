import React from 'react';
import { Button } from 'react-bootstrap';

import PseudoModalContainer from '../../components/PseudoModalContainer';
import DomainStatusBadge from '../../components/Badges/DomainStatusBadge/DomainStatusBadge';
import PriceBadge from '../../components/Badges/PriceBadge/PriceBadge';
import PayWithBadge from '../../components/Badges/PayWithBadge/PayWithBadge';
import LowBalanceBadge from '../../components/Badges/LowBalanceBadge/LowBalanceBadge';
import InfoBadge from '../../components/InfoBadge/InfoBadge';
import { BADGE_TYPES } from '../../components/Badge/Badge';

import { ROUTES } from '../../constants/routes';
import { DOMAIN_STATUS } from '../../constants/common';

import { FormProps } from './types';

import classes from './FioDomainStatusChangePage.module.scss';

const INFO_MESSAGE_TEXT = {
  [DOMAIN_STATUS.PUBLIC]:
    'making your domain public will allow anyone to register a FIO Address on that domain',
  [DOMAIN_STATUS.PRIVATE]:
    'making your domain private will only allow the owner of the domain to register FIO Addresses on it.',
};

const FioDomainStatusChangeForm: React.FC<FormProps> = props => {
  const {
    statusToChange,
    fioWallet,
    feePrice,
    name,
    hasLowBalance,
    processing,
    handleSubmit,
  } = props;

  const { costFio, costUsdc } = feePrice;

  return (
    <PseudoModalContainer
      link={ROUTES.FIO_DOMAINS}
      title="Change Domain Status"
    >
      <div className={classes.container}>
        <InfoBadge
          title="Important information"
          show={true}
          message={INFO_MESSAGE_TEXT[statusToChange]}
          type={BADGE_TYPES.INFO}
        />
        <div className={classes.nameContainer}>
          Domain: <span className={classes.name}>{name}</span>
        </div>
        <div className={classes.statusContainer}>
          <h5 className={classes.label}>Change Status to:</h5>
          <div className={classes.statusBadge}>
            <DomainStatusBadge status={statusToChange} />
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
          currentWallet={fioWallet}
        />
        <LowBalanceBadge hasLowBalance={hasLowBalance} />
        <Button
          className={classes.button}
          onClick={handleSubmit}
          disabled={processing || hasLowBalance}
        >
          Change Status
        </Button>
      </div>
    </PseudoModalContainer>
  );
};

export default FioDomainStatusChangeForm;
