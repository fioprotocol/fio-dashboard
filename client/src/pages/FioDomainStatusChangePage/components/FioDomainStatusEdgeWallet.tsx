import React from 'react';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import { CONFIRM_PIN_ACTIONS, DOMAIN_STATUS } from '../../../constants/common';
import { ACTIONS } from '../../../constants/fio';

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
  fee: number;
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
    const { statusToChange, name } = data;
    return await apis.fio.executeAction(keys, ACTIONS.setFioDomainVisibility, {
      fioDomain: name,
      isPublic: statusToChange === DOMAIN_STATUS.PUBLIC,
      maxFee: fee,
    });
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
