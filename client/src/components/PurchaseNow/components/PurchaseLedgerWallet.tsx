import React from 'react';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';
import { arrayToHex } from '@fioprotocol/fiojs/dist/chain-numeric';

import LedgerConnect from '../../../components/LedgerConnect';

import {
  CART_ITEM_TYPE,
  CONFIRM_LEDGER_ACTIONS,
  DEFAULT_BUNDLE_SET_VALUE,
} from '../../../constants/common';
import { ACTIONS } from '../../../constants/fio';
import {
  PAYMENT_PROVIDER,
  PURCHASE_RESULTS_STATUS,
} from '../../../constants/purchase';

import { prepareChainTransaction } from '../../../util/fio';
import { formatLedgerSignature, getPath } from '../../../util/ledger';
import { makeRegistrationOrder } from '../middleware';
import { isDomain } from '../../../utils';

import apis from '../../../api';

import {
  AnyObject,
  FioWalletDoublet,
  RegistrationResult,
} from '../../../types';
import { PurchaseValues } from '../types';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (results: RegistrationResult) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: PurchaseValues | null;
  processing: boolean;
  fee: number;
};

const PurchaseLedgerWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    submitData,
    processing,
  } = props;

  const submit = async (appFio: LedgerFioApp) => {
    const { cartItems, prices, isFreeAllowed } = submitData;

    const results: RegistrationResult = {
      errors: [],
      registered: [],
      partial: [],
      paymentProvider: PAYMENT_PROVIDER.FIO,
      providerTxStatus: PURCHASE_RESULTS_STATUS.PAYMENT_PENDING,
    };
    const registrations = makeRegistrationOrder(
      [...cartItems],
      prices.nativeFio,
      isFreeAllowed,
    );
    for (const registration of registrations) {
      if (!registration.isFree) {
        const isDomainRegistration = isDomain(registration.fioName);
        let action: string;
        let data: AnyObject = {};
        if (registration.type === CART_ITEM_TYPE.ADD_BUNDLES) {
          action = ACTIONS.addBundledTransactions;
          data = {
            fio_address: registration.fioName,
            bundle_sets: DEFAULT_BUNDLE_SET_VALUE,
            tpid: apis.fio.tpid,
          };
        } else if (registration.type === CART_ITEM_TYPE.DOMAIN_RENEWAL) {
          action = ACTIONS.renewFioDomain;
          data = {
            fio_domain: registration.fioName,
            tpid: apis.fio.tpid,
          };
        } else {
          action = isDomainRegistration
            ? ACTIONS.registerFioDomain
            : ACTIONS.registerFioAddress;
          data = {
            [isDomainRegistration
              ? 'fio_domain'
              : 'fio_address']: registration.fioName,
            owner_fio_public_key: fioWallet.publicKey,
            tpid: isDomainRegistration ? apis.fio.domainTpid : apis.fio.tpid,
          };
        }

        const { chainId, transaction } = await prepareChainTransaction(
          fioWallet.publicKey,
          action,
          {
            ...data,
            max_fee: registration.fee,
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

        results.registered.push({
          fioName: registration.fioName,
          isFree: false,
          cartItemId: registration.cartItemId,
          transaction_id: '',
          fee_collected: registration.fee,
          data: {
            signedTx: {
              compression: 0,
              packed_context_free_data: arrayToHex(
                serializedContextFreeData || new Uint8Array(0),
              ),
              packed_trx: arrayToHex(serializedTransaction),
              signatures: [signatureLedger],
            },
            signingWalletPubKey: fioWallet.publicKey,
          },
        });
      }
    }

    return results;
  };

  if (!submitData) return null;

  return (
    <LedgerConnect
      action={CONFIRM_LEDGER_ACTIONS.PURCHASE}
      data={submitData}
      fioWallet={fioWallet}
      onConnect={submit}
      onSuccess={onSuccess}
      onCancel={onCancel}
      setProcessing={setProcessing}
      isTransaction={processing}
      hideConnectionModal={processing}
    />
  );
};

export default PurchaseLedgerWallet;
