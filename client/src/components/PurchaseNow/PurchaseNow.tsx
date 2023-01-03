import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Ecc } from '@fioprotocol/fiojs';

import {
  ANALYTICS_EVENT_ACTIONS,
  CONFIRM_PIN_ACTIONS,
  REF_PROFILE_TYPE,
} from '../../constants/common';
import { PAYMENT_OPTIONS } from '../../constants/purchase';
import { emptyWallet } from '../../redux/fio/reducer';

import api from '../../api';

import { executeRegistration } from './middleware';
import {
  fireAnalyticsEvent,
  getCartItemsDataForAnalytics,
} from '../../util/analytics';
import { sleep } from '../../utils';
import { waitForEdgeAccountStop } from '../../util/edge';

import { PurchaseNowTypes } from './types';
import { RegistrationResult } from '../../types';

import classes from './PurchaseNow.module.scss';

const MIN_WAIT_TIME = 3000;

export const PurchaseNow: React.FC<PurchaseNowTypes> = props => {
  const {
    user,
    hasFreeAddress,
    cartItems,
    pinConfirmation,
    captchaResult,
    paymentWalletPublicKey,
    showPinModal,
    checkCaptcha,
    confirmingPin,
    captchaResolving,
    isProcessing,
    onFinish,
    setProcessing,
    resetPinConfirm,
    fioWallets,
    prices,
    refProfileInfo,
    disabled = false,
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
    results.paymentOption = PAYMENT_OPTIONS.FIO;
    setWaiting(false);
    waitFn(onFinish, results);
  };

  // registration
  useEffect(() => {
    const {
      account: edgeAccount,
      keys: walletKeys = {},
      error: confirmationError,
      action: confirmationAction,
    } = pinConfirmation;

    async function execRegistration(): Promise<void> {
      setProcessing(true);
      await waitForEdgeAccountStop(edgeAccount);
      let nonce = '';
      try {
        const response = await api.auth.nonce(user.username);
        nonce = response.nonce;
      } catch (e) {
        //
      }
      const results = await executeRegistration(
        cartItems,
        walletKeys[currentWallet.edgeId],
        prices.nativeFio,
        !hasFreeAddress,
        {
          walletSignature: Ecc.sign(
            nonce,
            walletKeys[currentWallet.edgeId].private,
          ),
          walletChallenge: nonce,
        },
        refProfileInfo != null && refProfileInfo?.type === REF_PROFILE_TYPE.REF
          ? refProfileInfo.code
          : '',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinConfirmation]); // We need run this hook only on pinConfirmation change

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
        return showPinModal(CONFIRM_PIN_ACTIONS.PURCHASE);
      }
    }
    checkCaptcha();
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
    </Button>
  );
};
