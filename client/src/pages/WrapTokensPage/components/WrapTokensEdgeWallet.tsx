import React from 'react';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import apis from '../../../api';
import MathOp from '../../../util/math';

import {
  ACTIONS,
  DEFAULT_MAX_FEE_MULTIPLE_AMOUNT,
  TRANSACTION_ACCOUNT_NAMES,
  TRANSACTION_ACTION_NAMES,
} from '../../../constants/fio';
import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';
import { TrxResponse } from '../../../api/fio';

import { FioWalletDoublet } from '../../../types';
import { WrapTokensValues } from '../types';
import { SubmitActionParams } from '../../../components/EdgeConfirmAction/types';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: TrxResponse) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: WrapTokensValues | null;
  processing: boolean;
  fee?: number | null;
  oracleFee?: number | null;
};

const WrapTokensEdgeWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    submitData,
    fee,
    oracleFee,
    processing,
  } = props;

  const send = async ({ keys, data }: SubmitActionParams) => {
    const result = await apis.fio.executeAction(keys, ACTIONS.pushTransaction, {
      action: TRANSACTION_ACTION_NAMES[ACTIONS.wrapFioTokens],
      account: TRANSACTION_ACCOUNT_NAMES[ACTIONS.wrapFioTokens],
      data: {
        amount: apis.fio.amountToSUF(data.amount),
        chain_code: data.chainCode,
        public_address: data.publicAddress,
        max_oracle_fee: oracleFee,
        max_fee: new MathOp(fee)
          .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
          .round(0)
          .toNumber(),
        tpid: apis.fio.tpid,
      },
    });

    return { ...result };
  };

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.WRAP_TOKENS}
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

export default WrapTokensEdgeWallet;
