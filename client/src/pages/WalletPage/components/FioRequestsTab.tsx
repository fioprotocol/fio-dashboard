import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import TabsContainer from '../../../components/Tabs/TabsContainer';
import Tabs from '../../../components/Tabs/Tabs';
import FioRecordsList from './FioRecordsList';

import { FIO_RECORD_TYPES } from '../constants';

import { FioWalletData, FioWalletDoublet } from '../../../types';

import classes from '../styles/FioRequestsTab.module.scss';

type Props = {
  fioWallet: FioWalletDoublet;
  walletData: FioWalletData;
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
    eventKey: FIO_RECORD_TYPES.SENT,
    title: 'Sent',
    renderTab: (props: Props) => (
      <FioRecordsList
        fioDataList={props.walletData.sentFioRequests}
        paymentDataList={props.walletData.obtData}
        fioRecordType={FIO_RECORD_TYPES.SENT}
        loading={false}
        {...props}
      />
    ),
  },
  {
    eventKey: FIO_RECORD_TYPES.RECEIVED,
    title: 'Received',
    renderTab: (props: Props) => (
      <FioRecordsList
        fioDataList={props.walletData.receivedFioRequests}
        paymentDataList={props.walletData.obtData}
        fioRecordType={FIO_RECORD_TYPES.RECEIVED}
        loading={false}
        {...props}
      />
    ),
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
