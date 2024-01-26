import React, { useCallback, useEffect, useState } from 'react';

import {
  MetamaskConfirmAction,
  OnSuccessResponseResult,
} from '../../../components/MetamaskConfirmAction';
import {
  ACTIONS,
  BUNDLES_TX_COUNT,
  DEFAULT_MAX_FEE_MULTIPLE_AMOUNT,
  FIO_CHAIN_CODE,
  FIO_CONTENT_TYPES,
  FIO_CONTRACT_ACCOUNT_NAMES,
  TRANSACTION_ACTION_NAMES,
} from '../../../constants/fio';

import MathOp from '../../../util/math';
import apis from '../../../api';

import { ActionParams, FioServerResponse } from '../../../types/fio';
import { SendTokensValues } from '../types';
import {
  DEFAULT_ACTION_FEE_AMOUNT,
  TrxResponsePaidBundles,
} from '../../../api/fio';
import useEffectOnce from '../../../hooks/general';
import { log } from '../../../util/general';
import { handleFioServerResponse } from '../../../util/fio';

type Props = {
  contactsList: string[];
  derivationIndex: number;
  fee: number;
  processing: boolean;
  submitData: SendTokensValues;
  createContact: (name: string) => void;
  onSuccess: (result: TrxResponsePaidBundles & { obtError?: Error }) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
};

export const SendTokensMetamaskWallet: React.FC<Props> = props => {
  const {
    contactsList,
    derivationIndex,
    fee,
    processing,
    submitData,
    createContact,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const { amount, fioRequestId, from, fromPubKey, to, memo, toPubKey } =
    submitData || {};

  const transferTokensActionParams = {
    action: TRANSACTION_ACTION_NAMES[ACTIONS.transferTokens],
    account: FIO_CONTRACT_ACCOUNT_NAMES.fioToken,
    data: {
      amount: apis.fio.amountToSUF(Number(amount)),
      payee_public_key: toPubKey,
      tpid: apis.fio.tpid,
      max_fee: new MathOp(fee)
        .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
        .round(0)
        .toNumber(),
    },
    derivationIndex,
  };

  const [actionParams, setActionParams] = useState<ActionParams | null>(null);
  const [requestResult, setRequestResult] = useState<
    (TrxResponsePaidBundles & { obtError?: Error }) | null
  >(null);
  const [actionFunction, setActionFunction] = useState<
    (res: OnSuccessResponseResult) => void
  >(null);
  const [cancelActionFunction, setCancelActionFunction] = useState<() => void>(
    () => onCancel,
  );
  const [callSubmitAction, toggleCallSubmitAction] = useState<boolean>(false);
  const [isTransferTokensFinished, toggleIsTransferTokensFinished] = useState<
    boolean
  >(false);

  const handleRecordObtResult = useCallback(
    (result: OnSuccessResponseResult) => {
      if (!result) return;

      try {
        if (!!to && !contactsList.filter(c => c === to).length)
          createContact(to);

        setRequestResult({
          ...requestResult,
          bundlesCollected:
            memo || fioRequestId ? BUNDLES_TX_COUNT.RECORD_OBT_DATA : 0,
        });
      } catch (error) {
        log.error(error);
        setRequestResult({ ...requestResult, obtError: error });
      } finally {
        toggleIsTransferTokensFinished(true);
      }
    },
    [contactsList, createContact, fioRequestId, memo, requestResult, to],
  );

  const handleSendTokensResult = (result: FioServerResponse) => {
    if (!result) return;

    const { fee_collected } = handleFioServerResponse(result);

    setRequestResult({
      fee_collected,
      transaction_id: result.transaction_id,
      bundlesCollected: 0,
    });
  };

  const onCancelForSecondAction = useCallback(() => {
    setRequestResult({ ...requestResult, obtError: new Error('Canceled') });
    toggleIsTransferTokensFinished(true);
  }, [requestResult]);

  useEffect(() => {
    if (requestResult && isTransferTokensFinished) {
      onSuccess(requestResult);
      return;
    }

    if (requestResult && (!fioRequestId || !memo)) {
      onSuccess(requestResult);
      return;
    }

    if (requestResult && (fioRequestId || memo) && !isTransferTokensFinished) {
      const recordObtActionParams = {
        action: TRANSACTION_ACTION_NAMES[ACTIONS.recordObtData],
        account: FIO_CONTRACT_ACCOUNT_NAMES.fioRecordObt,
        contentType: FIO_CONTENT_TYPES.RECORD_OBT_DATA,
        data: {
          content: {
            amount: Number(amount),
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
          fio_request_id: fioRequestId,
          payer_fio_address: from,
          payee_fio_address: to,
          tpid: apis.fio.tpid,
          max_fee: DEFAULT_ACTION_FEE_AMOUNT,
        },
        derivationIndex,
      };
      setCancelActionFunction(() => onCancelForSecondAction);
      setActionParams(recordObtActionParams);
      setActionFunction(() => handleRecordObtResult);
      toggleCallSubmitAction(true);
    }
  }, [
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
  ]);

  useEffectOnce(
    () => {
      if (submitData) {
        setActionParams(transferTokensActionParams);
      }
      if (
        handleSendTokensResult !== null &&
        handleSendTokensResult !== undefined
      ) {
        setActionFunction(() => handleSendTokensResult);
      }
    },
    [submitData],
    !!submitData,
  );

  if (!submitData || !actionFunction) return null;

  return (
    <MetamaskConfirmAction
      actionParams={actionParams}
      callSubmitAction={callSubmitAction}
      processing={processing}
      setProcessing={setProcessing}
      onCancel={cancelActionFunction}
      onSuccess={actionFunction}
      isDecryptContent={false}
    />
  );
};
