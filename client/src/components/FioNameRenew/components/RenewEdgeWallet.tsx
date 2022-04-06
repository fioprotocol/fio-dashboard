import React from 'react';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import apis from '../../../api';

import { isDomain } from '../../../utils';

import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';
import { ACTIONS } from '../../../constants/fio';

import { FioWalletDoublet } from '../../../types';
import { SubmitActionParams } from '../../EdgeConfirmAction/types';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (result: { fee_collected: number }) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  renewData: { name: string } | null;
  processing: boolean;
  fee?: number | null;
};

const RenewEdgeWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    renewData,
    fee,
    processing,
  } = props;

  const renew = async ({ keys, data }: SubmitActionParams) => {
    const { name } = data;
    if (isDomain(name)) {
      return await apis.fio.executeAction(keys, ACTIONS.renewFioDomain, {
        fioDomain: name,
        maxFee: fee,
      });
    }

    throw new Error("Can't renew FIO Crypto Handle");
  };

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.RENEW}
      setProcessing={setProcessing}
      onSuccess={onSuccess}
      onCancel={onCancel}
      processing={processing}
      data={renewData}
      submitAction={renew}
      fioWalletEdgeId={fioWallet.edgeId || ''}
      edgeAccountLogoutBefore={true}
    />
  );
};

export default RenewEdgeWallet;
