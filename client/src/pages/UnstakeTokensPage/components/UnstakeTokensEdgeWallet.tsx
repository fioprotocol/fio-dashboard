import React from 'react';

import { GenericAction } from '@fioprotocol/fiosdk';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import apis from '../../../api';
import { defaultMaxFee } from '../../../util/prices';

import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';
import { BUNDLES_TX_COUNT } from '../../../constants/fio';

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

const UnstakeTokensEdgeWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    submitData,
    fee,
    processing,
  } = props;

  const unstake = async ({ keys, data }: SubmitActionParams) => {
    const result = await apis.fio.executeAction(
      keys,
      GenericAction.unStakeFioTokens,
      {
        fioAddress: data.fioAddress,
        amount: apis.fio.amountToSUF(data.amount),
        maxFee: defaultMaxFee(fee) as string,
      },
    );
    return {
      ...result,
      bundlesCollected: result.fee_collected ? 0 : BUNDLES_TX_COUNT.UNSTAKE,
    };
  };

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.UNSTAKE}
      setProcessing={setProcessing}
      onSuccess={onSuccess}
      onCancel={onCancel}
      processing={processing}
      data={submitData}
      submitAction={unstake}
      fioWalletEdgeId={fioWallet.edgeId || ''}
      edgeAccountLogoutBefore={true}
    />
  );
};

export default UnstakeTokensEdgeWallet;
