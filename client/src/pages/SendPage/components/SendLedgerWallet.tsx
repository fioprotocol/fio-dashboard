import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';
import { arrayToHex } from '@fioprotocol/fiojs/dist/chain-numeric';
import { Ecc } from '@fioprotocol/fiojs';

import { FC, useEffect, useState } from 'react';

import { EndPoint, GenericAction } from '@fioprotocol/fiosdk';

import LedgerConnect from '../../../components/LedgerConnect';

import { CONFIRM_LEDGER_ACTIONS } from '../../../constants/common';
import { BUNDLES_TX_COUNT, FIO_CHAIN_CODE } from '../../../constants/fio';

import apis from '../../../api';
import { prepareChainTransaction } from '../../../util/fio';
import { formatLedgerSignature, getPath } from '../../../util/ledger';
import { log } from '../../../util/general';
import MathOp from '../../../util/math';

import { FioWalletDoublet } from '../../../types';
import { SendTokensValues } from '../types';
import {
  TrxResponse,
  TrxResponsePaidBundles,
  trxResponseTransform,
} from '../../../api/fio';

type Props = {
  fioWallet: FioWalletDoublet;
  fee: string;
  processing: boolean;
  submitData: SendTokensValues | null;
  createContact: (name: string) => void;
  onCancel: () => void;
  onSuccess: (data: TrxResponsePaidBundles) => void;
  setProcessing: (processing: boolean) => void;
};

const SendLedgerWallet: FC<Props> = props => {
  const {
    fioWallet,
    fee,
    submitData,
    createContact,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const [result, setResult] = useState<TrxResponse>();

  useEffect(() => {
    setResult(undefined);
  }, [submitData]);

  const send = async (appFio: LedgerFioApp) => {
    const { chainId, transaction } = await prepareChainTransaction(
      fioWallet.publicKey,
      GenericAction.transferTokens,
      {
        payee_public_key: submitData.toPubKey,
        amount: new MathOp(submitData.nativeAmount).toString(),
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
      EndPoint.transferTokensPublicKey,
      {
        compression: 0,
        packed_context_free_data: arrayToHex(
          serializedContextFreeData || new Uint8Array(0),
        ),
        packed_trx: arrayToHex(serializedTransaction),
        signatures: [signatureLedger],
      },
    );

    setResult(trxResponseTransform(result));

    if (
      !!submitData?.to &&
      !submitData?.contactsList?.filter(c => c === submitData.to).length
    ) {
      createContact(submitData.to);
    }

    let obtError = null;
    let bundlesCollected = 0;

    if (submitData.memo || submitData.fioRequestId) {
      try {
        const { chainId, transaction } = await prepareChainTransaction(
          fioWallet.publicKey,
          GenericAction.recordObtData,
          {
            payer_fio_address: submitData.from,
            payee_fio_address: submitData.to,
            other_public_key: Ecc.PublicKey(submitData.toPubKey)
              .toUncompressed()
              .toBuffer()
              .toString('hex'),
            payer_public_address: fioWallet.publicKey,
            payee_public_address: submitData.toPubKey,
            amount: submitData.amount,
            chain_code: FIO_CHAIN_CODE,
            token_code: FIO_CHAIN_CODE,
            obt_id: result.transaction_id,
            memo: submitData.memo,
            status: 'sent_to_blockchain',
            fio_request_id: submitData.fioRequestId
              ? submitData.fioRequestId.toString()
              : '',
            max_fee: submitData?.feeRecordObtData || 0,
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

        await apis.fio.publicFioSDK.executePreparedTrx(EndPoint.recordObtData, {
          compression: 0,
          packed_context_free_data: arrayToHex(
            serializedContextFreeData || new Uint8Array(0),
          ),
          packed_trx: arrayToHex(serializedTransaction),
          signatures: [signatureLedger],
        });
        bundlesCollected = BUNDLES_TX_COUNT.RECORD_OBT_DATA;
      } catch (e) {
        log.error(e);
        obtError = e;
      }
    }

    return { ...result, obtError, bundlesCollected };
  };

  if (!submitData) return null;

  return (
    <LedgerConnect
      action={CONFIRM_LEDGER_ACTIONS.SEND}
      result={result}
      data={submitData}
      fee={fee}
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
