import React from 'react';

import PseudoModalContainer from '../../../components/PseudoModalContainer';
import DomainStatusBadge from '../../../components/Badges/DomainStatusBadge/DomainStatusBadge';
import LowBalanceBadge from '../../../components/Badges/LowBalanceBadge/LowBalanceBadge';
import InfoBadge from '../../../components/InfoBadge/InfoBadge';
import SubmitButton from '../../../components/common/SubmitButton/SubmitButton';
import { TransactionDetails } from '../../../components/TransactionDetails/TransactionDetails';

import { BADGE_TYPES } from '../../../components/Badge/Badge';
import { ROUTES } from '../../../constants/routes';
import { DOMAIN_STATUS } from '../../../constants/common';

import { FormProps } from '../types';

import classes from '../FioDomainStatusChangePage.module.scss';

const INFO_MESSAGE_TEXT = {
  [DOMAIN_STATUS.PUBLIC]:
    'making your domain public will allow anyone to register a FIO Handle on that domain',
  [DOMAIN_STATUS.PRIVATE]:
    'making your domain private will only allow the owner of the domain to register FIO Handles on it.',
};

const FioDomainStatusChangeForm: React.FC<FormProps> = props => {
  const {
    statusToChange,
    feePrice,
    name,
    hasLowBalance,
    processing,
    walletBalancesAvailable,
    fioWallet,
    handleSubmit,
    backLink = ROUTES.FIO_DOMAINS,
  } = props;

  return (
    <PseudoModalContainer link={backLink} title="Change Domain Status">
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
        <h5 className={classes.label}>Transaction Details</h5>
        <div className={classes.badge}>
          <TransactionDetails
            feeInFio={feePrice.nativeFio}
            payWith={{
              walletBalances: walletBalancesAvailable,
              walletName: fioWallet.name,
            }}
          />
        </div>

        <LowBalanceBadge hasLowBalance={hasLowBalance} />
        <SubmitButton
          onClick={handleSubmit}
          text="Change Status"
          disabled={processing || hasLowBalance}
          loading={processing}
          withTopMargin={true}
        />
      </div>
    </PseudoModalContainer>
  );
};

export default FioDomainStatusChangeForm;
