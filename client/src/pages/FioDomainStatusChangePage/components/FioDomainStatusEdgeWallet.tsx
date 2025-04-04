import React from 'react';

import { GenericAction } from '@fioprotocol/fiosdk';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';

import apis from '../../../api';

import { FioWalletDoublet } from '../../../types';
import { FioDomainStatusValues } from '../types';
import { SubmitActionParams } from '../../../components/EdgeConfirmAction/types';
import { TrxResponsePaidBundles } from '../../../api/fio';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: TrxResponsePaidBundles) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: FioDomainStatusValues | null;
  processing: boolean;
  fee: string;
};

const FioDomainStatusEdgeWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    submitData,
    fee,
    processing,
  } = props;

  const submit = async ({ keys, data }: SubmitActionParams) => {
    const { publicStatusToSet, name } = data;
    return await apis.fio.executeAction(
      keys,
      GenericAction.setFioDomainVisibility,
      {
        fioDomain: name,
        isPublic: publicStatusToSet,
        maxFee: fee,
      },
    );
  };

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.SET_VISIBILITY}
      setProcessing={setProcessing}
      onSuccess={onSuccess}
      onCancel={onCancel}
      processing={processing}
      data={submitData}
      submitAction={submit}
      fioWalletEdgeId={fioWallet.edgeId || ''}
      edgeAccountLogoutBefore={true}
    />
  );
};

export default FioDomainStatusEdgeWallet;
