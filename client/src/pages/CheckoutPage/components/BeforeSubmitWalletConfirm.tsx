import React from 'react';

import WalletAction from '../../../components/WalletAction/WalletAction';
import BeforeSubmitEdgeWallet from './BeforeSubmitEdgeWallet';
import { BeforeSubmitMetamaskWallet } from './BeforeSubmitMetamaskWallet';

import BeforeSubmitLedgerWallet from './BeforeSubmitLedgerWallet';

import { CONFIRM_PIN_ACTIONS } from '../../../constants/common';

import { BeforeSubmitProps } from '../types';

const BeforeSubmitWalletConfirm: React.FC<BeforeSubmitProps> = props => {
  const {
    fioWallet,
    fee,
    onCancel,
    onSuccess,
    submitData,
    processing,
    setProcessing,
  } = props;

  return (
    <>
      <WalletAction
        fioWallet={fioWallet}
        fee={fee}
        onCancel={onCancel}
        onSuccess={onSuccess}
        submitData={submitData}
        processing={processing}
        setProcessing={setProcessing}
        action={CONFIRM_PIN_ACTIONS.REGISTER_ADDRESS_PRIVATE_DOMAIN}
        FioActionWallet={BeforeSubmitEdgeWallet}
        LedgerActionWallet={BeforeSubmitLedgerWallet}
        MetamaskActionWallet={BeforeSubmitMetamaskWallet}
      />
    </>
  );
};

export default BeforeSubmitWalletConfirm;
