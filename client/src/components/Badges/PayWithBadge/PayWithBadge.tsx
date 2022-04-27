import React from 'react';
import classnames from 'classnames';

import Amount from '../../common/Amount';
import Badge, { BADGE_TYPES } from '../../Badge/Badge';

import { useCheckIfDesktop } from '../../../screenType';

import { WalletBalancesItem } from '../../../types';

import classes from './PayWithBadge.module.scss';

type Props = {
  costFree?: boolean;
  walletBalances: WalletBalancesItem;
  walletName?: string;
};

const PayWithBadge: React.FC<Props> = props => {
  const { costFree, walletBalances, walletName } = props;
  const isDesktop = useCheckIfDesktop();

  if (costFree) return null;

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
              <span className="boldText">{walletName || `FIO Wallet`}</span>
            </p>
            <p className={classes.balance}>
              (Available Balance <Amount value={walletBalances.fio} /> FIO /{' '}
              <Amount value={walletBalances.usdc} /> USDC)
            </p>
          </div>
        </div>
      </Badge>
    </>
  );
};

export default PayWithBadge;
