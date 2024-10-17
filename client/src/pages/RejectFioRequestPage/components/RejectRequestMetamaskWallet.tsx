import React, { useCallback } from 'react';

import { Account, Action } from '@fioprotocol/fiosdk';

import {
  MetamaskConfirmAction,
  OnSuccessResponseResult,
} from '../../../components/MetamaskConfirmAction';

import { CONFIRM_METAMASK_ACTION } from '../../../constants/common';

import apis from '../../../api';
import { DEFAULT_ACTION_FEE_AMOUNT } from '../../../api/fio';
import { FioRecordViewDecrypted } from '../../WalletPage/types';
import { FioWalletDoublet } from '../../../types';

type Props = {
  fioWallet: FioWalletDoublet;
  processing: boolean;
  submitData: FioRecordViewDecrypted;
  onSuccess: (result: FioRecordViewDecrypted & {}) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
};

export const RejectRequestMetamaskWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    processing,
    submitData,
    onCancel,
    onSuccess,
    setProcessing,
  } = props;

  const derivationIndex = fioWallet?.data?.derivationIndex;

  const { fioRecord, fioDecryptedContent } = submitData || {};

  const actionParams = {
    action: Action.rejectFundsRequest,
    account: Account.reqObt,
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

  if (!submitData) return null;

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
