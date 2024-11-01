import { FC, Fragment } from 'react';

import classnames from 'classnames';

import classes from './WalletVotingPowerTable.module.scss';
import WalletIcon from '../../../../assets/images/wallet.svg';
import ActionButton from '../../../SettingsPage/components/ActionButton';
import { WalletPower } from '../WalletPower';
import { WalletVoteStatus } from '../WalletVoteStatus';
import { OverviewWallet } from '../../../../hooks/governance';

export type WalletVotingPowerTableProps = {
  className: string;
  data: OverviewWallet[];
  onAction?: (publicKey: string) => void;
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
        <Fragment key={it.publicKey}>
          <div className={classes.gridItem}>
            <img src={WalletIcon} alt="wallet" loading="lazy" />
            <h5 className={classes.title}>{it.name}</h5>
          </div>
          <div className={classes.gridItem}>
            <WalletPower power={it.votingPower} />
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
              onClick={() => onAction?.(it.publicKey)}
            />
          </div>
        </Fragment>
      ))}
    </div>
  );
};
