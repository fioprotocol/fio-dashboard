import React from 'react';

import DoubleCardContainer from '../../components/DoubleCardContainer';
import Cart from '../../components/Cart/Cart';
import CartAmount from '../../components/Cart/CartAmount';

import { useContext } from './CartPageContext';

export const CartPage: React.FC = () => {
  const {
    cartItems,
    hasGetPricesError,
    error,
    hasLowBalance,
    isFree,
    isPriceChanged,
    loading,
    paymentWalletPublicKey,
    prices,
    roe,
    totalCartAmount,
    totalCartNativeAmount,
    userWallets,
    walletBalancesAvailable,
    walletCount,
    deleteItem,
    onPaymentChoose,
    setWallet,
  } = useContext();

  const commonProps = {
    cartItems,
    hasLowBalance,
    roe,
    userWallets,
    error,
  };

  const cartProps = {
    isPriceChanged,
    hasGetPricesError,
    prices,
    totalCartAmount,
    totalCartNativeAmount,
    walletBalancesAvailable,
    walletCount,
    deleteItem,
    setWallet,
  };

  const cartAmountProps = {
    isFree,
    loading,
    paymentWalletPublicKey,
    totalCartNativeAmount,
    onPaymentChoose,
  };

  return (
    <DoubleCardContainer
      title="Your Cart"
      bigCart={<Cart {...commonProps} {...cartProps} />}
      smallCart={<CartAmount {...commonProps} {...cartAmountProps} />}
    />
  );
};
