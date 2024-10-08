import React from 'react';

import { ContentType, RequestStatus } from '@fioprotocol/fiosdk';

import {
  MetamaskConfirmAction,
  OnSuccessResponseResult,
} from '../../../components/MetamaskConfirmAction';

import { CONFIRM_METAMASK_ACTION } from '../../../constants/common';

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
      ? ContentType.recordObtDataContent
      : ContentType.newFundsContent;

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

    if (itemData.status === RequestStatus.sentToBlockchain && paymentOtbData) {
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
      analyticAction={CONFIRM_METAMASK_ACTION.DETAILED_FIO_REQUEST}
      analyticsData={submitData}
      actionParams={actionParams}
      isDecryptContent
      processing={processing}
      setProcessing={setProcessing}
      onCancel={onCancel}
      onSuccess={handleDecryptResults}
    />
  );
};
