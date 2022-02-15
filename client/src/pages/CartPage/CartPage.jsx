import React, { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { withLastLocation } from 'react-router-last-location';

import { ROUTES } from '../../constants/routes';
import DoubleCardContainer from '../../components/DoubleCardContainer';
import Cart from '../../components/Cart/Cart';
import CartAmount from '../../components/Cart/CartAmount';
import { handleFreeAddressCart, totalCost } from '../../utils';
import MathOp from '../../util/math';

const CartPage = props => {
  const {
    cartItems,
    history,
    recalculate,
    prices,
    domains,
    userWallets,
    setWallet,
    paymentWalletPublicKey,
    lastLocation,
    refreshBalance,
    isAuthenticated,
    hasFreeAddress,
  } = props;

  const [isPriceChanged, handlePriceChange] = useState(false);

  const walletCount = userWallets.length;

  const totalCartAmount = (cartItems && totalCost(cartItems).costFio) || 0;

  const isFree =
    !isEmpty(cartItems) &&
    cartItems.length === 1 &&
    cartItems.every(item => !item.costFio && !item.costUsdc);

  const {
    usdt: { address: usdcAddressPrice, domain: usdcDomainPrice },
    fio: { address: fioAddressPrice, domain: fioDomainPrice },
  } = prices;

  const recalculateBalance = () => {
    if (totalCartAmount > 0) {
      const updatedCartItems = cartItems.map(item => {
        if (!item.costFio) return item;

        const retObj = { ...item };

        if (!item.address) {
          retObj.costFio = fioDomainPrice;
          retObj.costUsdc = usdcDomainPrice;
        } else {
          retObj.costFio = fioAddressPrice;
          retObj.costUsdc = usdcAddressPrice;
        }

        if (item.hasCustomDomain) {
          retObj.costFio = new MathOp(retObj.costFio)
            .add(fioDomainPrice)
            .toNumber();
          retObj.costUsdc = new MathOp(retObj.costUsdc)
            .add(usdcDomainPrice)
            .toNumber();
        }

        return retObj;
      });

      const { costFio: updatedTotalPrice, costFree: updatedFree } = totalCost(
        updatedCartItems,
      );

      if (updatedFree) return history.push(ROUTES.CHECKOUT);
      const isEqualPrice = new MathOp(totalCartAmount).eq(updatedTotalPrice);

      handlePriceChange(!isEqualPrice);

      if (isEqualPrice) return history.push(ROUTES.CHECKOUT);
      recalculate(updatedCartItems);
    } else {
      handlePriceChange(false);
      history.push(ROUTES.CHECKOUT);
    }
  };

  useEffect(() => {
    if (
      !isEmpty(cartItems) &&
      cartItems.length === 1 &&
      userWallets.length === 1 &&
      lastLocation.pathname ===
        (ROUTES.FIO_ADDRESSES_SELECTION || ROUTES.FIO_DOMAINS_SELECTION)
    ) {
      history.push(ROUTES.CHECKOUT);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      history.push(ROUTES.FIO_ADDRESSES_SELECTION);
    }
    handleFreeAddressCart({
      domains,
      recalculate,
      cartItems,
      prices,
      hasFreeAddress,
    });
  }, [isAuthenticated, domains, hasFreeAddress]);

  useEffect(() => {
    if (!isEmpty(userWallets)) {
      for (const fioWallet of userWallets) {
        if (fioWallet.publicKey) {
          refreshBalance(fioWallet.publicKey);
        }
      }
      if (walletCount === 1) {
        setWallet(userWallets[0].publicKey);
      }
    }
  }, []);

  const currentWallet =
    paymentWalletPublicKey &&
    !isEmpty(userWallets) &&
    userWallets.find(item => item.publicKey === paymentWalletPublicKey);

  const hasLowBalance =
    !isEmpty(currentWallet) &&
    currentWallet.balance !== null &&
    currentWallet.balance < totalCartAmount;

  const additionalProps = {
    hasLowBalance,
    walletCount,
    setWallet,
    selectedWallet: currentWallet,
    isFree,
    totalCartAmount,
    isPriceChanged,
    recalculateBalance,
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
