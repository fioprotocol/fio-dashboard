import React from 'react';
import classnames from 'classnames';

import { useCheckIfDesktop } from '../../../screenType';
import Badge, { BADGE_TYPES } from '../../Badge/Badge';
import { useConvertFioToUsdc } from '../../../util/hooks';

import { FioWalletDoublet } from '../../../types';

import classes from './PayWithBadge.module.scss';

type Props = {
  costFree?: boolean;
  currentWallet: FioWalletDoublet;
};

const PayWithBadge: React.FC<Props> = props => {
  const { costFree, currentWallet } = props;
  const isDesktop = useCheckIfDesktop();

  const walletUsdc = useConvertFioToUsdc({
    fioAmount: currentWallet?.balance || 0,
  });

  if (costFree) return null;

  const renderWalletBalance = () => {
    const wallet = (currentWallet && currentWallet.balance) || 0;

    return `${wallet && wallet.toFixed(2)} FIO / ${walletUsdc &&
      walletUsdc.toFixed(2)} USDC`;
  };

  return (
    <>
      {!isDesktop && (
        <h6 className={classnames(classes.subtitle, classes.paymentTitle)}>
          Paying With
        </h6>
      )}
      <Badge type={BADGE_TYPES.WHITE} show>
        <div className={classes.item}>
          {isDesktop && (
            <span className={classnames('boldText', classes.title)}>
              Paying With
            </span>
          )}
          <div className={classes.wallet}>
            <p className={classes.title}>
              <span className="boldText">FIO Wallet</span>
            </p>
            <p className={classes.balance}>
              (Available Balance {renderWalletBalance()})
            </p>
          </div>
        </div>
      </Badge>
    </>
  );
};

export default PayWithBadge;
