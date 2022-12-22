import React from 'react';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';
import { arrayToHex } from '@fioprotocol/fiojs/dist/chain-numeric';
import { Ecc } from '@fioprotocol/fiojs';

import LedgerConnect from '../../../components/LedgerConnect';

import { CONFIRM_LEDGER_ACTIONS } from '../../../constants/common';
import {
  ACTIONS,
  BUNDLES_TX_COUNT,
  FIO_CHAIN_CODE,
} from '../../../constants/fio';

import apis from '../../../api';
import { prepareChainTransaction } from '../../../util/fio';
import { formatLedgerSignature, getPath } from '../../../util/ledger';
import { log } from '../../../util/general';
import MathOp from '../../../util/math';

import { FioWalletDoublet } from '../../../types';
import { SendTokensValues } from '../types';
import { TrxResponsePaidBundles } from '../../../api/fio';

type Props = {
  sendData: SendTokensValues | null;
  fioWallet: FioWalletDoublet;
  onSuccess: (data: TrxResponsePaidBundles) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  contactsList: string[];
  createContact: (name: string) => void;
  processing: boolean;
  fee: number;
  feeRecordObtData?: number | null;
};

const SendLedgerWallet: React.FC<Props> = props => {
  const {
    sendData,
    fioWallet,
    onSuccess,
    onCancel,
    fee,
    feeRecordObtData,
    setProcessing,
    createContact,
    contactsList,
  } = props;

  const send = async (appFio: LedgerFioApp) => {
    const { chainId, transaction } = await prepareChainTransaction(
      fioWallet.publicKey,
      ACTIONS.transferTokens,
      {
        payee_public_key: sendData.toPubKey,
        amount: new MathOp(sendData.nativeAmount).toNumber(),
        max_fee: fee,
        tpid: apis.fio.tpid,
      },
    );

    const {
      witness: { witnessSignatureHex },
    } = await appFio.signTransaction({
      path: getPath(fioWallet.data.derivationIndex),
      chainId,
      tx: transaction,
    });
    const signatureLedger = formatLedgerSignature(witnessSignatureHex);

    const {
      serializedTransaction,
      serializedContextFreeData,
    } = await apis.fio.publicFioSDK.transactions.serialize({
      chainId,
      transaction,
    });

    const result = await apis.fio.publicFioSDK.executePreparedTrx(
      apis.fio.actionEndPoints.transferTokens,
      {
        compression: 0,
        packed_context_free_data: arrayToHex(
          serializedContextFreeData || new Uint8Array(0),
        ),
        packed_trx: arrayToHex(serializedTransaction),
        signatures: [signatureLedger],
      },
    );
    if (!!sendData.to && !contactsList.filter(c => c === sendData.to).length)
      createContact(sendData.to);

    let obtError = null;
    let bundlesCollected = 0;
    if (sendData.memo || sendData.fioRequestId) {
      try {
        const { chainId, transaction } = await prepareChainTransaction(
          fioWallet.publicKey,
          ACTIONS.recordObtData,
          {
            payer_fio_address: sendData.from,
            payee_fio_address: sendData.to,
            other_public_key: Ecc.PublicKey(sendData.toPubKey)
              .toUncompressed()
              .toBuffer()
              .toString('hex'),
            payer_public_address: fioWallet.publicKey,
            payee_public_address: sendData.toPubKey,
            amount: sendData.amount,
            chain_code: FIO_CHAIN_CODE,
            token_code: FIO_CHAIN_CODE,
            obt_id: result.transaction_id,
            memo: sendData.memo,
            status: 'sent_to_blockchain',
            fio_request_id: sendData.fioRequestId
              ? sendData.fioRequestId.toString()
              : '',
            max_fee: feeRecordObtData || 0,
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

        await apis.fio.publicFioSDK.executePreparedTrx(
          apis.fio.actionEndPoints.recordObtData,
          {
            compression: 0,
            packed_context_free_data: arrayToHex(
              serializedContextFreeData || new Uint8Array(0),
            ),
            packed_trx: arrayToHex(serializedTransaction),
            signatures: [signatureLedger],
          },
        );
        bundlesCollected = BUNDLES_TX_COUNT.RECORD_OBT_DATA;
      } catch (e) {
        log.error(e);
        obtError = e;
      }
    }

    return { ...result, obtError, bundlesCollected };
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
