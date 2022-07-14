import React from 'react';
import isEmpty from 'lodash/isEmpty';

import CartItem from '../../../components/Cart/CartItem';
import PriceBadge from '../../../components/Badges/PriceBadge/PriceBadge';
import { BADGE_TYPES } from '../../../components/Badge/Badge';

import { PaymentWallet } from './PaymentWallet';

import { totalCost } from '../../../utils';

import {
  CartItem as CartItemType,
  FioWalletDoublet,
  WalletsBalances,
  WalletBalancesItem,
} from '../../../types';

import classes from '../../PurchasePage/styles/PurchasePage.module.scss';

type Props = {
  cart: CartItemType[];
  walletBalances: WalletBalancesItem;
  walletName: string;
  roe: number | null;
  fioWallets: FioWalletDoublet[];
  paymentWalletPublicKey: string;
  fioWalletsBalances: WalletsBalances;
  setWallet: (publicKey: string) => void;
};

export const CheckoutComponent: React.FC<Props> = props => {
  const {
    cart,
    walletBalances,
    walletName,
    roe,
    fioWallets,
    paymentWalletPublicKey,
    fioWalletsBalances,
    setWallet,
  } = props;
  const { costNativeFio, costFree, costFio, costUsdc } = totalCost(cart, roe);

  return (
    <>
      <div className={classes.details}>
        <h6 className={classes.subtitle}>Purchase Details</h6>
        {!isEmpty(cart) &&
          cart.map(item => <CartItem item={item} key={item.id} />)}
      </div>
      <div className={classes.details}>
        <h6 className={classes.subtitle}>Payment Details</h6>
        <PriceBadge
          paymentAmount={costFio}
          convertedPaymentAmount={costUsdc}
          costFree={!costNativeFio && costFree}
          title="Total Cost"
          type={BADGE_TYPES.BLACK}
        />
      </div>
      <PaymentWallet
        fioWallets={fioWallets}
        paymentWalletPublicKey={paymentWalletPublicKey}
        fioWalletsBalances={fioWalletsBalances}
        setWallet={setWallet}
        walletBalances={walletBalances}
        walletName={walletName}
        costFree={costFree}
      />
    </>
  );
};
