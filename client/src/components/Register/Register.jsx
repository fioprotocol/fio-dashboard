import React, { useEffect, useState } from 'react';
import { executeRegistration } from './middleware';

export const Register = props => {
  const {
    cartItems,
    pinConfirmation,
    captchaResult,
    paymentWallet,
    showPinModal,
    checkCaptcha,
    recordFreeAddress,
    confirmingPin,
    captchaResolving,
  } = props;
  const [isWaiting, setWaiting] = useState(false);

  const loading = confirmingPin || captchaResolving;

  // registration
  useEffect(async () => {
    const { keys, error } = pinConfirmation;
    if (keys && keys[paymentWallet.id] && isWaiting) {
      const results = await executeRegistration(
        cartItems,
        keys[paymentWallet.id],
      );
      // todo: handle results
      for (const item of results.registered) {
        //
      }
      for (const item of results.errors) {
        //
      }

      setWaiting(false);
    }

    if (error) setWaiting(false);
  }, [pinConfirmation]);

  useEffect(async () => {
    const { success, verifyParams } = captchaResult;

    if (success && isWaiting) {
      const results = await executeRegistration(
        cartItems,
        {
          public: paymentWallet.publicKey,
        },
        verifyParams,
      );
      // todo: handle results

      for (const item of results.registered) {
        recordFreeAddress(item.fioName);
      }

      setWaiting(false);
    }

    if (success === false) setWaiting(false);
  }, [captchaResult]);

  const purchase = () => {
    setWaiting(true);
    for (const item of cartItems) {
      if (item.costFio) {
        return showPinModal();
      }
    }
    checkCaptcha();
  };

  return (
    <button type="submit" onClick={purchase} disabled={loading}>
      Purchase Now
    </button>
  );
};
