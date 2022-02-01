import React from 'react';
import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';

import { FioWalletDoublet } from '../../../types';

const PROCESSING_PROPS = {
  title: 'Rejecting FIO Request',
  message: 'Hang tight while we are rejecting FIO request',
};

type Props = {
  submitData: any | null;
  processing: boolean;
  fioWallet: FioWalletDoublet;
  setProcessing: (processing: boolean) => void;
  onSuccess: (data: any) => void;
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

  const rejectRequest = () => {
    // todo: set reject action
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
