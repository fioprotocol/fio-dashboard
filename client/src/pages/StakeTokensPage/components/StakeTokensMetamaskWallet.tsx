import React, { useCallback } from 'react';

import { Account, Action } from '@fioprotocol/fiosdk';

import {
  MetamaskConfirmAction,
  OnSuccessResponseResult,
} from '../../../components/MetamaskConfirmAction';

import {
  BUNDLES_TX_COUNT,
  DEFAULT_MAX_FEE_MULTIPLE_AMOUNT,
} from '../../../constants/fio';
import { CONFIRM_METAMASK_ACTION } from '../../../constants/common';

import { handleFioServerResponse } from '../../../util/fio';
import MathOp from '../../../util/math';
import apis from '../../../api';

import { StakeTokensValues } from '../types';
import { FioWalletDoublet } from '../../../types';

type Props = {
  fee: number;
  fioWallet: FioWalletDoublet;
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
    fee,
    fioWallet,
    processing,
    submitData,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const { amount, fioAddress, proxy } = submitData || {};

  const actionParams = {
    action: Action.stake,
    account: Account.staking,
    data: {
      amount: apis.fio.amountToSUF(Number(amount)),
      fio_address: fioAddress,
      tpid: proxy,
      max_fee: new MathOp(fee)
        .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
        .round(0)
        .toNumber(),
    },
    derivationIndex: fioWallet?.data?.derivationIndex,
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
      analyticAction={CONFIRM_METAMASK_ACTION.STAKE}
      analyticsData={submitData}
      actionParams={actionParams}
      processing={processing}
      setProcessing={setProcessing}
      onCancel={onCancel}
      onSuccess={handleStakeTokensResult}
    />
  );
};
