import React from 'react';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';

import LedgerConnect from '../../../components/LedgerConnect';

import { CONFIRM_LEDGER_ACTIONS } from '../../../constants/common';
import { TOKEN_LINK_MIN_WAIT_TIME } from '../../../constants/fio';

import { minWaitTimeFunction } from '../../../utils';
import { linkTokensLedger } from '../../../api/middleware/fio';

import {
  FioWalletDoublet,
  PublicAddressDoublet,
  LinkActionResult,
} from '../../../types';
import { EditTokenValues } from '../types';

type Props = {
  fioWallet: FioWalletDoublet;
  onSuccess: (data: LinkActionResult) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  submitData: EditTokenValues | null;
  processing: boolean;
  fee: number;
};

const EditTokenLedgerWallet: React.FC<Props> = props => {
  const {
    fioWallet,
    setProcessing,
    onSuccess,
    onCancel,
    submitData,
    processing,
  } = props;

  const submit = async (appFio: LedgerFioApp) => {
    const editedPubAddresses = submitData.pubAddressesArr.filter(
      pubAddress => pubAddress.newPublicAddress,
    );
    const params: {
      fioAddress: string;
      connectList: PublicAddressDoublet[];
      appFio: LedgerFioApp;
      fioWallet: FioWalletDoublet;
    } = {
      fioAddress: submitData.fioAddressName,
      connectList: editedPubAddresses.map(pubAddress => ({
        ...pubAddress,
        publicAddress: pubAddress.newPublicAddress,
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
        updated: editedPubAddresses,
      },
    };
  };

  if (!submitData) return null;

  return (
    <LedgerConnect
      action={CONFIRM_LEDGER_ACTIONS.EDIT_TOKEN}
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

export default EditTokenLedgerWallet;
