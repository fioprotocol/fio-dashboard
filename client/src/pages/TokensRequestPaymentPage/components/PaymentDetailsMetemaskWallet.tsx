import React, { useCallback } from 'react';

import {
  MetamaskConfirmAction,
  OnSuccessResponseResult,
} from '../../../components/MetamaskConfirmAction';

import {
  ACTIONS,
  FIO_CONTENT_TYPES,
  FIO_CONTRACT_ACCOUNT_NAMES,
  TRANSACTION_ACTION_NAMES,
} from '../../../constants/fio';
import { CONFIRM_METAMASK_ACTION } from '../../../constants/common';

import apis from '../../../api';
import { DEFAULT_ACTION_FEE_AMOUNT } from '../../../api/fio';

import { FioWalletDoublet } from '../../../types';
import { PaymentDetailsValues, TxValues } from '../types';
import { handleFioServerResponse } from '../../../util/fio';

type Props = {
  contactsList: string[];
  fioWallet: FioWalletDoublet;
  processing: boolean;
  submitData: PaymentDetailsValues;
  createContact: (name: string) => void;
  onSuccess: (result: TxValues & { error?: string }) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
};

export const PaymentDetailsMetemaskWallet: React.FC<Props> = props => {
  const {
    contactsList,
    fioWallet,
    processing,
    submitData,
    createContact,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const {
    amount,
    chainCode,
    fioRequestId,
    memo,
    obtId,
    tokenCode,
    payeeFioAddress,
    payerFioAddress,
    payeePublicAddress,
    payeeFioPublicKey,
  } = submitData || {};

  const { data, publicKey } = fioWallet || {};

  const actionParams = {
    action: TRANSACTION_ACTION_NAMES[ACTIONS.recordObtData],
    account: FIO_CONTRACT_ACCOUNT_NAMES.fioRecordObt,
    contentType: FIO_CONTENT_TYPES.RECORD_OBT_DATA,
    data: {
      content: {
        amount: Number(amount),
        chain_code: chainCode,
        token_code: tokenCode,
        payer_public_address: publicKey,
        payee_public_address: payeePublicAddress,
        memo: memo || '',
        hash: '',
        obt_id: obtId,
        offline_url: '',
        status: 'sent_to_blockchain',
      },
      fio_request_id: fioRequestId,
      payer_fio_address: payerFioAddress,
      payee_fio_address: payeeFioAddress,
      tpid: apis.fio.tpid,
      max_fee: DEFAULT_ACTION_FEE_AMOUNT,
    },
    derivationIndex: data?.derivationIndex,
    payeeFioPublicKey,
  };

  const handleRecordObtResult = useCallback(
    (result: OnSuccessResponseResult) => {
      if (!result) return;

      if (!contactsList?.filter(c => c === payeeFioAddress).length)
        createContact(payeeFioAddress);

      if (!Array.isArray(result) && 'transaction_id' in result) {
        const { status } = handleFioServerResponse(result);

        const resultObj = {
          blockNum: result.processed?.block_num,
          status,
          transactionId: result.transaction_id,
        };

        onSuccess(resultObj);
      }
    },
    [contactsList, createContact, onSuccess, payeeFioAddress],
  );

  if (!submitData) return null;

  return (
    <MetamaskConfirmAction
      analyticAction={CONFIRM_METAMASK_ACTION.PAYMENT_DETAILS}
      analyticsData={submitData}
      actionParams={actionParams}
      processing={processing}
      setProcessing={setProcessing}
      onCancel={onCancel}
      onSuccess={handleRecordObtResult}
    />
  );
};
