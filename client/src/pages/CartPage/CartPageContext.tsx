import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import isEmpty from 'lodash/isEmpty';

import {
  deleteItem,
  setCartItems,
  setWallet,
  recalculateOnPriceUpdate,
} from '../../redux/cart/actions';
import { refreshBalance } from '../../redux/fio/actions';
import { getPrices } from '../../redux/registrations/actions';
import { showGenericErrorModal } from '../../redux/modal/actions';

import {
  cartId as cartIdSelector,
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
  handlePriceForMultiYearItems,
  totalCost,
} from '../../util/cart';
import MathOp from '../../util/math';
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
  WALLET_CREATED_FROM,
} from '../../constants/common';
import { DOMAIN_TYPE } from '../../constants/fio';

import { log } from '../../util/general';
import { isDomainExpired } from '../../util/fio';
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
import { convertFioPrices } from '../../util/prices';

type UseContextReturnType = {
  cartId: string;
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
  showExpiredDomainWarningBadge: boolean;
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
  const cartId = useSelector(cartIdSelector);
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
  const [
    showExpiredDomainWarningBadge,
    toggleShowExpiredDomainWarningBadge,
  ] = useState<boolean>(false);

  const isFree =
    !isEmpty(cartItems) &&
    ((!hasFreeAddress &&
      cartItems.length === 1 &&
      cartItems.every(
        item =>
          (!item.costNativeFio || item.domainType === DOMAIN_TYPE.ALLOW_FREE) &&
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
    ? 'Some FIO Handles in your cart are on private FIO Domains controlled by different FIO Wallets and therefore cannot be purchased in a single transaction. Please purchase them one at a time.'
    : null;

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
      userWallets
        .filter(({ from }) => from === WALLET_CREATED_FROM.EDGE)
        .every(
          wallet =>
            wallet.available != null &&
            totalCartNativeAmount &&
            new MathOp(wallet.available).lte(totalCartNativeAmount),
        ));

  const highestBalanceWalletPubKey = userWallets.length
    ? userWallets
        .filter(({ from }) => from === WALLET_CREATED_FROM.EDGE)
        .sort(
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
          address: updatedFioAddressPrice,
          renewDomain: updatedRenewFioDomainPrice,
          addBundles: updatedAddBundlesPrice,
        },
        usdtRoe: updatedRoe = roe,
      },
    } = updatedPrices || {};

    const updatedCartItems = cartItems.map(cartItem => {
      const { isFree, period, type } = cartItem;

      if (isFree && type === CART_ITEM_TYPE.ADDRESS) return cartItem;

      let costNativeFio = cartItem.costNativeFio;

      switch (type) {
        case CART_ITEM_TYPE.ADD_BUNDLES:
          costNativeFio = updatedAddBundlesPrice;
          break;
        case CART_ITEM_TYPE.DOMAIN_RENEWAL:
          costNativeFio = new MathOp(updatedRenewFioDomainPrice)
            .mul(period)
            .toNumber();
          break;
        case CART_ITEM_TYPE.ADDRESS:
          costNativeFio = updatedFioAddressPrice;
          break;
        case CART_ITEM_TYPE.DOMAIN:
          costNativeFio = handlePriceForMultiYearItems({
            prices: updatedPrices?.pricing?.nativeFio,
            period,
          });
          break;
        case CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN:
          costNativeFio = handlePriceForMultiYearItems({
            includeAddress: true,
            prices: updatedPrices?.pricing?.nativeFio,
            period,
          });
          break;
        default:
          break;
      }

      const { fio, usdc } = convertFioPrices(costNativeFio, updatedRoe);

      return { ...cartItem, costNativeFio, costFio: fio, costUsdc: usdc };
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
    if (
      totalCartNativeAmount > 0 ||
      !cartItems.every(cartItem => cartItem.isFree)
    ) {
      try {
        const updatedPrices = await getFreshPrices();

        const {
          pricing: { usdtRoe: updatedRoe },
        } = updatedPrices || {};

        const { updatedTotalPrice, updatedCostUsdc } = recalculateBalance(
          updatedPrices,
        );

        const isEqualPrice =
          new MathOp(totalCartNativeAmount).eq(updatedTotalPrice) &&
          new MathOp(totalCartUsdcAmount).eq(updatedCostUsdc);

        handlePriceChange(!isEqualPrice);

        if (isEqualPrice) return true;
        fireAnalyticsEvent(ANALYTICS_EVENT_ACTIONS.PRICE_CHANGE);

        dispatch(
          recalculateOnPriceUpdate({
            id: cartId,
            prices: updatedPrices?.pricing?.nativeFio,
            roe: updatedRoe,
          }),
        );
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
    try {
      await apis.orders.create({
        cartId,
        roe,
        publicKey: paymentWalletPublicKey || userWallets[0].publicKey,
        paymentProcessor: paymentProvider,
        prices: prices.nativeFio,
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

  const getDomainExpiration = useCallback(async (domainName: string) => {
    try {
      const { expiration } = (await apis.fio.getFioDomain(domainName)) || {};

      return expiration || null;
    } catch (err) {
      log.error(err);
    }
  }, []);

  const checkIsDomainExpired = useCallback(
    async (domainName: string) => {
      if (!domainName) return null;

      const expiration = await getDomainExpiration(domainName);

      return expiration && isDomainExpired(domainName, expiration);
    },
    [getDomainExpiration],
  );

  const hasExpiredDomain = useCallback(async () => {
    let hasExpiredDomain = false;

    const domains = cartItems
      .filter(cartItem => {
        const { domain, type } = cartItem;
        return (
          domain &&
          ![CART_ITEM_TYPE.DOMAIN, CART_ITEM_TYPE.DOMAIN_RENEWAL].includes(type)
        );
      })
      .map(cartItem => cartItem.domain);

    const uniqueDomains = [...new Set(domains)];

    for (const domain of uniqueDomains) {
      const isExpired = await checkIsDomainExpired(domain);
      if (isExpired) {
        hasExpiredDomain = isExpired;
        break;
      }
    }

    toggleShowExpiredDomainWarningBadge(hasExpiredDomain);
  }, [checkIsDomainExpired, cartItems]);

  useEffect(() => {
    hasExpiredDomain();
  }, [hasExpiredDomain]);

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

  useEffect(() => {
    if (!isAuth) {
      history.push(ROUTES.FIO_ADDRESSES_SELECTION);
    }
  }, [history, isAuth]);

  return {
    cartId,
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
    showExpiredDomainWarningBadge,
    onPaymentChoose,
    deleteItem: (data: DeleteCartItem) =>
      dispatch(deleteItem({ id: cartId, itemId: data.id })),
    setCartItems: (cartItems: CartItemType[]) =>
      dispatch(setCartItems(cartItems)),
  };
};
