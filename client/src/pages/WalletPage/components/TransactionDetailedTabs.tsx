import React from 'react';

import TabsContainer from '../../../components/Tabs/TabsContainer';
import Tabs from '../../../components/Tabs/Tabs';
import TransactionDetailedItem from './TransactionDetailedItem';

import { FIO_REQUEST_FIELDS_LIST } from '../constants';
import { FIO_REQUEST_STATUS_TYPES } from '../../../constants/fio';

import { TransactionItemProps, TransactionItemKeysProps } from '../types';

import { FioWalletDoublet } from '../../../types';

import classes from '../styles/TransactionDetailedModal.module.scss';

type Props = {
  transactionItem: TransactionItemProps;
  requestFieldsList: TransactionItemKeysProps[];
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
        <TransactionDetailedItem
          {...props}
          fieldsList={props.requestFieldsList}
        />
      </>
    ),
  },
  {
    eventKey: 'Payment information',
    title: 'Payment information',
    renderTab: (props: Props) => (
      <TransactionDetailedItem
        {...props}
        fieldsList={FIO_REQUEST_FIELDS_LIST.PAYMENT_LIST}
      />
    ),
  },
];

const TransactionDetailedTabs: React.FC<Props> = props => {
  const { transactionItem } = props;
  if (!transactionItem) return null;

  if (transactionItem.status !== FIO_REQUEST_STATUS_TYPES.PAID)
    return (
      <>
        <h5 className={classes.subtitle}>{DetailedTabsList[0].title}</h5>
        <TransactionDetailedItem
          {...props}
          fieldsList={props.requestFieldsList}
        />
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

export default TransactionDetailedTabs;
