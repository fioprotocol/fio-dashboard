import React from 'react';

import { GenericAction } from '@fioprotocol/fiosdk';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import apis from '../../../api';

import { log } from '../../../util/general';

import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';

import { FioWalletDoublet } from '../../../types';
import { SubmitActionParams } from '../../../components/EdgeConfirmAction/types';
import { FioRecordViewDecrypted } from '../../WalletPage/types';

const PROCESSING_PROPS = {
  title: 'Canceling FIO Request',
  message: 'Hang tight while we are canceling FIO request',
};

type Props = {
  submitData: FioRecordViewDecrypted | null;
  processing: boolean;
  fioWallet: FioWalletDoublet;
  setProcessing: (processing: boolean) => void;
  onSuccess: (data: FioRecordViewDecrypted & { error?: string }) => void;
  onCancel: () => void;
};

const CancelRequestEdge: React.FC<Props> = props => {
  const {
    submitData,
    processing,
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
  } = props;

  const cancelRequest = async ({ keys, data }: SubmitActionParams) => {
    let error;
    try {
      const result = await apis.fio.executeAction(
        keys,
        GenericAction.cancelFundsRequest,
        {
          fioRequestId: data.fioRecord.id,
        },
      );
      data.fioDecryptedContent.obtId = result.transaction_id;
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
      submitAction={cancelRequest}
      data={submitData}
      action={CONFIRM_PIN_ACTIONS.CANCEL_FIO_REQUEST}
      processing={processing}
      setProcessing={setProcessing}
      fioWalletEdgeId={fioWallet.edgeId || ''}
      processingProps={PROCESSING_PROPS}
    />
  );
};

export default CancelRequestEdge;
