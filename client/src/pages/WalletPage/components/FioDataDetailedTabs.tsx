import React from 'react';

import TabsContainer from '../../../components/Tabs/TabsContainer';
import Tabs from '../../../components/Tabs/Tabs';
import FioDataDetailedItem from './FioDataDetailedItem';

import { FIO_REQUEST_FIELDS_LIST } from '../constants';
import { FIO_REQUEST_STATUS_TYPES } from '../../../constants/fio';

import { FioDataItemProps, FioDataItemKeysProps } from '../types';

import { FioWalletDoublet } from '../../../types';

import classes from '../styles/FioDataDetailedModal.module.scss';

type Props = {
  fioDataItem: FioDataItemProps;
  requestFieldsList: FioDataItemKeysProps[];
  type: string;
  fioWallet: FioWalletDoublet;
  onCloseModal: () => void;
};

const DetailedTabsList = [
  {
    eventKey: 'requestInformation',
    title: 'Request Information',
    renderTab: (props: Props) => (
      <>
        <FioDataDetailedItem {...props} fieldsList={props.requestFieldsList} />
      </>
    ),
  },
  {
    eventKey: 'Payment information',
    title: 'Payment information',
    renderTab: (props: Props) => (
      <FioDataDetailedItem
        {...props}
        fieldsList={FIO_REQUEST_FIELDS_LIST.PAYMENT_LIST}
      />
    ),
  },
];

const FioDataDetailedTabs: React.FC<Props> = props => {
  const { fioDataItem } = props;
  if (!fioDataItem) return null;

  if (fioDataItem.status !== FIO_REQUEST_STATUS_TYPES.PAID)
    return (
      <>
        <h5 className={classes.subtitle}>{DetailedTabsList[0].title}</h5>
        <FioDataDetailedItem {...props} fieldsList={props.requestFieldsList} />
      </>
    );

  return (
    <div>
      <TabsContainer defaultActiveKey={DetailedTabsList[0].eventKey}>
        <Tabs
          list={DetailedTabsList}
          showTabBorder={true}
          tabProps={{ ...props }}
        />
      </TabsContainer>
    </div>
  );
};

export default FioDataDetailedTabs;
