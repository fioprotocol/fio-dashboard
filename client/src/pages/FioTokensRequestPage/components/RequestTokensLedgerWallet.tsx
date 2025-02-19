import React from 'react';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';
import { arrayToHex } from '@fioprotocol/fiojs/dist/chain-numeric';
import { Ecc } from '@fioprotocol/fiojs';

import { EndPoint, GenericAction } from '@fioprotocol/fiosdk';

import LedgerConnect from '../../../components/LedgerConnect';

import { CONFIRM_LEDGER_ACTIONS } from '../../../constants/common';
import { BUNDLES_TX_COUNT, FIO_CHAIN_CODE } from '../../../constants/fio';

import { prepareChainTransaction } from '../../../util/fio';
import { formatLedgerSignature, getPath } from '../../../util/ledger';
import { linkTokensLedger } from '../../../api/middleware/fio';
import { log } from '../../../util/general';

import apis from '../../../api';

import { FioWalletDoublet } from '../../../types';
import { RequestTokensValues } from '../types';
import { TrxResponsePaidBundles } from '../../../api/fio';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: TrxResponsePaidBundles) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: RequestTokensValues | null;
  processing: boolean;
  fee: string;
  createContact: (name: string) => void;
  contactsList: string[];
};

const RequestTokensLedgerWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    fee,
    setProcessing,
    onSuccess,
    onCancel,
    submitData,
    processing,
    createContact,
    contactsList,
  } = props;

  const submit = async (appFio: LedgerFioApp) => {
    const {
      public_address: payerPublicAddress,
    } = await apis.fio.getFioPublicAddress(submitData.payerFioAddress);
    const { chainId, transaction } = await prepareChainTransaction(
      fioWallet.publicKey,
      GenericAction.requestFunds,
      {
        payer_fio_address: submitData.payerFioAddress,
        payee_fio_address: submitData.payeeFioAddress,
        other_public_key: Ecc.PublicKey(payerPublicAddress)
          .toUncompressed()
          .toBuffer()
          .toString('hex'),
        payee_public_address: fioWallet.publicKey,
        amount: submitData.amount,
        chain_code: submitData.chainCode,
        token_code: submitData.tokenCode,
        memo: submitData.memo,
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
      EndPoint.newFundsRequest,
      {
        compression: 0,
        packed_context_free_data: arrayToHex(
          serializedContextFreeData || new Uint8Array(0),
        ),
        packed_trx: arrayToHex(serializedTransaction),
        signatures: [signatureLedger],
      },
    );
    let mapError;
    let bundlesCollected = BUNDLES_TX_COUNT.NEW_FIO_REQUEST;

    if (submitData.mapPubAddress && submitData.chainCode !== FIO_CHAIN_CODE) {
      try {
        await linkTokensLedger({
          connectList: [
            {
              publicAddress: submitData.payeeTokenPublicAddress,
              chainCode: submitData.chainCode,
              tokenCode: submitData.tokenCode,
            },
          ],
          fioAddress: submitData.payeeFioAddress,
          fioWallet,
          appFio,
        });
        bundlesCollected += BUNDLES_TX_COUNT.ADD_PUBLIC_ADDRESS;
      } catch (e) {
        log.error(e);
        mapError = e;
      }
    }

    if (!contactsList?.filter(c => c === submitData.payerFioAddress).length)
      createContact && createContact(submitData.payerFioAddress);

    return {
      ...result,
      bundlesCollected,
      mapError,
      mapPubAddress: submitData.mapPubAddress,
    };
  };

  if (!submitData) return null;

  return (
    <LedgerConnect
      action={CONFIRM_LEDGER_ACTIONS.REQUEST}
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

export default RequestTokensLedgerWallet;
