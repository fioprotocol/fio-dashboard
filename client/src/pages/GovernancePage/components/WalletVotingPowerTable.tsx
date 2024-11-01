import { FC, Fragment } from 'react';

import classnames from 'classnames';

import classes from '../styles/WalletVotingPowerTable.module.scss';
import WalletIcon from '../../../assets/images/wallet.svg';
import ActionButton from '../../SettingsPage/components/ActionButton';
import { WalletPower } from './WalletPower';
import { WalletVoteStatus } from './WalletVoteStatus';

export type WalletVotingData = {
  name: string;
  power: number;
  boardVote: boolean | 'proxied';
  blockProducerVote: boolean | 'proxied';
};

export type WalletVotingPowerTableProps = {
  className: string;
  data: WalletVotingData[];
  onAction?: () => void;
};

export const WalletVotingPowerTable: FC<WalletVotingPowerTableProps> = ({
  className,
  data,
  onAction,
}) => {
  return (
    <div className={classnames(classes.grid, className)}>
      <div className={classes.gridTitleItem}>Wallet Name</div>
      <div className={classes.gridTitleItem}>Current Voting Power</div>
      <div className={classes.gridTitleItem}>FIO Board Vote</div>
      <div className={classes.gridTitleItem}>Block Producer Vote</div>
      <div className={classes.gridTitleItem}>Voting Details</div>
      {data.map(it => (
        <Fragment key={it.name}>
          <div className={classes.gridItem}>
            <img src={WalletIcon} alt="wallet" loading="lazy" />
            <h5 className={classes.title}>{it.name}</h5>
          </div>
          <div className={classes.gridItem}>
            <WalletPower power={it.power} />
          </div>
          <div className={classes.gridItem}>
            <WalletVoteStatus vote={it.boardVote} />
          </div>
          <div className={classes.gridItem}>
            <WalletVoteStatus vote={it.blockProducerVote} />
          </div>
          <div className={classes.gridItem}>
            <ActionButton
              className={classes.actionButton}
              title="View"
              isIndigo
              isSmall
              onClick={onAction}
            />
          </div>
        </Fragment>
      ))}
    </div>
  );
};
