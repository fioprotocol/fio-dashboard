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
  onSuccess: (data: TrxResponsePaidBundles) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: SubmitData | null;
  processing: boolean;
  createContact: (name: string) => void;
  contactsList: string[];
};

export const VoteBlockProducerEdgeWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    submitData,
    processing,
  } = props;

  const send = async ({ keys, data }: SubmitActionParams) => {
    apis.fio.setWalletFioSdk(keys);

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
      action={CONFIRM_PIN_ACTIONS.VOTE_PRODUCER}
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
