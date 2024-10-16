import React, { useCallback, useEffect, useState } from 'react';

import { Account, Action, ContentType } from '@fioprotocol/fiosdk';

import {
  MetamaskConfirmAction,
  OnSuccessResponseResult,
} from '../../../components/MetamaskConfirmAction';
import {
  BUNDLES_TX_COUNT,
  DEFAULT_MAX_FEE_MULTIPLE_AMOUNT,
  FIO_CHAIN_CODE,
} from '../../../constants/fio';
import { CONFIRM_METAMASK_ACTION } from '../../../constants/common';

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

import { FioWalletDoublet } from '../../../types';

type Props = {
  fioWallet: FioWalletDoublet;
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
    [fioRequestId, memo, requestResult],
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
    if (requestResult) {
      if (!!to && !contactsList?.filter(c => c === to).length)
        createContact(to);
    }

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
        action: Action.recordObt,
        account: Account.reqObt,
        contentType: ContentType.recordObtDataContent,
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
      analyticAction={CONFIRM_METAMASK_ACTION.SEND}
      analyticsData={submitData}
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
