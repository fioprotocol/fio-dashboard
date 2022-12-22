import React from 'react';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';
import { arrayToHex } from '@fioprotocol/fiojs/dist/chain-numeric';
import isEmpty from 'lodash/isEmpty';

import LedgerConnect from '../../../components/LedgerConnect';

import {
  CART_ITEM_TYPE,
  CONFIRM_LEDGER_ACTIONS,
  DEFAULT_BUNDLE_SET_VALUE,
  REF_PROFILE_TYPE,
} from '../../../constants/common';
import { ACTIONS } from '../../../constants/fio';
import {
  PAYMENT_PROVIDER,
  PURCHASE_RESULTS_STATUS,
} from '../../../constants/purchase';
import { ERROR_TYPES } from '../../../constants/errors';

import { prepareChainTransaction } from '../../../util/fio';
import { formatLedgerSignature, getPath } from '../../../util/ledger';
import {
  handleResponses,
  makeRegistrationOrder,
  registerFree,
  wait,
  setTxStatus,
} from '../middleware';
import { log } from '../../../util/general';
import { isDomain } from '../../../utils';

import apis from '../../../api';

import {
  AnyObject,
  FioWalletDoublet,
  RegistrationResult,
} from '../../../types';
import { PurchaseValues, RegistrationType } from '../types';

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
    const { cartItems, prices, refProfileInfo, isFreeAllowed } = submitData;

    const results: RegistrationResult = {
      errors: [],
      registered: [],
      partial: [],
      paymentProvider: PAYMENT_PROVIDER.FIO,
      providerTxStatus: PURCHASE_RESULTS_STATUS.PENDING,
    };
    const registrations = makeRegistrationOrder(
      [...cartItems],
      prices.nativeFio,
      isFreeAllowed,
    );
    const register = async (registration: RegistrationType) => {
      if (!registration.isFree) {
        let result: {
          cartItemId: string;
          fioName: string;
          error?: string;
          errorType?: string;
        } = {
          cartItemId: registration.cartItemId,
          fioName: registration.fioName,
        };
        try {
          const isDomainRegistration = isDomain(registration.fioName);
          let action: string;
          let endPoint: string;
          let data: AnyObject = {};
          if (registration.type === CART_ITEM_TYPE.ADD_BUNDLES) {
            endPoint = apis.fio.actionEndPoints.addBundledTransactions;
            action = ACTIONS.addBundledTransactions;
            data = {
              fio_address: registration.fioName,
              bundle_sets: DEFAULT_BUNDLE_SET_VALUE,
            };
          } else if (registration.type === CART_ITEM_TYPE.DOMAIN_RENEWAL) {
            action = ACTIONS.renewFioDomain;
            endPoint = apis.fio.actionEndPoints.renewFioDomain;
            data = {
              fio_domain: registration.fioName,
            };
          } else {
            action = isDomainRegistration
              ? ACTIONS.registerFioDomain
              : ACTIONS.registerFioAddress;
            endPoint = isDomainRegistration
              ? apis.fio.actionEndPoints.registerFioDomain
              : apis.fio.actionEndPoints.registerFioAddress;
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
              tpid: data.tpid || process.env.REACT_APP_DEFAULT_TPID || '',
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

          const res = await apis.fio.publicFioSDK.executePreparedTrx(endPoint, {
            compression: 0,
            packed_context_free_data: arrayToHex(
              serializedContextFreeData || new Uint8Array(0),
            ),
            packed_trx: arrayToHex(serializedTransaction),
            signatures: [signatureLedger],
          });

          if (!res) {
            throw new Error('Server Error');
          }

          result = { ...result, ...res };
        } catch (e) {
          log.error(e.json);
          result.error = apis.fio.extractError(e.json) || e.message;
          result.errorType = e.errorType || ERROR_TYPES.default;
        }

        handleResponses(
          [{ value: result, status: result.error ? 'rejected' : 'fulfilled' }],
          results,
        );
      } else {
        await registerFree({
          ...registration,
          publicKey: fioWallet.publicKey,
          refCode:
            refProfileInfo != null &&
            refProfileInfo?.type === REF_PROFILE_TYPE.REF
              ? refProfileInfo.code
              : '',
          verifyParams: {},
        });
      }
    };

    let hasDepended = false;
    for (const registration of registrations) {
      if (registration.depended) {
        hasDepended = true;
        continue;
      }

      await register(registration);
    }
    if (hasDepended) {
      await wait();
      for (const registration of registrations) {
        if (registration.depended) {
          await register(registration);
        }
      }
    }

    results.providerTxStatus = setTxStatus(
      !isEmpty(results.registered),
      !isEmpty(results.errors),
    );

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
