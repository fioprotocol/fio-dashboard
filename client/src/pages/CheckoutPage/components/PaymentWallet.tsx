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
  fioWallets: FioWalletDoublet[];
  paymentWalletPublicKey: string;
  fioWalletsBalances: WalletsBalances;
  walletBalances: WalletBalancesItem;
  walletName: string;
  costFree?: string;
  isFree: boolean;
  setWallet: (publicKey: string) => void;
};

export const PaymentWallet: React.FC<Props> = props => {
  const {
    fioWallets,
    paymentWalletPublicKey,
    fioWalletsBalances,
    walletBalances,
    walletName,
    costFree,
    isFree,
    setWallet,
  } = props;

  const walletsList = fioWallets
    .filter(wallet => (isFree ? wallet : wallet.available > 0))
    .sort((a, b) => b.available - a.available || a.name.localeCompare(b.name))
    .map(wallet => {
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

  if (fioWallets.length === 1)
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
        <h6 className={classes.subtitle}>FIO wallet Payment & Assignment</h6>
        <p className={classes.text}>
          Please choose which FIO wallet you would like to use for payment and
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
        hasLightBorder={true}
        withoutMarginBottom={true}
      />
    </>
  );
};
