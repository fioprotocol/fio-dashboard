import React from 'react';
import { priceToNumber } from '../../../utils';
import classes from '../styles/TotalBalanceBadge.module.scss';
import { WalletBalances } from '../../../types';

type Props = WalletBalances;

const Balance = (props: { fio: string; usdc: string; title: string }) => {
  const { fio, usdc, title } = props;
  return (
    <div className={classes.balanceContainer}>
      <p className={classes.balanceTitle}>{title}</p>
      <p className={classes.balanceValues}>
        {priceToNumber(fio)} FIO / {priceToNumber(usdc)} USDC
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
        <p className={classes.totalFio}>{priceToNumber(total.fio)} FIO</p>
        <p className={classes.totalUsdc}>{priceToNumber(total.usdc)} USDC</p>
        <Balance fio={available.fio} usdc={available.usdc} title="Available" />
        {locked.nativeFio ? (
          <Balance fio={locked.fio} usdc={locked.usdc} title="Locked" />
        ) : null}
      </div>
    </div>
  );
};

export default TotalBalanceBadge;
