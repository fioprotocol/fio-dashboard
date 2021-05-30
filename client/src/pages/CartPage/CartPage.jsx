import React, { useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import { withLastLocation } from 'react-router-last-location';

import { ROUTES } from '../../constants/routes';
import DoubleCardContainer from '../../components/DoubleCardContainer';
import Cart from '../../components/Cart/Cart';
import CartAmount from '../../components/Cart/CartAmount';
import { handleFreeAddressCart, totalCost } from '../../utils';

const CartPage = props => {
  const {
    cartItems,
    history,
    fioWallets,
    recalculate,
    prices,
    account,
    domains,
    userWallets,
    setWallet,
    paymentWallet,
    lastLocation,
  } = props;

  const walletCount = userWallets.length;

  const totalCartAmount =
    (cartItems && parseFloat(totalCost(cartItems).costFio)) || 0;
  const hasLowBalance =
    paymentWallet && paymentWallet.balance < totalCartAmount;

  const isFree =
    !isEmpty(cartItems) &&
    cartItems.length === 1 &&
    cartItems.every(item => !item.costFio && !item.costUsdc);

  useEffect(() => {
    if (
      !isEmpty(cartItems) &&
      cartItems.length === 1 &&
      userWallets.length === 1 &&
      lastLocation.pathname === (ROUTES.FIO_ADDRESSES || ROUTES.FIO_DOMAINS)
    ) {
      history.push(ROUTES.CHECKOUT);
    }
  }, []);

  useEffect(async () => {
    if (!account) {
      history.push(ROUTES.FIO_ADDRESSES);
    }
    await handleFreeAddressCart({
      domains,
      fioWallets,
      recalculate,
      cartItems,
      prices,
    });
  }, [account, domains, fioWallets]);

  useEffect(() => {
    userWallets && walletCount === 1 && setWallet(userWallets[0]);
  }, []);

  const additionalProps = {
    hasLowBalance,
    walletCount,
    setWallet,
    selectedWallet: paymentWallet,
    isFree,
    totalCartAmount,
  };

  return (
    <DoubleCardContainer
      title="Your Cart"
      secondTitle="Amount Due"
      bigCart={<Cart {...props} {...additionalProps} />}
      smallCart={<CartAmount {...props} {...additionalProps} />}
    />
  );
};

export default withLastLocation(CartPage);
