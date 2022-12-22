import React, { useEffect, useState } from 'react';

import WalletAction from '../WalletAction/WalletAction';
import SubmitButton from '../common/SubmitButton/SubmitButton';

import PurchaseEdgeWallet from './components/PurchaseEdgeWallet';
import PurchaseLedgerWallet from './components/PurchaseLedgerWallet';

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
import { DOMAIN_TYPE } from '../../constants/fio';

import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../util/analytics';
import { sleep } from '../../utils';

import { PurchaseValues, PurchaseNowTypes } from './types';
import { RegistrationResult } from '../../types';

const MIN_WAIT_TIME = 3000;

export const PurchaseNow: React.FC<PurchaseNowTypes> = props => {
  const {
    hasFreeAddress,
    cartItems,
    captchaResult,
    paymentWalletPublicKey,
    checkCaptcha,
    captchaResolving,
    isProcessing,
    onFinish,
    setProcessing,
    fioWallets,
    prices,
    refProfileInfo,
    disabled = false,
  } = props;

  const [isWaiting, setWaiting] = useState(false);
  const [submitData, setSubmitData] = useState<PurchaseValues | null>(null);
  const t0 = performance.now();

  const waitFn = async (
    fn: (results: RegistrationResult) => void,
    results: RegistrationResult,
  ) => {
    const t1 = performance.now();

    if (t1 - t0 < MIN_WAIT_TIME) {
      await sleep(MIN_WAIT_TIME - (t1 - t0));
    }
    fn(results);
  };

  const loading = captchaResolving;

  const currentWallet = (paymentWalletPublicKey &&
    fioWallets &&
    fioWallets.find(item => item.publicKey === paymentWalletPublicKey)) || {
    ...emptyWallet,
  };

  const onProcessingEnd = (results: RegistrationResult) => {
    results.paymentOption = PAYMENT_OPTIONS.FIO;
    setWaiting(false);
    setSubmitData(null);
    waitFn(onFinish, results);
  };

  useEffect(() => {
    const { success } = captchaResult;

    async function execRegistration() {
      setProcessing(true);

      onProcessingEnd({
        errors: [],
        registered: [],
        partial: [],
        paymentProvider: PAYMENT_PROVIDER.FIO,
        providerTxStatus: PURCHASE_RESULTS_STATUS.PAYMENT_PENDING,
      });
    }

    if (success && isWaiting) execRegistration();

    if (success === false) setWaiting(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captchaResult]); // We need run this hook only on captchaResults change

  const purchase = () => {
    fireAnalyticsEvent(
      ANALYTICS_EVENT_ACTIONS.PURCHASE_STARTED,
      getCartItemsDataForAnalytics(cartItems),
    );
    setWaiting(true);
    for (const item of cartItems) {
      if (
        (item.costNativeFio && item.domainType !== DOMAIN_TYPE.FREE) ||
        (hasFreeAddress && item.domainType !== DOMAIN_TYPE.PRIVATE)
      ) {
        setSubmitData({
          cartItems,
          prices,
          refProfileInfo,
          isFreeAllowed:
            !hasFreeAddress ||
            cartItems.some(
              cartItem => cartItem.domainType === DOMAIN_TYPE.PRIVATE,
            ),
        });
        return;
      }
    }
    checkCaptcha();
  };
  const onCancel = () => {
    setSubmitData(null);
    setWaiting(false);
    setProcessing(false);
  };

  return (
    <>
      <WalletAction
        fioWallet={currentWallet}
        onCancel={onCancel}
        onSuccess={onProcessingEnd}
        submitData={submitData}
        processing={isProcessing}
        setProcessing={setProcessing}
        action={CONFIRM_PIN_ACTIONS.PURCHASE}
        FioActionWallet={PurchaseEdgeWallet}
        LedgerActionWallet={PurchaseLedgerWallet}
      />
      <SubmitButton
        onClick={purchase}
        disabled={loading || disabled}
        loading={isWaiting || loading}
        text="Purchase Now"
      />
    </>
  );
};
