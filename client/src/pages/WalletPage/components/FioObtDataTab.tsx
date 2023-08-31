import React from 'react';

import FioRecordsList from './FioRecordsList';

import { FIO_RECORD_TYPES } from '../constants';

import {
  FioAddressDoublet,
  FioRecord,
  FioWalletData,
  FioWalletDoublet,
} from '../../../types';

type Props = {
  fioWallet: FioWalletDoublet;
  fioCryptoHandles: FioAddressDoublet[];
  walletData: FioWalletData;
  obtData: FioRecord[];
  obtDataLoading: boolean;
};

const FioObtDataTab: React.FC<Props> = props => {
  return (
    <FioRecordsList
      fioDataList={props.obtData?.sort(
        (a: FioRecord, b: FioRecord) =>
          new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime(),
      )}
      fioRecordType={FIO_RECORD_TYPES.DATA}
      loading={props.obtDataLoading}
      {...props}
    />
  );
};

export default FioObtDataTab;
