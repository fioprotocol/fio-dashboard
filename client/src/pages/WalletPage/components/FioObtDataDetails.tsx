import React from 'react';

import FioDataDetailedItem from './FioDataDetailedItem';

import {
  FIO_REQUEST_FIELDS_LIST,
  FIO_RECORD_DETAILED_TYPE,
} from '../constants';

import { FioRecordViewDecrypted } from '../types';

import { FioWalletDoublet } from '../../../types';

import classes from '../styles/FioDataDetailedModal.module.scss';

type Props = {
  fioRecordDecrypted: FioRecordViewDecrypted;
  fioRecordType: string;
  fioWallet: FioWalletDoublet;
  onCloseModal: () => void;
};

const FioDataDetails: React.FC<Props> = props => {
  return (
    <>
      <h5 className={classes.subtitle}>Request Information</h5>
      <FioDataDetailedItem
        fieldsList={FIO_REQUEST_FIELDS_LIST.DATA_LIST}
        fioRecordDetailedType={FIO_RECORD_DETAILED_TYPE.PAYMENT}
        {...props}
      />
    </>
  );
};

export default FioDataDetails;
