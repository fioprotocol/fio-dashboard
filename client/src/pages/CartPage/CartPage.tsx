import React from 'react';

import DoubleCardContainer from '../../components/DoubleCardContainer';
import Cart from '../../components/Cart/Cart';
import CartAmount from '../../components/Cart/CartAmount';

import { useContext } from './CartPageContext';

const CartPage: React.FC = () => {
  const {
    cartId,
    cartItems,
    hasGetPricesError,
    error,
    hasLowBalance,
    isFree,
    isPriceChanged,
    selectedPaymentProvider,
    disabled,
    paymentWalletPublicKey,
    roe,
    showExpiredDomainWarningBadge,
    totalCartAmount,
    totalCartUsdcAmount,
    totalCartNativeAmount,
    userWallets,
    walletBalancesAvailable,
    walletCount,
    onPaymentChoose,
  } = useContext();

  const commonProps = {
    cartId,
    cartItems,
    hasLowBalance,
    roe,
    userWallets,
    error,
  };

  const cartProps = {
    isPriceChanged,
    hasGetPricesError,
    totalCartAmount,
    totalCartNativeAmount,
    walletBalancesAvailable,
    walletCount,
  };

  const cartAmountProps = {
    isFree,
    selectedPaymentProvider,
    disabled,
    paymentWalletPublicKey,
    showExpiredDomainWarningBadge,
    totalCartAmount,
    totalCartUsdcAmount,
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
