import React from 'react';

import {
  MetamaskConfirmAction,
  OnSuccessResponseResult,
} from '../../../../../components/MetamaskConfirmAction';

import { CONFIRM_METAMASK_ACTION } from '../../../../../constants/common';

import { FioWalletDoublet } from '../../../../../types';
import { SubmitData } from '../types';

type Props = {
  fioWallet: FioWalletDoublet;
  processing: boolean;
  submitData: SubmitData;
  onCancel: () => void;
  onSuccess: (result: OnSuccessResponseResult) => void;
  setProcessing: (processing: boolean) => void;
};

export const VoteProxyMetamaskWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    processing,
    submitData,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const derivationIndex = fioWallet?.data?.derivationIndex;

  const actionParams = {
    ...submitData,
    derivationIndex,
  };

  if (!submitData) return null;

  return (
    <MetamaskConfirmAction
      analyticAction={CONFIRM_METAMASK_ACTION.VOTE_PROXY}
      analyticsData={submitData}
      actionParams={actionParams}
      processing={processing}
      setProcessing={setProcessing}
      onCancel={onCancel}
      onSuccess={onSuccess}
    />
  );
};
