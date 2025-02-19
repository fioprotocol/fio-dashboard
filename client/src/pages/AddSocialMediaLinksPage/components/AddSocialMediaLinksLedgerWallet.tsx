import React from 'react';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';

import LedgerConnect from '../../../components/LedgerConnect';

import { CHAIN_CODES, CONFIRM_LEDGER_ACTIONS } from '../../../constants/common';
import { TOKEN_LINK_MIN_WAIT_TIME } from '../../../constants/fio';

import { minWaitTimeFunction } from '../../../utils';
import { linkTokensLedger } from '../../../api/middleware/fio';

import {
  FioWalletDoublet,
  LinkActionResult,
  PublicAddressDoublet,
} from '../../../types';
import { AddSocialMediaLinkValues } from '../types';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: LinkActionResult) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: AddSocialMediaLinkValues;
  processing: boolean;
  fee: string;
};

export const AddSocialMediaLinksLedgerWallet: React.FC<Props> = props => {
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
    const params: {
      fioAddress: string;
      connectList: PublicAddressDoublet[];
      appFio: LedgerFioApp;
      fioWallet: FioWalletDoublet;
    } = {
      fioAddress: submitData.fch,
      connectList: Object.entries(submitData.socialMediaLinksList).map(
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
      appFio,
      fioWallet,
    };

    return await minWaitTimeFunction(
      () => linkTokensLedger(params),
      TOKEN_LINK_MIN_WAIT_TIME,
    );
  };

  if (!submitData) return null;

  return (
    <LedgerConnect
      action={CONFIRM_LEDGER_ACTIONS.ADD_TOKEN}
      data={submitData}
      fee={fee}
      fioWallet={fioWallet}
      onConnect={submit}
      onSuccess={onSuccess}
      onCancel={onCancel}
      setProcessing={setProcessing}
      isTransaction={processing}
    />
  );
};
