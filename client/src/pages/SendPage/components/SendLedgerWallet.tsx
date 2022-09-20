import React from 'react';
import {
  SignTransactionRequest,
  Fio as LedgerFioApp,
} from 'ledgerjs-hw-app-fio/dist/fio';

import LedgerConnect from '../../../components/LedgerConnect';

import { CONFIRM_LEDGER_ACTIONS } from '../../../constants/common';

import apis from '../../../api';
import {
  RawTransaction,
  TrxData,
  TrxResponsePaidBundles,
} from '../../../api/fio';
import { serializeTransaction } from '../../../util/fio';
import { formatLedgerSignature, getPath } from '../../../util/ledger';

import { FioWalletDoublet } from '../../../types';
import { SendTokensValues } from '../types';

type Props = {
  sendData: SendTokensValues | null;
  fioWallet: FioWalletDoublet;
  onSuccess: (data: TrxResponsePaidBundles) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  processing: boolean;
  fee: number;
};

const SendLedgerWallet: React.FC<Props> = props => {
  const {
    sendData,
    fioWallet,
    onSuccess,
    onCancel,
    fee,
    setProcessing,
  } = props;

  const send = async (appFio: LedgerFioApp) => {
    const {
      trx,
      chainId,
      actor,
      authorization,
    }: TrxData = await apis.fio.getDataForTx(fioWallet.publicKey);
    const { account, name, data } = apis.fio.getTransferTokensAction(
      sendData.toPubKey,
      sendData.nativeAmount,
      fee,
    );

    const basicTx: RawTransaction = {
      ...trx,
      actions: [
        {
          account,
          name,
          authorization,
          data: {
            ...data,
            actor,
          },
        },
      ],
    };
    const packedTx = await serializeTransaction(basicTx);

    const signTransactionRequest: SignTransactionRequest = {
      path: getPath(fioWallet.data.derivationIndex),
      chainId,
      tx: basicTx,
    };
    const { witness } = await appFio.signTransaction(signTransactionRequest);
    const signatureLedger = formatLedgerSignature(witness.witnessSignatureHex);

    return await apis.fio.publicFioSDK.executePreparedTrx(
      apis.fio.actionEndPoints.transferTokens,
      {
        compression: 0,
        packed_context_free_data: '',
        packed_trx: packedTx,
        signatures: [signatureLedger],
      },
    );
  };

  if (!sendData) return null;

  return (
    <LedgerConnect
      action={CONFIRM_LEDGER_ACTIONS.SEND}
      data={sendData}
      fioWallet={fioWallet}
      onConnect={send}
      onSuccess={onSuccess}
      onCancel={onCancel}
      setProcessing={setProcessing}
      isTransaction={true}
    />
  );
};

export default SendLedgerWallet;
