import React from 'react';

import TabsContainer from '../../../components/Tabs/TabsContainer';
import Tabs from '../../../components/Tabs/Tabs';
import FioRequestsTab from './FioRequestsTab';
import FioDataTab from './FioDataTab';
import TransactionList from './TransactionList';

import { FioWalletData, FioWalletDoublet } from '../../../types';

type Props = {
  fioWallet: FioWalletDoublet;
  walletData: FioWalletData;
};

const WALLET_TABS_LIST = [
  {
    eventKey: 'fioRequests',
    title: 'Fio Requests',
    renderTab: (props: Props) => <FioRequestsTab {...props} />,
  },
  {
    eventKey: 'fioData',
    title: 'Fio Data',
    renderTab: (props: Props) => <FioDataTab {...props} />,
  },
  {
    eventKey: 'fioTransactions',
    title: 'Fio Transactions',
    renderTab: (props: Props) => <TransactionList {...props} />,
  },
];

const WalletTabs: React.FC<Props> = props => {
  return (
    <TabsContainer defaultActiveKey={WALLET_TABS_LIST[0].eventKey}>
      <Tabs list={WALLET_TABS_LIST} showTabBorder={true} tabProps={props} />
    </TabsContainer>
  );
};

export default WalletTabs;
