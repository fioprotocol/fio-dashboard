import React from 'react';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import { executeRegistration } from '../middleware';

import {
  CONFIRM_PIN_ACTIONS,
  REF_PROFILE_TYPE,
} from '../../../constants/common';

import { FioWalletDoublet, RegistrationResult } from '../../../types';
import { SubmitActionParams } from '../../EdgeConfirmAction/types';
import { PurchaseValues } from '../types';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (results: RegistrationResult) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: PurchaseValues | null;
  processing: boolean;
  fee?: number | null;
};

const PurchaseEdgeWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    submitData,
    processing,
  } = props;

  const submit = async ({ keys, data }: SubmitActionParams) => {
    const { cartItems, prices, refProfileInfo, isFreeAllowed } = data;

    return await executeRegistration(
      cartItems,
      keys,
      prices.nativeFio,
      isFreeAllowed,
      {},
      refProfileInfo != null && refProfileInfo?.type === REF_PROFILE_TYPE.REF
        ? refProfileInfo.code
        : '',
    );
  };

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.PURCHASE}
      setProcessing={setProcessing}
      onSuccess={onSuccess}
      onCancel={onCancel}
      processing={processing}
      data={submitData}
      submitAction={submit}
      fioWalletEdgeId={fioWallet.edgeId || ''}
      edgeAccountLogoutBefore
    />
  );
};

export default PurchaseEdgeWallet;
