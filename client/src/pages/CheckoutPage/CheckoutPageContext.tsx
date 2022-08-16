import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import isEmpty from 'lodash/isEmpty';

import { refreshBalance, fioActionExecuted } from '../../redux/fio/actions';
import { setWallet, setCartItems } from '../../redux/cart/actions';
import {
  setRegistration,
  setProcessing,
} from '../../redux/registrations/actions';
import { createOrder } from '../../redux/order/actions';

import {
  fioWallets as fioWalletsSelector,
  fioDomains as fioDomainsSelector,
  loading as loadingSelector,
  fioWalletsBalances as fioWalletsBalancesSelector,
} from '../../redux/fio/selectors';
import {
  cartItems as CartItemsSelector,
  paymentWalletPublicKey as paymentWalletPublicKeySelector,
} from '../../redux/cart/selectors';
import {
  order as orderSelector,
  error as orderErrorSelector,
  orderLoading as orderLoadingSelector,
} from '../../redux/order/selectors';
import {
  isAuthenticated,
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
import { totalCost, handleFreeAddressCart, setFioName } from '../../utils';
import { useWalletBalances } from '../../util/hooks';
import { useEffectOnce } from '../../hooks/general';

import { ROUTES } from '../../constants/routes';
import {
  PAYMENT_OPTION_TITLE,
  PAYMENT_OPTIONS,
  PURCHASE_RESULTS_STATUS,
} from '../../constants/purchase';
import { ACTIONS } from '../../constants/fio';
import { CURRENCY_CODES, WALLET_CREATED_FROM } from '../../constants/common';

import {
  RegistrationResult,
  PaymentOptionsProps,
  FioActionExecuted,
  Payment,
  CartItem,
  FioWalletDoublet,
  WalletsBalances,
  WalletBalancesItem,
  ApiError,
} from '../../types';
import { BeforeSubmitData, BeforeSubmitState } from './types';

export const useContext = (): {
  cartItems: CartItem[];
  walletBalancesAvailable: WalletBalancesItem;
  paymentWallet: FioWalletDoublet;
  paymentWalletPublicKey: string;
  roe: number | null;
  fioWallets: FioWalletDoublet[];
  fioWalletsBalances: WalletsBalances;
  isProcessing: boolean;
  title: string;
  payment: Payment;
  paymentOption: PaymentOptionsProps;
  paymentOptionError: ApiError;
  isFree: boolean;
  beforeSubmitProps: BeforeSubmitState | null;
  beforePaymentSubmit: (handleSubmit: () => Promise<void>) => Promise<void>;
  onClose: () => void;
  onFinish: (results: RegistrationResult) => Promise<void>;
  setWallet: (walletPublicKey: string) => void;
  setProcessing: (isProcessing: boolean) => void;
} => {
  const history = useHistory();
  const order = useSelector(orderSelector);
  const orderError = useSelector(orderErrorSelector);
  const fioWallets = useSelector(fioWalletsSelector);
  const loading = useSelector(loadingSelector);
  const fioWalletsBalances = useSelector(fioWalletsBalancesSelector);
  const cartItems = useSelector(CartItemsSelector);
  const paymentWalletPublicKey = useSelector(paymentWalletPublicKeySelector);
  const isAuth = useSelector(isAuthenticated);
  const hasFreeAddress = useSelector(hasFreeAddressSelector);
  const prices = useSelector(pricesSelector);
  const userDomains = useSelector(fioDomainsSelector);
  const isProcessing = useSelector(isProcessingSelector);
  const orderLoading = useSelector(orderLoadingSelector);
  const roe = useSelector(roeSelector);

  const dispatch = useDispatch();
  const dispatchSetProcessing = (isProcessing: boolean) =>
    dispatch(setProcessing(isProcessing));

  const [
    beforeSubmitProps,
    setBeforeSubmitProps,
  ] = useState<BeforeSubmitState | null>(null);

  const {
    location: { state },
  } = history;
  const { paymentOption }: { paymentOption?: PaymentOptionsProps } =
    state || {};
  const payment = order && order.payment;

  useEffectOnce(() => {
    if (!isEmpty(fioWallets)) {
      for (const fioWallet of fioWallets) {
        if (fioWallet.publicKey) {
          dispatch(refreshBalance(fioWallet.publicKey));
        }
      }
      if (!paymentWalletPublicKey && fioWallets.length) {
        dispatch(setWallet(fioWallets[0].publicKey));
      }
    }
  }, []);

  const cartItemsJson = JSON.stringify(cartItems);

  const isFree =
    !isEmpty(cartItems) &&
    cartItems.length === 1 &&
    !hasFreeAddress &&
    cartItems[0].allowFree;

  const paymentWallet = fioWallets.find(
    ({ publicKey }) => publicKey === paymentWalletPublicKey,
  );
  const { available: walletBalancesAvailable } = useWalletBalances(
    paymentWalletPublicKey,
  );

  const walletHasNoEnoughBalance = new MathOp(
    walletBalancesAvailable.nativeFio,
  ).lt(totalCost(cartItems, roe).costNativeFio || 0);

  const title =
    isFree || !paymentOption
      ? 'Make Purchase'
      : PAYMENT_OPTION_TITLE[paymentOption];

  // Create order for free address
  useEffectOnce(
    () => {
      dispatch(
        createOrder({
          total: '0',
          roe,
          publicKey: paymentWalletPublicKey,
          paymentProcessor: PAYMENT_OPTIONS.FIO,
          items: cartItems.map(({ address, domain, costNativeFio }) => ({
            action: ACTIONS.registerFioAddress,
            address,
            domain,
            params: {
              owner_fio_public_key: paymentWalletPublicKey,
            },
            nativeFio: `${costNativeFio || 0}`,
            price: '0',
            priceCurrency: CURRENCY_CODES.USDC,
          })),
        }),
      );
    },
    [
      order,
      orderLoading,
      loading,
      isFree,
      paymentWalletPublicKey,
      paymentOption,
      fioWallets.length,
      dispatch,
      createOrder,
    ],
    !order && !orderLoading && !loading && isFree && !!paymentWalletPublicKey,
  );

  useEffect(() => {
    if (!isAuth) {
      history.push(ROUTES.FIO_ADDRESSES_SELECTION);
    }
  }, [isAuth, history]);

  // Redirect back to cart when payment option is FIO and not enough FIO tokens ot more than 1 FIO wallet
  useEffect(() => {
    if (
      !loading &&
      !isFree &&
      ((paymentWalletPublicKey &&
        walletHasNoEnoughBalance &&
        (paymentOption === PAYMENT_OPTIONS.FIO || !paymentOption)) ||
        (!paymentWalletPublicKey && fioWallets.length > 1))
    ) {
      history.push(ROUTES.CART);
    }
  }, [
    fioWallets.length,
    history,
    isFree,
    loading,
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

  const onClose = () => {
    history.push(ROUTES.CART);
  };

  const onFinish = async (results: RegistrationResult) => {
    await apis.orders.update(order.id, {
      status: results.providerTxStatus || PURCHASE_RESULTS_STATUS.DONE,
      results,
    });
    onPurchaseFinish({
      results,
      isCheckout: true,
      setRegistration: (results: RegistrationResult) =>
        dispatch(setRegistration(results)),
      setProcessing: (isProcessing: boolean) =>
        dispatch(setProcessing(isProcessing)),
      fioActionExecuted: (data: FioActionExecuted) =>
        dispatch(fioActionExecuted(data)),
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
        !cartItem.hasCustomDomain
      )
        continue;

      privateDomainList[cartItem.domain] = false;
    }
    for (const domain of Object.keys(privateDomainList)) {
      const params = apis.fio.setTableRowsParams(domain);

      try {
        const rows = await apis.fio.getTableRows(params);

        if ((rows && rows.length && rows[0].is_public === 0) || !rows[0]) {
          privateDomainList[domain] = true;
        }
      } catch (e) {
        //
      }
    }

    const signTxItems = [];
    for (const cartItem of cartItems) {
      if (privateDomainList[cartItem.domain]) {
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
        });
      }
    }

    if (signTxItems.length) {
      return setBeforeSubmitProps({
        walletConfirmType: WALLET_CREATED_FROM.EDGE,
        fee: new MathOp(prices.nativeFio.address)
          .mul(1.25) // +25%
          .round(0, 2)
          .toNumber(), // todo: handle custom domains
        data: { fioAddressItems: signTxItems },
        onSuccess: (data: BeforeSubmitData) => {
          handleSubmit(data);
        },
        onCancel: () => setBeforeSubmitProps(null),
      });
    }

    return handleSubmit();
  };

  return {
    cartItems,
    walletBalancesAvailable,
    paymentWallet,
    paymentWalletPublicKey,
    roe,
    fioWallets,
    fioWalletsBalances,
    isProcessing,
    title,
    payment,
    paymentOption,
    paymentOptionError: orderError,
    isFree,
    beforeSubmitProps,
    beforePaymentSubmit,
    onClose,
    onFinish,
    setWallet,
    setProcessing: dispatchSetProcessing,
  };
};
