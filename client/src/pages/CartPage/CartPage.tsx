import React, { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { History } from 'history';
import { useLastLocation } from 'react-router-last-location';

import DoubleCardContainer from '../../components/DoubleCardContainer';
import Cart from '../../components/Cart/Cart';
import CartAmount from '../../components/Cart/CartAmount';

import { ROUTES } from '../../constants/routes';

import MathOp from '../../util/math';
import { handleFreeAddressCart, totalCost } from '../../utils';
import { useWalletBalances } from '../../util/hooks';
import { convertFioPrices } from '../../util/prices';

import apis from '../../api';

import {
  CartItem,
  DeleteCartItem,
  Domain,
  FioWalletDoublet,
  Prices,
} from '../../types';
import useEffectOnce from '../../hooks/general';

type Props = {
  cartItems: CartItem[];
  history: History;
  prices: Prices;
  domains: Domain[];
  userWallets: FioWalletDoublet[];
  paymentWalletPublicKey: string;
  isAuthenticated: boolean;
  hasFreeAddress: boolean;
  roe: number | null;
  setWallet: (publicKey: string) => void;
  refreshBalance: (publicKey: string) => void;
  recalculate: (cartItems: CartItem[]) => {};
  deleteItem: (params: DeleteCartItem) => {};
};

const CartPage: React.FC<Props> = props => {
  const {
    cartItems,
    history,
    recalculate,
    prices,
    userWallets,
    setWallet,
    paymentWalletPublicKey,
    refreshBalance,
    isAuthenticated,
    hasFreeAddress,
    roe,
  } = props;

  const lastLocation = useLastLocation();
  const walletJson = JSON.stringify(userWallets);
  const [isPriceChanged, handlePriceChange] = useState(false);

  const walletCount = userWallets.length;
  const lastLocationPathname = lastLocation?.pathname || '';

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

  useEffectOnce(() => {
    if (
      !isEmpty(cartItems) &&
      cartItems.length === 1 &&
      walletCount === 1 &&
      lastLocation.pathname ===
        (ROUTES.FIO_ADDRESSES_SELECTION || ROUTES.FIO_DOMAINS_SELECTION)
    ) {
      history.push(ROUTES.CHECKOUT);
    }
  }, [cartItems, history, lastLocationPathname, walletCount]);

  useEffect(() => {
    if (!isAuthenticated) {
      history.push(ROUTES.FIO_ADDRESSES_SELECTION);
    }
    handleFreeAddressCart({
      recalculate,
      cartItems,
      prices,
      hasFreeAddress,
    });
  }, [isAuthenticated, hasFreeAddress]);

  useEffectOnce(() => {
    const wallets = JSON.parse(walletJson);
    if (!isEmpty(wallets)) {
      for (const fioWallet of wallets) {
        if (fioWallet.publicKey) {
          refreshBalance(fioWallet.publicKey);
        }
      }
      if (wallets.length === 1) {
        setWallet(wallets[0].publicKey);
      }
    }
  }, [walletJson, refreshBalance, setWallet]);

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
      bigCart={<Cart {...props} {...additionalProps} />}
      smallCart={<CartAmount {...props} {...additionalProps} />}
    />
  );
};

export default CartPage;
