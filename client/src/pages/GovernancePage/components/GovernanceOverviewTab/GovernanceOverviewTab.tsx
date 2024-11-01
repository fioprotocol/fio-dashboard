import { FC } from 'react';

import classes from './GovernanceOverviewTab.module.scss';
import { OverviewInfoBlock } from '../OverviewInfoBlock';
import { WalletVotingPowerBlock } from '../WalletVotingPowerBlock';
import { WalletVotingPowerTable } from '../WalletVotingPowerTable';
import { WalletVotesDetailsModal } from '../WalletVotesDetailsModal';
import {
  OverviewWallet,
  useModalState,
  useWalletsOverview,
} from '../../../../hooks/governance';
import Loader from '../../../../components/Loader/Loader';
import { ROUTES } from '../../../../constants/routes';

export const GovernanceOverviewTab: FC = () => {
  const modalState = useModalState<OverviewWallet>();

  const { overviewWallets, loading } = useWalletsOverview();

  return (
    <>
      <div className={classes.infoBlocks}>
        <OverviewInfoBlock
          title="FIO Foundation Board of Directors"
          description="The FIO Foundation facilitates the growth and adoption of the FIO Protocol, the Board of Directors set the Foundation’s strategy."
          infoLabel="Next Vote Count"
          infoContent="August 15th 2PM (UTC-5) , 2024"
          actionLabel="View Foundation Board of Directors"
          actionHref={ROUTES.GOVERNANCE_FIO_FOUNDATION_BOARD_OF_DIRECTORS}
        />
        <OverviewInfoBlock
          title="Block Producers"
          description="Block Producers (BPs) are the backbone of the FIO Chain, responsible for securing the networks, running nodes and other critical infrastructure."
          infoLabel="Election Information"
          infoContent="You can vote or update your vote at any time."
          actionLabel="View Block Producers"
          actionHref={ROUTES.GOVERNANCE_BLOCK_PRODUCERS}
        />
      </div>
      <h4 className={classes.walletsTitle}>Your Wallets & Voting Power</h4>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className={classes.walletsList}>
            {overviewWallets.map(it => (
              <WalletVotingPowerBlock
                key={it.publicKey}
                data={it}
                onAction={modalState.open}
              />
            ))}
          </div>
          <WalletVotingPowerTable
            className={classes.walletsTable}
            data={overviewWallets}
            onAction={modalState.open}
          />
        </>
      )}
      <WalletVotesDetailsModal
        show={modalState.isOpen}
        onClose={modalState.close}
      />
    </>
  );
};

export default GovernanceOverviewTab;
