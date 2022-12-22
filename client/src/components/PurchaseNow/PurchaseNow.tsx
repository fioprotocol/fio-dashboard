import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import WalletAction from '../WalletAction/WalletAction';
import PurchaseEdgeWallet from './components/PurchaseEdgeWallet';
import PurchaseLedgerWallet from './components/PurchaseLedgerWallet';

import {
  ANALYTICS_EVENT_ACTIONS,
  CONFIRM_PIN_ACTIONS,
  REF_PROFILE_TYPE,
} from '../../constants/common';
import { PAYMENT_OPTIONS } from '../../constants/purchase';
import { emptyWallet } from '../../redux/fio/reducer';

import { executeRegistration } from './middleware';
import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../util/analytics';
import { sleep } from '../../utils';

import { PurchaseValues, PurchaseNowTypes } from './types';
import { RegistrationResult } from '../../types';

import classes from './PurchaseNow.module.scss';

const MIN_WAIT_TIME = 3000;

export const PurchaseNow: React.FC<PurchaseNowTypes> = props => {
  const {
    hasFreeAddress,
    cartItems,
    captchaResult,
    paymentWalletPublicKey,
    checkCaptcha,
    loadProfile,
    confirmingPin,
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

  const loading = confirmingPin || captchaResolving;

  const currentWallet = (paymentWalletPublicKey &&
    fioWallets &&
    fioWallets.find(item => item.publicKey === paymentWalletPublicKey)) || {
    ...emptyWallet,
  };

  const onProcessingEnd = (results: RegistrationResult) => {
    for (const registered of results.registered) {
      if (registered.isFree) {
        loadProfile();
        break;
      }
    }
    results.paymentOption = PAYMENT_OPTIONS.FIO;
    setWaiting(false);
    setSubmitData(null);
    waitFn(onFinish, results);
  };

  useEffect(() => {
    const { success, verifyParams } = captchaResult;

    async function execRegistration() {
      setProcessing(true);
      const results = await executeRegistration(
        cartItems,
        {
          public: currentWallet.publicKey,
          private: '',
        },
        prices.nativeFio,
        !hasFreeAddress,
        verifyParams,
        refProfileInfo != null && refProfileInfo?.type === REF_PROFILE_TYPE.REF
          ? refProfileInfo.code
          : '',
      );

      onProcessingEnd(results);
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
      if (item.costNativeFio || hasFreeAddress) {
        setSubmitData({
          cartItems,
          prices,
          refProfileInfo,
          isFreeAllowed: !hasFreeAddress,
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
    <Button
      onClick={purchase}
      className={classes.button}
      disabled={loading || disabled}
    >
      {isWaiting && loading ? (
        <FontAwesomeIcon icon="spinner" spin />
      ) : (
        'Purchase Now'
      )}
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
    </Button>
  );
};
