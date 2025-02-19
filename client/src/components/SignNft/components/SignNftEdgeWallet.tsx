import React from 'react';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import apis from '../../../api';

import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';

import { FioWalletDoublet, NFTTokenDoublet } from '../../../types';
import { SubmitActionParams } from '../../EdgeConfirmAction/types';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (result: { fee_collected: number }) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: NFTTokenDoublet | null;
  processing: boolean;
  fee?: string | null;
};

const SignNftEdgeWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    submitData,
    processing,
  } = props;

  const submit = async ({ keys, data }: SubmitActionParams) => {
    return await apis.fio.singNFT(keys, data.fioAddress || '', [{ ...data }]);
  };

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.SIGN_NFT}
      setProcessing={setProcessing}
      onSuccess={onSuccess}
      onCancel={onCancel}
      processing={processing}
      data={submitData}
      submitAction={submit}
      fioWalletEdgeId={fioWallet.edgeId || ''}
      edgeAccountLogoutBefore={true}
    />
  );
};

export default SignNftEdgeWallet;
