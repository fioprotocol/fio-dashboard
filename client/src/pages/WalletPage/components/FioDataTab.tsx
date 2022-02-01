import React from 'react';

import TransactionItems from './TransactionItems';

import { TRANSACTION_ITEM_TYPES } from '../constants';

import { FioWalletData, FioWalletDoublet } from '../../../types';

type Props = {
  fioWallet: FioWalletDoublet;
  walletData: FioWalletData;
};

const FioDataTab: React.FC<Props> = props => {
  return (
    <TransactionItems
      transactionsList={props.walletData.obtData}
      transactionType="sent"
      type={TRANSACTION_ITEM_TYPES.DATA}
      loading={false}
      {...props}
    />
  );
};

export default FioDataTab;
