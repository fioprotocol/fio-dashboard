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
  fee: number;
};

const StakeTokensEdgeWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    sendData,
    fee,
    processing,
  } = props;

  const send = async ({ keys, data }: SubmitActionParams) => {
    const result = await apis.fio.executeAction(keys, ACTIONS.stakeFioTokens, {
      fioAddress: data.fioAddress,
      amount: Number(data.amount), // possibly need to transform into native amount before send
      maxFee: fee,
    });
    return { ...result };
  };

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.SEND}
      setProcessing={setProcessing}
      onSuccess={onSuccess}
      onCancel={onCancel}
      processing={processing}
      data={sendData}
      submitAction={send}
      fioWalletEdgeId={fioWallet.edgeId || ''}
      edgeAccountLogoutBefore={true}
    />
  );
};

export default StakeTokensEdgeWallet;
