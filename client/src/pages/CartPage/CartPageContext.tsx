import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import isEmpty from 'lodash/isEmpty';

import { deleteItem, setCartItems, setWallet } from '../../redux/cart/actions';
import { refreshBalance } from '../../redux/fio/actions';
import { getPrices } from '../../redux/registrations/actions';
import { showGenericErrorModal } from '../../redux/modal/actions';

import {
  cartItems as cartItemsSelector,
  paymentWalletPublicKey as paymentWalletPublicKeySelector,
  isCartPrivateDomainsError as isCartPrivateDomainsErrorSelector,
  cartHasItemsWithPrivateDomain as cartHasItemsWithPrivateDomainSelector,
} from '../../redux/cart/selectors';
import {
  fioWallets as fioWalletsSelector,
  privateDomains as privateDomainsSelector,
} from '../../redux/fio/selectors';
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

import {
  cartHasOnlyFreeItems,
  cartItemsToOrderItems,
  handleFreeAddressCart,
  totalCost,
} from '../../util/cart';
import MathOp from '../../util/math';
import { convertFioPrices } from '../../util/prices';
import {
  fireAnalyticsEvent,
  getGAClientId,
  getGASessionId,
} from '../../util/analytics';

import { useEffectOnce } from '../../hooks/general';

import { ROUTES } from '../../constants/routes';
import {
  ANALYTICS_EVENT_ACTIONS,
  CART_ITEM_TYPE,
  CART_ITEM_TYPES_WITH_PERIOD,
} from '../../constants/common';
import { DOMAIN_TYPE } from '../../constants/fio';

import { log } from '../../util/general';
import { handlePriceForMultiYearFchWithCustomDomain } from '../../util/fio';
import apis from '../../api';

import { FioRegPricesResponse } from '../../api/responses';
import {
  CartItem as CartItemType,
  CartItem,
  DeleteCartItem,
  FioWalletDoublet,
  IncomePrices,
  PaymentProvider,
  Prices,
  WalletBalancesItem,
} from '../../types';

type UseContextReturnType = {
  cartItems: CartItem[];
  hasGetPricesError: boolean;
  error?: string | null;
  hasLowBalance?: boolean;
  isFree: boolean;
  isPriceChanged: boolean;
  selectedPaymentProvider: PaymentProvider;
  disabled: boolean;
  paymentWalletPublicKey: string;
  prices: Prices;
  roe: number;
  totalCartAmount: string;
  totalCartNativeAmount: number;
  userWallets: FioWalletDoublet[];
  walletBalancesAvailable?: WalletBalancesItem;
  walletCount: number;
  onPaymentChoose: (paymentProvider: PaymentProvider) => Promise<void>;
  deleteItem: (data: DeleteCartItem) => void;
  setCartItems: (cartItems: CartItemType[]) => void;
};

export const useContext = (): UseContextReturnType => {
  const cartItems = useSelector(cartItemsSelector);
  const hasFreeAddress = useSelector(hasFreeAddressSelector);
  const hasGetPricesError = useSelector(hasGetPricesErrorSelector);
  const isAuth = useSelector(isAuthenticated);
  const loading = useSelector(loadingSelector);
  const paymentWalletPublicKey = useSelector(paymentWalletPublicKeySelector);
  const prices = useSelector(pricesSelector);
  const roe = useSelector(roeSelector);
  const userWallets = useSelector(fioWalletsSelector);
  const privateDomainsMap = useSelector(privateDomainsSelector);
  const isCartPrivateDomainsError = useSelector(
    isCartPrivateDomainsErrorSelector,
  );
  const cartHasItemsWithPrivateDomain = useSelector(
    cartHasItemsWithPrivateDomainSelector,
  );

  const dispatch = useDispatch();

  const history = useHistory();

  const walletCount = userWallets.length;

  const [isPriceChanged, handlePriceChange] = useState(false);
  const [isUpdatingPrices, setIsUpdatingPrices] = useState(false);
  const [updatingPricesHasError, setUpdatingPricesHasError] = useState(false);
  const [
    selectedPaymentProvider,
    setSelectedPaymentProvider,
  ] = useState<PaymentProvider | null>(null);

  const handleFreeAddressCartFn = () =>
    handleFreeAddressCart({
      cartItems,
      hasFreeAddress,
      prices,
      roe,
      setCartItems: cartItems => dispatch(setCartItems(cartItems)),
    });

  const isFree =
    !isEmpty(cartItems) &&
    ((!hasFreeAddress &&
      cartItems.length === 1 &&
      cartItems.every(
        item =>
          (!item.costNativeFio || item.domainType === DOMAIN_TYPE.FREE) &&
          !!item.address,
      )) ||
      cartHasOnlyFreeItems(cartItems));

  const {
    costNativeFio: totalCartNativeAmount,
    costUsdc: totalCartUsdcAmount,
  } = (cartItems && totalCost(cartItems, roe)) || {};

  const totalCartAmount = apis.fio
    .sufToAmount(totalCartNativeAmount)
    .toFixed(2);

  const error = isCartPrivateDomainsError
    ? 'Some FIO Crypto Handles in your cart are on private FIO Domains controlled by different FIO Wallets and therefore cannot be purchased in a single transaction. Please purchase them one at a time.'
    : null;

  const {
    nativeFio: { address: nativeFioAddressPrice, domain: nativeFioDomainPrice },
  } = prices;

  // Check if FIO Wallet has enough balance when cart has items with private domains
  let hasLowBalanceForPrivateDomains = false;
  let pubKeyForPrivateDomain = '';
  if (cartHasItemsWithPrivateDomain) {
    for (const cartItem of cartItems.filter(({ address }) => address)) {
      if (privateDomainsMap[cartItem.domain]) {
        hasLowBalanceForPrivateDomains = privateDomainsMap[cartItem.domain]
          .wallet
          ? new MathOp(privateDomainsMap[cartItem.domain].wallet.available).lte(
              totalCartNativeAmount,
            )
          : false;

        if (hasLowBalanceForPrivateDomains) break;

        pubKeyForPrivateDomain =
          privateDomainsMap[cartItem.domain].walletPublicKey;
      }
    }
  }

  const hasLowBalance =
    hasLowBalanceForPrivateDomains ||
    (userWallets &&
      userWallets.every(
        wallet =>
          wallet.available != null &&
          totalCartNativeAmount &&
          new MathOp(wallet.available).lte(totalCartNativeAmount),
      ));

  const highestBalanceWalletPubKey = userWallets.length
    ? userWallets.sort(
        (a, b) => b.available - a.available || a.name.localeCompare(b.name),
      )[0].publicKey
    : '';

  const getFreshPrices = async (): Promise<FioRegPricesResponse> => {
    setIsUpdatingPrices(true);
    try {
      const freshPrices = await apis.fioReg.prices(true);
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
          renewDomain: updatedRenewFioDomainPrice = nativeFioDomainPrice,
          addBundles: updatedAddBundlesPrice = 0,
        } = {},
        usdtRoe: updatedRoe = roe,
      } = {},
    } = updatedPrices || {};

    const updatedCartItems = cartItems.map(item => {
      if (!item.costNativeFio || item.domainType === DOMAIN_TYPE.FREE)
        return item;

      const retObj = { ...item };

      if (item.type === CART_ITEM_TYPE.ADD_BUNDLES) {
        retObj.costNativeFio = updatedAddBundlesPrice;
      } else if (item.type === CART_ITEM_TYPE.DOMAIN_RENEWAL) {
        retObj.costNativeFio = updatedRenewFioDomainPrice;
      } else if (!item.address) {
        retObj.costNativeFio = updatedFioDomainPrice;
      } else {
        retObj.costNativeFio = updatedFioAddressPrice;
      }

      const isCustomDomainItem =
        !!item.address && item.domainType === DOMAIN_TYPE.CUSTOM;

      if (isCustomDomainItem) {
        retObj.costNativeFio = new MathOp(retObj.costNativeFio)
          .add(updatedFioDomainPrice)
          .toNumber();
      }

      const period = retObj.period || 1;
      const fioPrices = CART_ITEM_TYPES_WITH_PERIOD.includes(retObj.type)
        ? convertFioPrices(
            handlePriceForMultiYearFchWithCustomDomain({
              costNativeFio: retObj.costNativeFio,
              nativeFioAddressPrice:
                isCustomDomainItem && updatedFioAddressPrice,
              period,
            }),
            roe,
          )
        : convertFioPrices(retObj.costNativeFio, updatedRoe);

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
        fireAnalyticsEvent(ANALYTICS_EVENT_ACTIONS.PRICE_CHANGE);

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

  const checkout = async (paymentProvider: PaymentProvider) => {
    const { costUsdc: totalUsdc } = totalCost(cartItems, roe);

    try {
      await apis.orders.create({
        total: totalUsdc,
        roe,
        publicKey: paymentWalletPublicKey || userWallets[0].publicKey,
        paymentProcessor: paymentProvider,
        items: cartItemsToOrderItems(cartItems, prices, roe),
        data: {
          gaClientId: getGAClientId(),
          gaSessionId: getGASessionId(),
        },
      });

      return history.push(ROUTES.CHECKOUT);
    } catch (e) {
      dispatch(showGenericErrorModal());
    }
  };

  const onPaymentChoose = async (paymentProvider: PaymentProvider) => {
    setSelectedPaymentProvider(paymentProvider);
    if ((await allowCheckout()) && paymentProvider)
      return await checkout(paymentProvider);
    setSelectedPaymentProvider(null);
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
  }, [userWallets, dispatch, refreshBalance, setWallet]);

  // Set wallet with the highest balance enough for FIO purchase
  useEffect(() => {
    if (pubKeyForPrivateDomain) {
      dispatch(setWallet(pubKeyForPrivateDomain));
      return;
    }
    if (highestBalanceWalletPubKey)
      dispatch(setWallet(highestBalanceWalletPubKey));
  }, [dispatch, highestBalanceWalletPubKey, pubKeyForPrivateDomain]);

  useEffectOnce(
    () => {
      if (isAuth) handleFreeAddressCartFn();
    },
    [isAuth],
    !loading,
  );

  useEffect(() => {
    if (!isAuth) {
      history.push(ROUTES.FIO_ADDRESSES_SELECTION);
    }
  }, [history, isAuth]);

  return {
    cartItems,
    hasGetPricesError: hasGetPricesError || updatingPricesHasError,
    hasLowBalance,
    walletCount,
    isFree,
    selectedPaymentProvider,
    disabled: loading || isUpdatingPrices || !!selectedPaymentProvider,
    totalCartAmount,
    isPriceChanged,
    totalCartNativeAmount,
    userWallets,
    paymentWalletPublicKey,
    prices,
    roe,
    error,
    onPaymentChoose,
    deleteItem: (data: DeleteCartItem) => dispatch(deleteItem(data)),
    setCartItems: (cartItems: CartItemType[]) =>
      dispatch(setCartItems(cartItems)),
  };
};
