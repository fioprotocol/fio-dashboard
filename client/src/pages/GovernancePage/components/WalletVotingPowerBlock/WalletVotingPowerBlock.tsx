import { FC } from 'react';

import WalletIcon from '../../../../assets/images/wallet.svg';

import apis from '../../../../api';

import ActionButton from '../../../SettingsPage/components/ActionButton';
import { WalletVoteStatus } from '../WalletVoteStatus';
import { WalletPower } from '../WalletPower';

import { OverviewWallet } from '../../../../types/governance';

import classes from './WalletVotingPowerBlock.module.scss';

export type WalletVotingPowerBlockProps = {
  overviewWallet: OverviewWallet;
  openWalletDetailsModal: (publicKey: string) => void;
};

export const WalletVotingPowerBlock: FC<WalletVotingPowerBlockProps> = ({
  overviewWallet,
  openWalletDetailsModal,
}) => {
  const {
    balance,
    hasProxy,
    hasVotedForBoardOfDirectors,
    name,
    publicKey,
    votes,
  } = overviewWallet;

  const votesInfo = [
    { name: 'FIO Board Vote', vote: hasVotedForBoardOfDirectors },
    { name: 'Block Producer Vote', vote: !!votes.length },
  ];

  return (
    <div className={classes.container}>
      <div className={classes.titleContainer}>
        <img src={WalletIcon} alt="wallet" loading="lazy" />
        <h5 className={classes.title}>{name}</h5>
      </div>
      <WalletPower power={apis.fio.sufToAmount(balance)} withLabel={true} />
      <div className={classes.votesContainer}>
        {votesInfo.map(({ name, vote }) => (
          <WalletVoteStatus
            key={name}
            name={name}
            vote={vote}
            hasProxy={hasProxy}
          />
        ))}
      </div>
      <ActionButton
        className={classes.actionButton}
        title="View"
        onClick={() => openWalletDetailsModal(publicKey)}
        isIndigo
        isSmall
      />
    </div>
  );
};
