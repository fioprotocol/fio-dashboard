import React, { useCallback, useState } from 'react';

import { useSelector } from 'react-redux';

import {
  MetamaskConfirmAction,
  OnSuccessResponseResult,
} from '../../../components/MetamaskConfirmAction';

import {
  ACTIONS,
  DEFAULT_MAX_FEE_MULTIPLE_AMOUNT,
  FIO_CONTRACT_ACCOUNT_NAMES,
  TRANSACTION_ACTION_NAMES,
  TRANSACTION_DEFAULT_OFFSET_EXPIRATION_MS,
} from '../../../constants/fio';
import {
  CART_ITEM_TYPE,
  CONFIRM_METAMASK_ACTION,
} from '../../../constants/common';

import apis from '../../../api';

import { ActionParams } from '../../../types/fio';
import useEffectOnce from '../../../hooks/general';
import MathOp from '../../../util/math';
import {
  BeforeSubmitData,
  BeforeSubmitProps,
  SignFioAddressItem,
} from '../types';
import { prices as pricesSelector } from '../../../redux/registrations/selectors';

export const BeforeSubmitMetamaskWallet: React.FC<BeforeSubmitProps> = props => {
  const {
    submitData,
    fioWallet,
    processing,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const prices = useSelector(pricesSelector);

  const { fioAddressItems } = submitData || {};
  const { publicKey, data: paymentWalletData } = fioWallet || {};

  const [actionParams, setActionParams] = useState<ActionParams[] | null>(null);
  const [indexedItems, setIndexedItems] = useState<
    Array<SignFioAddressItem & { indexId?: number }>
  >(null);

  const handleIndexedItems = useCallback(({ fioAddressItem, index }) => {
    setIndexedItems(prevIndexedItem => {
      if (prevIndexedItem) {
        return [...prevIndexedItem, { ...fioAddressItem, indexId: index }];
      } else {
        return [{ ...fioAddressItem, indexId: index }];
      }
    });
  }, []);

  const handleResult = useCallback(
    (result: OnSuccessResponseResult) => {
      if (!result) return;

      const signedTxs: BeforeSubmitData = {};

      if (Array.isArray(result)) {
        for (const resultItem of result) {
          if ('signatures' in resultItem) {
            const indexedItem = indexedItems.find(
              indexedItem => indexedItem.indexId === Number(resultItem.id),
            );

            delete resultItem.id;

            signedTxs[indexedItem.name] = {
              signedTx: resultItem,
              signingWalletPubKey: publicKey,
            };
          }
        }
        onSuccess(signedTxs);
      }
    },
    [indexedItems, onSuccess, publicKey],
  );

  useEffectOnce(
    () => {
      const actionParamsArr = [];
      for (const [index, fioAddressItem] of fioAddressItems.entries()) {
        const isComboRegistration =
          !fioAddressItem.cartItem.hasCustomDomainInCart &&
          fioAddressItem.cartItem.type ===
            CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN;
        const fioHandleActionParams = {
          action:
            TRANSACTION_ACTION_NAMES[
              isComboRegistration
                ? ACTIONS.registerFioDomainAddress
                : ACTIONS.registerFioAddress
            ],
          account: FIO_CONTRACT_ACCOUNT_NAMES.fioAddress,
          data: {
            owner_fio_public_key: fioAddressItem.ownerKey,
            fio_address: fioAddressItem.name,
            is_public: 0,
            tpid: apis.fio.tpid,
            max_fee: new MathOp(
              isComboRegistration
                ? prices.nativeFio.combo
                : prices.nativeFio.address,
            )
              .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
              .round(0)
              .toNumber(),
          },
          derivationIndex: paymentWalletData?.derivationIndex,
          timeoutOffset: TRANSACTION_DEFAULT_OFFSET_EXPIRATION_MS,
          id: index,
        };

        handleIndexedItems({ fioAddressItem, index });

        actionParamsArr.push(fioHandleActionParams);
      }

      setActionParams(actionParamsArr);
    },
    [],
    !!submitData,
  );

  if (!submitData) return null;

  return (
    <MetamaskConfirmAction
      analyticAction={CONFIRM_METAMASK_ACTION.REGISTER_ADDRESS_PRIVATE_DOMAIN}
      analyticsData={submitData}
      actionParams={actionParams}
      processing={processing}
      returnOnlySignedTxn
      setProcessing={setProcessing}
      onCancel={onCancel}
      onSuccess={handleResult}
    />
  );
};
