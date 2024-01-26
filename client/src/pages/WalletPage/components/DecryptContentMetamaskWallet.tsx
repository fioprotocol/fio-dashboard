import React from 'react';

import {
  MetamaskConfirmAction,
  OnSuccessResponseResult,
} from '../../../components/MetamaskConfirmAction';
import {
  FIO_CONTENT_TYPES,
  FIO_REQUEST_STATUS_TYPES,
} from '../../../constants/fio';

import {
  DecryptedFioRecordContent,
  FioDecryptedRecordData,
  FioRecord,
  FioWalletDoublet,
} from '../../../types';
import { FIO_RECORD_TYPES } from '../constants';
import { camelizeObjKeys } from '../../../utils';
import { ActionDataParams } from '../../../types/fio';

type Props = {
  fioWallet: FioWalletDoublet;
  processing: boolean;
  submitData: {
    itemData: FioRecord;
    fioRecordType: string;
    paymentOtbData: FioRecord | null;
  } | null;
  startProcessing: boolean;
  createContact: (name: string) => void;
  onSuccess: (result: FioDecryptedRecordData) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
};

export const DecryptContentMetamaskWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    processing,
    submitData,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const { publicKey } = fioWallet || {};

  const { itemData, fioRecordType, paymentOtbData } = submitData || {};
  const { content, payeeFioPublicKey, payerFioPublicKey } = itemData || {};

  const contentType =
    fioRecordType === FIO_RECORD_TYPES.DATA
      ? FIO_CONTENT_TYPES.RECORD_OBT_DATA
      : FIO_CONTENT_TYPES.NEW_FUNDS;

  const encryptionPublicKey =
    payerFioPublicKey === publicKey ? payeeFioPublicKey : payerFioPublicKey;

  const actionParams = {
    content,
    encryptionPublicKey,
    contentType,
    derivationIndex: fioWallet.data?.derivationIndex,
  };

  const handleDecryptResults = (
    result: OnSuccessResponseResult | ActionDataParams['content'],
  ) => {
    if (!result) return;

    const decryptedContent: DecryptedFioRecordContent = camelizeObjKeys(result);

    let paymentData;

    if (itemData.status === FIO_REQUEST_STATUS_TYPES.PAID && paymentOtbData) {
      paymentData = {
        fioRecord: paymentOtbData,
        fioDecryptedContent: {
          ...decryptedContent,
          obtId: decryptedContent.obtId,
          chain: decryptedContent.chainCode,
          token: decryptedContent.tokenCode,
        },
      };
    }

    const decryptResult = {
      itemData: {
        fioRecord: itemData,
        fioDecryptedContent: {
          ...decryptedContent,
          obtId: decryptedContent.obtId,
          chain: decryptedContent.chainCode,
          token: decryptedContent.tokenCode,
        },
      },
      paymentOtbData: paymentData,
    };

    onSuccess(decryptResult);
  };

  if (!submitData) return null;

  return (
    <MetamaskConfirmAction
      actionParams={actionParams}
      isDecryptContent
      processing={processing}
      setProcessing={setProcessing}
      onCancel={onCancel}
      onSuccess={handleDecryptResults}
    />
  );
};
