import React from 'react';

import Amount from '../../../components/common/Amount';

import { priceToNumber } from '../../../utils';

import { WalletBalances } from '../../../types';

import classes from '../styles/TotalBalanceBadge.module.scss';

type Props = WalletBalances;

const Balance = (props: { fio: string; usdc: string; title: string }) => {
  const { fio, usdc, title } = props;
  return (
    <div className={classes.balanceContainer}>
      <p className={classes.balanceTitle}>{title}</p>
      <p className={classes.balanceValues}>
        <Amount value={priceToNumber(fio)} /> FIO /{' '}
        <Amount value={priceToNumber(usdc)} /> USDC
      </p>
    </div>
  );
};

const TotalBalanceBadge: React.FC<Props> = props => {
  const { total, available, locked } = props;

  return (
    <div className={classes.actionBadgeContainer}>
      <div className={classes.totalBadge}>
        <p className={classes.title}>Total FIO Wallets Balance</p>
        <p className={classes.totalFio}>
          <Amount value={total.fio} /> FIO
        </p>
        <p className={classes.totalUsdc}>
          <Amount value={total.usdc} /> USDC
        </p>
        <Balance fio={available.fio} usdc={available.usdc} title="Available" />
        {locked.nativeFio ? (
          <Balance fio={locked.fio} usdc={locked.usdc} title="Locked" />
        ) : null}
      </div>
    </div>
  );
};

export default TotalBalanceBadge;
