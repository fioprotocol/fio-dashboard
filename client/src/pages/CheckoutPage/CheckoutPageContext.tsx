import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import isEmpty from 'lodash/isEmpty';

import { refreshBalance, refreshFioNames } from '../../redux/fio/actions';
import {
  setWallet as setWalletAction,
  setCartItems,
} from '../../redux/cart/actions';
import { loadProfile } from '../../redux/profile/actions';
import { setProcessing } from '../../redux/registrations/actions';

import {
  fioWallets as fioWalletsSelector,
  fioDomains as fioDomainsSelector,
  loading as fioLoadingSelector,
  fioWalletsBalances as fioWalletsBalancesSelector,
  privateDomains as privateDomainsSelector,
} from '../../redux/fio/selectors';
import {
  cartHasItemsWithPrivateDomain as cartHasItemsWithPrivateDomainSelector,
  cartItems as cartItemsSelector,
  paymentWalletPublicKey as paymentWalletPublicKeySelector,
} from '../../redux/cart/selectors';
import {
  isAuthenticated as isAuthenticatedSelector,
  noProfileLoaded as noProfileLoadedSelector,
  hasFreeAddress as hasFreeAddressSelector,
} from '../../redux/profile/selectors';
import {
  prices as pricesSelector,
  isProcessing as isProcessingSelector,
  roe as roeSelector,
} from '../../redux/registrations/selectors';

import apis from '../../api';

import { onPurchaseFinish } from '../../util/purchase';
import MathOp from '../../util/math';
import {
  totalCost,
  handleFreeAddressCart,
  cartIsRelative,
  cartHasOnlyFreeItems,
} from '../../util/cart';
import { getGAClientId, getGASessionId } from '../../util/analytics';
import { setFioName } from '../../utils';
import { useWalletBalances } from '../../util/hooks';
import { useEffectOnce } from '../../hooks/general';

import { ROUTES } from '../../constants/routes';
import {
  PAYMENT_PROVIDER_PAYMENT_TITLE,
  PAYMENT_OPTIONS,
  PURCHASE_RESULTS_STATUS,
  PAYMENT_PROVIDER_PAYMENT_OPTION,
  PAYMENT_PROVIDER,
} from '../../constants/purchase';
import {
  CART_ITEM_TYPE,
  CURRENCY_CODES,
  WALLET_CREATED_FROM,
} from '../../constants/common';
import { ACTIONS, DOMAIN_TYPE } from '../../constants/fio';

import {
  RegistrationResult,
  Payment,
  CartItem,
  FioWalletDoublet,
  WalletsBalances,
  WalletBalancesItem,
  ApiError,
  PaymentProvider,
  PaymentOptionsProps,
  Order,
} from '../../types';
import { BeforeSubmitData, BeforeSubmitState } from './types';
import { CreateOrderActionData } from '../../redux/types';

const SIGN_TX_MAX_FEE_COEFF = 1.5;

export const useContext = (): {
  cartItems: CartItem[];
  isLoading?: boolean;
  walletBalancesAvailable: WalletBalancesItem;
  paymentWallet: FioWalletDoublet;
  paymentWalletPublicKey: string;
  roe: number | null;
  fioWallets: FioWalletDoublet[];
  fioWalletsBalances: WalletsBalances;
  paymentAssignmentWallets: FioWalletDoublet[];
  isProcessing: boolean;
  title: string;
  order: Order;
  payment: Payment;
  paymentOption: PaymentOptionsProps;
  paymentProvider: PaymentProvider | null;
  paymentProviderError: ApiError;
  isFree: boolean;
  beforeSubmitProps: BeforeSubmitState | null;
  fioLoading: boolean;
  orderLoading: boolean;
  error: string | null;
  orderError: ApiError;
  submitDisabled?: boolean;
  beforePaymentSubmit: (handleSubmit: () => Promise<void>) => Promise<void>;
  onClose: () => void;
  onFinish: (results: RegistrationResult) => Promise<void>;
  setWallet: (walletPublicKey: string) => void;
  setProcessing: (isProcessing: boolean) => void;
} => {
  const history = useHistory();
  const fioWallets = useSelector(fioWalletsSelector);
  const fioLoading = useSelector(fioLoadingSelector);
  const fioWalletsBalances = useSelector(fioWalletsBalancesSelector);
  const privateDomains = useSelector(privateDomainsSelector);
  const cartItems = useSelector(cartItemsSelector);
  const paymentWalletPublicKey = useSelector(paymentWalletPublicKeySelector);
  const noProfileLoaded = useSelector(noProfileLoadedSelector);
  const isAuth = useSelector(isAuthenticatedSelector);
  const hasFreeAddress = useSelector(hasFreeAddressSelector);
  const prices = useSelector(pricesSelector);
  const userDomains = useSelector(fioDomainsSelector);
  const isProcessing = useSelector(isProcessingSelector);
  const roe = useSelector(roeSelector);
  const cartHasItemsWithPrivateDomain = useSelector(
    cartHasItemsWithPrivateDomainSelector,
  );

  const dispatch = useDispatch();
  const dispatchSetProcessing = (isProcessing: boolean) =>
    dispatch(setProcessing(isProcessing));
  const dispatchSetWallet = useCallback(
    (paymentWalletPublicKey: string) =>
      dispatch(setWalletAction(paymentWalletPublicKey)),
    [dispatch],
  );

  const [
    beforeSubmitProps,
    setBeforeSubmitProps,
  ] = useState<BeforeSubmitState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [orderError, setOrderError] = useState<ApiError>(null);
  const [getOrderLoading, setGetOrderLoading] = useState<boolean>(true);
  const [createOrderLoading, setCreateOrderLoading] = useState<boolean>(true);

  const {
    location: { state },
  } = history;
  const {
    orderParams: orderParamsFromLocation,
  }: { orderParams?: CreateOrderActionData } = state || {}; // todo: implement setting order params from places where we going to checkout page
  const payment = order && order.payment;
  const orderId = order && order.id;
  const paymentProvider = payment ? payment.processor : null;
  const paymentOption = paymentProvider
    ? PAYMENT_PROVIDER_PAYMENT_OPTION[paymentProvider]
    : null;

  const setWallet = useCallback(
    (paymentWalletPublicKey: string) => {
      orderId &&
        apis.orders.update(orderId, { publicKey: paymentWalletPublicKey });
      dispatchSetWallet(paymentWalletPublicKey);
    },
    [orderId, dispatchSetWallet],
  );

  const getOrder = useCallback(async () => {
    let result;

    try {
      result = await apis.orders.getActive();
    } catch (e) {
      setOrderError(e);
    }

    if (
      result &&
      result.id &&
      cartIsRelative(cartItems, result.orderItems || [])
    ) {
      if (result.publicKey) setWallet(result.publicKey);
      setOrder(result);
      setGetOrderLoading(false);
      setCreateOrderLoading(false);
      return;
    }

    setOrder(null);
    setGetOrderLoading(false);
  }, [cartItems, setWallet]);
  const createOrder = useCallback(
    async (
      paymentWalletPublicKey: string,
      fioWallets: FioWalletDoublet[],
      orderParamsFromLocation: CreateOrderActionData,
      cartItems: CartItem[],
      isFree: boolean,
    ) => {
      let result;
      let orderParams: CreateOrderActionData | null = null;

      if (!orderParamsFromLocation && isFree) {
        orderParams = {
          total: '0',
          roe,
          publicKey: paymentWalletPublicKey,
          paymentProcessor: PAYMENT_PROVIDER.FIO,
          items: cartItems.map(({ address, domain, costNativeFio }) => ({
            action: ACTIONS.registerFioAddress,
            address,
            domain,
            nativeFio: '0',
            price: '0',
            priceCurrency: CURRENCY_CODES.USDC,
          })),
          data: {
            gaClientId: getGAClientId(),
            gaSessionId: getGASessionId(),
          },
        };
      }

      if (orderParamsFromLocation) {
        orderParams = { ...orderParamsFromLocation };
        if (!orderParams.publicKey)
          orderParams.publicKey =
            paymentWalletPublicKey ||
            fioWallets.filter(
              ({ from }) => from === WALLET_CREATED_FROM.EDGE,
            )[0].publicKey;
      }

      // There is no order, redirect to cart
      if (!orderParams) return history.push(ROUTES.CART);

      try {
        result = await apis.orders.create(orderParams);
      } catch (e) {
        setOrderError(e);
      }

      if (result && result.id) {
        if (result.publicKey) setWallet(result.publicKey);
        setOrderError(null);
        setOrder(result);
        setCreateOrderLoading(false);
        return;
      }

      setOrder(null);
      setCreateOrderLoading(false);
    },
    [history, roe, setWallet],
  );

  useEffectOnce(
    () => {
      if (!isEmpty(fioWallets)) {
        for (const fioWallet of fioWallets) {
          if (fioWallet.publicKey) {
            dispatch(refreshBalance(fioWallet.publicKey));
            dispatch(refreshFioNames(fioWallet.publicKey));
          }
        }
        if (!paymentWalletPublicKey && fioWallets.length) {
          setWallet(
            fioWallets.filter(
              ({ from }) => from === WALLET_CREATED_FROM.EDGE,
            )[0].publicKey,
          );
        }
      }
      getOrder();
    },
    [dispatch, fioWallets, getOrder, paymentWalletPublicKey, setWallet],
    fioWallets.length > 0,
  );

  const cartItemsJson = JSON.stringify(cartItems);

  const isFree =
    !isEmpty(cartItems) &&
    ((cartItems.length === 1 && !hasFreeAddress && cartItems[0].allowFree) ||
      cartHasOnlyFreeItems(cartItems));

  const paymentWallet = fioWallets.find(
    ({ publicKey }) => publicKey === paymentWalletPublicKey,
  );
  const { available: walletBalancesAvailable } = useWalletBalances(
    paymentWalletPublicKey,
  );
  const paymentWalletFrom = paymentWallet && paymentWallet.from;

  const { costNativeFio: totalCostNativeFio } = totalCost(cartItems, roe);

  const walletHasNoEnoughBalance = totalCostNativeFio
    ? new MathOp(walletBalancesAvailable.nativeFio).lt(totalCostNativeFio || 0)
    : false;

  const title =
    isFree || !paymentProvider
      ? 'Make Purchase'
      : PAYMENT_PROVIDER_PAYMENT_TITLE[paymentProvider];

  const ownerPubKeysPrivateDomains: string[] = [];
  if (cartHasItemsWithPrivateDomain) {
    cartItems.forEach(({ domain }) => {
      if (privateDomains[domain]) {
        ownerPubKeysPrivateDomains.push(privateDomains[domain].walletPublicKey);
      }
    });
  }

  const paymentAssignmentWallets = fioWallets
    .filter(wallet => {
      if (isFree || paymentOption !== PAYMENT_OPTIONS.FIO) return true;
      if (
        wallet.from === WALLET_CREATED_FROM.LEDGER &&
        paymentOption === PAYMENT_OPTIONS.FIO
      )
        return false;
      if (
        cartHasItemsWithPrivateDomain &&
        paymentOption === PAYMENT_OPTIONS.FIO &&
        ownerPubKeysPrivateDomains.length // cart has at least one item with private domain but not custom domain
      ) {
        return ownerPubKeysPrivateDomains.indexOf(wallet.publicKey) > -1;
      }

      return wallet.available > totalCostNativeFio;
    })
    .sort((a, b) => b.available - a.available || a.name.localeCompare(b.name));

  // Create order for free address
  useEffectOnce(
    () => {
      setOrder(undefined);
      createOrder(
        paymentWalletPublicKey,
        fioWallets,
        orderParamsFromLocation,
        cartItems,
        isFree,
      );
    },
    [
      paymentWalletPublicKey,
      fioWallets,
      orderParamsFromLocation,
      cartItems,
      isFree,
    ],
    isAuth &&
      order === null &&
      !getOrderLoading &&
      !fioLoading &&
      !!paymentWalletPublicKey &&
      !!fioWallets.length,
  );

  useEffect(() => {
    const cancelOrder = () => {
      if (order?.id) {
        apis.orders.update(order.id, {
          status: PURCHASE_RESULTS_STATUS.CANCELED,
        });
      }
    };

    window.addEventListener('beforeunload', cancelOrder);

    return () => {
      window.removeEventListener('beforeunload', cancelOrder);
    };
  }, [order?.id]);

  useEffect(() => {
    if (noProfileLoaded || !cartItems.length) {
      history.push(ROUTES.FIO_ADDRESSES_SELECTION);
    }
  }, [cartItems.length, noProfileLoaded, history]);

  // Redirect back to cart when payment option is FIO and not enough FIO tokens
  useEffect(() => {
    if (
      !fioLoading &&
      !isFree &&
      paymentWalletPublicKey &&
      walletHasNoEnoughBalance &&
      paymentOption === PAYMENT_OPTIONS.FIO
    ) {
      history.push(ROUTES.CART);
    }
  }, [
    history,
    isFree,
    fioLoading,
    paymentWalletPublicKey,
    paymentOption,
    walletHasNoEnoughBalance,
  ]);

  useEffect(() => {
    !isProcessing &&
      handleFreeAddressCart({
        setCartItems: cartItems => dispatch(setCartItems(cartItems)),
        cartItems: JSON.parse(cartItemsJson),
        prices,
        hasFreeAddress,
        roe,
      });
  }, [hasFreeAddress, prices, roe, isProcessing, cartItemsJson, dispatch]);

  // Check for ledger wallet when cart has addresses with private domains
  useEffect(() => {
    if (
      paymentWalletFrom &&
      paymentWalletFrom === WALLET_CREATED_FROM.LEDGER &&
      cartHasItemsWithPrivateDomain
    )
      setError(
        'At this moment registration of FIO Crypto Handles on private domains is not supported. We are working hard to add this capability to the Ledger’s FIO App.',
      );

    // todo: this part is reset the error if paymentWalletFrom was changed to EDGE. could be situation when setError was called from other place not in this useEffect, in this case error could be reset. should this error be only for ledger error? - rename in this case
    if (error && paymentWalletFrom === WALLET_CREATED_FROM.EDGE) setError(null);
  }, [paymentWalletFrom, cartHasItemsWithPrivateDomain, error]);

  useEffect(() => {
    return () => {
      setOrder(null);
      dispatch(loadProfile());
    };
  }, [dispatch]);

  const onClose = useCallback(() => {
    apis.orders.update(order.id, {
      status: PURCHASE_RESULTS_STATUS.CANCELED,
    });
    history.push(ROUTES.CART);
  }, [order, history]);

  const onFinish = async (results: RegistrationResult) => {
    await apis.orders.update(order.id, {
      status: results.providerTxStatus || PURCHASE_RESULTS_STATUS.SUCCESS,
      publicKey: paymentWalletPublicKey,
      results,
    });
    onPurchaseFinish({
      order,
      isCheckout: true,
      setProcessing: (isProcessing: boolean) =>
        dispatch(setProcessing(isProcessing)),
      history,
    });
  };

  const beforePaymentSubmit = async (
    handleSubmit: (data?: BeforeSubmitData) => Promise<void>,
  ) => {
    const privateDomainList: { [domain: string]: boolean } = {};
    for (const cartItem of cartItems) {
      if (
        userDomains.findIndex(({ name }) => name === cartItem.domain) < 0 &&
        cartItem.domainType !== DOMAIN_TYPE.CUSTOM
      )
        continue;

      privateDomainList[cartItem.domain] = false;
    }
    for (const domain of Object.keys(privateDomainList)) {
      const params = apis.fio.setTableRowsParams(domain);

      try {
        const { rows } = await apis.fio.getTableRows(params);

        if ((rows && rows.length && rows[0].is_public === 0) || !rows[0]) {
          privateDomainList[domain] = true;
        }
      } catch (e) {
        //
      }
    }

    const signTxItems = [];
    for (const cartItem of cartItems) {
      if (
        [
          CART_ITEM_TYPE.ADDRESS,
          CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN,
        ].includes(cartItem.type) &&
        privateDomainList[cartItem.domain]
      ) {
        const domainWallet = userDomains.find(
          ({ name }) => name === cartItem.domain,
        );
        signTxItems.push({
          fioWallet: fioWallets.find(
            ({ publicKey }) =>
              publicKey ===
              (domainWallet
                ? domainWallet.walletPublicKey
                : paymentWalletPublicKey),
          ),
          name: setFioName(cartItem.address, cartItem.domain),
          ownerKey: paymentWalletPublicKey,
        });
      }
    }

    if (signTxItems.length) {
      return setBeforeSubmitProps({
        walletConfirmType: WALLET_CREATED_FROM.EDGE,
        fee: new MathOp(prices.nativeFio.address)
          .mul(SIGN_TX_MAX_FEE_COEFF) // +50%
          .round(0, 2)
          .toNumber(),
        data: { fioAddressItems: signTxItems },
        onSuccess: (data: BeforeSubmitData) => {
          handleSubmit(data);
          dispatchSetProcessing(false);
        },
        onCancel: () => setBeforeSubmitProps(null),
      });
    }

    return handleSubmit();
  };

  return {
    cartItems,
    isLoading:
      fioLoading ||
      getOrderLoading ||
      createOrderLoading ||
      !paymentProvider ||
      !paymentWalletPublicKey,
    walletBalancesAvailable,
    paymentWallet,
    paymentWalletPublicKey,
    roe,
    fioWallets,
    fioWalletsBalances,
    paymentAssignmentWallets,
    isProcessing,
    title,
    order,
    payment,
    paymentOption,
    paymentProvider,
    paymentProviderError: null,
    isFree,
    beforeSubmitProps,
    fioLoading,
    orderLoading: getOrderLoading || createOrderLoading,
    error,
    orderError,
    submitDisabled: !!error,
    beforePaymentSubmit,
    onClose,
    onFinish,
    setWallet,
    setProcessing: dispatchSetProcessing,
  };
};
