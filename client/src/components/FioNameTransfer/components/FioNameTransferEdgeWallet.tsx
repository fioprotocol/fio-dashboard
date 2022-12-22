import React from 'react';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import { CONFIRM_PIN_ACTIONS, DOMAIN } from '../../../constants/common';
import { ACTIONS } from '../../../constants/fio';

import { hasFioAddressDelimiter } from '../../../utils';

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
    const { transferAddress, fioNameType, name } = data;
    let newOwnerKey = hasFioAddressDelimiter(transferAddress)
      ? ''
      : transferAddress;
    if (!newOwnerKey) {
      const {
        public_address: publicAddress,
      } = await apis.fio.getFioPublicAddress(transferAddress);
      if (!publicAddress) throw new Error('Public address is invalid.');
      newOwnerKey = publicAddress;
    }
    const result = await apis.fio.executeAction(
      keys,
      fioNameType === DOMAIN
        ? ACTIONS.transferFioDomain
        : ACTIONS.transferFioAddress,
      {
        [fioNameType === DOMAIN ? 'fioDomain' : 'fioAddress']: name,
        newOwnerKey,
        maxFee: fee,
      },
    );
    return { ...result, newOwnerKey };
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
