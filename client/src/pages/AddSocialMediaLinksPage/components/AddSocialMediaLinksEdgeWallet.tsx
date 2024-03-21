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
import { FormValues } from '../types';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: LinkActionResult) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: FormValues | null;
  processing: boolean;
  fee?: number | null;
};

export const AddSocialMediaLinksEdgeWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    submitData,
    processing,
  } = props;

  const submit = async ({
    keys,
    data,
  }: {
    keys: WalletKeys;
    data: {
      fch: string;
      socialMediaLinksList: FormValues;
    };
  }) => {
    const params: {
      fioAddress: string;
      connectList: PublicAddressDoublet[];
      keys: WalletKeys;
    } = {
      fioAddress: data.fch,
      connectList: Object.entries(data.socialMediaLinksList).map(
        ([key, value]) => {
          let socialMediaLink = '';
          if (typeof value !== undefined && typeof value === 'string') {
            socialMediaLink = value;
          }
          return {
            chainCode: CHAIN_CODES.SOCIALS,
            tokenCode: key.toUpperCase(),
            publicAddress: socialMediaLink,
          };
        },
      ),
      keys,
    };

    return await minWaitTimeFunction(
      () => linkTokensEdge(params),
      TOKEN_LINK_MIN_WAIT_TIME,
    );
  };

  return (
    <EdgeConfirmAction
      action={CONFIRM_PIN_ACTIONS.ADD_TOKEN}
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
