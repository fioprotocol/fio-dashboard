import React, { useCallback } from 'react';

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

import apis from '../../../api';
import { DEFAULT_ACTION_FEE_AMOUNT } from '../../../api/fio';
import { FioRecordViewDecrypted } from '../../WalletPage/types';

type Props = {
  derivationIndex: number;
  processing: boolean;
  submitData: FioRecordViewDecrypted;
  startProcessing: boolean;
  onSuccess: (result: FioRecordViewDecrypted & {}) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
};

export const RejectRequestMetamaskWallet: React.FC<Props> = props => {
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
    action: TRANSACTION_ACTION_NAMES[ACTIONS.rejectFundsRequest],
    account: FIO_CONTRACT_ACCOUNT_NAMES.fioRecordObt,
    data: {
      fio_request_id: fioRecord?.id,
      tpid: apis.fio.tpid,
      max_fee: DEFAULT_ACTION_FEE_AMOUNT,
    },
    derivationIndex,
  };

  const handleRejectRequestResult = useCallback(
    (result: OnSuccessResponseResult) => {
      if (!result) return;

      if (!Array.isArray(result) && 'transaction_id' in result) {
        const rejectedRequestResult = {
          ...submitData,
          fioDecryptedContent: {
            ...fioDecryptedContent,
            obtId: result.transaction_id,
          },
        };

        onSuccess(rejectedRequestResult);
      }
    },
    [fioDecryptedContent, submitData, onSuccess],
  );

  if (!startProcessing) return null;

  return (
    <MetamaskConfirmAction
      analyticAction={CONFIRM_METAMASK_ACTION.REJECT_FIO_REQUEST}
      analyticsData={submitData}
      actionParams={actionParams}
      processing={processing}
      setProcessing={setProcessing}
      onCancel={onCancel}
      onSuccess={handleRejectRequestResult}
    />
  );
};
