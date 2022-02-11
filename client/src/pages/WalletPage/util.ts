import { FIO_RECORD_TYPES } from './constants';

import { FioRecordDecrypted } from '../../types';
import { FioRecordViewDecrypted } from './types';

export const transformFioRecord = ({
  fioRecordItem,
  fioRecordType,
  publicKey,
}: {
  fioRecordItem: FioRecordDecrypted;
  fioRecordType: string;
  publicKey: string;
}): FioRecordViewDecrypted => {
  const {
    fioRecord: {
      payeeFioPublicKey,
      content,
      fioRequestId,
      payeeFioAddress,
      payerFioAddress,
      payerFioPublicKey,
      status,
      timeStamp,
    },
    fioDecryptedContent,
  } = fioRecordItem;

  let from = payeeFioAddress;
  let to = payerFioAddress;
  let fioTxType = fioRecordType;

  if (fioRecordType === FIO_RECORD_TYPES.DATA) {
    from = payerFioAddress;
    to = payeeFioAddress;

    fioTxType =
      payerFioPublicKey === publicKey
        ? FIO_RECORD_TYPES.SENT
        : FIO_RECORD_TYPES.RECEIVED;
  }

  return {
    fioRecord: {
      from,
      to,
      payeeFioPublicKey,
      date: timeStamp,
      status,
      id: fioRequestId,
      content,
      fioTxType,
    },
    fioDecryptedContent,
  };
};
