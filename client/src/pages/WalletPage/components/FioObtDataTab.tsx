import React from 'react';

import FioRecordsList from './FioRecordsList';

import { FIO_RECORD_TYPES } from '../constants';

import { FioWalletData, FioWalletDoublet } from '../../../types';

type Props = {
  fioWallet: FioWalletDoublet;
  walletData: FioWalletData;
};

const FioObtDataTab: React.FC<Props> = props => {
  return (
    <FioRecordsList
      fioDataList={props.walletData.obtData}
      fioRecordType={FIO_RECORD_TYPES.DATA}
      loading={false}
      {...props}
    />
  );
};

export default FioObtDataTab;
