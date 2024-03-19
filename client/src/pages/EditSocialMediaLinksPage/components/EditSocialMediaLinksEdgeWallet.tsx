import React from 'react';

import EdgeConfirmAction from '../../../components/EdgeConfirmAction';

import { CHAIN_CODES, CONFIRM_PIN_ACTIONS } from '../../../constants/common';
import { TOKEN_LINK_MIN_WAIT_TIME } from '../../../constants/fio';

import { minWaitTimeFunction } from '../../../utils';
import { linkTokensEdge } from '../../../api/middleware/fio';

import {
  FioWalletDoublet,
  LinkActionResult,
  PublicAddressDoublet,
  WalletKeys,
} from '../../../types';
import { EditSocialLinkItem } from '../types';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: LinkActionResult) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: { fch: string; socialMediaLinksList: EditSocialLinkItem[] };
  processing: boolean;
  fee?: number | null;
};

export const EditSocialMediaLinksEdgeWallet: React.FC<Props> = props => {
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
    data: { fch: string; socialMediaLinksList: EditSocialLinkItem[] };
    keys: WalletKeys;
  }) => {
    const editedSocialMediaLinks = data.socialMediaLinksList.filter(
      socialMediaLink => socialMediaLink.newUsername,
    );
    const params: {
      fioAddress: string;
      connectList: PublicAddressDoublet[];
      keys: WalletKeys;
    } = {
      fioAddress: data.fch,
      connectList: editedSocialMediaLinks.map(socialMediaLinkItem => ({
        ...socialMediaLinkItem,
        chainCode: CHAIN_CODES.SOCIALS,
        tokenCode: socialMediaLinkItem.name.toUpperCase(),
        publicAddress: socialMediaLinkItem.newUsername,
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
        updated: editedSocialMediaLinks,
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
