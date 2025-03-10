import React, { useCallback, useEffect, useState } from 'react';

import { Account, Action, ContentType } from '@fioprotocol/fiosdk';

import {
  MetamaskConfirmAction,
  OnSuccessResponseResult,
} from '../../../components/MetamaskConfirmAction';
import { BUNDLES_TX_COUNT, FIO_CHAIN_CODE } from '../../../constants/fio';
import { CONFIRM_METAMASK_ACTION } from '../../../constants/common';

import apis from '../../../api';

import { ActionParams, FioServerResponse } from '../../../types/fio';
import { SendTokensValues } from '../types';
import {
  DEFAULT_ACTION_FEE_AMOUNT,
  TrxResponsePaidBundles,
} from '../../../api/fio';
import { defaultMaxFee } from '../../../util/prices';
import { log } from '../../../util/general';
import { handleFioServerResponse } from '../../../util/fio';

import { FioWalletDoublet } from '../../../types';

type Props = {
  fioWallet: FioWalletDoublet;
  fee: string;
  processing: boolean;
  submitData: SendTokensValues;
  createContact: (name: string) => void;
  onSuccess: (result: TrxResponsePaidBundles & { obtError?: Error }) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
};

export const SendTokensMetamaskWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    fee,
    processing,
    submitData,
    createContact,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const derivationIndex = fioWallet?.data?.derivationIndex;

  const {
    amount,
    contactsList,
    fioRequestId,
    from,
    fromPubKey,
    to,
    memo,
    toPubKey,
  } = submitData || {};

  const transferTokensActionParams = {
    action: Action.transferTokensKey,
    account: Account.token,
    data: {
      amount: apis.fio.amountToSUF(amount),
      payee_public_key: toPubKey,
      tpid: apis.fio.tpid,
      max_fee: defaultMaxFee(fee) as string,
    },
    derivationIndex,
  };

  const [actionParams, setActionParams] = useState<ActionParams | null>(null);
  const [requestResult, setRequestResult] = useState<
    (TrxResponsePaidBundles & { obtError?: Error }) | null
  >(null);

  const [isSecondAction, setIsSecondAction] = useState<boolean>(false);
  const [callSubmitAction, toggleCallSubmitAction] = useState<boolean>(false);
  const [isTransferTokensFinished, toggleIsTransferTokensFinished] = useState<
    boolean
  >(false);

  const handleRecordObtResult = useCallback(
    (result: OnSuccessResponseResult) => {
      if (!result) return;

      try {
        setRequestResult({
          ...requestResult,
          bundlesCollected:
            memo || fioRequestId ? BUNDLES_TX_COUNT.RECORD_OBT_DATA : 0,
        });
      } catch (error) {
        log.error(error);
        setRequestResult({ ...requestResult, obtError: error });
      } finally {
        setActionParams(null);
        toggleIsTransferTokensFinished(true);
      }
    },
    [fioRequestId, memo, requestResult],
  );

  const handleSendTokensResult = (result: OnSuccessResponseResult) => {
    if (!result) return;

    const { fee_collected } = handleFioServerResponse(
      result as FioServerResponse,
    );

    setRequestResult({
      fee_collected,
      transaction_id: (result as FioServerResponse).transaction_id,
      bundlesCollected: 0,
    });
  };

  const onCancelForSecondAction = useCallback(() => {
    setRequestResult({ ...requestResult, obtError: new Error('Canceled') });
    toggleIsTransferTokensFinished(true);
  }, [requestResult]);

  useEffect(() => {
    if (requestResult) {
      if (!!to && !contactsList?.filter(c => c === to).length)
        createContact(to);
    }

    if (
      requestResult &&
      (isTransferTokensFinished || (!fioRequestId && !memo))
    ) {
      onSuccess(requestResult);
      setRequestResult(null);
      return;
    }

    if (requestResult && (fioRequestId || memo) && !isTransferTokensFinished) {
      const recordObtActionParams = {
        action: Action.recordObt,
        account: Account.reqObt,
        contentType: ContentType.recordObtDataContent,
        data: {
          content: {
            amount: amount,
            chain_code: FIO_CHAIN_CODE,
            token_code: FIO_CHAIN_CODE,
            payer_public_address: fromPubKey,
            payee_public_address: toPubKey,
            memo: memo || '',
            hash: '',
            obt_id: requestResult.transaction_id,
            offline_url: '',
            status: 'sent_to_blockchain',
          },
          fio_request_id: fioRequestId || '',
          payer_fio_address: from,
          payee_fio_address: to,
          tpid: apis.fio.tpid,
          max_fee: DEFAULT_ACTION_FEE_AMOUNT,
        },
        derivationIndex,
      };
      setActionParams(recordObtActionParams);
      setIsSecondAction(true);
      toggleCallSubmitAction(true);
    }
  }, [
    contactsList,
    requestResult,
    isTransferTokensFinished,
    fioRequestId,
    memo,
    amount,
    from,
    to,
    fromPubKey,
    toPubKey,
    derivationIndex,
    handleRecordObtResult,
    onCancelForSecondAction,
    onSuccess,
    createContact,
  ]);

  if (!submitData) return null;

  return (
    <MetamaskConfirmAction
      analyticAction={CONFIRM_METAMASK_ACTION.SEND}
      analyticsData={submitData}
      actionParams={actionParams || transferTokensActionParams}
      callSubmitAction={callSubmitAction}
      processing={processing}
      setProcessing={setProcessing}
      onCancel={isSecondAction ? onCancelForSecondAction : onCancel}
      onSuccess={
        isSecondAction ? handleRecordObtResult : handleSendTokensResult
      }
      isDecryptContent={false}
    />
  );
};
