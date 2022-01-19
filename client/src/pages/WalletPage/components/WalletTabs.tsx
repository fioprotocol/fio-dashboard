import React from 'react';

import TabsContainer from '../../../components/Tabs/TabsContainer';
import Tabs from '../../../components/Tabs/Tabs';
import FioRequestsTab from './FioRequestsTab';
import FioDataTab from './FioDataTab';

const WALLET_TABS_LIST = [
  {
    eventKey: 'fioRequests',
    title: 'Fio Requests',
    renderTab: <FioRequestsTab />,
  },
  { eventKey: 'fioData', title: 'Fio Data', renderTab: <FioDataTab /> },
];
type Props = {};

const WalletTabs: React.FC<Props> = props => {
  return (
    <TabsContainer defaultActiveKey={WALLET_TABS_LIST[0].eventKey}>
      <Tabs list={WALLET_TABS_LIST} showTabBorder={true} />
    </TabsContainer>
  );
};

export default WalletTabs;
