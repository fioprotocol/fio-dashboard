import React from 'react';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';
import { arrayToHex } from '@fioprotocol/fiojs/dist/chain-numeric';
import { Ecc } from '@fioprotocol/fiojs';

import { EndPoint } from '@fioprotocol/fiosdk';

import LedgerConnect from '../../../components/LedgerConnect';

import { CONFIRM_LEDGER_ACTIONS } from '../../../constants/common';
import { ACTIONS, FIO_CHAIN_CODE } from '../../../constants/fio';

import { prepareChainTransaction } from '../../../util/fio';
import { formatLedgerSignature, getPath } from '../../../util/ledger';

import apis from '../../../api';

import { FioWalletDoublet } from '../../../types';
import { PaymentDetailsValues, TxValues } from '../types';
import { camelizeObjKeys } from '../../../utils';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: TxValues & { error?: string }) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: PaymentDetailsValues | null;
  processing: boolean;
  fee: number;
  contactsList: string[];
  createContact: (name: string) => void;
};

const PaymentDetailsLedgerWallet: React.FC<Props> = props => {
  const {
    fee,
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    submitData,
    processing,
    createContact,
    contactsList,
  } = props;

  const submit = async (appFio: LedgerFioApp) => {
    const { chainId, transaction } = await prepareChainTransaction(
      fioWallet.publicKey,
      ACTIONS.recordObtData,
      {
        payer_fio_address: submitData.payerFioAddress,
        payee_fio_address: submitData.payeeFioAddress,
        other_public_key: Ecc.PublicKey(submitData.payeePublicAddress)
          .toUncompressed()
          .toBuffer()
          .toString('hex'),
        payer_public_address: fioWallet.publicKey,
        payee_public_address: submitData.payeePublicAddress,
        amount: submitData.amount,
        chain_code: FIO_CHAIN_CODE,
        token_code: FIO_CHAIN_CODE,
        obt_id: submitData.obtId,
        memo: submitData.memo,
        status: 'sent_to_blockchain',
        fio_request_id: submitData.fioRequestId
          ? submitData.fioRequestId.toString()
          : '',
        max_fee: fee || 0,
        tpid: apis.fio.tpid,
      },
    );

    const {
      dhEncryptedData,
      witness: { witnessSignatureHex },
    } = await appFio.signTransaction({
      path: getPath(fioWallet.data.derivationIndex),
      chainId,
      tx: transaction,
    });
    const signatureLedger = formatLedgerSignature(witnessSignatureHex);
    transaction.actions[0].data.content = dhEncryptedData;

    const {
      serializedTransaction,
      serializedContextFreeData,
    } = await apis.fio.publicFioSDK.transactions.serialize({
      chainId,
      transaction,
    });

    const result = await apis.fio.publicFioSDK.executePreparedTrx(
      apis.fio.actionEndPoints.recordObtData as EndPoint,
      {
        compression: 0,
        packed_context_free_data: arrayToHex(
          serializedContextFreeData || new Uint8Array(0),
        ),
        packed_trx: arrayToHex(serializedTransaction),
        signatures: [signatureLedger],
      },
    );

    if (!contactsList?.filter(c => c === submitData.payeeFioAddress).length)
      createContact(submitData.payeeFioAddress);

    return camelizeObjKeys(result);
  };

  if (!submitData) return null;

  return (
    <LedgerConnect
      action={CONFIRM_LEDGER_ACTIONS.PAYMENT_DETAILS}
      data={submitData}
      fee={fee}
      fioWallet={fioWallet}
      onConnect={submit}
      onSuccess={onSuccess}
      onCancel={onCancel}
      setProcessing={setProcessing}
      isTransaction={processing}
    />
  );
};

export default PaymentDetailsLedgerWallet;
