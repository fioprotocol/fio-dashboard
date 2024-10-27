import { FC } from 'react';

import classes from '../styles/GovernanceOverviewTab.module.scss';
import { OverviewInfoBlock } from './OverviewInfoBlock';
import { WalletVotingPowerBlock } from './WalletVotingPowerBlock';
import { WalletVotingPowerTable } from './WalletVotingPowerTable';

const MOCK_WALLETS = [
  {
    name: 'Wallet Numero Uno',
    power: 12932.0,
    boardVote: true,
    blockProducerVote: false,
  } as const,
  {
    name: 'Wallet Purero Uno',
    power: 122923.0,
    boardVote: 'proxied',
    blockProducerVote: 'proxied',
  } as const,
  {
    name: 'Wallet Roshen Uno',
    power: 12923.0,
    boardVote: true,
    blockProducerVote: false,
  } as const,
];

export const GovernanceOverviewTab: FC = () => {
  return (
    <>
      <div className={classes.infoBlocks}>
        <OverviewInfoBlock
          title="FIO Foundation Board of Directors"
          description="The FIO Foundation facilitates the growth and adoption of the FIO Protocol, the Board of Directors set the Foundation’s strategy."
          infoLabel="Next Vote Count"
          infoContent="August 15th 2PM (UTC-5) , 2024"
          actionLabel="View Foundation Board of Directors"
          actionHref="https://"
        />
        <OverviewInfoBlock
          title="Block Producers"
          description="Block Producers (BPs) are the backbone of the FIO Chain, responsible for securing the networks, running nodes and other critical infrastructure."
          infoLabel="Election Information"
          infoContent="You can vote or update your vote at any time."
          actionLabel="View Block Producers"
          actionHref="https://"
        />
      </div>
      <h4 className={classes.walletsTitle}>Your Wallets & Voting Power</h4>
      <div className={classes.walletsList}>
        {MOCK_WALLETS.map(it => (
          <WalletVotingPowerBlock
            key={it.name}
            name={it.name}
            power={it.power}
            boardVote={it.boardVote}
            blockProducerVote={it.blockProducerVote}
          />
        ))}
      </div>
      <WalletVotingPowerTable
        className={classes.walletsTable}
        data={MOCK_WALLETS}
      />
    </>
  );
};

export default GovernanceOverviewTab;
