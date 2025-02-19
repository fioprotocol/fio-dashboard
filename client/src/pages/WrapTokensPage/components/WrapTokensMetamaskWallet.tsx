import React from 'react';

import { Account, Action } from '@fioprotocol/fiosdk';

import {
  MetamaskConfirmAction,
  OnSuccessResponseResult,
} from '../../../components/MetamaskConfirmAction';

import { CONFIRM_METAMASK_ACTION } from '../../../constants/common';

import apis from '../../../api';
import { handleFioServerResponse } from '../../../util/fio';
import { defaultMaxFee } from '../../../util/prices';
import { WrapTokensValues } from '../types';
import { FioWalletDoublet } from '../../../types';

type Props = {
  fioWallet: FioWalletDoublet;
  fee: string;
  oracleFee: string;
  processing: boolean;
  submitData: WrapTokensValues;
  onSuccess: (result: {
    fee_collected: string;
    oracle_fee_collected: string;
    transaction_id: string;
  }) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
};

export const WrapTokensMetamaskWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    fee,
    oracleFee,
    processing,
    submitData,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const derivationIndex = fioWallet?.data?.derivationIndex;

  const { amount, chainCode, publicAddress } = submitData || {};

  const actionParams = {
    action: Action.wrapTokens,
    account: Account.oracle,
    data: {
      amount: apis.fio.amountToSUF(amount),
      chain_code: chainCode,
      public_address: publicAddress,
      max_oracle_fee: oracleFee,
      tpid: apis.fio.tpid,
      max_fee: defaultMaxFee(fee) as string,
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

  if (!submitData) return null;

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
