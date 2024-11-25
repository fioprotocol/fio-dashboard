import React, { useCallback } from 'react';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';
import { arrayToHex } from '@fioprotocol/fiojs/dist/chain-numeric';

import { GenericAction } from '@fioprotocol/fiosdk';

import LedgerConnect from '../../../components/LedgerConnect';

import {
  CART_ITEM_TYPE,
  CONFIRM_LEDGER_ACTIONS,
  DEFAULT_BUNDLE_SET_VALUE,
  WALLET_CREATED_FROM,
} from '../../../constants/common';
import {
  PAYMENT_PROVIDER,
  PURCHASE_RESULTS_STATUS,
} from '../../../constants/purchase';

import { prepareChainTransaction } from '../../../util/fio';
import { formatLedgerSignature, getPath } from '../../../util/ledger';
import { makeRegistrationOrder } from '../middleware';

import apis from '../../../api';

import { AnyObject, RegistrationResult } from '../../../types';
import { GroupedPurchaseValues, PurchaseValues } from '../types';

type Props = {
  analyticsData: PurchaseValues;
  ownerFioPublicKey?: string;
  groupedPurchaseValues: GroupedPurchaseValues[];
  onSuccess: (results: RegistrationResult) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  processing: boolean;
  fee?: number;
};

const PurchaseLedgerWallet: React.FC<Props> = props => {
  const {
    analyticsData,
    ownerFioPublicKey,
    groupedPurchaseValues,
    onSuccess,
    onCancel,
    setProcessing,
    processing,
    fee,
  } = props;

  const ledgerItemsGroups = groupedPurchaseValues.filter(
    groupedValue =>
      groupedValue.signInFioWallet.from === WALLET_CREATED_FROM.LEDGER,
  );

  const cartItems = ledgerItemsGroups
    ?.map(ledgerItem => ledgerItem.submitData.cartItems)
    .flat();

  const submit = useCallback(
    async (appFio: LedgerFioApp) => {
      const { prices } = analyticsData;

      const results: RegistrationResult = {
        errors: [],
        registered: [],
        partial: [],
        paymentProvider: PAYMENT_PROVIDER.FIO,
        providerTxStatus: PURCHASE_RESULTS_STATUS.PAYMENT_PENDING,
      };

      const registrations = makeRegistrationOrder({
        cartItems,
        fees: prices.nativeFio,
      });

      for (const registration of registrations) {
        if (!registration.isFree) {
          let action: GenericAction;
          let data: AnyObject = {};

          if (registration.type === CART_ITEM_TYPE.ADD_BUNDLES) {
            action = GenericAction.addBundledTransactions;
            data = {
              fio_address: registration.fioName,
              bundle_sets: DEFAULT_BUNDLE_SET_VALUE,
              tpid: apis.fio.tpid,
            };
          } else if (registration.type === CART_ITEM_TYPE.DOMAIN_RENEWAL) {
            action = GenericAction.renewFioDomain;
            data = {
              fio_domain: registration.fioName,
              tpid: apis.fio.tpid,
            };
          } else if (registration.type === CART_ITEM_TYPE.DOMAIN) {
            action = GenericAction.registerFioDomain;
            data = {
              fio_domain: registration.fioName,
              owner_fio_public_key: ownerFioPublicKey,
              tpid: apis.fio.affiliateTpid,
            };
          } else if (registration.type === CART_ITEM_TYPE.ADDRESS) {
            action = GenericAction.registerFioAddress;
            data = {
              fio_address: registration.fioName,
              owner_fio_public_key: ownerFioPublicKey,
              tpid: apis.fio.affiliateTpid,
            };
          }

          const { chainId, transaction } = await prepareChainTransaction(
            registration.signInFioWallet.publicKey,
            action,
            {
              ...data,
              max_fee: registration.fee,
            },
          );

          const {
            witness: { witnessSignatureHex },
          } = await appFio.signTransaction({
            path: getPath(registration.signInFioWallet.data.derivationIndex),
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
            action: registration.action,
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
              signingWalletPubKey: registration.signInFioWallet.publicKey,
            },
          });
        }
      }

      return results;
    },
    [ownerFioPublicKey, analyticsData, cartItems],
  );

  if (!analyticsData) return null;

  return (
    <LedgerConnect
      action={CONFIRM_LEDGER_ACTIONS.PURCHASE}
      data={{ ...analyticsData, cartItems }}
      fee={fee}
      ownerFioPublicKey={ownerFioPublicKey}
      fioWalletsForCheck={ledgerItemsGroups.map(it => it.signInFioWallet)}
      onConnect={submit}
      onSuccess={onSuccess}
      onCancel={onCancel}
      setProcessing={setProcessing}
      isTransaction={processing}
    />
  );
};

export default PurchaseLedgerWallet;
