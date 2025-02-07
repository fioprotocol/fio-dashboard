import React, { useCallback, useState, useEffect } from 'react';

import { Account, Action } from '@fioprotocol/fiosdk';

import {
  MetamaskConfirmAction,
  OnSuccessResponseResult,
} from '../../MetamaskConfirmAction';

import MathOp from '../../../util/math';
import { makeRegistrationOrder } from '../middleware';
import apis from '../../../api';

import {
  DEFAULT_MAX_FEE_MULTIPLE_AMOUNT,
  TRANSACTION_DEFAULT_OFFSET_EXPIRATION_MS,
} from '../../../constants/fio';
import {
  PAYMENT_PROVIDER,
  PURCHASE_RESULTS_STATUS,
} from '../../../constants/purchase';
import {
  CART_ITEM_TYPE,
  CONFIRM_METAMASK_ACTION,
  DEFAULT_BUNDLE_SET_VALUE,
  WALLET_CREATED_FROM,
} from '../../../constants/common';

import {
  RegistrationType,
  GroupedPurchaseValues,
  PurchaseValues,
} from '../types';
import { ActionParams } from '../../../types/fio';
import { RegistrationResult } from '../../../types';
import { FIO_ADDRESS_DELIMITER } from '../../../utils';

const DEFAULT_OFFSET_TO_EXISTING_TRANSACTION_MS = 10 * 1000;

const TRANSACTION_OFFSET_TO_EXISTING_TRANSACTION_MS =
  DEFAULT_OFFSET_TO_EXISTING_TRANSACTION_MS +
  TRANSACTION_DEFAULT_OFFSET_EXPIRATION_MS;

type Props = {
  analyticsData: PurchaseValues;
  ownerFioPublicKey: string;
  processing: boolean;
  groupedPurchaseValues: GroupedPurchaseValues[];
  onSuccess: (result: RegistrationResult) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
};

export const PurchaseMetamaskWallet: React.FC<Props> = props => {
  const {
    analyticsData,
    ownerFioPublicKey,
    groupedPurchaseValues,
    processing,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const metamaskItems = groupedPurchaseValues.filter(
    groupedValue =>
      groupedValue.signInFioWallet.from === WALLET_CREATED_FROM.METAMASK,
  );

  const displayOrderItems = metamaskItems
    ?.map(metamaskItem => metamaskItem.submitData.displayOrderItems)
    .flat();

  const registrations = makeRegistrationOrder({
    displayOrderItems,
    fees: analyticsData?.prices?.nativeFio,
    isComboSupported: true,
  });

  const [actionParams, setActionParams] = useState<ActionParams[] | null>(null);
  const [registrationsIndexed, setRegistrationsIndexed] = useState<
    Array<RegistrationType & { indexId?: number }>
  >(null);

  const handlePurchaseResults = useCallback(
    (result: OnSuccessResponseResult) => {
      const registrationResult: RegistrationResult = {
        errors: [],
        registered: [],
        partial: [],
        paymentProvider: PAYMENT_PROVIDER.FIO,
        providerTxStatus: PURCHASE_RESULTS_STATUS.PAYMENT_PENDING,
      };

      if (Array.isArray(result)) {
        for (const resultItem of result) {
          if ('signatures' in resultItem) {
            const registrationItem = registrationsIndexed.find(
              registrationsIndexedItem =>
                registrationsIndexedItem.indexId === Number(resultItem.id),
            );

            registrationResult.registered.push({
              action: registrationItem.action,
              fioName: registrationItem.fioName,
              isFree: false,
              cartItemId: registrationItem.cartItemId,
              transaction_id: '',
              fee_collected: registrationItem.fee,
              data: {
                signedTx: resultItem,
                signingWalletPubKey:
                  registrationItem.signInFioWallet?.publicKey,
              },
            });
          }
        }
      }

      onSuccess({
        ...registrationResult,
        registered: registrationResult.registered.map(registeredItem => {
          delete registeredItem.data.signedTx.id;
          return registeredItem;
        }),
      });
    },
    [onSuccess, registrationsIndexed],
  );

  const handleRegistrationIndexedItems = useCallback(
    ({ registration, index }) => {
      setRegistrationsIndexed(prevRegIndexedItem => {
        if (prevRegIndexedItem) {
          return [...prevRegIndexedItem, { ...registration, indexId: index }];
        } else {
          return [{ ...registration, indexId: index }];
        }
      });
    },
    [],
  );

  const handleActionParams = useCallback(() => {
    const actionParamsArr: ActionParams[] = [];

    for (const [index, registration] of registrations.entries()) {
      if (!registration.isFree) {
        if (registration.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN) {
          const [address, domain] = registration.fioName.split(
            FIO_ADDRESS_DELIMITER,
          );

          const hasAdditionalHandlesOnDomain = registrations.some(
            registrationItem => {
              const [itemAddress, itemDomain] = registrationItem.fioName.split(
                FIO_ADDRESS_DELIMITER,
              );
              return itemDomain === domain && itemAddress !== address;
            },
          );

          const fioAddressActionParams = {
            action: registration.isCombo
              ? Action.regDomainAddress
              : Action.regAddress,
            account: Account.address,
            data: {
              owner_fio_public_key: ownerFioPublicKey,
              fio_address: registration.fioName,
              is_public: 0,
              tpid: apis.fio.affiliateTpid,
              max_fee: new MathOp(registration.fee)
                .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
                .round(0)
                .toNumber(),
            },
            derivationIndex:
              registration.signInFioWallet?.data?.derivationIndex,
            timeoutOffset: hasAdditionalHandlesOnDomain
              ? TRANSACTION_OFFSET_TO_EXISTING_TRANSACTION_MS
              : TRANSACTION_DEFAULT_OFFSET_EXPIRATION_MS,
            id: index,
          };

          handleRegistrationIndexedItems({ registration, index });

          actionParamsArr.push(fioAddressActionParams);
        } else if (registration.type === CART_ITEM_TYPE.ADD_BUNDLES) {
          const hasTheSameItem = registrations.some(
            registrationItem =>
              registrationItem.fioName === registration.fioName &&
              registrationItem.cartItemId !== registration.cartItemId &&
              registrationItem.type === CART_ITEM_TYPE.ADD_BUNDLES,
          );

          const addBundlesActionParams = {
            action: Action.addBundledTransactions,
            account: Account.address,
            data: {
              fio_address: registration.fioName,
              bundle_sets: DEFAULT_BUNDLE_SET_VALUE,
              tpid: apis.fio.tpid,
              max_fee: new MathOp(registration.fee)
                .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
                .round(0)
                .toNumber(),
            },
            derivationIndex:
              registration.signInFioWallet?.data?.derivationIndex,
            timeoutOffset: hasTheSameItem
              ? TRANSACTION_OFFSET_TO_EXISTING_TRANSACTION_MS
              : TRANSACTION_DEFAULT_OFFSET_EXPIRATION_MS,
            id: index,
          };

          handleRegistrationIndexedItems({ registration, index });

          actionParamsArr.push(addBundlesActionParams);
        } else if (registration.type === CART_ITEM_TYPE.DOMAIN) {
          const hasTheSameItem = registrations.some(
            registrationItem =>
              registrationItem.fioName === registration.fioName &&
              registrationItem.iteration > 0 &&
              registrationItem.type === CART_ITEM_TYPE.DOMAIN_RENEWAL,
          );

          const fioDomainActionParams = {
            action: Action.regDomain,
            account: Account.address,
            data: {
              fio_domain: registration.fioName,
              owner_fio_public_key: ownerFioPublicKey,
              tpid: apis.fio.affiliateTpid,
              max_fee: new MathOp(registration.fee)
                .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
                .round(0)
                .toNumber(),
            },
            derivationIndex:
              registration.signInFioWallet?.data?.derivationIndex,
            timeoutOffset: hasTheSameItem
              ? TRANSACTION_OFFSET_TO_EXISTING_TRANSACTION_MS
              : TRANSACTION_DEFAULT_OFFSET_EXPIRATION_MS,
            id: index,
          };

          handleRegistrationIndexedItems({ registration, index });

          actionParamsArr.push(fioDomainActionParams);
        } else if (registration.type === CART_ITEM_TYPE.DOMAIN_RENEWAL) {
          const hasTheSameItem = registrations.some(
            registrationItem =>
              registrationItem.fioName === registration.fioName &&
              registrationItem.iteration > 0 &&
              registrationItem.type === CART_ITEM_TYPE.DOMAIN_RENEWAL,
          );

          const fioDomainRenewActionParams = {
            action: Action.renewDomain,
            account: Account.address,
            data: {
              fio_domain: registration.fioName,
              tpid: apis.fio.tpid,
              max_fee: new MathOp(registration.fee)
                .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
                .round(0)
                .toNumber(),
            },
            derivationIndex:
              registration.signInFioWallet?.data?.derivationIndex,
            timeoutOffset: hasTheSameItem
              ? TRANSACTION_OFFSET_TO_EXISTING_TRANSACTION_MS
              : TRANSACTION_DEFAULT_OFFSET_EXPIRATION_MS,
            id: index,
          };

          handleRegistrationIndexedItems({ registration, index });

          actionParamsArr.push(fioDomainRenewActionParams);
        } else {
          const fioHandleActionParams = {
            action: Action.regAddress,
            account: Account.address,
            data: {
              owner_fio_public_key: ownerFioPublicKey,
              fio_address: registration.fioName,
              tpid: apis.fio.affiliateTpid,
              max_fee: new MathOp(registration.fee)
                .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
                .round(0)
                .toNumber(),
            },
            derivationIndex:
              registration.signInFioWallet?.data?.derivationIndex,
            timeoutOffset: TRANSACTION_DEFAULT_OFFSET_EXPIRATION_MS,
            id: index,
          };

          handleRegistrationIndexedItems({ registration, index });

          actionParamsArr.push(fioHandleActionParams);
        }
      }
    }

    setActionParams(actionParamsArr);
  }, [ownerFioPublicKey, handleRegistrationIndexedItems, registrations]);

  const onCancelAction = useCallback(() => {
    setActionParams(null);

    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  useEffect(() => {
    if (metamaskItems?.length > 0 && !actionParams) {
      handleActionParams();
    }
  }, [actionParams, handleActionParams, metamaskItems?.length]);

  if (!metamaskItems?.length && !actionParams) return null;

  return (
    <MetamaskConfirmAction
      analyticAction={CONFIRM_METAMASK_ACTION.PURCHASE}
      analyticsData={{ ...analyticsData, displayOrderItems }}
      actionParams={actionParams}
      processing={processing}
      setProcessing={setProcessing}
      onCancel={onCancelAction}
      onSuccess={handlePurchaseResults}
      returnOnlySignedTxn
    />
  );
};
