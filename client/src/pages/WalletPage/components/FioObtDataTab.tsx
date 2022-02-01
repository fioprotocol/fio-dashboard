import React from 'react';

import FioDataList from './FioDataList';

import { FIO_DATA_TX_ITEM_TYPES } from '../constants';

import { FioWalletData, FioWalletDoublet } from '../../../types';

type Props = {
  fioWallet: FioWalletDoublet;
  walletData: FioWalletData;
};

const FioObtDataTab: React.FC<Props> = props => {
  return (
    <FioDataList
      fioDataList={props.walletData.obtData}
      fioDataTxType={FIO_DATA_TX_ITEM_TYPES.SENT}
      type={FIO_DATA_TX_ITEM_TYPES.DATA}
      loading={false}
      {...props}
    />
  );
};

export default FioObtDataTab;
