import React from 'react';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';

import LedgerConnect from '../../../../components/LedgerConnect';

import { getPath } from '../../../../util/ledger';

import { FioWalletDoublet } from '../../../../types';

type Props = {
  submitData: boolean | null;
  fioWallet: FioWalletDoublet;
  viewingAddressInLedger: boolean;
  onSuccess: (data: string | null) => void;
  onCancel: () => void;
  setProcessing: (processing: boolean) => void;
  setViewingAddressInLedger: (viewing: boolean) => void;
};

const ViewPubAddressLedgerWallet: React.FC<Props> = props => {
  const {
    submitData,
    fioWallet,
    viewingAddressInLedger,
    onSuccess,
    onCancel,
    setProcessing,
    setViewingAddressInLedger,
  } = props;

  const view = async (appFio: LedgerFioApp) => {
    setViewingAddressInLedger(true);
    try {
      const { publicKeyWIF } = await appFio.getPublicKey({
        path: getPath(fioWallet.data.derivationIndex),
        show_or_not: true,
      });

      return publicKeyWIF;
    } catch (e) {
      return null;
    }
  };

  if (!submitData) return null;

  return (
    <LedgerConnect
      fioWallet={fioWallet}
      onConnect={view}
      onSuccess={onSuccess}
      onCancel={onCancel}
      setProcessing={setProcessing}
      hideConnectionModal={viewingAddressInLedger}
    />
  );
};

export default ViewPubAddressLedgerWallet;
