import React from 'react';
import { useHistory } from 'react-router';

import TabsContainer from '../../../components/Tabs/TabsContainer';
import Tabs from '../../../components/Tabs/Tabs';
import FioRequestsTab from './FioRequestsTab';
import FioObtDataTab from './FioObtDataTab';
import TransactionList from './TransactionList';

import {
  FioAddressDoublet,
  FioRecord,
  FioWalletData,
  FioWalletDoublet,
  FioWalletTxHistory,
} from '../../../types';
import { SiteSetting } from '../../../types/settings';

type Props = {
  fioWallet: FioWalletDoublet;
  fioCryptoHandles: FioAddressDoublet[];
  walletData: FioWalletData;
  walletTxHistory: FioWalletTxHistory;
  hasNoTransactions: boolean;
  receivedFioRequests: FioRecord[];
  sentFioRequests: FioRecord[];
  obtData: FioRecord[];
  obtDataLoading: boolean;
  siteSetings: SiteSetting;
  sentFioRequestsLoading: boolean;
  receivedFioRequestsLoading: boolean;
  tabAction: (tabKey: string) => void;
};

type Location = {
  location: {
    state?: {
      fioRequestTab: string;
    };
  };
};

export const WALLET_TABS_LIST = [
  {
    eventKey: 'fioRequests',
    title: 'FIO Requests',
    renderTab: (props: Props): React.ReactElement => (
      <FioRequestsTab {...props} />
    ),
  },
  {
    eventKey: 'fioData',
    title: 'FIO Data',
    renderTab: (props: Props): React.ReactElement => (
      <FioObtDataTab {...props} />
    ),
  },
  {
    eventKey: 'transactions',
    title: 'Transactions',
    renderTab: (props: Props): React.ReactElement => (
      <TransactionList {...props} />
    ),
  },
];

const WalletTabs: React.FC<Props> = props => {
  const { location }: Location = useHistory();
  const { fioRequestTab } = location?.state || {};

  return (
    <TabsContainer
      defaultActiveKey={
        fioRequestTab || props.hasNoTransactions
          ? WALLET_TABS_LIST[0].eventKey
          : WALLET_TABS_LIST[2].eventKey
      }
    >
      <Tabs
        list={WALLET_TABS_LIST}
        tabProps={props}
        showTabBorder
        tabBorderPrimary
        tabAction={props.tabAction}
      />
    </TabsContainer>
  );
};

export default WalletTabs;
