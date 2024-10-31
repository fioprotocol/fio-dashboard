import { FC, useState } from 'react';

import classes from '../styles/WalletVotesDetailsModal.module.scss';
import Modal from '../../../components/Modal/Modal';
import CustomDropdown from '../../../components/CustomDropdown';
import { TabsSelector } from './TabsSelector';
import { TabItemProps } from '../../../components/Tabs/types';

export type WalletVotesDetailsProps = {
  show?: boolean;
  onClose?: () => void;
};

const WALLETS_MOCK = [
  {
    name: 'Wallet Numero Uno 1',
    proxied: true,
  },
  {
    name: 'Wallet Numero Uno 2',
    proxied: true,
  },
];

type MockWallet = typeof WALLETS_MOCK[number];

export const WalletVotesDetailsModal: FC<WalletVotesDetailsProps> = ({
  show,
  onClose,
}) => {
  const [activeWallet, setActiveWallet] = useState(WALLETS_MOCK[0]);

  const TABS: TabItemProps[] = [
    {
      eventKey: 'board',
      title: 'FIO Foundation Board of Directors',
      renderTab: () => <BoardTab activeWallet={activeWallet} />,
    },
    {
      eventKey: 'producers',
      title: 'Block Producers',
      renderTab: () => <ProducersTab activeWallet={activeWallet} />,
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
      isWide={true}
    >
      <div className={classes.container}>
        <CustomDropdown
          dropdownClassNames={classes.dropdownContainer}
          value={activeWallet.name}
          options={WALLETS_MOCK.map(({ name }) => ({
            id: name,
            name,
          }))}
          onChange={key =>
            setActiveWallet(WALLETS_MOCK.find(it => it.name === key))
          }
          withoutMarginBottom
          hasAutoWidth
          isWhite
          isSimple
          placeholder="Voting Overview"
        />
        <TabsSelector className={classes.tabsContainer} list={TABS} />
      </div>
    </Modal>
  );
};

type TabProps = {
  activeWallet: MockWallet;
};

const BoardTab: FC<TabProps> = ({ activeWallet }) => {
  return <div className={classes.tabsScrollContainer}>!</div>;
};

const ProducersTab: FC<TabProps> = ({ activeWallet }) => {
  return <div className={classes.tabsScrollContainer}>!</div>;
};
