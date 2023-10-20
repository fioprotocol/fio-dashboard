import React from 'react';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import apis from '../../../api';
import { log } from '../../../util/general';
import MathOp from '../../../util/math';

import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';
import {
  ACTIONS,
  DEFAULT_MAX_FEE_MULTIPLE_AMOUNT,
  TRANSACTION_DEFAULT_OFFSET_EXPIRATION,
} from '../../../constants/fio';

import { SubmitActionParams } from '../../../components/EdgeConfirmAction/types';
import { BeforeSubmitData, BeforeSubmitProps } from '../types';

const BeforeSubmitEdgeWallet: React.FC<BeforeSubmitProps> = props => {
  const { setProcessing, onSuccess, onCancel, data, fee, processing } = props;

  const send = async ({ allWalletKeysInAccount, data }: SubmitActionParams) => {
    const signedTxs: BeforeSubmitData = {};
    for (const item of data.fioAddressItems) {
      apis.fio.setWalletFioSdk(allWalletKeysInAccount[item.fioWallet.edgeId]);

      try {
        apis.fio.walletFioSDK.setSignedTrxReturnOption(true);
        signedTxs[item.name] = {
          signedTx: await apis.fio.walletFioSDK.genericAction(
            ACTIONS.registerFioAddress,
            {
              ownerPublicKey: item.ownerKey,
              fioAddress: item.name,
              maxFee: new MathOp(fee)
                .mul(DEFAULT_MAX_FEE_MULTIPLE_AMOUNT)
                .round(0)
                .toNumber(),
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
      data={data}
      submitAction={send}
      edgeAccountLogoutBefore={true}
    />
  );
};

export default BeforeSubmitEdgeWallet;
