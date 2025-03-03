import React from 'react';

import { GenericAction } from '@fioprotocol/fiosdk';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import apis from '../../../api';

import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';

import { FioWalletDoublet } from '../../../types';
import { PaymentDetailsValues, TxValues } from '../types';
import { SubmitActionParams } from '../../../components/EdgeConfirmAction/types';
import { camelizeObjKeys } from '../../../utils';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: TxValues & { error?: string }) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: PaymentDetailsValues | null;
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
    submitData,
    processing,
    createContact,
    contactsList,
  } = props;

  const send = async ({ keys, data }: SubmitActionParams) => {
    const result = await apis.fio.executeAction(
      keys,
      GenericAction.recordObtData,
      {
        payerFioAddress: data.payerFioAddress,
        payeeFioAddress: data.payeeFioAddress,
        payerTokenPublicAddress: keys.public,
        payeeTokenPublicAddress: data.payeePublicAddress,
        payeeFioPublicKey: data.payeeFioPublicKey,
        amount: data.amount,
        chainCode: data.chainCode,
        tokenCode: data.tokenCode,
        obtId: data.obtId,
        memo: data.memo,
        fioRequestId: data.fioRequestId,
      },
    );

    if (!contactsList?.filter(c => c === data.payeeFioAddress).length)
      createContact(data.payeeFioAddress);

    return camelizeObjKeys(result);
  };

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.PAYMENT_DETAILS}
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

export default PaymentDetailsEdgeWallet;
