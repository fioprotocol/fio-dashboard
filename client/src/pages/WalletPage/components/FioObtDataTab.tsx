import React from 'react';

import FioRecordsList from './FioRecordsList';

import { FIO_RECORD_TYPES } from '../constants';

import {
  FioAddressDoublet,
  FioWalletData,
  FioWalletDoublet,
} from '../../../types';

type Props = {
  fioWallet: FioWalletDoublet;
  fioCryptoHandles: FioAddressDoublet[];
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
