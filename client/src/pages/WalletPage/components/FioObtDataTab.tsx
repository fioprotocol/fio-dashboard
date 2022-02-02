import React from 'react';

import FioDataList from './FioDataList';

import { FIO_RECORD_TYPES } from '../constants';

import { FioWalletData, FioWalletDoublet } from '../../../types';

type Props = {
  fioWallet: FioWalletDoublet;
  walletData: FioWalletData;
};

const FioObtDataTab: React.FC<Props> = props => {
  return (
    <FioDataList
      fioDataList={props.walletData.obtData}
      fioRecordType={FIO_RECORD_TYPES.DATA}
      loading={false}
      {...props}
    />
  );
};

export default FioObtDataTab;
