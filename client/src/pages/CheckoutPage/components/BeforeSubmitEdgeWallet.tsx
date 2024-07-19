import React from 'react';

import { useSelector } from 'react-redux';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import apis from '../../../api';
import { log } from '../../../util/general';
import MathOp from '../../../util/math';

import {
  CART_ITEM_TYPE,
  CONFIRM_PIN_ACTIONS,
  WALLET_CREATED_FROM,
} from '../../../constants/common';
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
  const {
    analyticsData,
    groupedBeforeSubmitValues,
    processing,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const prices = useSelector(pricesSelector);

  const edgeItems = groupedBeforeSubmitValues.filter(
    groupedValue =>
      groupedValue.signInFioWallet.from === WALLET_CREATED_FROM.EDGE,
  );

  const groupWalletIds = edgeItems.map(edgeItem => edgeItem.signInFioWallet.id);

  const filteredAnalyticsData = {
    fioAddressItems: analyticsData.fioAddressItems.filter(item =>
      groupWalletIds.includes(item.fioWallet.id),
    ),
  };

  const fioAddressItems = edgeItems
    ?.map(edgeItem => edgeItem.submitData.fioAddressItems)
    .flat();

  const send = async ({
    allWalletKeysInAccount,
  }: SubmitActionParams<BeforeSubmitValues>) => {
    const signedTxs: BeforeSubmitData = {};

    for (const item of fioAddressItems) {
      apis.fio.setWalletFioSdk(allWalletKeysInAccount[item.fioWallet.edgeId]);

      const isComboRegistration =
        !item.cartItem.hasCustomDomainInCart &&
        item.cartItem.type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN;

      try {
        apis.fio.walletFioSDK.setSignedTrxReturnOption(true);
        signedTxs[item.name] = {
          signedTx: await apis.fio.walletFioSDK.genericAction(
            isComboRegistration
              ? ACTIONS.registerFioDomainAddress
              : ACTIONS.registerFioAddress,
            {
              ownerPublicKey: item.ownerKey,
              fioAddress: item.name,
              maxFee: new MathOp(
                isComboRegistration
                  ? prices.nativeFio.combo
                  : prices.nativeFio.address,
              )
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

  if (!edgeItems.length) return null;

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.REGISTER_ADDRESS_PRIVATE_DOMAIN}
      setProcessing={setProcessing}
      onSuccess={onSuccess}
      onCancel={onCancel}
      processing={processing}
      data={filteredAnalyticsData}
      submitAction={send}
      edgeAccountLogoutBefore={true}
    />
  );
};

export default BeforeSubmitEdgeWallet;
