import React from 'react';

import { useSelector } from 'react-redux';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import apis from '../../../api';
import { log } from '../../../util/general';
import MathOp from '../../../util/math';

import {
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
  const { setProcessing, onSuccess, onCancel, submitData, processing } = props;

  const prices = useSelector(pricesSelector);

  const send = async ({
    allWalletKeysInAccount,
    data,
  }: SubmitActionParams<BeforeSubmitValues>) => {
    const signedTxs: BeforeSubmitData = {
      walletType: WALLET_CREATED_FROM.EDGE,
      data: {},
    };

    for (const item of data.fioAddressItems) {
      apis.fio.setWalletFioSdk(allWalletKeysInAccount[item.fioWallet.edgeId]);

      try {
        apis.fio.walletFioSDK.setSignedTrxReturnOption(true);
        signedTxs.data[item.name] = {
          signedTx: await apis.fio.walletFioSDK.genericAction(
            !item.cartItem.hasCustomDomainInCart
              ? ACTIONS.registerFioDomainAddress
              : ACTIONS.registerFioAddress,
            {
              ownerPublicKey: item.ownerKey,
              fioAddress: item.name,
              maxFee: new MathOp(
                !item.cartItem.hasCustomDomainInCart
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
