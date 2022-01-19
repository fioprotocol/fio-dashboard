import React from 'react';

import TransactionItems from './TransactionItems';

import { TRANSACTION_ITEM_TYPES } from '../constants';

import { FioWalletDoublet } from '../../../types';

type Props = {
  fioWallet: FioWalletDoublet;
};

// todo: remove mocked data
const mockedData = [
  {
    from: 'test@test.com',
    to: 'test@fest.com',
    date: '2021-09-11T18:30:56',
    id: 'test1',
    status: 'rejected',
    transactionType: 'sent',
  },
  {
    from: 'test@test.com',
    to: 'test@fest.com',
    date: '2022-01-11T22:30:00',
    id: 'test',
    status: 'paid',
    transactionType: 'received',
  },
];

const FioDataTab: React.FC<Props> = props => {
  return (
    <TransactionItems
      transactionsList={mockedData}
      type={TRANSACTION_ITEM_TYPES.DATA}
      loading={false}
    />
  );
};

export default FioDataTab;
