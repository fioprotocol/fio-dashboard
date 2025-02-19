import React from 'react';

import { Account, Action } from '@fioprotocol/fiosdk';

import {
  MetamaskConfirmAction,
  OnSuccessResponseResult,
} from '../../MetamaskConfirmAction';

import {
  ADDRESS,
  CONFIRM_METAMASK_ACTION,
  DOMAIN,
} from '../../../constants/common';

import apis from '../../../api';
import { DEFAULT_ACTION_FEE_AMOUNT } from '../../../api/fio';

import { FioWalletDoublet } from '../../../types';
import { FioNameTransferValues } from '../types';

type Props = {
  fioWallet: FioWalletDoublet;
  processing: boolean;
  submitData: FioNameTransferValues;
  onSuccess: (result: OnSuccessResponseResult) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
};

export const FioNameTransferMetamaskWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    processing,
    submitData,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const { name: fioName, fioNameType, newOwnerPublicKey } = submitData || {};
  const derivationIndex = fioWallet?.data?.derivationIndex;

  const actionParams: {
    action: string;
    account: string;
    data: {
      fio_address?: string;
      fio_domain?: string;
      new_owner_fio_public_key: string;
      tpid: string;
      max_fee: string;
    };
    derivationIndex: number;
  } = {
    action: '',
    account: Account.address,
    data: {
      new_owner_fio_public_key: newOwnerPublicKey,
      tpid: apis.fio.tpid,
      max_fee: DEFAULT_ACTION_FEE_AMOUNT,
    },
    derivationIndex,
  };

  if (fioNameType === ADDRESS) {
    actionParams.action = Action.transferAddress;
    actionParams.data.fio_address = fioName;
  }

  if (fioNameType === DOMAIN) {
    actionParams.action = Action.transferDomain;
    actionParams.data.fio_domain = fioName;
  }

  if (!submitData) return null;

  return (
    <MetamaskConfirmAction
      analyticAction={CONFIRM_METAMASK_ACTION.TRANSFER}
      analyticsData={submitData}
      actionParams={actionParams}
      processing={processing}
      setProcessing={setProcessing}
      onCancel={onCancel}
      onSuccess={onSuccess}
    />
  );
};
