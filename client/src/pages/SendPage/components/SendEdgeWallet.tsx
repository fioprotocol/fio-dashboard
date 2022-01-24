import React from 'react';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import apis from '../../../api';

import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';
import { DEFAULT_ACTION_FEE_AMOUNT } from '../../../api/fio';

import { FioWalletDoublet } from '../../../types';
import { SendTokensValues } from '../types';
import { SubmitActionParams } from '../../../components/EdgeConfirmAction/types';
import { ACTIONS, FIO_CHAIN_CODE } from '../../../constants/fio';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: any) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  sendData: SendTokensValues | null;
  contactsList: string[];
  createContact: (name: string) => void;
  processing: boolean;
  fee: number;
};

const SendEdgeWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    sendData,
    fee,
    processing,
    createContact,
    contactsList,
  } = props;

  const send = async ({ keys, data }: SubmitActionParams) => {
    const result = await apis.fio.executeAction(keys, ACTIONS.transferTokens, {
      payeeFioPublicKey: data.to,
      amount: data.amount,
      maxFee: fee,
    });
    if (data.memo) {
      try {
        await apis.fio.executeAction(keys, ACTIONS.recordObtData, {
          payerFioAddress: data.from,
          payeeFioAddress: data.receiverFioAddress,
          payerTokenPublicAddress: keys.public,
          payeeTokenPublicAddress: data.to,
          amount: apis.fio.sufToAmount(data.amount),
          chainCode: FIO_CHAIN_CODE,
          tokenCode: FIO_CHAIN_CODE,
          obtId: result.transaction_id,
          payeeFioPublicKey: data.to,
          memo: data.memo,
          maxFee: DEFAULT_ACTION_FEE_AMOUNT,
        });
      } catch (e) {
        console.error(e);
      }
    }

    if (
      data.receiverFioAddress != null &&
      !contactsList.filter(c => c === data.receiverFioAddress).length
    )
      createContact(data.receiverFioAddress);

    return result;
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

export default SendEdgeWallet;
