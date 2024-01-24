import React from 'react';

import { MetamaskConfirmAction } from '../../../components/MetamaskConfirmAction';
import {
  ACTIONS,
  FIO_CONTRACT_ACCOUNT_NAMES,
  TRANSACTION_ACTION_NAMES,
} from '../../../constants/fio';
import apis from '../../../api';
import { DEFAULT_ACTION_FEE_AMOUNT } from '../../../api/fio';
import { FioServerResponse } from '../../../types/fio';

type Props = {
  derivationIndex: number;
  processing: boolean;
  submitData: { isPublic: number; name: string };
  startProcessing: boolean;
  onSuccess: (result: FioServerResponse) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
};

export const FioDomainStatusChangeMetamaskWallet: React.FC<Props> = props => {
  const {
    derivationIndex,
    processing,
    startProcessing,
    submitData,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const { isPublic, name } = submitData;

  const actionParams = {
    action: TRANSACTION_ACTION_NAMES[ACTIONS.setFioDomainVisibility],
    account: FIO_CONTRACT_ACCOUNT_NAMES.fioAddress,
    data: {
      fio_domain: name,
      is_public: isPublic ? 0 : 1,
      tpid: apis.fio.tpid,
      max_fee: DEFAULT_ACTION_FEE_AMOUNT,
    },
    derivationIndex,
  };

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
