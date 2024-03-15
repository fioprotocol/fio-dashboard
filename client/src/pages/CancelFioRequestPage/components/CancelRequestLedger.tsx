import React from 'react';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';
import { arrayToHex } from '@fioprotocol/fiojs/dist/chain-numeric';

import LedgerConnect from '../../../components/LedgerConnect';

import { CONFIRM_LEDGER_ACTIONS } from '../../../constants/common';
import { ACTIONS } from '../../../constants/fio';

import { prepareChainTransaction } from '../../../util/fio';
import { formatLedgerSignature, getPath } from '../../../util/ledger';
import { log } from '../../../util/general';

import apis from '../../../api';

import { FioWalletDoublet } from '../../../types';
import { FioRecordViewDecrypted } from '../../WalletPage/types';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: FioRecordViewDecrypted & { error?: string }) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: FioRecordViewDecrypted | null;
  processing: boolean;
  fee: number;
};

const CancelRequestLedger: React.FC<Props> = props => {
  const {
    fee,
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    submitData,
    processing,
  } = props;

  const submit = async (appFio: LedgerFioApp) => {
    let error;
    try {
      const { chainId, transaction } = await prepareChainTransaction(
        fioWallet.publicKey,
        ACTIONS.cancelFundsRequest,
        {
          fio_request_id: submitData.fioRecord.id
            ? submitData.fioRecord.id.toString()
            : '',
          max_fee: fee || 0,
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
        apis.fio.actionEndPoints.cancelFundsRequest,
        {
          compression: 0,
          packed_context_free_data: arrayToHex(
            serializedContextFreeData || new Uint8Array(0),
          ),
          packed_trx: arrayToHex(serializedTransaction),
          signatures: [signatureLedger],
        },
      );
      submitData.fioDecryptedContent.obtId = result.transaction_id;
    } catch (err) {
      log.error(err);
      error = err;
    }

    return { ...submitData, error };
  };

  if (!submitData) return null;

  return (
    <LedgerConnect
      action={CONFIRM_LEDGER_ACTIONS.CANCEL_FIO_REQUEST}
      data={submitData}
      fioWallet={fioWallet}
      onConnect={submit}
      onSuccess={onSuccess}
      onCancel={onCancel}
      setProcessing={setProcessing}
      isTransaction={processing}
    />
  );
};

export default CancelRequestLedger;
