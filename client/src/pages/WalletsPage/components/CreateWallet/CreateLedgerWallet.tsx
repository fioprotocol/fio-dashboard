import React from 'react';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';

import LedgerConnect from '../../../../components/LedgerConnect';

import { getPubKeyFromLedger } from '../../../../util/ledger';
import { log } from '../../../../util/general';

import {
  CONFIRM_LEDGER_ACTIONS,
  WALLET_CREATED_FROM,
} from '../../../../constants/common';

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
      log.error(e);
      throw e;
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
      action={CONFIRM_LEDGER_ACTIONS.CREATE_WALLET}
      data={values}
      onConnect={createLedgerWallet}
      onSuccess={onWalletDataPrepared}
      onCancel={onOptionCancel}
      setProcessing={setProcessing}
    />
  );
};

export default CreateLedgerWallet;
