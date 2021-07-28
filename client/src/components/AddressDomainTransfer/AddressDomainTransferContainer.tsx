import React, { useEffect } from 'react';
import { Field, InjectedFormProps } from 'redux-form';
import { Button } from 'react-bootstrap';

import PseudoModalContainer from '../PseudoModalContainer';
import InputRedux from '../Input/InputRedux';
import { BADGE_TYPES } from '../Badge/Badge';
import PriceBadge from '../Badges/PriceBadge/PriceBadge';
import PayWithBadge from '../Badges/PayWithBadge/PayWithBadge';
import LowBalanceBadge from '../Badges/LowBalanceBadge/LowBalanceBadge';
import InfoBadge from '../InfoBadge/InfoBadge';

import { ContainerProps } from './types';

import colors from '../../assets/styles/colorsToJs.module.scss';
import classes from './AddressDomainTransferContainer.module.scss';
import { fioNameLabels } from '../../constants/labels';
import { getFioNameLinkByType } from '../../utils';

const PLACEHOLDER = 'Enter FIO Address or FIO Public Key of New Onwer';
const INFO_MESSAGE = {
  address: 'Transferring a FIO Address will purge all linked wallets',
  domain:
    'Transferring a FIO Domain will not transfer ownership of FIO Addresses on that Domain',
};
const LOW_BALANCE_TEXT = {
  buttonText: 'Where to Buy',
  messageText:
    'Unfortunately there is not enough FIO available to complete your purchase. Please purchase or deposit additional FIO',
};

export const AddressDomainTransferContainer: React.FC<ContainerProps &
  InjectedFormProps<{}, ContainerProps>> = props => {
  const {
    walletPublicKey,
    currentWallet,
    feePrice,
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
  const link = getFioNameLinkByType(pageName);
  const inputColorSchema = {
    backgroundColor: colors.white,
    borderColor: colors.white,
    color: colors['gray-main'],
  };

  const hasLowBalance =
    currentWallet && feePrice && currentWallet.balance < feePrice.costFio;

  return (
    <PseudoModalContainer link={link} title={title}>
      <div className={classes.container}>
        <InfoBadge
          message={INFO_MESSAGE[pageName]}
          title="Important Information"
          type={BADGE_TYPES.INFO}
          show={true}
        />
        <p className={classes.name}>
          {fioNameLabel}: {name}
        </p>
        <p className={classes.label}>Transfer Information</p>
        <form onSubmit={handleSubmit} className={classes.form}>
          <Field
            name={pageName}
            type="text"
            placeholder={PLACEHOLDER}
            component={InputRedux}
            colorSchema={inputColorSchema}
            showCopyButton={true}
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
          <LowBalanceBadge {...LOW_BALANCE_TEXT} hasLowBalance={hasLowBalance} />
          <Button className={classes.button} disabled={hasLowBalance}>
            Transfer Now
          </Button>
        </form>
      </div>
    </PseudoModalContainer>
  );
};
