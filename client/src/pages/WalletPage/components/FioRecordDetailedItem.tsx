import React from 'react';

import FioRecordDetailedAcctionButtons from './FioRecordDetailedAcctionButtons';
import FioRecordFieldsList from './FioRecordFieldsList';

import { FIO_REQUEST_STATUS_TYPES } from '../../../constants/fio';
import { FIO_RECORD_TYPES } from '../../WalletPage/constants';

import { FioRecordViewKeysProps, FioRecordViewDecrypted } from '../types';
import { FioWalletDoublet } from '../../../types';

import classes from '../styles/FioRecordDetailedItem.module.scss';

type Props = {
  fieldsList: FioRecordViewKeysProps[];
  fioRecordDecrypted: FioRecordViewDecrypted;
  fioRecordType: string;
  fioRecordDetailedType: string;
  fioWallet: FioWalletDoublet;
  onCloseModal: () => void;
};

const FioRecordDetailedItem: React.FC<Props> = props => {
  const {
    fieldsList,
    fioRecordDecrypted,
    fioRecordType,
    fioWallet,
    fioRecordDetailedType,
    onCloseModal,
  } = props;

  if (!fioRecordDecrypted) return null;

  return (
    <div className={classes.fieldsContainer}>
      <FioRecordFieldsList
        fieldsList={fieldsList}
        fioRecordDecrypted={fioRecordDecrypted}
        fioRecordDetailedType={fioRecordDetailedType}
        fioRecordType={fioRecordType}
      />
      {fioRecordDecrypted.fioRecord.status ===
        FIO_REQUEST_STATUS_TYPES.PENDING &&
        fioRecordType === FIO_RECORD_TYPES.RECEIVED && (
          <FioRecordDetailedAcctionButtons
            fioRecordDecrypted={fioRecordDecrypted}
            fioWallet={fioWallet}
            fioRecordType={fioRecordType}
            onCloseModal={onCloseModal}
          />
        )}
    </div>
  );
};

export default FioRecordDetailedItem;
