import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';

import { BADGE_TYPES } from '../../Badge/Badge';
import PseudoModalContainer from '../../PseudoModalContainer';
import InfoBadge from '../../InfoBadge/InfoBadge';
import PriceBadge from '../../Badges/PriceBadge/PriceBadge';
import PayWithBadge from '../../Badges/PayWithBadge/PayWithBadge';
import LowBalanceBadge from '../../Badges/LowBalanceBadge/LowBalanceBadge';

import { hasFioAddressDelimiter } from '../../../utils';

import { ROUTES } from '../../../constants/routes';
import { MANAGE_PAGE_REDIRECT } from '../../../constants/common';

import { ContainerProps } from './types';

import classes from './FioNameRenewContainer.module.scss';

const FioNameRenewContainer: React.FC<ContainerProps> = props => {
  const {
    currentWallet,
    feePrice,
    getFee,
    getPrices,
    history,
    name,
    pageName,
    refreshBalance,
    walletPublicKey,
  } = props;

  const { costFio, costUsdc } = feePrice;

  useEffect(() => {
    getPrices();
    getFee(hasFioAddressDelimiter(name));
    refreshBalance(walletPublicKey);
  }, []);

  const hasLowBalance =
    currentWallet && feePrice && currentWallet.balance < feePrice.costFio;

  const handleRenewClick = () => {
    const results = {
      feeCollected: feePrice,
      name,
      link: MANAGE_PAGE_REDIRECT[pageName],
    };

    history.push({
      pathname: ROUTES.FIO_NAME_RENEW_RESULTS,
      state: results,
    });
  };

  return (
    <PseudoModalContainer
      title="Renew Now"
      link={MANAGE_PAGE_REDIRECT[pageName]}
    >
      <div className={classes.container}>
        <InfoBadge
          title="Renewal Information"
          message="This renewal will add 365 days to expiration and 100 Bundle Transactions"
          show={true}
          type={BADGE_TYPES.INFO}
        />
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
        <PayWithBadge
          costFio={costFio}
          costUsdc={costUsdc}
          currentWallet={currentWallet}
        />
        <LowBalanceBadge hasLowBalance={hasLowBalance} />
        <Button onClick={handleRenewClick} className={classes.button}>
          Renew Now
        </Button>
      </div>
    </PseudoModalContainer>
  );
};

export default FioNameRenewContainer;
