import React from 'react';

import FioDataDetailedActionButtons from './FioDataDetailedActionButtons';
import FioDataFieldsList from './FioDataFieldsList';

import { FIO_REQUEST_STATUS_TYPES } from '../../../constants/fio';
import { FIO_RECORD_TYPES } from '../../WalletPage/constants';

import { FioRecordViewKeysProps, FioRecordViewDecrypted } from '../types';
import { FioWalletDoublet } from '../../../types';

import classes from '../styles/FioDataDetailedItem.module.scss';

type Props = {
  fieldsList: FioRecordViewKeysProps[];
  fioRecordDecrypted: FioRecordViewDecrypted;
  fioRecordType: string;
  fioRecordDetailedType: string;
  fioWallet: FioWalletDoublet;
  onCloseModal: () => void;
};

const FioDataDetailedItem: React.FC<Props> = props => {
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
      <FioDataFieldsList
        fieldsList={fieldsList}
        fioRecordDecrypted={fioRecordDecrypted}
        fioRecordDetailedType={fioRecordDetailedType}
        fioRecordType={fioRecordType}
      />
      {fioRecordDecrypted.fioRecord.status ===
        FIO_REQUEST_STATUS_TYPES.PENDING &&
        fioRecordType === FIO_RECORD_TYPES.RECEIVED && (
          <FioDataDetailedActionButtons
            fioRecordDecrypted={fioRecordDecrypted}
            fioWallet={fioWallet}
            fioRecordType={fioRecordType}
            onCloseModal={onCloseModal}
          />
        )}
    </div>
  );
};

export default FioDataDetailedItem;
