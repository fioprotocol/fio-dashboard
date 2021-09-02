import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CONFIRM_PIN_ACTIONS } from '../../constants/common';

import classes from './PurchaseNow.module.scss';
import { executeRegistration } from './middleware';
import { sleep, waitForEdgeAccountStop } from '../../utils';

const MIN_WAIT_TIME = 3000;

export const PurchaseNow = props => {
  const {
    cartItems,
    pinConfirmation,
    captchaResult,
    paymentWalletId,
    showPinModal,
    checkCaptcha,
    loadProfile,
    confirmingPin,
    captchaResolving,
    isProcessing,
    onFinish,
    setProcessing,
    resetPinConfirm,
    isRetry,
    fioWallets,
    prices,
  } = props;

  const [isWaiting, setWaiting] = useState(false);
  const t0 = performance.now();

  const waitFn = async (fn, results) => {
    const t1 = performance.now();

    if (t1 - t0 < MIN_WAIT_TIME) {
      await sleep(MIN_WAIT_TIME - (t1 - t0));
    }
    fn(results);
  };

  const loading = confirmingPin || captchaResolving;

  const currentWallet =
    (paymentWalletId &&
      fioWallets &&
      fioWallets.find(item => item.id === paymentWalletId)) ||
    {};

  const onProcessingEnd = results => {
    for (const registered of results.registered) {
      if (registered.isFree) {
        loadProfile();
        break;
      }
    }
    setWaiting(false);
    waitFn(onFinish, results);
  };

  // registration
  useEffect(async () => {
    const {
      account: edgeAccount,
      keys: walletKeys,
      error: confirmationError,
      action: confirmationAction,
    } = pinConfirmation;

    if (confirmationAction !== CONFIRM_PIN_ACTIONS.PURCHASE) return;
    if (
      walletKeys &&
      walletKeys[currentWallet.id] &&
      !isProcessing &&
      (isWaiting || !confirmationError)
    ) {
      setProcessing(true);
      await waitForEdgeAccountStop(edgeAccount);
      const results = await executeRegistration(
        cartItems,
        walletKeys[currentWallet.id],
        prices.fioNative,
        { pin: walletKeys[currentWallet.id].public }, // todo: change to other verification method
      );

      onProcessingEnd(results);
    }
    if (walletKeys && Object.keys(walletKeys).length) resetPinConfirm();

    if (confirmationError) setWaiting(false);
  }, [pinConfirmation]);

  useEffect(async () => {
    const { success, verifyParams } = captchaResult;

    if (success && isWaiting) {
      setProcessing(true);
      const results = await executeRegistration(
        cartItems,
        {
          public: currentWallet.publicKey,
        },
        prices.fioNative,
        verifyParams,
      );

      onProcessingEnd(results);
    }

    if (success === false) setWaiting(false);
  }, [captchaResult]);

  const purchase = () => {
    setWaiting(true);
    for (const item of cartItems) {
      if (item.costFio) {
        return showPinModal(CONFIRM_PIN_ACTIONS.PURCHASE);
      }
    }
    checkCaptcha();
  };

  return (
    <Button onClick={purchase} className={classes.button} disabled={loading}>
      {isWaiting && loading ? (
        <FontAwesomeIcon icon="spinner" spin />
      ) : isRetry ? (
        'Try Again'
      ) : (
        'Purchase Now'
      )}
    </Button>
  );
};
