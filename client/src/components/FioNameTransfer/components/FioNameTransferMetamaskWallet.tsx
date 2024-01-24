import React from 'react';

import { MetamaskConfirmAction } from '../../../components/MetamaskConfirmAction';
import {
  ACTIONS,
  FIO_CONTRACT_ACCOUNT_NAMES,
  TRANSACTION_ACTION_NAMES,
} from '../../../constants/fio';
import apis from '../../../api';
import { DEFAULT_ACTION_FEE_AMOUNT } from '../../../api/fio';
import { FioNameType } from '../../../types';
import { ADDRESS, DOMAIN } from '../../../constants/common';
import { FioServerResponse } from '../../../types/fio';

type Props = {
  derivationIndex: number;
  fioNameType: FioNameType;
  processing: boolean;
  submitData: { fioName: string; newOwnerPublicKey: string };
  startProcessing: boolean;
  onSuccess: (result: FioServerResponse) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
};

export const FioNameTransferMetamaskWallet: React.FC<Props> = props => {
  const {
    derivationIndex,
    fioNameType,
    processing,
    startProcessing,
    submitData,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const { fioName, newOwnerPublicKey } = submitData;

  const actionParams: {
    action: string;
    account: string;
    data: {
      fio_address?: string;
      fio_domain?: string;
      new_owner_fio_public_key: string;
      tpid: string;
      max_fee: number;
    };
    derivationIndex: number;
  } = {
    action: TRANSACTION_ACTION_NAMES[ACTIONS.transferFioAddress],
    account: FIO_CONTRACT_ACCOUNT_NAMES.fioAddress,
    data: {
      new_owner_fio_public_key: newOwnerPublicKey,
      tpid: apis.fio.tpid,
      max_fee: DEFAULT_ACTION_FEE_AMOUNT,
    },
    derivationIndex,
  };

  if (fioNameType === ADDRESS) {
    actionParams.data.fio_address = fioName;
  }

  if (fioNameType === DOMAIN) {
    actionParams.data.fio_domain = fioName;
  }

  if (!startProcessing) return null;

  return (
    <MetamaskConfirmAction
      actionParams={actionParams}
      processing={processing}
      setProcessing={setProcessing}
      onCancel={onCancel}
      onSuccess={onSuccess}
    />
  );
};
