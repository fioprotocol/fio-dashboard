import React from 'react';
import { GenericAction } from '@fioprotocol/fiosdk';

import EdgeConfirmAction from '../../../../../components/EdgeConfirmAction';

import apis from '../../../../../api';

import { CONFIRM_PIN_ACTIONS } from '../../../../../constants/common';

import { SubmitActionParams } from '../../../../../components/EdgeConfirmAction/types';
import { TrxResponsePaidBundles } from '../../../../../api/fio';
import { FioWalletDoublet } from '../../../../../types';
import { SubmitData } from '../types';

type Props = {
  fioWallet: FioWalletDoublet;
  processing: boolean;
  submitData: SubmitData | null;
  onSuccess: (data: TrxResponsePaidBundles) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
};

export const VoteProxyEdgeWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    processing,
    submitData,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const send = async ({ keys, data }: SubmitActionParams) => {
    await apis.fio.setWalletFioSdk(keys);

    const result = await apis.fio.walletFioSDK.genericAction(
      GenericAction.pushTransaction,
      {
        action: data.action,
        account: data.account,
        data: data.data,
      },
    );

    apis.fio.clearWalletFioSdk();

    return result;
  };

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.VOTE_PROXY}
      setProcessing={setProcessing}
      onSuccess={onSuccess}
      onCancel={onCancel}
      processing={processing}
      data={submitData}
      submitAction={send}
      fioWalletEdgeId={fioWallet.edgeId || ''}
      edgeAccountLogoutBefore={true}
    />
  );
};
