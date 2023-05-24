import React from 'react';

import { PriceComponent } from '../../PriceComponent';

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
      <div className={classes.balance}>
        (Available Balance&nbsp;
        <PriceComponent
          costFio={fioBalance?.toString()}
          costUsdc={usdcBalance?.toString()}
        />
        )
      </div>
    </div>
  );
};
