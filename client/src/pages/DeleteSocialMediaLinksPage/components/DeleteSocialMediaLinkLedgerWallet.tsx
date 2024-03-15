import React from 'react';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';

import LedgerConnect from '../../../components/LedgerConnect';

import { CONFIRM_LEDGER_ACTIONS } from '../../../constants/common';
import { TOKEN_LINK_MIN_WAIT_TIME } from '../../../constants/fio';

import { minWaitTimeFunction } from '../../../utils';
import { linkTokensLedger } from '../../../api/middleware/fio';

import {
  FioWalletDoublet,
  LinkActionResult,
  PublicAddressDoublet,
} from '../../../types';
import { CheckedSocialMediaLinkType } from '../types';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: LinkActionResult) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: {
    fch: string;
    socialMediaLinksList: CheckedSocialMediaLinkType[] | null;
  };
  processing: boolean;
  fee: number;
};

export const DeleteSocialMediaLinkLedgerWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    submitData,
    processing,
  } = props;

  const submit = async (appFio: LedgerFioApp) => {
    const disconnectList = submitData.socialMediaLinksList.filter(
      socialMediaLinkItem => socialMediaLinkItem.isChecked,
    );
    const params: {
      fioAddress: string;
      disconnectList: PublicAddressDoublet[];
      appFio: LedgerFioApp;
      fioWallet: FioWalletDoublet;
    } = {
      fioAddress: submitData.fch,
      disconnectList,
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
      action={CONFIRM_LEDGER_ACTIONS.DELETE_TOKEN}
      data={submitData}
      fioWallet={fioWallet}
      onConnect={submit}
      onSuccess={onSuccess}
      onCancel={onCancel}
      setProcessing={setProcessing}
      isTransaction={processing}
    />
  );
};
