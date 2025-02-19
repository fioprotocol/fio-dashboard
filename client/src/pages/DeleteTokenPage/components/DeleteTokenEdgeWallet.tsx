import React from 'react';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import { minWaitTimeFunction } from '../../../utils';
import { linkTokensEdge } from '../../../api/middleware/fio';

import { CHAIN_CODES, CONFIRM_PIN_ACTIONS } from '../../../constants/common';
import { TOKEN_LINK_MIN_WAIT_TIME } from '../../../constants/fio';

import {
  FioWalletDoublet,
  LinkActionResult,
  PublicAddressDoublet,
  WalletKeys,
} from '../../../types';
import { DeleteTokenValues } from '../types';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: LinkActionResult) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: DeleteTokenValues | null;
  processing: boolean;
  fee?: string | null;
};

const DeleteTokenEdgeWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    submitData,
    processing,
  } = props;

  const submit = async ({
    data,
    keys,
  }: {
    data: DeleteTokenValues;
    keys: WalletKeys;
  }) => {
    const params: {
      fioAddress: string;
      disconnectList: PublicAddressDoublet[];
      keys: WalletKeys;
    } = {
      fioAddress: data.fioCryptoHandle.name,
      disconnectList: data.pubAddressesArr.filter(pubAddress => {
        const { isChecked, chainCode, tokenCode } = pubAddress;
        const isFioToken =
          chainCode === CHAIN_CODES.FIO && tokenCode === CHAIN_CODES.FIO;
        return isChecked && !isFioToken;
      }),
      keys,
    };

    return await minWaitTimeFunction(
      () => linkTokensEdge(params),
      TOKEN_LINK_MIN_WAIT_TIME,
    );
  };

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.DELETE_TOKEN}
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

export default DeleteTokenEdgeWallet;
