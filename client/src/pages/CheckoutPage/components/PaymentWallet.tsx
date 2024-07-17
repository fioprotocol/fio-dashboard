import React from 'react';

import CustomDropdown from '../../../components/CustomDropdown';
import PayWithBadge from '../../../components/Badges/PayWithBadge/PayWithBadge';
import { PayWalletInfo } from '../../../components/Badges/PayWithBadge/PayWalletInfo';
import Loader from '../../../components/Loader/Loader';

import MathOp from '../../../util/math';

import {
  FioWalletDoublet,
  WalletsBalances,
  WalletBalancesItem,
} from '../../../types';

import classes from '../CheckoutPage.module.scss';

type Props = {
  fioWallets: FioWalletDoublet[];
  paymentWalletPublicKey: string;
  fioWalletsBalances: WalletsBalances;
  walletBalances: WalletBalancesItem;
  paymentWallet?: FioWalletDoublet;
  costFree?: string;
  includePaymentMessage: boolean;
  setWallet: (publicKey: string) => void;
};

export const PaymentWallet: React.FC<Props> = props => {
  const {
    fioWallets,
    paymentWalletPublicKey,
    fioWalletsBalances,
    walletBalances,
    paymentWallet,
    costFree,
    includePaymentMessage,
    setWallet,
  } = props;

  if (
    fioWallets.length === 0 ||
    !fioWalletsBalances.wallets[paymentWalletPublicKey]
  ) {
    return <Loader />;
  }

  const walletsList = fioWallets.reduce((acc, wallet) => {
    const walletBalances = fioWalletsBalances.wallets[wallet.publicKey];
    if (!walletBalances) return acc;
    const { fio, usdc } = walletBalances.available;

    // Default option render is not updating when balances changed. We need to wait when balances are set.
    if (new MathOp(usdc).eq(0) && !new MathOp(fio).eq(0)) return acc;

    acc.push({
      id: wallet.publicKey,
      name: (
        <div className="p-2">
          <PayWalletInfo
            walletName={wallet.name}
            fioBalance={fio}
            usdcBalance={usdc}
          />
        </div>
      ),
    });

    return acc;
  }, []);

  // Waiting to default value set
  if (!walletsList.find(({ id }) => id === paymentWalletPublicKey))
    return <Loader />;

  if (walletsList.length === 1 && includePaymentMessage)
    return (
      <PayWithBadge
        costFree={!!costFree}
        walletBalances={walletBalances}
        walletName={paymentWallet?.name}
      />
    );

  return (
    <>
      <div className={classes.details}>
        <h6 className={classes.subtitle}>
          FIO wallet {includePaymentMessage ? 'Payment & ' : ''}Assignmentt
        </h6>
        <p className={classes.text}>
          Please choose which FIO wallet you would like to use for{' '}
          {includePaymentMessage ? 'payment and ' : ''}
          assignment
        </p>
      </div>

      <CustomDropdown
        onChange={setWallet}
        options={walletsList}
        isWhite={true}
        isSimple={true}
        hasAutoHeight={true}
        value={paymentWalletPublicKey}
        hasBigBorderRadius={true}
        isBlackPlaceholder={true}
        withoutMarginBottom={true}
      />
    </>
  );
};
