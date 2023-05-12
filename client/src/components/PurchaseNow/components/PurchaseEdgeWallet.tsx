import React from 'react';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import { makeRegistrationOrder } from '../middleware';
import { sleep } from '../../../utils';

import {
  CART_ITEM_TYPE,
  CONFIRM_PIN_ACTIONS,
  DEFAULT_BUNDLE_SET_VALUE,
} from '../../../constants/common';
import {
  PAYMENT_PROVIDER,
  PURCHASE_RESULTS_STATUS,
} from '../../../constants/purchase';
import apis from '../../../api';
import {
  ACTIONS,
  TRANSACTION_DEFAULT_OFFSET_EXPIRATION,
} from '../../../constants/fio';

import { FioWalletDoublet, RegistrationResult } from '../../../types';
import { SubmitActionParams } from '../../EdgeConfirmAction/types';
import { PurchaseValues } from '../types';
import { SignedTxArgs } from '../../../api/fio';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (results: RegistrationResult) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: PurchaseValues | null;
  processing: boolean;
  fee?: number | null;
};

const TIME_TO_WAIT_BEFORE_DEPENDED_REGISTRATION = 5000;

const PurchaseEdgeWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    submitData,
    processing,
  } = props;

  const submit = async ({ keys, data }: SubmitActionParams) => {
    const { cartItems, prices, isFreeAllowed } = data;

    const result: RegistrationResult = {
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
    if (keys.private) {
      apis.fio.setWalletFioSdk(keys);
    }
    for (const registration of registrations) {
      if (!registration.isFree) {
        apis.fio.walletFioSDK.setSignedTrxReturnOption(true);
        let signedTx: SignedTxArgs;
        if (registration.type === CART_ITEM_TYPE.ADD_BUNDLES) {
          signedTx = await apis.fio.walletFioSDK.genericAction(
            ACTIONS.addBundledTransactions,
            {
              fioAddress: registration.fioName,
              bundleSets: DEFAULT_BUNDLE_SET_VALUE,
              maxFee: registration.fee,
              tpid: apis.fio.tpid,
              expirationOffset: TRANSACTION_DEFAULT_OFFSET_EXPIRATION,
            },
          );
        } else if (registration.type === CART_ITEM_TYPE.DOMAIN_RENEWAL) {
          if (registration.iteration === 2) {
            await sleep(TIME_TO_WAIT_BEFORE_DEPENDED_REGISTRATION); // Add timeout to aviod the same sign tx hash for more than 2 years domain renew
          }
          signedTx = await apis.fio.walletFioSDK.genericAction(
            ACTIONS.renewFioDomain,
            {
              fioDomain: registration.fioName,
              maxFee: registration.fee,
              tpid: apis.fio.tpid,
              expirationOffset: TRANSACTION_DEFAULT_OFFSET_EXPIRATION,
            },
          );
        } else if (registration.type === CART_ITEM_TYPE.DOMAIN) {
          signedTx = await apis.fio.walletFioSDK.genericAction(
            ACTIONS.registerFioDomain,
            {
              fioDomain: registration.fioName,
              maxFee: registration.fee,
              technologyProviderId: apis.fio.domainTpid,
              expirationOffset: TRANSACTION_DEFAULT_OFFSET_EXPIRATION,
            },
          );
        } else {
          signedTx = await apis.fio.walletFioSDK.genericAction(
            ACTIONS.registerFioAddress,
            {
              fioAddress: registration.fioName,
              maxFee: registration.fee,
              tpid: apis.fio.tpid,
              expirationOffset: TRANSACTION_DEFAULT_OFFSET_EXPIRATION,
            },
          );
        }

        result.registered.push({
          fioName: registration.fioName,
          isFree: false,
          cartItemId: registration.cartItemId,
          transaction_id: '',
          fee_collected: registration.fee,
          data: {
            signedTx,
            signingWalletPubKey: keys.public,
          },
        });
      }
    }
    if (keys.private) {
      apis.fio.clearWalletFioSdk();
    }

    return result;
  };

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.PURCHASE}
      setProcessing={setProcessing}
      onSuccess={onSuccess}
      onCancel={onCancel}
      processing={processing}
      data={submitData}
      submitAction={submit}
      fioWalletEdgeId={fioWallet.edgeId || ''}
      edgeAccountLogoutBefore
    />
  );
};

export default PurchaseEdgeWallet;
