import { FC, useState } from 'react';
import { Fio as LedgerFioApp } from 'ledgerjs-hw-app-fio/dist/fio';
import EyeIcon from '@mui/icons-material/RemoveRedEye';

import classnames from 'classnames';

import { FioWalletDoublet } from '../../types';
import {
  CONFIRM_LEDGER_ACTIONS,
  WALLET_CREATED_FROM,
} from '../../constants/common';
import { getPubKeyFromLedger } from '../../util/ledger';

import SubmitButton from '../common/SubmitButton/SubmitButton';

import LedgerConnect from '../LedgerConnect';

import classes from './LedgerCheckPublicAddress.module.scss';

type Props = {
  className?: string;
  fioWallet: FioWalletDoublet;
  withEye?: boolean;
};

export const LedgerCheckPublicAddress: FC<Props> = ({
  className,
  fioWallet,
  withEye,
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
        className={classnames(classes.button, className)}
        text={
          <div className={classes.content}>
            {withEye && <EyeIcon />}
            <span>Show Public Address on Ledger</span>
          </div>
        }
        hasAutoWidth
        hasSmallPaddings
        hasSmallText
        hasLowHeight
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
