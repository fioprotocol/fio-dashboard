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
import { CONFIRM_METAMASK_ACTION } from '../../../constants/common';

import { handleFioServerResponse } from '../../../util/fio';
import MathOp from '../../../util/math';
import apis from '../../../api';

import { StakeTokensValues } from '../types';
import { FioWalletDoublet } from '../../../types';

type Props = {
  fioWallet: FioWalletDoublet;
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

export const UnstakeTokensMetamaskWallet: React.FC<Props> = props => {
  const {
    fee,
    fioWallet,
    processing,
    submitData,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const { amount, fioAddress } = submitData || {};

  const actionParams = {
    action: TRANSACTION_ACTION_NAMES[ACTIONS.unStakeFioTokens],
    account: FIO_CONTRACT_ACCOUNT_NAMES.fioStaking,
    data: {
      amount: apis.fio.amountToSUF(Number(amount)),
      fio_address: fioAddress,
      tpid: apis.fio.tpid,
      max_fee: new MathOp(fee)
        .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
        .round(0)
        .toNumber(),
    },
    derivationIndex: fioWallet?.data?.derivationIndex,
  };

  const handleUnstakeTokensResult = useCallback(
    (result: OnSuccessResponseResult) => {
      if (!result) return;

      if (!Array.isArray(result) && 'transaction_id' in result) {
        const { fee_collected } = handleFioServerResponse(result);

        const unStakeTokensResult = {
          fee_collected,
          bundlesCollected: fee_collected ? 0 : BUNDLES_TX_COUNT.STAKE,
        };

        onSuccess(unStakeTokensResult);
      }
    },
    [onSuccess],
  );

  if (!submitData) return null;

  return (
    <MetamaskConfirmAction
      analyticAction={CONFIRM_METAMASK_ACTION.UNSTAKE}
      analyticsData={submitData}
      actionParams={actionParams}
      processing={processing}
      setProcessing={setProcessing}
      onCancel={onCancel}
      onSuccess={handleUnstakeTokensResult}
    />
  );
};
