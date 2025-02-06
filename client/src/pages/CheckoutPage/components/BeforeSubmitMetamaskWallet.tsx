import React, { useCallback, useState } from 'react';

import { useSelector } from 'react-redux';

import { Account, Action } from '@fioprotocol/fiosdk';

import {
  MetamaskConfirmAction,
  OnSuccessResponseResult,
} from '../../../components/MetamaskConfirmAction';

import {
  DEFAULT_MAX_FEE_MULTIPLE_AMOUNT,
  TRANSACTION_DEFAULT_OFFSET_EXPIRATION_MS,
} from '../../../constants/fio';
import {
  CART_ITEM_TYPE,
  CONFIRM_METAMASK_ACTION,
  WALLET_CREATED_FROM,
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
    groupedBeforeSubmitValues,
    processing,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const prices = useSelector(pricesSelector);

  const metamaskItems = groupedBeforeSubmitValues.filter(
    groupedValue =>
      groupedValue.signInFioWallet.from === WALLET_CREATED_FROM.METAMASK,
  );

  const fioAddressItems = metamaskItems
    ?.map(metamaskItem => metamaskItem.submitData.fioAddressItems)
    .flat();

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
              signingWalletPubKey: indexedItem.fioWallet?.publicKey,
            };
          }
        }
        onSuccess(signedTxs);
      }
    },
    [indexedItems, onSuccess],
  );

  useEffectOnce(
    () => {
      const actionParamsArr = [];
      for (const [index, fioAddressItem] of fioAddressItems.entries()) {
        const isComboRegistration =
          !fioAddressItem.displayOrderItem.hasCustomDomainInCart &&
          fioAddressItem.displayOrderItem.type ===
            CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN;
        const fioHandleActionParams = {
          action: isComboRegistration
            ? Action.regDomainAddress
            : Action.regAddress,
          account: Account.address,
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
          derivationIndex: fioAddressItem?.fioWallet?.data?.derivationIndex,
          timeoutOffset: TRANSACTION_DEFAULT_OFFSET_EXPIRATION_MS,
          id: index,
        };

        handleIndexedItems({ fioAddressItem, index });

        actionParamsArr.push(fioHandleActionParams);
      }

      setActionParams(actionParamsArr);
    },
    [],
    !!metamaskItems.length,
  );

  if (!metamaskItems.length) return null;

  return (
    <MetamaskConfirmAction
      analyticAction={CONFIRM_METAMASK_ACTION.REGISTER_ADDRESS_PRIVATE_DOMAIN}
      analyticsData={{ fioAddressItems }}
      actionParams={actionParams}
      processing={processing}
      returnOnlySignedTxn
      setProcessing={setProcessing}
      onCancel={onCancel}
      onSuccess={handleResult}
    />
  );
};
