import { FC } from 'react';

import classes from '../styles/WalletPower.module.scss';

export type WalletPowerProps = {
  power: number;
  withLabel?: boolean;
};

export const WalletPower: FC<WalletPowerProps> = ({ power, withLabel }) => {
  return (
    <p className={classes.powerValue}>
      {withLabel && (
        <span className={classes.powerValueLabel}>
          Current Voting Power:&nbsp;
        </span>
      )}
      <span>
        {power.toLocaleString('en', {
          minimumFractionDigits: 4,
        })}
        &nbsp;
        <span className={classes.powerValueCurrency}>FIO</span>
      </span>
    </p>
  );
};
