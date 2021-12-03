import React from 'react';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/lib/fio';

import LedgerConnect from '../../../../components/LedgerConnect';

import { getPubKeyFromLedger } from '../../../../util/ledger';
import { WALLET_CREATED_FROM } from '../../../../constants/common';

import { FioWalletDoublet, NewFioWalletDoublet } from '../../../../types';
import { CreateWalletValues } from '../../types';

type Props = {
  fioWallets: FioWalletDoublet[];
  onWalletDataPrepared: (data: NewFioWalletDoublet) => void;
  onOptionCancel: () => void;
  setProcessing: (processing: boolean) => void;
  values: CreateWalletValues;
};

const CreateLedgerWallet: React.FC<Props> = props => {
  const {
    onWalletDataPrepared,
    fioWallets,
    values,
    onOptionCancel,
    setProcessing,
  } = props;

  const createLedgerWallet = async (appFio: LedgerFioApp) => {
    let publicKey = '';

    let derivationIndex = 0;
    const [device] = await TransportWebUSB.list();
    for (const { data } of fioWallets) {
      if (data != null && data.device === device.productId) {
        derivationIndex =
          derivationIndex <= data.derivationIndex
            ? derivationIndex + 1
            : derivationIndex;
      }
    }

    try {
      publicKey = await getPubKeyFromLedger(appFio, derivationIndex);
    } catch (e) {
      console.error(e);
    }

    if (
      publicKey &&
      !fioWallets.find(
        ({ publicKey: walletPublicKey }) => publicKey === walletPublicKey,
      )
    ) {
      return {
        name: values.name,
        publicKey,
        from: WALLET_CREATED_FROM.LEDGER,
        data: {
          derivationIndex,
          device: device.productId,
        },
        edgeId: '',
      };
    }

    throw new Error('Try to reconnect your ledger device.');
  };

  return (
    <LedgerConnect
      onConnect={createLedgerWallet}
      onSuccess={onWalletDataPrepared}
      onCancel={onOptionCancel}
      setProcessing={setProcessing}
    />
  );
};

export default CreateLedgerWallet;
