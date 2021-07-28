import React from 'react';
import classnames from 'classnames';

import { currentScreenType } from '../../../screenType';
import { SCREEN_TYPE } from '../../../constants/screen';
import Badge, { BADGE_TYPES } from '../../Badge/Badge';

import { FioWalletDoublet } from '../../../types';

import classes from './PayWithBadge.module.scss';

type Props = {
  costFio: number;
  costFree?: boolean;
  costUsdc: number;
  currentWallet: FioWalletDoublet;
};

const PayWithBadge: React.FC<Props> = props => {
  const { costFree, costFio, costUsdc, currentWallet } = props;
  const { screenType } = currentScreenType();
  const isDesktop = screenType === SCREEN_TYPE.DESKTOP;

  const renderWalletBalance = () => {
    const wallet = (currentWallet && currentWallet.balance) || 0;
    let walletUsdc = 0;
    if (wallet > 0) {
      walletUsdc = (wallet * costUsdc) / costFio;
    }
    return `${wallet && wallet.toFixed(2)} FIO / ${walletUsdc &&
      walletUsdc.toFixed(2)} USDC`;
  };

  return (
    <>
      {!isDesktop && !costFree && (
        <h6 className={classnames(classes.subtitle, classes.paymentTitle)}>
          Paying With
        </h6>
      )}
      {!costFree && (
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
      )}
    </>
  );
};

export default PayWithBadge;
