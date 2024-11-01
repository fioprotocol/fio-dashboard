import { FC } from 'react';

import WalletIcon from '../../../../assets/images/wallet.svg';

import classes from './WalletVotingPowerBlock.module.scss';
import ActionButton from '../../../SettingsPage/components/ActionButton';
import { WalletVoteStatus } from '../WalletVoteStatus';
import { WalletPower } from '../WalletPower';

export type WalletVotingPowerBlockProps = {
  name: string;
  power: number;
  boardVote: boolean | 'proxied';
  blockProducerVote: boolean | 'proxied';
  onAction?: () => void;
};

export const WalletVotingPowerBlock: FC<WalletVotingPowerBlockProps> = ({
  name,
  power,
  boardVote,
  blockProducerVote,
  onAction,
}) => {
  const votes = [
    { name: 'FIO Board Vote', vote: boardVote },
    { name: 'Block Producer Vote', vote: blockProducerVote },
  ];

  return (
    <div className={classes.container}>
      <div className={classes.titleContainer}>
        <img src={WalletIcon} alt="wallet" loading="lazy" />
        <h5 className={classes.title}>{name}</h5>
      </div>
      <WalletPower power={power} withLabel={true} />
      <div className={classes.votesContainer}>
        {votes.map(({ name, vote }) => (
          <WalletVoteStatus key={name} name={name} vote={vote} />
        ))}
      </div>
      <ActionButton
        className={classes.actionButton}
        title="View"
        onClick={onAction}
        isIndigo
        isSmall
      />
    </div>
  );
};
