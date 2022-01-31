import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import TabsContainer from '../../../components/Tabs/TabsContainer';
import Tabs from '../../../components/Tabs/Tabs';
import TransactionItems from './TransactionItems';

import { TRANSACTION_ITEM_TYPES } from '../constants';

import { FioWalletDoublet } from '../../../types';

import classes from '../styles/FioRequestsTab.module.scss';

type Props = {
  fioWallet: FioWalletDoublet;
};

type Location = {
  location: {
    state: {
      fioRequestTab: string;
    };
  };
};

const FIO_REQUEST_TABS = [
  {
    eventKey: TRANSACTION_ITEM_TYPES.SENT,
    title: 'Sent',
    renderTab: (props: Props) => (
      <TransactionItems
        transactionsList={mockedData}
        type={TRANSACTION_ITEM_TYPES.SENT}
        loading={false}
        {...props}
      />
    ),
  },
  {
    eventKey: TRANSACTION_ITEM_TYPES.RECEIVED,
    title: 'Received',
    renderTab: (props: Props) => (
      <TransactionItems
        transactionsList={mockedData}
        type={TRANSACTION_ITEM_TYPES.RECEIVED}
        loading={false}
        {...props}
      />
    ),
  },
];

const mockedData = [
  {
    from: 'test@test.com',
    to: 'test@fest.com',
    date: '2022-01-19T18:20:56',
    id: 'test1',
    status: 'rejected',
    transactionType: 'sent',
    payer: 'purse@alice',
    requestor: 'test@fest.com',
    type: 'payment',
  },
  {
    from: 'test@test.com',
    to: 'test@fest.com',
    date: '2022-01-19T18:20:56',
    id: 'test',
    status: 'paid',
    transactionType: 'received',
    payer: 'purse@alice',
    requestor: 'test@fest.com',
    type: 'payment',
  },
  {
    from: 'test@test.com',
    to: 'test@fest.com',
    date: '2022-01-19T18:20:56',
    id: 'test22',
    status: 'pending',
    transactionType: 'received',
    payer: 'purse@alice',
    requestor: 'test@fest.com',
    type: 'payment',
  },
];

const FioRequestsTab: React.FC<Props &
  RouteComponentProps &
  Location> = props => {
  const {
    location: { state },
  } = props;

  const { fioRequestTab } = state || {};

  return (
    <TabsContainer
      defaultActiveKey={fioRequestTab || FIO_REQUEST_TABS[0].eventKey}
    >
      <Tabs
        list={FIO_REQUEST_TABS}
        containerClass={classes.container}
        tabItemClass={classes.tabItem}
        tabContentClass={classes.tabContent}
        tabProps={{ ...props }}
      />
    </TabsContainer>
  );
};

export default withRouter(FioRequestsTab);
