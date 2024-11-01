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
}) => {
  return (
    <p className={classnames(classes.powerValue, className)}>
      {withLabel && (
        <span className={classes.powerValueLabel}>{label}:&nbsp;</span>
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
