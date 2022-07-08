import React, { useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import { History } from 'history';

import PseudoModalContainer from '../../components/PseudoModalContainer';
import CheckoutPurchaseContainer from '../../components/CheckoutPurchaseContainer';
import { RenderCheckout } from '../../components/CheckoutPurchaseContainer/CheckoutPurchaseComponents';

import { ROUTES } from '../../constants/routes';

import '../../helpers/gt-sdk';
import { totalCost, handleFreeAddressCart } from '../../utils';
import { useWalletBalances } from '../../util/hooks';
import MathOp from '../../util/math';

import {
  CartItem,
  Domain,
  FioWalletDoublet,
  Prices,
  WalletsBalances,
} from '../../types';

type Props = {
  loading: boolean;
  fioWallets: FioWalletDoublet[];
  cartItems: CartItem[];
  history: History;
  paymentWalletPublicKey: string;
  isAuthenticated: boolean;
  domains: Domain[];
  hasFreeAddress: boolean;
  prices: Prices;
  isProcessing: boolean;
  roe: number | null;
  fioWalletsBalances: WalletsBalances;
  setWallet: (publicKey: string) => void;
  refreshBalance: (publicKey: string) => void;
  recalculate: (cartItems: CartItem[]) => void;
};

const CheckoutPage: React.FC<Props> = props => {
  const {
    loading,
    fioWallets,
    refreshBalance,
    cartItems,
    history,
    paymentWalletPublicKey,
    isAuthenticated,
    setWallet,
    hasFreeAddress,
    recalculate,
    prices,
    isProcessing,
    roe,
    fioWalletsBalances,
  } = props;

  useEffect(() => {
    if (!isEmpty(fioWallets)) {
      for (const fioWallet of fioWallets) {
        if (fioWallet.publicKey) {
          refreshBalance(fioWallet.publicKey);
        }
      }
      if (!paymentWalletPublicKey && fioWallets.length === 1) {
        const sortedWallets = fioWallets.sort((a, b) => b.balance - a.balance);
        setWallet(sortedWallets[0].publicKey);
      }
    }
  }, []);

  const isFree =
    !isEmpty(cartItems) &&
    cartItems.length === 1 &&
    !hasFreeAddress &&
    cartItems[0].allowFree;

  const paymentWallet = fioWallets.find(
    ({ publicKey }) => publicKey === paymentWalletPublicKey,
  );
  const { available: walletBalancesAvailable } = useWalletBalances(
    paymentWalletPublicKey,
  );

  const title = isFree ? 'Make Purchase' : 'Pay with FIO';

  useEffect(() => {
    if (!isAuthenticated) {
      history.push(ROUTES.FIO_ADDRESSES_SELECTION);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (
      !loading &&
      !isFree &&
      ((paymentWalletPublicKey &&
        new MathOp(walletBalancesAvailable.nativeFio).lt(
          totalCost(cartItems, roe).costNativeFio,
        )) ||
        (!paymentWalletPublicKey && fioWallets.length > 1))
    ) {
      history.push(ROUTES.CART);
    }
  }, [walletBalancesAvailable.nativeFio, paymentWalletPublicKey, loading]);

  useEffect(() => {
    !isProcessing &&
      handleFreeAddressCart({
        recalculate,
        cartItems,
        prices,
        hasFreeAddress,
        roe,
      });
  }, [hasFreeAddress, prices, roe]);

  const onClose = () => {
    history.push(ROUTES.CART);
  };

  return (
    <PseudoModalContainer title={title} onClose={onClose}>
      <CheckoutPurchaseContainer isCheckout history={history}>
        <RenderCheckout
          cart={cartItems}
          walletBalances={walletBalancesAvailable}
          walletName={paymentWallet ? paymentWallet.name : ''}
          paymentWalletPublicKey={paymentWalletPublicKey}
          roe={roe}
          fioWallets={fioWallets}
          setWallet={setWallet}
          fioWalletsBalances={fioWalletsBalances}
        />
      </CheckoutPurchaseContainer>
    </PseudoModalContainer>
  );
};

export default CheckoutPage;
