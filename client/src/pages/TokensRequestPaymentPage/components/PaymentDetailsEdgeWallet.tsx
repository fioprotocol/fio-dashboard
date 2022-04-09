import React from 'react';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import apis from '../../../api';

import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';

import { FioWalletDoublet } from '../../../types';
import { PaymentDetailsValues, TxValues } from '../types';
import { SubmitActionParams } from '../../../components/EdgeConfirmAction/types';
import { ACTIONS } from '../../../constants/fio';
import { camelizeObjKeys } from '../../../utils';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: TxValues & { error?: string }) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  sendData: PaymentDetailsValues | null;
  contactsList: string[];
  createContact: (name: string) => void;
  processing: boolean;
};

const PaymentDetailsEdgeWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    sendData,
    processing,
    createContact,
    contactsList,
  } = props;

  const send = async ({ keys, data }: SubmitActionParams) => {
    const result = await apis.fio.executeAction(keys, ACTIONS.recordObtData, {
      payerFioAddress: data.payerFioAddress,
      payeeFioAddress: data.payeeFioAddress,
      payerTokenPublicAddress: keys.public,
      payeeTokenPublicAddress: data.payeePublicAddress,
      payeeFioPublicKey: data.payeeFioPublicKey,
      amount: Number(data.amount),
      chainCode: data.chainCode,
      tokenCode: data.tokenCode,
      obtId: data.obtId,
      memo: data.memo,
      fioRequestId: data.fioRequestId,
    });

    if (!contactsList.filter(c => c === data.payeeFioAddress).length)
      createContact(data.payeeFioAddress);

    return camelizeObjKeys(result);
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

export default PaymentDetailsEdgeWallet;
