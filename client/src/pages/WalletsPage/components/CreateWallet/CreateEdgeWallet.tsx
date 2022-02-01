import React from 'react';

import EdgeConfirmAction from '../../../../components/EdgeConfirmAction';

import {
  CONFIRM_PIN_ACTIONS,
  DEFAULT_WALLET_OPTIONS,
  FIO_WALLET_TYPE,
  WALLET_CREATED_FROM,
} from '../../../../constants/common';

import { CreateWalletValues } from '../../types';
import { NewFioWalletDoublet } from '../../../../types';
import { SubmitActionParams } from '../../../../components/EdgeConfirmAction/types';

type Props = {
  onWalletDataPrepared: (data: NewFioWalletDoublet) => void;
  onOptionCancel: () => void;
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
    const newFioWallet = await edgeAccount.createCurrencyWallet(
      FIO_WALLET_TYPE,
      { ...DEFAULT_WALLET_OPTIONS, name },
    );
    await newFioWallet.renameWallet(name);

    return {
      edgeId: newFioWallet.id,
      name: newFioWallet.name,
      publicKey: newFioWallet.publicWalletInfo.keys.publicKey,
      from: WALLET_CREATED_FROM.EDGE,
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
