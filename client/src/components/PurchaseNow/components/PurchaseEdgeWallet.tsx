import React from 'react';

import { GenericAction } from '@fioprotocol/fiosdk';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import { makeRegistrationOrder } from '../middleware';
import { defaultMaxFee } from '../../../util/prices';
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
import { TRANSACTION_DEFAULT_OFFSET_EXPIRATION } from '../../../constants/fio';

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
  fee?: string | null;
};

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

  const displayOrderItems = edgeItems
    ?.map(edgeItem => edgeItem.submitData.displayOrderItems)
    .flat();

  const submit = async ({
    allWalletKeysInAccount,
    data,
  }: SubmitActionParams) => {
    const { displayOrderItems, prices } = data;

    const result: RegistrationResult = {
      errors: [],
      registered: [],
      partial: [],
      paymentProvider: PAYMENT_PROVIDER.FIO,
      providerTxStatus: PURCHASE_RESULTS_STATUS.PAYMENT_PENDING,
    };

    const registrations = makeRegistrationOrder({
      displayOrderItems,
      fees: prices?.nativeFio,
      isComboSupported: true,
    });

    for (const [index, registration] of registrations.entries()) {
      const walletEdgeId = registration.signInFioWallet?.edgeId;
      const existingFioWalletInEdgeAccount =
        walletEdgeId && allWalletKeysInAccount[walletEdgeId];

      existingFioWalletInEdgeAccount?.private &&
        (await apis.fio.setWalletFioSdk(existingFioWalletInEdgeAccount));

      const expirationOffset = new MathOp(TRANSACTION_DEFAULT_OFFSET_EXPIRATION)
        .add(index)
        .toNumber();

      if (!registration.isFree) {
        apis.fio.walletFioSDK.setSignedTrxReturnOption(true);
        // TODO invalid types
        let signedTx: SignedTxArgs;
        if (registration.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN) {
          signedTx = ((await apis.fio.walletFioSDK.genericAction(
            registration.isCombo
              ? GenericAction.registerFioDomainAddress
              : GenericAction.registerFioAddress,
            {
              fioAddress: registration.fioName,
              maxFee: defaultMaxFee(registration.fee, {
                retNum: true,
              }) as number,
              technologyProviderId: apis.fio.affiliateTpid,
              expirationOffset,
            },
          )) as unknown) as SignedTxArgs;
        } else if (registration.type === CART_ITEM_TYPE.ADD_BUNDLES) {
          signedTx = ((await apis.fio.walletFioSDK.genericAction(
            GenericAction.addBundledTransactions,
            {
              fioAddress: registration.fioName,
              bundleSets: DEFAULT_BUNDLE_SET_VALUE,
              maxFee: defaultMaxFee(registration.fee, {
                retNum: true,
              }) as number,
              technologyProviderId: apis.fio.tpid,
              expirationOffset,
            },
          )) as unknown) as SignedTxArgs;
        } else if (registration.type === CART_ITEM_TYPE.DOMAIN) {
          signedTx = ((await apis.fio.walletFioSDK.genericAction(
            GenericAction.registerFioDomain,
            {
              fioDomain: registration.fioName,
              maxFee: defaultMaxFee(registration.fee, {
                retNum: true,
              }) as number,
              technologyProviderId: apis.fio.affiliateTpid,
              expirationOffset,
              ownerPublicKey: ownerFioPublicKey,
            },
          )) as unknown) as SignedTxArgs;
        } else if (registration.type === CART_ITEM_TYPE.DOMAIN_RENEWAL) {
          signedTx = ((await apis.fio.walletFioSDK.genericAction(
            GenericAction.renewFioDomain,
            {
              fioDomain: registration.fioName,
              maxFee: defaultMaxFee(registration.fee, {
                retNum: true,
              }) as number,
              technologyProviderId: apis.fio.tpid,
              expirationOffset,
            },
          )) as unknown) as SignedTxArgs;
        } else {
          signedTx = ((await apis.fio.walletFioSDK.genericAction(
            GenericAction.registerFioAddress,
            {
              fioAddress: registration.fioName,
              maxFee: defaultMaxFee(registration.fee, {
                retNum: true,
              }) as number,
              technologyProviderId: apis.fio.affiliateTpid,
              ownerPublicKey: ownerFioPublicKey,
              expirationOffset,
            },
          )) as unknown) as SignedTxArgs;
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
      data={analyticsData ? { ...analyticsData, displayOrderItems } : null}
      submitAction={submit}
      edgeAccountLogoutBefore
    />
  );
};

export default PurchaseEdgeWallet;
