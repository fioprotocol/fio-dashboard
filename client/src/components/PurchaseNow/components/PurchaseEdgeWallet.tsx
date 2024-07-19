import React from 'react';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import { makeRegistrationOrder } from '../middleware';
import { sleep } from '../../../utils';
import MathOp from '../../../util/math';

import {
  CART_ITEM_TYPE,
  CONFIRM_PIN_ACTIONS,
  DEFAULT_BUNDLE_SET_VALUE,
  WALLET_CREATED_FROM,
} from '../../../constants/common';
import {
  PAYMENT_PROVIDER,
  PURCHASE_RESULTS_STATUS,
} from '../../../constants/purchase';
import apis from '../../../api';
import {
  ACTIONS,
  DEFAULT_MAX_FEE_MULTIPLE_AMOUNT,
  TRANSACTION_DEFAULT_OFFSET_EXPIRATION,
} from '../../../constants/fio';

import { RegistrationResult } from '../../../types';
import { SubmitActionParams } from '../../EdgeConfirmAction/types';
import { GroupedPurchaseValues, PurchaseValues } from '../types';
import { SignedTxArgs } from '../../../api/fio';

type Props = {
  analyticsData: PurchaseValues;
  ownerFioPublicKey?: string;
  groupedPurchaseValues: GroupedPurchaseValues[];
  onSuccess: (results: RegistrationResult) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  processing: boolean;
  fee?: number | null;
};

const DEFAULT_TIME_TO_WAIT_BEFORE_SIMILAR_TRANSACTIONS = 1000;

const PurchaseEdgeWallet: React.FC<Props> = props => {
  const {
    analyticsData,
    ownerFioPublicKey,
    groupedPurchaseValues,
    setProcessing,
    onSuccess,
    onCancel,
    processing,
  } = props;

  const edgeItems = groupedPurchaseValues.filter(
    groupedValue =>
      groupedValue.signInFioWallet.from === WALLET_CREATED_FROM.EDGE,
  );

  const cartItems = edgeItems
    ?.map(edgeItem => edgeItem.submitData.cartItems)
    .flat();

  const submit = async ({
    allWalletKeysInAccount,
    data,
  }: SubmitActionParams) => {
    const { cartItems, prices } = data;

    const result: RegistrationResult = {
      errors: [],
      registered: [],
      partial: [],
      paymentProvider: PAYMENT_PROVIDER.FIO,
      providerTxStatus: PURCHASE_RESULTS_STATUS.PAYMENT_PENDING,
    };

    const registrations = makeRegistrationOrder({
      cartItems,
      fees: prices?.nativeFio,
      isComboSupported: true,
    });

    for (const registration of registrations) {
      const walletEdgeId = registration.signInFioWallet?.edgeId;
      const existingFioWalletInEdgeAccount =
        walletEdgeId && allWalletKeysInAccount[walletEdgeId];

      existingFioWalletInEdgeAccount?.private &&
        apis.fio.setWalletFioSdk(existingFioWalletInEdgeAccount);

      if (!registration.isFree) {
        apis.fio.walletFioSDK.setSignedTrxReturnOption(true);
        let signedTx: SignedTxArgs;
        if (registration.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN) {
          signedTx = await apis.fio.walletFioSDK.genericAction(
            registration.isCombo
              ? ACTIONS.registerFioDomainAddress
              : ACTIONS.registerFioAddress,
            {
              fioAddress: registration.fioName,
              maxFee: new MathOp(registration.fee)
                .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
                .round(0)
                .toNumber(),
              technologyProviderId: apis.fio.tpid,
              expirationOffset: TRANSACTION_DEFAULT_OFFSET_EXPIRATION,
            },
          );
        } else if (registration.type === CART_ITEM_TYPE.ADD_BUNDLES) {
          const hasTheSameItem = registrations.some(
            registrationItem =>
              registrationItem.fioName === registration.fioName &&
              registrationItem.cartItemId !== registration.cartItemId &&
              registrationItem.type === CART_ITEM_TYPE.ADD_BUNDLES,
          );

          if (hasTheSameItem) {
            await sleep(DEFAULT_TIME_TO_WAIT_BEFORE_SIMILAR_TRANSACTIONS);
          }

          signedTx = await apis.fio.walletFioSDK.genericAction(
            ACTIONS.addBundledTransactions,
            {
              fioAddress: registration.fioName,
              bundleSets: DEFAULT_BUNDLE_SET_VALUE,
              maxFee: new MathOp(registration.fee)
                .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
                .round(0)
                .toNumber(),
              technologyProviderId: apis.fio.tpid,
              expirationOffset: TRANSACTION_DEFAULT_OFFSET_EXPIRATION,
            },
          );
        } else if (registration.type === CART_ITEM_TYPE.DOMAIN) {
          const hasTheSameItem = registrations.some(
            registrationItem =>
              registrationItem.fioName === registration.fioName &&
              registrationItem.iteration > 0 &&
              registrationItem.type === CART_ITEM_TYPE.DOMAIN_RENEWAL,
          );

          if (hasTheSameItem) {
            await sleep(DEFAULT_TIME_TO_WAIT_BEFORE_SIMILAR_TRANSACTIONS); // Add timeout to aviod the same sign tx hash for more than 2 years domain renew
          }

          signedTx = await apis.fio.walletFioSDK.genericAction(
            ACTIONS.registerFioDomain,
            {
              fioDomain: registration.fioName,
              maxFee: new MathOp(registration.fee)
                .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
                .round(0)
                .toNumber(),
              technologyProviderId: apis.fio.domainTpid,
              expirationOffset: TRANSACTION_DEFAULT_OFFSET_EXPIRATION,
              ownerPublicKey: ownerFioPublicKey,
            },
          );
        } else if (registration.type === CART_ITEM_TYPE.DOMAIN_RENEWAL) {
          const hasTheSameItem = registrations.some(
            registrationItem =>
              registrationItem.fioName === registration.fioName &&
              registrationItem.iteration > 0 &&
              registrationItem.type === CART_ITEM_TYPE.DOMAIN_RENEWAL,
          );

          if (hasTheSameItem) {
            await sleep(DEFAULT_TIME_TO_WAIT_BEFORE_SIMILAR_TRANSACTIONS); // Add timeout to aviod the same sign tx hash for more than 2 years domain renew
          }

          signedTx = await apis.fio.walletFioSDK.genericAction(
            ACTIONS.renewFioDomain,
            {
              fioDomain: registration.fioName,
              maxFee: new MathOp(registration.fee)
                .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
                .round(0)
                .toNumber(),
              technologyProviderId: apis.fio.tpid,
              expirationOffset: TRANSACTION_DEFAULT_OFFSET_EXPIRATION,
            },
          );
        } else {
          signedTx = await apis.fio.walletFioSDK.genericAction(
            ACTIONS.registerFioAddress,
            {
              fioAddress: registration.fioName,
              maxFee: new MathOp(registration.fee)
                .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
                .round(0)
                .toNumber(),
              technologyProviderId: apis.fio.tpid,
              ownerPublicKey: ownerFioPublicKey,
              expirationOffset: TRANSACTION_DEFAULT_OFFSET_EXPIRATION,
            },
          );
        }

        result.registered.push({
          action: registration.action,
          fioName: registration.fioName,
          isFree: false,
          cartItemId: registration.cartItemId,
          transaction_id: '',
          fee_collected: registration.fee,
          data: {
            signedTx,
            signingWalletPubKey: existingFioWalletInEdgeAccount.public,
          },
        });
      }
    }

    apis.fio.clearWalletFioSdk();

    return result;
  };

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.PURCHASE}
      setProcessing={setProcessing}
      onSuccess={onSuccess}
      onCancel={onCancel}
      processing={processing}
      data={{ ...analyticsData, cartItems }}
      submitAction={submit}
      edgeAccountLogoutBefore
    />
  );
};

export default PurchaseEdgeWallet;
