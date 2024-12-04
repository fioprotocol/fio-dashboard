import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import isEmpty from 'lodash/isEmpty';

import { FIOSDK } from '@fioprotocol/fiosdk';

import { recalculateOnPriceUpdate, clearCart } from '../../redux/cart/actions';
import { refreshBalance } from '../../redux/fio/actions';
import { showGenericErrorModal } from '../../redux/modal/actions';

import {
  cartId as cartIdSelector,
  cartItems as cartItemsSelector,
  paymentWalletPublicKey as paymentWalletPublicKeySelector,
  loading as loadingCartSelector,
} from '../../redux/cart/selectors';
import {
  loading as walletsLoadingSelector,
  fioWallets as fioWalletsSelector,
} from '../../redux/fio/selectors';
import { isAuthenticated } from '../../redux/profile/selectors';
import {
  hasGetPricesError as hasGetPricesErrorSelector,
  loading as loadingSelector,
  prices as pricesSelector,
  roe as roeSelector,
} from '../../redux/registrations/selectors';
import { refProfileInfo } from '../../redux/refProfile/selectors';

import { handlePriceForMultiYearItems, totalCost } from '../../util/cart';
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
  NOT_FOUND_CODE,
  REF_PROFILE_TYPE,
} from '../../constants/common';
import {
  NOT_FOUND_CART_BUTTON_TEXT,
  NOT_FOUND_CART_MESSAGE,
  NOT_FOUND_CART_TITLE,
} from '../../constants/cart';
import { ORDER_USER_TYPES } from '../../constants/order';
import { VARS_KEYS } from '../../constants/vars';

import { log } from '../../util/general';
import { checkIsDomainExpired } from '../../util/fio';
import { convertFioPrices } from '../../util/prices';
import apis from '../../api';

import { FioRegPricesResponse } from '../../api/responses';
import {
  CartItem,
  FioWalletDoublet,
  IncomePrices,
  PaymentProvider,
  Prices,
  WalletBalancesItem,
} from '../../types';
import { CreateOrderActionData } from '../../redux/types';

type UseContextReturnType = {
  cartId: string;
  cartItems: CartItem[];
  formsOfPayment: { [key: string]: boolean };
  hasGetPricesError: boolean;
  hasLowBalance?: boolean;
  isAffiliateEnabled: boolean;
  isFree: boolean;
  isNoProfileFlow: boolean;
  isPriceChanged: boolean;
  loading: boolean;
  selectedPaymentProvider: PaymentProvider;
  disabled: boolean;
  paymentWalletPublicKey: string;
  prices: Prices;
  roe: number;
  showExpiredDomainWarningBadge: boolean;
  totalCartAmount: string;
  totalCartUsdcAmount: string;
  totalCartNativeAmount: number;
  userWallets: FioWalletDoublet[];
  walletBalancesAvailable?: WalletBalancesItem;
  walletCount: number;
  onPaymentChoose: (paymentProvider: PaymentProvider) => Promise<void>;
};

export const useContext = (): UseContextReturnType => {
  const cartId = useSelector(cartIdSelector);
  const cartItems = useSelector(cartItemsSelector);
  const hasGetPricesError = useSelector(hasGetPricesErrorSelector);
  const isAuth = useSelector(isAuthenticated);
  const loading = useSelector(loadingSelector);
  const paymentWalletPublicKey = useSelector(paymentWalletPublicKeySelector);
  const prices = useSelector(pricesSelector);
  const roe = useSelector(roeSelector);
  const userWallets = useSelector(fioWalletsSelector);
  const walletsLoading = useSelector(walletsLoadingSelector);
  const loadingCart = useSelector(loadingCartSelector);
  const refProfile = useSelector(refProfileInfo);

  const dispatch = useDispatch();

  const history = useHistory();

  const isNoProfileFlow = refProfile?.settings?.hasNoProfileFlow;
  const isAffiliateEnabled = refProfile?.type === REF_PROFILE_TYPE.AFFILIATE;

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
  const [formsOfPayment, setFormsOfPayment] = useState<{
    [key: string]: boolean;
  }>(null);

  const getFormOfPaymentsVars = useCallback(async () => {
    const formOfPaymentVars = await apis.vars.getVar(
      VARS_KEYS.FORMS_OF_PAYMENT,
    );

    const parsedFormOfPayments = JSON.parse(formOfPaymentVars.value);

    setFormsOfPayment(parsedFormOfPayments);
  }, []);

  useEffectOnce(() => {
    getFormOfPaymentsVars();
  }, []);

  const isFree =
    cartItems.length > 0 && cartItems.every(cartItem => cartItem.isFree);

  const {
    costNativeFio: totalCartNativeAmount,
    costUsdc: totalCartUsdcAmount,
  } = (cartItems && totalCost(cartItems, roe)) || {};

  const totalCartAmount = FIOSDK.SUFToAmount(totalCartNativeAmount).toFixed(2);

  const hasLowBalance =
    userWallets &&
    userWallets.every(
      wallet =>
        wallet.available != null &&
        totalCartNativeAmount &&
        new MathOp(wallet.available).lte(totalCartNativeAmount),
    );

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
          address: updatedFioAddressPrice,
          renewDomain: updatedRenewFioDomainPrice,
          addBundles: updatedAddBundlesPrice,
        },
        usdtRoe: updatedRoe = roe,
      },
    } = updatedPrices || {};

    const updatedCartItems = cartItems.map(cartItem => {
      const { isFree, hasCustomDomainInCart, period, type } = cartItem;

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
          if (hasCustomDomainInCart) {
            costNativeFio = updatedFioAddressPrice;
          } else {
            costNativeFio = handlePriceForMultiYearItems({
              includeAddress: true,
              prices: updatedPrices?.pricing?.nativeFio,
              period,
            });
          }
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

        const { updatedTotalPrice, updatedCostUsdc } = recalculateBalance(
          updatedPrices,
        );

        const isEqualPrice =
          new MathOp(totalCartNativeAmount).eq(updatedTotalPrice) &&
          new MathOp(totalCartUsdcAmount).eq(updatedCostUsdc);

        handlePriceChange(!isEqualPrice);

        if (isEqualPrice) return true;
        fireAnalyticsEvent(ANALYTICS_EVENT_ACTIONS.PRICE_CHANGE);

        dispatch(recalculateOnPriceUpdate());

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
      const publicKey = paymentWalletPublicKey || userWallets[0]?.publicKey;

      const orderParams: CreateOrderActionData = {
        cartId,
        publicKey,
        paymentProcessor: paymentProvider,
        data: {
          gaClientId: getGAClientId(),
          gaSessionId: getGASessionId(),
        },
        refCode: refProfile?.code,
      };

      if (isNoProfileFlow) {
        orderParams.refProfileId = refProfile.id;
        orderParams.data['orderUserType'] = ORDER_USER_TYPES.NO_PROFILE_FLOW;
      }

      await apis.orders.create(orderParams);

      return history.push(ROUTES.CHECKOUT);
    } catch (e) {
      log.error(e);

      if (e?.fields?.cart === NOT_FOUND_CODE) {
        dispatch(
          showGenericErrorModal(
            NOT_FOUND_CART_MESSAGE,
            NOT_FOUND_CART_TITLE,
            NOT_FOUND_CART_BUTTON_TEXT,
          ),
        );
        dispatch(clearCart());
      } else {
        dispatch(showGenericErrorModal());
      }
      setSelectedPaymentProvider(null);
    }
  };

  const onPaymentChoose = async (paymentProvider: PaymentProvider) => {
    setSelectedPaymentProvider(paymentProvider);
    if ((await allowCheckout()) && paymentProvider)
      return await checkout(paymentProvider);
    setSelectedPaymentProvider(null);
  };

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
  }, [cartItems]);

  useEffect(() => {
    hasExpiredDomain();
  }, [hasExpiredDomain]);

  useEffectOnce(() => {
    if (!isEmpty(userWallets)) {
      for (const fioWallet of userWallets) {
        if (fioWallet.publicKey) {
          dispatch(refreshBalance(fioWallet.publicKey));
        }
      }
    }
  }, [userWallets, dispatch, refreshBalance]);

  useEffect(() => {
    if (!isAuth && !isNoProfileFlow) {
      history.push(ROUTES.FIO_ADDRESSES_SELECTION);
    }
  }, [history, isAuth, isNoProfileFlow]);

  return {
    cartId,
    cartItems,
    hasGetPricesError: hasGetPricesError || updatingPricesHasError,
    hasLowBalance,
    loading: loading || loadingCart || walletsLoading,
    walletCount,
    isAffiliateEnabled,
    isFree,
    isNoProfileFlow,
    isPriceChanged,
    selectedPaymentProvider,
    disabled: loading || isUpdatingPrices || !!selectedPaymentProvider,
    totalCartAmount,
    totalCartUsdcAmount,
    totalCartNativeAmount,
    userWallets,
    paymentWalletPublicKey,
    prices,
    roe,
    showExpiredDomainWarningBadge,
    formsOfPayment,
    onPaymentChoose,
  };
};
