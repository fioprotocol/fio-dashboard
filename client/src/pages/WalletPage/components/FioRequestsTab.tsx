import React from 'react';
import { useHistory } from 'react-router';

import TabsContainer from '../../../components/Tabs/TabsContainer';
import Tabs from '../../../components/Tabs/Tabs';
import FioRecordsList from './FioRecordsList';

import { FIO_RECORD_TYPES } from '../constants';

import {
  FioAddressDoublet,
  FioRecord,
  FioWalletData,
  FioWalletDoublet,
} from '../../../types';

import classes from '../styles/FioRequestsTab.module.scss';

type Props = {
  fioWallet: FioWalletDoublet;
  fioCryptoHandles: FioAddressDoublet[];
  walletData: FioWalletData;
  receivedFioRequests: FioRecord[];
  sentFioRequests: FioRecord[];
  obtData: FioRecord[];
  sentFioRequestsLoading?: boolean;
  receivedFioRequestsLoading?: boolean;
  tabAction: (tabKey: string) => void;
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
        fioDataList={props.sentFioRequests}
        paymentDataList={props.obtData?.sort(
          (a: FioRecord, b: FioRecord) =>
            new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime(),
        )}
        fioRecordType={FIO_RECORD_TYPES.SENT}
        loading={props.sentFioRequestsLoading}
        {...props}
      />
    ),
  },
  {
    eventKey: FIO_RECORD_TYPES.RECEIVED,
    title: 'Received',
    renderTab: (props: Props) => (
      <FioRecordsList
        fioDataList={props.receivedFioRequests}
        paymentDataList={props.obtData}
        fioRecordType={FIO_RECORD_TYPES.RECEIVED}
        loading={props.receivedFioRequestsLoading}
        {...props}
      />
    ),
  },
];

const FioRequestsTab: React.FC<Props> = props => {
  const { location }: Location = useHistory();
  const { fioRequestTab } = location?.state || {};

  return (
    <TabsContainer
      defaultActiveKey={fioRequestTab || FIO_REQUEST_TABS[0].eventKey}
    >
      <Tabs
        list={FIO_REQUEST_TABS}
        containerClass={classes.container}
        tabItemClass={classes.tabItem}
        tabItemPrimaryClass={classes.tabItemPrimary}
        tabContentClass={classes.tabContent}
        tabProps={{ ...props }}
        tabAction={props.tabAction}
        tabBorderPrimary
      />
    </TabsContainer>
  );
};

export default FioRequestsTab;
