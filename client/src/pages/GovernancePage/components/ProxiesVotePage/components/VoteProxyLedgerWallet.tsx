import React from 'react';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';
import { arrayToHex } from '@fioprotocol/fiojs/dist/chain-numeric';
import { EndPoint } from '@fioprotocol/fiosdk';

import LedgerConnect from '../../../../../components/LedgerConnect';

import { CONFIRM_LEDGER_ACTIONS } from '../../../../../constants/common';
import {
  AdditionalAction,
  FIO_ENDPOINT_NAME,
  FIO_ENDPOINT_TAG_NAME,
} from '../../../../../constants/fio';

import { prepareChainTransaction } from '../../../../../util/fio';
import { formatLedgerSignature, getPath } from '../../../../../util/ledger';

import apis from '../../../../../api';

import { TrxResponsePaidBundles } from '../../../../../api/fio';
import { FioWalletDoublet } from '../../../../../types';

import { SubmitData } from '../types';

type Props = {
  fioWallet: FioWalletDoublet;
  fee: number;
  processing: boolean;
  submitData: SubmitData | null;
  onCancel: () => void;
  onSuccess: (data: TrxResponsePaidBundles) => void;
  setProcessing: (processing: boolean) => void;
};

export const VoteProxyLedgerWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    fee,
    processing,
    submitData,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const submit = async (appFio: LedgerFioApp) => {
    const { chainId, transaction } = await prepareChainTransaction(
      fioWallet.publicKey,
      AdditionalAction.voteProxy,
      submitData.data,
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
      FIO_ENDPOINT_NAME[FIO_ENDPOINT_TAG_NAME.voteProxy] as EndPoint, // TODO: Remove as EndPoint after adding to FIO SDK
      {
        compression: 0,
        packed_context_free_data: arrayToHex(
          serializedContextFreeData || new Uint8Array(0),
        ),
        packed_trx: arrayToHex(serializedTransaction),
        signatures: [signatureLedger],
      },
    );

    return result;
  };

  if (!submitData) return null;

  return (
    <LedgerConnect
      action={CONFIRM_LEDGER_ACTIONS.VOTE_PROXY}
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