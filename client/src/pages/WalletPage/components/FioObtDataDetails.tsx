import React from 'react';

import FioRecordDetailedItem from './FioRecordDetailedItem';

import {
  FIO_REQUEST_FIELDS_LIST,
  FIO_RECORD_DETAILED_TYPE,
} from '../constants';

import { FioRecordViewDecrypted } from '../types';

import { FioWalletDoublet } from '../../../types';

import classes from '../styles/FioRecordDetailedModal.module.scss';

type Props = {
  fioRecordDecrypted: FioRecordViewDecrypted;
  fioRecordType: string;
  fioWallet: FioWalletDoublet;
  onCloseModal: () => void;
};

const FioObtDataDetails: React.FC<Props> = props => {
  return (
    <>
      <h5 className={classes.subtitle}>Request Information</h5>
      <FioRecordDetailedItem
        fieldsList={FIO_REQUEST_FIELDS_LIST.DATA_LIST}
        fioRecordDetailedType={FIO_RECORD_DETAILED_TYPE.PAYMENT}
        {...props}
      />
    </>
  );
};

export default FioObtDataDetails;
