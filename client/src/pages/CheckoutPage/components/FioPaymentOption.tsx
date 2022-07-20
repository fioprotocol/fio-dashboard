import React from 'react';

import PurchaseNow from '../../../components/PurchaseNow';

import { PaymentWallet } from './PaymentWallet';

import { PaymentOptionComponentProps } from '../types';

export const FioPaymentOption: React.FC<PaymentOptionComponentProps> = props => {
  const {
    fioWallets,
    paymentWalletPublicKey,
    fioWalletsBalances,
    walletBalances,
    walletName,
    costFree,
    isFree,
    onFinish,
    setWallet,
  } = props;

  return (
    <>
      <PaymentWallet
        fioWallets={fioWallets}
        paymentWalletPublicKey={paymentWalletPublicKey}
        fioWalletsBalances={fioWalletsBalances}
        walletBalances={walletBalances}
        walletName={walletName}
        costFree={costFree}
        isFree={isFree}
        setWallet={setWallet}
      />
      <PurchaseNow onFinish={onFinish} />
    </>
  );
};
