import React from 'react';

import TabsContainer from '../../../components/Tabs/TabsContainer';
import Tabs from '../../../components/Tabs/Tabs';

import RequestTokensForm from './RequestTokensForm';
import { RequestTokensProps } from '../types';

const TABS_LIST = [
  {
    eventKey: 'fioTokens',
    title: 'FIO Tokens',
    renderTab: (props: RequestTokensProps) => (
      <RequestTokensForm {...props} isFio={true} />
    ),
  },
  {
    eventKey: 'otherTokens',
    title: 'Other Tokens',
    renderTab: (props: RequestTokensProps) => (
      <RequestTokensForm {...props} isFio={false} />
    ),
  },
];

const RequestTabs: React.FC<RequestTokensProps> = props => {
  return (
    <TabsContainer defaultActiveKey={TABS_LIST[0].eventKey}>
      <Tabs list={TABS_LIST} showTabBorder={true} tabProps={props} />
    </TabsContainer>
  );
};

export default RequestTabs;
