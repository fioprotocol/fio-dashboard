import React, { useEffect } from 'react';
import { Field, InjectedFormProps } from 'redux-form';
import { Button } from 'react-bootstrap';

import PseudoModalContainer from '../../PseudoModalContainer';
import InputRedux, { INPUT_UI_STYLES } from '../../Input/InputRedux';
import { BADGE_TYPES } from '../../Badge/Badge';
import PriceBadge from '../../Badges/PriceBadge/PriceBadge';
import PayWithBadge from '../../Badges/PayWithBadge/PayWithBadge';
import LowBalanceBadge from '../../Badges/LowBalanceBadge/LowBalanceBadge';
import InfoBadge from '../../InfoBadge/InfoBadge';

import { ROUTES } from '../../../constants/routes';
import { ContainerProps } from './types';

import classes from './FioNameTransferContainer.module.scss';
import { fioNameLabels } from '../../../constants/labels';

const PLACEHOLDER = 'Enter FIO Address or FIO Public Key of New Onwer';
const FIO_NAME_DATA = {
  address: {
    infoMessage: 'Transferring a FIO Address will purge all linked wallets',
    backLink: ROUTES.FIO_ADDRESSES,
    forwardLink: ROUTES.FIO_ADDRESS_TRANSFER_SUCCESS,
  },
  domain: {
    infoMessage:
      'Transferring a FIO Domain will not transfer ownership of FIO Addresses on that Domain',
    backLink: ROUTES.FIO_DOMAINS,
    forwardLink: ROUTES.FIO_DOMAIN_TRANSFER_SUCCESS,
  },
};

const LOW_BALANCE_TEXT = {
  buttonText: 'Where to Buy',
  messageText:
    'Unfortunately there is not enough FIO available to complete your purchase. Please purchase or deposit additional FIO',
};

export const FioNameTransferContainer: React.FC<ContainerProps &
  InjectedFormProps<{}, ContainerProps>> = props => {
  const {
    walletPublicKey,
    currentWallet,
    feePrice,
    history,
    handleSubmit,
    name,
    pageName,
    refreshBalance,
  } = props;

  const { costFio, costUsdc } = feePrice;

  useEffect(() => {
    refreshBalance(walletPublicKey);
  }, []);

  const fioNameLabel = fioNameLabels[pageName];
  const title = `Transfer FIO ${fioNameLabel} Ownership`;

  const hasLowBalance =
    currentWallet && feePrice && currentWallet.balance < feePrice.costFio;

  const handleTransfer = () => {
    // todo: set transfer action method and real returned feeCollected and publicKey data;
    const results = {
      feeCollected: {
        costFio: feePrice.costFio,
        costUsdc: feePrice.costUsdc,
      },
      name,
      publicKey: walletPublicKey,
    };
    history.push({
      pathname: FIO_NAME_DATA[pageName].forwardLink,
      state: results,
    });
  };

  return (
    <PseudoModalContainer link={FIO_NAME_DATA[pageName].backLink} title={title}>
      <div className={classes.container}>
        <div className={classes.badgeContainer}>
          <InfoBadge
            message={FIO_NAME_DATA[pageName].infoMessage}
            title="Important Information"
            type={BADGE_TYPES.INFO}
            show={true}
          />
        </div>
        <p className={classes.nameContainer}>
          {fioNameLabel}: <span className={classes.name}>{name}</span>
        </p>
        <p className={classes.label}>Transfer Information</p>
        <form onSubmit={handleSubmit} className={classes.form}>
          <Field
            name={pageName}
            type="text"
            placeholder={PLACEHOLDER}
            component={InputRedux}
            showCopyButton={true}
            uiType={INPUT_UI_STYLES.BLACK_WHITE}
          />
          <p className={classes.label}>{fioNameLabel} Transfer Cost</p>
          <PriceBadge
            costFio={costFio}
            costUsdc={costUsdc}
            title={`${fioNameLabel} Transfer Fee`}
            type={BADGE_TYPES.BLACK}
          />
          <PayWithBadge
            costFio={costFio}
            costUsdc={costUsdc}
            currentWallet={currentWallet}
          />
          <LowBalanceBadge
            {...LOW_BALANCE_TEXT}
            hasLowBalance={hasLowBalance}
          />
          <Button
            className={classes.button}
            disabled={hasLowBalance}
            onClick={handleTransfer}
          >
            Transfer Now
          </Button>
        </form>
      </div>
    </PseudoModalContainer>
  );
};
