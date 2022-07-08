import React from 'react';

import Amount from '../../common/Amount';

import classes from './PayWithBadge.module.scss';

type Props = {
  walletName: string;
  fioBalance: number | string;
  usdcBalance: number | string;
};

export const PayWalletInfo: React.FC<Props> = props => {
  const { walletName, fioBalance, usdcBalance } = props;
  return (
    <div className={classes.wallet}>
      <p className={classes.title}>
        <span className="boldText">{walletName || `FIO Wallet`}</span>
      </p>
      <p className={classes.balance}>
        (Available Balance <Amount value={fioBalance} /> FIO /{' '}
        <Amount value={usdcBalance} /> USDC)
      </p>
    </div>
  );
};
