import React, { useCallback, useState } from 'react';

import {
  MetamaskConfirmAction,
  OnSuccessResponseResult,
} from '../../../components/MetamaskConfirmAction';

import {
  ACTIONS,
  DEFAULT_MAX_FEE_MULTIPLE_AMOUNT,
  FIO_CONTRACT_ACCOUNT_NAMES,
  TRANSACTION_ACTION_NAMES,
  TRANSACTION_DEFAULT_OFFSET_EXPIRATION,
} from '../../../constants/fio';

import apis from '../../../api';

import { ActionParams } from '../../../types/fio';
import useEffectOnce from '../../../hooks/general';
import MathOp from '../../../util/math';
import {
  BeforeSubmitData,
  BeforeSubmitProps,
  SignFioAddressItem,
} from '../types';

export const BeforeSubmitMetamaskWallet: React.FC<BeforeSubmitProps> = props => {
  const {
    data,
    fee,
    paymentWallet,
    processing,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const { fioAddressItems } = data || {};
  const { publicKey, data: paymentWalletData } = paymentWallet || {};

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

            const signedTxItem = resultItem;
            delete signedTxItem.id;

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
        const fioHandleActionParams = {
          action: TRANSACTION_ACTION_NAMES[ACTIONS.registerFioAddress],
          account: FIO_CONTRACT_ACCOUNT_NAMES.fioAddress,
          data: {
            owner_fio_public_key: fioAddressItem.ownerKey,
            fio_address: fioAddressItem.name,
            tpid: apis.fio.tpid,
            max_fee: new MathOp(fee)
              .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
              .round(0)
              .toNumber(),
          },
          derivationIndex: paymentWalletData?.derivationIndex,
          expirationOffset: TRANSACTION_DEFAULT_OFFSET_EXPIRATION,
          id: index,
        };

        handleIndexedItems({ fioAddressItem, index });

        actionParamsArr.push(fioHandleActionParams);
      }

      setActionParams(actionParamsArr);
    },
    [],
    !!data,
  );

  if (!data) return null;

  return (
    <MetamaskConfirmAction
      actionParams={actionParams}
      processing={processing}
      returnOnlySignedTxn
      setProcessing={setProcessing}
      onCancel={onCancel}
      onSuccess={handleResult}
    />
  );
};