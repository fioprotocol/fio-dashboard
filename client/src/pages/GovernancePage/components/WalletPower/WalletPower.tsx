import { FC } from 'react';

import classnames from 'classnames';

import classes from './WalletPower.module.scss';

export type WalletPowerProps = {
  className?: string;
  power: number;
  label?: string;
  withLabel?: boolean;
};

export const WalletPower: FC<WalletPowerProps> = ({
  className,
  power,
  label = 'Current Voting Power',
  withLabel,
}) => (
  <p className={classnames(classes.powerValue, className)}>
    {withLabel && <span className={classes.powerValueLabel}>{label}: </span>}
    <span>
      {power} <span className={classes.powerValueCurrency}>FIO</span>
    </span>
  </p>
);
