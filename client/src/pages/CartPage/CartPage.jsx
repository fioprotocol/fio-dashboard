import React, { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { withLastLocation } from 'react-router-last-location';

import { ROUTES } from '../../constants/routes';
import DoubleCardContainer from '../../components/DoubleCardContainer';
import Cart from '../../components/Cart/Cart';
import CartAmount from '../../components/Cart/CartAmount';
import { handleFreeAddressCart, totalCost } from '../../utils';
import MathOp from '../../util/math';
import { useWalletBalances } from '../../util/hooks';
import { convertFioPrices } from '../../util/prices';

import apis from '../../api';

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
    roe,
  } = props;

  const [isPriceChanged, handlePriceChange] = useState(false);

  const walletCount = userWallets.length;

  const totalCartNativeAmount =
    (cartItems && totalCost(cartItems, roe).costNativeFio) || 0;
  const totalCartAmount = apis.fio
    .sufToAmount(totalCartNativeAmount)
    .toFixed(2);

  const { available: walletBalancesAvailable } = useWalletBalances(
    paymentWalletPublicKey,
  );

  const isFree =
    !isEmpty(cartItems) &&
    cartItems.length === 1 &&
    cartItems.every(item => !item.costNativeFio);

  const {
    nativeFio: { address: nativeFioAddressPrice, domain: nativeFioDomainPrice },
  } = prices;

  const recalculateBalance = () => {
    if (totalCartNativeAmount > 0) {
      const updatedCartItems = cartItems.map(item => {
        if (!item.costNativeFio) return item;

        const retObj = { ...item };

        if (!item.address) {
          retObj.costNativeFio = nativeFioDomainPrice;
        } else {
          retObj.costNativeFio = nativeFioAddressPrice;
        }

        if (item.hasCustomDomain) {
          retObj.costNativeFio = new MathOp(retObj.costNativeFio)
            .add(nativeFioDomainPrice)
            .toNumber();
        }

        const fioPrices = convertFioPrices(retObj.costNativeFio, roe);

        retObj.costFio = fioPrices.fio;
        retObj.costUsdc = fioPrices.usdc;

        return retObj;
      });

      const {
        costNativeFio: updatedTotalPrice,
        costFree: updatedFree,
      } = totalCost(updatedCartItems, roe);

      if (updatedFree) return history.push(ROUTES.CHECKOUT);
      const isEqualPrice = new MathOp(totalCartNativeAmount).eq(
        updatedTotalPrice,
      );

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

  const hasLowBalance =
    !isEmpty(walletBalancesAvailable) &&
    new MathOp(walletBalancesAvailable.nativeFio).lt(totalCartNativeAmount);

  const additionalProps = {
    hasLowBalance,
    walletCount,
    setWallet,
    walletBalancesAvailable,
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
