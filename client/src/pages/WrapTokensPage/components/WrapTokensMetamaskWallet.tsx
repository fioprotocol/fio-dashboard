import React from 'react';

import {
  MetamaskConfirmAction,
  OnSuccessResponseResult,
} from '../../../components/MetamaskConfirmAction';

import {
  ACTIONS,
  DEFAULT_MAX_FEE_MULTIPLE_AMOUNT,
  FIO_CONTRACT_ACCOUNT_NAMES,
  TRANSACTION_ACTION_NAMES,
} from '../../../constants/fio';
import { CONFIRM_METAMASK_ACTION } from '../../../constants/common';

import apis from '../../../api';
import MathOp from '../../../util/math';
import { handleFioServerResponse } from '../../../util/fio';

type Props = {
  derivationIndex: number;
  processing: boolean;
  submitData: {
    amount: string | number;
    chainCode: string;
    fee?: number | null;
    oracleFee?: number | null;
    publicAddress: string;
  };
  startProcessing: boolean;
  onSuccess: (result: {
    fee_collected: number;
    oracle_fee_collected: number;
    transaction_id: string;
  }) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
};

export const WrapTokensMetamaskWallet: React.FC<Props> = props => {
  const {
    derivationIndex,
    processing,
    startProcessing,
    submitData,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const { amount, chainCode, fee, oracleFee, publicAddress } = submitData;

  const actionParams = {
    action: TRANSACTION_ACTION_NAMES[ACTIONS.wrapFioTokens],
    account: FIO_CONTRACT_ACCOUNT_NAMES.fioOracle,
    data: {
      amount: apis.fio.amountToSUF(Number(amount)),
      chain_code: chainCode,
      public_address: publicAddress,
      max_oracle_fee: oracleFee,
      tpid: apis.fio.tpid,
      max_fee: new MathOp(fee)
        .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
        .round(0)
        .toNumber(),
    },
    derivationIndex,
  };

  const handleWrapResults = (result: OnSuccessResponseResult) => {
    if (!result) return;

    if (!Array.isArray(result) && 'transaction_id' in result) {
      const { fee_collected, oracle_fee_collected } =
        handleFioServerResponse(result) || {};

      onSuccess({
        ...result,
        fee_collected,
        oracle_fee_collected,
        transaction_id: result.transaction_id,
      });
    }
  };

  if (!startProcessing) return null;

  return (
    <MetamaskConfirmAction
      analyticAction={CONFIRM_METAMASK_ACTION.WRAP_TOKENS}
      analyticsData={submitData}
      actionParams={actionParams}
      processing={processing}
      setProcessing={setProcessing}
      onCancel={onCancel}
      onSuccess={handleWrapResults}
    />
  );
};
