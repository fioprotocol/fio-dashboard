import React from 'react';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';
import { TOKEN_LINK_MIN_WAIT_TIME } from '../../../constants/fio';

import { minWaitTimeFunction } from '../../../utils';
import { linkTokensEdge } from '../../../api/middleware/fio';

import {
  FioWalletDoublet,
  LinkActionResult,
  PublicAddressDoublet,
  WalletKeys,
} from '../../../types';
import { EditTokenValues } from '../types';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: LinkActionResult) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: EditTokenValues | null;
  processing: boolean;
  fee?: number | null;
};

const EditTokenEdgeWallet: React.FC<Props> = props => {
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
    data: EditTokenValues;
    keys: WalletKeys;
  }) => {
    const editedPubAddresses = data.pubAddressesArr.filter(
      pubAddress => pubAddress.newPublicAddress,
    );
    const params: {
      fioAddress: string;
      connectList: PublicAddressDoublet[];
      keys: WalletKeys;
    } = {
      fioAddress: data.fioAddressName,
      connectList: editedPubAddresses.map(pubAddress => ({
        ...pubAddress,
        publicAddress: pubAddress.newPublicAddress,
      })),
      keys,
    };

    const actionResults = await minWaitTimeFunction(
      () => linkTokensEdge(params),
      TOKEN_LINK_MIN_WAIT_TIME,
    );
    return {
      ...actionResults,
      disconnect: {
        ...actionResults.disconnect,
        updated: editedPubAddresses,
      },
    };
  };

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.EDIT_TOKEN}
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

export default EditTokenEdgeWallet;
