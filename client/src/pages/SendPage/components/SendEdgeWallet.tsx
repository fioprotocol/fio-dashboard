import React from 'react';

import { GenericAction } from '@fioprotocol/fiosdk';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import apis from '../../../api';

import { log } from '../../../util/general';
import MathOp from '../../../util/math';

import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';
import { TrxResponsePaidBundles } from '../../../api/fio';

import { FioWalletDoublet } from '../../../types';
import { SendTokensValues } from '../types';
import { SubmitActionParams } from '../../../components/EdgeConfirmAction/types';
import {
  BUNDLES_TX_COUNT,
  DEFAULT_MAX_FEE_MULTIPLE_AMOUNT,
  FIO_CHAIN_CODE,
} from '../../../constants/fio';

type Props = {
  fioWallet: FioWalletDoublet;
  processing: boolean;
  fee?: string | null;
  submitData: SendTokensValues | null;
  createContact: (name: string) => void;
  onSuccess: (data: TrxResponsePaidBundles) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
};

const SendEdgeWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    fee,
    submitData,
    processing,
    createContact,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const send = async ({ keys, data }: SubmitActionParams) => {
    const result = await apis.fio.executeAction(
      keys,
      GenericAction.transferTokens,
      {
        payeeFioPublicKey: data.toPubKey,
        amount: Number(data.nativeAmount),
        maxFee: new MathOp(fee)
          .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
          .round(0)
          .toNumber(),
      },
    );
    let obtError = null;
    let bundlesCollected = 0;
    if (data.memo || data.fioRequestId) {
      try {
        await apis.fio.executeAction(keys, GenericAction.recordObtData, {
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
          maxFee: data.feeRecordObtData,
          fioRequestId: data.fioRequestId,
        });
        bundlesCollected = BUNDLES_TX_COUNT.RECORD_OBT_DATA;
      } catch (e) {
        log.error(e);
        obtError = e;
      }
    }

    if (
      !!data.to &&
      !submitData?.contactsList?.filter(c => c === data.to).length
    )
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
      data={submitData}
      submitAction={send}
      fioWalletEdgeId={fioWallet.edgeId || ''}
      edgeAccountLogoutBefore={true}
    />
  );
};

export default SendEdgeWallet;
