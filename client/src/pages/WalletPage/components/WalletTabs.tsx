import React from 'react';
import { useHistory } from 'react-router';

import TabsContainer from '../../../components/Tabs/TabsContainer';
import Tabs from '../../../components/Tabs/Tabs';
import FioRequestsTab from './FioRequestsTab';
import FioObtDataTab from './FioObtDataTab';
import TransactionList from './TransactionList';

import {
  FioWalletData,
  FioWalletDoublet,
  FioWalletTxHistory,
} from '../../../types';

type Props = {
  fioWallet: FioWalletDoublet;
  walletData: FioWalletData;
  walletTxHistory: FioWalletTxHistory;
};

type Location = {
  location: {
    state?: {
      fioRequestTab: string;
    };
  };
};

const WALLET_TABS_LIST = [
  {
    eventKey: 'fioRequests',
    title: 'FIO Requests',
    renderTab: (props: Props) => <FioRequestsTab {...props} />,
  },
  {
    eventKey: 'fioData',
    title: 'FIO Data',
    renderTab: (props: Props) => <FioObtDataTab {...props} />,
  },
  {
    eventKey: 'transactions',
    title: 'Transactions',
    renderTab: (props: Props) => <TransactionList {...props} />,
  },
];

const WalletTabs: React.FC<Props> = props => {
  const { location }: Location = useHistory();
  const { fioRequestTab } = location?.state || {};

  return (
    <TabsContainer
      defaultActiveKey={
        fioRequestTab
          ? WALLET_TABS_LIST[0].eventKey
          : WALLET_TABS_LIST[2].eventKey
      }
    >
      <Tabs list={WALLET_TABS_LIST} showTabBorder={true} tabProps={props} />
    </TabsContainer>
  );
};

export default WalletTabs;
