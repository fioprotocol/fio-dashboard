import React from 'react';

import EdgeConfirmAction from '../../../../components/EdgeConfirmAction';

import { authenticateWallet } from '../../../../services/api/wallet';

import {
  CONFIRM_PIN_ACTIONS,
  DEFAULT_WALLET_OPTIONS,
  FIO_WALLET_TYPE,
  WALLET_CREATED_FROM,
} from '../../../../constants/common';

import { CreateWalletValues } from '../../types';
import { NewFioWalletDoublet, Nonce } from '../../../../types';
import { SubmitActionParams } from '../../../../components/EdgeConfirmAction/types';
import { EdgeWalletApiProvider } from '../../../../services/api/wallet/edge';

type Props = {
  onWalletDataPrepared: (data: {
    walletData: NewFioWalletDoublet;
    nonce: Nonce;
  }) => void;
  onOptionCancel: (err?: Error | string) => void;
  setProcessing: (processing: boolean) => void;
  values: CreateWalletValues;
  processing: boolean;
};

const CreateEdgeWallet: React.FC<Props> = props => {
  const {
    setProcessing,
    onWalletDataPrepared,
    onOptionCancel,
    processing,
    values,
  } = props;

  const createEdgeWallet = async ({
    edgeAccount,
    data,
  }: SubmitActionParams) => {
    const { name } = data;

    const { walletApiProvider, nonce } = await authenticateWallet({
      walletProviderName: WALLET_CREATED_FROM.EDGE,
      authParams: { account: edgeAccount },
    });

    const newFioWallet = await edgeAccount.createCurrencyWallet(
      FIO_WALLET_TYPE,
      { ...DEFAULT_WALLET_OPTIONS, name },
    );
    await newFioWallet.renameWallet(name);

    await (walletApiProvider as EdgeWalletApiProvider).logout({
      fromEdgeConfirm: true,
    });

    return {
      walletData: {
        edgeId: newFioWallet.id,
        name: newFioWallet.name,
        publicKey: newFioWallet.publicWalletInfo.keys.publicKey,
        from: WALLET_CREATED_FROM.EDGE,
      },
      nonce,
    };
  };

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.CREATE_WALLET}
      edgeAccountLogoutBefore={false}
      data={values}
      processing={processing}
      submitAction={createEdgeWallet}
      onSuccess={onWalletDataPrepared}
      onCancel={onOptionCancel}
      setProcessing={setProcessing}
      hideProcessing={true}
    />
  );
};

export default CreateEdgeWallet;
