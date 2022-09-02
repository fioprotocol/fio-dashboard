import React from 'react';

import CustomDropdown from '../../../components/CustomDropdown';
import PayWithBadge from '../../../components/Badges/PayWithBadge/PayWithBadge';
import { PayWalletInfo } from '../../../components/Badges/PayWithBadge/PayWalletInfo';

import {
  FioWalletDoublet,
  WalletsBalances,
  WalletBalancesItem,
} from '../../../types';

import classes from '../../PurchasePage/styles/PurchasePage.module.scss';

type Props = {
  paymentAssignmentWallets: FioWalletDoublet[];
  paymentWalletPublicKey: string;
  fioWalletsBalances: WalletsBalances;
  walletBalances: WalletBalancesItem;
  walletName: string;
  costFree?: string;
  isFree: boolean;
  totalCost: number;
  includePaymentMessage?: boolean;
  setWallet: (publicKey: string) => void;
};

export const PaymentWallet: React.FC<Props> = props => {
  const {
    paymentAssignmentWallets,
    paymentWalletPublicKey,
    fioWalletsBalances,
    walletBalances,
    walletName,
    costFree,
    includePaymentMessage = false,
    setWallet,
  } = props;

  const walletsList = paymentAssignmentWallets.map(wallet => {
    const { fio, usdc } = fioWalletsBalances.wallets[
      wallet.publicKey
    ].available;

    return {
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
    };
  });

  if (walletsList.length === 1 && includePaymentMessage)
    return (
      <PayWithBadge
        costFree={!!costFree}
        walletBalances={walletBalances}
        walletName={walletName}
      />
    );

  return (
    <>
      <div className={classes.details}>
        <h6 className={classes.subtitle}>
          FIO wallet {includePaymentMessage ? 'Payment & ' : ''}Assignment
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
