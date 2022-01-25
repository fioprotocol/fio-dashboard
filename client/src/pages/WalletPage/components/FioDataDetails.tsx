import React from 'react';

import TransactionDetailedItem from './TransactionDetailedItem';

import { FIO_REQUEST_FIELDS_LIST } from '../constants';

import { TransactionItemProps } from '../types';

import classes from '../styles/TransactionDetailedModal.module.scss';

type Props = {
  transactionItem: TransactionItemProps;
  type: string;
};

const FioDataDetails: React.FC<Props> = props => {
  return (
    <>
      <h5 className={classes.subtitle}>Request Information</h5>
      <TransactionDetailedItem
        fieldsList={FIO_REQUEST_FIELDS_LIST.DATA_LIST}
        {...props}
      />
    </>
  );
};

export default FioDataDetails;
