import React from 'react';

import { ContentType } from '@fioprotocol/fiosdk';

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
import { DecryptedItem } from '../../../types/fio';

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

  const actionParams = [
    {
      content,
      encryptionPublicKey,
      contentType,
      derivationIndex: fioWallet.data?.derivationIndex,
    },
  ];
  if (paymentOtbData && paymentOtbData.content) {
    actionParams.push({
      content: paymentOtbData.content,
      encryptionPublicKey,
      contentType: ContentType.recordObtDataContent,
      derivationIndex: fioWallet.data?.derivationIndex,
    });
  }

  const handleDecryptResults = (result: OnSuccessResponseResult) => {
    if (!result) return;

    if (!Array.isArray(result)) {
      result = [result as DecryptedItem];
    }

    const decryptResult: FioDecryptedRecordData = {
      itemData: undefined,
      paymentOtbData: undefined,
    };

    for (const decryptedRes of result as DecryptedItem[]) {
      if (!decryptedRes.contentType) continue;
      const decryptedContent: DecryptedFioRecordContent = camelizeObjKeys(
        decryptedRes.decryptedData,
      );
      const fioDecryptedContent = {
        ...decryptedContent,
        obtId: decryptedContent.obtId,
        chain: decryptedContent.chainCode,
        token: decryptedContent.tokenCode,
      };

      if (
        paymentOtbData &&
        decryptedRes.contentType === ContentType.recordObtDataContent
      ) {
        decryptResult.paymentOtbData = {
          fioRecord: paymentOtbData,
          fioDecryptedContent,
        };
      } else {
        decryptResult.itemData = {
          fioRecord: itemData,
          fioDecryptedContent,
        };
      }
    }

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
