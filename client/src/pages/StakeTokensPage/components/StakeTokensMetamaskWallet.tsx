import React, { useCallback } from 'react';

import {
  MetamaskConfirmAction,
  OnSuccessResponseResult,
} from '../../../components/MetamaskConfirmAction';
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

import { StakeTokensValues } from '../types';

type Props = {
  derivationIndex: number;
  fee: number;
  processing: boolean;
  submitData: StakeTokensValues;
  onSuccess: (result: {
    fee_collected: number;
    bundlesCollected: number;
  }) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
};

export const StakeTokensMetamaskWallet: React.FC<Props> = props => {
  const {
    derivationIndex,
    fee,
    processing,
    submitData,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const { amount, fioAddress, proxy } = submitData || {};

  const actionParams = {
    action: TRANSACTION_ACTION_NAMES[ACTIONS.stakeFioTokens],
    account: FIO_CONTRACT_ACCOUNT_NAMES.fioStaking,
    data: {
      amount: apis.fio.amountToSUF(Number(amount)),
      fio_address: fioAddress,
      tpid: proxy,
      max_fee: new MathOp(fee)
        .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
        .round(0)
        .toNumber(),
    },
    derivationIndex,
  };

  const handleStakeTokensResult = useCallback(
    (result: OnSuccessResponseResult) => {
      if (!result) return;

      if (!Array.isArray(result) && 'transaction_id' in result) {
        const { fee_collected } = handleFioServerResponse(result);

        const stakeTokensResult = {
          fee_collected,
          bundlesCollected: fee_collected ? 0 : BUNDLES_TX_COUNT.STAKE,
        };

        onSuccess(stakeTokensResult);
      }
    },
    [onSuccess],
  );

  if (!submitData) return null;

  return (
    <MetamaskConfirmAction
      actionParams={actionParams}
      processing={processing}
      setProcessing={setProcessing}
      onCancel={onCancel}
      onSuccess={handleStakeTokensResult}
    />
  );
};
