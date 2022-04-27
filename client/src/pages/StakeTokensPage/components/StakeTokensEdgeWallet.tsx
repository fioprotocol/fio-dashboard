import React from 'react';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import apis from '../../../api';

import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';
import { ACTIONS, BUNDLES_TX_COUNT } from '../../../constants/fio';

import { FioWalletDoublet } from '../../../types';
import { StakeTokensValues } from '../types';
import { SubmitActionParams } from '../../../components/EdgeConfirmAction/types';
import { TrxResponsePaidBundles } from '../../../api/fio';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: TrxResponsePaidBundles) => void;
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

  const stake = async ({ keys, data }: SubmitActionParams) => {
    const result = await apis.fio.executeAction(keys, ACTIONS.stakeFioTokens, {
      amount: apis.fio.amountToSUF(data.amount),
      fioAddress: data.fioAddress,
      maxFee: fee,
      technologyProviderId: data.proxy,
    });
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
      data={sendData}
      submitAction={stake}
      fioWalletEdgeId={fioWallet.edgeId || ''}
      edgeAccountLogoutBefore={true}
    />
  );
};

export default StakeTokensEdgeWallet;
