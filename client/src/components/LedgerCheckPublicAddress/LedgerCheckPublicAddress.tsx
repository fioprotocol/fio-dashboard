import { FC, useState } from 'react';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';

import { FioWalletDoublet } from '../../types';
import {
  CONFIRM_LEDGER_ACTIONS,
  WALLET_CREATED_FROM,
} from '../../constants/common';
import { getPubKeyFromLedger } from '../../util/ledger';

import SubmitButton from '../common/SubmitButton/SubmitButton';

import LedgerConnect from '../LedgerConnect';

type Props = {
  className?: string;
  fioWallet: FioWalletDoublet;
};

export const LedgerCheckPublicAddress: FC<Props> = ({
  className,
  fioWallet,
}) => {
  const isLedgerWallet = fioWallet?.from === WALLET_CREATED_FROM.LEDGER;

  const [isLedgerAddressVisible, setIsLedgerAddressVisible] = useState(false);

  if (!isLedgerWallet) {
    return null;
  }

  const handleShowLedgerAddress = (appFio: LedgerFioApp) => {
    void getPubKeyFromLedger(appFio, fioWallet.data.derivationIndex, true);
  };

  const handleShowPublicAddress = () => {
    setIsLedgerAddressVisible(true);
  };

  const handleHidePublicAddress = () => {
    setIsLedgerAddressVisible(false);
  };

  return (
    <>
      <SubmitButton
        className={className}
        text="Show Public Address on Ledger"
        hasLowHeight
        hasAutoWidth
        withoutMargin
        onClick={handleShowPublicAddress}
      />
      {isLedgerAddressVisible && (
        <LedgerConnect
          action={CONFIRM_LEDGER_ACTIONS.VIEW_PUB_ADDRESS}
          fioWallet={fioWallet}
          onSuccess={handleHidePublicAddress}
          onCancel={handleHidePublicAddress}
          onConnect={handleShowLedgerAddress}
        />
      )}
    </>
  );
};
