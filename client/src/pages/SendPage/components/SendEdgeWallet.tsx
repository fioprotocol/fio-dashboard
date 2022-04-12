import React from 'react';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import apis from '../../../api';

import { log } from '../../../util/general';

import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';
import {
  DEFAULT_ACTION_FEE_AMOUNT,
  TrxResponsePaidBundles,
} from '../../../api/fio';

import { FioWalletDoublet } from '../../../types';
import { SendTokensValues } from '../types';
import { SubmitActionParams } from '../../../components/EdgeConfirmAction/types';
import {
  ACTIONS,
  BUNDLES_TX_COUNT,
  FIO_CHAIN_CODE,
} from '../../../constants/fio';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: TrxResponsePaidBundles) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  sendData: SendTokensValues | null;
  contactsList: string[];
  createContact: (name: string) => void;
  processing: boolean;
  fee?: number | null;
};

const SendEdgeWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    sendData,
    fee,
    processing,
    createContact,
    contactsList,
  } = props;

  const send = async ({ keys, data }: SubmitActionParams) => {
    const result = await apis.fio.executeAction(keys, ACTIONS.transferTokens, {
      payeeFioPublicKey: data.toPubKey,
      amount: Number(data.nativeAmount),
      maxFee: fee,
    });
    let obtError = null;
    let bundlesCollected = 0;
    if (data.memo || data.fioRequestId) {
      try {
        await apis.fio.executeAction(keys, ACTIONS.recordObtData, {
          payerFioAddress: data.from,
          payeeFioAddress: data.to,
          payerTokenPublicAddress: keys.public,
          payeeTokenPublicAddress: data.toPubKey,
          amount: Number(data.amount),
          chainCode: FIO_CHAIN_CODE,
          tokenCode: FIO_CHAIN_CODE,
          obtId: result.transaction_id,
          payeeFioPublicKey: data.toPubKey,
          memo: data.memo,
          maxFee: DEFAULT_ACTION_FEE_AMOUNT,
          fioRequestId: data.fioRequestId,
        });
        bundlesCollected = BUNDLES_TX_COUNT.RECORD_OBT_DATA;
      } catch (e) {
        log.error(e);
        obtError = e;
      }
    }

    if (!!data.to && !contactsList.filter(c => c === data.to).length)
      createContact(data.to);

    return { ...result, obtError, bundlesCollected };
  };

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.SEND}
      setProcessing={setProcessing}
      onSuccess={onSuccess}
      onCancel={onCancel}
      processing={processing}
      data={sendData}
      submitAction={send}
      fioWalletEdgeId={fioWallet.edgeId || ''}
      edgeAccountLogoutBefore={true}
    />
  );
};

export default SendEdgeWallet;
