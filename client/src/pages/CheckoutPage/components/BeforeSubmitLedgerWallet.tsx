import React from 'react';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';
import { arrayToHex } from '@fioprotocol/fiojs/dist/chain-numeric';

import { GenericAction } from '@fioprotocol/fiosdk';

import LedgerConnect from '../../../components/LedgerConnect';

import {
  CONFIRM_LEDGER_ACTIONS,
  WALLET_CREATED_FROM,
} from '../../../constants/common';

import { prepareChainTransaction } from '../../../util/fio';
import { formatLedgerSignature, getPath } from '../../../util/ledger';

import apis from '../../../api';

import { BeforeSubmitData, BeforeSubmitProps } from '../types';

const BeforeSubmitLedgerWallet: React.FC<BeforeSubmitProps> = props => {
  const {
    fee,
    groupedBeforeSubmitValues,
    processing,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const ledgerItemsGroups = groupedBeforeSubmitValues.filter(
    groupedValue =>
      groupedValue.signInFioWallet.from === WALLET_CREATED_FROM.LEDGER,
  );

  const fioAddressItems = ledgerItemsGroups
    ?.map(ledgerItem => ledgerItem.submitData.fioAddressItems)
    .flat();

  const submit = async (appFio: LedgerFioApp) => {
    const signedTxs: BeforeSubmitData = {};

    for (const item of fioAddressItems) {
      const { chainId, transaction } = await prepareChainTransaction(
        item.fioWallet?.publicKey,
        GenericAction.registerFioAddress,
        {
          fio_address: item.name,
          owner_fio_public_key: item.ownerKey,
          max_fee: fee,
          tpid: apis.fio.tpid,
        },
      );

      const {
        witness: { witnessSignatureHex },
      } = await appFio.signTransaction({
        path: getPath(item.fioWallet?.data?.derivationIndex),
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

      signedTxs[item.name] = {
        signedTx: {
          compression: 0,
          packed_context_free_data: arrayToHex(
            serializedContextFreeData || new Uint8Array(0),
          ),
          packed_trx: arrayToHex(serializedTransaction),
          signatures: [signatureLedger],
        },
        signingWalletPubKey: item.fioWallet.publicKey,
      };
    }

    return signedTxs;
  };

  if (!ledgerItemsGroups.length) return null;

  return (
    <LedgerConnect
      action={CONFIRM_LEDGER_ACTIONS.REGISTER_ADDRESS_PRIVATE_DOMAIN}
      data={{ fioAddressItems }}
      fee={fee}
      fioWalletsForCheck={ledgerItemsGroups.map(
        ledgerItem => ledgerItem.signInFioWallet,
      )}
      onConnect={submit}
      onSuccess={onSuccess}
      onCancel={onCancel}
      setProcessing={setProcessing}
      isTransaction={processing}
    />
  );
};

export default BeforeSubmitLedgerWallet;
