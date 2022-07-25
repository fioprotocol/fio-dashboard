import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import isEmpty from 'lodash/isEmpty';

import { refreshBalance, fioActionExecuted } from '../../redux/fio/actions';
import { setWallet, recalculate } from '../../redux/cart/actions';
import {
  setRegistration,
  setProcessing,
} from '../../redux/registrations/actions';

import {
  fioWallets as fioWalletsSelector,
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
import { totalCost, handleFreeAddressCart } from '../../utils';
import { useWalletBalances } from '../../util/hooks';
import { useEffectOnce } from '../../hooks/general';

import { ROUTES } from '../../constants/routes';
import {
  PAYMENT_OPTION_TITLE,
  PAYMENT_OPTIONS,
  PURCHASE_RESULTS_STATUS,
} from '../../constants/purchase';

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
  onClose: () => void;
  onFinish: (results: RegistrationResult) => void;
  setWallet: (walletPublicKey: string) => void;
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
  const isProcessing = useSelector(isProcessingSelector);
  const roe = useSelector(roeSelector);

  const dispatch = useDispatch();

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
      if (!paymentWalletPublicKey && fioWallets.length === 1) {
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
  ).lt(totalCost(cartItems, roe).costNativeFio);

  const title =
    isFree || !paymentOption
      ? 'Make Purchase'
      : PAYMENT_OPTION_TITLE[paymentOption];

  useEffect(() => {
    if (!isAuth) {
      history.push(ROUTES.FIO_ADDRESSES_SELECTION);
    }
  }, [isAuth, history]);

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
        recalculate: cartItems => dispatch(recalculate(cartItems)),
        cartItems: JSON.parse(cartItemsJson),
        prices,
        hasFreeAddress,
        roe,
      });
  }, [hasFreeAddress, prices, roe, isProcessing, cartItemsJson, dispatch]);

  const onClose = () => {
    history.push(ROUTES.CART);
  };

  const onFinish = (results: RegistrationResult) => {
    apis.orders.update(order.id, {
      status: results.providerTxStatus || PURCHASE_RESULTS_STATUS.DONE,
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
    onClose,
    onFinish,
    setWallet,
  };
};
