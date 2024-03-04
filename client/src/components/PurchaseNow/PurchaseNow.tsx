import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import WalletAction from '../WalletAction/WalletAction';
import PurchaseEdgeWallet from './components/PurchaseEdgeWallet';
import LedgerWalletActionNotSupported from '../LedgerWalletActionNotSupported';
import SubmitButton from '../common/SubmitButton/SubmitButton';
import { PurchaseMetamaskWallet } from './components/PurchaseMetamaskWallet';

import { setProcessing } from '../../redux/registrations/actions';
import { showGenericErrorModal } from '../../redux/modal/actions';

import {
  cartItems as cartItemsSelector,
  paymentWalletPublicKey as paymentWalletPublicKeySelector,
} from '../../redux/cart/selectors';
import {
  prices as pricesSelector,
  isProcessing as isProcessingSelector,
} from '../../redux/registrations/selectors';
import { fioWallets as fioWalletsSelector } from '../../redux/fio/selectors';
import { refProfileInfo as refProfileInfoSelector } from '../../redux/refProfile/selectors';

import {
  ANALYTICS_EVENT_ACTIONS,
  CONFIRM_PIN_ACTIONS,
} from '../../constants/common';
import {
  PAYMENT_OPTIONS,
  PAYMENT_PROVIDER,
  PURCHASE_RESULTS_STATUS,
} from '../../constants/purchase';
import { emptyWallet } from '../../redux/fio/reducer';

import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../util/analytics';
import { sleep } from '../../utils';
import { cartHasOnlyFreeItems } from '../../util/cart';
import api from '../../api';
import {
  GEETESET_SCRIPT_LOADING_ERROR,
  initCaptcha,
  verifyCaptcha,
} from '../../helpers/captcha';
import { log } from '../../util/general';

// Loads captcha files, DO NOT REMOVE
import '../../helpers/gt-sdk';

import { PurchaseValues, PurchaseNowTypes } from './types';
import { RegistrationResult } from '../../types';

const MIN_WAIT_TIME = 3000;

type CaptchaResult = { success: boolean; verifyParams: {} };

export const PurchaseNow: React.FC<PurchaseNowTypes> = props => {
  const { onFinish, disabled = false } = props;

  const cartItems = useSelector(cartItemsSelector);
  const fioWallets = useSelector(fioWalletsSelector);
  const isProcessing = useSelector(isProcessingSelector);
  const paymentWalletPublicKey = useSelector(paymentWalletPublicKeySelector);
  const prices = useSelector(pricesSelector);
  const refProfileInfo = useSelector(refProfileInfoSelector);

  const [isWaiting, setWaiting] = useState(false);
  const [submitData, setSubmitData] = useState<PurchaseValues | null>(null);
  const t0 = performance.now();
  const [captchaResolving, toggleCaptchaResolving] = useState<boolean>(false);
  const [captchaResult, setCaptchaResult] = useState<CaptchaResult | null>(
    null,
  );

  const dispatch = useDispatch();

  const setProcessingDispatched = useCallback(
    (isSetProcessing: boolean) => {
      dispatch(setProcessing(isSetProcessing));
    },
    [dispatch],
  );

  const waitFn = useCallback(
    async (
      fn: (results: RegistrationResult) => void,
      results: RegistrationResult,
    ) => {
      const t1 = performance.now();

      if (t1 - t0 < MIN_WAIT_TIME) {
        await sleep(MIN_WAIT_TIME - (t1 - t0));
      }
      fn(results);
    },
    [t0],
  );

  const currentWallet = (paymentWalletPublicKey &&
    fioWallets &&
    fioWallets.find(item => item.publicKey === paymentWalletPublicKey)) || {
    ...emptyWallet,
  };

  const checkCaptcha = useCallback(async () => {
    try {
      toggleCaptchaResolving(true);

      const data = await api.fioReg.initCaptcha();
      const captchaObj = await initCaptcha(data);
      const verifyCaptchaResult = await verifyCaptcha(captchaObj);

      setCaptchaResult(verifyCaptchaResult);
    } catch (error) {
      log.error('Check Captcha error', error);

      if (error === GEETESET_SCRIPT_LOADING_ERROR) {
        const message =
          'Cannot load captcha. If you are using incognito mode in the browser, please check permissions and enable loading third-party scripts. And try again.';
        const title = 'Captcha load fail';
        const buttonText = 'Close';

        dispatch(showGenericErrorModal(message, title, buttonText));
      } else if (typeof error === 'undefined' || error === 'undefined') {
        log.info('Skip captcha error');
      } else {
        dispatch(showGenericErrorModal());
      }
    } finally {
      toggleCaptchaResolving(false);
      setWaiting(false);
    }
  }, [dispatch]);

  const onProcessingEnd = useCallback(
    (results: RegistrationResult) => {
      results.paymentOption = PAYMENT_OPTIONS.FIO;
      setWaiting(false);
      setSubmitData(null);
      waitFn(onFinish, results);
    },
    [onFinish, waitFn],
  );

  const execRegistration = useCallback(() => {
    setProcessingDispatched(true);
    onProcessingEnd({
      errors: [],
      registered: [],
      partial: [],
      paymentProvider: PAYMENT_PROVIDER.FIO,
      providerTxStatus: PURCHASE_RESULTS_STATUS.PAYMENT_PENDING,
    });
  }, [setProcessingDispatched, onProcessingEnd]);

  useEffect(() => {
    if (captchaResult) {
      const { success } = captchaResult;

      if (success && isWaiting) execRegistration();

      if (success === false) setWaiting(false);
    }
  }, [captchaResult, isWaiting, execRegistration, onProcessingEnd]);

  const purchase = () => {
    fireAnalyticsEvent(
      ANALYTICS_EVENT_ACTIONS.PURCHASE_STARTED,
      getCartItemsDataForAnalytics(cartItems),
    );
    setWaiting(true);
    const cartHasFreeItemsOnly = cartHasOnlyFreeItems(cartItems);

    if (cartHasFreeItemsOnly) {
      checkCaptcha();
      return;
    }

    setSubmitData({
      cartItems,
      prices,
      refProfileInfo,
    });
    return;
  };

  const onCancel = () => {
    setSubmitData(null);
    setWaiting(false);
    setProcessingDispatched(false);
  };

  return (
    <>
      <WalletAction
        fioWallet={currentWallet}
        onCancel={onCancel}
        onSuccess={onProcessingEnd}
        submitData={submitData}
        processing={isProcessing}
        setProcessing={setProcessingDispatched}
        action={CONFIRM_PIN_ACTIONS.PURCHASE}
        FioActionWallet={PurchaseEdgeWallet}
        LedgerActionWallet={LedgerWalletActionNotSupported}
        MetamaskActionWallet={PurchaseMetamaskWallet}
      />
      <SubmitButton
        onClick={purchase}
        disabled={captchaResolving || disabled}
        loading={isWaiting || captchaResolving}
        text="Purchase Now"
      />
    </>
  );
};
