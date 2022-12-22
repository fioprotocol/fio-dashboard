import React from 'react';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';
import { arrayToHex } from '@fioprotocol/fiojs/dist/chain-numeric';

import LedgerConnect from '../../../components/LedgerConnect';

import { CONFIRM_LEDGER_ACTIONS } from '../../../constants/common';
import { ACTIONS } from '../../../constants/fio';

import { prepareChainTransaction } from '../../../util/fio';
import { formatLedgerSignature, getPath } from '../../../util/ledger';

import apis from '../../../api';

import { FioWalletDoublet } from '../../../types';
import { AddBundlesValues } from '../types';
import { TrxResponsePaidBundles } from '../../../api/fio';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: TrxResponsePaidBundles) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: AddBundlesValues | null;
  processing: boolean;
  fee: number;
};

const AddBundlesLedgerWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    submitData,
    fee,
    processing,
  } = props;

  const submit = async (appFio: LedgerFioApp) => {
    const { chainId, transaction } = await prepareChainTransaction(
      fioWallet.publicKey,
      ACTIONS.addBundledTransactions,
      {
        fio_address: submitData.fioAddress,
        bundle_sets: submitData.bundleSets,
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

    return await apis.fio.publicFioSDK.executePreparedTrx(
      apis.fio.actionEndPoints.addBundledTransactions,
      {
        compression: 0,
        packed_context_free_data: arrayToHex(
          serializedContextFreeData || new Uint8Array(0),
        ),
        packed_trx: arrayToHex(serializedTransaction),
        signatures: [signatureLedger],
      },
    );
  };

  if (!submitData) return null;

  return (
    <LedgerConnect
      action={CONFIRM_LEDGER_ACTIONS.ADD_BUNDLES}
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

export default AddBundlesLedgerWallet;
