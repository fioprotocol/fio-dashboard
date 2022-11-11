import React from 'react';

import DoubleCardContainer from '../../components/DoubleCardContainer';
import Cart from '../../components/Cart/Cart';
import CartAmount from '../../components/Cart/CartAmount';

import { useContext } from './CartPageContext';

const CartPage: React.FC = () => {
  const {
    cartItems,
    hasGetPricesError,
    error,
    hasLowBalance,
    isFree,
    isPriceChanged,
    selectedPaymentProvider,
    disabled,
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
  };

  const cartAmountProps = {
    isFree,
    selectedPaymentProvider,
    disabled,
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

export default CartPage;
