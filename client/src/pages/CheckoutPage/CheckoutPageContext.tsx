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
  isAuthenticated,
  hasFreeAddress as hasFreeAddressSelector,
} from '../../redux/profile/selectors';
import {
  prices as pricesSelector,
  isProcessing as isProcessingSelector,
  roe as roeSelector,
} from '../../redux/registrations/selectors';

import { onPurchaseFinish } from '../../util/purchase';
import { totalCost, handleFreeAddressCart } from '../../utils';
import { useWalletBalances } from '../../util/hooks';
import MathOp from '../../util/math';
import { useEffectOnce } from '../../hooks/general';

import { ROUTES } from '../../constants/routes';
import { PAYMENT_OPTION_TITLE } from '../../constants/purchase';

import { RegistrationResult, PaymentOptionsProps } from '../../types';

export const useContext = () => {
  const history = useHistory();
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

  useEffectOnce(() => {
    if (!isEmpty(fioWallets)) {
      for (const fioWallet of fioWallets) {
        if (fioWallet.publicKey) {
          refreshBalance(fioWallet.publicKey);
        }
      }
      if (!paymentWalletPublicKey && fioWallets.length === 1) {
        const sortedWallets = fioWallets.sort((a, b) => b.balance - a.balance);
        setWallet(sortedWallets[0].publicKey);
      }
    }
  }, []);

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
        new MathOp(walletBalancesAvailable.nativeFio).lt(
          totalCost(cartItems, roe).costNativeFio,
        )) ||
        (!paymentWalletPublicKey && fioWallets.length > 1))
    ) {
      history.push(ROUTES.CART);
    }
  }, [walletBalancesAvailable.nativeFio, paymentWalletPublicKey, loading]);

  useEffect(() => {
    !isProcessing &&
      handleFreeAddressCart({
        recalculate,
        cartItems,
        prices,
        hasFreeAddress,
        roe,
      });
  }, [hasFreeAddress, prices, roe]);

  const onClose = () => {
    history.push(ROUTES.CART);
  };

  const onFinish = (results: RegistrationResult) =>
    onPurchaseFinish({
      results,
      isCheckout: true,
      setRegistration,
      setProcessing,
      fioActionExecuted,
      history,
      dispatch,
    });

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
    paymentOption,
    onClose,
    onFinish,
    setWallet,
  };
};
