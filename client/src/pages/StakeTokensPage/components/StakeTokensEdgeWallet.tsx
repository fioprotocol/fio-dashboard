import React from 'react';

import { GenericAction } from '@fioprotocol/fiosdk';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import apis from '../../../api';
import MathOp from '../../../util/math';

import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';
import {
  BUNDLES_TX_COUNT,
  DEFAULT_MAX_FEE_MULTIPLE_AMOUNT,
} from '../../../constants/fio';

import { FioWalletDoublet } from '../../../types';
import { StakeTokensValues } from '../types';
import { SubmitActionParams } from '../../../components/EdgeConfirmAction/types';
import { TrxResponsePaidBundles } from '../../../api/fio';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: TrxResponsePaidBundles) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: StakeTokensValues | null;
  processing: boolean;
  fee: string;
};

const StakeTokensEdgeWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    submitData,
    fee,
    processing,
  } = props;

  const stake = async ({ keys, data }: SubmitActionParams) => {
    const result = await apis.fio.executeAction(
      keys,
      GenericAction.stakeFioTokens,
      {
        amount: apis.fio.amountToSUF(data.amount),
        fioAddress: data.fioAddress,
        maxFee: new MathOp(fee)
          .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
          .round(0)
          .toNumber(),
        technologyProviderId: data.proxy,
      },
    );
    return {
      ...result,
      bundlesCollected: result.fee_collected ? 0 : BUNDLES_TX_COUNT.STAKE,
    };
  };

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.STAKE}
      setProcessing={setProcessing}
      onSuccess={onSuccess}
      onCancel={onCancel}
      processing={processing}
      data={submitData}
      submitAction={stake}
      fioWalletEdgeId={fioWallet.edgeId || ''}
      edgeAccountLogoutBefore={true}
    />
  );
};

export default StakeTokensEdgeWallet;
