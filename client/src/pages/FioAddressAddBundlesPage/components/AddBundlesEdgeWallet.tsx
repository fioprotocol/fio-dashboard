import React from 'react';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import apis from '../../../api';

import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';

import { FioWalletDoublet } from '../../../types';
import { AddBundlesValues } from '../types';
import { SubmitActionParams } from '../../../components/EdgeConfirmAction/types';
import { ACTIONS } from '../../../constants/fio';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: { fee_collected: number }) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  sendData: AddBundlesValues | null;
  processing: boolean;
};

const AddBundlesEdgeWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    sendData,
    processing,
  } = props;

  const send = async ({ keys, data }: SubmitActionParams) => {
    return apis.fio.executeAction(keys, ACTIONS.addBundledTransactions, data);
  };

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.SEND}
      setProcessing={setProcessing}
      onSuccess={onSuccess}
      onCancel={onCancel}
      processing={processing}
      data={sendData}
      submitAction={send}
      fioWalletEdgeId={fioWallet.edgeId || ''}
      edgeAccountLogoutBefore={true}
    />
  );
};

export default AddBundlesEdgeWallet;
