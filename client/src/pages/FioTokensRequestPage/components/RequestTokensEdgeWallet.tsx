import React from 'react';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import apis from '../../../api';

import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';
import { ACTIONS } from '../../../constants/fio';

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
  createContact: (name: string) => void;
  contactsList: string[];
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
    createContact,
    contactsList,
  } = props;

  const send = async ({ keys, data }: SubmitActionParams) => {
    const params: RequestProps = {
      ...data,
      amount: Number(data.amount),
    };

    const result = await apis.fio.executeAction(
      keys,
      ACTIONS.requestFunds,
      params,
    );

    if (!contactsList.filter(c => c === params.payerFioAddress).length)
      createContact(params.payerFioAddress);

    return result;
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
