import React, { useCallback } from 'react';

import { MetamaskConfirmAction } from '../../../components/MetamaskConfirmAction';
import {
  ACTIONS,
  BUNDLES_TX_COUNT,
  DEFAULT_MAX_FEE_MULTIPLE_AMOUNT,
  FIO_CONTRACT_ACCOUNT_NAMES,
  TRANSACTION_ACTION_NAMES,
} from '../../../constants/fio';

import { handleFioServerResponse } from '../../../util/fio';
import MathOp from '../../../util/math';
import apis from '../../../api';

import { FioServerResponse } from '../../../types/fio';
import { SendTokensValues } from '../types';
import { TrxResponsePaidBundles } from '../../../api/fio';

type Props = {
  contactsList: string[];
  derivationIndex: number;
  fee: number;
  processing: boolean;
  submitData: SendTokensValues;
  createContact: (name: string) => void;
  onSuccess: (result: TrxResponsePaidBundles) => void;
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

  const { amount, fioRequestId, to, memo, toPubKey } = submitData || {};

  const actionParams = {
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

  const handleSendTokensResult = useCallback(
    (result: FioServerResponse) => {
      if (!result) return;

      const { fee_collected } = handleFioServerResponse(result);

      const sendTokensTokensResult = {
        fee_collected,
        bundlesCollected:
          memo || fioRequestId ? BUNDLES_TX_COUNT.RECORD_OBT_DATA : 0,
        ...result,
      };

      if (!!to && !contactsList.filter(c => c === to).length) createContact(to);

      onSuccess(sendTokensTokensResult);
    },
    [memo, fioRequestId, to, contactsList, createContact, onSuccess],
  );

  if (!submitData) return null;

  return (
    <MetamaskConfirmAction
      actionParams={actionParams}
      processing={processing}
      setProcessing={setProcessing}
      onCancel={onCancel}
      onSuccess={handleSendTokensResult}
    />
  );
};
