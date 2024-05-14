import React from 'react';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';

import LedgerConnect from '../../../components/LedgerConnect';

import { CHAIN_CODES, CONFIRM_LEDGER_ACTIONS } from '../../../constants/common';
import { TOKEN_LINK_MIN_WAIT_TIME } from '../../../constants/fio';

import { minWaitTimeFunction } from '../../../utils';
import { linkTokensLedger } from '../../../api/middleware/fio';

import {
  FioWalletDoublet,
  PublicAddressDoublet,
  LinkActionResult,
} from '../../../types';
import { EditSocialLinkItem } from '../types';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: LinkActionResult) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: {
    fch: string;
    socialMediaLinksList: EditSocialLinkItem[] | null;
  };
  processing: boolean;
  fee: number;
};

export const EditSocialMediaLinksLedgerWallet: React.FC<Props> = props => {
  const {
    fee,
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    submitData,
    processing,
  } = props;

  const submit = async (appFio: LedgerFioApp) => {
    const editedSocialMediaLinks = submitData.socialMediaLinksList.filter(
      socialMediaLinkItem => socialMediaLinkItem.newUsername,
    );
    const params: {
      fioAddress: string;
      connectList: PublicAddressDoublet[];
      appFio: LedgerFioApp;
      fioWallet: FioWalletDoublet;
    } = {
      fioAddress: submitData.fch,
      connectList: editedSocialMediaLinks.map(socialMediaLinkItem => ({
        ...socialMediaLinkItem,
        chainCode: CHAIN_CODES.SOCIALS,
        tokenCode: socialMediaLinkItem.name.toUpperCase(),
        publicAddress: socialMediaLinkItem.newUsername,
      })),
      appFio,
      fioWallet,
    };

    const actionResults = await minWaitTimeFunction(
      () => linkTokensLedger(params),
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

  if (!submitData) return null;

  return (
    <LedgerConnect
      action={CONFIRM_LEDGER_ACTIONS.EDIT_TOKEN}
      data={{ ...submitData, fee }}
      fioWallet={fioWallet}
      onConnect={submit}
      onSuccess={onSuccess}
      onCancel={onCancel}
      setProcessing={setProcessing}
      isTransaction={processing}
    />
  );
};
