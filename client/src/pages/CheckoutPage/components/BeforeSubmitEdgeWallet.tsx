import React from 'react';

import { useSelector } from 'react-redux';

import { GenericAction } from '@fioprotocol/fiosdk';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import apis from '../../../api';
import { defaultMaxFee } from '../../../util/prices';
import { log } from '../../../util/general';

import {
  CART_ITEM_TYPE,
  CONFIRM_PIN_ACTIONS,
  WALLET_CREATED_FROM,
} from '../../../constants/common';
import { TRANSACTION_DEFAULT_OFFSET_EXPIRATION } from '../../../constants/fio';

import { SubmitActionParams } from '../../../components/EdgeConfirmAction/types';
import {
  BeforeSubmitData,
  BeforeSubmitValues,
  BeforeSubmitProps,
} from '../types';
import { prices as pricesSelector } from '../../../redux/registrations/selectors';
import { SignedTxArgs } from '../../../api/fio';

const BeforeSubmitEdgeWallet: React.FC<BeforeSubmitProps> = props => {
  const {
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

  const fioAddressItems = edgeItems
    ?.map(edgeItem => edgeItem.submitData.fioAddressItems)
    .flat();

  const send = async ({
    allWalletKeysInAccount,
  }: SubmitActionParams<BeforeSubmitValues>) => {
    const signedTxs: BeforeSubmitData = {};

    for (const item of fioAddressItems) {
      await apis.fio.setWalletFioSdk(
        allWalletKeysInAccount[item.fioWallet.edgeId],
      );

      const isComboRegistration =
        !item.displayOrderItem.hasCustomDomainInCart &&
        item.displayOrderItem.type ===
          CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN;

      try {
        apis.fio.walletFioSDK.setSignedTrxReturnOption(true);
        signedTxs[item.name] = {
          signedTx: ((await apis.fio.walletFioSDK.genericAction(
            isComboRegistration
              ? GenericAction.registerFioDomainAddress
              : GenericAction.registerFioAddress,
            {
              ownerPublicKey: item.ownerKey,
              fioAddress: item.name,
              maxFee: defaultMaxFee(
                isComboRegistration
                  ? prices.nativeFio.combo
                  : prices.nativeFio.address,
                { retNum: true },
              ) as number,
              technologyProviderId: apis.fio.tpid,
              expirationOffset: TRANSACTION_DEFAULT_OFFSET_EXPIRATION,
            },
          )) as unknown) as SignedTxArgs,
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
      data={{ fioAddressItems }}
      submitAction={send}
      edgeAccountLogoutBefore={true}
    />
  );
};

export default BeforeSubmitEdgeWallet;
