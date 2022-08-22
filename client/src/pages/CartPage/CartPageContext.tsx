import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import isEmpty from 'lodash/isEmpty';

import { deleteItem, setCartItems, setWallet } from '../../redux/cart/actions';
import { refreshBalance } from '../../redux/fio/actions';
import { createOrder, clearOrder } from '../../redux/order/actions';
import { getPrices } from '../../redux/registrations/actions';

import {
  cartItems as cartItemsSelector,
  paymentWalletPublicKey as paymentWalletPublicKeySelector,
  cartHasItemsWithPrivateDomain as cartHasItemsWithPrivateDomainSelector,
} from '../../redux/cart/selectors';
import { fioWallets as fioWalletsSelector } from '../../redux/fio/selectors';
import {
  isAuthenticated,
  hasFreeAddress as hasFreeAddressSelector,
} from '../../redux/profile/selectors';
import {
  hasGetPricesError as hasGetPricesErrorSelector,
  loading as loadingSelector,
  prices as pricesSelector,
  roe as roeSelector,
} from '../../redux/registrations/selectors';

import { useWalletBalances } from '../../util/hooks';
import { handleFreeAddressCart, totalCost } from '../../utils';
import MathOp from '../../util/math';
import { convertFioPrices } from '../../util/prices';

import { useEffectOnce } from '../../hooks/general';

import { ROUTES } from '../../constants/routes';
import { ACTIONS } from '../../constants/fio';
import { CURRENCY_CODES, WALLET_CREATED_FROM } from '../../constants/common';
import { log } from '../../util/general';

import { FioRegPricesResponse } from '../../api/responses';

import apis from '../../api';

import {
  CartItem,
  DeleteCartItem,
  FioWalletDoublet,
  IncomePrices,
  PaymentOptionsProps,
  Prices,
  WalletBalancesItem,
} from '../../types';

type UseContextReturnType = {
  cartItems: CartItem[];
  hasGetPricesError: boolean;
  error: string | null;
  hasLowBalance: boolean;
  isFree: boolean;
  isPriceChanged: boolean;
  loading: boolean;
  paymentWalletPublicKey: string;
  prices: Prices;
  roe: number;
  totalCartAmount: string;
  totalCartNativeAmount: number;
  userWallets: FioWalletDoublet[];
  walletBalancesAvailable: WalletBalancesItem;
  walletCount: number;
  setWallet: (publicKey: string) => void;
  onPaymentChoose: (paymentOption: PaymentOptionsProps) => Promise<void>;
  deleteItem: (data: DeleteCartItem) => void;
};

export const useContext = (): UseContextReturnType => {
  const cartItems = useSelector(cartItemsSelector);
  const cartHasItemsWithPrivateDomain = useSelector(
    cartHasItemsWithPrivateDomainSelector,
  );
  const hasFreeAddress = useSelector(hasFreeAddressSelector);
  const hasGetPricesError = useSelector(hasGetPricesErrorSelector);
  const isAuth = useSelector(isAuthenticated);
  const loading = useSelector(loadingSelector);
  const paymentWalletPublicKey = useSelector(paymentWalletPublicKeySelector);
  const prices = useSelector(pricesSelector);
  const roe = useSelector(roeSelector);
  const userWallets = useSelector(fioWalletsSelector);

  const dispatch = useDispatch();

  const history = useHistory();

  const walletCount = userWallets.length;

  const [isPriceChanged, handlePriceChange] = useState(false);
  const [isUpdatingPrices, setIsUpdatingPrices] = useState(false);
  const [updatingPricesHasError, setUpdatingPricesHasError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFreeAddressCartFn = () =>
    handleFreeAddressCart({
      cartItems,
      hasFreeAddress,
      prices,
      roe,
      setCartItems: cartItems => dispatch(setCartItems(cartItems)),
    });

  const { available: walletBalancesAvailable } = useWalletBalances(
    paymentWalletPublicKey,
  );

  const isFree =
    !isEmpty(cartItems) &&
    cartItems.length === 1 &&
    cartItems.every(item => !item.costNativeFio);

  const {
    costNativeFio: totalCartNativeAmount,
    costUsdc: totalCartUsdcAmount,
  } = (cartItems && totalCost(cartItems, roe)) || {};

  const totalCartAmount = apis.fio
    .sufToAmount(totalCartNativeAmount)
    .toFixed(2);

  const hasLowBalance =
    !isEmpty(walletBalancesAvailable) &&
    totalCartNativeAmount &&
    new MathOp(walletBalancesAvailable.nativeFio).lt(totalCartNativeAmount);

  const paymentWallet = userWallets.find(
    ({ publicKey }) => publicKey === paymentWalletPublicKey,
  );
  const paymentWalletFrom = paymentWallet && paymentWallet.from;

  const {
    nativeFio: { address: nativeFioAddressPrice, domain: nativeFioDomainPrice },
  } = prices;

  const getFreshPrices = async (): Promise<FioRegPricesResponse> => {
    setIsUpdatingPrices(true);
    try {
      const freshPrices = await apis.fioReg.prices();
      updatingPricesHasError && setUpdatingPricesHasError(false);

      return freshPrices;
    } catch (err) {
      setUpdatingPricesHasError(true);
      log.error(err);
      throw new Error(err);
    } finally {
      setIsUpdatingPrices(false);
    }
  };

  const recalculateBalance = (
    updatedPrices: IncomePrices,
  ): {
    updatedTotalPrice: number;
    updatedFree: string;
    updatedCostUsdc: string;
    updatedCartItems: CartItem[];
  } => {
    const {
      pricing: {
        nativeFio: {
          address: updatedFioAddressPrice = nativeFioAddressPrice,
          domain: updatedFioDomainPrice = nativeFioDomainPrice,
        } = {},
        usdtRoe: updatedRoe = roe,
      } = {},
    } = updatedPrices || {};

    const updatedCartItems = cartItems.map(item => {
      if (!item.costNativeFio) return item;

      const retObj = { ...item };

      if (!item.address) {
        retObj.costNativeFio = updatedFioDomainPrice;
      } else {
        retObj.costNativeFio = updatedFioAddressPrice;
      }

      if (item.hasCustomDomain) {
        retObj.costNativeFio = new MathOp(retObj.costNativeFio)
          .add(updatedFioDomainPrice)
          .toNumber();
      }

      const fioPrices = convertFioPrices(retObj.costNativeFio, updatedRoe);

      retObj.costFio = fioPrices.fio;
      retObj.costUsdc = fioPrices.usdc;

      return retObj;
    });

    const {
      costNativeFio: updatedTotalPrice,
      costFree: updatedFree,
      costUsdc: updatedCostUsdc,
    } = totalCost(updatedCartItems, updatedRoe);

    return {
      updatedTotalPrice,
      updatedFree,
      updatedCostUsdc,
      updatedCartItems,
    };
  };

  const allowCheckout = async (): Promise<boolean> => {
    if (totalCartNativeAmount > 0) {
      try {
        const updatedPrices = await getFreshPrices();

        const {
          updatedTotalPrice,
          updatedFree,
          updatedCostUsdc,
          updatedCartItems,
        } = recalculateBalance(updatedPrices);

        if (updatedFree) return true;

        const isEqualPrice =
          new MathOp(totalCartNativeAmount).eq(updatedTotalPrice) &&
          new MathOp(totalCartUsdcAmount).eq(updatedCostUsdc);

        handlePriceChange(!isEqualPrice);

        if (isEqualPrice) return true;

        dispatch(setCartItems(updatedCartItems));
        dispatch(getPrices());

        return false;
      } catch (err) {
        return false;
      }
    } else {
      handlePriceChange(false);
      return true;
    }
  };

  const checkout = (paymentOption: PaymentOptionsProps) => {
    const { costUsdc: totalUsdc } = totalCost(cartItems, roe);

    dispatch(
      createOrder({
        total: totalUsdc,
        roe,
        publicKey: paymentWalletPublicKey,
        paymentProcessor: paymentOption,
        items: cartItems.map(
          ({ address, domain, costNativeFio, costUsdc, hasCustomDomain }) => {
            const data: {
              hasCustomDomain?: boolean;
              hasCustomDomainFee?: number;
            } = {};

            if (hasCustomDomain) {
              data.hasCustomDomain = hasCustomDomain;
              data.hasCustomDomainFee = new MathOp(costNativeFio)
                .sub(prices.nativeFio.address)
                .toNumber();
            }

            return {
              action: address
                ? ACTIONS.registerFioAddress
                : ACTIONS.registerFioDomain,
              address,
              domain,
              nativeFio: `${costNativeFio || 0}`,
              price: costUsdc,
              priceCurrency: CURRENCY_CODES.USDC,
              data,
            };
          },
        ),
      }),
    );

    return history.push(ROUTES.CHECKOUT, { paymentOption });
  };

  const onPaymentChoose = async (paymentOption: PaymentOptionsProps) => {
    if ((await allowCheckout()) && paymentOption) checkout(paymentOption);
  };

  useEffectOnce(() => {
    dispatch(getPrices());
  }, [dispatch, getPrices]);

  useEffectOnce(() => {
    if (!isEmpty(userWallets)) {
      for (const fioWallet of userWallets) {
        if (fioWallet.publicKey) {
          dispatch(refreshBalance(fioWallet.publicKey));
        }
      }
      if (userWallets.length === 1) {
        dispatch(setWallet(userWallets[0].publicKey));
      }
    }
    dispatch(clearOrder());
  }, [userWallets, dispatch, refreshBalance, setWallet, clearOrder]);

  useEffectOnce(() => {
    if (isAuth) handleFreeAddressCartFn();
  }, [isAuth]);

  useEffect(() => {
    if (!isAuth) {
      history.push(ROUTES.FIO_ADDRESSES_SELECTION);
    }
  }, [history, isAuth]);

  useEffect(() => {
    if (
      paymentWalletFrom &&
      paymentWalletFrom === WALLET_CREATED_FROM.LEDGER &&
      cartHasItemsWithPrivateDomain
    )
      setError(
        'At this moment registration of FIO Crypto Handles on private domains is not supported. We are working hard to add this capability to the Ledger’s FIO App.',
      );

    if (error && paymentWalletFrom === WALLET_CREATED_FROM.EDGE) setError(null);
  }, [paymentWalletFrom, cartHasItemsWithPrivateDomain, error]);

  return {
    cartItems,
    hasGetPricesError: hasGetPricesError || updatingPricesHasError,
    error,
    hasLowBalance,
    walletCount,
    walletBalancesAvailable,
    isFree,
    loading: loading || isUpdatingPrices,
    totalCartAmount,
    isPriceChanged,
    totalCartNativeAmount,
    userWallets,
    paymentWalletPublicKey,
    prices,
    roe,
    onPaymentChoose,
    setWallet: (publicKey: string) => dispatch(setWallet(publicKey)),
    deleteItem: (data: DeleteCartItem) => dispatch(deleteItem(data)),
  };
};
