import React, { useCallback } from 'react';

import { Account, Action } from '@fioprotocol/fiosdk';

import {
  MetamaskConfirmAction,
  OnSuccessResponseResult,
} from '../../../components/MetamaskConfirmAction';

import { BUNDLES_TX_COUNT } from '../../../constants/fio';
import { CONFIRM_METAMASK_ACTION } from '../../../constants/common';

import { handleFioServerResponse } from '../../../util/fio';
import { defaultMaxFee } from '../../../util/prices';
import apis from '../../../api';

import { StakeTokensValues } from '../types';
import { FioWalletDoublet } from '../../../types';

type Props = {
  fioWallet: FioWalletDoublet;
  fee: string;
  processing: boolean;
  submitData: StakeTokensValues;
  onSuccess: (result: {
    fee_collected: string;
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
    action: Action.unstake,
    account: Account.staking,
    data: {
      amount: apis.fio.amountToSUF(amount),
      fio_address: fioAddress,
      tpid: apis.fio.tpid,
      max_fee: defaultMaxFee(fee) as string,
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
