import { FC, Fragment } from 'react';

import classnames from 'classnames';

import classes from './WalletVotingPowerTable.module.scss';
import WalletIcon from '../../../../assets/images/wallet.svg';
import ActionButton from '../../../SettingsPage/components/ActionButton';
import { WalletPower } from '../WalletPower';
import { WalletVoteStatus } from '../WalletVoteStatus';
import apis from '../../../../api';

import { OverviewWallet } from '../../../../types/governance';

export type WalletVotingPowerTableProps = {
  className: string;
  overviewWallets: OverviewWallet[];
  openWalletDetailsModal: (publicKey: string) => void;
};

export const WalletVotingPowerTable: FC<WalletVotingPowerTableProps> = ({
  className,
  overviewWallets,
  openWalletDetailsModal,
}) => {
  return (
    <div className={classnames(classes.grid, className)}>
      <div className={classes.gridTitleItem}>Wallet Name</div>
      <div className={classes.gridTitleItem}>Current Voting Power</div>
      <div className={classes.gridTitleItem}>FIO Board Vote</div>
      <div className={classes.gridTitleItem}>Block Producer Vote</div>
      <div className={classes.gridTitleItem}>Voting Details</div>
      {overviewWallets.map(overviewWalletItem => (
        <Fragment key={overviewWalletItem.publicKey}>
          <div className={classes.gridItem}>
            <img src={WalletIcon} alt="wallet" loading="lazy" />
            <h5 className={classes.title}>{overviewWalletItem.name}</h5>
          </div>
          <div className={classnames(classes.gridItem, classes.toright)}>
            <WalletPower
              power={apis.fio.sufToAmount(overviewWalletItem?.balance)}
              hasVioletFio
            />
          </div>
          <div className={classes.gridItem}>
            <WalletVoteStatus
              hasProxy={overviewWalletItem?.hasProxy}
              vote={overviewWalletItem?.hasVotedForBoardOfDirectors}
            />
          </div>
          <div className={classes.gridItem}>
            <WalletVoteStatus
              hasProxy={overviewWalletItem?.hasProxy}
              vote={!!overviewWalletItem?.votes?.length}
            />
          </div>
          <div className={classes.gridItem}>
            <ActionButton
              className={classes.actionButton}
              title="View"
              isIndigo
              isSmall
              onClick={() =>
                openWalletDetailsModal(overviewWalletItem?.publicKey)
              }
            />
          </div>
        </Fragment>
      ))}
    </div>
  );
};
