import React, { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { History } from 'history';

import DoubleCardContainer from '../../components/DoubleCardContainer';
import Cart from '../../components/Cart/Cart';
import CartAmount from '../../components/Cart/CartAmount';

import { ROUTES } from '../../constants/routes';
import { ACTIONS } from '../../constants/fio';
import { CURRENCY_CODES } from '../../constants/common';

import MathOp from '../../util/math';
import { handleFreeAddressCart, totalCost } from '../../utils';
import { convertFioPrices } from '../../util/prices';
import { useWalletBalances } from '../../util/hooks';
import useEffectOnce from '../../hooks/general';

import apis from '../../api';

import {
  CartItem,
  DeleteCartItem,
  Domain,
  FioWalletDoublet,
  PaymentOptionsProps,
  Prices,
} from '../../types';
import { CreateOrderActionData } from '../../redux/types';

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
  createOrder: (params: CreateOrderActionData) => void;
  clearOrder: () => void;
};

const CartPage: React.FC<Props> = props => {
  const {
    cartItems,
    history,
    prices,
    userWallets,
    paymentWalletPublicKey,
    isAuthenticated,
    hasFreeAddress,
    roe,
    refreshBalance,
    setWallet,
    recalculate,
    createOrder,
    clearOrder,
  } = props;

  const walletJson = JSON.stringify(userWallets);
  const cartItemsJson = JSON.stringify(cartItems);

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

  const checkout = (paymentOption: PaymentOptionsProps) => {
    const { costUsdc: totalUsdc } = totalCost(cartItems, roe);

    createOrder({
      total: totalUsdc,
      roe,
      publicKey: paymentWalletPublicKey,
      paymentProcessor: paymentOption,
      items: cartItems.map(
        ({ address, domain, isFree, costNativeFio, costUsdc }) => ({
          action: address
            ? ACTIONS.registerFioAddress
            : ACTIONS.registerFioDomain,
          address,
          domain,
          params: {
            owner_fio_public_key: paymentWalletPublicKey,
          },
          nativeFio: `${costNativeFio || 0}`,
          price: costUsdc,
          priceCurrency: CURRENCY_CODES.USDC,
        }),
      ),
    });

    return history.push(ROUTES.CHECKOUT, { paymentOption });
  };

  const recalculateBalance = () => {
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

    return { updatedTotalPrice, updatedFree, updatedCartItems };
  };

  const allowCheckout = (): boolean => {
    if (totalCartNativeAmount > 0) {
      const {
        updatedTotalPrice,
        updatedFree,
        updatedCartItems,
      } = recalculateBalance();

      if (updatedFree) return true;

      const isEqualPrice = new MathOp(totalCartNativeAmount).eq(
        updatedTotalPrice,
      );

      handlePriceChange(!isEqualPrice);

      if (isEqualPrice) return true;

      recalculate(updatedCartItems);
      return false;
    } else {
      handlePriceChange(false);
      return true;
    }
  };

  const onPaymentChoose = (paymentOption: PaymentOptionsProps) => {
    if (allowCheckout() && paymentOption) checkout(paymentOption);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      history.push(ROUTES.FIO_ADDRESSES_SELECTION);
    }
    handleFreeAddressCart({
      recalculate,
      cartItems: JSON.parse(cartItemsJson),
      prices,
      hasFreeAddress,
      roe,
    });
  }, [
    isAuthenticated,
    hasFreeAddress,
    roe,
    history,
    prices,
    cartItemsJson,
    recalculate,
  ]);

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
    clearOrder();
  }, [walletJson, refreshBalance, setWallet, clearOrder]);

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
    totalCartNativeAmount,
    onPaymentChoose,
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
