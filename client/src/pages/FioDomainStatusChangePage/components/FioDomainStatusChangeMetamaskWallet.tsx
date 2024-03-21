import React from 'react';

import {
  MetamaskConfirmAction,
  OnSuccessResponseResult,
} from '../../../components/MetamaskConfirmAction';

import {
  ACTIONS,
  FIO_CONTRACT_ACCOUNT_NAMES,
  TRANSACTION_ACTION_NAMES,
} from '../../../constants/fio';
import { CONFIRM_METAMASK_ACTION } from '../../../constants/common';
import { DEFAULT_ACTION_FEE_AMOUNT } from '../../../api/fio';

import apis from '../../../api';

import { FioWalletDoublet } from '../../../types';
import { FioDomainStatusValues } from '../types';

type Props = {
  fioWallet: FioWalletDoublet;
  processing: boolean;
  submitData: FioDomainStatusValues;
  onSuccess: (result: OnSuccessResponseResult) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
};

export const FioDomainStatusChangeMetamaskWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    processing,
    submitData,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const derivationIndex = fioWallet?.data?.derivationIndex;

  const { publicStatusToSet, name } = submitData || {};

  const actionParams = {
    action: TRANSACTION_ACTION_NAMES[ACTIONS.setFioDomainVisibility],
    account: FIO_CONTRACT_ACCOUNT_NAMES.fioAddress,
    data: {
      fio_domain: name,
      is_public: publicStatusToSet,
      tpid: apis.fio.tpid,
      max_fee: DEFAULT_ACTION_FEE_AMOUNT,
    },
    derivationIndex,
  };

  if (!submitData) return null;

  return (
    <MetamaskConfirmAction
      analyticAction={CONFIRM_METAMASK_ACTION.SET_VISIBILITY}
      analyticsData={submitData}
      actionParams={actionParams}
      processing={processing}
      setProcessing={setProcessing}
      onCancel={onCancel}
      onSuccess={onSuccess}
    />
  );
};
