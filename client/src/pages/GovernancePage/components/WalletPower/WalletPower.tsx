import { FC } from 'react';

import classnames from 'classnames';

import Amount from '../../../../components/common/Amount';

import classes from './WalletPower.module.scss';

export type WalletPowerProps = {
  className?: string;
  hasVioletFio?: boolean;
  power: string;
  label?: string;
  withLabel?: boolean;
};

export const WalletPower: FC<WalletPowerProps> = ({
  className,
  hasVioletFio,
  power,
  label = 'Current Voting Power',
  withLabel,
}) => (
  <p className={classnames(classes.powerValue, className)}>
    {withLabel && <span className={classes.powerValueLabel}>{label}: </span>}
    <span>
      <Amount>{power}</Amount>{' '}
      <span className={hasVioletFio && classes.powerValueCurrency}>FIO</span>
    </span>
  </p>
);
