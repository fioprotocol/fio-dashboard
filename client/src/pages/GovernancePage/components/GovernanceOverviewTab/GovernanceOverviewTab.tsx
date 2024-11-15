import { FC } from 'react';

import Loader from '../../../../components/Loader/Loader';

import { OverviewInfoBlock } from '../OverviewInfoBlock';
import { WalletVotingPowerBlock } from '../WalletVotingPowerBlock';
import { WalletVotingPowerTable } from '../WalletVotingPowerTable';
import { WalletVotesDetailsModal } from '../WalletVotesDetailsModal';

import { ROUTES } from '../../../../constants/routes';

import { getNextGovernanceDate } from '../../../../util/general';

import { GovernancePageContextProps } from '../../types';

import classes from './GovernanceOverviewTab.module.scss';

export const GovernanceOverviewTab: FC<GovernancePageContextProps> = props => {
  const {
    activeWalletPublicKey,
    isWalletDetailsModalOpen,
    overviewWalletsLoading,
    overviewWallets,
    closWalletDetailsModal,
    openWalletDetailsModal,
  } = props;

  const nextDate = getNextGovernanceDate();

  return (
    <>
      <div className={classes.infoBlocks}>
        <OverviewInfoBlock
          title="FIO Foundation Board of Directors"
          description="The FIO Foundation facilitates the growth and adoption of the FIO Protocol, the Board of Directors set the Foundation’s strategy."
          infoLabel="Next Vote Count"
          infoContent={nextDate}
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
      {overviewWalletsLoading ? (
        <Loader />
      ) : (
        <>
          <div className={classes.walletsList}>
            {overviewWallets.map(overviewWallet => (
              <WalletVotingPowerBlock
                key={overviewWallet.publicKey}
                overviewWallet={overviewWallet}
                openWalletDetailsModal={openWalletDetailsModal}
              />
            ))}
          </div>
          <WalletVotingPowerTable
            className={classes.walletsTable}
            overviewWallets={overviewWallets}
            openWalletDetailsModal={openWalletDetailsModal}
          />
        </>
      )}
      {overviewWallets.length > 0 && activeWalletPublicKey && (
        <WalletVotesDetailsModal
          overviewWallets={overviewWallets}
          show={isWalletDetailsModalOpen}
          onClose={closWalletDetailsModal}
          {...props}
        />
      )}
    </>
  );
};

export default GovernanceOverviewTab;
