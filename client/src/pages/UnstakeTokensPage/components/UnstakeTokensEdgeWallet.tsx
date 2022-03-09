import React from 'react';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import apis from '../../../api';

import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';

import { FioWalletDoublet } from '../../../types';
import { StakeTokensValues } from '../types';
import { SubmitActionParams } from '../../../components/EdgeConfirmAction/types';
import { ACTIONS } from '../../../constants/fio';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: any) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  sendData: StakeTokensValues | null;
  processing: boolean;
};

const UnstakeTokensEdgeWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    sendData,
    processing,
  } = props;

  const unstake = async ({ keys, data }: SubmitActionParams) => {
    const result = await apis.fio.executeAction(
      keys,
      ACTIONS.unStakeFioTokens,
      {
        fioAddress: data.fioAddress,
        amount: apis.fio.amountToSUF(data.amount),
      },
    );
    return { ...result };
  };

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.UNSTAKE}
      setProcessing={setProcessing}
      onSuccess={onSuccess}
      onCancel={onCancel}
      processing={processing}
      data={sendData}
      submitAction={unstake}
      fioWalletEdgeId={fioWallet.edgeId || ''}
      edgeAccountLogoutBefore={true}
    />
  );
};

export default UnstakeTokensEdgeWallet;
