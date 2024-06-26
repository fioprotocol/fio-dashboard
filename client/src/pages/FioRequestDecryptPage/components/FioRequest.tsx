import React from 'react';

import FioRecordDetailedTabs from '../../WalletPage/components/FioRecordDetailedTabs';

import { commonFormatTime } from '../../../util/general';

import {
  FIO_RECORD_TYPES,
  FIO_REQUEST_FIELDS_LIST,
} from '../../WalletPage/constants';

import { FioRecord, FioWalletDoublet } from '../../../types';
import { FioRecordViewDecrypted } from '../../WalletPage/types';
import { ResultDetails } from '../../../components/ResultDetails/ResultDetails';

import classes from '../../WalletPage/styles/FioRecordFieldsList.module.scss';

const FIO_REQUEST_FIELDS_LIST_BY_TYPE = {
  [FIO_RECORD_TYPES.SENT]: FIO_REQUEST_FIELDS_LIST.SENT_LIST,
  [FIO_RECORD_TYPES.RECEIVED]: FIO_REQUEST_FIELDS_LIST.RECEIVED_LIST,
};

type Props = {
  fioRecordType: string;
  fioRecordDecrypted?: FioRecordViewDecrypted | null;
  fioRecordPaymentDataDecrypted?: FioRecordViewDecrypted | null;
  fioRequest: FioRecord;
  fioWallet: FioWalletDoublet;
};

const FioRequest: React.FC<Props> = props => {
  const {
    fioRecordDecrypted,
    fioRecordType,
    fioRecordPaymentDataDecrypted,
    fioRequest,
    fioWallet,
  } = props;

  const renderField = (field: string, value: string) => (
    <div className={classes.container} key={field}>
      <ResultDetails label={field} value={value} />
    </div>
  );

  const renderFields = () => {
    if (fioRecordType === FIO_RECORD_TYPES.SENT && !fioRecordDecrypted)
      return (
        <div className={classes.fieldsContainer}>
          {renderField('Requesting FIO Address', fioRequest.payeeFioAddress)}
          {renderField('Request sent to', fioRequest.payerFioAddress)}
          {renderField('Date / Time', commonFormatTime(fioRequest.timeStamp))}
        </div>
      );
    if (fioRecordType === FIO_RECORD_TYPES.RECEIVED)
      return (
        <>
          {renderField('Requestor', fioRequest.payeeFioAddress)}
          {renderField('To', fioRequest.payerFioAddress)}
          {renderField('Date / Time', commonFormatTime(fioRequest.timeStamp))}
        </>
      );

    return null;
  };

  return (
    <>
      <div className={classes.fieldsContainer}>{renderFields()}</div>
      {fioRecordDecrypted ? (
        <FioRecordDetailedTabs
          fioRecordDecrypted={fioRecordDecrypted}
          fioRecordPaymentDataDecrypted={fioRecordPaymentDataDecrypted}
          fioRecordType={fioRecordType}
          requestFieldsList={FIO_REQUEST_FIELDS_LIST_BY_TYPE[fioRecordType]}
          fioWallet={fioWallet}
          onCloseModal={() => null}
        />
      ) : null}
    </>
  );
};

export default FioRequest;
