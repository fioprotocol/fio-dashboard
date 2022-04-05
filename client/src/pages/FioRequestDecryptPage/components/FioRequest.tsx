import React from 'react';

import FioRecordFieldsList from '../../WalletPage/components/FioRecordFieldsList';
import Badge, { BADGE_TYPES } from '../../../components/Badge/Badge';

import {
  FIO_RECORD_DETAILED_TYPE,
  FIO_RECORD_TYPES,
  FIO_REQUEST_FIELDS_LIST,
} from '../../WalletPage/constants';

import { FioRecord } from '../../../types';
import { FioRecordViewDecrypted } from '../../WalletPage/types';

import recordsClasses from '../../WalletPage/styles/FioRecordFieldsList.module.scss';

const FIO_REQUEST_FIELDS_LIST_BY_TYPE = {
  [FIO_RECORD_TYPES.SENT]: FIO_REQUEST_FIELDS_LIST.SENT_LIST,
  [FIO_RECORD_TYPES.RECEIVED]: FIO_REQUEST_FIELDS_LIST.RECEIVED_LIST,
};

type Props = {
  fioRecordType: string;
  fioRecordDetailedItem?: FioRecordViewDecrypted | null;
  fioRequest: FioRecord;
};

const FioRequest: React.FC<Props> = (props: Props) => {
  const { fioRecordDetailedItem, fioRecordType, fioRequest } = props;

  const renderField = (field: string, value: string) => (
    <div className={recordsClasses.container} key={field}>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={recordsClasses.badgeContainer}>
          <p className={recordsClasses.title}>{field}</p>
          <p className={recordsClasses.content}>{value}</p>
        </div>
      </Badge>
    </div>
  );

  const renderFields = () => {
    if (fioRecordType === FIO_RECORD_TYPES.SENT)
      return (
        <div className={recordsClasses.fieldsContainer}>
          {renderField('Requesting FIO Address', fioRequest.payeeFioAddress)}
          {renderField('Request sent to', fioRequest.payerFioAddress)}
          {renderField('Date / Time', fioRequest.timeStamp)}
        </div>
      );
    if (fioRecordType === FIO_RECORD_TYPES.RECEIVED)
      return (
        <>
          {renderField('Requestor', fioRequest.payeeFioAddress)}
          {renderField('To', fioRequest.payerFioAddress)}
          {renderField('Date / Time', fioRequest.timeStamp)}
        </>
      );
  };

  return (
    <>
      {fioRecordDetailedItem ? (
        <FioRecordFieldsList
          fioRecordDecrypted={fioRecordDetailedItem}
          fioRecordType={fioRecordType}
          fieldsList={FIO_REQUEST_FIELDS_LIST_BY_TYPE[fioRecordType]}
          fioRecordDetailedType={FIO_RECORD_DETAILED_TYPE.REQUEST}
        />
      ) : (
        <div className={recordsClasses.fieldsContainer}>{renderFields()}</div>
      )}
    </>
  );
};

export default FioRequest;
