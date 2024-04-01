import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  MetamaskConfirmAction,
  OnSuccessResponseResult,
} from '../../../components/MetamaskConfirmAction';

import {
  ACTIONS,
  BUNDLES_TX_COUNT,
  FIO_CHAIN_CODE,
  FIO_CONTENT_TYPES,
  FIO_CONTRACT_ACCOUNT_NAMES,
  TRANSACTION_ACTION_NAMES,
} from '../../../constants/fio';
import { CONFIRM_METAMASK_ACTION } from '../../../constants/common';

import apis from '../../../api';
import { DEFAULT_ACTION_FEE_AMOUNT } from '../../../api/fio';
import { ActionParams, FioServerResponse } from '../../../types/fio';
import { RequestTokensValues } from '../types';
import { FioWalletDoublet } from '../../../types';
import { handleFioServerResponse } from '../../../util/fio';
import { log } from '../../../util/general';
import useEffectOnce from '../../../hooks/general';

type Result = FioServerResponse & {
  block_time: string;
  bundlesCollected: number;
  fio_request_id: number;
  mapError?: Error;
};

type Props = {
  contactsList: string[];
  fioWallet: FioWalletDoublet;
  processing: boolean;
  submitData: RequestTokensValues;
  startProcessing: boolean;
  createContact: (name: string) => void;
  onSuccess: (result: Result) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
};

export const RequestTokensMetamaskWallet: React.FC<Props> = props => {
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
    payeeFioAddress,
    payerFioAddress,
    chainCode,
    tokenCode,
    payeeTokenPublicAddress,
    amount,
    memo,
    payerFioPublicKey,
    mapPubAddress,
  } = submitData || {};

  const requestActionParams: ActionParams = {
    action: TRANSACTION_ACTION_NAMES[ACTIONS.requestFunds],
    account: FIO_CONTRACT_ACCOUNT_NAMES.fioRecordObt,
    data: {
      payer_fio_address: payerFioAddress,
      payee_fio_address: payeeFioAddress,
      content: {
        amount,
        payee_public_address: payeeTokenPublicAddress,
        chain_code: chainCode,
        token_code: tokenCode,
        memo: memo || null,
        hash: null,
        offline_url: null,
      },
      tpid: apis.fio.tpid,
      max_fee: DEFAULT_ACTION_FEE_AMOUNT,
    },
    contentType: FIO_CONTENT_TYPES.NEW_FUNDS,
    payerFioPublicKey,
    derivationIndex: fioWallet.data?.derivationIndex,
  };

  const mapAddressActionParams = useMemo(
    () => ({
      action: TRANSACTION_ACTION_NAMES[ACTIONS.addPublicAddresses],
      account: FIO_CONTRACT_ACCOUNT_NAMES.fioAddress,
      data: {
        fio_address: payeeFioAddress,
        public_addresses: [
          {
            chain_code: chainCode,
            token_code: tokenCode,
            public_address: payeeTokenPublicAddress,
          },
        ],
        tpid: apis.fio.tpid,
        max_fee: DEFAULT_ACTION_FEE_AMOUNT,
      },
      derivationIndex: fioWallet.data?.derivationIndex,
    }),
    [
      chainCode,
      payeeFioAddress,
      tokenCode,
      payeeTokenPublicAddress,
      fioWallet.data?.derivationIndex,
    ],
  );

  const handleRequestResults = (result: FioServerResponse) => {
    if (!result) return;

    const { fio_request_id } = handleFioServerResponse(result) || {};

    setRequestResult({
      ...result,
      block_time: result.processed?.action_traces[0]?.block_time,
      bundlesCollected: BUNDLES_TX_COUNT.NEW_FIO_REQUEST,
      fio_request_id,
      transaction_id: result.transaction_id,
    });
  };

  const [actionParams, setActionParams] = useState<ActionParams | null>(null);
  const [requestResult, setRequestResult] = useState<Result | null>(null);
  const [actionFunction, setActionFunction] = useState<
    (res: OnSuccessResponseResult) => void
  >(null);
  const [cancelActionFunction, setCancelActionFunction] = useState<() => void>(
    () => onCancel,
  );
  const [callSubmitAction, toggleCallSubmitAction] = useState<boolean>(false);
  const [
    isPublicAddressMappedFinished,
    toggleIsPublicAddressMappedFinished,
  ] = useState<boolean>(false);

  const handleMapPublicAddressResults = useCallback(
    (result: OnSuccessResponseResult) => {
      if (!result) return;

      try {
        setRequestResult({
          ...requestResult,
          bundlesCollected:
            requestResult.bundlesCollected +
            BUNDLES_TX_COUNT.ADD_PUBLIC_ADDRESS,
        });
      } catch (error) {
        log.error(error);
        setRequestResult({ ...requestResult, mapError: error });
      } finally {
        toggleIsPublicAddressMappedFinished(true);
      }
    },
    [requestResult],
  );

  const onCancelForSecondAction = useCallback(() => {
    setRequestResult({ ...requestResult, mapError: new Error('Canceled') });
    toggleIsPublicAddressMappedFinished(true);
  }, [requestResult]);

  useEffect(() => {
    if (requestResult) {
      if (!contactsList?.filter(c => c === payerFioAddress).length)
        createContact(payerFioAddress);
    }

    if (requestResult && isPublicAddressMappedFinished) {
      onSuccess(requestResult);
      return;
    }

    if (requestResult && !mapPubAddress) {
      onSuccess(requestResult);
      return;
    }

    if (
      requestResult &&
      mapPubAddress &&
      chainCode !== FIO_CHAIN_CODE &&
      !isPublicAddressMappedFinished
    ) {
      setCancelActionFunction(() => onCancelForSecondAction);
      setActionParams(mapAddressActionParams);
      setActionFunction(() => handleMapPublicAddressResults);
      toggleCallSubmitAction(true);
    }
  }, [
    chainCode,
    contactsList,
    isPublicAddressMappedFinished,
    mapAddressActionParams,
    mapPubAddress,
    payerFioAddress,
    requestResult,
    createContact,
    onCancelForSecondAction,
    onSuccess,
    handleMapPublicAddressResults,
  ]);

  useEffectOnce(
    () => {
      if (submitData) {
        setActionParams(requestActionParams);
      }
      if (handleRequestResults !== null && handleRequestResults !== undefined) {
        setActionFunction(() => handleRequestResults);
      }
    },
    [submitData],
    !!submitData,
  );

  if (!submitData || !actionFunction) return null;

  return (
    <MetamaskConfirmAction
      analyticAction={CONFIRM_METAMASK_ACTION.REQUEST}
      analyticsData={submitData}
      actionParams={actionParams}
      callSubmitAction={callSubmitAction}
      processing={processing}
      setProcessing={setProcessing}
      onCancel={cancelActionFunction}
      onSuccess={actionFunction}
    />
  );
};
