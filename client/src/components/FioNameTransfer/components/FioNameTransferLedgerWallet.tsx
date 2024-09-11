import React from 'react';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';
import { arrayToHex } from '@fioprotocol/fiojs/dist/chain-numeric';

import { EndPoint } from '@fioprotocol/fiosdk';

import LedgerConnect from '../../../components/LedgerConnect';

import { CONFIRM_LEDGER_ACTIONS, DOMAIN } from '../../../constants/common';
import { ACTIONS } from '../../../constants/fio';

import { prepareChainTransaction } from '../../../util/fio';
import { formatLedgerSignature, getPath } from '../../../util/ledger';

import apis from '../../../api';

import { FioWalletDoublet } from '../../../types';
import { FioNameTransferValues } from '../types';
import { TrxResponsePaidBundles } from '../../../api/fio';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: TrxResponsePaidBundles) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: FioNameTransferValues | null;
  processing: boolean;
  fee: number;
};

const FioNameTransferLedgerWallet: React.FC<Props> = props => {
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
    const { fioNameType, name, newOwnerPublicKey } = submitData;

    const { chainId, transaction } = await prepareChainTransaction(
      fioWallet.publicKey,
      fioNameType === DOMAIN
        ? ACTIONS.transferFioDomain
        : ACTIONS.transferFioAddress,
      {
        [fioNameType === DOMAIN ? 'fio_domain' : 'fio_address']: name,
        new_owner_fio_public_key: newOwnerPublicKey,
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
      fioNameType === DOMAIN
        ? (apis.fio.actionEndPoints.transferFioDomain as EndPoint)
        : (apis.fio.actionEndPoints.transferFioAddress as EndPoint),
      {
        compression: 0,
        packed_context_free_data: arrayToHex(
          serializedContextFreeData || new Uint8Array(0),
        ),
        packed_trx: arrayToHex(serializedTransaction),
        signatures: [signatureLedger],
      },
    );

    return { ...result, newOwnerKey: newOwnerPublicKey };
  };

  if (!submitData) return null;

  return (
    <LedgerConnect
      action={CONFIRM_LEDGER_ACTIONS.TRANSFER}
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

export default FioNameTransferLedgerWallet;
