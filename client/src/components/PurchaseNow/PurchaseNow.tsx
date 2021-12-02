import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CONFIRM_PIN_ACTIONS } from '../../constants/common';

import classes from './PurchaseNow.module.scss';
import { executeRegistration } from './middleware';
import { sleep } from '../../utils';
import { waitForEdgeAccountStop } from '../../util/edge';

import { PurchaseNowTypes } from './types';
import { RegistrationResult } from '../../types';
import { emptyWallet } from '../../redux/fio/reducer';

const MIN_WAIT_TIME = 3000;

export const PurchaseNow: React.FC<PurchaseNowTypes> = props => {
  const {
    cartItems,
    pinConfirmation,
    captchaResult,
    paymentWalletPublicKey,
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
    refProfileInfo,
  } = props;

  const [isWaiting, setWaiting] = useState(false);
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
    setWaiting(false);
    waitFn(onFinish, results);
  };

  // registration
  useEffect(() => {
    const {
      account: edgeAccount,
      keys: walletKeys,
      error: confirmationError,
      action: confirmationAction,
    } = pinConfirmation;

    async function execRegistration() {
      setProcessing(true);
      await waitForEdgeAccountStop(edgeAccount);
      const results = await executeRegistration(
        cartItems,
        walletKeys[currentWallet.edgeId],
        prices.fioNative,
        { pin: walletKeys[currentWallet.edgeId].public }, // todo: change to other verification method
        refProfileInfo != null ? refProfileInfo.code : '',
      );

      onProcessingEnd(results);
    }

    if (confirmationAction !== CONFIRM_PIN_ACTIONS.PURCHASE) return;
    if (
      walletKeys &&
      walletKeys[currentWallet.edgeId] &&
      !isProcessing &&
      (isWaiting || !confirmationError)
    ) {
      execRegistration();
    }
    if (walletKeys && Object.keys(walletKeys).length) resetPinConfirm();

    if (confirmationError) setWaiting(false);
  }, [pinConfirmation]);

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
        prices.fioNative,
        verifyParams,
        refProfileInfo != null ? refProfileInfo.code : '',
      );

      onProcessingEnd(results);
    }

    if (success && isWaiting) execRegistration();

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
