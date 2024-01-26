import React, { useCallback } from 'react';

import { MetamaskConfirmAction } from '../../../components/MetamaskConfirmAction';
import {
  ACTIONS,
  FIO_CONTRACT_ACCOUNT_NAMES,
  TRANSACTION_ACTION_NAMES,
} from '../../../constants/fio';
import apis from '../../../api';
import { DEFAULT_ACTION_FEE_AMOUNT } from '../../../api/fio';
import { FioRecordViewDecrypted } from '../../WalletPage/types';
import { FioServerResponse } from '../../../types/fio';

type Props = {
  derivationIndex: number;
  processing: boolean;
  submitData: FioRecordViewDecrypted;
  startProcessing: boolean;
  onSuccess: (result: FioRecordViewDecrypted & {}) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
};

export const CancelRequestMetamaskWallet: React.FC<Props> = props => {
  const {
    derivationIndex,
    processing,
    startProcessing,
    submitData,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const { fioRecord, fioDecryptedContent } = submitData || {};

  const actionParams = {
    action: TRANSACTION_ACTION_NAMES[ACTIONS.cancelFundsRequest],
    account: FIO_CONTRACT_ACCOUNT_NAMES.fioRecordObt,
    data: {
      fio_request_id: fioRecord?.id,
      tpid: apis.fio.tpid,
      max_fee: DEFAULT_ACTION_FEE_AMOUNT,
    },
    derivationIndex,
  };

  const handleCancelRequestResult = useCallback(
    (result: FioServerResponse) => {
      if (!result) return;

      const canceledRequestResult = {
        ...submitData,
        fioDecryptedContent: {
          ...fioDecryptedContent,
          obtId: result.transaction_id,
        },
      };

      onSuccess(canceledRequestResult);
    },
    [fioDecryptedContent, submitData, onSuccess],
  );

  if (!startProcessing) return null;

  return (
    <MetamaskConfirmAction
      actionParams={actionParams}
      processing={processing}
      setProcessing={setProcessing}
      onCancel={onCancel}
      onSuccess={handleCancelRequestResult}
    />
  );
};
