import { FC } from 'react';

import classes from './WalletVotesDetailsModal.module.scss';
import Modal from '../../../../components/Modal/Modal';
import CustomDropdown from '../../../../components/CustomDropdown';
import { TabsSelector } from '../TabsSelector';
import { TabItemProps } from '../../../../components/Tabs/types';

import { OverviewWallet } from '../../../../types/governance';
import { WalletBoardOfDirectorsTab } from './components/WalletBoardOfDirectorsTab';
import { WalletBlockProducersTab } from './components/WalletBlockProducersTab';
import { GovernancePageContextProps } from '../../types';

export type Props = {
  overviewWallets: OverviewWallet[];
  activeWalletPublicKey: string;
  show?: boolean;
  onClose?: () => void;
} & GovernancePageContextProps;

export const WalletVotesDetailsModal: FC<Props> = ({
  overviewWallets,
  listOfCandidates,
  listOfBlockProducers,
  listOfProxies,
  activeWalletPublicKey,
  show,
  onClose,
  setActiveWalletPublicKey,
}) => {
  const activeWallet = overviewWallets.find(
    it => activeWalletPublicKey === it.publicKey,
  );

  const proxy = listOfProxies.find(
    proxyItem =>
      proxyItem.owner === activeWallet?.votes.find(vote => vote.proxy)?.proxy,
  );

  const TABS: TabItemProps[] = [
    {
      eventKey: 'board',
      title: (
        <>
          <span className={classes.tabsLargeTitle}>FIO Foundation&nbsp;</span>
          Board of Directors
        </>
      ),
      renderTab: () => (
        <WalletBoardOfDirectorsTab
          activeWallet={activeWallet}
          listOfCandidates={listOfCandidates}
          proxy={proxy}
        />
      ),
    },
    {
      eventKey: 'producers',
      title: 'Block Producers',
      renderTab: () => (
        <WalletBlockProducersTab
          activeWallet={activeWallet}
          listOfBlockProducers={listOfBlockProducers}
          proxy={proxy}
        />
      ),
    },
  ];

  return (
    <Modal
      title="My Current Votes"
      headerClass={classes.header}
      show={show}
      onClose={onClose}
      closeButton={true}
      isSimple={true}
      hasDefaultCloseColor={true}
      classNames={{ dialog: classes.modalContainer }}
    >
      <div className={classes.container}>
        <CustomDropdown
          dropdownClassNames={classes.dropdownContainer}
          value={activeWallet?.name}
          options={overviewWallets.map(({ name, publicKey }) => ({
            id: publicKey,
            name,
          }))}
          onChange={setActiveWalletPublicKey}
          withoutMarginBottom
          hasAutoWidth
          isWhite
          isSimple
          placeholder="Voting Overview"
        />
        <TabsSelector
          defaultActiveKey="board"
          className={classes.tabsContainer}
          list={TABS}
        />
      </div>
    </Modal>
  );
};
