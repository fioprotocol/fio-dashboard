import React from 'react';

import { GenericAction } from '@fioprotocol/fiosdk';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import { CONFIRM_PIN_ACTIONS, DOMAIN } from '../../../constants/common';

import apis from '../../../api';

import { FioWalletDoublet } from '../../../types';
import { FioNameTransferValues } from '../types';
import { SubmitActionParams } from '../../EdgeConfirmAction/types';
import { TrxResponsePaidBundles } from '../../../api/fio';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: TrxResponsePaidBundles) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: FioNameTransferValues | null;
  processing: boolean;
  fee: number;
};

const FioNameTransferEdgeWallet: React.FC<Props> = props => {
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
    const { fioNameType, name, newOwnerPublicKey } = data;

    const result = await apis.fio.executeAction(
      keys,
      fioNameType === DOMAIN
        ? GenericAction.transferFioDomain
        : GenericAction.transferFioAddress,
      {
        [fioNameType === DOMAIN ? 'fioDomain' : 'fioAddress']: name,
        newOwnerKey: newOwnerPublicKey,
        maxFee: fee,
      },
    );
    return { ...result, newOwnerKey: newOwnerPublicKey };
  };

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.TRANSFER}
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

export default FioNameTransferEdgeWallet;
