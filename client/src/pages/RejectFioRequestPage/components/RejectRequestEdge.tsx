import React from 'react';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import apis from '../../../api';

import { log } from '../../../util/general';

import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';
import { ACTIONS } from '../../../constants/fio';

import { FioWalletDoublet } from '../../../types';
import { SubmitActionParams } from '../../../components/EdgeConfirmAction/types';
import { FioRecordViewDecrypted } from '../../WalletPage/types';

const PROCESSING_PROPS = {
  title: 'Rejecting FIO Request',
  message: 'Hang tight while we are rejecting FIO request',
};

type Props = {
  submitData: FioRecordViewDecrypted | null;
  processing: boolean;
  fioWallet: FioWalletDoublet;
  setProcessing: (processing: boolean) => void;
  onSuccess: (data: FioRecordViewDecrypted & { error?: string }) => void;
  onCancel: () => void;
};

const RejectRequestEdge: React.FC<Props> = props => {
  const {
    submitData,
    processing,
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
  } = props;

  const rejectRequest = async ({ keys, data }: SubmitActionParams) => {
    let error;
    try {
      await apis.fio.executeAction(keys, ACTIONS.rejectFundsRequest, {
        fioRequestId: data.fioRecord.id,
      });
    } catch (err) {
      log.error(err);
      error = err;
    }

    return { ...data, error };
  };

  return (
    <EdgeConfirmAction
      onSuccess={onSuccess}
      onCancel={onCancel}
      submitAction={rejectRequest}
      data={submitData}
      action={CONFIRM_PIN_ACTIONS.REJECT_FIO_REQUEST}
      processing={processing}
      setProcessing={setProcessing}
      fioWalletEdgeId={fioWallet.edgeId || ''}
      processingProps={PROCESSING_PROPS}
    />
  );
};

export default RejectRequestEdge;
