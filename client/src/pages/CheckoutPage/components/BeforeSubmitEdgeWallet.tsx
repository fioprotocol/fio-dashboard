import React from 'react';

import { useSelector } from 'react-redux';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import apis from '../../../api';
import { log } from '../../../util/general';
import MathOp from '../../../util/math';

import { CART_ITEM_TYPE, CONFIRM_PIN_ACTIONS } from '../../../constants/common';
import {
  ACTIONS,
  DEFAULT_MAX_FEE_MULTIPLE_AMOUNT,
  TRANSACTION_DEFAULT_OFFSET_EXPIRATION,
} from '../../../constants/fio';

import { SubmitActionParams } from '../../../components/EdgeConfirmAction/types';
import {
  BeforeSubmitData,
  BeforeSubmitValues,
  BeforeSubmitProps,
} from '../types';
import { prices as pricesSelector } from '../../../redux/registrations/selectors';

const BeforeSubmitEdgeWallet: React.FC<BeforeSubmitProps> = props => {
  const { setProcessing, onSuccess, onCancel, submitData, processing } = props;

  const prices = useSelector(pricesSelector);

  const send = async ({
    allWalletKeysInAccount,
    data,
  }: SubmitActionParams<BeforeSubmitValues>) => {
    const signedTxs: BeforeSubmitData = {};

    for (const item of data.fioAddressItems) {
      apis.fio.setWalletFioSdk(allWalletKeysInAccount[item.fioWallet.edgeId]);

      // TODO to util
      const fee = [
        CART_ITEM_TYPE.DOMAIN_RENEWAL,
        CART_ITEM_TYPE.ADD_BUNDLES,
      ].includes(item.cartItem.type)
        ? item.cartItem.costNativeFio
        : item.cartItem.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN
        ? prices.nativeFio.combo
        : item.cartItem.address
        ? prices.nativeFio.address
        : prices.nativeFio.domain;

      try {
        apis.fio.walletFioSDK.setSignedTrxReturnOption(true);
        signedTxs[item.name] = {
          signedTx: await apis.fio.walletFioSDK.genericAction(
            item.cartItem.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN
              ? ACTIONS.registerFioDomainAddress
              : ACTIONS.registerFioAddress,
            {
              ownerPublicKey: item.ownerKey,
              fioAddress: item.name,
              maxFee: new MathOp(fee)
                .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
                .round(0)
                .toNumber(),
              technologyProviderId: apis.fio.tpid,
              expirationOffset: TRANSACTION_DEFAULT_OFFSET_EXPIRATION,
            },
          ),
          signingWalletPubKey:
            allWalletKeysInAccount[item.fioWallet.edgeId].public,
        };
        apis.fio.clearWalletFioSdk();
      } catch (err) {
        apis.fio.clearWalletFioSdk();
        log.error(err);

        throw err;
      }
    }

    return signedTxs;
  };

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.REGISTER_ADDRESS_PRIVATE_DOMAIN}
      setProcessing={setProcessing}
      onSuccess={onSuccess}
      onCancel={onCancel}
      processing={processing}
      data={submitData}
      submitAction={send}
      edgeAccountLogoutBefore={true}
    />
  );
};

export default BeforeSubmitEdgeWallet;
