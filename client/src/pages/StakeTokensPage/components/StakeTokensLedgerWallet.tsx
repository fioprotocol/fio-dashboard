import React from 'react';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';
import { arrayToHex } from '@fioprotocol/fiojs/dist/chain-numeric';

import { EndPoint, GenericAction } from '@fioprotocol/fiosdk';

import LedgerConnect from '../../../components/LedgerConnect';

import { CONFIRM_LEDGER_ACTIONS } from '../../../constants/common';

import apis from '../../../api';
import { TrxResponsePaidBundles } from '../../../api/fio';
import { prepareChainTransaction } from '../../../util/fio';
import { formatLedgerSignature, getPath } from '../../../util/ledger';

import { FioWalletDoublet } from '../../../types';
import { StakeTokensValues } from '../types';
import { BUNDLES_TX_COUNT } from '../../../constants/fio';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: TrxResponsePaidBundles) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: StakeTokensValues | null;
  processing: boolean;
  fee: string;
};

const StakeTokensLedgerWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    submitData,
    fee,
    processing,
  } = props;

  const stake = async (appFio: LedgerFioApp) => {
    const { chainId, transaction } = await prepareChainTransaction(
      fioWallet.publicKey,
      GenericAction.stakeFioTokens,
      {
        amount: apis.fio.amountToSUF(submitData.amount),
        fio_address: submitData.fioAddress,
        max_fee: fee,
        tpid: submitData.proxy,
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
      EndPoint.pushTransaction,
      {
        compression: 0,
        packed_context_free_data: arrayToHex(
          serializedContextFreeData || new Uint8Array(0),
        ),
        packed_trx: arrayToHex(serializedTransaction),
        signatures: [signatureLedger],
      },
    );

    return {
      ...result,
      bundlesCollected: result.fee_collected ? 0 : BUNDLES_TX_COUNT.STAKE,
    };
  };

  if (!submitData) return null;

  return (
    <LedgerConnect
      action={CONFIRM_LEDGER_ACTIONS.STAKE}
      data={submitData}
      fee={fee}
      fioWallet={fioWallet}
      onConnect={stake}
      onSuccess={onSuccess}
      onCancel={onCancel}
      setProcessing={setProcessing}
      isTransaction={processing}
    />
  );
};

export default StakeTokensLedgerWallet;
