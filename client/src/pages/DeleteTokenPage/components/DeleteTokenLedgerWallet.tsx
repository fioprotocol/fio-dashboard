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
import { DeleteTokenValues } from '../types';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: LinkActionResult) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: DeleteTokenValues | null;
  processing: boolean;
  fee: number;
};

const DeleteTokenLedgerWallet: React.FC<Props> = props => {
  const {
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
      disconnectList: PublicAddressDoublet[];
      disconnectAll: boolean;
      appFio: LedgerFioApp;
      fioWallet: FioWalletDoublet;
    } = {
      fioAddress: submitData.fioCryptoHandle.name,
      disconnectList: submitData.pubAddressesArr.filter(
        pubAddress => pubAddress.isChecked,
      ),
      disconnectAll: submitData.allChecked,
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

export default DeleteTokenLedgerWallet;
