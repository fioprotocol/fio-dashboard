import React from 'react';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import apis from '../../../api';

import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';

import { FioWalletDoublet } from '../../../types';
import { RequestTokensValues } from '../types';
import { SubmitActionParams } from '../../../components/EdgeConfirmAction/types';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: any) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  requestData: RequestTokensValues | null;
  processing: boolean;
};

type RequestProps = {
  payerFioAddress: string;
  payeeFioAddress: string;
  payeeTokenPublicAddress: string;
  amount: number;
  chainCode: string;
  tokenCode: string;
  memo: string;
  payerFioPublicKey?: string;
  hash?: string;
  offlineUrl?: string;
};

const RequestTokensEdgeWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    requestData,
    processing,
  } = props;

  const send = async ({ keys, data }: SubmitActionParams) => {
    const params: RequestProps = {
      ...data,
      amount: apis.fio.sufToAmount(data.amount),
    };
    return apis.fio.executeAction(keys, 'requestFunds', params);
  };

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.SEND}
      setProcessing={setProcessing}
      onSuccess={onSuccess}
      onCancel={onCancel}
      processing={processing}
      data={requestData}
      submitAction={send}
      fioWalletEdgeId={fioWallet.edgeId || ''}
      edgeAccountLogoutBefore={true}
    />
  );
};

export default RequestTokensEdgeWallet;
